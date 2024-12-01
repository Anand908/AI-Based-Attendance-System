from flask_restful import Resource
from flask import request, Response
from config.configDb import mydb
import traceback
from bson import json_util, ObjectId
import json
import datetime
import cv2
import numpy as np
import face_recognition
import os
import io
import pickle
import csv

attendanceCol = mydb['attendance']  # creating collection
courseCol = mydb['course']  # creating collection
stuCourseCol = mydb['stuCourse']  # creating collection
teacherCol = mydb['teacher']  # creating collection
studentCol = mydb['student']  # creating collection
model_col = mydb["model"]  # creating collection to save trained model


class Attendance(Resource):

    @staticmethod
    def post(teacher_id):
        # , course_id, lecture_number
        try:
            # Convert inputs to appropriate types
            course_id = ObjectId(request.form.get('classId'))
            today_date = str(datetime.date.today())
            teacher_id = ObjectId(teacher_id)
            print("Data : ",request.form)
            # Retrieve the course details
            course = courseCol.find_one({"_id": course_id})
            if course is None:
                raise Exception("Invalid Course ID")

            # Validate the teacher's association with the course (if applicable)
            # Example check: Uncomment if teacher validation is required
            if course["teacherId"] != teacher_id:
                raise Exception("Teacher not authorized for this course")

            # Retrieve all students enrolled in the course
            student_records = stuCourseCol.find({"classId": course_id})
            if not student_records:
                raise Exception("No students enrolled in this course")

            # Get the list of student IDs
            student_ids = [record["StudentId"] for record in student_records]

            # Retrieve pre-trained models for these students
            trained_models = model_col.find({"stuId": {"$in": student_ids}})
            if not trained_models:
                raise Exception("No trained models found for this course")

            # Map student IDs to their face encodings
            student_models = {model["stuId"]: pickle.loads(model["model"]) for model in trained_models}

            # Process the uploaded group image
            files = request.files
            if len(files) == 0:
                raise Exception("No image file uploaded")

            # Prepare image for face recognition
            all_faces_encodings = []
            for name, image in files.items():
                in_memory_file = io.BytesIO()
                image.save(in_memory_file)
                image = np.fromstring(in_memory_file.getvalue(), dtype=np.uint8)
                color_image_flag = 1
                image = cv2.imdecode(image, color_image_flag)
                image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

                # Extract face encodings from the image
                face_encodings = face_recognition.face_encodings(image)
                if len(face_encodings) == 0:
                    raise Exception("No faces detected in the image")

                all_faces_encodings.extend(face_encodings)

            # Compare each detected face with the pre-trained models
            present_students = set()
            for face_encoding in all_faces_encodings:
                for student_id, encodings in student_models.items():
                    matches = face_recognition.compare_faces(encodings, face_encoding)
                    if True in matches:
                        present_students.add(student_id)
                        break

            # Mark attendance
            all_student_ids = set(student_ids)
            absent_students = all_student_ids - present_students

            attendance_data = {
                "teacherId": teacher_id,
                "courseId": course_id,
                "lectureNumber": request.form.get('lectureNo'),
                "date": today_date,
                "attendance": {
                    "present": list(present_students),
                    "absent": list(absent_students)
                }
            }

            # Insert attendance into the database
            attendance_id = attendanceCol.insert_one(attendance_data).inserted_id
            attendance_id = json.loads(json_util.dumps(attendance_id))
            attendance_id['_id'] = attendance_id['$oid']

            return {"attendanceId": attendance_id['_id'], "message": "Attendance marked successfully"}

        except Exception as e:
            return {"error": str(e), "traceback": traceback.format_exc()}

    @staticmethod
    def get(date, course_id):
        try:

            attendance = attendanceCol.find_one({"date": date, "courseId": ObjectId(course_id)})

            if attendance is None:
                return 'Date or Course id is invalid'

            attendance = json.loads(json_util.dumps(attendance))  # convert response to json
            attendance["_id"] = attendance["_id"]["$oid"]
            attendance["courseId"] = attendance["courseId"]["$oid"]

            return attendance

        except Exception:
            return 'Course Not Found'

    @staticmethod
    def delete(date, course_id):

        try:
            # find teacher by email.
            attendance = attendanceCol.find_one({"date": date, "courseId": ObjectId(course_id)})

            if attendance is None:
                return 'Attendance not found'

            attendance = attendanceCol.delete_one({"date": date, "courseId": ObjectId(course_id)})

            return attendance.deleted_count

        except Exception:
            return traceback.format_exc()


