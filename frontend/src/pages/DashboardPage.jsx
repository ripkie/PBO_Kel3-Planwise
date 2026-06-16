import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { getCurrentUser } from '../services/authService';
import { getTasks, getOverdueTasks } from '../services/taskService';
import { getAllHistorySorted } from '../services/historyService';
import { getNotificationsByUser } from '../services/notificationService';

function DashboardPage() {
  const user = getCurrentUser();
  const [searchParams] = useSearchParams();
  const searchTerm = (searchParams.get('q') || '').trim().toLowerCase();
  const [tasks, setTasks] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [histories, setHistories] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const [taskResult, overdueResult, historyResult, notifResult] = await Promise.allSettled([
        getTasks(),
        getOverdueTasks(),
        getAllHistorySorted(),
        getNotificationsByUser(),
      ]);

      const taskData = taskResult.status === 'fulfilled' ? taskResult.value : [];
      const overdueData = overdueResult.status === 'fulfilled' ? overdueResult.value : [];
      const historyData = historyResult.status === 'fulfilled' ? historyResult.value : [];
      const notifData = notifResult.status === 'fulfilled' ? notifResult.value : [];

      if (taskResult.status === 'rejected') console.error('Gagal memuat task dashboard:', taskResult.reason);
      if (overdueResult.status === 'rejected') console.error('Gagal memuat overdue dashboard:', overdueResult.reason);
      if (historyResult.status === 'rejected') console.error('Gagal memuat history dashboard:', historyResult.reason);
      if (notifResult.status === 'rejected') console.error('Gagal memuat notifikasi dashboard:', notifResult.reason);

      setTasks(Array.isArray(taskData) ? taskData : []);
      setOverdue(Array.isArray(overdueData) ? overdueData : []);
      setHistories(Array.isArray(historyData) ? historyData : []);
      setNotifications(Array.isArray(notifData) ? notifData : []);
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    const done = tasks.filter((task) => task.status === 'DONE').length;
    const inProgress = tasks.filter((task) => task.status === 'IN_PROGRESS').length;
    const high = tasks.filter((task) => task.prioritas === 'HIGH').length;
    return { total: tasks.length, done, inProgress, high };
  }, [tasks]);

  const completion = stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100);
  const searchedTasks = searchTerm
    ? tasks.filter((task) => {
        const labelText = (task.labels || []).map((label) => label.nama || '').join(' ');
        const haystack = `${task.judul || ''} ${task.deskripsi || ''} ${task.status || ''} ${task.prioritas || ''} ${labelText}`.toLowerCase();
        return haystack.includes(searchTerm);
      })
    : tasks;

  const upcoming = searchedTasks
    .filter((task) => task.deadline && task.status !== 'DONE')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  const recentTasks = searchedTasks.slice(0, 5);
  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  return (
    <Layout>
      <section className="welcome-grid">
        <div className="welcome-card">
          <h1>Welcome back, {user?.nama || 'User'}!</h1>
          <p>
            {loading
              ? 'Memuat data dashboard...'
              : `Kamu punya ${stats.total} task, ${stats.inProgress} sedang dikerjakan, dan ${stats.done} selesai.`}
          </p>
        </div>
        <div className="date-card">
          <strong>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
          <p>{unreadCount} notifikasi belum dibaca ✨</p>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard icon="▤" value={stats.total} label="Total Tasks" variant="bark" />
        <StatCard icon="◷" value={stats.inProgress} label="In Progress" variant="beeswax" />
        <StatCard icon="✓" value={stats.done} label="Completed" variant="bamboo" />
        <StatCard icon="⚑" value={stats.high} label="High Priority" variant="accent" />
      </section>

      <section className="dashboard-grid">
        <div className="panel-card">
          <div className="panel-header">
            <h3>{searchTerm ? `Search Result: ${searchParams.get('q')}` : 'Recent Tasks'}</h3>
            <Link className="mini-link" to="/board">Open Board</Link>
          </div>
          <div className="simple-list">
            {recentTasks.length === 0 && <p>Belum ada task.</p>}
            {recentTasks.map((task) => (
              <div className="simple-row" key={task.id}>
                <div>
                  <strong>{task.judul}</strong>
                  <span>{task.deskripsi || 'Tidak ada deskripsi'}</span>
                </div>
                <b className={`priority ${task.prioritas?.toLowerCase()}`}>{task.prioritas || '-'}</b>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-header">
            <h3>Task Progress</h3>
            <Link className="mini-link" to="/history">View History</Link>
          </div>
          <div className="progress-summary">
            <div className="progress-circle">{completion}%<span>Completed</span></div>
            <div className="recent-history">
              {histories.slice(0, 4).map((history) => (
                <p key={history.id}><strong>{history.action}</strong><span>{new Date(history.historyAt).toLocaleString('id-ID')}</span></p>
              ))}
              {histories.length === 0 && <p>Belum ada riwayat aktivitas.</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="panel-card page-section">
        <div className="panel-header">
          <h3>Upcoming Deadlines</h3>
          <button>{overdue.length} overdue</button>
        </div>
        <ul className="deadline-list">
          {upcoming.length === 0 && <li><span>Belum ada deadline aktif.</span></li>}
          {upcoming.map((task) => (
            <li key={task.id}>
              <span>▣ {task.judul}</span>
              <b className={`priority ${task.prioritas?.toLowerCase()}`}>{task.prioritas}</b>
              <em>{task.deadline}</em>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

export default DashboardPage;
