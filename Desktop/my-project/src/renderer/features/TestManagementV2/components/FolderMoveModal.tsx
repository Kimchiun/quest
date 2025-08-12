import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface Folder {
  id: string;
  name: string;
  parentId?: string;
  children?: Folder[];
  level?: number;
}

interface FolderMoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMove: (targetFolderId: string) => void;
  currentFolderId: string;
  folders: Folder[];
  testCaseTitle: string;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 400px;
  max-height: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #374151;
  }
`;

const TestCaseInfo = styled.div`
  background: #f9fafb;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
`;

const TestCaseTitle = styled.div`
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
`;

const TestCaseSubtitle = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const FolderList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
`;

const FolderItem = styled.div<{ isSelected: boolean; isCurrent: boolean; level: number }>`
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${props => props.isSelected ? '#dbeafe' : props.isCurrent ? '#fef3c7' : 'white'};
  color: ${props => props.isCurrent ? '#92400e' : '#374151'};
  padding-left: ${props => 16 + (props.level * 24)}px;
  position: relative;
  
  &:hover {
    background: ${props => props.isCurrent ? '#fde68a' : '#f3f4f6'};
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  ${props => props.level > 0 && `
    &::before {
      content: '';
      position: absolute;
      left: ${16 + (props.level * 24) - 12}px;
      top: 50%;
      width: 8px;
      height: 1px;
      background: #d1d5db;
    }
  `}
`;

const FolderIcon = styled.span<{ level: number }>`
  color: #6b7280;
  font-size: 16px;
  margin-left: ${props => props.level * 8}px;
`;

const CurrentFolderBadge = styled.span`
  background: #f59e0b;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  margin-left: auto;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`;

const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
    }
    
    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  ` : `
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

const FolderMoveModal: React.FC<FolderMoveModalProps> = ({
  isOpen,
  onClose,
  onMove,
  currentFolderId,
  folders,
  testCaseTitle
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setSelectedFolderId('');
    }
  }, [isOpen]);

  const handleMove = () => {
    if (selectedFolderId && selectedFolderId !== currentFolderId) {
      onMove(selectedFolderId);
      onClose();
    }
  };

  const handleFolderClick = (folderId: string) => {
    if (folderId !== currentFolderId) {
      setSelectedFolderId(folderId);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>폴더 이동</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        <TestCaseInfo>
          <TestCaseTitle>{testCaseTitle}</TestCaseTitle>
          <TestCaseSubtitle>이동할 폴더를 선택하세요</TestCaseSubtitle>
        </TestCaseInfo>
        
        <FolderList>
          {folders.map((folder) => (
            <FolderItem
              key={folder.id}
              isSelected={selectedFolderId === folder.id}
              isCurrent={folder.id === currentFolderId}
              level={folder.level || 0}
              onClick={() => handleFolderClick(folder.id)}
            >
              <FolderIcon level={folder.level || 0}>
                {folder.level === 0 ? '📁' : '📂'}
              </FolderIcon>
              <span>{folder.name}</span>
              {folder.id === currentFolderId && (
                <CurrentFolderBadge>현재</CurrentFolderBadge>
              )}
            </FolderItem>
          ))}
        </FolderList>
        
        <ActionButtons>
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleMove}
            disabled={!selectedFolderId || selectedFolderId === currentFolderId}
          >
            이동
          </Button>
        </ActionButtons>
      </ModalContent>
    </ModalOverlay>
  );
};

export default FolderMoveModal;
