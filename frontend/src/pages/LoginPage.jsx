import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand login-brand">
          <div className="brand-icon">✓</div>
          <span>PlanWise</span>
        </div>
        <h1>Welcome back</h1>
        <p>Manage your tasks, deadlines, and study plan in one place.</p>

        <form>
          <label>Email</label>
          <input type="email" placeholder="student@example.com" />

          <label>Password</label>
          <input type="password" placeholder="••••••••" />

          <Link to="/dashboard" className="primary-btn full-width">Login</Link>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
