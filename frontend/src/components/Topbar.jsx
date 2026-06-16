import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import NotificationPanel from './NotificationPanel';
import { getCurrentUser, getUserInitials, logoutUser } from '../services/authService';
import { getUnreadNotifications } from '../services/notificationService';

function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showNotif, setShowNotif] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');
  const user = getCurrentUser();

  useEffect(() => {
    loadUnreadCount();
  }, [showNotif]);

  useEffect(() => {
    setSearchValue(searchParams.get('q') || '');
  }, [searchParams]);

  async function loadUnreadCount() {
    try {
      const unread = await getUnreadNotifications();
      setUnreadCount(unread.length);
    } catch (err) {
      console.error('Gagal memuat jumlah notifikasi:', err);
    }
  }

  function handleSearchChange(e) {
    const value = e.target.value;
    setSearchValue(value);

    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      nextParams.set('q', value);
    } else {
      nextParams.delete('q');
    }
    setSearchParams(nextParams, { replace: true });
  }

  function handleSearchFocus() {
    const searchablePages = ['/dashboard', '/tasks', '/board', '/labels', '/history'];
    if (!searchablePages.includes(location.pathname)) {
      navigate('/tasks');
    }
  }

  async function handleLogout() {
    await logoutUser();
    navigate('/login');
  }

  return (
    <header className="topbar" style={{ position: 'relative' }}>
      <div className="search-box search-box-active">
        <span>⌕</span>
        <input
          value={searchValue}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          placeholder="Search tasks, descriptions, labels..."
        />
        {searchValue ? (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => handleSearchChange({ target: { value: '' } })}
            title="Bersihkan pencarian"
          >
            ×
          </button>
        ) : (
          <kbd>Ctrl + K</kbd>
        )}
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
