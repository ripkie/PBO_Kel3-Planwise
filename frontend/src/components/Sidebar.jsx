import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '⌂' },
  { path: '/tasks', label: 'My Tasks', icon: '☑' },
  { path: '/board', label: 'Board', icon: '▤' },
  { path: '/calendar', label: 'Calendar', icon: '□' },
  { path: '/labels', label: 'Labels', icon: '◇' },
  { path: '/history', label: 'History', icon: '↺' },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">✓</div>
        <span>PlanWise</span>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-section">
        <p>Favorites</p>
        <div className="favorite"><span className="dot bark"></span>Web Development</div>
        <div className="favorite"><span className="dot beeswax"></span>Database Project</div>
        <div className="favorite"><span className="dot bamboo"></span>Study Plan</div>
      </div>

      <div className="sidebar-card">
        <strong>Stay organized.</strong>
        <p>Plan your tasks and track your progress every day.</p>
      </div>
    </aside>
  );
}

export default Sidebar;
