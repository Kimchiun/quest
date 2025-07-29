import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setFilters, clearFilters, FilterState } from '../../../store/dashboardLayoutSlice';

const Container = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h4`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
`;

const ClearButton = styled.button`
  padding: 4px 12px;
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e2e8f0;
    color: #475569;
  }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
`;

const FilterSelect = styled.select`
  padding: 6px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  min-height: 32px;
`;

const FilterInput = styled.input`
  padding: 6px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  min-height: 32px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  margin: 0;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #374151;
  cursor: pointer;
`;

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
`;

const FilterTag = styled.span`
  padding: 4px 8px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const FilterBar: React.FC = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.dashboardLayout.filters);
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const executionStatusOptions = [
    { value: 'Untested', label: '실행 전' },
    { value: 'Pass', label: '통과' },
    { value: 'Fail', label: '실패' },
    { value: 'Blocked', label: '블록' },
    { value: 'Defect', label: '결함' },
  ];

  const priorityOptions = [
    { value: 'High', label: '높음' },
    { value: 'Medium', label: '보통' },
    { value: 'Low', label: '낮음' },
  ];

  const severityOptions = [
    { value: 'Critical', label: '치명적' },
    { value: 'High', label: '높음' },
    { value: 'Medium', label: '보통' },
    { value: 'Low', label: '낮음' },
  ];

  const handleFilterChange = useCallback((key: keyof FilterState, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    dispatch(setFilters(newFilters));
  }, [localFilters, dispatch]);

  const handleClearFilters = useCallback(() => {
    setLocalFilters({
      executionStatus: [],
      priority: [],
      severity: [],
      keyword: '',
      showOnlyDefects: false,
    });
    dispatch(clearFilters());
  }, [dispatch]);

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.executionStatus.length > 0) count++;
    if (filters.priority.length > 0) count++;
    if (filters.severity.length > 0) count++;
    if (filters.keyword) count++;
    if (filters.showOnlyDefects) count++;
    return count;
  };

  const renderActiveFilters = () => {
    const activeFilters: string[] = [];
    
    filters.executionStatus.forEach(status => {
      const option = executionStatusOptions.find(opt => opt.value === status);
      if (option) activeFilters.push(`실행상태: ${option.label}`);
    });
    
    filters.priority.forEach(priority => {
      const option = priorityOptions.find(opt => opt.value === priority);
      if (option) activeFilters.push(`우선순위: ${option.label}`);
    });
    
    filters.severity.forEach(severity => {
      const option = severityOptions.find(opt => opt.value === severity);
      if (option) activeFilters.push(`심각도: ${option.label}`);
    });
    
    if (filters.keyword) activeFilters.push(`검색: ${filters.keyword}`);
    if (filters.showOnlyDefects) activeFilters.push('결함만 표시');

    return activeFilters;
  };

  return (
    <Container>
      <Header>
        <Title>필터</Title>
        {getActiveFilterCount() > 0 && (
          <ClearButton onClick={handleClearFilters} data-testid="clear-filters-btn">
            필터 초기화
          </ClearButton>
        )}
      </Header>

      <FilterGrid>
        <FilterGroup>
          <FilterLabel>실행 상태</FilterLabel>
          <FilterSelect
            multiple
            value={localFilters.executionStatus}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, option => option.value);
              handleFilterChange('executionStatus', selected);
            }}
            data-testid="execution-status-filter"
          >
            {executionStatusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>우선순위</FilterLabel>
          <FilterSelect
            multiple
            value={localFilters.priority}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, option => option.value);
              handleFilterChange('priority', selected);
            }}
            data-testid="priority-filter"
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>심각도</FilterLabel>
          <FilterSelect
            multiple
            value={localFilters.severity}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, option => option.value);
              handleFilterChange('severity', selected);
            }}
            data-testid="severity-filter"
          >
            {severityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>키워드 검색</FilterLabel>
          <FilterInput
            type="text"
            placeholder="제목, 설명으로 검색..."
            value={localFilters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
            data-testid="keyword-search-input"
          />
        </FilterGroup>

        <FilterGroup>
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="showOnlyDefects"
              checked={localFilters.showOnlyDefects}
              onChange={(e) => handleFilterChange('showOnlyDefects', e.target.checked)}
              data-testid="show-only-defects-checkbox"
            />
            <CheckboxLabel htmlFor="showOnlyDefects">
              결함만 표시
            </CheckboxLabel>
          </CheckboxContainer>
        </FilterGroup>
      </FilterGrid>

      {getActiveFilterCount() > 0 && (
        <ActiveFilters>
          {renderActiveFilters().map((filter, index) => (
            <FilterTag key={index} data-testid={`active-filter-${index}`}>
              {filter}
            </FilterTag>
          ))}
        </ActiveFilters>
      )}
    </Container>
  );
};

export default FilterBar; 