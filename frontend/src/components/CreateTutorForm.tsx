import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, type Tutor } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface CreateTutorFormProps {
  onProfileCompleted?: () => void;
}

const CreateTutorForm: React.FC<CreateTutorFormProps> = ({ onProfileCompleted }) => {
  const { setProfileCompleted, currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subjects: '',
    pay: '',
    bio: '',
    rating: 5.0,
    language: '',
    location: '',
    availability: '',
    experience: '',
    education: '',
    certification: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Auto-populate name and email from authenticated user
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.displayName || '',
        email: currentUser.email || ''
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
      const tutorData: Omit<Tutor, 'id'> = {
        name: formData.name,
        email: formData.email,
        subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s),
        pay: parseFloat(formData.pay),
        bio: formData.bio,
        language: formData.language,
        rating: 5.0,
        location: formData.location,
        availability: formData.availability,
        experience: formData.experience,
        education: formData.education,
        certification: formData.certification
      };

      const response = await apiService.createTutor(tutorData);
      
      setMessage(`Success: ${response.message}`);
      console.log('Created tutor:', response.data);
      
      // Mark profile as completed
      setProfileCompleted(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subjects: '',
        pay: '',
        bio: '',
        language: '',
        rating: 5.0,
        location: '',
        availability: '',
        experience: '',
        education: '',
        certification: ''
      });

      // Call callback if provided (for onboarding flow)
      if (onProfileCompleted) {
        setTimeout(() => {
          onProfileCompleted();
        }, 2000); // Show success message for 2 seconds before redirecting
      } else {
        // Navigate to tutor dashboard after successful creation
        setTimeout(() => {
          navigate('/tutor-dashboard');
        }, 2000);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Failed to create tutor'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl">
          <div className="p-6 sm:p-8">
            <h1 className="text-responsive-2xl font-bold text-gray-900 text-center mb-8">
              Create Tutor Profile
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 transition-colors"
                  placeholder="Enter your full name"
                  required
                />
                {currentUser?.displayName && (
                  <p className="text-xs text-gray-500 mt-1">Name is automatically filled from your account</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 text-gray-900 transition-colors"
                  placeholder="Enter your email address"
                  readOnly={!!currentUser?.email}
                  required
                />
                {currentUser?.email && (
                  <p className="text-xs text-gray-500 mt-1">Email is automatically filled from your account</p>
                )}
              </div>

          <div className="space-y-2">
            <label htmlFor="subjects" className="block text-sm font-medium text-gray-700">
              Subjects You Can Teach
            </label>
            <input
              type="text"
              id="subjects"
              name="subjects"
              value={formData.subjects}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="e.g. Mathematics, Physics, Chemistry"
              required
            />
            <p className="text-xs text-gray-500">Separate multiple subjects with commas</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="pay" className="block text-sm font-medium text-gray-700">
              Hourly Rate ($)
            </label>
            <input
              type="number"
              id="pay"
              name="pay"
              value={formData.pay}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="35.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">
              Language
            </label>
            <input
              type="text"
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="e.g. English, Spanish, French"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="e.g. New York City, Online"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
              Availability
            </label>
            <input
              type="text"
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="e.g. Weekdays 6-9 PM, Weekends all day"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
              Teaching Experience
            </label>
            <input
              type="text"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="e.g. 5 years private tutoring, 2 years teaching assistant"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="education" className="block text-sm font-medium text-gray-700">
              Education
            </label>
            <input
              type="text"
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="e.g. Bachelor's in Mathematics, PhD in Physics"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="certification" className="block text-sm font-medium text-gray-700">
              Certifications
            </label>
            <input
              type="text"
              id="certification"
              name="certification"
              value={formData.certification}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="e.g. Teaching License, TESOL Certificate"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Professional Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-vertical"
              placeholder="Tell students about your background, teaching experience, educational qualifications, and teaching approach..."
              required
            />
          </div>

              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
              >
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isLoading ? 'Creating Profile...' : 'Create Tutor Profile'}
              </button>
        </form>

            {message && (
              <div className={`mt-6 p-4 rounded-md ${
                message.startsWith('Success') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                <span>{message}</span>
                {message.startsWith('Success') && onProfileCompleted && (
                  <div className="mt-2 text-sm">
                    Redirecting to your dashboard...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTutorForm; 