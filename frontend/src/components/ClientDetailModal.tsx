import React, { useRef, useEffect } from 'react';
import { type Client } from '../services/api';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

interface ClientDetailModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

const ClientDetailModal: React.FC<ClientDetailModalProps> = ({ client, isOpen, onClose }) => {
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

  if (!isOpen || !client) return null;

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

  const handleContactStudent = () => {
    if (!currentUser) {
      alert('Please sign in to contact students.');
      return;
    }

    const userName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
    const subject = encodeURIComponent(`Tutoring Opportunity - ${client.name}`);
    const body = encodeURIComponent(`Hello,

I'm interested in connecting with ${client.name} for tutoring services.

Student Details:
- Name: ${client.name}
- Subjects of interest: ${client.subjects.join(', ')}
- Budget: ${formatCurrency(client.budget)}/hr
- Description: ${client.description || 'No description provided'}

Please help me get in touch with this student to discuss:
- My availability for tutoring sessions
- My experience with their subjects of interest
- Preferred meeting format (in-person/online)
- Scheduling and session details

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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Student Profile</h2>
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
                  <div className="h-16 w-16 sm:h-20 sm:w-20 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center font-semibold text-xl sm:text-2xl">
                    {getInitials(client.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 truncate">{client.name}</h3>
                    {client.email && (
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-1 sm:mb-2 truncate">{client.email}</p>
                    )}
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">Budget</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(client.budget)}/hr
                  </p>
                </div>
              </div>
            </div>
            
            <div className="px-0 space-y-4 sm:space-y-6 mt-6">
              {/* Subjects */}
              <div>
                <h4 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">Looking for help with</h4>
                <div className="flex flex-wrap gap-2">
                  {client.subjects.map((subject, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              {client.description && (
                <div>
                  <h4 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">About</h4>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {client.description}
                  </p>
                </div>
              )}

              {/* Additional Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {client.location && (
                  <div>
                    <h4 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">Location</h4>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{client.location}</p>
                  </div>
                )}

                {client.language && (
                  <div>
                    <h4 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">Languages</h4>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{client.language}</p>
                  </div>
                )}

                {client.availability && (
                  <div>
                    <h4 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">Availability</h4>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{client.availability}</p>
                  </div>
                )}

                {client.education && (
                  <div>
                    <h4 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">Education Level</h4>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{client.education}</p>
                  </div>
                )}
              </div>

              {/* Contact Actions */}
              <div className="pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 sm:h-10"
                    onClick={handleContactStudent}
                    data-contact-student-button
                    disabled={!currentUser}
                  >
                    {currentUser ? 'Contact Student' : 'Sign in to Contact'}
                  </Button>
                  {/* <Button variant="outline" className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 h-12 sm:h-10">
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

export default ClientDetailModal; 