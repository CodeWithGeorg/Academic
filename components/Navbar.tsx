
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../constants';

const Navbar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  const isActive = (path: string) => location.pathname === path ? "text-primary font-bold" : "text-gray-600 hover:text-primary";
  
  // Mobile specific link styling
  const mobileLinkClass = (path: string) => 
    `block px-3 py-2 rounded-md text-base font-medium ${location.pathname === path ? "bg-indigo-50 text-primary" : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"}`;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center" onClick={closeMenu}>
               <span className="text-2xl font-bold text-primary">AcademicFlow</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
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
                    <Link to="/dashboard" className={isActive('/dashboard')}>Assignments</Link>
                    <Link to="/contact" className={isActive('/contact')}>Contact Admin</Link>
                  </>
                )}
                
                {role === UserRole.ADMIN && (
                   <>
                    <Link to="/admin" className={isActive('/admin')}>Dashboard</Link>
                    <Link to="/place-order" className={isActive('/place-order')}>Create Assignment</Link>
                   </>
                )}
                <div className="flex items-center gap-4 border-l pl-4 ml-2">
                    <span className="text-sm text-gray-500 hidden lg:block">Hello, {user.name}</span>
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

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger Icon */}
              <svg className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close Icon */}
              <svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-200`} id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1 px-2 sm:px-3">
            <Link to="/" className={mobileLinkClass('/')} onClick={closeMenu}>Home</Link>
            
            {!user ? (
              <>
                <Link to="/login" className={mobileLinkClass('/login')} onClick={closeMenu}>Login</Link>
                <Link to="/signup" className={mobileLinkClass('/signup')} onClick={closeMenu}>Sign Up</Link>
              </>
            ) : (
              <>
                {role === UserRole.CLIENT && (
                  <>
                    <Link to="/dashboard" className={mobileLinkClass('/dashboard')} onClick={closeMenu}>Assignments</Link>
                    <Link to="/contact" className={mobileLinkClass('/contact')} onClick={closeMenu}>Contact Admin</Link>
                  </>
                )}
                
                {role === UserRole.ADMIN && (
                   <>
                    <Link to="/admin" className={mobileLinkClass('/admin')} onClick={closeMenu}>Dashboard</Link>
                    <Link to="/place-order" className={mobileLinkClass('/place-order')} onClick={closeMenu}>Create Assignment</Link>
                   </>
                )}
              </>
            )}
        </div>
        
        {/* Mobile User Profile Section */}
        {user && (
            <div className="pt-4 pb-4 border-t border-gray-200">
                <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-primary font-bold text-xl">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div className="ml-3">
                        <div className="text-base font-medium leading-none text-gray-800">{user.name}</div>
                        <div className="text-sm font-medium leading-none text-gray-500 mt-1">{user.email}</div>
                    </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
