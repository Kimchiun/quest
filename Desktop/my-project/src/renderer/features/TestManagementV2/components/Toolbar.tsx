import React from 'react';
import styled from 'styled-components';
import { FolderTree } from '../../../types/folder';

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
  gap: 12px;
  height: 56px;
  flex-shrink: 0;
  box-sizing: border-box;
`;

const SearchInput = styled.input`
  flex: 1;
  max-width: 300px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: 1px solid ${props => props.variant === 'primary' ? '#3b82f6' : '#d1d5db'};
  border-radius: 6px;
  background: ${props => props.variant === 'primary' ? '#3b82f6' : '#ffffff'};
  color: ${props => props.variant === 'primary' ? '#ffffff' : '#374151'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.variant === 'primary' ? '#2563eb' : '#f9fafb'};
    border-color: ${props => props.variant === 'primary' ? '#2563eb' : '#9ca3af'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  font-size: 14px;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FolderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f3f4f6;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px; /* 최대 너비 제한 */
  min-width: 0; /* flex 아이템이 축소될 수 있도록 */
`;

const FolderIcon = styled.div`
  width: 16px;
  height: 16px;
  background: #fbbf24;
  border: 1px solid #a16207;
  border-radius: 2px;
`;

const Spacer = styled.div`
  flex: 1;
`;

interface ToolbarProps {
  selectedFolder: FolderTree | null;
  onCreateTestCase: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  selectedFolder,
  onCreateTestCase
}) => {
  const handleCreateTestCase = () => {
    onCreateTestCase();
  };

  return (
    <ToolbarContainer>
      <SearchInput
        type="text"
        placeholder="폴더 또는 테스트케이스 검색..."
      />
      
      <Select defaultValue="name">
        <option value="name">이름순</option>
        <option value="created">생성일순</option>
        <option value="updated">수정일순</option>
        <option value="priority">우선순위순</option>
      </Select>
      
      <Spacer />
      
      {selectedFolder && (
        <FolderInfo>
          <FolderIcon />
          <span>{selectedFolder.name}</span>
          {selectedFolder.testCaseCount !== undefined && (
            <span>({selectedFolder.testCaseCount}개)</span>
          )}
        </FolderInfo>
      )}
      
      <Button variant="primary" onClick={handleCreateTestCase}>
        새 테스트케이스
      </Button>
    </ToolbarContainer>
  );
};

export default Toolbar;
