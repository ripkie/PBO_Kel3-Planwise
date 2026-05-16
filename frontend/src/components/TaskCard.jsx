function TaskCard({ task }) {
  return (
    <div className="task-card">
      <div className="task-card-header">
        <h4>{task.title}</h4>
        <button>⋯</button>
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
