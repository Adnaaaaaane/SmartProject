import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAuth = authService.getCurrentAuth();
    if (savedAuth) {
      setAuthState(savedAuth);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const newAuthState = await authService.login(email, password);
    setAuthState(newAuthState);
  };

  const register = async (name: string, email: string, password: string) => {
    const newAuthState = await authService.register(name, email, password);
    setAuthState(newAuthState);
  };

  const logout = () => {
    authService.logout();
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};