import api from '../api/api';

export async function getAllHistory() {
  const response = await api.get('/histories');
  return response.data;
}

export async function getAllHistorySorted() {
  const response = await api.get('/histories/sorted');
  return response.data;
}

export async function getHistoryByTask(taskId) {
  const response = await api.get(`/histories/task/${taskId}`);
  return response.data;
}

export async function getSortedHistory(taskId) {
  const response = await api.get(`/histories/task/${taskId}/sorted`);
  return response.data;
}
