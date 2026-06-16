import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, KanbanSquare, Users, CalendarDays, Tags, History as HistoryIcon } from 'lucide-react';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tasks', label: 'My Tasks', icon: CheckSquare },
  { path: '/board', label: 'Board', icon: KanbanSquare },
  { path: '/groups', label: 'Groups', icon: Users },
  { path: '/calendar', label: 'Calendar', icon: CalendarDays },
  { path: '/labels', label: 'Labels', icon: Tags },
  { path: '/history', label: 'History', icon: HistoryIcon },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="brand">
        <img src="/planwise-logo.png" alt="PlanWise Logo" className="brand-logo" />
        <span>PlanWise</span>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            {(() => { const Icon = item.icon; return <Icon size={18} strokeWidth={2} />; })()}
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
