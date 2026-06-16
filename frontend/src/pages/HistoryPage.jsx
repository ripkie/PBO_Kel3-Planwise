import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getAllHistorySorted } from '../services/historyService';

function HistoryPage() {
  const [histories, setHistories] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getAllHistorySorted();
      setHistories(Array.isArray(data) ? data : []);
    }
    load().catch((err) => console.error('Gagal memuat history:', err));
  }, []);

  return (
    <Layout>
      <section className="page-header-card">
        <div>
          <h1>History & Audit Trail</h1>
          <p>Riwayat perubahan task yang tercatat otomatis dari backend.</p>
        </div>
      </section>

      <section className="panel-card page-section">
        <div className="history-timeline">
          {histories.map((history) => (
            <div className="history-timeline-item" key={history.id}>
              <div className="timeline-dot"></div>
              <div>
                <strong>{history.action}</strong>
                <p>{history.task?.judul || 'Task tidak tersedia'}</p>
                <span>{history.historyAt ? new Date(history.historyAt).toLocaleString('id-ID') : '-'}</span>
              </div>
            </div>
          ))}
          {histories.length === 0 && <p>Belum ada history.</p>}
        </div>
      </section>
    </Layout>
  );
}

export default HistoryPage;
