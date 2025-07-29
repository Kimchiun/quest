import React, { useState, useRef, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Theme } from '../theme';

export type DropdownSize = 'sm' | 'md' | 'lg';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  size?: DropdownSize;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const getSizeStyle = (size: DropdownSize = 'md', theme: Theme) => {
  switch (size) {
    case 'sm':
      return css`
        padding: ${theme.spacing.xs} ${theme.spacing.sm};
        font-size: ${theme.font.sizeSm};
        min-height: 32px;
      `;
    case 'lg':
      return css`
        padding: ${theme.spacing.md} ${theme.spacing.lg};
        font-size: ${theme.font.sizeLg};
        min-height: 48px;
      `;
    default:
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        font-size: ${theme.font.sizeBase};
        min-height: 40px;
      `;
  }
};

const DropdownContainer = styled.div<{ fullWidth?: boolean }>`
  position: relative;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`;

const DropdownButton = styled.button<{ 
  size: DropdownSize; 
  disabled?: boolean; 
  error?: boolean;
  isOpen?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme, error }) => 
    error ? theme.color.danger : theme.color.neutralBorder
  };
  border-radius: ${({ theme }) => theme.radius.md};
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weightRegular};
  line-height: ${({ theme }) => theme.font.lineHeight};
  color: ${({ theme, disabled }) => 
    disabled ? theme.color.disabledText : theme.color.text
  };
  box-shadow: ${({ theme }) => theme.shadow.sm};
  transition: all 0.15s ease;
  outline: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  user-select: none;
  
  ${props => getSizeStyle(props.size, props.theme)}

  &:hover:not(:disabled) {
    border-color: ${({ theme, error }) => 
      error ? theme.color.danger : theme.color.primary
    };
    box-shadow: ${({ theme }) => theme.shadow.md};
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
    opacity: 0.6;
  }

  /* 화살표 아이콘 */
  &::after {
    content: '';
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid ${({ theme, disabled }) => 
      disabled ? theme.color.disabledText : theme.color.textSecondary
    };
    margin-left: ${({ theme }) => theme.spacing.sm};
    transition: transform 0.15s ease;
    transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

const DropdownList = styled.ul<{ isOpen: boolean; size: DropdownSize }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.neutralBorder};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  margin: ${({ theme }) => theme.spacing.xs} 0 0 0;
  padding: ${({ theme }) => theme.spacing.xs} 0;
  list-style: none;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-8px)')};
  transition: all 0.15s ease;
  animation: ${({ isOpen }) => isOpen ? css`${fadeIn} 0.15s ease-out` : 'none'};

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.color.neutralBg};
    border-radius: ${({ theme }) => theme.radius.sm};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color.neutralBorder};
    border-radius: ${({ theme }) => theme.radius.sm};
    
    &:hover {
      background: ${({ theme }) => theme.color.textSecondary};
    }
  }
`;

const DropdownOption = styled.li<{ 
  size: DropdownSize; 
  disabled?: boolean;
  selected?: boolean;
}>`
  padding: ${({ theme, size }) => 
    size === 'sm' ? `${theme.spacing.xs} ${theme.spacing.sm}` :
    size === 'lg' ? `${theme.spacing.md} ${theme.spacing.lg}` :
    `${theme.spacing.sm} ${theme.spacing.md}`
  };
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme, size }) => 
    size === 'sm' ? theme.font.sizeSm : 
    size === 'lg' ? theme.font.sizeLg : 
    theme.font.sizeBase
  };
  font-weight: ${({ theme }) => theme.font.weightRegular};
  line-height: ${({ theme }) => theme.font.lineHeight};
  color: ${({ theme, disabled, selected }) => 
    disabled ? theme.color.disabledText :
    selected ? theme.color.primary :
    theme.color.text
  };
  background: ${({ theme, selected }) => 
    selected ? theme.color.neutralBg : 'transparent'
  };
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background 0.15s ease, color 0.15s ease;

  &:hover:not(:disabled) {
    background: ${({ theme, selected }) => 
      selected ? theme.color.neutralBg : theme.color.neutralBg
    };
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  placeholder = '선택하세요',
  size = 'md',
  disabled = false,
  error = false,
  fullWidth = true,
  onChange,
  onOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  const handleToggle = () => {
    if (disabled) return;
    
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    if (newIsOpen) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };

  const handleOptionClick = (optionValue: string) => {
    if (disabled) return;
    
    onChange?.(optionValue);
    setIsOpen(false);
    onClose?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleToggle();
        break;
      case 'Escape':
        setIsOpen(false);
        onClose?.();
        break;
    }
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <DropdownContainer ref={dropdownRef} fullWidth={fullWidth}>
      <DropdownButton
        type="button"
        size={size}
        disabled={disabled}
        error={error}
        isOpen={isOpen}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={placeholder}
      >
        <span>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
      </DropdownButton>
      
      <DropdownList isOpen={isOpen} size={size} role="listbox">
        {options.map((option) => (
          <DropdownOption
            key={option.value}
            size={size}
            disabled={option.disabled}
            selected={option.value === value}
            onClick={() => handleOptionClick(option.value)}
            role="option"
            aria-selected={option.value === value}
            aria-disabled={option.disabled}
          >
            {option.label}
          </DropdownOption>
        ))}
      </DropdownList>
    </DropdownContainer>
  );
};

export default Dropdown; 