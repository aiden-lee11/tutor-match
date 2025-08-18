import React, { useState, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';
import { SUBJECTS } from '../constants/subjects';

interface SearchableSubjectDropdownProps {
  selectedSubjects: string[];
  onSubjectsChange: (subjects: string[]) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
}

const SearchableSubjectDropdown: React.FC<SearchableSubjectDropdownProps> = ({
  selectedSubjects,
  onSubjectsChange,
  placeholder = "Search and select subjects...",
  className = "",
  label,
  required = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [customSubject, setCustomSubject] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [filteredSubjects, setFilteredSubjects] = useState<string[]>(SUBJECTS);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Fuse for fuzzy search
  const fuse = useRef(new Fuse(SUBJECTS, {
    threshold: 0.3, // Lower = more strict matching
    distance: 100,
    includeScore: true,
    keys: ['']
  }));

  // Handle search with fuzzy matching
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSubjects(SUBJECTS.slice(0, 20)); // Show first 20 subjects
      setShowCustomInput(false);
      return;
    }

    const results = fuse.current.search(searchTerm);
    const matches = results.map(result => result.item);
    
    if (matches.length === 0) {
      setFilteredSubjects([]);
      setShowCustomInput(true);
    } else {
      setFilteredSubjects(matches.slice(0, 15)); // Limit to 15 results
      setShowCustomInput(false);
    }
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setShowCustomInput(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubjectSelect = (subject: string) => {
    if (!selectedSubjects.includes(subject)) {
      onSubjectsChange([...selectedSubjects, subject]);
    }
    setSearchTerm('');
    setIsOpen(false);
    setShowCustomInput(false);
  };

  const handleRemoveSubject = (subjectToRemove: string) => {
    onSubjectsChange(selectedSubjects.filter(subject => subject !== subjectToRemove));
  };

  const handleCustomSubjectAdd = () => {
    if (customSubject.trim() && !selectedSubjects.includes(customSubject.trim())) {
      onSubjectsChange([...selectedSubjects, customSubject.trim()]);
      setCustomSubject('');
      setSearchTerm('');
      setIsOpen(false);
      setShowCustomInput(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showCustomInput && customSubject.trim()) {
        handleCustomSubjectAdd();
      } else if (filteredSubjects.length > 0) {
        handleSubjectSelect(filteredSubjects[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
      setShowCustomInput(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative" ref={dropdownRef}>
        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder={placeholder}
        />

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {/* Filtered subjects */}
            {filteredSubjects.map((subject) => (
              <button
                key={subject}
                type="button"
                onClick={() => handleSubjectSelect(subject)}
                disabled={selectedSubjects.includes(subject)}
                className={`w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors ${
                  selectedSubjects.includes(subject)
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'text-gray-900 cursor-pointer'
                }`}
              >
                <span className="block truncate">{subject}</span>
                {selectedSubjects.includes(subject) && (
                  <span className="text-xs text-gray-500">Already selected</span>
                )}
              </button>
            ))}

            {/* Custom subject input */}
            {showCustomInput && (
              <div className="border-t border-gray-200 p-3">
                <div className="text-sm text-gray-600 mb-2">No matches found. Add a custom subject:</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCustomSubjectAdd();
                      }
                    }}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter custom subject"
                  />
                  <button
                    type="button"
                    onClick={handleCustomSubjectAdd}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* No results message */}
            {filteredSubjects.length === 0 && !showCustomInput && searchTerm.trim() && (
              <div className="px-3 py-2 text-gray-500 text-sm">
                No subjects found. Try a different search term.
              </div>
            )}

            {/* Initial message when dropdown opens */}
            {!searchTerm.trim() && (
              <div className="px-3 py-2 text-gray-500 text-sm">
                Start typing to search subjects or browse the list below...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected subjects */}
      {selectedSubjects.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md">
          {selectedSubjects.map((subject) => (
            <span
              key={subject}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {subject}
              <button
                type="button"
                onClick={() => handleRemoveSubject(subject)}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Hidden input for form validation */}
      <input
        type="hidden"
        value={selectedSubjects.join(', ')}
        required={required && selectedSubjects.length === 0}
      />

      {/* Helper text */}
      <p className="text-xs text-gray-500">
        Search and select multiple subjects. If you don't find what you're looking for, type it in and we'll add it as a custom option.
      </p>
    </div>
  );
};

export default SearchableSubjectDropdown;
