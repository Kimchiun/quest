import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Theme } from '../theme';

export type ToggleSize = 'sm' | 'md' | 'lg';
export type ToggleVariant = 'primary' | 'success' | 'warning' | 'danger';

interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: ToggleSize;
  variant?: ToggleVariant;
  label?: string;
  description?: string;
  disabled?: boolean;
  error?: boolean;
}

const slide = keyframes`
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(2px);
  }
  100% {
    transform: translateX(0);
  }
`;

const getSizeStyle = (size: ToggleSize = 'md', theme: Theme) => {
  switch (size) {
    case 'sm':
      return css`
        width: 32px;
        height: 18px;
        &::after {
          width: 12px;
          height: 12px;
          top: 1px;
          left: 1px;
        }
        &:checked::after {
          transform: translateX(14px);
        }
      `;
    case 'lg':
      return css`
        width: 48px;
        height: 26px;
        &::after {
          width: 18px;
          height: 18px;
          top: 2px;
          left: 2px;
        }
        &:checked::after {
          transform: translateX(22px);
        }
      `;
    default:
      return css`
        width: 40px;
        height: 22px;
        &::after {
          width: 16px;
          height: 16px;
          top: 2px;
          left: 2px;
        }
        &:checked::after {
          transform: translateX(18px);
        }
      `;
  }
};

const getVariantStyle = (variant: ToggleVariant = 'primary', theme: Theme) => {
  switch (variant) {
    case 'success':
      return css`
        background: ${theme.color.neutralBorder};
        &:checked {
          background: ${theme.color.success};
        }
        &:hover:not(:disabled) {
          background: ${theme.color.neutralBorder};
          &:checked {
            background: ${theme.color.successHover};
          }
        }
      `;
    case 'warning':
      return css`
        background: ${theme.color.neutralBorder};
        &:checked {
          background: ${theme.color.warning};
        }
        &:hover:not(:disabled) {
          background: ${theme.color.neutralBorder};
          &:checked {
            background: ${theme.color.warningHover};
          }
        }
      `;
    case 'danger':
      return css`
        background: ${theme.color.neutralBorder};
        &:checked {
          background: ${theme.color.danger};
        }
        &:hover:not(:disabled) {
          background: ${theme.color.neutralBorder};
          &:checked {
            background: ${theme.color.dangerHover};
          }
        }
      `;
    default:
      return css`
        background: ${theme.color.neutralBorder};
        &:checked {
          background: ${theme.color.primary};
        }
        &:hover:not(:disabled) {
          background: ${theme.color.neutralBorder};
          &:checked {
            background: ${theme.color.primaryHover};
          }
        }
      `;
  }
};

const ToggleContainer = styled.label<{ disabled?: boolean; error?: boolean }>`
  display: inline-flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  user-select: none;
  transition: opacity ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
`;

const ToggleInput = styled.input<{ size: ToggleSize; variant: ToggleVariant; error?: boolean }>`
  appearance: none;
  position: relative;
  border-radius: ${({ theme }) => theme.radius.full};
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  outline: none;
  flex-shrink: 0;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  border: none;
  
  ${props => getSizeStyle(props.size, props.theme)}
  ${props => getVariantStyle(props.variant, props.theme)}

  &::after {
    content: '';
    position: absolute;
    background: ${({ theme }) => theme.color.surface};
    border-radius: 50%;
    transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
    box-shadow: ${({ theme }) => theme.shadow.md};
  }

  &:hover:not(:disabled) {
    box-shadow: ${({ theme }) => theme.shadow.lg};
    transform: translateY(-1px);
    
    &::after {
      animation: ${slide} ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme, error }) => error ? theme.color.danger : theme.color.focus};
    outline-offset: 2px;
    box-shadow: 0 0 0 3px ${({ theme, error }) => error ? theme.color.dangerBg : theme.color.focusRing};
  }

  &:disabled {
    background: ${({ theme }) => theme.color.disabledBg};
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
    
    &::after {
      background: ${({ theme }) => theme.color.disabledText};
      box-shadow: none;
    }
  }

  /* Error state */
  ${props => props.error && css`
    background: ${props.theme.color.dangerBg};
    &:checked {
      background: ${props.theme.color.danger};
    }
    &:hover:not(:disabled) {
      background: ${props.theme.color.dangerBg};
      &:checked {
        background: ${props.theme.color.dangerHover};
      }
    }
  `}
`;

const ToggleLabel = styled.span<{ size: ToggleSize; error?: boolean }>`
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme, size }) => 
    size === 'sm' ? theme.font.sizeSm : 
    size === 'lg' ? theme.font.sizeLg : 
    theme.font.sizeBase
  };
  font-weight: ${({ theme }) => theme.font.weightMedium};
  line-height: ${({ theme }) => theme.font.lineHeightTight};
  color: ${({ theme, error }) => error ? theme.color.danger : theme.color.text};
  transition: color ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
`;

const ToggleDescription = styled.span<{ size: ToggleSize; error?: boolean }>`
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme, size }) => 
    size === 'sm' ? '12px' : 
    size === 'lg' ? theme.font.sizeBase : 
    theme.font.sizeSm
  };
  font-weight: ${({ theme }) => theme.font.weightRegular};
  line-height: ${({ theme }) => theme.font.lineHeightTight};
  color: ${({ theme, error }) => error ? theme.color.danger : theme.color.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
  transition: color ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
`;

const ToggleContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Toggle: React.FC<ToggleProps> = ({ 
  size = 'md',
  variant = 'primary',
  label,
  description,
  disabled = false,
  error = false,
  id,
  ...props 
}) => {
  const toggleId = id || React.useId();

  return (
    <ToggleContainer disabled={disabled} error={error}>
      <ToggleInput
        type="checkbox"
        size={size}
        variant={variant}
        id={toggleId}
        disabled={disabled}
        error={error}
        aria-describedby={description ? `${toggleId}-description` : undefined}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
      {(label || description) && (
        <ToggleContent>
          {label && <ToggleLabel size={size} error={error}>{label}</ToggleLabel>}
          {description && (
            <ToggleDescription 
              size={size} 
              error={error}
              id={`${toggleId}-description`}
            >
              {description}
            </ToggleDescription>
          )}
        </ToggleContent>
      )}
    </ToggleContainer>
  );
};

export default Toggle; 