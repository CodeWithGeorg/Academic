
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { account, createUserDocument, uniqueId } from '../services/appwrite';
import { useAuth } from '@/context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { UserRole } from '../constants';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { checkUserStatus } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userId = uniqueId();
      // 1. Create the Appwrite Account
      await account.create(userId, email, password, name);
      
      // 2. Create the Session (Login immediately)
      await account.createEmailPasswordSession(email, password);
      
      // 3. Create the User Profile in Database
      await createUserDocument(userId, name, email, UserRole.CLIENT);
      
      // 4. Update Auth Context
      await checkUserStatus();
      
      // 5. Redirect to Client Dashboard
      navigate('/dashboard'); 
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-white">
      {/* Right Side - Image (Flipped for Signup) */}
      <div className="hidden lg:block relative w-0 flex-1 order-2">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
          alt="Students studying together"
        />
        <div className="absolute inset-0 bg-indigo-900 mix-blend-multiply opacity-40"></div>
        <div className="absolute bottom-0 left-0 p-20 text-white">
            <h3 className="text-4xl font-bold mb-4">Start Your Journey</h3>
            <p className="text-xl text-indigo-100 max-w-md">Create an account today to access assignments, grades, and communicate with your instructors.</p>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 order-1">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-indigo-500">
                Log in
              </Link>
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
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                label="Full Name"
                className="bg-gray-50 border-gray-300 focus:bg-white"
              />

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
              
              <Input
                id="password"
                type="password"
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                label="Password"
                className="bg-gray-50 border-gray-300 focus:bg-white"
              />

              <Button type="submit" className="w-full shadow-lg shadow-indigo-500/30" isLoading={loading}>
                Sign Up
              </Button>
              
              <p className="text-xs text-center text-gray-500 mt-4">
                  By clicking "Sign Up", you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
