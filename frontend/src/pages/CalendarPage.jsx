import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getTasks } from '../services/taskService';

function CalendarPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getTasks({ sortBy: 'deadline' });
      setTasks((Array.isArray(data) ? data : []).filter((task) => task.deadline));
    }
    load().catch((err) => console.error('Gagal memuat kalender:', err));
  }, []);

  return (
    <Layout>
      <section className="page-header-card">
        <div>
          <h1>Calendar</h1>
          <p>Ringkasan deadline task berdasarkan tanggal.</p>
        </div>
      </section>

      <section className="panel-card page-section">
        <ul className="calendar-list">
          {tasks.map((task) => (
            <li key={task.id}>
              <time>{task.deadline}</time>
              <div>
                <strong>{task.judul}</strong>
                <span>{task.status} • {task.prioritas}</span>
              </div>
            </li>
          ))}
          {tasks.length === 0 && <p>Belum ada deadline.</p>}
        </ul>
      </section>
    </Layout>
  );
}

export default CalendarPage;
