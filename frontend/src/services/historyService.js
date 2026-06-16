import api from '../api/api';
import { getCurrentUser } from './authService';

function getCurrentUserId() {
  return getCurrentUser()?.id || null;
}

export async function getAllHistory() {
  const userId = getCurrentUserId();
  if (!userId) return [];

  const response = await api.get(`/histories/user/${userId}`);
  return response.data;
}

export async function getAllHistorySorted() {
  return getAllHistory();
}

export async function getHistoryByTask(taskId) {
  const response = await api.get(`/histories/task/${taskId}`);
  return response.data;
}

export async function getSortedHistory(taskId) {
  const response = await api.get(`/histories/task/${taskId}/sorted`);
  return response.data;
}
