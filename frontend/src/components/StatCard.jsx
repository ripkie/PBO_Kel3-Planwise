function StatCard({ icon, value, label, variant = 'accent' }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${variant}`}>{icon}</div>
      <div>
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
}

export default StatCard;
