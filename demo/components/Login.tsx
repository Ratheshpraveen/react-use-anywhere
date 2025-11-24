import React, { useState } from 'react';
import axios from 'axios';

interface LoginProps {
  onLoginSuccess?: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { username, password });
      const { token } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('jwt_token', token);
      
      // Call optional callback
      onLoginSuccess?.(token);
      
      // Reset error
      setError('');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};
