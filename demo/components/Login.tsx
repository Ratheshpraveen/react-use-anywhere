import React, { useState } from 'react';
import AuthService from '../services/authService';

interface LoginProps {
  onLoginSuccess?: () => void;
  onLoginError?: (error: string) => void;
}

const Login: React.FC<LoginProps> = ({ 
  onLoginSuccess, 
  onLoginError 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const authState = await AuthService.login(email, password);
      
      if (authState.isAuthenticated) {
        onLoginSuccess && onLoginSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Login failed';
      
      setError(errorMessage);
      onLoginError && onLoginError(errorMessage);
    }
  };

  return (
    <div className="login-container">
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
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
