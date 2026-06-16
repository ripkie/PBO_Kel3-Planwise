import api from '../api/api';

export async function createGroupTask(groupTask) {
  const response = await api.post('/group-tasks', groupTask);
  return response.data;
}

export async function getGroupTask(taskId) {
  const response = await api.get(`/group-tasks/${taskId}`);
  return response.data;
}

export async function addGroupMember(taskId, userId) {
  const response = await api.post(`/group-tasks/${taskId}/members/${userId}`, {});
  return response.data;
}

export async function assignGroupTask(taskId, userId) {
  const response = await api.post(`/group-tasks/${taskId}/assign/${userId}`, {});
  return response.data;
}
