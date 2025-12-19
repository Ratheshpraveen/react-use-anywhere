import axios from 'axios';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  TokenRefreshRequest,
  TokenRefreshResponse,
  UserRole
} from '../types/auth';
import { generateToken, hashPassword, comparePassword } from '../utils/auth/authUtils';

// Configurable base URL for API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

class AuthService {
  /**
   * User login method
   * @param credentials Login credentials
   * @returns Login response with token and user info
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // In a real app, this would be an API call
      // For demonstration, we'll simulate an API response
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/login`, credentials);
      
      // Store token in local storage
      localStorage.setItem('token', response.data.token);
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Login failed');
      }
      throw new Error('An unexpected error occurred during login');
    }
  }

  /**
   * User registration method
   * @param registrationData User registration details
   * @returns Registration response
   */
  async register(registrationData: RegisterRequest): Promise<RegisterResponse> {
    try {
      // Validate password match
      if (registrationData.password !== registrationData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Hash password before sending
      const hashedPassword = await hashPassword(registrationData.password);

      // Prepare registration payload
      const payload = {
        email: registrationData.email,
        password: hashedPassword,
        name: registrationData.name
      };

      const response = await axios.post<RegisterResponse>(`${API_BASE_URL}/register`, payload);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
      throw new Error('An unexpected error occurred during registration');
    }
  }

  /**
   * Token refresh method
   * @param refreshToken Current refresh token
   * @returns New access and refresh tokens
   */
  async refreshToken(refreshToken: string): Promise<TokenRefreshResponse> {
    try {
      const payload: TokenRefreshRequest = { refreshToken };
      const response = await axios.post<TokenRefreshResponse>(`${API_BASE_URL}/refresh-token`, payload);
      
      // Update stored tokens
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Token refresh failed');
      }
      throw new Error('An unexpected error occurred during token refresh');
    }
  }

  /**
   * Logout method
   */
  logout(): void {
    // Remove tokens from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  /**
   * Check if user is currently authenticated
   * @returns Boolean indicating authentication status
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Convert to boolean
  }

  /**
   * Get current user's role
   * @returns User role or null if not authenticated
   */
  getUserRole(): UserRole | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      // In a real app, you'd use a proper token decoding utility
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch {
      return null;
    }
  }
}

export default new AuthService();
