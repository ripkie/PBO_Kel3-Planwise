import { useState } from 'react';
import NotificationPanel from './NotificationPanel';

function Topbar() {
  const [showNotif, setShowNotif] = useState(false);
  const userId = 'user-id-placeholder'; // ganti dengan userId dari auth/context

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
          className="icon-btn"
          onClick={() => setShowNotif((prev) => !prev)}
        >
          🔔
        </button>
        <button className="icon-btn">📅</button>
        <div className="avatar">AM</div>
        <div>
          <strong>Andi Mahasiswa</strong>
          <p>Student</p>
        </div>
      </div>

      {showNotif && (
        <div style={{ position: 'absolute', top: '60px', right: '20px', zIndex: 999 }}>
          <NotificationPanel
            userId={userId}
            onClose={() => setShowNotif(false)}
          />
        </div>
      )}
    </header>
  );
}

export default Topbar;