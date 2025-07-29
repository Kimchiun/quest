import React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const getVariantStyle = (variant: ButtonVariant = 'primary', theme: Theme) => {
  switch (variant) {
    case 'secondary':
      return css`
        background: ${theme.color.neutral};
        color: ${theme.color.text};
        border: 1px solid ${theme.color.neutralBorder};
        &:hover:not(:disabled) {
          background: ${theme.color.neutralBg};
          border-color: ${theme.color.primary};
          color: ${theme.color.primary};
        }
      `;
    case 'danger':
      return css`
        background: ${theme.color.danger};
        color: #fff;
        border: 1px solid ${theme.color.danger};
        &:hover:not(:disabled) {
          background: ${theme.color.dangerBg};
          color: ${theme.color.danger};
          border-color: ${theme.color.danger};
        }
      `;
    case 'success':
      return css`
        background: ${theme.color.success};
        color: #fff;
        border: 1px solid ${theme.color.success};
        &:hover:not(:disabled) {
          background: ${theme.color.successBg};
          color: ${theme.color.success};
          border-color: ${theme.color.success};
        }
      `;
    default:
      return css`
        background: ${theme.color.primary};
        color: #fff;
        border: 1px solid ${theme.color.primary};
        &:hover:not(:disabled) {
          background: ${theme.color.primaryHover};
          border-color: ${theme.color.primaryHover};
        }
      `;
  }
};

const getSizeStyle = (size: ButtonSize = 'md', theme: Theme) => {
  switch (size) {
    case 'sm':
      return css`
        padding: ${theme.spacing.xs} ${theme.spacing.md};
        font-size: ${theme.font.sizeSm};
      `;
    case 'lg':
      return css`
        padding: ${theme.spacing.lg} ${theme.spacing.xl};
        font-size: ${theme.font.sizeLg};
      `;
    default:
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.lg};
        font-size: ${theme.font.sizeBase};
      `;
  }
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  border-radius: ${({ theme }) => theme.radius.md};
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightBold};
  line-height: ${({ theme }) => theme.font.lineHeight};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  transition: background 0.15s, color 0.15s, border 0.15s, box-shadow 0.15s;
  border: 1px solid transparent;
  cursor: pointer;
  user-select: none;
  outline: none;
  ${props => getVariantStyle(props.variant, props.theme)}
  ${props => getSizeStyle(props.size, props.theme)}

  &:disabled {
    background: ${({ theme }) => theme.color.disabledBg};
    color: ${({ theme }) => theme.color.disabledText};
    border-color: ${({ theme }) => theme.color.disabled};
    cursor: not-allowed;
    opacity: 0.6;
    box-shadow: none;
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.focus};
    outline-offset: 2px;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.color.focusRing};
    z-index: 1;
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
      aria-disabled={props.disabled}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button; 