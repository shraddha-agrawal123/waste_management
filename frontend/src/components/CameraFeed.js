import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import './CameraFeed.css';

const CameraFeed = () => {
  const videoRef = useRef(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null); // Store the camera stream

  // Start the camera when the component mounts
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        setStream(stream); // Save the stream to state
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Failed to access camera. Please ensure your camera is connected and permissions are granted.");
      }
    };

    startCamera();

    // Cleanup function to stop the camera stream when the component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Capture an image from the camera feed
  const captureImage = async () => {
    if (!videoRef.current || !stream) {
      setError("Camera feed is not available.");
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL('image/jpeg');

    // Convert data URL to Blob
    const blob = await fetch(image).then(res => res.blob());

    // Send image to backend for classification
    const formData = new FormData();
    formData.append('image', blob, 'capture.jpg');

    try {
      const response = await axios.post('http://localhost:5000/classify_waste', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error classifying waste:", err);
      setError("Failed to classify waste. Please try again.");
    }
  };

  return (
    <div className="camera-feed">
      <h1>Waste Classification</h1>
      <video ref={videoRef} autoPlay playsInline />
      <button onClick={captureImage}>Capture</button>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="result">
          <h3>Classification Result:</h3>
          <p>Class: {result.class}</p>
          <p>Biodegradable: {result.biodegradable ? 'Yes' : 'No'}</p>
          {result.nutrient_levels && (
            <>
              <h4>Nutrient Levels:</h4>
              <ul>
                {Object.entries(result.nutrient_levels).map(([nutrient, level]) => (
                  <li key={nutrient}>{nutrient}: {level.toFixed(2)}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraFeed;