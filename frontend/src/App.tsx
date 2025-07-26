import React from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginButton from './components/LoginButton';
import UserProfile from './components/UserProfile';
import './App.css';

function App() {
  const { currentUser } = useAuth();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Tutor App</h1>
        {currentUser ? (
          <UserProfile />
        ) : (
          <div className="login-section">
            <h2>Welcome to Tutor</h2>
            <p>Please sign in to continue</p>
            <LoginButton />
          </div>
        )}
      </header>
      
      {currentUser && (
        <main className="app-main">
          <div className="welcome-message">
            <h2>Welcome back, {currentUser.displayName}!</h2>
            <p>You are successfully logged in.</p>
            {/* Add your main app content here */}
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
