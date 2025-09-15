import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/firebase.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Check localStorage first for faster initial load
        const storedAuth = localStorage.getItem('varuna-auth');
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          if (authData.isAuthenticated && authData.user) {
            setIsAuthenticated(true);
            setUser(authData.user);
          }
        }

        // Then verify with Firebase
        const result = await AuthService.getCurrentUser();
        if (result.success) {
          setIsAuthenticated(true);
          setUser(result.user);
          // Update localStorage with latest user data
          localStorage.setItem('varuna-auth', JSON.stringify({
            isAuthenticated: true,
            user: result.user,
            loginTime: new Date().toISOString()
          }));
        } else {
          // Clear localStorage if Firebase says no user
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem('varuna-auth');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('varuna-auth');
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  // Listen for auth change events
  useEffect(() => {
    const handleAuthChange = (event) => {
      const { isAuthenticated: authState, user: userData } = event.detail;
      setIsAuthenticated(authState);
      setUser(userData);
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const login = async (email, password) => {
    try {
      const result = await AuthService.signIn(email, password);
      if (result.success) {
        setIsAuthenticated(true);
        setUser(result.user);
        localStorage.setItem('varuna-auth', JSON.stringify({
          isAuthenticated: true,
          user: result.user,
          loginTime: new Date().toISOString()
        }));

        window.dispatchEvent(new CustomEvent('authChange', {
          detail: { isAuthenticated: true, user: result.user }
        }));

        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const result = await AuthService.signOut();
      if (result.success) {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('varuna-auth');

        window.dispatchEvent(new CustomEvent('authChange', {
          detail: { isAuthenticated: false, user: null }
        }));

        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password, name) => {
    try {
      const result = await AuthService.signUp(email, password, name);
      if (result.success) {
        // Note: User is not automatically logged in after registration
        // They need to login separately
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
