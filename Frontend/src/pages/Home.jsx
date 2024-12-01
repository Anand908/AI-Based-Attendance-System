import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCourses, getAttendenceCode, deleteAttendenceCode } from '../Api/Requests';
import { GiNotebook } from "react-icons/gi";
import { LuCopy } from "react-icons/lu";
import { DataContext } from '../Context/Context';
import { isEmptyObject } from '../utils/Utils';

const Home = () => {
	// States
	const [courses, setCourses] = useState([]);
	const {currentUser, setCurrentUser} = useContext(DataContext);
	const [generatedCode, setGeneratedCode] = useState('');
	const navigate = useNavigate();

	const loadCourses = async (currentUser) => {
		try {
			const { data } = await getCourses(currentUser._id);
			setCourses(data);
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	};

	const generateCode = async (courseId) => {
		try {
			let { data } = await getAttendenceCode(courseId);
			setGeneratedCode(data);
			console.log(generatedCode);
		} catch (error) {
			console.log(error);
		}
	}

	const handleCopy = (inputValue) => {
		// Select and copy text from the input field
		navigator.clipboard.writeText(inputValue).then(() => {
		  alert("Attendance code copied!");
		});
	};
	const deleteCode = async (courseId) => {
		try {
			await deleteAttendenceCode(courseId);
			setGeneratedCode('');
		} catch (error) {}
	}
	useEffect(() => {
		document.title = "Home - AI Attendance System"
		if (!isEmptyObject(currentUser)) {
			console.log("CurrentUser Home : ",currentUser)
			loadCourses(currentUser);
		} else {
			navigate('/login')
		}
		console.log("Home validate : ")
			
	}, []);
	return (
		<div className='relative w-full h-full md:pt-24 pb-24 pt-8 px-10' >
			<div className="w-full pr-4 mb-16 max-w-full flex-grow flex-auto">
				<span className="flex justify-center uppercase drop-shadow-tshadow text-tdclr hover:text-tdhclr mr-0 whitespace-no-wrap text-3xl font-bold px-0">
					Current classes
				</span>
				<span className="flex justify-center text-white mr-0 whitespace-no-wrap text-sm pt-2">
					Current courses will be showed here
				</span>
			</div>
			<div className="grid sm:grid-cols-2 grid-cols-1 gap-10">
				{courses.map((course, index) => (
					<div key={index} className="flex flex-col w-full h-fit p-8 gap-6 rounded-lg shadow-bOut border-bgDark ">
						<div className="grid grid-cols-[80%,20%] gap-5 justify-center">
							<div className="">
								<span className="mt-4 text-sm text-grey-500">{course.code}</span>
								<h5 className="text-white uppercase font-bold md:text-lg text-sm">
									{course.name}
								</h5>
								<span className="mt-4 text-sm text-grey-500">
									{course.numberOfStudents} Students
								</span>
							</div>
							<GiNotebook className='text-5xl w-full'/>
						</div>
						<div className="">
								{generatedCode.courseID === course._id ? 
								<div className="flex text-center flex-col gap-5 items-center px-8 justify-center">
									<span className="text-tdclr font-semibold">
										Attendence Code
									</span>
									<span className="text-tdclr font-light">
										Share the code with the className. Students should paste
										this code on the '/markattendence' page to to mark
										attendence.
									</span>
									<input
										type="text"
										readOnly
										className="form-input w-full text-center focus:border-tdhclr rounded"
										value={generatedCode.attendanceCode}
									/>

									<div onClick={()=>handleCopy(generatedCode.attendanceCode)} className="flex flex-col items-center p-4 rounded text-tdclr border border-tdclr cursor-pointer hover:text-tdhclr hover:border-tdhclr transition">
										<LuCopy className='text-3xl'/>
										<span className="mt-1 font-semibold">Copy Code</span>
									</div>
									<button
										className="flex flex-col items-center px-4 py-3 rounded-xl text-tdclr cursor-pointer bg-bgLight transition duration-300 hover:text-tdhclr shadow-inputOut hover:shadow-inputIn"
										onClick={() => deleteCode(course._id)}
									>
										<span className="font-semibold uppercase">End Session</span>
									</button>
								</div>
								: (
									<Link
										to={`/markattendence/${course._id}`}
										className="transition-shadow duration-200 bg-bgLight shadow-inputOut hover:shadow-inputIn border-none text-white hover:text-[aqua] uppercase rounded-xl p-2 px-4 font-bold text-base"
										// onClick={() => generateCode(course._id)}
									>
										Take Attendance
									</Link>
								)}
							</div>
						</div>
				))}
			</div>
		</div>
	);
}
export default Home;
