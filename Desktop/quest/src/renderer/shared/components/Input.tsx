import React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from '../theme';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'error' | 'success' | 'warning';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  inputSize?: InputSize;
  variant?: InputVariant;
  fullWidth?: boolean;
  error?: boolean;
  success?: boolean;
  warning?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  helperText?: string;
}

const getSizeStyle = (inputSize: InputSize = 'md', theme: Theme) => {
  switch (inputSize) {
    case 'sm':
      return css`
        padding: ${theme.spacing.xs} ${theme.spacing.sm};
        font-size: ${theme.font.sizeSm};
        border-radius: ${theme.radius.sm};
        min-height: 32px;
      `;
    case 'lg':
      return css`
        padding: ${theme.spacing.md} ${theme.spacing.lg};
        font-size: ${theme.font.sizeLg};
        border-radius: ${theme.radius.md};
        min-height: 48px;
      `;
    default:
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        font-size: ${theme.font.sizeBase};
        border-radius: ${theme.radius.sm};
        min-height: 40px;
      `;
  }
};

const getVariantStyle = (variant: InputVariant = 'default', theme: Theme) => {
  switch (variant) {
    case 'error':
      return css`
        border-color: ${theme.color.danger};
        background-color: ${theme.color.dangerLight};
        &:focus {
          border-color: ${theme.color.danger};
          box-shadow: 0 0 0 3px ${theme.color.dangerBg};
          background-color: ${theme.color.surface};
        }
      `;
    case 'success':
      return css`
        border-color: ${theme.color.success};
        background-color: ${theme.color.successLight};
        &:focus {
          border-color: ${theme.color.success};
          box-shadow: 0 0 0 3px ${theme.color.successBg};
          background-color: ${theme.color.surface};
        }
      `;
    case 'warning':
      return css`
        border-color: ${theme.color.warning};
        background-color: ${theme.color.warningLight};
        &:focus {
          border-color: ${theme.color.warning};
          box-shadow: 0 0 0 3px ${theme.color.warningBg};
          background-color: ${theme.color.surface};
        }
      `;
    default:
      return css`
        border-color: ${theme.color.neutralBorder};
        background-color: ${theme.color.surface};
        &:focus {
          border-color: ${theme.color.focus};
          box-shadow: 0 0 0 3px ${theme.color.focusRing};
        }
      `;
  }
};

const InputContainer = styled.div<{ $fullWidth?: boolean }>`
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const InputWrapper = styled.div<{ $hasLeftIcon?: boolean; $hasRightIcon?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div<{ position: 'left' | 'right' }>`
  position: absolute;
  ${({ position }) => position}: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color.textSecondary};
  pointer-events: none;
  z-index: 1;
`;

const StyledInput = styled.input<InputProps & { $hasLeftIcon?: boolean; $hasRightIcon?: boolean }>`
  width: 100%;
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightRegular};
  line-height: ${({ theme }) => theme.font.lineHeight};
  color: ${({ theme }) => theme.color.text};
  background-color: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.neutralBorder};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  outline: none;
  box-sizing: border-box;
  padding-left: ${({ $hasLeftIcon, theme }) => $hasLeftIcon ? `calc(${theme.spacing.sm} * 2 + 20px)` : theme.spacing.sm};
  padding-right: ${({ $hasRightIcon, theme }) => $hasRightIcon ? `calc(${theme.spacing.sm} * 2 + 20px)` : theme.spacing.sm};

  ${props => getSizeStyle(props.inputSize, props.theme)}
  ${props => getVariantStyle(props.variant, props.theme)}

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.color.primary};
    box-shadow: ${({ theme }) => theme.shadow.md};
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
    color: ${({ theme }) => theme.color.textMuted};
    opacity: 0.7;
  }

  /* Error state override */
  ${props => props.error && css`
    border-color: ${props.theme.color.danger};
    background-color: ${props.theme.color.dangerLight};
    &:focus {
      border-color: ${props.theme.color.danger};
      box-shadow: 0 0 0 3px ${props.theme.color.dangerBg};
      background-color: ${props.theme.color.surface};
    }
  `}

  /* Success state override */
  ${props => props.success && css`
    border-color: ${props.theme.color.success};
    background-color: ${props.theme.color.successLight};
    &:focus {
      border-color: ${props.theme.color.success};
      box-shadow: 0 0 0 3px ${props.theme.color.successBg};
      background-color: ${props.theme.color.surface};
    }
  `}

  /* Warning state override */
  ${props => props.warning && css`
    border-color: ${props.theme.color.warning};
    background-color: ${props.theme.color.warningLight};
    &:focus {
      border-color: ${props.theme.color.warning};
      box-shadow: 0 0 0 3px ${props.theme.color.warningBg};
      background-color: ${props.theme.color.surface};
    }
  `}
`;

const Label = styled.label<{ size?: InputSize }>`
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme, size }) => 
    size === 'sm' ? theme.font.sizeSm : 
    size === 'lg' ? theme.font.sizeLg : 
    theme.font.sizeBase
  };
  font-weight: ${({ theme }) => theme.font.weightMedium};
  line-height: ${({ theme }) => theme.font.lineHeightTight};
  color: ${({ theme }) => theme.color.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const HelperText = styled.span<{ variant?: InputVariant; size?: InputSize }>`
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme, size }) => 
    size === 'sm' ? theme.font.sizeXs : 
    size === 'lg' ? theme.font.sizeSm : 
    theme.font.sizeSm
  };
  font-weight: ${({ theme }) => theme.font.weightRegular};
  line-height: ${({ theme }) => theme.font.lineHeightTight};
  color: ${({ theme, variant }) => {
    switch (variant) {
      case 'error': return theme.color.danger;
      case 'success': return theme.color.success;
      case 'warning': return theme.color.warning;
      default: return theme.color.textSecondary;
    }
  }};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Input: React.FC<InputProps> = ({ 
  inputSize = 'md',
  variant = 'default',
  fullWidth = true,
  error,
  success,
  warning,
  leftIcon,
  rightIcon,
  label,
  helperText,
  disabled,
  id,
  ...props 
}) => {
  const inputId = id || React.useId();
  const labelId = label ? `${inputId}-label` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;

  // Determine variant based on error/success/warning props
  let finalVariant = variant;
  if (error) finalVariant = 'error';
  if (success) finalVariant = 'success';
  if (warning) finalVariant = 'warning';

  return (
    <InputContainer $fullWidth={fullWidth}>
      {label && (
        <Label htmlFor={inputId} id={labelId} size={inputSize}>
          {label}
        </Label>
      )}
      <InputWrapper $hasLeftIcon={!!leftIcon} $hasRightIcon={!!rightIcon}>
        {leftIcon && <IconWrapper position="left">{leftIcon}</IconWrapper>}
        <StyledInput
          id={inputId}
          inputSize={inputSize}
          variant={finalVariant}
          $hasLeftIcon={!!leftIcon}
          $hasRightIcon={!!rightIcon}
          error={error}
          success={success}
          warning={warning}
          disabled={disabled}
          aria-labelledby={labelId}
          aria-describedby={helperId}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
        {rightIcon && <IconWrapper position="right">{rightIcon}</IconWrapper>}
      </InputWrapper>
      {helperText && (
        <HelperText 
          id={helperId}
          variant={finalVariant}
          size={inputSize}
        >
          {helperText}
        </HelperText>
      )}
    </InputContainer>
  );
};

export default Input; 