class CoursesAttendance(Resource):

    @staticmethod
    def get(course_id, teacher_id):
        try:
            # Authenticate teacher
            course = attendanceCol.find_one({"courseId": ObjectId(course_id), "teacherId": ObjectId(teacher_id)})
            if not course:
                raise Exception("Invalid course or unauthorized teacher")

            # Fetch course and teacher details
            course = courseCol.find_one({"_id": ObjectId(course_id)})
            course_name = course.get("name", "Unknown Class Name")
            course_code = course.get("code", "Unknown Code")

            teacher = teacherCol.find_one({"_id": ObjectId(teacher_id)})
            teacher_name = teacher.get("fullName", "Unknown Teacher")

            # Fetch student-course associations
            student_course_data = stuCourseCol.find({"classId": ObjectId(course_id)})
            student_ids = [str(sc.get("StudentId")) for sc in student_course_data]

            # Fetch student details
            student_data = studentCol.find({"stuId": {"$in": [sid for sid in student_ids]}})
            student_map = {
                str(student["stuId"]): {
                    "name": student.get("name", "Unknown Student"),
                    "rollNo": student.get("rollNo", "Unknown RollNo"),
                }
                for student in student_data
            }

            # Fetch attendance data
            attendance_data = attendanceCol.find({"courseId": ObjectId(course_id)})
            attendance_data = list(attendance_data)

            # Compute attendance percentage for each student
            total_classes = len(attendance_data)
            student_attendance = {sid: {"present": 0, "total": total_classes} for sid in student_ids}

            # Collect attendance for each date/lecture
            lecture_headers = []
            attendance_by_lecture = {}

            for record in attendance_data:
                date = record.get("date", "Unknown Date")
                lecture_number = record.get("lectureNumber", "Unknown Lecture")
                lecture_headers.append(f"{date} / {lecture_number}")

                present_students = record["attendance"].get("present", [])
                absent_students = record["attendance"].get("absent", [])

                attendance_by_lecture[f"{date} / {lecture_number}"] = {
                    "present": present_students,
                    "absent": absent_students,
                }

                for sid in present_students:
                    if sid in student_attendance:
                        student_attendance[sid]["present"] += 1

            # Prepare CSV data
            rows = []
            header = [f"{course_code} {course_name} Teacher: {teacher_name}"]
            rows.append(header)

            # Add column headers
            column_headers = ["Student ID", "Roll No", "Student Name", "Attendance %"] + lecture_headers
            rows.append(column_headers)

            # Add student data
            for sid in student_ids:
                student_info = student_map.get(sid, {})
                name = student_info.get("name", "Unknown")
                roll_no = student_info.get("rollNo", "Unknown")
                percentage = (student_attendance[sid]["present"] / student_attendance[sid]["total"]) * 100

                student_row = [sid, roll_no, name, f"{percentage:.2f}%"]
                for lecture in lecture_headers:
                    if sid in attendance_by_lecture[lecture]["present"]:
                        student_row.append("Present")
                    else:
                        student_row.append("Absent")

                rows.append(student_row)

            # Write CSV to a buffer
            import io
            output = io.StringIO()
            writer = csv.writer(output)
            writer.writerows(rows)
            csv_content = output.getvalue()
            output.close()

            # Return CSV as response
            return Response(
                csv_content,
                mimetype="text/csv",
                headers={"Content-disposition": "attachment; filename=attendance_data.csv"}
            )

        except Exception as e:
            return traceback.format_exc()

    # @staticmethod
    # def put(course_id):
    #     try:
    #         data = request.json
    #         date = str(datetime.date.today())
    #
    #         # Verify Course id
    #         course = courseCol.find_one({"_id": ObjectId(course_id)})
    #         if course is None:
    #             return "Course ID is invalid"
    #
    #         old_attendance = attendanceCol.find({"courseId": ObjectId(course_id), "date": date})
    #
    #         attendance_dic = {
    #             "date": str(datetime.date.today()),
    #             "attendance": data["attendance"],
    #             "courseId": ObjectId(data["courseId"]),
    #         }
    #
    #         attendance_id = attendanceCol.insert_one(attendance_dic).inserted_id
    #         res = attendanceCol.find_one({"_id": attendance_id})
    #
    #         res = json.loads(json_util.dumps(res))  # convert response to json
    #         res['_id'] = res['_id']['$oid']
    #         res['courseId'] = res['courseId']['$oid']
    #
    #         return res
    #
    #     except Exception:
    #         return traceback.format_exc()


