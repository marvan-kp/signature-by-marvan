import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientGallery, setClientGallery] = useState(() => {
    const saved = localStorage.getItem('signature_client_gallery');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('signature_token');
      if (token) {
        api.setToken(token);
        try {
          const profile = await api.getMe();
          setUser(profile);
        } catch (err) {
          console.warn('Session expired, clearing token');
          api.setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const loginStudio = async (email, password) => {
    const res = await api.login(email, password);
    api.setToken(res.token);
    setUser(res.user);
    return res;
  };

  const loginClientWithPin = async (galleryCode, pin) => {
    const res = await api.verifyPin(galleryCode, pin);
    api.setToken(res.token);
    setClientGallery(res.gallery);
    localStorage.setItem('signature_client_gallery', JSON.stringify(res.gallery));
    return res;
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
    setClientGallery(null);
    localStorage.removeItem('signature_token');
    localStorage.removeItem('signature_client_gallery');
  };

  return (
    <AuthContext.Provider value={{
      user,
      clientGallery,
      loading,
      isStudioAdmin: !!user && ['OWNER', 'PHOTOGRAPHER', 'EDITOR'].includes(user.role),
      loginStudio,
      loginClientWithPin,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
