
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createMessage } from '../services/appwrite';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const Contact: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setError('');
    setLoading(true);

    try {
        await createMessage(user.$id, user.name, subject, content);
        setSuccess(true);
        setTimeout(() => {
            navigate('/dashboard');
        }, 2000);
    } catch (err: any) {
        console.error(err);
        setError('Failed to send message.');
    } finally {
        setLoading(false);
    }
  };

  if (success) {
      return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
              <div className="bg-green-100 text-green-800 p-8 rounded-full mb-4">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Message Sent!</h2>
              <p className="text-gray-600 mt-2">The admin will review your request shortly.</p>
          </div>
      );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-secondary px-6 py-4">
            <h1 className="text-xl font-bold text-white">Contact Admin</h1>
            <p className="text-gray-300 text-sm">Request new assignments or ask for help.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
           {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <Input
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            placeholder="e.g., Request for Chemistry Assignment"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message / Request Details
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[150px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Please describe what assignment you would like to be posted..."
            />
          </div>

          <div className="pt-2 flex justify-end">
             <Button type="submit" isLoading={loading}>
                Send Message
             </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
