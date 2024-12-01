import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const CameraCapture = () => {
    const webcamRef = useRef(null);
    const [image, setImage] = useState(null);

    const captureImage = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);

        // Send image to backend
        axios.post('http://localhost:5000/api/attendance', { image: imageSrc })
            .then(response => {
                alert('Attendance processed successfully');
            })
            .catch(error => {
                console.error('Error processing attendance', error);
            });
    };

    return (
        <div>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={640}
                height={480}
            />
            <button onClick={captureImage}>Capture Image</button>
            {image && <img src={image} alt="Captured" />}
        </div>
    );
};

export default CameraCapture;
