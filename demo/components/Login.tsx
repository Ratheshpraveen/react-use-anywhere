import React, { useState } from 'react';
import AuthService from '../../lib/services/authService';
import { LoginCredentials } from '../../lib/types';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const authState = await AuthService.login(credentials);
      
      // Store token in localStorage for persistence
      if (authState.token) {
        localStorage.setItem('authToken', authState.token);
      }

      // Redirect or update app state based on successful login
      console.log('Logged in successfully', authState);
    } catch (error) {
      console.error('Login failed', error);
      // Handle login error (show message, etc.)
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={credentials.email}
        onChange={handleInputChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={credentials.password}
        onChange={handleInputChange}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
