import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { AuthState, UserRole } from '../types/auth';
import AuthService from '../services/AuthService';

// Define the shape of the AuthContext
interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, confirmPassword: string) => Promise<void>;
  isAuthenticated: boolean;
  userRole: UserRole | null;
}

// Create the AuthContext with a default value
const AuthContext = createContext<AuthContextType>({
  authState: {
    isAuthenticated: false,
    user: null,
    token: null
  },
  login: async () => {},
  logout: () => {},
  register: async () => {},
  isAuthenticated: false,
  userRole: null
});

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: AuthService.isAuthenticated(),
    user: null,
    token: localStorage.getItem('token')
  });

  // Check authentication on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthState(prevState => ({
      ...prevState,
      isAuthenticated: !!token
    }));
  }, []);

  // Login method
  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login({ email, password });
      
      setAuthState({
        isAuthenticated: true,
        user: {
          userId: response.user.id,
          email: response.user.email,
          role: response.user.role,
          iat: Date.now(),
          exp: Date.now() + 3600000 // 1 hour from now
        },
        token: response.token
      });
    } catch (error) {
      // Handle login error
      console.error('Login failed', error);
      throw error;
    }
  };

  // Logout method
  const logout = () => {
    AuthService.logout();
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null
    });
  };

  // Register method
  const register = async (email: string, password: string, confirmPassword: string) => {
    try {
      await AuthService.register({ email, password, confirmPassword });
      // Optionally log in after registration
      await login(email, password);
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        authState, 
        login, 
        logout, 
        register,
        isAuthenticated: authState.isAuthenticated,
        userRole: authState.user?.role || null
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
