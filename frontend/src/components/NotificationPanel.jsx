import { useState, useEffect } from 'react';
import {
  getNotificationsByUser,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
} from '../services/notificationService';

function NotificationPanel({ userId, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  async function fetchNotifications() {
    setLoading(true);
    try {
      const data = await getNotificationsByUser(userId);
      setNotifications(data);
    } catch (err) {
      console.error('Gagal memuat notifikasi:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkRead(notifId) {
    try {
      await markNotificationAsRead(notifId);
      setNotifications(prev =>
        prev.map(n => n.id === notifId ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllAsRead(userId);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(notifId) {
    try {
      await deleteNotification(notifId);
      setNotifications(prev => prev.filter(n => n.id !== notifId));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteRead() {
    try {
      await deleteReadNotifications(userId);
      setNotifications(prev => prev.filter(n => !n.isRead));
    } catch (err) {
      console.error(err);
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{
      width: '320px',
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      fontFamily: 'inherit',
    }}>
      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🔔</span>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>Notifikasi</span>
          {unreadCount > 0 && (
            <span style={{ background: '#ef4444', color: '#fff', fontSize: '11px', fontWeight: '600', padding: '1px 7px', borderRadius: '99px' }}>
              {unreadCount}
            </span>
          )}
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#9ca3af' }}>×</button>
      </div>

      {/* Action buttons */}
      {notifications.length > 0 && (
        <div style={{ padding: '8px 16px', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: '8px' }}>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} style={{ fontSize: '11px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0' }}>
              ✓ Tandai semua dibaca
            </button>
          )}
          <button onClick={handleDeleteRead} style={{ fontSize: '11px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', marginLeft: 'auto' }}>
            🗑 Hapus yang sudah dibaca
          </button>
        </div>
      )}

      {/* Body */}
      <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
        {loading && <p style={{ textAlign: 'center', color: '#9ca3af', padding: '20px', fontSize: '13px' }}>Memuat...</p>}

        {!loading && notifications.length === 0 && (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: '24px', fontSize: '13px' }}>Tidak ada notifikasi.</p>
        )}

        {!loading && notifications.map(notif => (
          <div key={notif.id} style={{
            padding: '12px 16px',
            borderBottom: '1px solid #f3f4f6',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
            background: notif.isRead ? 'transparent' : '#eff6ff',
            opacity: notif.isRead ? 0.65 : 1,
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, marginTop: '2px',
              background: notif.isRead ? '#f3f4f6' : '#dbeafe',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px'
            }}>
              {notif.pesan?.includes('status') ? '🔄' : notif.pesan?.includes('deadline') ? '📅' : '🏷️'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '13px', margin: '0 0 4px', lineHeight: 1.4, color: '#111827' }}>{notif.pesan}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {notif.task && <span style={{ fontSize: '12px', color: '#6b7280' }}>📋 {notif.task.judul}</span>}
                {!notif.isRead && (
                  <button onClick={() => handleMarkRead(notif.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: '#2563eb', padding: 0 }}>
                    Tandai dibaca
                  </button>
                )}
              </div>
            </div>
            {/* Tombol hapus */}
            <button onClick={() => handleDelete(notif.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', fontSize: '14px', padding: '2px', flexShrink: 0 }}
              title="Hapus notifikasi">
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationPanel;