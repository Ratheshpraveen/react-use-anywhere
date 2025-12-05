import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useHookService } from '../../lib/hooks/useHookService';
import { useHook } from '../../lib/hooks/useHookService';
import { logContextUpdate, logDataSync, logServiceCall } from '../services/logger';
import { navigationService } from '../services/navigationService';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Initialize auth service
  useHookService(authService, 'auth');
  const auth = useHook<{ 
    login: (email: string, password: string) => Promise<boolean>;
    checkAuth: () => boolean;
  }>('auth');

  useEffect(() => {
    if (auth) {
      logContextUpdate('auth', auth);
      logDataSync('authService', 'context→service', auth);
    }
  }, [auth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    logServiceCall('authService', 'login', { email });
    
    try {
      const success = await authService.execute(async (auth) => {
        return await auth.login(email, password);
      });

      if (success) {
        logServiceCall('authService', 'login.success', { email });
        navigationService.execute((nav) => {
          nav.navigate('/home');
        });
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
