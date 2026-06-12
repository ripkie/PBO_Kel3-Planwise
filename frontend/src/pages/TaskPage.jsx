import { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Layout from '../components/Layout';
import TaskColumn from '../components/TaskColumn';
import HistoryPanel from '../components/HistoryPanel';
import { getTasks, createTask, updateTaskStatus, deleteTask } from '../services/taskService';

const COLUMNS = [
  { id: 'todo',     title: 'To Do',       status: 'TODO' },
  { id: 'progress', title: 'In Progress',  status: 'IN_PROGRESS' },
  { id: 'review',   title: 'Review',       status: 'REVIEW' },
  { id: 'done',     title: 'Done',         status: 'DONE' },
];

const emptyForm = { title: '', description: '', deadline: '', priority: 'LOW' };

function TaskContent() {
  const [columns, setColumns]         = useState(COLUMNS.map(c => ({ ...c, tasks: [] })));
  const [selectedTask, setSelectedTask] = useState(null);
  const [showForm, setShowForm]       = useState(false);
  const [editTask, setEditTask]       = useState(null);
  const [form, setForm]               = useState(emptyForm);

  useEffect(() => { fetchTasks(); }, []);

  async function fetchTasks() {
    try {
      const data = await getTasks();
      const newColumns = COLUMNS.map(col => ({
        ...col,
        tasks: data.filter(t => t.status === col.status).map(t => ({
          id: t.id,
          title: t.judul,
          priority: t.prioritas,
          date: t.deadline,
          status: t.status,
        })),
      }));
      setColumns(newColumns);
    } catch (err) {
      console.error('Gagal fetch tasks:', err);
    }
  }

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const srcColIdx  = columns.findIndex(c => c.id === source.droppableId);
    const dstColIdx  = columns.findIndex(c => c.id === destination.droppableId);
    const srcCol     = columns[srcColIdx];
    const dstCol     = columns[dstColIdx];
    const srcTasks   = [...srcCol.tasks];
    const [moved]    = srcTasks.splice(source.index, 1);

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
      fetchTasks(); // rollback
    }
  };

  function openCreate() {
    setEditTask(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(task) {
    setEditTask(task);
    setForm({ title: task.title, description: '', deadline: task.date, priority: task.priority });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editTask) {
        await updateTask(editTask.id, { judul: form.title, deadline: form.deadline, prioritas: form.priority });
      } else {
        await createTask({ judul: form.title, deskripsi: form.description, deadline: form.deadline, prioritas: form.priority, status: 'TODO' });
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

  return (
    <section className="board-panel">
      <div className="board-header">
        <div>
          <h2>Task Board</h2>
          <select>
            <option>All Projects</option>
          </select>
        </div>
        <div className="board-actions">
          <button>⌯ Filter</button>
          <button>↕ Sort</button>
          <button className="primary-btn" onClick={openCreate}>＋ Add Task</button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-grid">
          {columns.map(column => (
            <TaskColumn
              key={column.id}
              column={column}
              onSelect={setSelectedTask}
            />
          ))}
        </div>
      </DragDropContext>

      {/* Modal Form Create/Edit */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', width: '400px' }}>
            <h3 style={{ marginBottom: '16px' }}>{editTask ? 'Edit Task' : 'Tambah Task'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '13px', color: '#6b7280' }}>Judul Task</label>
                <input
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', marginTop: '4px' }}
                  placeholder="Masukkan judul task..."
                />
              </div>
              {!editTask && (
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '13px', color: '#6b7280' }}>Deskripsi</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', marginTop: '4px', resize: 'vertical' }}
                    placeholder="Deskripsi task..."
                    rows={3}
                  />
                </div>
              )}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '13px', color: '#6b7280' }}>Deadline</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={e => setForm({ ...form, deadline: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', marginTop: '4px' }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', color: '#6b7280' }}>Prioritas</label>
                <select
                  value={form.priority}
                  onChange={e => setForm({ ...form, priority: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', marginTop: '4px' }}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ padding: '8px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fff', cursor: 'pointer' }}>
                  Batal
                </button>
                <button type="submit"
                  style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  {editTask ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drawer Detail Task + History */}
      {selectedTask && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '360px', height: '100vh', background: '#fff', borderLeft: '1px solid #e5e7eb', boxShadow: '-4px 0 20px rgba(0,0,0,0.08)', zIndex: 999, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '15px' }}>Detail Task</h3>
            <button onClick={() => setSelectedTask(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#9ca3af' }}>×</button>
          </div>

          <div style={{ padding: '16px', borderBottom: '1px solid #f3f4f6' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '16px' }}>{selectedTask.title}</h4>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <span className={`priority ${selectedTask.priority?.toLowerCase()}`}>{selectedTask.priority}</span>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>📅 {selectedTask.date}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => openEdit(selectedTask)}
                style={{ flex: 1, padding: '7px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                ✏️ Edit
              </button>
              <button onClick={() => handleDelete(selectedTask.id)}
                style={{ flex: 1, padding: '7px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                🗑 Hapus
              </button>
            </div>
          </div>

          {/* History Panel */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
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