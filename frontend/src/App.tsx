import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, GraduationCap } from 'lucide-react'
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
import ThemeToggle from './components/ThemeToggle'
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
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <section className="mb-12">
                          <h1 className="text-responsive-3xl font-bold text-gray-900 dark:text-white mb-6">
                Welcome to Tutor Match
              </h1>
            <p className="text-responsive-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect students with exceptional tutors for personalized learning experiences.
            </p>
            
            {/* Backend Status */}
            {/* <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {backendStatus}
              </span>
            </div> */}
          </section>
          
          {/* User Dashboard Section */}
          {currentUser && userType && hasCompletedProfile ? (
            <section className="mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
                <h2 className="text-responsive-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Welcome back, {currentUser.displayName || currentUser.email}!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
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
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 border border-blue-200 dark:border-blue-700 flex flex-col">
                <div className="flex-1">
                  <h2 className="text-responsive-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
                    For Students
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
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
                        className="w-full bg-white dark:bg-gray-800 border-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/20 px-6 py-3 rounded-lg font-medium transition-all duration-200 inline-block text-center"
                      >
                        Create Student Profile
                      </Link>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                    <BookOpen className="w-8 h-8" />
                  </div>
                </div>
              </div>
              
              {/* Tutor Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 border border-green-200 dark:border-green-700 flex flex-col">
                <div className="flex-1">
                  <h2 className="text-responsive-xl font-semibold text-green-600 dark:text-green-400 mb-4">
                    For Tutors
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
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
                        className="w-full bg-white dark:bg-gray-800 border-2 border-green-300 text-green-600 hover:bg-green-50 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-900/20 px-6 py-3 rounded-lg font-medium transition-all duration-200 inline-block text-center"
                      >
                        Create Tutor Profile
                      </Link>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </section>
          )}
          
          {/* How It Works Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
            <h2 className="text-responsive-xl font-semibold text-gray-900 dark:text-white mb-8">
              How it works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="font-semibold text-responsive-base mb-2 text-gray-900 dark:text-white">Create Profile</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Sign up as either a student or tutor and create your profile.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="font-semibold text-responsive-base mb-2 text-gray-900 dark:text-white">Browse & Connect</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Students browse tutors, tutors view potential students.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="font-semibold text-responsive-base mb-2 text-gray-900 dark:text-white">Start Learning</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
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
  const { currentUser, userType, hasCompletedProfile, isAdmin } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                  </svg>
                </button>
              </div>
              
              {/* Logo */}
              <Link 
                to="/" 
                className="text-xl font-bold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
              >
                Tutor Match
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              {(!currentUser || (currentUser && userType && hasCompletedProfile)) && (
                <>
                  <Link 
                    to="/"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/' 
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                        : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'
                    }`}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/client-dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/client-dashboard' 
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                        : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'
                    }`}
                  >
                    Browse Tutors
                  </Link>
                  <Link 
                    to="/tutor-dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/tutor-dashboard' 
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                        : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'
                    }`}
                  >
                    View Students
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === '/admin' 
                          ? 'bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100' 
                          : 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300'
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <LoginButton />
              <UserProfile />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="min-h-screen">
        {children}
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-bold text-lg text-gray-900 dark:text-white">
            Tutor Match
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Connecting students with exceptional tutors since 2024
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Copyright © 2025 - All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

// App Routes Component
const AppRoutes: React.FC = () => {
  const { currentUser, userType, hasCompletedProfile, setUserType } = useAuth();
  const navigate = useNavigate();

  // Show type selection if user is logged in but hasn't selected a type yet
  if (currentUser && !userType) {
    return (
      <Layout>
        <UserTypeSelection 
          onSelectType={(type) => {
            setUserType(type);
          }}
          userEmail={currentUser.email || 'there'}
        />
      </Layout>
    );
  }

  // Show profile creation if user has selected type but hasn't completed profile
  if (currentUser && userType && !hasCompletedProfile) {
    if (userType === 'tutor') {
      return (
        <Layout>
          <CreateTutorForm onProfileCompleted={() => {
            // Navigate to tutor dashboard after profile completion
            navigate('/tutor-dashboard');
          }} />
        </Layout>
      );
    } else {
      return (
        <Layout>
          <CreateClientForm onProfileCompleted={() => {
            // Navigate to client dashboard after profile completion
            navigate('/client-dashboard');
          }} />
        </Layout>
      );
    }
  }

  return (
    <Routes>
      <Route path="/" element={
        <Layout>
          <HomePage />
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
