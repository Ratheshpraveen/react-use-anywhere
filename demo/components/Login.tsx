import React, { useState } from 'react';
import { AuthService } from '../../lib/services/authService';
import { LoginCredentials } from '../../lib/types';

export const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const tokenResponse = await AuthService.login(credentials);

      if (tokenResponse) {
        // Store tokens in local storage
        localStorage.setItem('accessToken', tokenResponse.accessToken);
        localStorage.setItem('refreshToken', tokenResponse.refreshToken);
        
        // Redirect or update app state
        console.log('Login successful');
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
        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        required
      />
      {error && <p style={{color: 'red'}}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
};
