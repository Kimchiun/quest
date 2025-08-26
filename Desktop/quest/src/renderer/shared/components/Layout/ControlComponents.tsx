import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme';

// 검색 컴포넌트
export interface SearchControlProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
}

const SearchContainer = styled.div<{ $size: string; $variant: string }>`
  position: relative;
  width: 100%;
  max-width: 400px;
  
  ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return `height: 32px;`;
      case 'lg':
        return `height: 48px;`;
      default:
        return `height: 40px;`;
    }
  }}
`;

const SearchInput = styled.input<{ $variant: string }>`
  width: 100%;
  height: 100%;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme, $variant }) => 
    $variant === 'outlined' ? theme.color.border.primary : 'transparent'
  };
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $variant }) => 
    $variant === 'filled' ? theme.color.surface.secondary : theme.color.surface.primary
  };
  font-size: ${({ theme }) => theme.font.size.sm};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.primary[500]};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.color.primary[100]};
  }
`;

export const SearchControl: React.FC<SearchControlProps> = ({
  placeholder = '검색...',
  value = '',
  onChange,
  onSearch,
  size = 'md',
  variant = 'default'
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <SearchContainer $size={size} $variant={variant}>
      <SearchInput
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyPress={handleKeyPress}
        $variant={variant}
      />
    </SearchContainer>
  );
};

// 필터 컴포넌트
export interface FilterControlProps {
  filters: Array<{
    key: string;
    label: string;
    type: 'select' | 'multi-select' | 'date' | 'range';
    options?: Array<{ value: string; label: string }>;
  }>;
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onApply: () => void;
  onClear: () => void;
}

const FilterContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
  flex-wrap: wrap;
`;

const FilterItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const FilterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.color.border.primary};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.surface.primary};
  font-size: ${({ theme }) => theme.font.size.sm};
`;

const FilterButton = styled.button`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.color.border.primary};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.surface.primary};
  font-size: ${({ theme }) => theme.font.size.sm};
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.color.surface.secondary};
  }
`;

export const FilterControl: React.FC<FilterControlProps> = ({
  filters,
  values,
  onChange,
  onApply,
  onClear
}) => {
  return (
    <FilterContainer>
      {filters.map((filter) => (
        <FilterItem key={filter.key}>
          <span>{filter.label}:</span>
          <FilterSelect
            value={values[filter.key] || ''}
            onChange={(e) => onChange(filter.key, e.target.value)}
          >
            <option value="">전체</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FilterSelect>
        </FilterItem>
      ))}
      
      <FilterButton onClick={onApply}>적용</FilterButton>
      <FilterButton onClick={onClear}>초기화</FilterButton>
    </FilterContainer>
  );
};

// 정렬 컴포넌트
export interface SortControlProps {
  options: Array<{ key: string; label: string }>;
  value: string;
  direction: 'asc' | 'desc';
  onChange: (key: string, direction: 'asc' | 'desc') => void;
}

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const SortSelect = styled.select`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.color.border.primary};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.surface.primary};
  font-size: ${({ theme }) => theme.font.size.sm};
`;

const SortDirectionButton = styled.button<{ $active: boolean; $direction: string }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.color.border.primary};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme, $active }) => 
    $active ? theme.color.primary[500] : theme.color.surface.primary
  };
  color: ${({ theme, $active }) => 
    $active ? 'white' : theme.color.text.primary
  };
  font-size: ${({ theme }) => theme.font.size.sm};
  cursor: pointer;
  
  &:hover {
    background: ${({ theme, $active }) => 
      $active ? theme.color.primary[600] : theme.color.surface.secondary
    };
  }
