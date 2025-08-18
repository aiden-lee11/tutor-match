import React from 'react';
import { Button } from './ui/button';
import { GraduationCap, BookOpen } from 'lucide-react';

interface UserTypeSelectionProps {
  onSelectType: (type: 'tutor' | 'student') => void;
  userEmail: string;
}

const UserTypeSelection: React.FC<UserTypeSelectionProps> = ({ onSelectType, userEmail }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-responsive-3xl font-bold text-gray-900 mb-4">
              Welcome to Tutor Match!
            </h1>
            <p className="text-responsive-lg text-gray-600 mb-2">
              Hi there, {userEmail}
            </p>
            <p className="text-responsive-base text-gray-600">
              Let's set up your profile. Are you looking to:
            </p>
          </div>

          {/* Selection Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Student Card */}
            <div 
              className="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer group flex flex-col h-full"
              onClick={() => onSelectType('student')}
            >
              <div className="p-6 sm:p-8 text-center flex flex-col h-full">
                <div className="flex-1">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h2 className="text-responsive-xl font-semibold text-gray-900 mb-3">
                    Find a Tutor
                  </h2>
                  <p className="text-gray-600 mb-6">
                    I'm a student looking for help with my studies
                  </p>
                </div>
                <div className="mt-auto">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectType('student');
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    I'm a Student
                  </Button>
                </div>
              </div>
            </div>

            {/* Tutor Card */}
            <div 
              className="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl hover:border-green-300 transition-all duration-300 cursor-pointer group flex flex-col h-full"
              onClick={() => onSelectType('tutor')}
            >
              <div className="p-6 sm:p-8 text-center flex flex-col h-full">
                <div className="flex-1">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <h2 className="text-responsive-xl font-semibold text-gray-900 mb-3">
                    Become a Tutor
                  </h2>
                  <p className="text-gray-600 mb-6">
                    I want to teach and help students learn
                  </p>
                </div>
                <div className="mt-auto">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectType('tutor');
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    I'm a Tutor
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-sm text-blue-700">
                  Don't worry, you can always change this later in your settings
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection; 