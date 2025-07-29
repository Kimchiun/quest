import React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from '../theme';

export type CheckboxSize = 'sm' | 'md' | 'lg';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: CheckboxSize;
  label?: string;
  description?: string;
  disabled?: boolean;
  indeterminate?: boolean;
}

const getSizeStyle = (size: CheckboxSize = 'md', theme: Theme) => {
  switch (size) {
    case 'sm':
      return css`
        width: 16px;
        height: 16px;
        &::after {
          width: 8px;
          height: 8px;
          top: 2px;
          left: 2px;
        }
      `;
    case 'lg':
      return css`
        width: 24px;
        height: 24px;
        &::after {
          width: 12px;
          height: 12px;
          top: 3px;
          left: 3px;
        }
      `;
    default:
      return css`
        width: 20px;
        height: 20px;
        &::after {
          width: 10px;
          height: 10px;
          top: 2px;
          left: 2px;
        }
      `;
  }
};

const CheckboxContainer = styled.label<{ disabled?: boolean }>`
  display: inline-flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  user-select: none;
`;

const CheckboxInput = styled.input<{ size: CheckboxSize; indeterminate?: boolean }>`
  appearance: none;
  position: relative;
  background: ${({ theme }) => theme.color.surface};
  border: 2px solid ${({ theme }) => theme.color.neutralBorder};
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: all 0.2s ease;
  outline: none;
  flex-shrink: 0;
  
  ${props => getSizeStyle(props.size, props.theme)}

  &::after {
    content: '';
    position: absolute;
    background: ${({ theme }) => theme.color.surface};
    border-radius: 2px;
    transition: all 0.2s ease;
    opacity: 0;
    transform: scale(0);
  }

  &:checked {
    background: ${({ theme }) => theme.color.primary};
    border-color: ${({ theme }) => theme.color.primary};
    
    &::after {
      opacity: 1;
      transform: scale(1);
      background: ${({ theme }) => theme.color.surface};
    }
  }

  &:indeterminate {
    background: ${({ theme }) => theme.color.primary};
    border-color: ${({ theme }) => theme.color.primary};
    
    &::after {
      opacity: 1;
      transform: scale(1);
      background: ${({ theme }) => theme.color.surface};
    }
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.color.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.color.focusRing};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.focus};
    outline-offset: 2px;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.color.focusRing};
  }

  &:disabled {
    background: ${({ theme }) => theme.color.disabledBg};
    border-color: ${({ theme }) => theme.color.disabled};
    cursor: not-allowed;
    
    &::after {
      background: ${({ theme }) => theme.color.disabledText};
    }
  }
`;

const CheckboxLabel = styled.span<{ size: CheckboxSize }>`
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme, size }) => 
    size === 'sm' ? theme.font.sizeSm : 
    size === 'lg' ? theme.font.sizeLg : 
    theme.font.sizeBase
  };
  font-weight: ${({ theme }) => theme.font.weightRegular};
  line-height: ${({ theme }) => theme.font.lineHeight};
  color: ${({ theme }) => theme.color.text};
`;

const CheckboxDescription = styled.span<{ size: CheckboxSize }>`
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme, size }) => 
    size === 'sm' ? '12px' : 
    size === 'lg' ? theme.font.sizeBase : 
    theme.font.sizeSm
  };
  font-weight: ${({ theme }) => theme.font.weightRegular};
  line-height: ${({ theme }) => theme.font.lineHeight};
  color: ${({ theme }) => theme.color.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
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
    <CheckboxContainer disabled={disabled}>
      <CheckboxInput
        type="checkbox"
        size={size}
        id={checkboxId}
        disabled={disabled}
        ref={checkboxRef}
        aria-describedby={description ? `${checkboxId}-description` : undefined}
        {...props}
      />
      {(label || description) && (
        <CheckboxContent>
          {label && <CheckboxLabel size={size}>{label}</CheckboxLabel>}
          {description && (
            <CheckboxDescription 
              size={size} 
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