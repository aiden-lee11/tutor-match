import React, { useState, useEffect } from 'react';
import { apiService, type Tutor } from '../services/api';
import { Button } from './ui/button';
import TutorDetailModal from './TutorDetailModal';
import { useAuth } from '../contexts/AuthContext';

const ClientDashboard: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser, login } = useAuth();

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTutors();
      setTutors(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load tutors. Please try again.');
      console.error('Error fetching tutors:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('⭐');
    }
    return stars.join('');
  };

  const handleTutorClick = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTutor(null);
  };

  const handleContactTutor = async (tutor: Tutor, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent opening the detail modal
    
    if (!currentUser) {
      try {
        await login();
        // After successful login, the user can click the button again to contact
      } catch (error) {
        console.error('Login failed:', error);
        alert('Failed to sign in. Please try again.');
      }
      return;
    }

    const userName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
    const subject = encodeURIComponent(`Tutoring Inquiry - ${tutor.name}`);
    const body = encodeURIComponent(`Hello,

I'm interested in connecting with ${tutor.name} for tutoring services.

Tutor Details:
- Name: ${tutor.name}
- Subjects: ${tutor.subjects.join(', ')}
- Rate: ${formatCurrency(tutor.pay)}/hr
- Rating: ${tutor.rating || 'Not rated'}

Please help me get in touch with this tutor to discuss:
- Availability for tutoring sessions
- Preferred meeting format (in-person/online)
- Specific topics or areas of focus

Thank you!

Best regards,
${userName}`);

    const mailtoLink = `mailto:jonathanschiff37@gmail.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading tutors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
          <Button onClick={fetchTutors} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Available Tutors</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Find qualified tutors in your subject areas.</p>
        </div>

        {!tutors || tutors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">No tutors available at the moment.</p>
            <Button onClick={fetchTutors} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Refresh
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <div key={tutor.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200 dark:border-gray-700 cursor-pointer flex flex-col h-full" onClick={() => handleTutorClick(tutor)}>
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-semibold">
                      {getInitials(tutor.name)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{tutor.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {tutor.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Subjects</h4>
                      <div className="flex flex-wrap gap-2">
                        {tutor.subjects.map((subject, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Rate</h4>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(tutor.pay)}/hr
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Rating</h4>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-2">{renderStars(tutor.rating || 0)}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">({tutor.rating || 0})</span>
                      </div>
                    </div>

                    {tutor.bio && (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Bio</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                          {tutor.bio}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 space-y-2 mt-auto">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                      size="sm"
                      onClick={(e) => handleContactTutor(tutor, e)}
                    >
                      {currentUser ? 'Contact Tutor' : 'Sign in to Contact'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" 
                      size="sm"
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-8 border border-blue-200 dark:border-blue-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to find your perfect tutor?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Browse through our qualified tutors and find the perfect match for your learning needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Update My Profile
              </Button>
              <Button variant="outline" size="lg" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                View All Tutors
              </Button>
            </div>
          </div>
        </div>
      </div>

      {selectedTutor && (
        <TutorDetailModal
          tutor={selectedTutor}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ClientDashboard; 