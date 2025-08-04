import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FolderTree as FolderTreeType } from '../../../../main/app/domains/folders/models/Folder';

interface FolderTreeProps {
  folders: FolderTreeType[];
  onFolderSelect: (folderId: number) => void;
  onFolderCreate: (parentId?: number) => void;
  onFolderUpdate: (folderId: number, data: any) => void;
  onFolderDelete: (folderId: number) => void;
  onFolderMove: (draggedId: number, targetId: number, dropType: 'before' | 'after' | 'inside') => void;
}

interface DragState {
  draggedNodeId: number | null;
  draggedNode: FolderTreeType | null;
  dropTargetId: number | null;
  dropZone: 'before' | 'after' | 'inside' | null;
  isDragging: boolean;
  dragStartPosition: { x: number; y: number } | null;
}

// 부드러운 애니메이션 정의
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
    transform: translateY(10px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
`;

const FolderTreeContainer = styled.div`
  width: 280px;
  height: 100%;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  user-select: none;
  position: relative;
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
  padding: 8px 16px;
  padding-left: ${props => 16 + props.depth * 16}px;
  cursor: pointer;
  position: relative;
  background: ${props => {
    if (props.isSelected) return '#dbeafe';
    if (props.isDropTarget && props.dropZone === 'inside') return '#f0f9ff';
    return 'transparent';
  }};
  border-left: ${props => props.isSelected ? '2px solid #3b82f6' : '2px solid transparent'};
  opacity: ${props => props.isDragging ? 0.3 : 1};
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${props => {
    if (props.isMoving) return css`${slideIn} 0.3s ease-out`;
    return 'none';
  }};

  &:hover {
    background: ${props => props.isSelected ? '#dbeafe' : '#f1f5f9'};
    transform: ${props => props.isDragging ? 'scale(0.98)' : 'scale(1)'};
  }

  /* 드롭 영역 표시 - 더 부드러운 애니메이션 */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
    opacity: 0;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 2px;
  }

  ${props => {
    if (props.dropZone === 'before') {
      return `
        &::before {
          top: 0;
          opacity: 1;
          transform: scaleX(1);
        }
      `;
    }
    if (props.dropZone === 'after') {
      return `
        &::before {
          bottom: 0;
          opacity: 1;
          transform: scaleX(1);
        }
      `;
    }
    if (props.dropZone === 'inside') {
      return `
        background: #dbeafe !important;
        border: 2px solid #3b82f6;
        border-radius: 6px;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        animation: ${pulse} 1s ease-in-out infinite;
      `;
    }
    return '';
  }}
