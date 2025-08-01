import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  message?: string;
  overlay?: boolean;
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const SpinnerContainer = styled.div<{ overlay: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${props => props.overlay && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    animation: ${fadeIn} 0.3s ease-in-out;
  `}
`;

const Spinner = styled.div<{ size: string; color: string }>`
  width: ${props => {
    switch (props.size) {
      case 'small': return '20px';
      case 'large': return '60px';
      default: return '40px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'small': return '20px';
      case 'large': return '60px';
      default: return '40px';
    }
  }};
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid ${props => props.color};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Message = styled.div<{ size: string }>`
  margin-top: ${props => props.size === 'small' ? '8px' : '16px'};
  font-size: ${props => props.size === 'small' ? '12px' : '14px'};
  color: ${props => props.overlay ? 'white' : 'inherit'};
  text-align: center;
  max-width: 200px;
`;

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#2196f3',
  message,
  overlay = false,
}) => {
  return (
    <SpinnerContainer overlay={overlay}>
      <Spinner size={size} color={color} />
      {message && <Message size={size}>{message}</Message>}
    </SpinnerContainer>
  );
};

export default LoadingSpinner; 