`;

export const SortControl: React.FC<SortControlProps> = ({
  options,
  value,
  direction,
  onChange
}) => {
  return (
    <SortContainer>
      <span>정렬:</span>
      <SortSelect
        value={value}
        onChange={(e) => onChange(e.target.value, direction)}
      >
        {options.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </SortSelect>
      
      <SortDirectionButton
        $active={direction === 'asc'}
        $direction="asc"
        onClick={() => onChange(value, 'asc')}
      >
        ↑
      </SortDirectionButton>
      
      <SortDirectionButton
        $active={direction === 'desc'}
        $direction="desc"
        onClick={() => onChange(value, 'desc')}
      >
        ↓
      </SortDirectionButton>
    </SortContainer>
  );
};

// 상태 표시 컴포넌트
export interface StatusDisplayProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  text: string;
  count?: number;
  showCount?: boolean;
}

const StatusContainer = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $status }) => {
    switch ($status) {
      case 'success':
        return theme.color.success[50];
      case 'warning':
        return theme.color.warning[50];
      case 'error':
        return theme.color.danger[50];
      case 'info':
        return theme.color.primary[50];
      default:
        return theme.color.surface.secondary;
    }
  }};
  color: ${({ theme, $status }) => {
    switch ($status) {
      case 'success':
        return theme.color.success[700];
      case 'warning':
        return theme.color.warning[700];
      case 'error':
        return theme.color.danger[700];
      case 'info':
        return theme.color.primary[700];
      default:
        return theme.color.text.primary;
    }
  }};
  border: 1px solid ${({ theme, $status }) => {
    switch ($status) {
      case 'success':
        return theme.color.success[200];
      case 'warning':
        return theme.color.warning[200];
      case 'error':
        return theme.color.danger[200];
      case 'info':
        return theme.color.primary[200];
      default:
        return theme.color.border.primary;
    }
  }};
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme, $status }) => {
    switch ($status) {
      case 'success':
        return theme.color.success[500];
      case 'warning':
        return theme.color.warning[500];
      case 'error':
        return theme.color.danger[500];
      case 'info':
        return theme.color.primary[500];
      default:
        return theme.color.neutral[500];
    }
  }};
  color: white;
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.bold};
`;

export const StatusDisplay: React.FC<StatusDisplayProps> = ({
  status,
  text,
  count,
  showCount = false
}) => {
  return (
    <StatusContainer $status={status}>
      <StatusBadge $status={status}>
        {status.toUpperCase()}
      </StatusBadge>
      <span>{text}</span>
      {showCount && count !== undefined && (
        <span>({count})</span>
      )}
    </StatusContainer>
  );
};

// 액션 버튼 컴포넌트
export interface ActionButtonProps {
  type: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

const ActionButtonContainer = styled.button<{
  $type: string;
  $size: string;
  $variant: string;
  $disabled: boolean;
  $loading: boolean;
}>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme, $size }) => {
    switch ($size) {
      case 'sm':
        return `${theme.spacing[1]} ${theme.spacing[2]}`;
      case 'lg':
        return `${theme.spacing[3]} ${theme.spacing[4]}`;
      default:
        return `${theme.spacing[2]} ${theme.spacing[3]}`;
    }
  }};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme, $size }) => {
    switch ($size) {
      case 'sm':
        return theme.font.size.sm;
      case 'lg':
        return theme.font.size.lg;
      default:
        return theme.font.size.md;
    }
  }};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.out};
  
  ${({ theme, $type, $variant }) => {
    const getColor = (type: string) => {
      switch (type) {
        case 'primary':
          return theme.color.primary;
        case 'secondary':
          return theme.color.neutral;
        case 'danger':
          return theme.color.danger;
        case 'success':
          return theme.color.success;
        case 'warning':
          return theme.color.warning;
        default:
          return theme.color.primary;
      }
    };
    
    const color = getColor($type);
    
    if ($variant === 'outline') {
      return `
        background: transparent;
        border: 1px solid ${color[500]};
        color: ${color[600]};
        
        &:hover:not(:disabled) {
          background: ${color[50]};
          border-color: ${color[600]};
        }
      `;
    }
    
    if ($variant === 'ghost') {
      return `
        background: transparent;
        border: none;
        color: ${color[600]};
        
        &:hover:not(:disabled) {
          background: ${color[50]};
        }
      `;
    }
    
    return `
      background: ${color[500]};
      border: 1px solid ${color[500]};
      color: white;
      
      &:hover:not(:disabled) {
        background: ${color[600]};
        border-color: ${color[600]};
      }
    `;
  }}
  
  &:focus {
    outline: 2px solid ${({ theme, $type }) => {
      switch ($type) {
        case 'primary':
          return theme.color.primary[200];
        case 'secondary':
          return theme.color.neutral[200];
        case 'danger':
          return theme.color.danger[200];
        case 'success':
          return theme.color.success[200];
        case 'warning':
          return theme.color.warning[200];
        default:
          return theme.color.primary[200];
      }
    }};
    outline-offset: 2px;
  }
`;

export const ActionButton: React.FC<ActionButtonProps> = ({
  type,
  size = 'md',
  variant = 'solid',
  disabled = false,
  loading = false,
  icon,
  children,
  onClick
}) => {
  return (
    <ActionButtonContainer
      $type={type}
      $size={size}
      $variant={variant}
      $disabled={disabled}
      $loading={loading}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span>⏳</span>}
      {icon && !loading && icon}
      {children}
    </ActionButtonContainer>
  );
}; 