import React, { useState, useEffect } from 'react'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import LoginButton from './components/LoginButton'
import UserProfile from './components/UserProfile'
import CreateTutorForm from './components/CreateTutorForm'
import CreateClientForm from './components/CreateClientForm'
import ClientDashboard from './components/ClientDashboard'
import TutorDashboard from './components/TutorDashboard'
import { Button } from './components/ui/button'
import { apiService } from './services/api'

type View = 'home' | 'create-tutor' | 'create-client' | 'client-dashboard' | 'tutor-dashboard';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [backendStatus, setBackendStatus] = useState<string>('Checking...');

  useEffect(() => {
    // Check backend connection on app load
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await apiService.healthCheck();
      setBackendStatus(`✅ Backend: ${response.message}`);
    } catch (error) {
      setBackendStatus('❌ Backend: Not connected');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'create-tutor':
        return <CreateTutorForm />;
      case 'create-client':
        return <CreateClientForm />;
      case 'client-dashboard':
        return <ClientDashboard />;
      case 'tutor-dashboard':
        return <TutorDashboard />;
      default:
        return (
          <div className="home-content max-w-4xl mx-auto text-center py-12">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Tutor Platform</h2>
              <p className="text-xl text-gray-600 mb-8">Connect students with exceptional tutors for personalized learning experiences.</p>
              <div className="status mb-8">
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-green-100 text-green-800">
                  {backendStatus}
                </span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-blue-50 rounded-lg p-8">
                <h3 className="text-2xl font-semibold text-blue-900 mb-4">For Students</h3>
                <p className="text-blue-700 mb-6">Find qualified tutors in your subject area and connect with them easily.</p>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setCurrentView('client-dashboard')}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    Browse Tutors
                  </Button>
                  <Button 
                    onClick={() => setCurrentView('create-client')}
                    variant="outline"
                    className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                    size="lg"
                  >
                    Create Student Profile
                  </Button>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-8">
                <h3 className="text-2xl font-semibold text-green-900 mb-4">For Tutors</h3>
                <p className="text-green-700 mb-6">Share your expertise and connect with students who need your help.</p>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setCurrentView('tutor-dashboard')}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    View Students
                  </Button>
                  <Button 
                    onClick={() => setCurrentView('create-tutor')}
                    variant="outline"
                    className="w-full border-green-300 text-green-600 hover:bg-green-50"
                    size="lg"
                  >
                    Create Tutor Profile
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How it works</h3>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <h4 className="font-semibold mb-2">Create Profile</h4>
                  <p className="text-sm text-gray-600">Sign up as either a student or tutor and create your profile.</p>
                </div>
                <div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-blue-600 font-semibold">2</span>
                  </div>
                  <h4 className="font-semibold mb-2">Browse & Connect</h4>
                  <p className="text-sm text-gray-600">Students browse tutors, tutors view potential students.</p>
                </div>
                <div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-blue-600 font-semibold">3</span>
                  </div>
                  <h4 className="font-semibold mb-2">Start Learning</h4>
                  <p className="text-sm text-gray-600">Make contact and begin your personalized tutoring sessions.</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <AuthProvider>
      <div className="App">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <h1 className="text-2xl font-bold text-gray-900">Tutor Platform</h1>
                <nav className="hidden md:flex space-x-1">
                  <Button 
                    onClick={() => setCurrentView('home')}
                    variant={currentView === 'home' ? 'default' : 'ghost'}
                    size="sm"
                  >
                    Home
                  </Button>
                  <Button 
                    onClick={() => setCurrentView('client-dashboard')}
                    variant={currentView === 'client-dashboard' ? 'default' : 'ghost'}
                    size="sm"
                  >
                    Browse Tutors
                  </Button>
                  <Button 
                    onClick={() => setCurrentView('tutor-dashboard')}
                    variant={currentView === 'tutor-dashboard' ? 'default' : 'ghost'}
                    size="sm"
                  >
                    View Students
                  </Button>
                  <Button 
                    onClick={() => setCurrentView('create-tutor')}
                    variant={currentView === 'create-tutor' ? 'default' : 'ghost'}
                    size="sm"
                  >
                    Create Tutor
                  </Button>
                  <Button 
                    onClick={() => setCurrentView('create-client')}
                    variant={currentView === 'create-client' ? 'default' : 'ghost'}
                    size="sm"
                  >
                    Create Student
                  </Button>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <LoginButton />
                <UserProfile />
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-screen bg-gray-50">
          {renderContent()}
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
