import React, { useState, useEffect } from 'react';
import { apiService, Client } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface CreateClientFormProps {
  onProfileCompleted?: () => void;
}

const CreateClientForm: React.FC<CreateClientFormProps> = ({ onProfileCompleted }) => {
  const { setProfileCompleted, currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subjects: '',
    budget: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Auto-populate email from authenticated user
  useEffect(() => {
    if (currentUser?.email) {
      setFormData(prev => ({
        ...prev,
        email: currentUser.email || '',
        name: currentUser.displayName || ''
      }));
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const clientData: Omit<Client, 'id'> = {
        name: formData.name,
        email: formData.email,
        subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s),
        budget: parseFloat(formData.budget),
        description: formData.description
      };

      const response = await apiService.createClient(clientData);
      
      setMessage(`Success: ${response.message}`);
      console.log('Created client:', response.data);
      
      // Mark profile as completed
      setProfileCompleted(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subjects: '',
        budget: '',
        description: ''
      });

      // Call callback if provided (for onboarding flow)
      if (onProfileCompleted) {
        setTimeout(() => {
          onProfileCompleted();
        }, 2000); // Show success message for 2 seconds before redirecting
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Failed to create client'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Create Student Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50"
              placeholder="Enter your email address"
              readOnly={!!currentUser?.email}
              required
            />
            {currentUser?.email && (
              <p className="text-xs text-gray-500">Email is automatically filled from your account</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="subjects" className="block text-sm font-medium text-gray-700">
              Subjects You Need Help With
            </label>
            <input
              type="text"
              id="subjects"
              name="subjects"
              value={formData.subjects}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g. Mathematics, Physics, Chemistry"
              required
            />
            <p className="text-xs text-gray-500">Separate multiple subjects with commas</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
              Budget per Hour ($)
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="25.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Additional Information (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
              placeholder="Tell us about your learning goals, preferred learning style, or any specific requirements..."
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creating Profile...' : 'Create Student Profile'}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-md ${
            message.startsWith('Success') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
            {message.startsWith('Success') && onProfileCompleted && (
              <div className="mt-2 text-sm">
                Redirecting to your dashboard...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateClientForm; 