import React, { useState, useRef, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Theme } from '../theme';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  url?: string;
}

export interface NotificationBadgeProps {
  count?: number;
  notifications?: Notification[];
  onClick?: () => void;
  onNotificationClick?: (notification: Notification) => void;
  onMarkAllRead?: () => void;
  onMarkAsRead?: (id: string) => void;
  className?: string;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const NotificationContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const NotificationButton = styled.button<{ hasUnread: boolean }>`
  position: relative;
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  color: ${({ theme }) => theme.color.textSecondary};
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  
  &:hover {
    background: ${({ theme }) => theme.color.neutralBg};
    color: ${({ theme }) => theme.color.text};
  }
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.focus};
    outline-offset: 2px;
  }
  
  /* Badge */
  ${({ hasUnread, theme }) => hasUnread && css`
    &::after {
      content: '';
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      background: ${theme.color.danger};
      border-radius: 50%;
      border: 2px solid ${theme.color.surface};
    }
  `}
`;

const NotificationIcon = styled.div`
  font-size: 20px;
  line-height: 1;
`;

const NotificationDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  width: 360px;
  max-width: 90vw;
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.neutralBorder};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  margin-top: ${({ theme }) => theme.spacing.xs};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transform: ${({ isOpen }) => isOpen ? 'translateY(0)' : 'translateY(-8px)'};
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  
  ${({ isOpen }) => isOpen && css`
    animation: ${fadeIn} 0.2s ease-out;
  `}
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.color.neutralBorder};
`;

const NotificationTitle = styled.h3`
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeBase};
  font-weight: ${({ theme }) => theme.font.weightBold};
  color: ${({ theme }) => theme.color.text};
  margin: 0;
`;

const MarkAllReadButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.color.primary};
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeSm};
  font-weight: ${({ theme }) => theme.font.weightMedium};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  
  &:hover {
    background: ${({ theme }) => theme.color.primaryLight};
  }
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.focus};
    outline-offset: 2px;
  }
`;

const NotificationList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.color.neutralBg};
    border-radius: ${({ theme }) => theme.radius.sm};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color.neutralBorder};
    border-radius: ${({ theme }) => theme.radius.sm};
    
    &:hover {
      background: ${({ theme }) => theme.color.textSecondary};
    }
  }
`;

const NotificationItem = styled.div<{ unread: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.color.neutralBorder};
  cursor: pointer;
  background: ${({ theme, unread }) => 
    unread ? theme.color.primaryLight : 'transparent'
  };
  transition: background ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${({ theme }) => theme.color.neutralBg};
  }
`;

const NotificationItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const NotificationItemTitle = styled.div<{ unread: boolean }>`
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeSm};
  font-weight: ${({ theme, unread }) => 
    unread ? theme.font.weightMedium : theme.font.weightRegular
  };
  color: ${({ theme }) => theme.color.text};
  line-height: ${({ theme }) => theme.font.lineHeightTight};
  flex: 1;
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const NotificationItemTime = styled.div`
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeXs};
  color: ${({ theme }) => theme.color.textSecondary};
  white-space: nowrap;
`;

const NotificationItemMessage = styled.div`
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeSm};
  color: ${({ theme }) => theme.color.textSecondary};
  line-height: ${({ theme }) => theme.font.lineHeightTight};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const NotificationTypeIcon = styled.div<{ type: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme, type }) => {
    switch (type) {
      case 'success': return theme.color.success;
      case 'warning': return theme.color.warning;
      case 'error': return theme.color.danger;
      default: return theme.color.primary;
    }
  }};
  margin-right: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
`;

const EmptyNotifications = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.color.textSecondary};
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeSm};
`;

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
};

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count = 0,
  notifications = [],
  onClick,
  onNotificationClick,
  onMarkAllRead,
  onMarkAsRead,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const hasUnread = unreadCount > 0;

  const handleToggle = () => {
    setIsOpen(!isOpen);
    onClick?.();
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead?.(notification.id);
    }
    onNotificationClick?.(notification);
    setIsOpen(false);
  };

  const handleMarkAllRead = () => {
    onMarkAllRead?.();
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <NotificationContainer ref={containerRef} className={className}>
      <NotificationButton
        hasUnread={hasUnread}
        onClick={handleToggle}
        aria-label={`Notifications (${unreadCount} unread)`}
        aria-expanded={isOpen}
      >
        <NotificationIcon>🔔</NotificationIcon>
      </NotificationButton>
      
      {isOpen && (
        <NotificationDropdown isOpen={isOpen}>
          <NotificationHeader>
            <NotificationTitle>
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </NotificationTitle>
            {unreadCount > 0 && (
              <MarkAllReadButton
                onClick={handleMarkAllRead}
                type="button"
              >
                Mark all read
              </MarkAllReadButton>
            )}
          </NotificationHeader>
          
          <NotificationList>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  unread={!notification.read}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <NotificationItemHeader>
                    <NotificationItemTitle unread={!notification.read}>
                      <NotificationTypeIcon type={notification.type} />
                      {notification.title}
                    </NotificationItemTitle>
                    <NotificationItemTime>
                      {formatTimeAgo(notification.timestamp)}
                    </NotificationItemTime>
                  </NotificationItemHeader>
                  <NotificationItemMessage>
                    {notification.message}
                  </NotificationItemMessage>
                </NotificationItem>
              ))
            ) : (
              <EmptyNotifications>
                No notifications
              </EmptyNotifications>
            )}
          </NotificationList>
        </NotificationDropdown>
      )}
    </NotificationContainer>
  );
};

export default NotificationBadge; 