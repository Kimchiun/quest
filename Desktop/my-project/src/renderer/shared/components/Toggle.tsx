import React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from '../theme';

export type ToggleSize = 'sm' | 'md' | 'lg';

interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: ToggleSize;
  label?: string;
  description?: string;
  disabled?: boolean;
}

const getSizeStyle = (size: ToggleSize = 'md', theme: Theme) => {
  switch (size) {
    case 'sm':
      return css`
        width: 32px;
        height: 18px;
        &::after {
          width: 14px;
          height: 14px;
          transform: translateX(2px);
        }
        &:checked::after {
          transform: translateX(16px);
        }
      `;
    case 'lg':
      return css`
        width: 48px;
        height: 26px;
        &::after {
          width: 22px;
          height: 22px;
          transform: translateX(2px);
        }
        &:checked::after {
          transform: translateX(24px);
        }
      `;
    default:
      return css`
        width: 40px;
        height: 22px;
        &::after {
          width: 18px;
          height: 18px;
          transform: translateX(2px);
        }
        &:checked::after {
          transform: translateX(20px);
        }
      `;
  }
};

const ToggleContainer = styled.label<{ disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  user-select: none;
`;

const ToggleInput = styled.input<{ size: ToggleSize }>`
  appearance: none;
  position: relative;
  background: ${({ theme }) => theme.color.neutralBorder};
  border-radius: ${({ theme }) => theme.radius.full};
  transition: all 0.2s ease;
  outline: none;
  
  ${props => getSizeStyle(props.size, props.theme)}

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    background: ${({ theme }) => theme.color.surface};
    border-radius: ${({ theme }) => theme.radius.full};
    box-shadow: ${({ theme }) => theme.shadow.sm};
    transition: transform 0.2s ease;
  }

  &:checked {
    background: ${({ theme }) => theme.color.primary};
  }

  &:hover:not(:disabled) {
    background: ${({ theme, checked }) => 
      checked ? theme.color.primaryHover : theme.color.textSecondary
    };
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.focus};
    outline-offset: 2px;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.color.focusRing};
  }

  &:disabled {
    background: ${({ theme }) => theme.color.disabled};
    cursor: not-allowed;
    
    &::after {
      background: ${({ theme }) => theme.color.disabledBg};
    }
  }
`;

const ToggleLabel = styled.span<{ size: ToggleSize }>`
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

const ToggleDescription = styled.span<{ size: ToggleSize }>`
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

const ToggleContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const Toggle: React.FC<ToggleProps> = ({ 
  size = 'md',
  label,
  description,
  disabled = false,
  id,
  ...props 
}) => {
  const toggleId = id || React.useId();

  return (
    <ToggleContainer disabled={disabled}>
      <ToggleInput
        type="checkbox"
        size={size}
        id={toggleId}
        disabled={disabled}
        aria-describedby={description ? `${toggleId}-description` : undefined}
        {...props}
      />
      {(label || description) && (
        <ToggleContent>
          {label && <ToggleLabel size={size}>{label}</ToggleLabel>}
          {description && (
            <ToggleDescription 
              size={size} 
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