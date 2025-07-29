import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import axios from '../../../utils/axios';

const Container = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
`;

const FilterInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const MultiSelect = styled.div`
  position: relative;
`;

const MultiSelectInput = styled.div`
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 38px;

  &:hover {
    border-color: #3b82f6;
  }
`;

const MultiSelectDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const MultiSelectOption = styled.div<{ selected: boolean }>`
  padding: 8px 12px;
  cursor: pointer;
  background: ${props => props.selected ? '#3b82f6' : 'transparent'};
  color: ${props => props.selected ? 'white' : '#374151'};

  &:hover {
    background: ${props => props.selected ? '#3b82f6' : '#f3f4f6'};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
          &:hover {
            background: #2563eb;
            border-color: #2563eb;
          }
        `;
      case 'danger':
        return `
          background: #ef4444;
          color: white;
          border-color: #ef4444;
          &:hover {
            background: #dc2626;
            border-color: #dc2626;
          }
        `;
      default:
        return `
          background: white;
          color: #374151;
          border-color: #d1d5db;
          &:hover {
            background: #f9fafb;
            border-color: #9ca3af;
          }
        `;
    }
  }}
`;

const PresetSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
`;

const PresetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const PresetList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const PresetTag = styled.div`
  padding: 4px 12px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #bfdbfe;
  }
`;

const SavePresetModal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 400px;
  max-width: 90vw;
`;

const ModalTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 16px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

export interface AdvancedSearchFilter {
  folders?: string[];
  tags?: string[];
  status?: ('Active' | 'Archived')[];
  createdBy?: string[];
  priority?: ('High' | 'Medium' | 'Low')[];
  dateRange?: {
    from: string;
    to: string;
  };
  keyword?: string;
}

export interface SearchPreset {
  id: string;
  name: string;
  filters: AdvancedSearchFilter;
  createdBy: string;
  createdAt: string;
}

