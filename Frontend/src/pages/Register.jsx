import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { postUserRegister } from '../Api/Requests';
import { isEmptyObject } from '../utils/Utils';
import { DataContext } from '../Context/Context';

const Register = (props) => {
	const {currentUser, setCurrentUser} =  useContext(DataContext);
	const [email, setEmail] = useState('');
	const [fullName, setFullName] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [contactNumber, setContactNumber] = useState('');
	const navigate = useNavigate();

	const regInitialValues = {
		email: '',
		name: '',
		contact: '',
		password: '',
		cpassword: '',
	  }
	  const [reg, setReg] = useState(regInitialValues);
	  const onInputChange = (e) => {
		setReg({...reg, [e.target.name]: e.target.value});
	  }

	async function registerUser(e) {
		e.preventDefault();
		if (reg.email && reg.name && reg.contact && reg.password && reg.cpassword) {
			if (reg.password === reg.cpassword) {
				try {
					delete reg.cpassword;
					console.log("reg : ",reg)
					await postUserRegister(reg).then(
						(response) =>{
							// Redirect to login
							alert("Congrats! Teacher added successfully")
							navigate(`/login`);
						},
						(error) =>{
							console.log("error : ", error)
						}
					);

					
				} catch (error) {
					alert('Email already registered');
					console.log("Catch Error : ",error)
				}
			} else {
				alert('Passwords do not match');
			}
		} else {
			alert('Fill all fields');
		}
	}
	useEffect(() => {
		document.title = "Register - AI Attendance System"
		if (!isEmptyObject(currentUser)) {
			navigate('/')
		} 
	}, [currentUser]);
	return (
		<>
			<div className="relative w-full h-full">
				<div className="relative md:pt-24 pb-10 pt-12">
					{/* Card */}
					<div className="flex flex-wrap">
						<div className="w-full">
							<div className="relative flex flex-col min-w-0 break-words mb-6 xl:mb-0">
								<div className="flex-auto px-4">
									<div className="flex flex-wrap">
										<div className=" w-full pr-4 max-w-full flex-grow flex-auto">
											<span className="drop-shadow-tshadow flex justify-center text-center uppercase text-tdclr hover:text-tdhclr mr-0 whitespace-no-wrap md:text-3xl sm:text-2xl text-xl font-bold px-0">
												Attendence Portal
											</span>
										</div>
									</div>

									<div className="h-full block mt-4 justify-center sm:px-6 lg:px-8">
										<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
											<div className="bg-bgLight shadow-bOut pb-8 pt-4 px-4 rounded-lg sm:px-10">
												<div className="sm:mx-auto sm:w-full sm:max-w-md pb-6 pt-1 text-center">
													<h2 className="text-2xl font-medium text-tdclr">
														Create a new account
													</h2>
												</div>
												<form className="space-y-6">
													<div>
														<label
															htmlFor="email"
															className="block text-sm font-medium text-tdclr"
														>
															Email address
														</label>
														<div className="mt-1">
															<input
																id="email"
																name="email"
																value={reg['email']}
																type="email"
																autoComplete="email"
																required
																onChange={onInputChange} 
																className="bg-bgLight shadow-inputIn border-none appearance-none  block w-full px-3 py-2 rounded-md placeholder-gray-400 focus:outline-none sm:text-sm"
															/>
														</div>
													</div>
													<div>
														<label
															htmlFor="name"
															className="block text-sm font-medium text-tdclr"
														>
															Full Name
														</label>
														<div className="mt-1">
															<input
																id="name"
																name="name"
																value={reg['name']}
																type="text"
																required
																onChange={onInputChange} 
																className="bg-bgLight shadow-inputIn border-none  appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none sm:text-sm"
															/>
														</div>
													</div>

													<div>
														<label
															htmlFor="contact"
															className="block text-sm font-medium text-tdclr"
														>
															Contact Number
														</label>
														<div className="mt-1">
															<input
																id="contact"
																name="contact"
																value={reg['contact']}
																type="text"
																autoComplete="email"
																required
																onChange={onInputChange} 
																className="bg-bgLight shadow-inputIn border-none  appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none sm:text-sm"
															/>
														</div>
													</div>
													<div>
														<label
															htmlFor="password"
															className="block text-sm font-medium text-tdclr"
														>
															Password
														</label>
														<div className="mt-1">
															<input
																id="password"
																name="password"
																value={reg['password']}
																type="password"
																autoComplete="current-password"
																required
																onChange={onInputChange} 
																className="bg-bgLight shadow-inputIn border-none  appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-cyan-500 sm:text-sm"
															/>
														</div>
													</div>

													<div>
														<label
															htmlFor="cpassword"
															className="block text-sm font-medium text-tdclr"
														>
															Confirm Password
														</label>
														<div className="mt-1">
															<input
																id="cpassword"
																name="cpassword"
																value={reg['cpassword']}
																type="password"
																autoComplete="current-password"
																required
																onChange={onInputChange} 
																className="bg-bgLight shadow-inputIn border-none  appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-cyan-500 sm:text-sm"
															/>
														</div>
													</div>

													<div>
														<Link to="/">
															<button
																type="submit"
																className="shadow-inputOut border-none hover:shadow-inputIn w-full flex justify-center py-4 px-4 rounded-md text-base font-medium text-tdclr hover:text-tdhclr bg-bgLight focus:outline-none"
																onClick={(e) => registerUser(e)}
															>
																Sign up
															</button>
														</Link>
													</div>
												</form>
											</div>
										</div>
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
export default Register;
