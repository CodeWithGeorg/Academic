import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../constants';

const Home: React.FC = () => {
  const { user, role } = useAuth();

  let ctaLink = "/login";
  let ctaText = "Get Started";

  if (user) {
    ctaLink = role === UserRole.ADMIN ? "/admin" : "/dashboard";
    ctaText = "Go to Dashboard";
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col justify-center relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl"></div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Manage your academic</span>
            <span className="block text-primary">projects with ease</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Streamline your workflow, submit orders, and track progress all in one place. secure, fast, and professional.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                to={ctaLink}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                {ctaText}
              </Link>
            </div>
            {!user && (
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                    to="/signup"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                    Sign Up
                </Link>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
