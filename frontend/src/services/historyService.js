import api from '../api/api';

export async function getHistoryByTask(taskId) {
  const response = await api.get(`/histories/task/${taskId}`);
  return response.data;
}

export async function getSortedHistory(taskId) {
  const response = await api.get(`/histories/task/${taskId}/sorted`);
  return response.data;
}