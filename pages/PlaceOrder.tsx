import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createOrder, uploadFile } from '../services/appwrite';
import { UserRole } from '../constants';
import Input from '../components/Input';
import Button from '../components/Button';

const PlaceOrder: React.FC = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Double check protection (though PrivateRoute handles it)
  if (role !== UserRole.ADMIN) {
      return <div className="p-8 text-center text-red-500">Access Denied. Only Admins can create assignments.</div>;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setError('');
    setLoading(true);

    try {
      let fileId = undefined;
      
      // 1. Upload file if exists
      if (file) {
        const uploadedFile = await uploadFile(file);
        fileId = uploadedFile.$id;
      }

      // 2. Create Order (Assignment)
      await createOrder(user.$id, {
        title,
        description,
        deadline,
        fileId,
      });

      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      setError('Failed to create assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-blue rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-primary px-6 py-4">
            <h1 className="text-xl font-bold text-white">Create New Assignment</h1>
            <p className="text-indigo-100 text-sm">Post a new task for all students.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <Input
            label="Assignment Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g., Physics Lab Report #3"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instructions / Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[150px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Provide detailed instructions for the students..."
            />
          </div>

          <Input
            label="Due Date"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reference Material (PDF/DOC)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-indigo-500 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                    {file ? `Selected: ${file.name}` : 'PDF, DOCX up to 10MB'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
             <Button type="button" variant="secondary" onClick={() => navigate('/admin')}>
                Cancel
             </Button>
             <Button type="submit" isLoading={loading}>
                Create Assignment
             </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;