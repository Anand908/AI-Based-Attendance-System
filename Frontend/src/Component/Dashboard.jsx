import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold underline">AI-Based Attendance System</h1>
            <Link to="/camera">Capture Attendance</Link>
        </div>
    );
};

export default Dashboard;
