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

const PRIORITIES = ['Low', 'Medium', 'High'];

const emptyForm = { title: '', priority: 'Medium', date: '' };

function TaskModal({ mode, task, targetColumnId, columns, onClose, onSave }) {
  const [form, setForm] = useState(
    mode === 'edit'
      ? { title: task.title, priority: task.priority, date: task.date }
      : { ...emptyForm }
  );
  const [columnId, setColumnId] = useState(targetColumnId || columns[0].id);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...form, columnId: mode === 'edit' ? null : columnId });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{mode === 'edit' ? 'Edit Task' : 'Tambah Task'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Judul Task
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Masukkan judul task..."
              required
              autoFocus
            />
          </label>

          <label>
            Prioritas
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </label>

          <label>
            Deadline
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </label>

          {mode === 'add' && (
            <label>
              Kolom
              <select
                value={columnId}
                onChange={(e) => setColumnId(e.target.value)}
              >
                {columns.map((col) => (
                  <option key={col.id} value={col.id}>{col.title}</option>
                ))}
              </select>
            </label>
          )}

          <div className="modal-actions">
            <button type="button" className="modal-btn-cancel" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="modal-btn-save primary-btn">
              {mode === 'edit' ? 'Simpan Perubahan' : 'Tambah Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ task, onClose, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card--sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Hapus Task</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p className="modal-body-text">
          Yakin ingin menghapus task <strong>"{task.title}"</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="modal-actions">
          <button className="modal-btn-cancel" onClick={onClose}>Batal</button>
          <button className="modal-btn-delete" onClick={onConfirm}>🗑️ Hapus</button>
        </div>
      </div>
    </div>
  );
}

function TaskContent() {
  const [columns, setColumns] = useState(initialColumns);
  const [addModal, setAddModal] = useState(null); // { columnId }
  const [editModal, setEditModal] = useState(null); // { task }
  const [deleteModal, setDeleteModal] = useState(null); // { task }

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumnIndex = columns.findIndex((c) => c.id === source.droppableId);
    const destColumnIndex = columns.findIndex((c) => c.id === destination.droppableId);
    const sourceColumn = columns[sourceColumnIndex];
    const destColumn = columns[destColumnIndex];

    const sourceTasks = [...sourceColumn.tasks];
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      srcTasks.splice(destination.index, 0, moved);
      const newCols = [...columns];
      newCols[srcColIdx] = { ...srcCol, tasks: srcTasks };
      setColumns(newCols);
      return;
    }

    const destTasks = [...destColumn.tasks];
    destTasks.splice(destination.index, 0, movedTask);

    const newColumns = [...columns];
    newColumns[sourceColumnIndex] = { ...sourceColumn, tasks: sourceTasks };
    newColumns[destColumnIndex] = { ...destColumn, tasks: destTasks };
    setColumns(newColumns);
  };

  // Add Task
  const handleAddTask = (columnId) => setAddModal({ columnId });
  const handleSaveAdd = ({ title, priority, date, columnId }) => {
    const formattedDate = date
      ? new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      : '-';
    const newTask = {
      id: `task-${Date.now()}`,
      title,
      priority,
      date: formattedDate,
    };
    setColumns((cols) =>
      cols.map((col) =>
        col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col
      )
    );
    setAddModal(null);
  };

  // Edit Task
  const handleEdit = (task) => setEditModal({ task });
  const handleSaveEdit = ({ title, priority, date }) => {
    const formattedDate = date
      ? new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      : editModal.task.date;
    setColumns((cols) =>
      cols.map((col) => ({
        ...col,
        tasks: col.tasks.map((t) =>
          t.id === editModal.task.id ? { ...t, title, priority, date: formattedDate } : t
        ),
      }))
    );
    setEditModal(null);
  };

  // Delete Task
  const handleDelete = (taskId) => {
    let found = null;
    columns.forEach((col) => col.tasks.forEach((t) => { if (t.id === taskId) found = t; }));
    if (found) setDeleteModal({ task: found });
  };
  const handleConfirmDelete = () => {
    setColumns((cols) =>
      cols.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => t.id !== deleteModal.task.id),
      }))
    );
    setDeleteModal(null);
  };

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
          <button className="primary-btn" onClick={() => setAddModal({ columnId: 'todo' })}>
            ＋ Add Task
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-grid">
          {columns.map((column) => (
            <TaskColumn
              key={column.id}
              column={column}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddTask={handleAddTask}
            />
          ))}
        </div>
      </DragDropContext>

      {addModal && (
        <TaskModal
          mode="add"
          targetColumnId={addModal.columnId}
          columns={columns}
          onClose={() => setAddModal(null)}
          onSave={handleSaveAdd}
        />
      )}

      {editModal && (
        <TaskModal
          mode="edit"
          task={editModal.task}
          columns={columns}
          onClose={() => setEditModal(null)}
          onSave={handleSaveEdit}
        />
      )}

      {deleteModal && (
        <DeleteConfirmModal
          task={deleteModal.task}
          onClose={() => setDeleteModal(null)}
          onConfirm={handleConfirmDelete}
        />
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