import api from '../api/api';
import { getCurrentUser } from './authService';

function normalizeNotification(notification) {
  return {
    ...notification,
    isRead: notification.read ?? notification.isRead ?? false,
  };
}

function getCurrentUserId() {
  return getCurrentUser()?.id || null;
}

export async function getNotificationsByUser() {
  const userId = getCurrentUserId();
  if (!userId) return [];

  const response = await api.get(`/notifications/user/${userId}`);
  return response.data.map(normalizeNotification);
}

export async function getUnreadNotifications() {
  const userId = getCurrentUserId();
  if (!userId) return [];

  const response = await api.get(`/notifications/user/${userId}/unread`);
  return response.data.map(normalizeNotification);
}

export async function markNotificationAsRead(notifId) {
  const response = await api.patch(`/notifications/${notifId}/read`);
  return normalizeNotification(response.data);
}

export async function markAllAsRead() {
  const userId = getCurrentUserId();

  if (userId) {
    await api.patch(`/notifications/user/${userId}/read-all`);
    return;
  }

  const unread = await getUnreadNotifications();
  await Promise.all(unread.map((notif) => markNotificationAsRead(notif.id)));
}

export async function deleteNotification(notifId) {
  await api.delete(`/notifications/${notifId}`);
}

export async function deleteReadNotifications() {
  const userId = getCurrentUserId();

  if (userId) {
    await api.delete(`/notifications/user/${userId}/read`);
    return;
  }

  const notifications = await getNotificationsByUser();
  const readNotifications = notifications.filter((notif) => notif.isRead);
  await Promise.all(readNotifications.map((notif) => deleteNotification(notif.id)));
}
