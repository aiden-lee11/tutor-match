import React, { useState, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';
import { SUBJECTS } from '../constants/subjects';

interface SubjectSearchProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  className?: string;
}

const SubjectSearch: React.FC<SubjectSearchProps> = ({
  onSearch,
  placeholder = "Search subjects...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Fuse for fuzzy search suggestions
  const fuse = useRef(new Fuse(SUBJECTS, {
    threshold: 0.4, // Slightly more lenient for suggestions
    distance: 100,
    includeScore: true,
    keys: ['']
  }));

  // Handle search with fuzzy matching for suggestions
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const results = fuse.current.search(searchTerm);
    const matches = results.map(result => result.item);
    setSuggestions(matches.slice(0, 8)); // Limit to 8 suggestions
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    onSearch(value); // Immediately trigger search
    setIsOpen(value.trim().length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    onSearch(suggestion);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleSuggestionClick(suggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => searchTerm.trim() && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
          placeholder={placeholder}
        />

        {/* Clear Button */}
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion}-${index}`}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors text-gray-900 cursor-pointer"
            >
              <span className="block truncate">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectSearch;
