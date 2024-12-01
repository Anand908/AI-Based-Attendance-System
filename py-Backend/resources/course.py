from flask_restful import Resource
from flask import request
from config.configDb import mydb
import traceback
from bson import json_util, ObjectId
import json

courseCol = mydb['course']  # creating collection
teacherCol = mydb['teacher']  # creating collection
stuCourseCol = mydb['stuCourse']  # creating collection


class Course(Resource):
    @staticmethod
    def post():
        try:
            data = request.json
            print("Data : ",data)
            course_dic = {
                "code": data["code"],
                "name": data["name"],
                "numberOfStudents": data["noStu"],
                "teacherId": ObjectId(data["teacherId"]),
            }

            # Verify Teacher id
            teacher = teacherCol.find_one({"_id": ObjectId(data["teacherId"])})
            if teacher is None:
                raise Exception("Teacher ID is invalid")

            # find course to verify course with the same name and teacherId already exists or not
            course = courseCol.find_one({"code": data["code"], "teacherId": ObjectId(data["teacherId"])})

            # if course not exists
            if course is None:
                course_id = courseCol.insert_one(course_dic).inserted_id
                res = courseCol.find_one({"_id": course_id})

                for d in data["students"]:
                    stuCourseCol.insert_one({"classId":res['_id'], "StudentId": d})

                res = json.loads(json_util.dumps(res))  # convert response to json
                res['_id'] = res['_id']['$oid']
                res['teacherId'] = res['teacherId']['$oid']

                return res

            raise Exception("This name with this course is already Registered")

        except Exception:
            print(traceback.format_exc())
            return traceback.format_exc(), 500

    @staticmethod
    def get(id):
        try:

            course = courseCol.find_one({"_id": ObjectId(id)})

            if course is None:
                raise Exception("Course ID is invalid")

            course = json.loads(json_util.dumps(course))  # convert response to json
            course["_id"] = course["_id"]["$oid"]
            course["teacherId"] = course["teacherId"]["$oid"]

            return course

        except Exception:
            return traceback.format_exc()


    @staticmethod
    def delete(id):

        try:
            # find teacher by email.
            course = courseCol.find_one({"_id": ObjectId(id)})

            if course is None:
               raise Exception("Course ID is invalid")

            course = courseCol.delete_one({"_id": ObjectId(id)})

            return course.deleted_count

        except Exception:
            return traceback.format_exc()


class Courses(Resource):

    @staticmethod
    def get():
        try:
            courses = courseCol.find()  # get all courses
            courses = json.loads(json_util.dumps(courses))  # convert response to json

            for course in courses:
                course['_id'] = course['_id']['$oid']
                course["teacherId"] = course["teacherId"]["$oid"]

            return courses

        except Exception:
            return traceback.format_exc()

    @staticmethod
    def get(teacher_id):
        try:
            courses = courseCol.find({"teacherId": ObjectId(teacher_id)})  # get all courses
            courses = json.loads(json_util.dumps(courses))  # convert response to json

            for course in courses:
                course['_id'] = course['_id']['$oid']
                course["teacherId"] = course["teacherId"]["$oid"]

            return courses

        except Exception:
            traceback.format_exc()