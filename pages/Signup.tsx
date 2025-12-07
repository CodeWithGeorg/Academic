
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { account, createUserDocument, uniqueId } from '../services/appwrite';
import Input from '../components/Input';
import Button from '../components/Button';
import { UserRole } from '../constants';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  
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
      
      // 1. Create Auth Account
      await account.create(userId, email, password, name);
      
      // 2. IMMEDIATE LOGIN (CRITICAL STEP)
      // We must create a session immediately so the user is authenticated 
      // when we try to create the user document in the database next.
      await account.createEmailPasswordSession(email, password);

      // 3. Create User Document in DB for role management
      // Now running as an Authenticated User, so permissions will work correctly.
      await createUserDocument(userId, name, email, UserRole.CLIENT);

      // Redirect to login (or dashboard since we just logged them in)
      // Navigating to login for a clean flow, or dashboard if you prefer auto-entry.
      // Since we just logged them in, we can go straight to dashboard/login check.
      navigate('/login'); 
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Registration failed.');
      // If session was created but DB failed, we should probably log them out or warn
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-indigo-500">
              Log in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
              {error}
            </div>
          )}
          <div className="space-y-4">
             <Input
              id="name"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              label="Full Name"
            />
            <Input
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              label="Email"
            />
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              label="Password"
            />
          </div>

          <Button type="submit" className="w-full" isLoading={loading}>
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
