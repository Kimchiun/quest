import React from 'react';
import styled from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  fullWidth?: boolean;
}

const StyledInput = styled.input<InputProps>`
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  padding: 8px 12px;
  border: 1px solid ${props => props.error ? '#dc2626' : '#d1d5db'};
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.5;
  color: #374151;
  background-color: #ffffff;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &:disabled {
    background-color: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Input: React.FC<InputProps> = ({ error, fullWidth = true, ...props }) => {
  return <StyledInput error={error} fullWidth={fullWidth} {...props} />;
};

export default Input; 