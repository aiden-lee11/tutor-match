import React from 'react';

interface LanguageDropdownProps {
  value: string;
  onChange: (language: string) => void;
  label: string;
  required?: boolean;
  className?: string;
}

const LANGUAGES = [
  'English',
  'Spanish', 
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Russian',
  'Chinese (Mandarin)',
  'Chinese (Cantonese)',
  'Japanese',
  'Korean',
  'Arabic',
  'Hindi',
  'Dutch',
  'Swedish',
  'Norwegian',
  'Danish',
  'Polish',
  'Turkish',
  'Greek',
  'Hebrew',
  'Vietnamese',
  'Thai',
  'Indonesian',
  'Malay',
  'Filipino',
  'Other'
];

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ 
  value, 
  onChange, 
  label, 
  required = false,
  className = ""
}) => {
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
        <option value="">Select a language...</option>
        {LANGUAGES.map((language) => (
          <option key={language} value={language}>
            {language}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageDropdown;
