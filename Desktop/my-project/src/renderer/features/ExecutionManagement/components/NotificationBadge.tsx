import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { RootState } from '@/renderer/store';
import { markAsRead, markAllAsRead } from '../store/notificationSlice';
import Notification from '../../../shared/components/Notification';

const NotificationBadge: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state: RootState) => state.notifications.notifications);
  const unreadCount = notifications.filter((n: any) => !n.read).length;
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleMarkAsRead = (id: string) => dispatch(markAsRead(id));
  const handleMarkAll = () => dispatch(markAllAsRead());

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={handleOpen} style={{ position: 'relative' }}>
        🔔
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: -6, right: -6, background: 'red', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: 12 }}>
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: 32, width: 340, background: '#fff', border: '1px solid #ccc', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 100 }}>
          <div style={{ padding: 12, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <b>알림</b>
            <button onClick={handleMarkAll} style={{ fontSize: 12 }}>모두 읽음</button>
            <button onClick={handleClose} style={{ fontSize: 12 }}>닫기</button>
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, maxHeight: 320, overflowY: 'auto' }}>
            {notifications.length === 0 && <li style={{ padding: 16, color: '#888' }}>알림 없음</li>}
            {notifications.map((n: any) => (
              <li key={n.id} style={{ padding: 8, background: n.read ? '#f5f5f5' : '#e3f2fd', borderBottom: '1px solid #eee', cursor: 'pointer' }}
                  onClick={() => handleMarkAsRead(n.id)}>
                <Notification type={n.type}>{n.message}</Notification>
                <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{new Date(n.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBadge; 