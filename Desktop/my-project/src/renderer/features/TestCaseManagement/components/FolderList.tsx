import React from 'react';
import styled from 'styled-components';
import { FolderIcon } from '../../../shared/components/Icons';

interface Folder {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  children: Folder[];
  testCaseCount: number;
}

interface FolderListProps {
  folders: Folder[];
  selectedFolderId?: number | null;
  onFolderSelect: (folderId: number) => void;
}

const FolderListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0;
`;

const FolderItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$isSelected ? '#eff6ff' : 'transparent'};
  color: ${props => props.$isSelected ? '#3b82f6' : '#374151'};
  
  &:hover {
    background: ${props => props.$isSelected ? '#eff6ff' : '#f3f4f6'};
  }
`;

const FolderIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

const FolderName = styled.span`
  font-size: 14px;
  font-weight: 500;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TestCaseCount = styled.span`
  font-size: 12px;
  color: #6b7280;
  margin-left: auto;
`;

const FolderList: React.FC<FolderListProps> = ({ folders, selectedFolderId, onFolderSelect }) => {
  // 모든 폴더를 평면화하여 리스트로 표시
  const flattenFolders = (folders: Folder[]): Folder[] => {
    const result: Folder[] = [];
    
    const flatten = (folderList: Folder[]) => {
      folderList.forEach(folder => {
        result.push(folder);
        if (folder.children && folder.children.length > 0) {
          flatten(folder.children);
        }
      });
    };
    
    flatten(folders);
    return result;
  };

  const flatFolders = flattenFolders(folders);

  return (
    <FolderListContainer>
      {flatFolders.map((folder) => (
        <FolderItem
          key={folder.id}
          $isSelected={selectedFolderId === folder.id}
          onClick={() => onFolderSelect(folder.id)}
        >
          <FolderIconWrapper>
            <FolderIcon size={16} color={selectedFolderId === folder.id ? '#3b82f6' : '#6b7280'} />
          </FolderIconWrapper>
          <FolderName>{folder.name}</FolderName>
          {folder.testCaseCount > 0 && (
            <TestCaseCount>({folder.testCaseCount})</TestCaseCount>
          )}
        </FolderItem>
      ))}
    </FolderListContainer>
  );
};

export default FolderList; 