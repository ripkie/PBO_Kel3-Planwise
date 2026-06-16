import api from '../api/api';

export async function getTasks(params = {}) {
  const response = await api.get('/tasks', { params });
  return response.data;
}

export async function createTask(task) {
  const response = await api.post('/tasks', task);
  return response.data;
}

export async function updateTaskStatus(taskId, status) {
  const response = await api.put(`/tasks/${taskId}/status`, { status });
  return response.data;
}

export async function updateTask(taskId, data) {
  const response = await api.put(`/tasks/${taskId}`, data);
  return response.data;
}

export async function deleteTask(taskId) {
  await api.delete(`/tasks/${taskId}`);
}

export async function getLabels() {
  const response = await api.get('/labels');
  return response.data;
}

export async function createLabel(label) {
  const response = await api.post('/labels', label);
  return response.data;
}

export async function deleteLabel(labelId) {
  await api.delete(`/labels/${labelId}`);
}

export async function getKanbanBoard() {
  const response = await api.get('/tasks/kanban');
  return response.data;
}

export async function getOverdueTasks() {
  const response = await api.get('/tasks/overdue');
  return response.data;
}

export async function notifyOverdueTasks() {
  const response = await api.post('/tasks/overdue/notify');
  return response.data;
}
