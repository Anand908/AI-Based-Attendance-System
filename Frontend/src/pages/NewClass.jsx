import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { postCreateCourse, postTrainModel } from '../Api/Requests.jsx';
import {jwtDecode} from 'jwt-decode';
import { MdCloudUpload } from "react-icons/md";
import { isEmptyObject } from '../utils/Utils.jsx';
import { DataContext } from '../Context/Context.jsx';
import StudentList from './StudentList.jsx';

const NewClass = (props) => {
	// States
	const {currentUser} = useContext(DataContext);
	// const [images, setImages] = useState('');
	const classInitialValues = {
		code: '',
		name: '',
		noStu: 0,
		students: [],
    	teacherId: currentUser._id,
	}
	const [classes, setClasses] = useState(classInitialValues);
	const navigate = useNavigate();
	const [visible, setVisible] = useState(false);
	const [selectedStudents, setSelectedStudents] = useState([]);

	const onInputChange = (e) => {
		setClasses({...classes, [e.target.name]: e.target.value});
    	console.log("Classes change : ",classes)
	}

	// const modelImages = (event) => {
	// 	let images = [];
	// 	for (var i = 0; i < event.target.files.length; i++) {
	// 		images[i] = event.target.files.item(i);
	// 	}
	// 	images = images.filter((image) => image.name.match(/\.(jpg|jpeg|png|gif)$/));
	// 	let message = `${images.length} valid image(s) selected`;
	// 	alert(message);
	// 	console.log(images[0]);
	// 	setImages(images);
	// };

	// const trainModel = async (courseId) => {
	// 	// creating formdata
	// 	let data = new FormData();
	// 	images.map((image) => {
	// 		data.append(image.name, image);
	// 	});

	// 	try {
	// 		const { data: res } = await postTrainModel(courseId, data);
	// 		// console.log(res);
	// 		let path = `/`;
	// 		navigate(path);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	async function createClass(e) {
		e.preventDefault();

		setClasses({...classes, noStu : selectedStudents.length});
		setClasses({...classes, students : selectedStudents});
		classes.noStu = selectedStudents.length;
		classes.students = selectedStudents;

		console.log("Form data ", classes)
		try {
			await postCreateCourse(classes).then(
				(response) => {
					alert("Congrats ! Class added successfully.");
					console.log("response : ",response);
					setClasses(classInitialValues);
					setSelectedStudents([])
				}, (error) => {
					alert("Something went wrong")
					console.log("error : ",error);
				}
		);
		
		} catch (error) {
			alert("Error adding Class : ",error);
		}
	}

	useEffect(() => {
		document.title = "New Class - AI Attendance System"
		if (isEmptyObject(currentUser)) {
			navigate(`/login`)
		} 
	}, []);
	return (
		<>
			<StudentList setVisible={setVisible} visible={visible} selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents} />
			<div className="relative md:pt-24 py-8">
				{/* Card */}
				<div className="flex flex-wrap">
					<div className="w-full h-full px-10">
						<div className="relative flex flex-col min-w-0 break-words bg-bgLight p-10 rounded-2xl mb-6 xl:mb-0 shadow-bOut">
							<div className="flex-auto">
								<div className="flex flex-wrap">
									<div className=" w-full pr-4 flex-grow flex-auto">
										<span className="relative flex justify-center drop-shadow-tshadow uppercase text-white hover:text-[aqua] mr-0 whitespace-no-wrap text-3xl font-bold p-4 px-0">
											Create a new class
										</span>
									</div>
								</div>
								<div className="flex flex-col md:px-40 px-16 mt-6 mb-4">
									<label className="flex flex-col justify-center">
										<span className="text-white font-semibold">Subject Code </span>
										<input
											type="text"
											name='code'
											value={classes['code']}
											onChange={onInputChange}
											className="appearance-none h-10 block mt-2 w-full px-3 py-2 bg-bgLight rounded-md shadow-inputIn placeholder-gray-400 focus:outline-none sm:text-sm"
											placeholder="KCA-353"
											required
										/>
									</label>
									<label className="flex flex-col mt-6">
										<span className="text-white font-semibold">
											Subject Name
										</span>
										<input
											type="text"
											name='name'
											value={classes['name']}
											onChange={onInputChange}
											className="appearance-none h-10 mt-2 bg-bgLight shadow-inputIn block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 border-none outline-none sm:text-sm"
											placeholder="Mini Project"
											required
										/>
									</label>

									<label className="flex flex-col mt-6 ">
										<span className="text-white font-semibold">Students Data</span>
										<span className="text-white font-light">
											Select students who are belongs to this class
										</span>
									</label>

									<label
										onClick={()=>setVisible(true)}
										className="hover:shadow-inputOut shadow-inputIn transition-all duration-200 flex flex-col items-center px-4 py-6 mt-2 rounded text-tdclr cursor-pointer hover:text-tdhclr">
										<MdCloudUpload className='text-3xl'/>
										<span className="mt-1 font-semibold">Select Students</span>
										{selectedStudents.length!==0 && <span className="mt-1 text-sm">Selected Students {selectedStudents.length}</span>}

										{/* <input
											type="file"
											multiple
											className="hidden"
											onChange={(e) => modelImages(e)}
										/> */}
									</label>
									<button
										className="shadow-inputOut font-semibold uppercase border-none hover:shadow-inputIn mt-6 flex flex-col items-center px-2 py-4 rounded text-tdclr cursor-pointer bg-bgLight hover:text-tdhclr"
										onClick={(e) => createClass(e)}
									>
										<span className="font-semibold uppercase">Save</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
export default NewClass;
