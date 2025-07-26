import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="user-profile">
      <div className="user-info">
        <img 
          src={currentUser.photoURL || '/default-avatar.png'} 
          alt="Profile"
          className="user-avatar"
        />
        <div className="user-details">
          <h3>{currentUser.displayName}</h3>
          <p>{currentUser.email}</p>
        </div>
      </div>
      <button onClick={handleLogout} className="logout-btn">
        Sign Out
      </button>
    </div>
  );
};

export default UserProfile; 