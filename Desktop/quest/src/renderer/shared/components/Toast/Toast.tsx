import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Notification } from '../../../types';

interface ToastProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div<{ type: string; isVisible: boolean }>`
  position: relative;
  min-width: 300px;
  max-width: 400px;
  padding: 16px;
  margin: 8px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: ${props => props.isVisible ? slideIn : slideOut} 0.3s ease-in-out;
  animation-fill-mode: forwards;
  
  ${props => {
    switch (props.type) {
      case 'success':
        return `
          background: linear-gradient(135deg, #4caf50, #45a049);
          color: white;
        `;
      case 'error':
        return `
          background: linear-gradient(135deg, #f44336, #d32f2f);
          color: white;
        `;
      case 'warning':
        return `
          background: linear-gradient(135deg, #ff9800, #f57c00);
          color: white;
        `;
      case 'info':
      default:
        return `
          background: linear-gradient(135deg, #60a5fa, #3b82f6);
          color: white;
        `;
    }
  }}
`;

const ToastHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ToastTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 18px;
  opacity: 0.7;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`;

const ToastMessage = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
`;

const ToastAction = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-top: 8px;
  transition: background-color 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ProgressBar = styled.div<{ duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 0 0 8px 8px;
  animation: progress ${props => props.duration}ms linear;
  
  @keyframes progress {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
`;

const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const duration = notification.duration || 5000;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(notification.id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [notification.id, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(notification.id), 300);
  };

  const handleAction = () => {
    if (notification.action) {
      notification.action.onClick();
      handleClose();
    }
  };

  return (
    <ToastContainer type={notification.type} isVisible={isVisible}>
      <ToastHeader>
        <ToastTitle>{notification.title || getTitleByType(notification.type)}</ToastTitle>
        <CloseButton onClick={handleClose}>&times;</CloseButton>
      </ToastHeader>
      
      <ToastMessage>{notification.message}</ToastMessage>
      
      {notification.action && (
        <ToastAction onClick={handleAction}>
          {notification.action.label}
        </ToastAction>
      )}
      
      <ProgressBar duration={duration} />
    </ToastContainer>
  );
};

const getTitleByType = (type: string): string => {
  switch (type) {
    case 'success':
      return '성공';
    case 'error':
      return '오류';
    case 'warning':
      return '경고';
    case 'info':
    default:
      return '알림';
  }
};

export default Toast; 