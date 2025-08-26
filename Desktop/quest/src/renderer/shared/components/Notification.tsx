import React from 'react';
import styled from 'styled-components';

interface NotificationProps {
  type?: 'info' | 'success' | 'error' | 'warning';
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const getColor = (type: string) => {
  switch (type) {
    case 'success': return '#15803d';
    case 'error': return '#ef4444';
    case 'warning': return '#f59e42';
    case 'info':
    default: return '#2563eb';
  }
};

const StyledNotification = styled.div<{ $type: string }>`
  padding: 12px 20px;
  border-radius: 6px;
  background: ${({ $type }) => getColor($type)}22;
  color: ${({ $type }) => getColor($type)};
  font-size: 16px;
  font-weight: 500;
  margin: 8px 0;
`;

const Notification: React.FC<NotificationProps> = ({ type = 'info', children, style }) => (
  <StyledNotification
    $type={type}
    role="status"
    aria-live="polite"
    style={style}
  >
    {children}
  </StyledNotification>
);

export default Notification; 