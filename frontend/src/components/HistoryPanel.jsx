import { useState, useEffect } from 'react';
import { getHistoryByTask } from '../services/historyService';

function HistoryPanel({ taskId }) {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) return;
    fetchHistory();
  }, [taskId]);

  async function fetchHistory() {
    try {
      const data = await getHistoryByTask(taskId);
      setHistories(data);
    } catch (err) {
      console.error('Gagal memuat riwayat:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="history-panel">
      <h6 className="mb-3">Riwayat Aktivitas</h6>

      {loading && <p className="text-muted">Memuat riwayat...</p>}

      {!loading && histories.length === 0 && (
        <p className="text-muted">Belum ada aktivitas pada task ini.</p>
      )}

      {!loading && (
        <ul className="history-list list-unstyled">
          {histories.map((h) => (
            <li key={h.id} className="history-item mb-2">
              <div className="d-flex justify-content-between">
                <span className="history-action fw-semibold">{h.action}</span>
                <small className="text-muted">
                  {new Date(h.historyAt).toLocaleString('id-ID')}
                </small>
              </div>
              {h.historyBy && (
                <small className="text-muted">oleh {h.historyBy.nama}</small>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HistoryPanel;