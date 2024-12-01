import axios from 'axios';
import { apiEndPoint } from '../Config/api';

export const postCreateCourse = async (data) => {
	return await axios.post(`${apiEndPoint}/course`, data);
};

export const postTrainModel = async (stuId, body) => {
	return await axios.post(`${apiEndPoint}/trainModel/${stuId}`, body);
};

export const getCourses = async (teacherId) => {
	return await axios.get(`${apiEndPoint}/courses/${teacherId}`);
};

export const getStudentData = async (filter) => {
	return await axios.get(`${apiEndPoint}/students/${filter}`);
};

export const postMarkAttendence = async (teacherId, body) => {
	return await axios.post(`${apiEndPoint}/attendance/${teacherId}`, body);
};

export const postUserRegister = async (body) => {
	return await axios.post(`${apiEndPoint}/teacher`, body);
};

export const getUserLogin = async (body) => {
	return await axios.get(`${apiEndPoint}/teacher/${body.email}/${body.password}`, body);
};

export const getAttendenceCode = async (courseId) => {
	return await axios.get(`${apiEndPoint}/attendanceCode/${courseId}`);
};

export const deleteAttendenceCode = async (courseId) => {
	return await axios.delete(`${apiEndPoint}/attendanceCode/${courseId}`);
};
// Validate attendence code
export const postAttendenceCode = async (body) => {
	return await axios.post(`${apiEndPoint}/attendanceCode`, body);
};

export const getCourseAttendence = async (teacherId ,courseId) => {
	return await axios.get(`${apiEndPoint}/courseAttendance/${courseId}/${teacherId}`);
};

export const addStudent = async (data) => {
	return await axios.post(`${apiEndPoint}/student`, data);
};