import React, { useContext, useRef, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Webcam from 'react-webcam';
import { FaCamera } from "react-icons/fa";
import { postAttendenceCode, postMarkAttendence } from '../Api/Requests.jsx';
import { isEmptyObject } from '../utils/Utils.jsx';
import { DataContext } from '../Context/Context.jsx';

const MarkAttendence = () => {
	const { id } = useParams();
	const webcamRef = useRef(null);
	const [imgSrc, setImgSrc] = useState(null);
	const [lectureNo, setLectureNo] = useState('');
	const navigate = useNavigate()
	const {currentUser} = useContext(DataContext)

	const capture = React.useCallback(() => {
		const imageSrc = webcamRef.current.getScreenshot();
		setImgSrc(imageSrc);
	}, [webcamRef, setImgSrc]);

	const markAttendance = async (e) => {
		e.preventDefault();
		// creating formdata
		let data = new FormData();
		// Convert base 64 image to blob, otherwise model wont recognize
		const blob = await fetch(imgSrc).then((res) => res.blob());
		// const blob = imgSrc;
		console.log(imgSrc);
		data.append("lectureNo",lectureNo);
		data.append("classId",id);
		data.append("image",blob);

		try {
			const { data: res } = await postMarkAttendence(currentUser._id, data);
			console.log(res);
			if (res == 0) {
				alert('Attendence is not marked');
			} else {
				alert('Attendence is marked');
				setImgSrc(null)
				setLectureNo('')
			}
		} catch (error) {
			console.log(error);
			alert('Attendence is not marked');
		}
	};
	useState(()=>{
		document.title = "Mark Attendance - AI Attendance System"
		if (isEmptyObject(currentUser)) {
			navigate(`/login`)
		}
	},[])
	return (
		<>
			<div className="relative w-full h-full">
				<Header />
				<div className="relative pt-24 pb-32 px-5">
					{/* Card */}
					<div className="flex flex-wrap">
						<div className="w-full md:px-10 px-0">
							<div className="relative flex flex-col min-w-0 break-words bg-bgLight rounded-lg mb-6 xl:mb-0 shadow-bOut">
								<div className="flex-auto p-4">
									<div className="flex flex-wrap">
										<div className=" w-full pr-4 max-w-full flex-grow flex-auto">
											<span className="flex justify-center drop-shadow-tshadow uppercase text-white hover:text-[aqua] mr-0 whitespace-no-wrap md:text-3xl sm:text-2xl text-xl font-bold p-4 px-0">
												Mark Attendence
											</span>
										</div>
									</div>
									{/* asd */}
									<div className="flex flex-col md:px-36 sm:px-24 px-2 mt-6 mb-4">
										{/* <label className="flex flex-col justify-center">
											<span className="text-tdclr font-semibold">Class/Course Name</span>
											<input
												type="text"
												readOnly
												className="form-input outline-none px-4 mt-2 block bg-bgLight shadow-inputIn h-10 rounded"
												value={validateCode.name}
											/>
										</label> */}

										<label className="flex flex-col mt-6">
											<span className="text-tdclr font-semibold">Take Photo</span>
											<span className="text-tdclr font-light">
												Click to take picture and mark attendence. Make sure webcam is
												allowed for browser.
											</span>
										</label>

										<div className="flex flex-col items-center px-4 py-6 mt-2 rounded text-tdclr cursor-pointer hover:text-tdhclr shadow-bIn">
											<FaCamera className='text-3xl'/>
											<span className="mt-1 mb-2 font-semibold">Take Photo</span>
											<div className="text-center">
												<Webcam
													audio={false}
													ref={webcamRef}
													mirrored
													screenshotFormat="image/jpeg"
												/>
												<button className="font-semibold shadow-inputOut border-none hover:shadow-inputIn my-6 flex gap-2 items-center px-5 py-3 tracking-wide rounded text-tdclr cursor-pointer transition duration-200 bg-bgLight  hover:text-tdhclr " onClick={capture}> <FaCamera /> Capture</button>
												{/* Show Screenshot. Which is loaded in imgSrc */}
												{imgSrc && <img src={imgSrc} />}
												{imgSrc && (
													<span className="text-center font-semibold" >
														Captured Photo
													</span>
												)}
											</div>
										</div>
										<label className="flex flex-col mt-6">
											<span className="text-tdclr font-semibold">Lecture Number: </span>
											<input
												type="text"
												value={lectureNo}
												onChange={(e) => setLectureNo(e.target.value)}
												className="form-input px-4 mt-2 block bg-bgLight shadow-inputIn h-10 rounded outline-none"
												placeholder=""
												required
											/>
										</label>
										<button
											className="mt-6 flex flex-col items-center px-2 py-4 rounded text-tdclr cursor-pointer bg-bgLight hover:shadow-inputIn shadow-inputOut hover:text-tdhclr focus:border-white"
											onClick={(e) => markAttendance(e)}
										>
											<span className="font-semibold uppercase">Mark Attendance</span>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
export default MarkAttendence;
