function StatCard({ title, label, value = 0, icon = '▣', variant = 'bark' }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${variant}`}>{icon}</div>
      <div>
        <p>{title || label || '-'}</p>
        <h3>{value ?? 0}</h3>
      </div>
    </div>
  );
}

export default StatCard;
