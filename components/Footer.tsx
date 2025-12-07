import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link to="/" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Home</span>
            Home
          </Link>
          <Link to="/contact" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Contact</span>
            Contact Support
          </Link>
          <span className="text-gray-400">
            Privacy Policy
          </span>
          <span className="text-gray-400">
            Terms
          </span>
        </div>
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} AcademicFlow Platform. All rights reserved.
          </p>
          <p className="text-center text-xs text-gray-300 mt-1">
            Powered by Appwrite Backend Services
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;