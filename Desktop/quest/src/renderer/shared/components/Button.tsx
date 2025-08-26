import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Theme } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const getVariantStyle = (variant: ButtonVariant = 'primary', theme: Theme) => {
  switch (variant) {
    case 'secondary':
      return css`
        background: white;
        color: ${theme.color.text.primary};
        border: 2px solid ${theme.color.border.primary};
        box-shadow: none;
        &:hover:not(:disabled) {
          background: ${theme.color.surface.secondary};
          border-color: ${theme.color.primary[600]};
          color: ${theme.color.primary[600]};
        }
      `;
    case 'danger':
      return css`
        background: ${theme.color.danger[500]};
        color: white;
        border: 2px solid ${theme.color.danger[500]};
        box-shadow: none;
        &:hover:not(:disabled) {
          background: ${theme.color.danger[50]};
          border-color: ${theme.color.danger[50]};
          color: ${theme.color.danger[600]};
        }
      `;
    case 'success':
      return css`
        background: ${theme.color.success[500]};
        color: white;
        border: 2px solid ${theme.color.success[500]};
        box-shadow: none;
        &:hover:not(:disabled) {
          background: ${theme.color.success[50]};
          border-color: ${theme.color.success[50]};
          color: ${theme.color.success[600]};
        }
      `;
    case 'warning':
      return css`
        background: ${theme.color.warning[500]};
        color: white;
        border: 2px solid ${theme.color.warning[500]};
        box-shadow: none;
        &:hover:not(:disabled) {
          background: ${theme.color.warning[50]};
          border-color: ${theme.color.warning[50]};
          color: ${theme.color.warning[600]};
        }
      `;
    case 'ghost':
      return css`
        background: transparent;
        color: ${theme.color.text.primary};
        border: 2px solid transparent;
        box-shadow: none;
        &:hover:not(:disabled) {
          background: ${theme.color.surface.secondary};
          color: ${theme.color.primary[600]};
        }
      `;
    default:
      return css`
        background: ${theme.color.primary[500]};
        color: white;
        border: 2px solid ${theme.color.primary[500]};
        box-shadow: none;
        &:hover:not(:disabled) {
          background: ${theme.color.primary[50]};
          border-color: ${theme.color.primary[50]};
          color: ${theme.color.primary[600]};
        }
      `;
  }
};

const getSizeStyle = (size: ButtonSize = 'md', theme: Theme) => {
  switch (size) {
    case 'sm':
      return css`
        padding: ${theme.spacing['2']} ${theme.spacing['4']};
        font-size: ${theme.font.size.sm};
        min-height: 32px;
        gap: ${theme.spacing['2']};
      `;
    case 'lg':
      return css`
        padding: ${theme.spacing['6']} ${theme.spacing['8']};
        font-size: ${theme.font.size.lg};
        min-height: 48px;
        gap: ${theme.spacing['4']};
      `;
    case 'xl':
      return css`
        padding: ${theme.spacing['8']} ${theme.spacing['12']};
        font-size: ${theme.font.size.xl};
        min-height: 56px;
        gap: ${theme.spacing['6']};
      `;
    default:
      return css`
        padding: ${theme.spacing['4']} ${theme.spacing['6']};
        font-size: ${theme.font.size.base};
        min-height: 40px;
        gap: ${theme.spacing['3']};
      `;
  }
};

const StyledButton = styled.button<ButtonProps & { $loading?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  border-radius: ${({ theme }) => theme.radius.md};
  font-family: ${({ theme }) => theme.font.family.primary};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  line-height: ${({ theme }) => theme.font.lineHeight.tight};
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.out};
  border: 1px solid transparent;
  cursor: pointer;
  user-select: none;
  outline: none;
  position: relative;
  overflow: hidden;
  
  ${props => getVariantStyle(props.variant, props.theme)}
  ${props => getSizeStyle(props.size, props.theme)}

  &:disabled {
    background: ${({ theme }) => theme.color.neutral[100]};
    color: ${({ theme }) => theme.color.neutral[400]};
    border-color: ${({ theme }) => theme.color.neutral[200]};
    cursor: not-allowed;
    opacity: 0.6;
    box-shadow: none;
    transform: none;
  }
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.focus};
    outline-offset: 2px;
    box-shadow: ${({ theme }) => theme.shadow.focus};
    z-index: 1;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: ${({ theme }) => theme.shadow.inner};
  }

  /* Loading state */
  ${props => props.$loading && css`
    cursor: wait;
    pointer-events: none;
  `}
`;

const ButtonContent = styled.div<{ loading?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ loading }) => (loading ? 0.7 : 1)};
`;

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  children, 
  disabled,
  ...props 
}) => {
  const isDisabled = disabled || loading;

  const renderIcon = () => {
    if (!icon) return null;
    return icon;
  };

  return (
    <StyledButton 
      variant={variant} 
      size={size} 
      fullWidth={fullWidth}
      $loading={loading}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      <ButtonContent loading={loading}>
        {loading && <LoadingSpinner />}
        {icon && iconPosition === 'left' && !loading && renderIcon()}
        {children}
        {icon && iconPosition === 'right' && !loading && renderIcon()}
      </ButtonContent>
    </StyledButton>
  );
};

export default Button; 