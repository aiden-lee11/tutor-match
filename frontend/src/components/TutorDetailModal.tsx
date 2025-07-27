import React, { useRef, useEffect } from 'react';
import { type Tutor } from '../services/api';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

interface TutorDetailModalProps {
  tutor: Tutor | null;
  isOpen: boolean;
  onClose: () => void;
}

const TutorDetailModal: React.FC<TutorDetailModalProps> = ({ tutor, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !tutor) return null;

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

  const handleContactTutor = () => {
    if (!currentUser) {
      alert('Please sign in to contact tutors.');
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

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Tutor Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl font-bold p-1"
          >
            ×
          </button>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="border-0 shadow-none">
            <div className="px-0 pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-semibold text-xl sm:text-2xl">
                    {getInitials(tutor.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 truncate">{tutor.name}</h3>
                    {tutor.email && (
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-1 sm:mb-2 truncate">{tutor.email}</p>
                    )}
                    <div className="flex items-center space-x-2">
                      {tutor.rating && (
                        <span className="text-base sm:text-lg text-yellow-500">
                          {renderStars(tutor.rating || 0)} ({tutor.rating?.toFixed(1) || '0.0'})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">Hourly Rate</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(tutor.pay)}/hr
                  </p>
                </div>
              </div>
            </div>
            
            <div className="px-0 space-y-4 sm:space-y-6 mt-6">
              {/* Subjects */}
              <div>
                <h4 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((subject, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio */}
              {tutor.bio && (
                <div>
                  <h4 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">About</h4>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {tutor.bio}
                  </p>
                </div>
              )}

              {/* Additional Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {tutor.location && (
                  <div>
                    <h4 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">Location</h4>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{tutor.location}</p>
                  </div>
                )}

                {tutor.language && (
                  <div>
                    <h4 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">Languages</h4>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{tutor.language}</p>
                  </div>
                )}

                {tutor.experience && (
                  <div>
                    <h4 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">Experience</h4>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{tutor.experience}</p>
                  </div>
                )}

                {tutor.education && (
                  <div>
                    <h4 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">Education</h4>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{tutor.education}</p>
                  </div>
                )}
              </div>

              {/* Contact Actions */}
              <div className="pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12 sm:h-10"
                    onClick={handleContactTutor}
                    data-contact-button
                    disabled={!currentUser}
                  >
                    {currentUser ? 'Contact Tutor' : 'Sign in to Contact'}
                  </Button>
                  {/* <Button variant="outline" className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Schedule Session
                  </Button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDetailModal; 