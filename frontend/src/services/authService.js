import api from '../api/api';

const STORAGE_KEY = 'planwise_user';

export async function registerUser(payload) {
  const response = await api.post('/users/register', payload);
  saveCurrentUser(response.data);
  return response.data;
}

export async function loginUser(payload) {
  const response = await api.post('/users/login', payload);
  saveCurrentUser(response.data);
  return response.data;
}

export async function logoutUser() {
  try {
    await api.post('/users/logout');
  } finally {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export async function getProfile(userId) {
  const response = await api.get(`/users/${userId}/profile`);
  saveCurrentUser(response.data);
  return response.data;
}

export function saveCurrentUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function getCurrentUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function getUserInitials(user) {
  const name = user?.nama || user?.email || 'User';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';
}
