import React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const getVariantStyle = (variant: ButtonVariant, theme: Theme) => {
  switch (variant) {
    case 'secondary':
      return css`
        background: ${theme.color.surface};
        color: ${theme.color.secondary};
        border: 1px solid ${theme.color.border};
        &:hover:not(:disabled) { background: ${theme.color.background}; }
      `;
    case 'danger':
      return css`
        background: ${theme.color.danger};
        color: #fff;
        &:hover:not(:disabled) { background: #dc2626; }
      `;
    case 'primary':
    default:
      return css`
        background: ${theme.color.primary};
        color: #fff;
        &:hover:not(:disabled) { background: ${theme.color.primaryHover}; }
      `;
  }
};

const getSizeStyle = (size: ButtonSize, theme: Theme) => {
  switch (size) {
    case 'sm':
      return css`
        font-size: ${theme.font.sizeSm};
        padding: ${theme.spacing.xs} ${theme.spacing.sm};
      `;
    case 'lg':
      return css`
        font-size: ${theme.font.sizeLg};
        padding: ${theme.spacing.md} ${theme.spacing.xl};
      `;
    case 'md':
    default:
      return css`
        font-size: ${theme.font.sizeBase};
        padding: ${theme.spacing.sm} ${theme.spacing.lg};
      `;
  }
};

const StyledButton = styled.button<ButtonProps>`
  border-radius: ${({ theme }) => theme.radius.md};
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightBold};
  border: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border 0.2s;
  ${({ variant = 'primary', theme }) => getVariantStyle(variant, theme)}
  ${({ size = 'md', theme }) => getSizeStyle(size, theme)}
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', ...rest }) => (
  <StyledButton variant={variant} size={size} {...rest}>{children}</StyledButton>
);

export default Button; 