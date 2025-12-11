import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useHookService } from '../../lib/hooks/useHookService';
import { useHook } from '../../lib/hooks/useHookService';
import { logContextUpdate, logDataSync, logServiceCall } from '../services/logger';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Initialize auth service
  useHookService(authService, 'auth');

  // Get auth hook
  const auth = useHook<{ 
    login: (email: string, password: string) => Promise<boolean>;
    getCurrentUser: () => any;
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

    try {
      logServiceCall('authService', 'login', { email });
      
      // Use auth service directly
      const success = auth && await auth.login(email, password);
      
      if (success) {
        logServiceCall('authService', 'login.success', { email });
        // Redirect or update UI
        console.log('Login successful');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
