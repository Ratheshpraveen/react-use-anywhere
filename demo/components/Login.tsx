import React, { useState } from 'react';
import { AuthService } from '../../lib/services/authService';
import { LoginCredentials } from '../../lib/types';

interface LoginProps {
  onLoginSuccess?: (token: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const authState = await AuthService.login(credentials);

      if (authState) {
        // Store token in localStorage
        localStorage.setItem('token', authState.token || '');
        localStorage.setItem('refreshToken', authState.token || '');

        // Optional callback for parent component
        if (onLoginSuccess && authState.token) {
          onLoginSuccess(authState.token);
        }
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
};
