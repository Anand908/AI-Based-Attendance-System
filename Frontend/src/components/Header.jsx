import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { DataContext } from '../Context/Context';
import { isEmptyObject } from '../utils/Utils';

const Header = () => {

	
	const {currentUser, setCurrentUser} =  useContext(DataContext);

	return (
		<>
			<nav className="md:flex absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-no-wrap md:justify-start hidden items-center p-4">
				<div className="w-full mx-auto items-center flex justify-between md:flex-no-wrap flex-wrap md:px-10 px-4">
					{/* Brand */}
					<Link className="text-tdclr drop-shadow-tshadow hover:text-tdhclr text-sm uppercase lg:inline-block font-semibold" to="/">
						Dashboard
					</Link>
					{/* User */}
					<ul className="flex md:flex-row list-none items-center md:flex text-tdclr text-sm uppercase lg:inline-block font-semibold">
						<li><h3>{isEmptyObject && currentUser.fullName}</h3></li>
					</ul>
				</div>
			</nav>
			{/* End Header */}
		</>
	);
}

export default Header;