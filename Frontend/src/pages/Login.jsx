import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { getUserLogin } from '../Api/Requests';
import { DataContext } from '../Context/Context';
import { isEmptyObject } from '../utils/Utils';

const Login = (props) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const {currentUser, setCurrentUser} =  useContext(DataContext);

	const loginInitialValues = {
		email: '',
		password: '',
		remember_me: false,
	}
	const [login, setLogin] = useState(loginInitialValues);
	const onInputChange = (e) => {
		setLogin({...login, [e.target.name]: e.target.value});
	}

	async function userLogin(e) {
		e.preventDefault();
		if (login.email && login.password) {
			try {
				await getUserLogin(login).then(
					(response) => {
						const data = response.data;	
						console.log(data);
						if(login.remember_me)
							localStorage.setItem('token', data);
						sessionStorage.setItem('token', data);
						setCurrentUser(jwtDecode(sessionStorage.getItem('token')));
						console.log("Current User : ",currentUser);
						navigate('/');					
					},
					(error) => {
						console.log("error under then :", error);
					});
			} catch (error) {
				alert('Email or Password is invalid');
				console.log("error : ",error)
			}
		} else {
			alert('Both email and password are required');
		}
	}
	useEffect(() => {
		document.title = "Login - AI Attendance System"
		console.log("Current User Login : ", currentUser)
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
								<div className="flex-auto px-4 ">
									<div className="flex flex-wrap">
										<div className=" w-full pr-4 max-w-full flex-grow flex-auto">
											<span className="flex justify-center drop-shadow-tshadow text-center uppercase text-tdclr hover:text-tdhclr mr-0 whitespace-no-wrap md:text-3xl sm:text-2xl text-xl font-bold px-0">
												Attendence Portal
											</span>
										</div>
									</div>

									<div className="h-full block mt-4 justify-center sm:px-6 lg:px-8">
										<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
											<div className="bg-bgLight shadow-bOut pb-8 pt-4 px-4 rounded-lg sm:px-10">
												<div className="sm:mx-auto sm:w-full sm:max-w-md pb-6 pt-1 text-center">
													<h2 className="text-2xl font-medium text-white">
														Sign in to your account.
													</h2>
												</div>
												<form className="space-y-6">
													<div>
														<label
															htmlFor="email"
															className="block text-sm font-medium text-white"
														>
															Email address
														</label>
														<div className="mt-1">
															<input
																id="email"
																name="email"
																value={login['email']}
																type="email"
																autoComplete="email"
																onChange={onInputChange} 
																placeholder='example@xyz.com'
																required
																className="border-none shadow-inputIn appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md bg-bgLight placeholder-gray-400 focus:outline-none sm:text-sm"
															/>
														</div>
													</div>

													<div>
														<label
															htmlFor="password"
															className="block text-sm font-medium text-white"
														>
															Password
														</label>
														<div className="mt-1">
															<input
																id="password"
																name="password"
																value={login['password']}
																type="password"
																autoComplete='current-password'
																onChange={onInputChange} 
																required
																className="shadow-inputIn bg-bgLight appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md border-none placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-cyan-500 sm:text-sm"
															/>
														</div>
													</div>

													<div className="flex items-center justify-between">
														<div className="flex items-center">
															<input
																id="remember_me"
																name="remember_me"
																value={login['remember_me']}
																type="checkbox"
																onChange={onInputChange} 
																className="appearance-none checked:appearance-auto bg-bgLight shadow-inputIn checked:shadow-inputOut h-4 w-4 text-cyan-600 focus:ring-indigo-500  rounded"
															/>
															<label
																htmlFor="remember_me"
																className="ml-2 block text-sm "
															>
																Remember me
															</label>
														</div>

														<div className="text-sm">
															<Link
																to="/register"
																className="font-medium hover:text-tdclr text-tdhclr hover:drop-shadow-tshadow"
															>
																Create a new account
															</Link>
														</div>
													</div>

													<div>
														<Link to="/">
															<button
																type="submit"
																className="shadow-inputOut border-none hover:shadow-inputIn bg-bgLight w-full flex justify-center py-4 px-4 border border-transparent rounded-md text-base font-medium text-white focus:outline-none hover:text-tdhclr"
																onClick={(e) => userLogin(e)}
															>
																Sign in
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
export default Login;
