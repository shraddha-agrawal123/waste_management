import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ClassifyWaste.css';

const ClassifyWaste = () => {
  const [classificationResult, setClassificationResult] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:5000/classify_waste', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setClassificationResult(response.data);
    } catch (err) {
      console.error("Error classifying waste:", err);
    }
  };

  return (
    <div className="classify-waste">
      <h1>Classify Waste</h1>
      <div className="options">
        <div className="option-card">
          <h3>Upload Image</h3>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
        <div className="option-card">
          <h3>Live Camera</h3>
          <Link to="/camera" className="camera-button">
            Open Camera
          </Link>
        </div>
      </div>

      {classificationResult && (
        <div className="result">
          <h3>Classification Result:</h3>
          <p>Class: {classificationResult.class}</p>
          <p>Biodegradable: {classificationResult.biodegradable ? 'Yes' : 'No'}</p>
          <h4>Nutrient Levels:</h4>
          <ul>
            {Object.entries(classificationResult.nutrient_levels).map(([nutrient, level]) => (
              <li key={nutrient}>{nutrient}: {level.toFixed(2)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClassifyWaste;