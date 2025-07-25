import React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  ariaLabel?: string;
  role?: string;
  'aria-pressed'?: boolean;
}

const variantStyle = (variant: ButtonVariant, theme: Theme) => {
  switch (variant) {
    case 'primary':
      return css`
        background: ${theme.color.primary};
        color: #fff;
        &:hover:not(:disabled) { background: ${theme.color.primaryHover}; }
      `;
    case 'secondary':
      return css`
        background: ${theme.color.secondary};
        color: #fff;
        &:hover:not(:disabled) { background: #475569; }
      `;
    case 'danger':
      return css`
        background: ${theme.color.danger};
        color: #fff;
        &:hover:not(:disabled) { background: #b91c1c; }
      `;
    case 'success':
      return css`
        background: ${theme.color.success};
        color: #fff;
        &:hover:not(:disabled) { background: #166534; }
      `;
    default:
      return '';
  }
};

const sizeStyle = (size: ButtonSize, theme: Theme) => {
  switch (size) {
    case 'sm': return css`font-size: 14px; padding: 6px 14px;`;
    case 'lg': return css`font-size: 18px; padding: 12px 28px;`;
    case 'md':
    default: return css`font-size: 16px; padding: 10px 20px;`;
  }
};

const StyledButton = styled.button<{ $variant: ButtonVariant; $size: ButtonSize }>`
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightBold};
  cursor: pointer;
  transition: background 0.15s;
  ${props => variantStyle(props.$variant, props.theme)}
  ${props => sizeStyle(props.$size, props.theme)}
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.color.primary};
    outline-offset: 2px;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
    z-index: 1;
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  ariaLabel,
  role = 'button',
  ...rest
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      aria-label={ariaLabel}
      role={role}
      aria-disabled={rest.disabled}
      aria-pressed={rest['aria-pressed']}
      tabIndex={rest.tabIndex ?? 0}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

export default Button; 