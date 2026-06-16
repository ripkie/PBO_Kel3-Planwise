import api from '../api/api';
import { getCurrentUser } from './authService';

export function getCurrentUserId() {
  return getCurrentUser()?.id || null;
}

export async function getTasks(params = {}) {
  const userId = getCurrentUserId();
  const endpoint = userId ? `/tasks/my/${userId}` : '/tasks';
  const response = await api.get(endpoint, { params });
  return response.data;
}

export async function createTask(task) {
  const userId = getCurrentUserId();
  const payload = userId && !task.ownerId
    ? { ...task, ownerId: userId }
    : task;

  const response = await api.post('/tasks', payload);
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
  const tasks = await getTasks();
  return {
    TODO: tasks.filter((task) => task.status === 'TODO'),
    IN_PROGRESS: tasks.filter((task) => task.status === 'IN_PROGRESS'),
    REVIEW: tasks.filter((task) => task.status === 'REVIEW'),
    DONE: tasks.filter((task) => task.status === 'DONE'),
  };
}

export async function getOverdueTasks() {
  const tasks = await getTasks();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return tasks.filter((task) => {
    if (!task.deadline || task.status === 'DONE') return false;
    return new Date(task.deadline) < today;
  });
}

export async function notifyOverdueTasks() {
  const response = await api.post('/tasks/overdue/notify');
  return response.data;
}
