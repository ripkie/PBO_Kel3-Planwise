import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/authService';

const initialLogin = { email: '', password: '' };
const initialRegister = { nama: '', email: '', password: '' };

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(loginForm);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Cek email dan password.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser(registerForm);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Register gagal. Email mungkin sudah terdaftar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand login-brand">
          <div className="brand-icon">✓</div>
          <span>PlanWise</span>
        </div>
        <h1>{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
        <p>Manage your tasks, deadlines, notifications, and study plan in one place.</p>

        <div className="auth-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); }}>
            Login
          </button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); }}>
            Register
          </button>
        </div>

        {error && <div className="form-alert error">{error}</div>}

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input
              type="email"
              required
              placeholder="student@example.com"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            />

            <label>Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            />

            <button className="primary-btn full-width" type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <label>Nama</label>
            <input
              required
              placeholder="Nama lengkap"
              value={registerForm.nama}
              onChange={(e) => setRegisterForm({ ...registerForm, nama: e.target.value })}
            />

            <label>Email</label>
            <input
              type="email"
              required
              placeholder="student@example.com"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            />

            <label>Password</label>
            <input
              type="password"
              required
              placeholder="Minimal 6 karakter"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            />


            <button className="primary-btn full-width" type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Register'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
