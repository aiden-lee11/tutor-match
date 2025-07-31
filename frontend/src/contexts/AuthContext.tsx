import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { apiService } from '../services/api';

export type UserType = 'tutor' | 'student' | null;

interface AuthContextType {
  currentUser: User | null;
  userType: UserType;
  hasCompletedProfile: boolean;
  isAdmin: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  setUserType: (type: UserType) => void;
  setProfileCompleted: (completed: boolean) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Admin email list - you can configure this or move to environment variables
  const adminEmails: string[] = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];

  const checkAdminStatus = (email: string | null) => {
    if (!email) {
      setIsAdmin(false);
      return false;
    }
    const adminStatus = adminEmails.some(adminEmail => 
      email.toLowerCase() === adminEmail.toLowerCase()
    );
    setIsAdmin(adminStatus);
    return adminStatus;
  };

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Clear local storage on logout
      localStorage.removeItem('userType');
      localStorage.removeItem('hasCompletedProfile');
      setUserType(null);
      setHasCompletedProfile(false);
      setIsAdmin(false);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const setUserTypeAndPersist = (type: UserType) => {
    setUserType(type);
    if (type) {
      localStorage.setItem('userType', type);
    } else {
      localStorage.removeItem('userType');
    }
  };

  const setProfileCompleted = (completed: boolean) => {
    setHasCompletedProfile(completed);
    localStorage.setItem('hasCompletedProfile', completed.toString());
  };

  // Check for existing profile in the database
  const checkExistingProfile = async (user: User) => {
    if (!user.email) return;

    try {
      const profileCheck = await apiService.checkUserProfile(user.email);
      
      if (profileCheck.hasProfile) {
        // User has an existing profile, set the state accordingly
        setUserType(profileCheck.userType);
        setHasCompletedProfile(true);
        
        // Also save to localStorage for faster subsequent loads
        if (profileCheck.userType) {
          localStorage.setItem('userType', profileCheck.userType);
        }
        localStorage.setItem('hasCompletedProfile', 'true');
        
        console.log(`Found existing ${profileCheck.userType} profile for ${user.email}`);
      } else {
        // No existing profile, check localStorage for any previous session data
        const savedUserType = localStorage.getItem('userType') as UserType;
        const savedProfileStatus = localStorage.getItem('hasCompletedProfile') === 'true';
        
        setUserType(savedUserType);
        setHasCompletedProfile(savedProfileStatus);
      }
    } catch (error) {
      console.error('Error checking existing profile:', error);
      // Fallback to localStorage if API check fails
      const savedUserType = localStorage.getItem('userType') as UserType;
      const savedProfileStatus = localStorage.getItem('hasCompletedProfile') === 'true';
      
      setUserType(savedUserType);
      setHasCompletedProfile(savedProfileStatus);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Check admin status
        checkAdminStatus(user.email);
        
        // Check for existing profile in database
        await checkExistingProfile(user);
        
        // Clear any stored redirect path when user signs in
        localStorage.removeItem('redirectAfterLogin');
      } else {
        // Clear state when user logs out
        setUserType(null);
        setHasCompletedProfile(false);
        setIsAdmin(false);
        localStorage.removeItem('userType');
        localStorage.removeItem('hasCompletedProfile');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userType,
    hasCompletedProfile,
    isAdmin,
    login,
    logout,
    setUserType: setUserTypeAndPersist,
    setProfileCompleted,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 