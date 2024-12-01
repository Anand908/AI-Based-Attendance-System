import os

from flask_restful import Resource
from flask import request, jsonify, make_response

from config.configDb import mydb
import traceback
from bson import json_util, ObjectId
import json
import jwt

studentCol = mydb['student']  # creating collection

# Directory to save uploaded files
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

class Student(Resource):
    @staticmethod
    def post():
        student = studentCol.find_one({"stuId": request.form.get("stuId")})
        if student is None:
            try:
                # Check if the request contains a file
                if 'image' not in request.files:
                    return jsonify({'error': 'No image file provided'}), 400

                file = request.files['image']
                if file.filename == '':
                    return jsonify({'error': 'No file selected'}), 400

                # Save the image file
                _, file_extension = os.path.splitext(file.filename)
                file_path = os.path.join(UPLOAD_FOLDER,f"{request.form.get('stuId')}{file_extension}")
                file.save(file_path)

                # Store other student data
                data = request.form.to_dict()
                data['image_path'] = f"{request.form.get('stuId')}{file_extension}" # Save the image path

                # You can add code here to insert `data` into MongoDB
                student_id = studentCol.insert_one(data).inserted_id
                res = studentCol.find_one({"_id": student_id})
                # For now, return a success response with the data
                res = json.loads(json_util.dumps(res))  # convert response to json
                res['_id'] = res['_id']['$oid']
                return res, 201
                # return {'message': 'Student added successfully', 'data': res}, 201

            except Exception as e:
                print(traceback.format_exc())
                return jsonify({"error": str(e)}), 500

        # response = jsonify({'error': 'This Student ID is already registered'})
        # return make_response(response, 400)
        return {'error': 'This Student ID is already registered'}, 202

class Students(Resource):
    @staticmethod
    def get(filter):
        try:
            students = None
            if filter == 'all' :
                students = studentCol.find()  # get all teachers
            else:
                pass
            students = json.loads(json_util.dumps(students))  # convert response to json

            for student in students:
                student['_id'] = student['_id']['$oid']

            return students

        except Exception:
            return traceback.format_exc()