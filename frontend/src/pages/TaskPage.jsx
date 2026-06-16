import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import Layout from '../components/Layout';
import TaskColumn from '../components/TaskColumn';
import HistoryPanel from '../components/HistoryPanel';
import {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getLabels,
} from '../services/taskService';

const COLUMNS = [
  { id: 'todo', title: 'To Do', status: 'TODO' },
  { id: 'progress', title: 'In Progress', status: 'IN_PROGRESS' },
  { id: 'review', title: 'Review', status: 'REVIEW' },
  { id: 'done', title: 'Done', status: 'DONE' },
];

const emptyForm = { title: '', description: '', deadline: '', priority: 'LOW', labelIds: [] };

function mapTask(task) {
  return {
    id: task.id,
    title: task.judul,
    description: task.deskripsi || '',
    priority: task.prioritas || 'LOW',
    date: task.deadline || '',
    status: task.status || 'TODO',
    labels: task.labels || [],
    type: task.type || task.taskType || 'TASK',
  };
}

function TaskContent() {
  const [columns, setColumns] = useState(COLUMNS.map(c => ({ ...c, tasks: [] })));
  const [labels, setLabels] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filters, setFilters] = useState({ labelId: '', priority: '', status: '', sortBy: '' });
  const [searchParams] = useSearchParams();
  const searchTerm = (searchParams.get('q') || '').trim().toLowerCase();

  useEffect(() => {
    fetchLabels();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [filters, searchTerm]);

  async function fetchLabels() {
    try {
      const data = await getLabels();
      setLabels(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Gagal fetch labels:', err);
    }
  }

  async function fetchTasks() {
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
      const data = await getTasks(params);
      const list = Array.isArray(data) ? data : [];
      const searchedList = searchTerm
        ? list.filter((task) => {
            const labelText = (task.labels || []).map((label) => label.nama || '').join(' ');
            const haystack = `${task.judul || ''} ${task.deskripsi || ''} ${task.status || ''} ${task.prioritas || ''} ${labelText}`.toLowerCase();
            return haystack.includes(searchTerm);
          })
        : list;
      const newColumns = COLUMNS.map(col => ({
        ...col,
        tasks: searchedList.filter(t => t.status === col.status).map(mapTask),
      }));
      setColumns(newColumns);
    } catch (err) {
      console.error('Gagal fetch tasks:', err);
    }
  }

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const srcColIdx = columns.findIndex(c => c.id === source.droppableId);
    const dstColIdx = columns.findIndex(c => c.id === destination.droppableId);
    if (srcColIdx < 0 || dstColIdx < 0) return;

    const srcCol = columns[srcColIdx];
    const dstCol = columns[dstColIdx];
    const srcTasks = [...srcCol.tasks];
    const [moved] = srcTasks.splice(source.index, 1);
    if (!moved) return;

    if (source.droppableId === destination.droppableId) {
      srcTasks.splice(destination.index, 0, moved);
      const newCols = [...columns];
      newCols[srcColIdx] = { ...srcCol, tasks: srcTasks };
      setColumns(newCols);
      return;
    }

    const dstTasks = [...dstCol.tasks];
    dstTasks.splice(destination.index, 0, { ...moved, status: dstCol.status });

    const newCols = [...columns];
    newCols[srcColIdx] = { ...srcCol, tasks: srcTasks };
    newCols[dstColIdx] = { ...dstCol, tasks: dstTasks };
    setColumns(newCols);

    try {
      await updateTaskStatus(moved.id, dstCol.status);
    } catch (err) {
      console.error('Gagal update status:', err);
      fetchTasks();
    }
  };

  function openCreate() {
    setEditTask(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(task) {
    setEditTask(task);
    setForm({
      title: task.title,
      description: task.description || '',
      deadline: task.date || '',
      priority: task.priority || 'LOW',
      labelIds: task.labels?.map(label => label.id) || [],
    });
    setShowForm(true);
  }

  function toggleLabel(labelId) {
    setForm(prev => ({
      ...prev,
      labelIds: prev.labelIds.includes(labelId)
        ? prev.labelIds.filter(id => id !== labelId)
        : [...prev.labelIds, labelId],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      judul: form.title,
      deskripsi: form.description,
      deadline: form.deadline || null,
      prioritas: form.priority,
      status: editTask ? editTask.status : 'TODO',
      labelIds: form.labelIds,
    };

    try {
      if (editTask) {
        const updated = await updateTask(editTask.id, payload);
        setSelectedTask(mapTask(updated));
      } else {
        await createTask(payload);
      }
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      console.error('Gagal simpan task:', err);
    }
  }

  async function handleDelete(taskId) {
    if (!confirm('Hapus task ini?')) return;
    try {
      await deleteTask(taskId);
      setSelectedTask(null);
      fetchTasks();
    } catch (err) {
      console.error('Gagal hapus task:', err);
    }
  }

  function resetFilter() {
    setFilters({ labelId: '', priority: '', status: '', sortBy: '' });
  }

  return (
    <section className="board-panel board-workspace">
      <div className="board-header board-header-clean">
        <div className="board-title-block">
          <h2>Task Board</h2>
          <p>{searchTerm ? `Menampilkan hasil pencarian untuk: ${searchParams.get('q')}` : 'Fokus untuk menggeser task berdasarkan progres kerja. Kelola label di halaman Labels.'}</p>
        </div>

        <div className="board-actions board-actions-clean">
          <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
            <option value="">Semua Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="DONE">Done</option>
          </select>

          <select value={filters.priority} onChange={e => setFilters({ ...filters, priority: e.target.value })}>
            <option value="">Semua Prioritas</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <select value={filters.labelId} onChange={e => setFilters({ ...filters, labelId: e.target.value })}>
            <option value="">Semua Label</option>
            {labels.map(label => (
              <option key={label.id} value={label.id}>{label.nama}</option>
            ))}
          </select>

          <select value={filters.sortBy} onChange={e => setFilters({ ...filters, sortBy: e.target.value })}>
            <option value="">Sort</option>
            <option value="deadline">Deadline Terdekat</option>
            <option value="priority">Prioritas Tertinggi</option>
            <option value="createdAt">Terbaru</option>
          </select>

          <button onClick={resetFilter}>Reset</button>
          <button className="primary-btn" onClick={openCreate}>＋ Add Task</button>
        </div>
      </div>

      <div className="board-main-area board-main-area-clean full-board-area">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="kanban-grid kanban-grid-clean kanban-grid-wide">
            {columns.map(column => (
              <TaskColumn
                key={column.id}
                column={column}
                onSelect={setSelectedTask}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      {showForm && (
        <div className="modal-backdrop">
          <div className="task-modal">
            <h3>{editTask ? 'Edit Task' : 'Tambah Task'}</h3>
            <form onSubmit={handleSubmit}>
              <label>Judul Task</label>
              <input
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Masukkan judul task..."
              />

              <label>Deskripsi</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Deskripsi task..."
                rows={3}
              />

              <label>Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={e => setForm({ ...form, deadline: e.target.value })}
              />

              <label>Prioritas</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>

              <label>Label</label>
              <div className="label-checkbox-grid">
                {labels.length === 0 && <p>Belum ada label. Tambahkan di halaman Labels.</p>}
                {labels.map(label => (
                  <button
                    type="button"
                    key={label.id}
                    className={form.labelIds.includes(label.id) ? 'selected' : ''}
                    onClick={() => toggleLabel(label.id)}
                  >
                    <span style={{ background: label.warna }}></span>
                    {label.nama}
                  </button>
                ))}
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowForm(false)}>Batal</button>
                <button type="submit" className="primary-btn">{editTask ? 'Simpan' : 'Tambah'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedTask && (
        <div className="task-drawer">
          <div className="task-drawer-header">
            <h3>Detail Task</h3>
            <button onClick={() => setSelectedTask(null)}>×</button>
          </div>

          <div className="task-drawer-body">
            <h4>{selectedTask.title}</h4>
            <p>{selectedTask.description || 'Tidak ada deskripsi.'}</p>
            <div className="task-badges">
              <span className={`priority ${selectedTask.priority?.toLowerCase()}`}>{selectedTask.priority}</span>
              <span className="status-pill todo">{selectedTask.type}</span>
              <span className="drawer-date">📅 {selectedTask.date || '-'}</span>
              {selectedTask.labels?.map(label => (
                <span className="task-label" key={label.id} style={{ borderColor: label.warna, color: label.warna }}>
                  {label.nama}
                </span>
              ))}
            </div>
            <div className="drawer-actions">
              <button onClick={() => openEdit(selectedTask)}>✏️ Edit</button>
              <button onClick={() => handleDelete(selectedTask.id)}>🗑 Hapus</button>
            </div>
          </div>

          <div className="drawer-history">
            <HistoryPanel taskId={selectedTask.id} />
          </div>
        </div>
      )}
    </section>
  );
}

function TaskPage({ embedded = false }) {
  if (embedded) return <TaskContent />;
  return (
    <Layout>
      <TaskContent />
    </Layout>
  );
}

export default TaskPage;
