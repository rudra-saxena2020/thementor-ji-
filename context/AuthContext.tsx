import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { PREMIUM_AVATARS } from '../data/staticData';
import { refreshToken as refreshAuthToken, logout as logoutUser, getUserInfo as fetchUserInfo } from '../services/authService';

// 7️⃣ SECURITY DISCLAIMER (MANDATORY)
// This auth flow is MVP-level and frontend-only. Token authenticity is not verified server-side.
// We trust the token signature validation occurred on the backend before redirection.

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: string;
  exp: number;
  class?: string | null;
  bio?: string;
  location?: string;
  joinedDate?: string;
  
  // Extended Profile Fields
  schoolName?: string;
  board?: string;
  favSubject?: string; // Kept for backward compatibility
  subjects?: string; // Comma separated list of interested subjects
  age?: number;
  phone?: string;
  aim?: string; // The primary goal (JEE, NEET, etc.)
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  needsOnboarding: boolean;
  isLoading: boolean;
  login: () => void;
  loginAsGuest: () => void;
  logout: () => void;
  completeOnboarding: () => void;
  updateProfile: (data: Partial<User>) => void;
  refreshToken: () => Promise<boolean>;
  fetchUserProfile: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to retrieve user specific profile from local storage
const getStoredProfile = (userId: string): Partial<User> | null => {
  try {
    const data = localStorage.getItem(`tutorji_profile_${userId}`);
    return data ? JSON.parse(data) : null;
  } catch (e) { return null; }
};

// Helper to save user specific profile
const saveStoredProfile = (user: User) => {
  if (!user || !user.id) return;
  // Merge with existing to prevent data loss if saving partial updates (though we usually pass full object here)
  const existing = getStoredProfile(user.id) || {};
  localStorage.setItem(`tutorji_profile_${user.id}`, JSON.stringify({ ...existing, ...user }));
};

