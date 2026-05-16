function Topbar() {
  return (
    <header className="topbar">
      <button className="icon-btn">☰</button>
      <div className="search-box">
        <span>⌕</span>
        <input placeholder="Search tasks, projects, or anything..." />
        <kbd>Ctrl + K</kbd>
      </div>
      <div className="topbar-actions">
        <button className="icon-btn">🔔</button>
        <button className="icon-btn">📅</button>
        <div className="avatar">AM</div>
        <div>
          <strong>Andi Mahasiswa</strong>
          <p>Student</p>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
