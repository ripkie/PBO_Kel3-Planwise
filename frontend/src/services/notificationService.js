import api from '../api/api';

export async function getNotificationsByUser(userId) {
  const response = await api.get(`/notifications/user/${userId}`);
  return response.data;
}

export async function markNotificationAsRead(notifId) {
  const response = await api.patch(`/notifications/${notifId}/read`);
  return response.data;
}

export async function markAllAsRead(userId) {
  await api.patch(`/notifications/user/${userId}/read-all`);
}

export async function deleteNotification(notifId) {
  await api.delete(`/notifications/${notifId}`);
}

export async function deleteReadNotifications(userId) {
  await api.delete(`/notifications/user/${userId}/read`);
}