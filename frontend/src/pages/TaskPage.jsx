import { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Layout from '../components/Layout';
import TaskColumn from '../components/TaskColumn';

const initialColumns = [
  {
    id: 'todo',
    title: 'To Do',
    status: 'todo',
    tasks: [
      { id: 'task-1', title: 'Buat ERD Database', priority: 'Low', date: '22 Mei 2024' },
      { id: 'task-2', title: 'Studi Literatur', priority: 'Medium', date: '21 Mei 2024' },
      { id: 'task-3', title: 'Desain UI Wireframe', priority: 'Low', date: '25 Mei 2024' },
    ],
  },
  {
    id: 'progress',
    title: 'In Progress',
    status: 'progress',
    tasks: [
      { id: 'task-4', title: 'Implementasi Login', priority: 'High', date: '20 Mei 2024' },
      { id: 'task-5', title: 'API Task CRUD', priority: 'Medium', date: '23 Mei 2024' },
      { id: 'task-6', title: 'Integrasi Frontend', priority: 'Medium', date: '24 Mei 2024' },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    status: 'review',
    tasks: [
      { id: 'task-7', title: 'Validasi Form', priority: 'Medium', date: '19 Mei 2024' },
      { id: 'task-8', title: 'Testing API', priority: 'Low', date: '21 Mei 2024' },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    status: 'done',
    tasks: [
      { id: 'task-9', title: 'Setup Project', priority: 'Low', date: '10 Mei 2024' },
      { id: 'task-10', title: 'Install Dependencies', priority: 'Low', date: '11 Mei 2024' },
      { id: 'task-11', title: 'Buat Table Users', priority: 'Low', date: '12 Mei 2024' },
    ],
  },
];

function TaskContent() {
  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumnIndex = columns.findIndex((column) => column.id === source.droppableId);
    const destinationColumnIndex = columns.findIndex((column) => column.id === destination.droppableId);
    const sourceColumn = columns[sourceColumnIndex];
    const destinationColumn = columns[destinationColumnIndex];

    const sourceTasks = [...sourceColumn.tasks];
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceTasks.splice(destination.index, 0, movedTask);
      const newColumns = [...columns];
      newColumns[sourceColumnIndex] = { ...sourceColumn, tasks: sourceTasks };
      setColumns(newColumns);
      return;
    }

    const destinationTasks = [...destinationColumn.tasks];
    destinationTasks.splice(destination.index, 0, movedTask);

    const newColumns = [...columns];
    newColumns[sourceColumnIndex] = { ...sourceColumn, tasks: sourceTasks };
    newColumns[destinationColumnIndex] = { ...destinationColumn, tasks: destinationTasks };
    setColumns(newColumns);
  };

  return (
    <section className="board-panel">
      <div className="board-header">
        <div>
          <h2>Task Board</h2>
          <select>
            <option>All Projects</option>
            <option>Web Development</option>
            <option>Database Project</option>
          </select>
        </div>
        <div className="board-actions">
          <button>⌯ Filter</button>
          <button>↕ Sort</button>
          <button className="primary-btn">＋ Add Task</button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-grid">
          {columns.map((column) => (
            <TaskColumn key={column.id} column={column} />
          ))}
        </div>
      </DragDropContext>
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
