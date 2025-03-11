import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import './CameraFeed.css';

const CameraFeed = () => {
  const videoRef = useRef(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };
    startCamera();
  }, []);

  const captureImage = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL('image/jpeg');

    // Send image to backend for classification
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:5000/classify_waste', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
    } catch (err) {
      console.error("Error classifying waste:", err);
    }
  };

  return (
    <div className="camera-feed">
      <h1>Waste Classification</h1>
      <video ref={videoRef} autoPlay playsInline />
      <button onClick={captureImage}>Capture</button>
      {result && (
        <div className="result">
          <h3>Classification Result:</h3>
          <p>Class: {result.class}</p>
          <p>Biodegradable: {result.biodegradable ? 'Yes' : 'No'}</p>
          <h4>Nutrient Levels:</h4>
          <ul>
            {Object.entries(result.nutrient_levels).map(([nutrient, level]) => (
              <li key={nutrient}>{nutrient}: {level.toFixed(2)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CameraFeed;