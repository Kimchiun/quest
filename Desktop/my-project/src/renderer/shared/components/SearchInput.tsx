import React, { useState, useRef, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Theme } from '../theme';

export interface SearchResult {
  id: string;
  title: string;
  type: 'testcase' | 'release' | 'user' | 'defect';
  description?: string;
  url?: string;
}

export interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  results?: SearchResult[];
  onResultSelect?: (result: SearchResult) => void;
  className?: string;
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

const SearchContainer = styled.div<{ size: string }>`
  position: relative;
  width: 100%;
`;

const SearchInputField = styled.div<{ 
  size: string; 
  isOpen: boolean;
  disabled?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme, isOpen }) => 
    isOpen ? theme.color.primary : theme.color.neutralBorder
  };
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme, isOpen }) => 
    isOpen ? theme.shadow.md : theme.shadow.sm
  };
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  
  ${({ size, theme }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          min-height: 36px;
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          min-height: 48px;
        `;
      default:
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          min-height: 40px;
        `;
    }
  }}
  
  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.color.primary};
    box-shadow: ${({ theme }) => theme.shadow.md};
  }
  
  &:focus-within {
    border-color: ${({ theme }) => theme.color.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.color.focusRing};
  }
  
  ${({ disabled, theme }) => disabled && css`
    background: ${theme.color.disabledBg};
    border-color: ${theme.color.disabled};
    cursor: not-allowed;
    opacity: 0.6;
  `}
`;

const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color.textSecondary};
  margin-right: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
`;

const SearchInputElement = styled.input<{ size: string }>`
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme, size }) => 
    size === 'sm' ? theme.font.sizeSm : 
    size === 'lg' ? theme.font.sizeLg : 
    theme.font.sizeBase
  };
  font-weight: ${({ theme }) => theme.font.weightRegular};
  line-height: ${({ theme }) => theme.font.lineHeight};
  color: ${({ theme }) => theme.color.text};
  
  &::placeholder {
    color: ${({ theme }) => theme.color.textMuted};
    opacity: 0.7;
  }
  
  &:disabled {
    cursor: not-allowed;
    color: ${({ theme }) => theme.color.disabledText};
  }
`;

const ClearButton = styled.button<{ visible: boolean }>`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  color: ${({ theme }) => theme.color.textSecondary};
  opacity: ${({ visible }) => visible ? 1 : 0};
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  margin-left: ${({ theme }) => theme.spacing.sm};
  
  &:hover {
    background: ${({ theme }) => theme.color.neutralBg};
    color: ${({ theme }) => theme.color.text};
  }
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.focus};
    outline-offset: 2px;
  }
`;

const SearchResults = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.neutralBorder};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  margin-top: ${({ theme }) => theme.spacing.xs};
  max-height: 400px;
  overflow-y: auto;
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transform: ${({ isOpen }) => isOpen ? 'translateY(0)' : 'translateY(-8px)'};
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  
  ${({ isOpen }) => isOpen && css`
    animation: ${fadeIn} 0.2s ease-out;
  `}
  
  /* Custom scrollbar */
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

const SearchResultItem = styled.div<{ selected: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.color.neutralBorder};
  background: ${({ theme, selected }) => 
    selected ? theme.color.neutralBg : 'transparent'
  };
  transition: background ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${({ theme }) => theme.color.neutralBg};
  }
`;

const SearchResultHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SearchResultTitle = styled.div`
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeBase};
  font-weight: ${({ theme }) => theme.font.weightMedium};
  color: ${({ theme }) => theme.color.text};
  line-height: ${({ theme }) => theme.font.lineHeightTight};
`;

const SearchResultType = styled.span<{ type: string }>`
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeXs};
  font-weight: ${({ theme }) => theme.font.weightMedium};
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme, type }) => {
    switch (type) {
      case 'testcase': return theme.color.primaryLight;
      case 'release': return theme.color.successLight;
      case 'user': return theme.color.warningLight;
      case 'defect': return theme.color.dangerLight;
      default: return theme.color.neutralBg;
    }
  }};
  color: ${({ theme, type }) => {
    switch (type) {
      case 'testcase': return theme.color.primary;
      case 'release': return theme.color.success;
      case 'user': return theme.color.warning;
      case 'defect': return theme.color.danger;
      default: return theme.color.textSecondary;
    }
  }};
`;

const SearchResultDescription = styled.div`
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeSm};
  color: ${({ theme }) => theme.color.textSecondary};
  line-height: ${({ theme }) => theme.font.lineHeightTight};
`;

const NoResults = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.color.textSecondary};
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeSm};
`;

const SearchInput: React.FC<SearchInputProps> = ({
  value = '',
  onChange,
  onSubmit,
  placeholder = 'Search...',
  size = 'md',
  disabled = false,
  results = [],
  onResultSelect,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasResults = results.length > 0;
  const showResults = isOpen && (hasResults || value.length > 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    if (value.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          onResultSelect?.(results[selectedIndex]);
        } else {
          onSubmit?.(value);
        }
        setIsOpen(false);
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
    }
  };

  const handleClear = () => {
    onChange?.('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleResultClick = (result: SearchResult) => {
    onResultSelect?.(result);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  // 외부 클릭 시 결과 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <SearchContainer ref={containerRef} size={size} className={className}>
      <SearchInputField 
        size={size} 
        isOpen={showResults}
        disabled={disabled}
      >
        <SearchIcon>
          🔍
        </SearchIcon>
        
        <SearchInputElement
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          aria-label="Search"
          aria-expanded={showResults}
          aria-autocomplete="list"
          role="combobox"
        />
        
        {value && (
          <ClearButton
            visible={!!value}
            onClick={handleClear}
            type="button"
            aria-label="Clear search"
          >
            ✕
          </ClearButton>
        )}
      </SearchInputField>
      
      {showResults && (
        <SearchResults isOpen={showResults} role="listbox">
          {hasResults ? (
            results.map((result, index) => (
              <SearchResultItem
                key={result.id}
                selected={index === selectedIndex}
                onClick={() => handleResultClick(result)}
                role="option"
                aria-selected={index === selectedIndex}
              >
                <SearchResultHeader>
                  <SearchResultTitle>{result.title}</SearchResultTitle>
                  <SearchResultType type={result.type}>
                    {result.type}
                  </SearchResultType>
                </SearchResultHeader>
                {result.description && (
                  <SearchResultDescription>
                    {result.description}
                  </SearchResultDescription>
                )}
              </SearchResultItem>
            ))
          ) : (
            <NoResults>
              No results found for "{value}"
            </NoResults>
          )}
        </SearchResults>
      )}
    </SearchContainer>
  );
};

export default SearchInput; 