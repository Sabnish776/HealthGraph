import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

interface AuthContextType {
  user: any;
  type: 'patient' | 'hospital' | null;
  login: (token: string, userData: any, type: 'patient' | 'hospital') => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [type, setType] = useState<'patient' | 'hospital' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedType = localStorage.getItem('userType') as 'patient' | 'hospital';
    const storedUser = localStorage.getItem('user');

    if (token && storedType && storedUser) {
      setUser(JSON.parse(storedUser));
      setType(storedType);
    }
    setLoading(false);
  }, []);

  const login = (token: string, userData: any, userType: 'patient' | 'hospital') => {
    localStorage.setItem('token', token);
    localStorage.setItem('userType', userType);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setType(userType);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    setUser(null);
    setType(null);
  };

  return (
    <AuthContext.Provider value={{ user, type, login, logout, loading }}>
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
