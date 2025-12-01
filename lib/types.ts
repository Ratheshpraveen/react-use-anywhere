export interface JWTPayload {
  id: string;
  email: string;
  username?: string;
  role?: string;
  password?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthenticationState {
  isAuthenticated: boolean;
  user: JWTPayload | null;
  tokens: TokenPair | null;
}
