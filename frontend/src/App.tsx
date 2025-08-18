import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, GraduationCap, Menu, X, Home, Users, UserCheck, Shield } from 'lucide-react'
import './App.css'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import LoginButton from './components/LoginButton'
import UserProfile from './components/UserProfile'
import CreateTutorForm from './components/CreateTutorForm'
import CreateClientForm from './components/CreateClientForm'
import ClientDashboard from './components/ClientDashboard'
import TutorDashboard from './components/TutorDashboard'
import AdminDashboard from './components/AdminDashboard'
import UserTypeSelection from './components/UserTypeSelection'

import { apiService } from './services/api'

// Home Page Component
const HomePage: React.FC = () => {
  const { currentUser, userType, hasCompletedProfile } = useAuth();

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await apiService.healthCheck();
      console.log(`✅ Backend: ${response.message}`);
    } catch (error) {
      console.log('❌ Backend: Not connected');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <section className="mb-12">
                          <h1 className="text-responsive-3xl font-bold text-gray-900 mb-6">
                Welcome to Tutor Match
              </h1>
            <p className="text-responsive-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect students with exceptional tutors for personalized learning experiences.
            </p>
            
            {/* Backend Status */}
            {/* <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {backendStatus}
              </span>
            </div> */}
          </section>
          
          {/* User Dashboard Section */}
          {currentUser && userType && hasCompletedProfile ? (
            <section className="mb-12">
              <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                <h2 className="text-responsive-xl font-semibold text-gray-900 mb-4">
                  Welcome back, {currentUser.displayName || currentUser.email}!
                </h2>
                <p className="text-gray-600 mb-6">
                  You're signed in as a {userType === 'student' ? 'student' : 'tutor'}.
                </p>
                <div className="flex justify-center">
                  <Link 
                    to={userType === 'student' ? '/client-dashboard' : '/tutor-dashboard'}
                    className={`px-6 py-3 rounded-lg font-medium inline-block ${
                      userType === 'student' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    Go to My Dashboard
                  </Link>
                </div>
              </div>
            </section>
          ) : (
            /* Feature Cards Section */
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {/* Student Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 border border-blue-200 flex flex-col">
                <div className="flex-1">
                  <h2 className="text-responsive-xl font-semibold text-blue-600 mb-4">
                    For Students
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Find qualified tutors in your subject area and connect with them easily.
                  </p>
                  <div className="space-y-3">
                    <Link 
                      to="/client-dashboard"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-block text-center"
                    >
                      Browse Tutors
                    </Link>
                    {!currentUser && (
                      <Link 
                        to="/create-client"
                        className="w-full bg-white border-2 border-blue-300 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-all duration-200 inline-block text-center"
                      >
                        Create Student Profile
                      </Link>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <BookOpen className="w-8 h-8" />
                  </div>
                </div>
              </div>
              
              {/* Tutor Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 border border-green-200 flex flex-col">
                <div className="flex-1">
                  <h2 className="text-responsive-xl font-semibold text-green-600 mb-4">
                    For Tutors
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Share your expertise and connect with students who need your help.
                  </p>
                  <div className="space-y-3">
                    <Link 
                      to="/tutor-dashboard"
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium inline-block text-center"
                    >
                      View Students
                    </Link>
                    {!currentUser && (
                      <Link 
                        to="/create-tutor"
                        className="w-full bg-white border-2 border-green-300 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-medium transition-all duration-200 inline-block text-center"
                      >
                        Create Tutor Profile
                      </Link>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </section>
          )}
          
          {/* How It Works Section */}
          <section className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <h2 className="text-responsive-xl font-semibold text-gray-900 mb-8">
              How it works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="font-semibold text-responsive-base mb-2 text-gray-900">Create Profile</h3>
                <p className="text-sm text-gray-600">
                  Sign up as either a student or tutor and create your profile.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="font-semibold text-responsive-base mb-2 text-gray-900">Browse & Connect</h3>
                <p className="text-sm text-gray-600">
                  Students browse tutors, tutors view potential students.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="font-semibold text-responsive-base mb-2 text-gray-900">Start Learning</h3>
                <p className="text-sm text-gray-600">
                  Make contact and begin your personalized tutoring sessions.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

// Layout Component with Header and Footer
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {/* Hamburger menu button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 mr-3"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              {/* Logo */}
              <Link 
                to="/" 
                className="text-xl font-bold text-gray-900 hover:text-gray-700"
              >
                Tutor Match
              </Link>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              <LoginButton />
              <UserProfile />
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay - Transparent click area to close sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">Navigation</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <Link 
              to="/"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5 mr-3" />
              Home
            </Link>
            <Link 
              to="/client-dashboard"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/client-dashboard' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-5 h-5 mr-3" />
              Browse Tutors
            </Link>
            <Link 
              to="/tutor-dashboard"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/tutor-dashboard' 
                  ? 'bg-green-100 text-green-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5 mr-3" />
              View Students
            </Link>
            
            {/* Profile Creation Links */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Create Profile
              </p>
              <Link 
                to="/create-user"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/create-user' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <UserCheck className="w-5 h-5 mr-3" />
                Get Started
              </Link>
              <Link 
                to="/create-client"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/create-client' 
                                      ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <UserCheck className="w-5 h-5 mr-3" />
                Student Profile
              </Link>
              <Link 
                to="/create-tutor"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/create-tutor' 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <GraduationCap className="w-5 h-5 mr-3" />
                Tutor Profile
              </Link>
            </div>

            {/* Admin Link */}
            {isAdmin && (
              <div className="pt-4 border-t border-gray-200">
                <Link 
                  to="/admin"
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/admin' 
                                          ? 'bg-red-100 text-red-700' 
                    : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  <Shield className="w-5 h-5 mr-3" />
                  Admin Dashboard
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen">
        {children}
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-bold text-lg text-gray-900">
            Tutor Match
          </p>
          <p className="text-gray-600 mt-2">
            Connecting students with exceptional tutors since 2024
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Copyright © 2025 - All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

// App Routes Component
const AppRoutes: React.FC = () => {
  const { currentUser, userType, setUserType } = useAuth();
  const navigate = useNavigate();

  // Redirect new users to create-user page if they don't have a user type
  React.useEffect(() => {
    if (currentUser && !userType) {
      navigate('/create-user');
    }
  }, [currentUser, userType, navigate]);

  return (
    <Routes>
      <Route path="/" element={
        <Layout>
          <HomePage />
        </Layout>
      } />
      <Route path="/create-user" element={
        <Layout>
          <UserTypeSelection 
            onSelectType={(type) => {
              setUserType(type);
            }}
            userEmail={currentUser?.email || 'there'}
          />
        </Layout>
      } />
      <Route path="/create-tutor" element={
        <Layout>
          <CreateTutorForm />
        </Layout>
      } />
      <Route path="/create-client" element={
        <Layout>
          <CreateClientForm />
        </Layout>
      } />
      <Route path="/client-dashboard" element={
        <Layout>
          <ClientDashboard />
        </Layout>
      } />
      <Route path="/tutor-dashboard" element={
        <Layout>
          <TutorDashboard />
        </Layout>
      } />
      <Route path="/admin" element={
        <Layout>
          <AdminDashboard />
        </Layout>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
