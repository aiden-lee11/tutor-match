import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';

const UserProfile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Don't show anything if user is not signed in
  if (!currentUser) {
    return null;
  }

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Clean profile photo button */}
      <Button
        variant="ghost"
        className="relative h-10 w-10 rounded-full p-0 hover:ring-2 hover:ring-gray-200 transition-all"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={currentUser.photoURL || undefined} alt="Profile" />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
            {getInitials(currentUser.displayName)}
          </AvatarFallback>
        </Avatar>
      </Button>

      {/* Minimal dropdown */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">
              {currentUser.displayName || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {currentUser.email}
            </p>
          </div>
          
          {/* Actions */}
          <div className="py-1">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 