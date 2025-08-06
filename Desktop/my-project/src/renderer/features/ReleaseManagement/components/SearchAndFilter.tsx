import React from 'react';
import styled from 'styled-components';

interface SearchAndFilterProps {
  searchQuery: string;
  statusFilter: string;
  onSearch: (query: string) => void;
  onStatusFilter: (status: string) => void;
  onClearFilters: () => void;
}

const FilterContainer = styled.div`
  padding: 16px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Select = styled.select`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ClearButton = styled.button`
  padding: 8px 12px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FilterLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
  display: block;
`;

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  statusFilter,
  onSearch,
  onStatusFilter,
  onClearFilters
}) => {
  const statusOptions = [
    { value: 'ALL', label: '전체 상태' },
    { value: 'PLANNING', label: '계획' },
    { value: 'IN_PROGRESS', label: '진행중' },
    { value: 'TESTING', label: '테스트' },
    { value: 'READY', label: '준비완료' },
    { value: 'DEPLOYED', label: '배포됨' },
    { value: 'COMPLETED', label: '완료' },
    { value: 'CANCELLED', label: '취소됨' }
  ];

  const hasActiveFilters = searchQuery || statusFilter !== 'ALL';

  return (
    <FilterContainer>
      <div>
        <FilterLabel>검색</FilterLabel>
        <SearchInput
          type="text"
          placeholder="릴리즈명, 버전, 담당자로 검색..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <FilterRow>
        <div style={{ flex: 1 }}>
          <FilterLabel>상태</FilterLabel>
          <Select
            value={statusFilter}
            onChange={(e) => onStatusFilter(e.target.value)}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        {hasActiveFilters && (
          <div style={{ alignSelf: 'flex-end' }}>
            <ClearButton onClick={onClearFilters}>
              초기화
            </ClearButton>
          </div>
        )}
      </FilterRow>
    </FilterContainer>
  );
};

export default SearchAndFilter;