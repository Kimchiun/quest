import React from 'react';
import styled, { css } from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  ${({ size }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: 6px 12px;
          font-size: 12px;
        `;
      case 'lg':
        return css`
          padding: 12px 24px;
          font-size: 16px;
        `;
      default:
        return css`
          padding: 8px 16px;
          font-size: 14px;
        `;
    }
  }}

  ${({ variant }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: #f3f4f6;
          color: #374151;
          &:hover {
            background-color: #e5e7eb;
          }
        `;
      case 'danger':
        return css`
          background-color: #dc2626;
          color: #ffffff;
          &:hover {
            background-color: #b91c1c;
          }
        `;
      case 'success':
        return css`
          background-color: #10b981;
          color: #ffffff;
          &:hover {
            background-color: #059669;
          }
        `;
      default:
        return css`
          background-color: #2563eb;
          color: #ffffff;
          &:hover {
            background-color: #1d4ed8;
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
`;

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  children, 
  ...props 
}) => {
  return (
    <StyledButton 
      variant={variant} 
      size={size} 
      fullWidth={fullWidth} 
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button; 