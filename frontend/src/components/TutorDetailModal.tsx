import React from 'react';
import { type Tutor } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';

interface TutorDetailModalProps {
  tutor: Tutor | null;
  isOpen: boolean;
  onClose: () => void;
}

const TutorDetailModal: React.FC<TutorDetailModalProps> = ({ tutor, isOpen, onClose }) => {
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

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tutor Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="p-6">
          <div className="border-0 shadow-none">
            <div className="px-0 pt-0">
              <div className="flex items-center space-x-6">
                <div className="h-20 w-20 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-semibold text-2xl">
                  {getInitials(tutor.name)}
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{tutor.name}</h3>
                  {tutor.email && (
                    <p className="text-gray-600 dark:text-gray-300 mb-2">{tutor.email}</p>
                  )}
                  <div className="flex items-center space-x-2">
                    {tutor.rating && (
                      <span className="text-lg text-yellow-500">
                        {renderStars(tutor.rating || 0)} ({tutor.rating?.toFixed(1) || '0.0'})
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Hourly Rate</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(tutor.pay)}/hr
                  </p>
                </div>
              </div>
            </div>
            
            <div className="px-0 space-y-6">
              {/* Subjects */}
              <div>
                <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((subject, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio */}
              {tutor.bio && (
                <div>
                  <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">About</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {tutor.bio}
                  </p>
                </div>
              )}

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tutor.location && (
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">Location</h4>
                    <p className="text-gray-600 dark:text-gray-300">{tutor.location}</p>
                  </div>
                )}

                {tutor.language && (
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">Languages</h4>
                    <p className="text-gray-600 dark:text-gray-300">{tutor.language}</p>
                  </div>
                )}

                {tutor.experience && (
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">Experience</h4>
                    <p className="text-gray-600 dark:text-gray-300">{tutor.experience}</p>
                  </div>
                )}

                {tutor.education && (
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">Education</h4>
                    <p className="text-gray-600 dark:text-gray-300">{tutor.education}</p>
                  </div>
                )}
              </div>

              {/* Contact Actions */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                    Contact Tutor
                  </Button>
                  <Button variant="outline" className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Schedule Session
                  </Button>
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