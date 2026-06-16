import api from '../api/api';

function normalizeNotification(notification) {
  return {
    ...notification,
    isRead: notification.read ?? notification.isRead ?? false,
  };
}

export async function getNotificationsByUser() {
  const response = await api.get('/notifications');
  return response.data.map(normalizeNotification);
}

export async function getUnreadNotifications() {
  const response = await api.get('/notifications/unread');
  return response.data.map(normalizeNotification);
}

export async function markNotificationAsRead(notifId) {
  const response = await api.patch(`/notifications/${notifId}/read`);
  return normalizeNotification(response.data);
}

export async function markAllAsRead() {
  const unread = await getUnreadNotifications();
  await Promise.all(unread.map((notif) => markNotificationAsRead(notif.id)));
}

export async function deleteNotification(notifId) {
  await api.delete(`/notifications/${notifId}`);
}

export async function deleteReadNotifications() {
  const notifications = await getNotificationsByUser();
  const readNotifications = notifications.filter((notif) => notif.isRead);
  await Promise.all(readNotifications.map((notif) => deleteNotification(notif.id)));
}
