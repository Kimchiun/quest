import React, { useState } from 'react';
import styled from 'styled-components';
import { FolderTree } from '../../../types/folder';
import FolderTreeItem from './FolderTreeItem';

// 커스텀 모달 스타일 컴포넌트
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
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
`;

const ModalMessage = styled.p`
  margin: 0 0 24px 0;
  color: #4b5563;
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ModalButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background: #dc2626;
    color: white;
    &:hover {
      background: #b91c1c;
    }
  ` : `
    background: #f3f4f6;
    color: #374151;
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

const Container = styled.div<{ isCollapsed: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  width: 100%;
  transition: width 0.3s ease;
`;

const Header = styled.div<{ isCollapsed: boolean }>`
  padding: ${props => props.isCollapsed ? '8px' : '16px'};
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: ${props => props.isCollapsed ? 'center' : 'space-between'};
  height: 56px;
  flex-shrink: 0;
  box-sizing: border-box;
  gap: 8px;
  min-width: 0; /* 추가: flex 아이템이 축소될 수 있도록 */
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

const Title = styled.h2<{ isCollapsed: boolean }>`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  display: ${props => props.isCollapsed ? 'none' : 'block'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1; /* 변경: 고정 너비 대신 flex로 변경 */
  min-width: 0; /* 추가: 텍스트가 축소될 수 있도록 */
`;

const AddRootFolderButton = styled.button`
  width: 24px;
  height: 24px;
  background: #3b82f6;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: #2563eb;
    transform: scale(1.05);
  }

  &:active {
    background: #1d4ed8;
    transform: scale(0.95);
  }
`;

const EditButton = styled.button<{ isActive: boolean }>`
  width: 24px;
  height: 24px;
  background: ${props => props.isActive ? '#ef4444' : '#6b7280'};
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.isActive ? '#dc2626' : '#4b5563'};
    transform: scale(1.05);
  }

  &:active {
    background: ${props => props.isActive ? '#b91c1c' : '#374151'};
    transform: scale(0.95);
  }
`;

const MultiSelectActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 8px;
  padding: 8px;
  background: #f3f4f6;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
`;

const DeleteSelectedButton = styled.button`
  padding: 4px 8px;
  background: #ef4444;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #dc2626;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const CancelSelectionButton = styled.button`
  padding: 4px 8px;
  background: #6b7280;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #4b5563;
  }
`;

const TreeContainer = styled.div<{ isCollapsed: boolean }>`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
  display: ${props => props.isCollapsed ? 'none' : 'block'};
`;

const ToggleButton = styled.button<{ isCollapsed: boolean }>`
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: transform 0.3s ease;
  transform: ${props => props.isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)'};

  &:hover {
    color: #374151;
  }
`;

const ToggleIcon = styled.div`
  width: 0;
  height: 0;
  border-left: 6px solid currentColor;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
