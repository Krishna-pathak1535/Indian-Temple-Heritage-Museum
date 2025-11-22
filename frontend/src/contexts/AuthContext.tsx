import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, userAPI } from '../services/api';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
const LAST_ACTIVITY_KEY = 'lastActivity';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if session is expired
  const isSessionExpired = (): boolean => {
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (!lastActivity) return true;
    
    const lastActivityTime = parseInt(lastActivity, 10);
    const currentTime = Date.now();
    return (currentTime - lastActivityTime) > SESSION_TIMEOUT;
  };

  // Update last activity time
  const updateLastActivity = () => {
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  };

  // Clear session
  const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    setToken(null);
    setUser(null);
  };

  // Initialize auth state on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      // Check if session is expired
      if (isSessionExpired()) {
        console.log('Session expired, logging out...');
        clearSession();
        setLoading(false);
        return;
      }

      // Session is valid, restore user
      setToken(storedToken);
      updateLastActivity();
      
      userAPI.getMe()
        .then((userData) => {
          setUser(userData);
          updateLastActivity();
        })
        .catch(() => {
          clearSession();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Set up activity tracking and timeout checker
  useEffect(() => {
    if (!token) return;

    // Update activity on user interactions
    const trackActivity = () => {
      updateLastActivity();
    };

    // Track various user activities
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, trackActivity);
    });

    // Check for inactivity every 30 seconds
    const inactivityChecker = setInterval(() => {
      if (isSessionExpired()) {
        console.log('Session timeout due to inactivity');
        clearSession();
      }
    }, 30000); // Check every 30 seconds

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, trackActivity);
      });
      clearInterval(inactivityChecker);
    };
  }, [token]);

  const login = async (email: string, password: string) => {
    const data = await authAPI.login(email, password);
    setToken(data.access_token);
    localStorage.setItem('token', data.access_token);
    updateLastActivity(); // Set initial activity time
    const userData = await userAPI.getMe();
    setUser(userData);
    setIsAdmin(userData.is_admin || false);
  };

  const register = async (email: string, password: string) => {
    await authAPI.register(email, password);
  };

  const logout = () => {
    clearSession();
  };

  const value: AuthContextType = {
    user,
    token,
    isAdmin,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