const getRandomAvatar = () => PREMIUM_AVATARS[Math.floor(Math.random() * PREMIUM_AVATARS.length)];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  // Helper: Normalize user data from decoded token
  const normalizeUser = (decoded: any): User => ({
    id: decoded.sub || decoded.id || `user-${Date.now()}`,
    name: decoded.name || decoded.firstName || decoded.displayName || 'Student',
    email: decoded.email || '',
    avatar: decoded.picture || decoded.avatar || decoded.photoURL || getRandomAvatar(),
    plan: decoded.plan || 'free',
    exp: decoded.exp || Math.floor(Date.now() / 1000) + 3600,
    class: decoded.class || null,
    // Defaults for profile
    bio: 'Physics enthusiast aiming for JEE! Always learning.',
    location: 'India',
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  });

  useEffect(() => {
    const initAuth = () => {
      // 1. Check URL for token (Google Redirect)
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token');
      
      // 2. Check localStorage if no URL token
      let token = urlToken || localStorage.getItem('auth_token');

      if (token) {
        let userData: User | null = null;

        // HANDLE MOCK TOKENS (Prevent crash on jwtDecode)
        if (token === 'mock-token-demo') {
           userData = {
             id: 'manual-user', // Static ID for demo user
             name: 'Demo Student',
             email: 'demo@tutorji.com',
             avatar: PREMIUM_AVATARS[0],
             plan: 'free',
             exp: Math.floor(Date.now() / 1000) + 86400,
             class: null,
             bio: 'Student demo account.',
             location: 'New Delhi, India',
             joinedDate: 'Oct 2023'
           };
        } else if (token === 'mock-token-guest') {
           userData = {
             id: 'guest-user', // Static ID for guest
             name: 'Guest User',
             email: 'guest@tutorji.com',
             avatar: PREMIUM_AVATARS[5],
             plan: 'free',
             exp: Math.floor(Date.now() / 1000) + 86400,
             class: null,
             bio: 'Just exploring.',
             location: 'Internet',
             joinedDate: new Date().toLocaleDateString()
           };
        } else {
           // Handle Real JWT
           try {
              const decoded: any = jwtDecode(token);
              const currentTime = Math.floor(Date.now() / 1000);

              if (decoded.exp && decoded.exp < currentTime) {
                console.warn("Auth Token Expired");
                logout(); 
                setIsLoading(false);
                return;
              }
              userData = normalizeUser(decoded);
           } catch (error) {
              console.error("Token decoding failed:", error);
              logout();
              setIsLoading(false);
              return;
           }
        }

        // If valid user data found (from Mock or JWT)
        if (userData) {
           // If valid and from URL, save it
           if (urlToken) {
             localStorage.setItem('auth_token', urlToken);
             window.history.replaceState({}, document.title, window.location.pathname);
           }

           // MERGE WITH LOCAL STORAGE
           // This ensures that if the user previously selected a class, we remember it.
           const storedProfile = getStoredProfile(userData.id);
           
           const finalUser: User = storedProfile ? { 
             ...storedProfile,
             // Enforce fresh identity from token
             name: userData.name,
             email: userData.email,
             avatar: userData.avatar, 
             id: userData.id, 
             plan: userData.plan, 
             exp: userData.exp,
             // Keep stored preferences if they exist
             class: storedProfile.class || userData.class,
             bio: storedProfile.bio || userData.bio,
             location: storedProfile.location || userData.location,
             joinedDate: storedProfile.joinedDate || userData.joinedDate
           } : userData;

           setUser(finalUser);
           setIsAuthenticated(true);

           saveStoredProfile(finalUser);

           // CHECK ONBOARDING STATUS
           if (!finalUser.class) {
              setNeedsOnboarding(true); 
           }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = () => {
    setIsLoading(true);
    setTimeout(() => {
      const demoId = 'manual-user';
      const stored = getStoredProfile(demoId);
      
      const dummyUser: User = {
        id: demoId,
        name: 'Demo Student',
        email: 'demo@tutorji.com',
        avatar: PREMIUM_AVATARS[0],
        plan: 'free',
        exp: Math.floor(Date.now() / 1000) + 86400, // 24h
        class: null,
        bio: 'Student demo account.',
        location: 'New Delhi, India',
        joinedDate: 'Oct 2023',
        ...stored
      };
      
      setUser(dummyUser);
      setIsAuthenticated(true);
      
      if (!dummyUser.class) {
        setNeedsOnboarding(true);
      }
      localStorage.setItem('auth_token', 'mock-token-demo'); 
      saveStoredProfile(dummyUser); 
      setIsLoading(false);
    }, 1000);
  };

  const loginAsGuest = () => {
    setIsLoading(true);
    setTimeout(() => {
      const guestId = 'guest-user';
      const stored = getStoredProfile(guestId);

      const guestUser: User = {
        id: guestId,
        name: 'Guest User',
        email: 'guest@tutorji.com',
        avatar: PREMIUM_AVATARS[5],
        plan: 'free',
        exp: Math.floor(Date.now() / 1000) + 86400,
        class: null,
        bio: 'Just exploring.',
        location: 'Internet',
        joinedDate: new Date().toLocaleDateString(),
        ...stored
      };
      
      setUser(guestUser);
      setIsAuthenticated(true);
      
      if (!guestUser.class) {
        setNeedsOnboarding(true);
      }
      localStorage.setItem('auth_token', 'mock-token-guest');
      saveStoredProfile(guestUser);
      setIsLoading(false);
    }, 800);
  };

  const logout = async () => {
    // Call backend logout endpoint
    await logoutUser();
    
    // Clear local state
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsAuthenticated(false);
    setNeedsOnboarding(false);
  };

  const completeOnboarding = () => {
    localStorage.setItem('tourCompleted', 'true');
    setNeedsOnboarding(false);
  };

  const updateProfile = (data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...data };
      saveStoredProfile(updatedUser); 
      return updatedUser;
    });
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const currentToken = localStorage.getItem('auth_token');
      if (!currentToken) return false;

      const response = await refreshAuthToken(currentToken);
      
      if (response.token) {
        // Save new token
        localStorage.setItem('auth_token', response.token);
        
        // Decode and update user data
        const decoded: any = jwtDecode(response.token);
        const userData = normalizeUser(decoded);
        
        // Merge with stored profile
        const storedProfile = getStoredProfile(userData.id);
        const finalUser: User = storedProfile ? { 
          ...storedProfile,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar, 
          id: userData.id, 
          plan: userData.plan, 
          exp: userData.exp,
          class: storedProfile.class || userData.class,
          bio: storedProfile.bio || userData.bio,
          location: storedProfile.location || userData.location,
          joinedDate: storedProfile.joinedDate || userData.joinedDate
        } : userData;
        
        setUser(finalUser);
        saveStoredProfile(finalUser);
        return true;
      }
      
      // If refresh failed, logout user
      logout();
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  const fetchUserProfile = async (): Promise<boolean> => {
    try {
      const currentToken = localStorage.getItem('auth_token');
      if (!currentToken) return false;

      const response = await fetchUserInfo(currentToken);
      
      if (response.user) {
        // Update user data
        const userData = response.user;
        
        // Merge with stored profile
        const storedProfile = getStoredProfile(userData.id);
        const finalUser: User = storedProfile ? { 
          ...storedProfile,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar, 
          id: userData.id, 
          plan: userData.plan, 
          exp: userData.exp,
          class: storedProfile.class || userData.class,
          bio: storedProfile.bio || userData.bio,
          location: storedProfile.location || userData.location,
          joinedDate: storedProfile.joinedDate || userData.joinedDate
        } : userData;
        
        setUser(finalUser);
        saveStoredProfile(finalUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Fetching user profile failed:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      needsOnboarding, 
      isLoading, 
      login, 
      loginAsGuest, 
      logout, 
      completeOnboarding,
      updateProfile,
      refreshToken,
      fetchUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};