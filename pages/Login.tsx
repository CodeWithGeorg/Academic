
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { account, getUserRole } from '../services/appwrite';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { UserRole } from '../constants';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { checkUserStatus } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await account.createEmailPasswordSession(email, password);
      await checkUserStatus();
      const user = await account.get();
      const role = await getUserRole(user.$id);
      
      if (role === UserRole.ADMIN) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-white">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please sign in to access your dashboard.
            </p>
          </div>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center border border-red-100">
                  {error}
                </div>
              )}
              
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                label="Email address"
                className="bg-gray-50 border-gray-300 focus:bg-white"
              />
              
              <div className="space-y-1">
                 <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    label="Password"
                    className="bg-gray-50 border-gray-300 focus:bg-white"
                  />
                  <div className="flex items-center justify-end">
                    <div className="text-sm">
                      <a href="#" className="font-medium text-primary hover:text-indigo-500">
                        Forgot your password?
                      </a>
                    </div>
                  </div>
              </div>

              <Button type="submit" className="w-full shadow-lg shadow-indigo-500/30" isLoading={loading}>
                Sign in
              </Button>
            </form>
            
             <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">New to AcademicFlow?</span>
                  </div>
                </div>

                <div className="mt-6">
                   <Link to="/signup" className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Create an account
                   </Link>
                </div>
              </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop"
          alt="Library books"
        />
        <div className="absolute inset-0 bg-primary mix-blend-multiply opacity-40"></div>
        <div className="absolute bottom-0 left-0 p-20 text-white">
            <h3 className="text-4xl font-bold mb-4">Empowering Education</h3>
            <p className="text-xl text-indigo-100 max-w-md">Join thousands of students and administrators managing their academic journey efficiently.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
