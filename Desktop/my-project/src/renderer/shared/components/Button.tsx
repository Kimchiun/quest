import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Theme } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

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
        background: ${theme.color.surface};
        color: ${theme.color.text};
        border: 1px solid ${theme.color.neutralBorder};
        box-shadow: ${theme.shadow.sm};
        &:hover:not(:disabled) {
          background: ${theme.color.neutralBg};
          border-color: ${theme.color.primary};
          color: ${theme.color.primary};
          box-shadow: ${theme.shadow.md};
          transform: translateY(-1px);
        }
      `;
    case 'danger':
      return css`
        background: ${theme.color.danger};
        color: #fff;
        border: 1px solid ${theme.color.danger};
        box-shadow: ${theme.shadow.sm};
        &:hover:not(:disabled) {
          background: ${theme.color.dangerHover};
          border-color: ${theme.color.dangerHover};
          box-shadow: ${theme.shadow.md};
          transform: translateY(-1px);
        }
      `;
    case 'success':
      return css`
        background: ${theme.color.success};
        color: #fff;
        border: 1px solid ${theme.color.success};
        box-shadow: ${theme.shadow.sm};
        &:hover:not(:disabled) {
          background: ${theme.color.successHover};
          border-color: ${theme.color.successHover};
          box-shadow: ${theme.shadow.md};
          transform: translateY(-1px);
        }
      `;
    case 'warning':
      return css`
        background: ${theme.color.warning};
        color: #fff;
        border: 1px solid ${theme.color.warning};
        box-shadow: ${theme.shadow.sm};
        &:hover:not(:disabled) {
          background: ${theme.color.warningHover};
          border-color: ${theme.color.warningHover};
          box-shadow: ${theme.shadow.md};
          transform: translateY(-1px);
        }
      `;
    case 'ghost':
      return css`
        background: transparent;
        color: ${theme.color.text};
        border: 1px solid transparent;
        &:hover:not(:disabled) {
          background: ${theme.color.neutralBg};
          color: ${theme.color.primary};
          box-shadow: ${theme.shadow.sm};
        }
      `;
    default:
      return css`
        background: ${theme.color.primary};
        color: #fff;
        border: 1px solid ${theme.color.primary};
        box-shadow: ${theme.shadow.sm};
        &:hover:not(:disabled) {
          background: ${theme.color.primaryHover};
          border-color: ${theme.color.primaryHover};
          box-shadow: ${theme.shadow.md};
          transform: translateY(-1px);
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
        min-height: 32px;
        gap: ${theme.spacing.xs};
      `;
    case 'lg':
      return css`
        padding: ${theme.spacing.lg} ${theme.spacing.xl};
        font-size: ${theme.font.sizeLg};
        min-height: 48px;
        gap: ${theme.spacing.md};
      `;
    default:
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.lg};
        font-size: ${theme.font.sizeBase};
        min-height: 40px;
        gap: ${theme.spacing.sm};
      `;
  }
};

const StyledButton = styled.button<ButtonProps & { $loading?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  border-radius: ${({ theme }) => theme.radius.md};
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightMedium};
  line-height: ${({ theme }) => theme.font.lineHeightTight};
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  border: 1px solid transparent;
  cursor: pointer;
  user-select: none;
  outline: none;
  position: relative;
  overflow: hidden;
  
  ${props => getVariantStyle(props.variant, props.theme)}
  ${props => getSizeStyle(props.size, props.theme)}

  &:disabled {
    background: ${({ theme }) => theme.color.disabledBg};
    color: ${({ theme }) => theme.color.disabledText};
    border-color: ${({ theme }) => theme.color.disabled};
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