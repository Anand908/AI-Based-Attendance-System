import React, { useContext, useEffect, useState } from 'react'
import { StuTableHead } from '../constants/Data'
import { getCourses, getStudentData } from '../Api/Requests';
import { isEmptyObject } from '../utils/Utils';
import { DataContext } from '../Context/Context';
import { useNavigate } from 'react-router-dom';
import { imgEndPoint } from '../Config/api';
import { FaUserCircle } from 'react-icons/fa';

const StudentList = ({onInputChange ,setVisible ,visible , selectedStudents, setSelectedStudents}) => {

  const { currentUser } = useContext(DataContext)
  const [stuData, setStuData] = useState([])
  const navigate = useNavigate()

  const handleCheckboxChange = (id) => {
    setSelectedStudents((prevSelected) => {
      if (prevSelected.includes(id)) {
        // If already selected, remove it
        return prevSelected.filter((studentId) => studentId !== id);
      } else {
        // If not selected, add it
        return [...prevSelected, id];
      }
    });
    console.log("select stu : ", selectedStudents)
  };

  const loadData = async (filter) => {
		try {
			await getStudentData(filter).then(
        (response) => {
          setStuData(response.data)
          console.log("Student Data : ",stuData)
        },
        (error) => {

        }
      );
		} catch (error) {
			console.log(error);
		}
	};
  const handleSubmit = () =>{
    setVisible(false)
  }

  useEffect(()=>{
      document.title = "Student list - AI Attendance System"
    if (!isEmptyObject(currentUser)) {
      loadData("all");
    } else {
      navigate(`/login`)
    }
  },[currentUser])

  return (
    <div className={`${visible ? 'block w-full' : 'hidden w-0'} absolute top-0 left-0 z-40 transition duration-200 min-h-full md:pt-24 pb-24 pt-8 px-10`}>
      <div className="relative w-full h-full p-8 shadow-bOut rounded-2xl bg-bgLight">
        <h1 className='text-3xl text-center drop-shadow-tshadow font-bold uppercase text-tdclr hover:text-tdhclr transition duration-200'>{selectedStudents ? 'Select Students' : 'Students List'}</h1>
        <table className='bg-bgLight w-full shadow-bIn rounded-lg mt-8 pb-8'>
            <thead>
                <tr className='border-b-2 border-tdclr'>
                    {StuTableHead.map((item,index) => {
                      if(index === 0 && selectedStudents === undefined) return null
                        return (<th className={`pt-4 pb-3 `} key={index}>{item}</th>)
                    })}
                </tr>
            </thead>
            <tbody className='pb-40'>
                {stuData.map((s, index) => (
                  <tr key={index}  className='border-b border-tdclr'>
                    {selectedStudents && <td className='pl-5 py-1 text-center' >
                      <input type="checkbox" name="" id="" 
                      checked={selectedStudents.includes(s.stuId)}
                      onChange={() => handleCheckboxChange(s.stuId)}
                      className="appearance-none checked:appearance-auto bg-bgLight shadow-inputIn checked:shadow-inputOut h-4 w-4 text-cyan-600 focus:ring-indigo-500  rounded"/>
                    </td>}
                    <td className='py-1 text-center flex items-center justify-center'>
                      {s.image_path ?
                        <img className='align-middle w-16 h-16 object-cover rounded-full block' src={imgEndPoint+s.image_path} alt="" />
                        : <FaUserCircle className='text-4xl' />
                      }
                    </td>
                    <td className=''>{s.name}</td>
                    <td className=''>{s.course}</td>
                    <td className=''>{s.sem}</td>
                    <td className=''>{s.stuId}</td>
                  </tr>
                ))}
            </tbody>
        </table>
        {selectedStudents && <button
          onClick={handleSubmit}
          className="shadow-inputOut mt-10 border-none hover:shadow-inputIn bg-bgLight flex justify-center py-3 px-5 border border-transparent rounded-md text-base font-medium text-white focus:outline-none hover:text-tdhclr"
        >Submit</button>}
      </div>
    </div>
  )
}

export default StudentList