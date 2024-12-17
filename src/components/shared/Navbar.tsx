import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-gray-900/80 to-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo className="hover:opacity-80 transition-opacity" />
          
          <div className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Pricing
                </button>
                <Link
                  to="/privacy"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/health">Health</Link>
                <Link to="/profile">Profile</Link>
                <button
                  onClick={() => logout()}
                  className="px-4 py-2 rounded-full text-gray-300 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};