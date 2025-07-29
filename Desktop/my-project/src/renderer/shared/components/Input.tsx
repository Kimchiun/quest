import React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from '../theme';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'error' | 'success';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  inputSize?: InputSize;
  variant?: InputVariant;
  fullWidth?: boolean;
  error?: boolean;
  success?: boolean;
}

const getSizeStyle = (inputSize: InputSize = 'md', theme: Theme) => {
  switch (inputSize) {
    case 'sm':
      return css`
        padding: ${theme.spacing.xs} ${theme.spacing.sm};
        font-size: ${theme.font.sizeSm};
        border-radius: ${theme.radius.sm};
      `;
    case 'lg':
      return css`
        padding: ${theme.spacing.md} ${theme.spacing.lg};
        font-size: ${theme.font.sizeLg};
        border-radius: ${theme.radius.md};
      `;
    default:
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        font-size: ${theme.font.sizeBase};
        border-radius: ${theme.radius.sm};
      `;
  }
};

const getVariantStyle = (variant: InputVariant = 'default', theme: Theme) => {
  switch (variant) {
    case 'error':
      return css`
        border-color: ${theme.color.danger};
        &:focus {
          border-color: ${theme.color.danger};
          box-shadow: 0 0 0 3px ${theme.color.dangerBg};
        }
      `;
    case 'success':
      return css`
        border-color: ${theme.color.success};
        &:focus {
          border-color: ${theme.color.success};
          box-shadow: 0 0 0 3px ${theme.color.successBg};
        }
      `;
    default:
      return css`
        border-color: ${theme.color.neutralBorder};
        &:focus {
          border-color: ${theme.color.focus};
          box-shadow: 0 0 0 3px ${theme.color.focusRing};
        }
      `;
  }
};

const StyledInput = styled.input<InputProps>`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightRegular};
  line-height: ${({ theme }) => theme.font.lineHeight};
  color: ${({ theme }) => theme.color.text};
  background-color: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.neutralBorder};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  transition: border-color 0.15s, box-shadow 0.15s, background-color 0.15s;
  outline: none;
  box-sizing: border-box;

  ${props => getSizeStyle(props.inputSize, props.theme)}
  ${props => getVariantStyle(props.variant, props.theme)}

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.color.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.focus};
    outline-offset: 2px;
    z-index: 1;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.color.disabledBg};
    color: ${({ theme }) => theme.color.disabledText};
    border-color: ${({ theme }) => theme.color.disabled};
    cursor: not-allowed;
    opacity: 0.6;
  }

  &::placeholder {
    color: ${({ theme }) => theme.color.textSecondary};
    opacity: 0.7;
  }

  /* Error state override */
  ${props => props.error && css`
    border-color: ${props.theme.color.danger};
    &:focus {
      border-color: ${props.theme.color.danger};
      box-shadow: 0 0 0 3px ${props.theme.color.dangerBg};
    }
  `}

  /* Success state override */
  ${props => props.success && css`
    border-color: ${props.theme.color.success};
    &:focus {
      border-color: ${props.theme.color.success};
      box-shadow: 0 0 0 3px ${props.theme.color.successBg};
    }
  `}
`;

const Input: React.FC<InputProps> = ({ 
  inputSize = 'md',
  variant = 'default',
  fullWidth = true,
  error,
  success,
  disabled,
  ...props 
}) => {
  // Determine variant based on error/success props
  let finalVariant = variant;
  if (error) finalVariant = 'error';
  if (success) finalVariant = 'success';

  return (
    <StyledInput
      inputSize={inputSize}
      variant={finalVariant}
      fullWidth={fullWidth}
      error={error}
      success={success}
      disabled={disabled}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? `${props.id || 'input'}-error` : undefined}
      {...props}
    />
  );
};

export default Input; 