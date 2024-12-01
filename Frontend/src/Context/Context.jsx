import { useEffect, useState } from "react";
import { createContext } from "react";
import {jwtDecode} from 'jwt-decode';

 export const DataContext = createContext(null);

 const DataProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState({});
	const validateUserLogin = () => {
		try {
			const token = localStorage.getItem('token');
			if (token) {
				const currentUser = jwtDecode(token);
				sessionStorage.setItem('token', token);
				setCurrentUser(currentUser);
				console.log("User : ",currentUser.fullName)
			}
			else console.log("Context token : ",token);
		} catch (error) { console.log("Context error : ",error)}
	}

	useEffect(() => {
		validateUserLogin();
	}, []);

    return (
        <DataContext.Provider value={{
            currentUser, 
            setCurrentUser
        }}>
            {children}
        </DataContext.Provider>
    )
 }

 export default DataProvider;