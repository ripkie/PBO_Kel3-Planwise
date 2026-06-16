import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationPanel from './NotificationPanel';
import { getCurrentUser, getUserInitials, logoutUser } from '../services/authService';
import { getUnreadNotifications } from '../services/notificationService';

function Topbar() {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = getCurrentUser();

  useEffect(() => {
    loadUnreadCount();
  }, [showNotif]);

  async function loadUnreadCount() {
    try {
      const unread = await getUnreadNotifications();
      setUnreadCount(unread.length);
    } catch (err) {
      console.error('Gagal memuat jumlah notifikasi:', err);
    }
  }

  async function handleLogout() {
    await logoutUser();
    navigate('/login');
  }

  return (
    <header className="topbar" style={{ position: 'relative' }}>
      <button className="icon-btn">☰</button>
      <div className="search-box">
        <span>⌕</span>
        <input placeholder="Search tasks, projects, or anything..." />
        <kbd>Ctrl + K</kbd>
      </div>
      <div className="topbar-actions">
        <button
          className="icon-btn notif-button"
          onClick={() => setShowNotif((prev) => !prev)}
          title="Notifikasi"
        >
          🔔
          {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
        </button>
        <button className="icon-btn" title="Calendar" onClick={() => navigate('/calendar')}>📅</button>
        <div className="avatar">{getUserInitials(user)}</div>
        <div className="user-chip">
          <strong>{user?.nama || 'User'}</strong>
          <p>{user?.role || 'USER'}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {showNotif && (
        <div style={{ position: 'absolute', top: '60px', right: '20px', zIndex: 999 }}>
          <NotificationPanel
            onClose={() => {
              setShowNotif(false);
              loadUnreadCount();
            }}
          />
        </div>
      )}
    </header>
  );
}

export default Topbar;
