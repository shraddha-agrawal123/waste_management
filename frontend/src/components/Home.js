import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
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
      <Link to="/classify" className="classify-button">
        Classify Waste
      </Link>
    </div>
  );
};

export default Home;