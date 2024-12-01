import os

from flask import Flask, send_from_directory, jsonify
from flask_restful import Api
from flask_cors import CORS

import config.configDb
from resources.student import Student, Students
from resources.trainModel import TrainModel
from resources.user import User, Users
from resources.teacher import Teacher, Teachers
from resources.course import Course, Courses
from resources.attendance import Attendance, CoursesAttendance
from resources.attendanceCode import AttendanceCode

app = Flask(__name__)
CORS(app)
api = Api(app)

api.add_resource(TrainModel, '/trainModel', '/trainModel/<id>')

api.add_resource(User, '/user', '/user/<id>', '/user/<email>/<password>')
api.add_resource(Users, '/users', '/users/<id>')

api.add_resource(Student, '/student')
api.add_resource(Students, '/students', '/students/<filter>')

api.add_resource(Teacher, '/teacher', '/teacher/<id>', '/teacher/<email>/<password>')
api.add_resource(Teachers, '/teachers', '/teachers/<id>')

api.add_resource(Course, '/course', '/course/<id>')
api.add_resource(Courses, '/courses', '/courses/<teacher_id>')

api.add_resource(Attendance, '/attendance', '/attendance/<teacher_id>')
api.add_resource(CoursesAttendance, '/courseAttendance', '/courseAttendance/<course_id>/<teacher_id>')

api.add_resource(AttendanceCode, '/attendanceCode', '/attendanceCode/<id>')

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Endpoint to fetch an image by filename
@app.route('/get-image/<filename>', methods=['GET'])
def get_image(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except Exception as e:
        return jsonify({'error': str(e)}), 404

if __name__ == '__main__':
    app.run(debug=True)  # important to mention debug=True