`;

interface FolderTreePanelProps {
  folders: FolderTree[];
  selectedFolder: FolderTree | null;
  onFolderSelect: (folder: FolderTree) => void;
  onCreateFolder: (parentId?: number) => void;
  onFolderMove: (folderId: number, targetParentId: number | null, orderIndex: number) => void;
  onRename: (folderId: number, newName: string) => void;
  onDelete: (folderId: number) => void;
  onCollapse?: (collapsed: boolean) => void;
  expandedFolders: Set<number>;
  setExpandedFolders: React.Dispatch<React.SetStateAction<Set<number>>>;
  onCreateRootFolder: () => void;
  onMultiDelete?: (folderIds: number[]) => void;
}

const FolderTreePanel: React.FC<FolderTreePanelProps> = ({
  folders,
  selectedFolder,
  onFolderSelect,
  onCreateFolder,
  onFolderMove,
  onRename,
  onDelete,
  onCollapse,
  expandedFolders,
  setExpandedFolders,
  onCreateRootFolder,
  onMultiDelete
}) => {

  // 폴더 목록이 변경되어도 확장 상태 유지
  React.useEffect(() => {
    console.log('📁 FolderTreePanel - 현재 확장된 폴더들:', Array.from(expandedFolders));
  }, [expandedFolders, folders]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedFolderIds, setSelectedFolderIds] = useState<Set<number>>(new Set());
  
  // 커스텀 모달 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleToggleExpand = (folderId: number) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFolderClick = (folder: FolderTree) => {
    console.log('📁 FolderTreePanel에서 폴더 클릭됨:', folder.name, 'ID:', folder.id);
    
    if (isMultiSelectMode) {
      // 다중 선택 모드에서는 선택 상태를 토글
      const newSelectedIds = new Set(selectedFolderIds);
      if (newSelectedIds.has(folder.id)) {
        newSelectedIds.delete(folder.id);
      } else {
        newSelectedIds.add(folder.id);
      }
      setSelectedFolderIds(newSelectedIds);
    } else {
      // 일반 모드에서는 폴더 선택
      onFolderSelect(folder);
    }
  };

  const handleToggleMultiSelect = () => {
    setIsMultiSelectMode(!isMultiSelectMode);
    if (isMultiSelectMode) {
      // 다중 선택 모드 종료 시 선택된 폴더들 초기화
      setSelectedFolderIds(new Set());
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFolderIds.size === 0) return;
    
    setShowDeleteModal(true);
  };

  const confirmDeleteSelected = () => {
    if (onMultiDelete) {
      onMultiDelete(Array.from(selectedFolderIds));
      setSelectedFolderIds(new Set());
      setIsMultiSelectMode(false);
    }
    setShowDeleteModal(false);
  };

  const handleCancelSelection = () => {
    setSelectedFolderIds(new Set());
    setIsMultiSelectMode(false);
  };

  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapse) {
      onCollapse(newCollapsedState);
    }
  };

  const renderFolderTree = (folderList: FolderTree[], depth: number = 0): React.ReactNode => {
    return folderList.map((folder) => {
      const isExpanded = expandedFolders.has(folder.id);
      const isSelected = isMultiSelectMode 
        ? selectedFolderIds.has(folder.id)
        : selectedFolder?.id === folder.id;
      const hasChildren = folder.children && Array.isArray(folder.children) && folder.children.length > 0;

      return (
        <div key={folder.id}>
          <FolderTreeItem
            folder={folder}
            depth={depth}
            isExpanded={isExpanded}
            isSelected={isSelected}
            hasChildren={hasChildren}
            onToggleExpand={() => handleToggleExpand(folder.id)}
            onClick={() => handleFolderClick(folder)}
            onCreateSubFolder={() => {
              console.log('📁 onCreateSubFolder 호출됨:', folder.name, 'ID:', folder.id);
              onCreateFolder(folder.id);
            }}
            onMove={onFolderMove}
            onRename={onRename}
            onDelete={onDelete}
          />
          {isExpanded && hasChildren && (
            <div style={{ marginLeft: 16 }}>
              {renderFolderTree(folder.children!, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <Container isCollapsed={isCollapsed}>
      <Header isCollapsed={isCollapsed}>
        <ToggleButton isCollapsed={isCollapsed} onClick={handleToggleCollapse}>
          <ToggleIcon />
        </ToggleButton>
        <HeaderLeft>
          <Title isCollapsed={isCollapsed}>폴더 구조</Title>
          {!isCollapsed && (
            <>
              <AddRootFolderButton
                onClick={onCreateRootFolder}
                title="새 폴더 생성"
              >
                +
              </AddRootFolderButton>
              <EditButton
                isActive={isMultiSelectMode}
                onClick={handleToggleMultiSelect}
                title={isMultiSelectMode ? "다중 선택 모드 종료" : "다중 선택 모드"}
              >
                ✏️
              </EditButton>
            </>
          )}
        </HeaderLeft>
      </Header>
      <TreeContainer isCollapsed={isCollapsed}>
        {isMultiSelectMode && (
          <MultiSelectActions>
            <span style={{ fontSize: '12px', color: '#374151' }}>
              {selectedFolderIds.size}개 선택됨
            </span>
            <DeleteSelectedButton
              onClick={handleDeleteSelected}
              disabled={selectedFolderIds.size === 0}
            >
              선택 삭제
            </DeleteSelectedButton>
            <CancelSelectionButton onClick={handleCancelSelection}>
              취소
            </CancelSelectionButton>
          </MultiSelectActions>
        )}
        {folders.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
            폴더가 없습니다.
          </div>
        ) : (
          renderFolderTree(folders)
        )}
      </TreeContainer>
      
      {/* 커스텀 삭제 확인 모달 */}
      {showDeleteModal && (
        <ModalOverlay onClick={() => setShowDeleteModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>다중 폴더 삭제</ModalTitle>
            <ModalMessage>
              선택된 <strong>{selectedFolderIds.size}개</strong>의 폴더를 삭제하시겠습니까?<br />
              이 작업은 되돌릴 수 없습니다.
            </ModalMessage>
            <ModalButtons>
              <ModalButton 
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                취소
              </ModalButton>
              <ModalButton 
                variant="primary"
                onClick={confirmDeleteSelected}
              >
                삭제
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default FolderTreePanel;
