import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import TaskBoard from './TaskPage';

function DashboardPage() {
  return (
    <Layout>
      <section className="welcome-grid">
        <div className="welcome-card">
          <h1>Welcome back, Rifki!</h1>
          <p>You have 12 tasks in total. Keep going and finish what you started!</p>
        </div>
        <div className="date-card">
          <strong>Selasa, 20 Mei 2024</strong>
          <p>Good day to be productive! ✨</p>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard icon="▤" value="12" label="Total Tasks" variant="bark" />
        <StatCard icon="◷" value="5" label="In Progress" variant="beeswax" />
        <StatCard icon="✓" value="7" label="Completed" variant="bamboo" />
        <StatCard icon="⚑" value="3" label="High Priority" variant="accent" />
      </section>

      <TaskBoard embedded />

      <section className="bottom-grid">
        <div className="panel-card">
          <div className="panel-header">
            <h3>Upcoming Deadlines</h3>
            <button>View all</button>
          </div>
          <ul className="deadline-list">
            <li><span>▣ Implementasi Login</span><b className="priority high">High</b><em>20 Mei 2024</em></li>
            <li><span>▣ API Task CRUD</span><b className="priority medium">Medium</b><em>23 Mei 2024</em></li>
            <li><span>▣ Desain UI Wireframe</span><b className="priority low">Low</b><em>25 Mei 2024</em></li>
          </ul>
        </div>
        <div className="panel-card">
          <div className="panel-header">
            <h3>Task Progress</h3>
            <button>This Week</button>
          </div>
          <div className="progress-summary">
            <div className="progress-circle">58%<span>Completed</span></div>
            <div className="progress-bars">
              <p>Completed <span style={{ width: '58%' }}></span></p>
              <p>In Progress <span style={{ width: '42%' }}></span></p>
              <p>To Do <span style={{ width: '70%' }}></span></p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default DashboardPage;
