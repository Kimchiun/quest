import React, { useState, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FolderTree as FolderTreeType } from '../../../../main/app/domains/folders/models/Folder';

interface FolderTreeProps {
  folders: FolderTreeType[];
  onFolderSelect: (folderId: number) => void;
  onFolderCreate: (parentId?: number) => void;
  onFolderUpdate: (folderId: number, data: any) => void;
  onFolderDelete: (folderId: number) => void;
  onFolderMove: (draggedId: number, targetId: number, dropType: 'before' | 'after' | 'inside') => void;
  selectedFolderId?: number | null;
  onSelectionChange?: (folderId: number | null) => void;
}

interface DragState {
  draggedNodeId: number | null;
  draggedNode: FolderTreeType | null;
  dropTargetId: number | null;
  dropZone: 'before' | 'after' | 'inside' | null;
  isDragging: boolean;
}

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const TreeContainer = styled.div`
  padding: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const FolderItem = styled.div<{
  depth: number;
  isSelected: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
  dropZone: 'before' | 'after' | 'inside' | null;
  isMoving: boolean;
}>`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  margin: 2px 0;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;
  animation: ${props => props.isMoving ? pulse : 'none'} 0.5s ease-in-out;
  
  /* 인덴트 */
  margin-left: ${props => props.depth * 16}px;
  
  /* 선택 상태 */
  background-color: ${props => props.isSelected ? '#DBEAFE' : 'transparent'};
  border-left: ${props => props.isSelected ? '2px solid #3B82F6' : '2px solid transparent'};
  
  /* 호버 상태 */
  &:hover {
    background-color: ${props => props.isSelected ? '#DBEAFE' : '#F1F5F9'};
  }
  
  /* 드래그 상태 */
  opacity: ${props => props.isDragging ? 0.5 : 1};
  transform: ${props => props.isDragging ? 'rotate(2deg)' : 'none'};
  box-shadow: ${props => props.isDragging ? '0 4px 16px rgba(0,0,0,0.1)' : 'none'};
  
  /* 드롭 타겟 상태 */
  ${props => {
    if (!props.isDropTarget) return '';
    
    switch (props.dropZone) {
      case 'before':
        return `
          border-top: 2px solid #3B82F6;
          margin-top: 4px;
        `;
      case 'after':
        return `
          border-bottom: 2px solid #3B82F6;
          margin-bottom: 4px;
        `;
      case 'inside':
        return `
          background-color: #DBEAFE;
          border: 2px solid #3B82F6;
        `;
      default:
        return '';
    }
  }}
`;

const FolderIcon = styled.div`
  width: 16px;
  height: 16px;
  margin-right: 8px;
  color: #6B7280;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FolderName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
`;

const Badge = styled.span`
  background-color: #E5E7EB;
  color: #374151;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 8px;
  margin-left: 8px;
  font-weight: 500;
