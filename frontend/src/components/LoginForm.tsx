import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onClose: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      onClose();
      // The redirect will be handled by Home.tsx useEffect
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="auth-form">
      <h2>Welcome Back</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="btn-primary">Login</button>
        <p className="switch-text">
          Don't have an account?{' '}
          <span onClick={onSwitchToRegister} className="link">Register</span>
        </p>
      </form>
    </div>
  );
};
