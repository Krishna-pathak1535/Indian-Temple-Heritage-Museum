import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(email, password);
      setSuccess(true);
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (err: any) {
      // Show the actual error message from the backend
      const errorMessage = err?.response?.data?.detail || err?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="auth-form">
      <h2>Create Account</h2>
      {success ? (
        <div className="success-message">
          Registration successful! Redirecting to login...
        </div>
      ) : (
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
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-primary">Register</button>
          <p className="switch-text">
            Already have an account?{' '}
            <span onClick={onSwitchToLogin} className="link">Login</span>
          </p>
        </form>
      )}
    </div>
  );
};