interface AdvancedFilterProps {
  onSearch: (filters: AdvancedSearchFilter) => void;
  onClear: () => void;
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({ onSearch, onClear }) => {
  const [filters, setFilters] = useState<AdvancedSearchFilter>({});
  const [presets, setPresets] = useState<SearchPreset[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [openMultiSelect, setOpenMultiSelect] = useState<string | null>(null);

  // 옵션 데이터
  const statusOptions = ['Active', 'Archived'];
  const priorityOptions = ['High', 'Medium', 'Low'];
  const folderOptions = ['Smoke Tests', 'Regression Tests', 'Integration Tests', 'Unit Tests'];
  const tagOptions = ['critical', 'smoke', 'regression', 'integration', 'unit', 'performance'];

  // 프리셋 로드
  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    try {
      const response = await axios.get('/api/testcases/search/presets');
      setPresets(response.data);
    } catch (error) {
      console.error('Failed to load presets:', error);
    }
  };

  const handleFilterChange = useCallback((key: keyof AdvancedSearchFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const handleMultiSelectChange = useCallback((key: keyof AdvancedSearchFilter, value: string, checked: boolean) => {
    setFilters(prev => {
      const currentValues = (prev[key] as string[]) || [];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter(v => v !== value);
      
      return {
        ...prev,
        [key]: newValues.length > 0 ? newValues : undefined
      };
    });
  }, []);

  const handleSearch = useCallback(() => {
    onSearch(filters);
  }, [filters, onSearch]);

  const handleClear = useCallback(() => {
    setFilters({});
    onClear();
  }, [onClear]);

  const handleSavePreset = async () => {
    if (!presetName.trim()) return;

    try {
      await axios.post('/api/testcases/search/presets', {
        name: presetName,
        filters,
        createdBy: 'current-user' // 실제 사용자 ID로 교체
      });
      
      setPresetName('');
      setShowSaveModal(false);
      loadPresets();
    } catch (error) {
      console.error('Failed to save preset:', error);
    }
  };

  const handleLoadPreset = useCallback((preset: SearchPreset) => {
    setFilters(preset.filters);
    onSearch(preset.filters);
  }, [onSearch]);

  const handleDeletePreset = async (presetId: string) => {
    try {
      await axios.delete(`/api/testcases/search/presets/${presetId}`);
      loadPresets();
    } catch (error) {
      console.error('Failed to delete preset:', error);
    }
  };

  const getSelectedCount = (key: keyof AdvancedSearchFilter) => {
    const values = filters[key] as string[];
    return values ? values.length : 0;
  };

  const renderMultiSelect = (key: keyof AdvancedSearchFilter, options: string[], label: string) => {
    const selectedValues = (filters[key] as string[]) || [];
    const isOpen = openMultiSelect === key;

    return (
      <FilterGroup key={key}>
        <FilterLabel>{label}</FilterLabel>
        <MultiSelect>
          <MultiSelectInput onClick={() => setOpenMultiSelect(isOpen ? null : key)}>
            <span>
              {selectedValues.length > 0 
                ? `${selectedValues.length}개 선택됨`
                : '선택하세요'
              }
            </span>
            <span>▼</span>
          </MultiSelectInput>
          <MultiSelectDropdown isOpen={isOpen}>
            {options.map(option => (
              <MultiSelectOption
                key={option}
                selected={selectedValues.includes(option)}
                onClick={() => handleMultiSelectChange(key, option, !selectedValues.includes(option))}
              >
                {option}
              </MultiSelectOption>
            ))}
          </MultiSelectDropdown>
        </MultiSelect>
      </FilterGroup>
    );
  };

  return (
    <Container>
      <Header>
        <Title>고급 검색</Title>
        <Button onClick={() => setShowSaveModal(true)}>
          현재 조건 저장
        </Button>
      </Header>

      <FilterGrid>
        <FilterGroup>
          <FilterLabel>키워드 검색</FilterLabel>
          <FilterInput
            type="text"
            placeholder="제목, 설명, 스텝에서 검색..."
            value={filters.keyword || ''}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
          />
        </FilterGroup>

        {renderMultiSelect('folders', folderOptions, '폴더')}
        {renderMultiSelect('tags', tagOptions, '태그')}
        {renderMultiSelect('status', statusOptions, '상태')}
        {renderMultiSelect('priority', priorityOptions, '우선순위')}

        <FilterGroup>
          <FilterLabel>작성자</FilterLabel>
          <FilterInput
            type="text"
            placeholder="작성자 입력..."
            value={filters.createdBy?.join(', ') || ''}
            onChange={(e) => handleFilterChange('createdBy', e.target.value.split(',').map(s => s.trim()))}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>생성일 (시작)</FilterLabel>
          <FilterInput
            type="date"
            value={filters.dateRange?.from || ''}
            onChange={(e) => handleFilterChange('dateRange', {
              ...filters.dateRange,
              from: e.target.value
            })}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>생성일 (종료)</FilterLabel>
          <FilterInput
            type="date"
            value={filters.dateRange?.to || ''}
            onChange={(e) => handleFilterChange('dateRange', {
              ...filters.dateRange,
              to: e.target.value
            })}
          />
        </FilterGroup>
      </FilterGrid>

      <ActionButtons>
        <Button onClick={handleClear}>
          초기화
        </Button>
        <Button variant="primary" onClick={handleSearch}>
          검색
        </Button>
      </ActionButtons>

      {presets.length > 0 && (
        <PresetSection>
          <PresetHeader>
            <h4>저장된 검색 조건</h4>
          </PresetHeader>
          <PresetList>
            {presets.map(preset => (
              <PresetTag
                key={preset.id}
                onClick={() => handleLoadPreset(preset)}
                title={`${preset.name} (${preset.createdAt})`}
              >
                {preset.name}
              </PresetTag>
            ))}
          </PresetList>
        </PresetSection>
      )}

      <SavePresetModal isOpen={showSaveModal}>
        <ModalContent>
          <ModalTitle>검색 조건 저장</ModalTitle>
          <ModalInput
            type="text"
            placeholder="프리셋 이름을 입력하세요"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
          />
          <ModalButtons>
            <Button onClick={() => setShowSaveModal(false)}>
              취소
            </Button>
            <Button variant="primary" onClick={handleSavePreset}>
              저장
            </Button>
          </ModalButtons>
        </ModalContent>
      </SavePresetModal>
    </Container>
  );
};

export default AdvancedFilter; 