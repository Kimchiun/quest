import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Theme } from '../theme';

export type CheckboxSize = 'sm' | 'md' | 'lg';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: CheckboxSize;
  label?: string;
  description?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  error?: boolean;
}

const checkmark = keyframes`
  0% {
    transform: scale(0) rotate(45deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(45deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(45deg);
    opacity: 1;
  }
`;

const getSizeStyle = (size: CheckboxSize = 'md', theme: Theme) => {
  switch (size) {
    case 'sm':
      return css`
        width: 16px;
        height: 16px;
        &::after {
          width: 6px;
          height: 6px;
          top: 3px;
          left: 3px;
        }
      `;
    case 'lg':
      return css`
        width: 24px;
        height: 24px;
        &::after {
          width: 12px;
          height: 12px;
          top: 4px;
          left: 4px;
        }
      `;
    default:
      return css`
        width: 20px;
        height: 20px;
        &::after {
          width: 8px;
          height: 8px;
          top: 4px;
          left: 4px;
        }
      `;
  }
};

const CheckboxContainer = styled.label<{ disabled?: boolean; error?: boolean }>`
  display: inline-flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  user-select: none;
  transition: opacity ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
`;

const CheckboxInput = styled.input<{ size: CheckboxSize; indeterminate?: boolean; error?: boolean }>`
  appearance: none;
  position: relative;
  background: ${({ theme }) => theme.color.surface};
  border: 2px solid ${({ theme, error }) => error ? theme.color.danger : theme.color.neutralBorder};
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  outline: none;
  flex-shrink: 0;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  
  ${props => getSizeStyle(props.size, props.theme)}

  &::after {
    content: '';
    position: absolute;
    background: ${({ theme }) => theme.color.surface};
    border-radius: 1px;
    transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
    opacity: 0;
    transform: scale(0) rotate(45deg);
  }

  &:checked {
    background: ${({ theme, error }) => error ? theme.color.danger : theme.color.primary};
    border-color: ${({ theme, error }) => error ? theme.color.danger : theme.color.primary};
    box-shadow: ${({ theme }) => theme.shadow.md};
    
    &::after {
      opacity: 1;
      transform: scale(1) rotate(45deg);
      background: ${({ theme }) => theme.color.surface};
      animation: ${checkmark} ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
    }
  }

  &:indeterminate {
    background: ${({ theme, error }) => error ? theme.color.danger : theme.color.primary};
    border-color: ${({ theme, error }) => error ? theme.color.danger : theme.color.primary};
    box-shadow: ${({ theme }) => theme.shadow.md};
    
    &::after {
      opacity: 1;
      transform: scale(1);
      background: ${({ theme }) => theme.color.surface};
      border-radius: 0;
    }
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme, error }) => error ? theme.color.danger : theme.color.primary};
    box-shadow: 0 0 0 3px ${({ theme, error }) => error ? theme.color.dangerBg : theme.color.focusRing};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme, error }) => error ? theme.color.danger : theme.color.focus};
    outline-offset: 2px;
    box-shadow: 0 0 0 3px ${({ theme, error }) => error ? theme.color.dangerBg : theme.color.focusRing};
  }

  &:disabled {
    background: ${({ theme }) => theme.color.disabledBg};
    border-color: ${({ theme }) => theme.color.disabled};
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
    
    &::after {
      background: ${({ theme }) => theme.color.disabledText};
    }
  }
`;

const CheckboxLabel = styled.span<{ size: CheckboxSize; error?: boolean }>`
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

const CheckboxDescription = styled.span<{ size: CheckboxSize; error?: boolean }>`
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

const CheckboxContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Checkbox: React.FC<CheckboxProps> = ({ 
  size = 'md',
  label,
  description,
  disabled = false,
  indeterminate = false,
  error = false,
  id,
  ...props 
}) => {
  const checkboxId = id || React.useId();
  const checkboxRef = React.useRef<HTMLInputElement>(null);

  // indeterminate 상태 설정
  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <CheckboxContainer disabled={disabled} error={error}>
      <CheckboxInput
        type="checkbox"
        size={size}
        id={checkboxId}
        disabled={disabled}
        indeterminate={indeterminate}
        error={error}
        ref={checkboxRef}
        aria-describedby={description ? `${checkboxId}-description` : undefined}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
      {(label || description) && (
        <CheckboxContent>
          {label && <CheckboxLabel size={size} error={error}>{label}</CheckboxLabel>}
          {description && (
            <CheckboxDescription 
              size={size} 
              error={error}
              id={`${checkboxId}-description`}
            >
              {description}
            </CheckboxDescription>
          )}
        </CheckboxContent>
      )}
    </CheckboxContainer>
  );
};

export default Checkbox; 