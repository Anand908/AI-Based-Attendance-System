import React, { useContext, useEffect, useState } from 'react'

import { StuFormData } from '../constants/Data'
import { isEmptyObject } from '../utils/Utils';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../Context/Context';
import { MdCloudUpload } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { addStudent, postTrainModel } from '../Api/Requests';

const AddStudent = () => {

  const {currentUser} = useContext(DataContext);
  const navigate = useNavigate();
  const stuInitialValues = {
		stuId: '',
		rollNo: '',
		name: '',
		course: '',
		sem: '',
		contact: '',
		imgUrl: '',
    teacherId: currentUser._id,
	}
	const [stu, setStu] = useState(stuInitialValues);
  const [image, setImage] = useState(null);
	const onInputChange = (e) => {
		setStu({...stu, [e.target.name]: e.target.value});
    console.log("Student change : ",stu)
	}
  // Handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the first file
    if (file) {
      const imageURL = URL.createObjectURL(file); // Create a temporary URL
      setStu({...stu, [e.target.name]: imageURL}); // Update state with image URL
      setImage(file)
      console.log("Student Image change : ",stu)
    }
  };

  const trainModel = async (stuId) => {
    	// creating formdata
    	let data = new FormData();
      data.append('image', image);
  
    	try {
    		const { data: res } = await postTrainModel(stuId, data);
    		// navigate('/');
    	} catch (error) {
    		console.log(error);
    	}
    };

  const handleSubmit = (e) =>{
    e.preventDefault();
    const formData = new FormData();
    for (const key in stu) {
      if(key !== 'imgUrl')
        formData.append(key, stu[key]);
    }
    if (image) {
      formData.append("image", image);
    }
    try {
      addStudent(formData).then(
        (response) => {
          if(response.status === 202)
            alert("Student already Exists !")
          else{
            alert("Congrats ! Student added successfully.");
            console.log("response : ",response);
            trainModel(stu.stuId)
            setStu(stuInitialValues);
          }
        }, (error) => {
          alert("Something went wrong")
          console.log("error : ",error);
        }
      );
      
    } catch (error) {
      alert("Error adding student : ",error);
    }
  }

  useEffect(() => {
		document.title = "Add Student - AI Attendance System"
		if (isEmptyObject(currentUser)) {
			navigate(`/login`)
		}
	}, []);

  return (
    <div className='relative w-full h-full md:pt-24 pb-24 pt-8 px-10'>
      <div className="w-full h-full p-8 shadow-bOut rounded-2xl">
        <h1 className='text-3xl text-center drop-shadow-tshadow font-bold uppercase text-tdclr hover:text-tdhclr transition duration-200'>Add Student</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-10 gap-5 px-10 my-10">
          {StuFormData.map((item, index) => (
            <div className="flex flex-col w-full" key={index}>
              <label className='text-white font-semibold mb-3'>{item.label}</label>
              <input 
                type={item.type}
                name={item.name} 
                value={stu[item.name]}
                onChange={onInputChange}
                required
                className='appearance-none outline-none px-4 shadow-inputIn bg-bgLight h-10 rounded-md'/>
            </div>
          ))}
          <div className='flex w-full h-fit items-center justify-center'>
            {stu.imgUrl ?
                <img src={stu.imgUrl} className='w-32 h-32 object-cover' alt="uploaded Image" />
              : <FaUserCircle className='text-9xl'/>}
          </div>
          <label className="hover:shadow-inputOut shadow-inputIn transition-all duration-200 flex flex-col items-center px-4 py-6 mt-2 rounded text-tdclr cursor-pointer hover:text-tdhclr">
									<MdCloudUpload className='text-3xl'/>
									<span className="mt-1 font-semibold">Choose a file</span>
									<input
										type="file"
										className="hidden"
                    name='imgUrl'
                    onChange={handleImageChange}
									/>
								</label>
          <div className="flex mt-10 flex-col w-full">
            <input type='reset' className='px-4 shadow-inputOut hover:shadow-inputIn bg-bgLight h-10 rounded-md'/>
          </div>
          <div className="flex mt-10 flex-col w-full">
            <input type='submit' className='px-4 shadow-inputOut hover:shadow-inputIn bg-bgLight h-10 rounded-md'/>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddStudent