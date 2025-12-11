import { JWTService } from '../../lib/services/jwtService';
import { CustomJWTPayload, AuthState, initialAuthState } from '../../lib/types';
import { createSingletonService } from '../../lib/services/createHookService';
import { logServiceCall } from './logger';

// Mock user database (replace with your actual user authentication logic)
const MOCK_USERS = [
  { id: '1', email: 'user@example.com', password: 'password123', role: 'user' },
  { id: '2', email: 'admin@example.com', password: 'admin123', role: 'admin' }
];

export const authService = createSingletonService<{
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshTokens: () => Promise<boolean>;
  getCurrentUser: () => CustomJWTPayload | null;
}>('auth', () => {
  let state: AuthState = { ...initialAuthState };

  return {
    login: async (email: string, password: string) => {
      logServiceCall('authService', 'login', { email });
      
      // Mock user authentication (replace with actual authentication)
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Generate tokens
        const payload = { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        };
        
        const accessToken = JWTService.generateAccessToken(payload);
        const refreshToken = JWTService.generateRefreshToken(payload);
        
        // Update state
        state = {
          token: accessToken,
          refreshToken,
          isAuthenticated: true,
          user: {
            id: user.id,
            email: user.email,
            role: user.role
          },
          expiresAt: Date.now() + 15 * 60 * 1000 // 15 minutes from now
        };
        
        return true;
      }
      
      return false;
    },
    
    logout: () => {
      logServiceCall('authService', 'logout');
      state = { ...initialAuthState };
    },
    
    refreshTokens: async () => {
      logServiceCall('authService', 'refreshTokens');
      
      if (!state.refreshToken) return false;
      
      const newAccessToken = JWTService.refreshAccessToken(state.refreshToken);
      
      if (newAccessToken) {
        state.token = newAccessToken;
        state.expiresAt = Date.now() + 15 * 60 * 1000;
        return true;
      }
      
      return false;
    },
    
    getCurrentUser: () => {
      logServiceCall('authService', 'getCurrentUser');
      
      if (!state.token) return null;
      
      return JWTService.decodeToken(state.token);
    }
  };
});

export const typedAuthService = authService;