`;

const FolderIcon = styled.div<{ isExpanded: boolean }>`
  width: 16px;
  height: 16px;
  margin-right: 8px;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${props => props.isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'};
`;

const ExpandIcon = styled.div<{ isExpanded: boolean }>`
  width: 12px;
  height: 12px;
  margin-right: 8px;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${props => props.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'};
  cursor: pointer;

  &:hover {
    color: #3b82f6;
    transform: ${props => props.isExpanded ? 'rotate(90deg) scale(1.1)' : 'rotate(0deg) scale(1.1)'};
  }
`;

const FolderName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180px;
  transition: color 200ms ease;
`;

const TestCaseCount = styled.span`
  font-size: 12px;
  background: #e5e7eb;
  color: #374151;
  padding: 2px 6px;
  border-radius: 8px;
  margin-left: 8px;
  min-width: 20px;
  text-align: center;
  transition: all 200ms ease;

  &:hover {
    background: #d1d5db;
  }
`;

const DragOverlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 200ms ease;
`;

const DropZoneIndicator = styled.div<{
  type: 'before' | 'after' | 'inside';
  isVisible: boolean;
}>`
  position: absolute;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 1001;
  border-radius: 2px;

  ${props => {
    if (props.type === 'before' || props.type === 'after') {
      return `
        height: 3px;
        left: 0;
        right: 0;
        ${props.type === 'before' ? 'top: 0;' : 'bottom: 0;'}
        box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
      `;
    }
    if (props.type === 'inside') {
      return `
        border: 2px solid #3b82f6;
        background: rgba(59, 130, 246, 0.1);
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 6px;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
      `;
    }
    return '';
  }}
`;

const MovingIndicator = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #3b82f6;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  z-index: 1002;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 300ms ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

export const FolderTree: React.FC<FolderTreeProps> = ({
  folders,
  onFolderSelect,
  onFolderCreate,
  onFolderUpdate,
  onFolderDelete,
  onFolderMove
}) => {
  const [dragState, setDragState] = useState<DragState>({
    draggedNodeId: null,
    draggedNode: null,
    dropTargetId: null,
    dropZone: null,
    isDragging: false,
    dragStartPosition: null
  });

  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [movingFolderId, setMovingFolderId] = useState<number | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // 드래그 시작
  const handleDragStart = useCallback((e: React.DragEvent, folder: FolderTreeType) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDragState({
      draggedNodeId: folder.id,
      draggedNode: folder,
      dropTargetId: null,
      dropZone: null,
      isDragging: true,
      dragStartPosition: { x: e.clientX - rect.left, y: e.clientY - rect.top }
    });

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', folder.id.toString());
    
    // 드래그 이미지 설정
    if (e.dataTransfer.setDragImage) {
      const dragImage = document.createElement('div');
      dragImage.textContent = folder.name;
      dragImage.style.cssText = `
        position: absolute;
        top: -1000px;
        left: -1000px;
        background: #3b82f6;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
      `;
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 0, 0);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }
  }, []);

  // 드래그 종료
  const handleDragEnd = useCallback(() => {
    setDragState({
      draggedNodeId: null,
      draggedNode: null,
      dropTargetId: null,
      dropZone: null,
      isDragging: false,
      dragStartPosition: null
    });
  }, []);

  // 드래그 오버 - 더 정교한 영역 계산
  const handleDragOver = useCallback((e: React.DragEvent, targetFolder: FolderTreeType) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;

    let dropZone: 'before' | 'after' | 'inside' | null = null;

    // 더 정교한 드롭 영역 계산
    const topZone = height * 0.15; // 상단 15%
    const bottomZone = height * 0.85; // 하단 15%
    const middleZone = height * 0.5; // 중앙 50%

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

  // 드롭 - 부드러운 이동 처리
  const handleDrop = useCallback(async (e: React.DragEvent, targetFolder: FolderTreeType) => {
    e.preventDefault();

    if (dragState.draggedNodeId && dragState.dropZone) {
      setMovingFolderId(dragState.draggedNodeId);
      
      try {
        await onFolderMove(dragState.draggedNodeId, targetFolder.id, dragState.dropZone);
        
        // 성공 애니메이션
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
      isDragging: false,
      dragStartPosition: null
    });
  }, [dragState, onFolderMove]);

  // 폴더 클릭
  const handleFolderClick = useCallback((folderId: number) => {
    setSelectedFolderId(folderId);
    onFolderSelect(folderId);
  }, [onFolderSelect]);

  // 폴더 더블클릭 (이름 수정)
  const handleFolderDoubleClick = useCallback((folder: FolderTreeType) => {
    console.log('폴더 이름 수정:', folder.name);
  }, []);

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
          onDoubleClick={() => handleFolderDoubleClick(folder)}
          aria-label={`폴더: ${folder.name}, 테스트케이스 ${folder.testcaseCount}개`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleFolderClick(folder.id);
            }
          }}
        >
          {folder.children && folder.children.length > 0 && (
            <ExpandIcon
              isExpanded={folder.isExpanded || false}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleExpand(folder);
              }}
              aria-label={folder.isExpanded ? '축소' : '확장'}
            >
              ▶
            </ExpandIcon>
          )}
          
          <FolderIcon isExpanded={folder.isExpanded || false}>
            📁
          </FolderIcon>
          
          <FolderName title={folder.name}>
            {folder.name}
          </FolderName>
          
          {folder.testcaseCount > 0 && (
            <TestCaseCount>
              {folder.testcaseCount}
            </TestCaseCount>
          )}
        </FolderItem>

        {/* 드롭 영역 표시 */}
        {isDropTarget && dropZone && (
          <DropZoneIndicator
            type={dropZone}
            isVisible={true}
          />
        )}

        {/* 하위 폴더들 */}
        {folder.isExpanded && folder.children && folder.children.length > 0 && (
          <div style={{ animation: `${slideIn} 0.3s ease-out` }}>
            {folder.children.map(child => renderFolder(child, depth + 1))}
          </div>
        )}
      </div>
    );
  }, [dragState, selectedFolderId, movingFolderId, handleDragStart, handleDragEnd, handleDragOver, handleDragLeave, handleDrop, handleFolderClick, handleFolderDoubleClick, handleToggleExpand]);

  return (
    <FolderTreeContainer>
      <DragOverlay isVisible={dragState.isDragging} />
      <MovingIndicator isVisible={!!movingFolderId}>
        폴더를 이동하는 중...
      </MovingIndicator>
      {folders.map(folder => renderFolder(folder))}
    </FolderTreeContainer>
  );
}; 