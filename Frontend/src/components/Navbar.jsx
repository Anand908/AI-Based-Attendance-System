import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavbarDataTeacher, NavbarDataStudent } from '../constants/NavbarData';
import { IoMenu } from "react-icons/io5";
import { TbLogout } from 'react-icons/tb';

import { DataContext } from '../Context/Context';
import { isEmptyObject } from '../utils/Utils';

const Navbar = () => {
	const navigate = useNavigate();
	const [activeNav, setActiveNav] = useState(false);
	const {currentUser, setCurrentUser} =  useContext(DataContext);

	const handleLogout = () => {
		setActiveNav(!activeNav)
		try{
			sessionStorage.removeItem("token")
			setCurrentUser({}); // Setting User
			navigate('/login'); // Redirect to login page
			console.log('currentUser Nav : ',currentUser);
			localStorage.removeItem("token"); // Remove the token
		}
		catch(error){
			console.log("Logout error : ",error)
		}
	};

	return (
		<>
			<div onClick={()  => setActiveNav(!activeNav)} className={`fixed z-50 top-2 left-2 md:hidden block w-10 h-10 ${activeNav? 'bg-bgDark' : 'bg-black'} bg-bgDark rounded shadow-lg flex justify-center items-center`}>
				<IoMenu className='h-8 w-8'/>
			</div>
			<nav className={`bg-bgLight ${activeNav? 'left-0' : 'md:left-0 left-[-100%]'} border-bgDark shadow-bOut md:block md:relative fixed z-20 transition-all duration-200 w-full md:h-full h-screen p-5`}>
					{/* Brand */}
					<Link
						className="md:block block text-center outline-none tracking-wider text-tdclr drop-shadow-tshadow hover:text-tdhclr text-shadow-md text-2xl uppercase font-bold p-4"
						to="/"
					>
						AI-Attendence
					</Link>
					{/* Divider */}
					<hr className="my-4 md:min-w-full border-2 border-bgDark shadow-bOut"/>
					<div
						className={
							'flex flex-col relative md:mt-8 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded '
						}
					>
						{/* Navigation */}

						<ul className="md:flex-col min-w-full px-5 flex flex-col list-none">
							{!isEmptyObject(currentUser)
								? NavbarDataTeacher.map(({title,path,Icon}, index) => (
										<li className="items-center rounded-full" key={index}>
											<Link
												className="text-tdclr pl-10 drop-shadow-tshadow hover:text-tdhclr hover:shadow-inputIn rounded-full hover:border-bgDark transition duration-500 text-sm flex uppercase w-full p-3 font-bold items-center whitespace-nowrap space-x-3 mb-2"
												to={path}
												onClick={()  => setActiveNav(!activeNav)}
											>
												<Icon className='text-xl' />
												<span>{title}</span>
											</Link>
										</li>
								  )).concat(
									<li className="items-center rounded-full" key={'logout'}>
										<Link
											className="text-tdclr pl-10 drop-shadow-tshadow hover:text-tdhclr hover:shadow-inputIn rounded-full hover:border-bgDark transition duration-500 text-sm flex uppercase w-full p-3 font-bold items-center whitespace-nowrap space-x-3 mb-2"
											to='/login'
											onClick={handleLogout}
										>
											<TbLogout className='text-xl' />
											<span>Log Out</span>
										</Link>
									</li>
								)
								: NavbarDataStudent.map(({title, path, Icon}, index) => (
										<li className="items-center" key={index}>
											<Link
												className="text-tdclr drop-shadow-tshadow pl-10 hover:text-tdhclr hover:shadow-inputIn rounded-full hover:border-bgDark transition duration-500 text-sm flex uppercase w-full p-3 font-bold items-center whitespace-nowrap space-x-3 mb-2"
												to={path}
												onClick={()  => setActiveNav(!activeNav)}
											>
												<Icon className='text-xl' />
												<span>{title}</span>
											</Link>
										</li>
								  ))}
							
						</ul>
					</div>
			</nav>
		</>
	);
}
export default Navbar;
