import api from '../api/api';

export async function getTasks() {
  const response = await api.get('/tasks');
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
