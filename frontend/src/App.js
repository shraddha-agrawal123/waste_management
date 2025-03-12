import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import CameraFeed from './components/CameraFeed';
import ClassifyWaste from './components/ClassifyWaste';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="header">
          <div className="logo">
            <Link to="/">Waste Classifier</Link>
          </div>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/classify">Classify Waste</Link></li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/classify" element={<ClassifyWaste />} />
          <Route path="/camera" element={<CameraFeed />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;