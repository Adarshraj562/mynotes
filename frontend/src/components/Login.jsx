import { useState } from 'react';
import axios from 'axios';
import './Login.css';

export default function Login({ onLogin }) {
  // Use single state for each form
  const [form, setForm] = useState({ username: '', password: '' });
  const [regForm, setRegForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [error, setError] = useState('');
  const [regError, setRegError] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  // Generic input change handlers
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleRegChange = e => setRegForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // Toggle forms and clear fields
  const handleShowRegister = () => {
    setShowRegister(true);
    setForm({ username: '', password: '' });
    setError('');
  };
  const handleShowLogin = () => {
    setShowRegister(false);
    setRegForm({ username: '', password: '' });
    setRegError('');
  };

  // Login
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/login', form);
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        if (onLogin) onLogin();
      } else {
        setError(res.data.error || 'Invalid credentials');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Register
  const handleRegister = async e => {
    e.preventDefault();
    setRegLoading(true);
    setRegError('');
    try {
      const res = await axios.post('http://localhost:5000/register', regForm);
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        if (onLogin) onLogin();
      } else {
        setRegError(res.data.error || 'Registration failed');
      }
    } catch {
      setRegError('Network error');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="login-split-bg">
      <div className="login-split-left">
        <div className="welcome-title">Welcome to <span>Secret Notes</span></div>
        <div className="welcome-desc">Your private, secure, and beautiful place to keep notes safe and accessible only to you.</div>
      </div>
      <div className="login-split-right">
        <div className="login-form-center">
          {!showRegister ? (
            <form className="login-form-flat" onSubmit={handleSubmit}>
              <h2>Login</h2>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <button
                type="button"
                className="register-btn"
                style={{ background: '#fff', color: '#2575fc', border: '1.5px solid #2575fc', marginTop: 0 }}
                onClick={handleShowRegister}
              >Register</button>
              {error && <div className="login-error">{error}</div>}
            </form>
          ) : (
            <form className="login-form-flat" onSubmit={handleRegister}>
              <h2>Register</h2>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={regForm.username}
                onChange={handleRegChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={regForm.password}
                onChange={handleRegChange}
                required
              />
              <button type="submit" disabled={regLoading}>
                {regLoading ? 'Registering...' : 'Register'}
              </button>
              <button
                type="button"
                className="register-btn"
                style={{ background: '#fff', color: '#2575fc', border: '1.5px solid #2575fc', marginTop: 0 }}
                onClick={handleShowLogin}
              >Back to Login</button>
              {regError && <div className="login-error">{regError}</div>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