`;

const ExpandIcon = styled.div<{ isExpanded: boolean }>`
  width: 12px;
  height: 12px;
  margin-right: 8px;
  color: #6B7280;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;
  transform: ${props => props.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'};
`;

export const FolderTree: React.FC<FolderTreeProps> = ({
  folders,
  onFolderSelect,
  onFolderCreate,
  onFolderUpdate,
  onFolderDelete,
  onFolderMove,
  selectedFolderId,
  onSelectionChange
}) => {
  const [dragState, setDragState] = useState<DragState>({
    draggedNodeId: null,
    draggedNode: null,
    dropTargetId: null,
    dropZone: null,
    isDragging: false
  });

  const [movingFolderId, setMovingFolderId] = useState<number | null>(null);

  // 드래그 시작
  const handleDragStart = useCallback((e: React.DragEvent, folder: FolderTreeType) => {
    setDragState({
      draggedNodeId: folder.id,
      draggedNode: folder,
      dropTargetId: null,
      dropZone: null,
      isDragging: true
    });

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', folder.id.toString());
  }, []);

  // 드래그 종료
  const handleDragEnd = useCallback(() => {
    setDragState({
      draggedNodeId: null,
      draggedNode: null,
      dropTargetId: null,
      dropZone: null,
      isDragging: false
    });
  }, []);

  // 드래그 오버
  const handleDragOver = useCallback((e: React.DragEvent, targetFolder: FolderTreeType) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;

    let dropZone: 'before' | 'after' | 'inside' | null = null;

    // 드롭 영역 계산
    const topZone = height * 0.2; // 상단 20%
    const bottomZone = height * 0.8; // 하단 20%

    if (y < topZone) {
      dropZone = 'before';
    } else if (y > bottomZone) {
      dropZone = 'after';
    } else {
      dropZone = 'inside';
    }

    // 순환 참조 방지
    if (dragState.draggedNodeId === targetFolder.id) {
      dropZone = null;
    }

    setDragState(prev => ({
      ...prev,
      dropTargetId: targetFolder.id,
      dropZone
    }));
  }, [dragState.draggedNodeId]);

  // 드래그 리브
  const handleDragLeave = useCallback(() => {
    setDragState(prev => ({
      ...prev,
      dropTargetId: null,
      dropZone: null
    }));
  }, []);

  // 드롭
  const handleDrop = useCallback(async (e: React.DragEvent, targetFolder: FolderTreeType) => {
    e.preventDefault();

    if (dragState.draggedNodeId && dragState.dropZone) {
      setMovingFolderId(dragState.draggedNodeId);
      
      try {
        await onFolderMove(dragState.draggedNodeId, targetFolder.id, dragState.dropZone);
        
        setTimeout(() => {
          setMovingFolderId(null);
        }, 500);
      } catch (error) {
        console.error('폴더 이동 실패:', error);
        setMovingFolderId(null);
      }
    }

    setDragState({
      draggedNodeId: null,
      draggedNode: null,
      dropTargetId: null,
      dropZone: null,
      isDragging: false
    });
  }, [dragState, onFolderMove]);

  // 폴더 클릭
  const handleFolderClick = useCallback((folderId: number) => {
    onFolderSelect(folderId);
    onSelectionChange?.(folderId);
  }, [onFolderSelect, onSelectionChange]);

  // 폴더 확장/축소
  const handleToggleExpand = useCallback((folder: FolderTreeType) => {
    onFolderUpdate(folder.id, { isExpanded: !folder.isExpanded });
  }, [onFolderUpdate]);

  // 폴더 렌더링
  const renderFolder = useCallback((folder: FolderTreeType, depth: number = 0) => {
    const isSelected = selectedFolderId === folder.id;
    const isDragging = dragState.draggedNodeId === folder.id;
    const isDropTarget = dragState.dropTargetId === folder.id;
    const dropZone = isDropTarget ? dragState.dropZone : null;
    const isMoving = movingFolderId === folder.id;

    return (
      <div key={folder.id}>
        <FolderItem
          depth={depth}
          isSelected={isSelected}
          isDragging={isDragging}
          isDropTarget={isDropTarget}
          dropZone={dropZone}
          isMoving={isMoving}
          draggable={!folder.isReadOnly}
          onDragStart={(e) => handleDragStart(e, folder)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, folder)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, folder)}
          onClick={() => handleFolderClick(folder.id)}
          onDoubleClick={() => handleToggleExpand(folder)}
        >
          {folder.children && folder.children.length > 0 && (
            <ExpandIcon isExpanded={folder.isExpanded || false}>
              ▶
            </ExpandIcon>
          )}
          <FolderIcon>
            📁
          </FolderIcon>
          <FolderName>{folder.name}</FolderName>
          {folder.testcaseCount > 0 && (
            <Badge>{folder.testcaseCount}</Badge>
          )}
        </FolderItem>
        
        {folder.isExpanded && folder.children && folder.children.length > 0 && (
          <div style={{ animation: `${slideIn} 0.15s ease-out` }}>
            {folder.children.map(child => renderFolder(child, depth + 1))}
          </div>
        )}
      </div>
    );
  }, [selectedFolderId, dragState, movingFolderId, handleDragStart, handleDragEnd, handleDragOver, handleDragLeave, handleDrop, handleFolderClick, handleToggleExpand]);

  return (
    <TreeContainer>
      {folders.map(folder => renderFolder(folder))}
    </TreeContainer>
  );
}; 