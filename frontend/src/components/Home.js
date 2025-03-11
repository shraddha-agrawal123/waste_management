import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests
import './Home.css';

const Home = () => {
  const [showClassificationOptions, setShowClassificationOptions] = useState(false);
  const [classificationResult, setClassificationResult] = useState(null); // State to store classification result

  const tips = [
    {
      title: "Reduce Plastic Usage",
      description: "Use reusable bags, bottles, and containers to reduce plastic waste.",
      icon: "♻️",
    },
    {
      title: "Compost Organic Waste",
      description: "Turn food scraps and yard waste into nutrient-rich compost.",
      icon: "🍂",
    },
    {
      title: "Recycle Properly",
      description: "Separate recyclables like paper, glass, and metal from regular trash.",
      icon: "🗑️",
    },
    {
      title: "Support E-Waste Recycling",
      description: "Dispose of electronic waste at certified recycling centers.",
      icon: "📱",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Function to handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:5000/classify_waste', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setClassificationResult(response.data); // Store the classification result
    } catch (err) {
      console.error("Error classifying waste:", err);
    }
  };

  return (
    <div className="home">
      <h1>Welcome to Waste Classifier</h1>
      <div className="slider-container">
        <Slider {...settings}>
          {tips.map((tip, index) => (
            <div key={index} className="tip-card">
              <div className="tip-icon">{tip.icon}</div>
              <h3>{tip.title}</h3>
              <p>{tip.description}</p>
            </div>
          ))}
        </Slider>
      </div>
      <Link to="/classify" className="classify-button" onClick={() => setShowClassificationOptions(true)}>
        Classify Waste
      </Link>

      {showClassificationOptions && (
        <div className="classification-options">
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
      )}

      {/* Display classification result */}
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

export default Home;