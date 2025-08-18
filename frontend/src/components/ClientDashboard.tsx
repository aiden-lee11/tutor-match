import React, { useState, useEffect } from 'react';
import { apiService, type Tutor } from '../services/api';
import { Button } from './ui/button';
import TutorDetailModal from './TutorDetailModal';
import { useAuth } from '../contexts/AuthContext';

const ClientDashboard: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { currentUser, login } = useAuth();

  // Education categories
  const educationCategories = [
    { id: 'all', name: 'All Categories', icon: '📚' },
    { id: 'elementary', name: 'Elementary School', icon: '🎒' },
    { id: 'middle', name: 'Middle School', icon: '📖' },
    { id: 'high', name: 'High School', icon: '🎓' },
    { id: 'college', name: 'College Application', icon: '🏛️' },
    { id: 'medical', name: 'Med School Application', icon: '⚕️' },
    { id: 'job', name: 'Job Application', icon: '💼' }
  ];

  useEffect(() => {
    fetchTutors();
  }, []);

  // Filter tutors based on selected category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredTutors(tutors);
    } else {
      const filtered = tutors.filter(tutor => {
        const tutorSubjects = tutor.subjects.map(s => s.toLowerCase());
        
        switch (selectedCategory) {
          case 'elementary':
            return tutorSubjects.some(subject => 
              subject.includes('elementary') || 
              subject.includes('basic') ||
              subject.includes('kindergarten') ||
              subject.includes('grade 1') || subject.includes('grade 2') || subject.includes('grade 3') ||
              subject.includes('grade 4') || subject.includes('grade 5')
            );
          case 'middle':
            return tutorSubjects.some(subject => 
              subject.includes('middle') || 
              subject.includes('grade 6') || subject.includes('grade 7') || subject.includes('grade 8') ||
              subject.includes('intermediate')
            );
          case 'high':
            return tutorSubjects.some(subject => 
              subject.includes('high school') || 
              subject.includes('grade 9') || subject.includes('grade 10') || 
              subject.includes('grade 11') || subject.includes('grade 12') ||
              subject.includes('ap ') || subject.includes('advanced placement') ||
              subject.includes('ib ') || subject.includes('international baccalaureate') ||
              subject.includes('sat') || subject.includes('act') ||
              subject.includes('algebra') || subject.includes('geometry') || 
              subject.includes('calculus') || subject.includes('physics') ||
              subject.includes('chemistry') || subject.includes('biology')
            );
          case 'college':
            return tutorSubjects.some(subject => 
              subject.includes('college') || 
              subject.includes('university') ||
              subject.includes('admission') ||
              subject.includes('application') ||
              subject.includes('essay writing') ||
              subject.includes('personal statement')
            );
          case 'medical':
            return tutorSubjects.some(subject => 
              subject.includes('mcat') || 
              subject.includes('medical') ||
              subject.includes('pre-med') ||
              subject.includes('premed') ||
              subject.includes('med school') ||
              subject.includes('anatomy') ||
              subject.includes('physiology') ||
              subject.includes('biochemistry')
            );
          case 'job':
            return tutorSubjects.some(subject => 
              subject.includes('job') || 
              subject.includes('career') ||
              subject.includes('interview') ||
              subject.includes('resume') ||
              subject.includes('professional') ||
              subject.includes('workplace')
            );
          default:
            return true;
        }
      });
      setFilteredTutors(filtered);
    }
  }, [tutors, selectedCategory]);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTutors();
      setTutors(response.data);
      setFilteredTutors(response.data);
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
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading tutors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <Button onClick={fetchTutors} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Tutors</h1>
          <p className="text-lg text-gray-600">Find qualified tutors in your subject areas.</p>
        </div>

        {/* Education Category Filter */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Education Level</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {educationCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl mb-1">{category.icon}</div>
                <div className="text-xs font-medium">{category.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        {!loading && filteredTutors && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredTutors.length} of {tutors.length} tutors
              {selectedCategory !== 'all' && (
                <span> for {educationCategories.find(cat => cat.id === selectedCategory)?.name}</span>
              )}
            </p>
          </div>
        )}

        {!filteredTutors || filteredTutors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-4">
              {selectedCategory === 'all' 
                ? 'No tutors available at the moment.' 
                : `No tutors found for ${educationCategories.find(cat => cat.id === selectedCategory)?.name}.`
              }
            </p>
            <div className="space-y-3">
              {selectedCategory !== 'all' && (
                <Button 
                  onClick={() => setSelectedCategory('all')} 
                  variant="outline" 
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  View All Tutors
                </Button>
              )}
              <Button onClick={fetchTutors} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                Refresh
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutors.map((tutor) => (
              <div key={tutor.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200 cursor-pointer flex flex-col h-full" onClick={() => handleTutorClick(tutor)}>
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                      {getInitials(tutor.name)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{tutor.name}</h3>
                      <p className="text-sm text-gray-500">
                        {tutor.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Subjects</h4>
                      <div className="flex flex-wrap gap-2">
                        {tutor.subjects.map((subject, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Rate</h4>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(tutor.pay)}/hr
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Rating</h4>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-2">{renderStars(tutor.rating || 0)}</span>
                        <span className="text-sm text-gray-600">({tutor.rating || 0})</span>
                      </div>
                    </div>

                    {tutor.bio && (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Bio</h4>
                        <p className="text-sm text-gray-600 line-clamp-3">
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
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50" 
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
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 border border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to find your perfect tutor?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Browse through our qualified tutors and find the perfect match for your learning needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Update My Profile
              </Button>
              <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50">
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