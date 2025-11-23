import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../constants';

const Navbar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path ? "text-primary font-bold" : "text-gray-600 hover:text-primary";

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
               <span className="text-2xl font-bold text-primary">AcademicFlow</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className={isActive('/')}>Home</Link>
            
            {!user ? (
              <>
                <Link to="/login" className={isActive('/login')}>Login</Link>
                <Link 
                  to="/signup" 
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {role === UserRole.CLIENT && (
                  <>
                    <Link to="/dashboard" className={isActive('/dashboard')}>My Orders</Link>
                    <Link to="/place-order" className={isActive('/place-order')}>New Order</Link>
                  </>
                )}
                {role === UserRole.ADMIN && (
                   <Link to="/admin" className={isActive('/admin')}>Admin Dashboard</Link>
                )}
                <div className="flex items-center gap-4 border-l pl-4 ml-2">
                    <span className="text-sm text-gray-500 hidden sm:block">Hello, {user.name}</span>
                    <button 
                      onClick={handleLogout}
                      className="text-gray-600 hover:text-red-500 text-sm font-medium"
                    >
                      Logout
                    </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
