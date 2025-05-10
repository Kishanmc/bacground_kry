import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ChemistryLab from './pages/ChemistryLab';
import PhysicsLab from './pages/PhysicsLab';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chemistry" element={<ChemistryLab />} />
          <Route path="/physics" element={<PhysicsLab />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;