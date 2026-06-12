import { useState, useRef, useEffect } from 'react';

function TaskCard({ task, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h4>{task.title}</h4>
        <div className="task-menu-wrap" ref={menuRef}>
          <button
            className="task-menu-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Task options"
          >
            ⋯
          </button>
          {menuOpen && (
            <div className="task-dropdown">
              <button
                className="task-dropdown-item"
                onClick={() => { setMenuOpen(false); onEdit(task); }}
              >
                ✏️ Edit
              </button>
              <button
                className="task-dropdown-item danger"
                onClick={() => { setMenuOpen(false); onDelete(task.id); }}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
      <div className="task-footer">
        <span>▣ {task.date}</span>
        <span className="mini-avatar">AM</span>
      </div>
    </div>
  );
}

export default TaskCard;
