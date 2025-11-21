import React, { useState } from 'react';
import { AuthService } from '../../lib/services/authService';

interface LoginProps {
  onLoginSuccess?: (userData: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      role?: string;
    }
  }) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const loginResult = await AuthService.login({ email, password });
      
      // Store tokens in local storage
      localStorage.setItem('accessToken', loginResult.accessToken);
      localStorage.setItem('refreshToken', loginResult.refreshToken);

      // Call success callback if provided
      onLoginSuccess?.(loginResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
};
