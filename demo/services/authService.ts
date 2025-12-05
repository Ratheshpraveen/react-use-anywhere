import { createSingletonService } from '../../lib/services/createHookService';
import { JWTService } from '../../lib/services/jwtService';
import { CustomJWTPayload, AuthState, initialAuthState } from '../../lib/types';
import { logServiceCall } from './logger';

// Authentication Service
export const authService = createSingletonService<{
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  checkAuth: () => boolean;
  getCurrentUser: () => CustomJWTPayload | null;
}>('auth', () => {
  // Initial state management
  let authState: AuthState = { ...initialAuthState };

  return {
    login: async (email: string, password: string) => {
      try {
        // Simulate backend authentication (replace with actual API call)
        const isValidCredentials = await mockBackendAuthentication(email, password);
        
        if (isValidCredentials) {
          // Generate tokens
          const accessToken = JWTService.generateAccessToken({ 
            userId: 'user123', 
            email, 
            role: 'user' 
          });
          const refreshToken = JWTService.generateRefreshToken({ 
            userId: 'user123', 
            email, 
            role: 'user' 
          });

          // Update auth state
          authState = {
            token: accessToken,
            refreshToken,
            isAuthenticated: true,
            user: {
              id: 'user123',
              email,
              role: 'user'
            },
            expiresAt: Date.now() + 15 * 60 * 1000 // 15 minutes
          };

          logServiceCall('authService', 'login.success', { email });
          return true;
        }
        
        logServiceCall('authService', 'login.failed', { email });
        return false;
      } catch (error) {
        console.error('Login error:', error);
        return false;
      }
    },

    logout: () => {
      authState = { ...initialAuthState };
      logServiceCall('authService', 'logout');
    },

    refreshToken: async () => {
      if (!authState.refreshToken) return false;

      try {
        const newAccessToken = JWTService.refreshAccessToken(authState.refreshToken);
        
        if (newAccessToken) {
          authState.token = newAccessToken;
          authState.expiresAt = Date.now() + 15 * 60 * 1000;
          return true;
        }
        
        // If refresh fails, logout
        authState = { ...initialAuthState };
        return false;
      } catch (error) {
        console.error('Token refresh error:', error);
        return false;
      }
    },

    checkAuth: () => {
      // Check if token is valid and not expired
      if (!authState.token) return false;
      
      const decodedToken = JWTService.verifyToken(authState.token);
      return !!decodedToken;
    },

    getCurrentUser: () => {
      if (!authState.token) return null;
      return JWTService.decodeToken(authState.token);
    }
  };
});

// Mock backend authentication (replace with real API)
async function mockBackendAuthentication(email: string, password: string): Promise<boolean> {
  // Simulate async authentication
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple mock logic - replace with real authentication
      resolve(email.includes('@') && password.length >= 6);
    }, 500);
  });
}

export const typedAuthService = createSingletonService<AppHooks, 'auth'>('auth');
