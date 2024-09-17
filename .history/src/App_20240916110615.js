import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cmccweb from './loginpage/Cmccweb';
import Page2nd from './wardpage/Page2nd';
import Signup from './loginpage/Signup';
import Password from './loginpage/Password';
import Mapcom from './mappage/Mapcom';  // Importing only once
import './loginpage/Login.css';  // Keep the CSS import if it's necessary for the application
import MapComponent from './mappage/MapComponent';
import MapComponent60 from './mappage2/MapComponent60';
import './mappage/Map.css'; 
import './wardpage/Ward.css'; 


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Cmccweb />} />
        <Route exact path="/about" element={<Page2nd />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/password" element={<Password />} />
        <Route exact path="/map" element={<Mapcom />} />
        <Route exact path="/openmap" element={<MapComponent60 />} />
        
      
        
        <Route exact path="/openmap" element={<MapComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
  
