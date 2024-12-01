import React, { useContext, useState } from 'react';
import { getCourseAttendence } from '../Api/Requests';
import { TableData, TableInfo } from './TableData';
import FileDownload from 'js-file-download';
import { DataContext } from '../Context/Context';

const Table = (props) => {
	const [courseAttendence, setCourseAttendence] = useState('');
	const {currentUser} = useContext(DataContext);

	const getAttendenceReport = async (courseId, code, courseName) => {
		try {
			console.log('sas');
			const { data } = await getCourseAttendence(currentUser._id, courseId);
			setCourseAttendence(data);
			FileDownload(data, code +"  "+ courseName + '-Attendence.csv');

			console.log(data);
		} catch (error) { }
	}
	return (
		<>
			<div className="align-middle inline-block min-w-full overflow-hidden shadow-dashboard rounded">
				<table className="min-w-full bg-transparent">
					<thead>
						<tr>
							<th className="px-6 py-3 border-b-2 border-gray-300 text-left text-base font-bold leading-4 text-white tracking-wider">
								ID
							</th>
							<th className="px-6 py-3 border-b-2 border-gray-300 text-left text-base font-bold leading-4 text-white tracking-wider">
								Course
							</th>
							<th className="px-6 py-3 border-b-2 border-gray-300 text-left text-base font-bold leading-4 text-white tracking-wider">
								No. of Students
							</th>
							<th className="px-6 py-3 border-b-2 border-gray-300 text-left text-base font-bold leading-4 text-white tracking-wider">
								Status
							</th>
							<th className="px-6 py-3 border-b-2 border-gray-300 text-left text-base font-bold leading-4 text-white tracking-wider">
								Attendence
							</th>
						</tr>
					</thead>
					<tbody>
						{props.data.map((course, index) => (
							<tr key={index}>
								<td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
									<div className="flex items-center">
										<div>
											<div className="text-sm leading-5 text-white">{index+1}</div>
										</div>
									</div>
								</td>
								<td className=" py-4 whitespace-no-wrap border-b border-gray-500">
									<div className="text-sm leading-5 text-white">{course.code} {course.name}</div>
								</td>
								<td className="px-6 py-4 whitespace-no-wrap border-b text-white border-gray-500 text-sm leading-5">
									{course.numberOfStudents}
								</td>
								<td className="px-6 py-4 whitespace-no-wrap border-b text-white border-gray-500 text-sm leading-5">
									{TableInfo.active}
								</td>

								<td className="pr-4 py-4 whitespace-no-wrap border-b border-gray-500 text-sm leading-5">
									<button
										className=" bg-bgLight px-6 py-2 hover:text-white rounded transition duration-300 shadow-inputOut border-none hover:shadow-inputIn text-[#aaa]"
										onClick={() => getAttendenceReport(course._id, course.code , course.name)}
									>
										Generate Report
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
}

export default Table;
