import React from 'react';
import { Link } from 'react-router-dom';
import { FlaskRound as Flask, Atom, Brain } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Flask className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">VirtualLab</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            <Link to="/chemistry" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <Flask className="h-5 w-5" />
              <span>Chemistry</span>
            </Link>
            <Link to="/physics" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <Atom className="h-5 w-5" />
              <span>Physics</span>
            </Link>
            <Link to="/biology" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <Brain className="h-5 w-5" />
              <span>Biology</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;