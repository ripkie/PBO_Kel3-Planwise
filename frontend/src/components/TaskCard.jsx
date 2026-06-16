function TaskCard({ task, onSelect }) {
  return (
    <div className="task-card" onClick={() => onSelect && onSelect(task)} style={{ cursor: 'pointer' }}>
      <div className="task-card-header">
        <h4>{task.title}</h4>
        <button onClick={(e) => { e.stopPropagation(); }}>⋯</button>
      </div>

      <div className="task-badges">
        <span className={`priority ${task.priority?.toLowerCase()}`}>{task.priority}</span>
        {task.labels?.map(label => (
          <span className="task-label" key={label.id} style={{ borderColor: label.warna, color: label.warna }}>
            {label.nama}
          </span>
        ))}
      </div>

      <div className="task-footer">
        <span>▣ {task.date || '-'}</span>
        <span className="mini-avatar">AM</span>
      </div>
    </div>
  );
}

export default TaskCard;
