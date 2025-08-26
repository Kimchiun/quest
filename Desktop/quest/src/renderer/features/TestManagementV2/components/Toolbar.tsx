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

const Button = styled.button<{ variant?: 'primary' | 'secondary'; disabled?: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${props => {
    if (props.disabled) return '#e5e7eb';
    return props.variant === 'primary' ? '#3b82f6' : '#d1d5db';
  }};
  border-radius: 6px;
  background: ${props => {
    if (props.disabled) return '#f9fafb';
    return props.variant === 'primary' ? '#3b82f6' : '#ffffff';
  }};
  color: ${props => {
    if (props.disabled) return '#9ca3af';
    return props.variant === 'primary' ? '#ffffff' : '#374151';
  }};
  font-size: 14px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;

  &:hover {
    background: ${props => {
      if (props.disabled) return '#f9fafb';
      return props.variant === 'primary' ? '#2563eb' : '#f9fafb';
    }};
    border-color: ${props => {
      if (props.disabled) return '#e5e7eb';
      return props.variant === 'primary' ? '#2563eb' : '#9ca3af';
    }};
  }

  &:disabled {
    opacity: 0.6;
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
  position: relative;
  color: #6b7280;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 2px solid currentColor;
    border-radius: 2px;
    background: transparent;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 2px;
    right: 2px;
    height: 3px;
    background: currentColor;
    border-radius: 1px 1px 0 0;
  }
`;

const Spacer = styled.div`
  flex: 1;
`;

const NoFolderMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  font-size: 14px;
  color: #dc2626;
  white-space: nowrap;
`;

const WarningIcon = styled.div`
  width: 16px;
  height: 16px;
  background: #dc2626;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  font-weight: bold;
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
    if (selectedFolder) {
      onCreateTestCase();
    }
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
      
      {selectedFolder ? (
        <FolderInfo>
          <FolderIcon />
          <span>{selectedFolder.name}</span>
          {selectedFolder.testCaseCount !== undefined && (
            <span>({selectedFolder.testCaseCount}개)</span>
          )}
        </FolderInfo>
      ) : (
        <NoFolderMessage>
          <WarningIcon>!</WarningIcon>
          <span>폴더를 선택해주세요</span>
        </NoFolderMessage>
      )}
      
      <Button 
        variant="primary" 
        onClick={handleCreateTestCase}
        disabled={!selectedFolder}
        title={!selectedFolder ? "테스트케이스를 생성하려면 폴더를 선택해주세요" : "새 테스트케이스 생성"}
      >
        새 테스트케이스
      </Button>
    </ToolbarContainer>
  );
};

export default Toolbar;
