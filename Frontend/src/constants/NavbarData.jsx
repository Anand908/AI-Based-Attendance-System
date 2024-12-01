import React from 'react';
import { IoHome, IoCloudUploadOutline, IoCheckmarkCircleOutline, IoPersonAddSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { SiSession } from "react-icons/si";
import { TbLogin } from "react-icons/tb";
import { PiStudentBold } from "react-icons/pi";

export const NavbarDataTeacher = [
	{
		title: 'Home',
		path: '/',
		Icon: IoHome,
	},
	{
		title: 'New Class',
		path: '/newclass',
		Icon: FaPlus,
	},
	{
		title: 'Sessions',
		path: '/sessions',
		Icon: SiSession,
	},
	{
		title: 'Add Student',
		path: '/newstudent',
		Icon: IoPersonAddSharp,
	},
	{
		title: 'Students List',
		path: '/studentlist',
		Icon: PiStudentBold,
	},
];

export const NavbarDataStudent = [
	{
		title: 'Log In',
		path: '/login',
		Icon: TbLogin,
	},
	{
		title: 'Register',
		path: '/register',
		Icon: IoCloudUploadOutline,
	},
	{
		title: 'Mark Attendence',
		path: '/markattendence',
		Icon: IoCheckmarkCircleOutline,
	},
];
