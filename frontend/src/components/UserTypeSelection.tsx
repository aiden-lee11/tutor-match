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
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Tutor Platform!</h2>
          <p className="text-lg text-gray-600 mb-2">Hi there, {userEmail}</p>
          <p className="text-gray-600">Let's set up your profile. Are you looking to:</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
               onClick={() => onSelectType('student')}>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Find a Tutor</h3>
              <p className="text-gray-600 mb-6">I'm a student looking for help with my studies</p>
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectType('student');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                I'm a Student
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 hover:border-green-300 hover:shadow-md transition-all cursor-pointer group"
               onClick={() => onSelectType('tutor')}>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <GraduationCap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Become a Tutor</h3>
              <p className="text-gray-600 mb-6">I want to teach and help students learn</p>
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectType('tutor');
                }}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                I'm a Tutor
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don't worry, you can always change this later in your settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection; 