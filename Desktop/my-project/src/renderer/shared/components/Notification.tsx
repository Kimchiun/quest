import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Theme } from '../theme';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  type?: NotificationType;
  message: string;
  onClose?: () => void;
  duration?: number; // ms
}

const typeStyle = (type: NotificationType, theme: Theme) => {
  switch (type) {
    case 'success': return css`background: ${theme.color.success}; color: #fff;`;
    case 'error': return css`background: ${theme.color.danger}; color: #fff;`;
    case 'warning': return css`background: #facc15; color: #222;`;
    case 'info':
    default: return css`background: ${theme.color.primary}; color: #fff;`;
  }
};

const NotiBox = styled.div<{ type: NotificationType; theme: Theme }>`
  min-width: 240px;
  max-width: 400px;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.sm};
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  ${({ type, theme }) => typeStyle(type, theme)}
  position: relative;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: inherit;
  font-size: 1.2rem;
  position: absolute;
  top: 8px; right: 8px;
  cursor: pointer;
  opacity: 0.7;
  &:hover { opacity: 1; }
`;

const Notification: React.FC<NotificationProps> = ({ type = 'info', message, onClose, duration }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <NotiBox type={type}>
      <span>{message}</span>
      {onClose && <CloseBtn aria-label="닫기" onClick={onClose}>&times;</CloseBtn>}
    </NotiBox>
  );
};

export default Notification; 