import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home'
import NewClass from './pages/NewClass'
import Sessions from './pages/Sessions'
// import MarkAttendence from './pages/MarkAttendence'
import MarkAttendence2 from './pages/MarkAttendence2'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar';
import './App.css'
import AddStudent from './pages/AddStudent';
import Header from './components/Header';
import StudentList from './pages/StudentList';
// import CameraCapture from './Component/CameraCapture';
// import Dashboard from './Component/Dashboard';

const App = () => {
    
    return (
        <div className="relative grid md:grid-cols-[22%,78%] grid-cols-1 w-full min-h-screen bg-bgLight">
            <Navbar />
            <div className="relative w-full h-full">
                <Header />
                <Routes>
                    {/* <Route path="/" element={<Dashboard />} />
                    <Route path="/camera" element={<CameraCapture />} /> */}
                    <Route path="/" element={<Home />} />
                    <Route path="/newclass" element={<NewClass />} />
                    <Route path="/sessions" element={<Sessions />} />
                    <Route path="/newstudent" element={<AddStudent />} />
                    <Route path="/studentlist" element={<StudentList visible={true} />} />
                    <Route path="/markattendence/:id" element={<MarkAttendence2 />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
