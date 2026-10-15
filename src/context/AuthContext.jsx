import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    checkCurrentUser();
  }, []);

  async function checkCurrentUser() {
    try {
      const data = await api.getMe();
      if (data && data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error('Session verify error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loginWithGoogle(credential) {
    try {
      setAuthError('');
      const data = await api.googleLogin(credential);
      setUser(data.user);
      setIsAuthModalOpen(false);
      return data.user;
    } catch (err) {
      setAuthError(err.message || 'Google sign in failed');
      throw err;
    }
  }

  async function loginDev({ name, email, avatar, asAdmin }) {
    try {
      setAuthError('');
      const data = await api.devLogin({ name, email, avatar, asAdmin });
      setUser(data.user);
      setIsAuthModalOpen(false);
      return data.user;
    } catch (err) {
      setAuthError(err.message || 'Dev login failed');
      throw err;
    }
  }

  function logout() {
    localStorage.removeItem('wedding_auth_user');
    setUser(null);
  }

  function openAuthModal() {
    setAuthError('');
    setIsAuthModalOpen(true);
  }

  function closeAuthModal() {
    setIsAuthModalOpen(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: !!user?.isAdmin,
        isAuthModalOpen,
        authError,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        loginDev,
        logout,
        checkCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
