import React from 'react';

interface EducationLevelDropdownProps {
  value: string;
  onChange: (level: string) => void;
  label: string;
  required?: boolean;
  className?: string;
  forTutor?: boolean; // Different options for tutors vs students
}

const STUDENT_EDUCATION_LEVELS = [
  'Elementary School',
  'Middle School', 
  'High School',
  'High School Graduate',
  'Some College',
  'Associate Degree',
  "Bachelor's Degree",
  "Master's Degree",
  'Doctoral Degree (PhD)',
  'Professional Degree (MD, JD, etc.)',
  'Other'
];

const TUTOR_EDUCATION_LEVELS = [
  'High School Graduate',
  'Some College',
  'Associate Degree',
  "Bachelor's Degree",
  "Bachelor's Degree (In Progress)",
  "Master's Degree", 
  "Master's Degree (In Progress)",
  'Doctoral Degree (PhD)',
  'Doctoral Degree (In Progress)',
  'Professional Degree (MD, JD, etc.)',
  'Teaching Certificate',
  'Other'
];

const EducationLevelDropdown: React.FC<EducationLevelDropdownProps> = ({ 
  value, 
  onChange, 
  label, 
  required = false,
  className = "",
  forTutor = false
}) => {
  const educationLevels = forTutor ? TUTOR_EDUCATION_LEVELS : STUDENT_EDUCATION_LEVELS;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
        required={required}
      >
        <option value="">Select education level...</option>
        {educationLevels.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EducationLevelDropdown;
