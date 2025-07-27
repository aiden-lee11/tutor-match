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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Tutor Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="p-6">
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0 pt-0">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-2xl">
                    {getInitials(tutor.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2">{tutor.name}</CardTitle>
                  {tutor.email && (
                    <p className="text-gray-600 mb-2">{tutor.email}</p>
                  )}
                  <CardDescription className="flex items-center space-x-2">
                    {tutor.rating && (
                      <span className="text-lg">
                        {renderStars(tutor.rating)} ({tutor.rating.toFixed(1)})
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Hourly Rate</p>
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(tutor.pay)}/hr
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="px-0 space-y-6">
              {/* Subjects */}
              <div>
                <h4 className="font-semibold text-lg text-gray-800 mb-3">Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((subject, index) => (
                    <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Bio */}
              {tutor.bio && (
                <div>
                  <h4 className="font-semibold text-lg text-gray-800 mb-3">About</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {tutor.bio}
                  </p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tutor.language && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 mb-2">Language</h4>
                    <p className="text-gray-800">{tutor.language}</p>
                  </div>
                )}

                {tutor.location && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 mb-2">Location</h4>
                    <p className="text-gray-800">{tutor.location}</p>
                  </div>
                )}

                {tutor.availability && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 mb-2">Availability</h4>
                    <p className="text-gray-800">{tutor.availability}</p>
                  </div>
                )}

                {tutor.experience && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 mb-2">Experience</h4>
                    <p className="text-gray-800">{tutor.experience}</p>
                  </div>
                )}

                {tutor.education && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 mb-2">Education</h4>
                    <p className="text-gray-800">{tutor.education}</p>
                  </div>
                )}

                {tutor.certification && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 mb-2">Certifications</h4>
                    <p className="text-gray-800">{tutor.certification}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button className="flex-1" size="lg">
                  Contact Tutor
                </Button>
                <Button variant="outline" size="lg">
                  Save to Favorites
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TutorDetailModal; 