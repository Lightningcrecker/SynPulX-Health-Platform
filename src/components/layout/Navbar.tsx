import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../shared/Logo';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0">
            <Logo />
          </Link>
          
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link
              to="/about"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              About
            </Link>
            <Link
              to="/features"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/login"
              className="text-white bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};