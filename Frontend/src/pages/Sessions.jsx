import React, { useState, useEffect, useContext } from 'react';
import Table from '../components/Table.jsx';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { getCourses, getAttendenceCode, deleteAttendenceCode } from '../Api/Requests.jsx';
import { DataContext } from '../Context/Context.jsx';
import { isEmptyObject } from '../utils/Utils.jsx';

const Sessions = () => {
	const [courses, setCourses] = useState([]);
	const {currentUser} = useContext(DataContext);
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
	useEffect(() => {
		document.title = "Session - AI Attendance System"
		if (!isEmptyObject(currentUser)) {
			loadCourses(currentUser);
		} else {
			navigate(`/login`)
		}
	}, []);

	return (
		<div className="relative my-24 mx-12">
			{/* Card */}
			<div className='bg-bgLight py-10 rounded-2xl shadow-bOut'>
				<div className="flex flex-wrap justify-center items-center">
					<span className="drop-shadow-tshadow uppercase text-white hover:text-[aqua] mr-0 whitespace-no-wrap text-3xl font-bold p-4 px-0">
						Sessions
					</span>
				</div>
				{/* Card */}
				<div className="flex flex-wrap w-full">
					<div className="w-full px-10">
						<div className="relative flex flex-col min-w-0 break-words rounded-md mb-6 xl:mb-0">
							<div className="flex-auto p-4 bg-bgLight rounded-md">
								<div className="flex flex-wrap rounded-xl shadow-bIn p-2">
									{/*Table*/}
									<Table data={courses} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export default Sessions;
