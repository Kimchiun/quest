import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FolderTree } from '../../../types/folder';

// 애니메이션 정의
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const snapBack = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
  100% { transform: translateX(0); }
`;

const ItemContainer = styled.div<{ 
  depth: number; 
  isSelected: boolean; 
  isDragging: boolean;
  isDragOver: boolean;
  dropType?: 'before' | 'after' | 'into';
}>`
  display: flex;
  align-items: center;
  height: 28px;
  padding-left: ${props => props.depth * 16 + 12}px;
  padding-right: 12px;
  cursor: ${props => props.isDragging ? 'grabbing' : 'grab'};
  position: relative;
  background: ${props => {
    if (props.isSelected) return '#dbeafe';
    if (props.isDragOver && props.dropType === 'into') return 'rgba(59, 130, 246, 0.08)';
    return 'transparent';
  }};
  border-left: ${props => props.isSelected ? '3px solid #3b82f6' : 'none'};
  user-select: ${props => props.isDragging ? 'none' : 'auto'};
  transition: background-color 0.2s ease;
  font-weight: ${props => props.isSelected ? '600' : '400'};

  &:hover {
    background: ${props => props.isDragging ? 'transparent' : props.isSelected ? '#dbeafe' : '#f9fafb'};
  }

  &:hover .add-button {
    opacity: 1;
  }

  ${props => props.isDragging && css`
    animation: ${snapBack} 0.3s ease-in-out;
  `}
`;

// 삽입선 스타일
const InsertLine = styled.div<{ 
  dropType: 'before' | 'after'; 
  depth: number;
  isVisible: boolean;
}>`
  position: absolute;
  left: ${props => props.depth * 16 + 12}px;
  right: 12px;
  height: 2px;
  background: #3b82f6;
  ${props => props.dropType === 'before' ? 'top: 0;' : 'bottom: 0;'}
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.1s ease;
  z-index: 10;
`;

// 드래그 고스트 스타일
const DragGhost = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  z-index: 1000;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #111827;
`;

const GuideLine = styled.div<{ depth: number }>`
  position: absolute;
  left: ${props => props.depth * 16 + 4}px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #e5e7eb;
  opacity: 0.6;
`;

const CaretButton = styled.button<{ isExpanded: boolean; hasChildren: boolean }>`
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  cursor: ${props => props.hasChildren ? 'pointer' : 'default'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  color: ${props => props.hasChildren ? '#6b7280' : '#d1d5db'};
  transition: transform 0.2s;
  transform: ${props => props.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'};

  &:hover {
    color: ${props => props.hasChildren ? '#374151' : '#d1d5db'};
  }
`;

const CaretIcon = styled.div`
  width: 0;
  height: 0;
  border-left: 6px solid currentColor;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
`;

const FolderIcon = styled.div`
  width: 16px;
  height: 16px;
  background: #fbbf24;
  border: 1px solid #a16207;
  border-radius: 2px;
  margin-right: 8px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    background: #fbbf24;
    border-radius: 1px;
  }
`;

const TextContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
`;

const FolderName = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: block;
`;

const TestCaseCount = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  margin-left: 4px;
`;

const AddButton = styled.button`
  width: 20px;
  height: 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;

  &:hover {
    background: #2563eb;
  }
`;

const DragHandle = styled.div`
  width: 14px;
  height: 14px;
  margin-left: 8px;
  cursor: grab;
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;

  &:hover {
    color: #374151;
  }

  ${ItemContainer}:hover & {
    opacity: 1;
  }
`;

const DragHandleIcon = styled.div`
  width: 12px;
  height: 2px;
  background: currentColor;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 2px;
    background: currentColor;
  }

  &::before {
    top: -4px;
  }

  &::after {
    top: 4px;
  }
`;

// 컨텍스트 메뉴 스타일
const ContextMenu = styled.div<{ isVisible: boolean; x: number; y: number }>`
  position: fixed;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.2s ease;
  min-width: 120px;
  padding: 4px 0;
`;

const ContextMenuItem = styled.button`
  width: 100%;
  padding: 8px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;

  &:hover {
    background: #f3f4f6;
  }

  &:disabled {
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const ContextMenuDivider = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 4px 0;
`;

interface FolderTreeItemProps {
  folder: FolderTree;
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
  hasChildren: boolean;
  onToggleExpand: () => void;
  onClick: () => void;
  onCreateSubFolder: () => void;
  onMove: (folderId: number, targetParentId: number | null, orderIndex: number) => void;
  onRename: (folderId: number, newName: string) => void;
  onDelete: (folderId: number) => void;
}

const FolderTreeItem: React.FC<FolderTreeItemProps> = ({
  folder,
  depth,
  isExpanded,
  isSelected,
  hasChildren,
  onToggleExpand,
  onClick,
  onCreateSubFolder,
  onMove,
  onRename,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(folder.name);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dropType, setDropType] = useState<'before' | 'after' | 'into' | null>(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [ghostPos, setGhostPos] = useState({ x: 0, y: 0 });
  const [showGhost, setShowGhost] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  
  const itemRef = useRef<HTMLDivElement>(null);
  const dragTimeoutRef = useRef<NodeJS.Timeout>();
  const autoExpandTimeoutRef = useRef<NodeJS.Timeout>();

  // 전역 클릭 이벤트로 컨텍스트 메뉴 닫기
  useEffect(() => {
    const handleGlobalClick = () => {
      if (showContextMenu) {
        closeContextMenu();
      }
    };

    if (showContextMenu) {
      document.addEventListener('click', handleGlobalClick);
      return () => document.removeEventListener('click', handleGlobalClick);
    }
  }, [showContextMenu]);

  // 드래그 시작 처리
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // 좌클릭만 처리
    
    const startPos = { x: e.clientX, y: e.clientY };
    setDragStartPos(startPos);
    setHasDragged(false); // 드래그 상태 초기화
    
    // 마우스 이동 이벤트 리스너 추가
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = Math.abs(moveEvent.clientX - startPos.x);
      const deltaY = Math.abs(moveEvent.clientY - startPos.y);
      
      // 10px 이상 이동했을 때만 드래그 시작 (임계값 증가)
      if (deltaX > 10 || deltaY > 10) {
        if (dragTimeoutRef.current) {
          clearTimeout(dragTimeoutRef.current);
        }
        setIsDragging(true);
        setHasDragged(true);
        setShowGhost(true);
        setGhostPos({ x: moveEvent.clientX + 10, y: moveEvent.clientY - 10 });
      }
    };
    
    const handleMouseUp = () => {
      // 마우스를 놓으면 드래그 취소
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
        dragTimeoutRef.current = undefined;
      }
      
      // 드래그 상태 정리
      if (isDragging) {
        setIsDragging(false);
        setShowGhost(false);
        setHasDragged(false);
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    // 200ms 후에 드래그 모드 진입 (시간 증가)
    dragTimeoutRef.current = setTimeout(() => {
      setIsDragging(true);
      setHasDragged(true);
      setShowGhost(true);
      setGhostPos({ x: e.clientX + 10, y: e.clientY - 10 });
    }, 200);
    
    // 전역 마우스 이벤트 리스너 추가
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  // 마우스 이동 처리
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = Math.abs(e.clientX - dragStartPos.x);
    const deltaY = Math.abs(e.clientY - dragStartPos.y);
    
    // 5px 이동 임계치
    if (deltaX < 5 && deltaY < 5) return;
    
    setGhostPos({ x: e.clientX + 10, y: e.clientY - 10 });
    
    // 드롭 존 계산 - 모든 폴더 아이템에 대해
    const targetElement = document.elementFromPoint(e.clientX, e.clientY);
    if (targetElement) {
      const targetFolderItem = targetElement.closest('[data-folder-item]');
      if (targetFolderItem) {
        const rect = targetFolderItem.getBoundingClientRect();
        const relativeY = e.clientY - rect.top;
        const itemHeight = rect.height;
        
        // 현재 아이템인지 확인
        if (targetFolderItem === itemRef.current) {
          if (relativeY < itemHeight * 0.3) {
            setDropType('before');
            setIsDragOver(true);
          } else if (relativeY > itemHeight * 0.7) {
            setDropType('after');
            setIsDragOver(true);
          } else {
            setDropType('into');
            setIsDragOver(true);
            
            // 600ms 자동 확장
            if (!isExpanded && hasChildren) {
              autoExpandTimeoutRef.current = setTimeout(() => {
                onToggleExpand();
              }, 600);
            }
          }
        } else {
          // 다른 아이템에 호버 중일 때 시각적 피드백
          setIsDragOver(false);
          setDropType(null);
        }
      } else {
        setIsDragOver(false);
        setDropType(null);
      }
    } else {
      setIsDragOver(false);
      setDropType(null);
    }
    
    if (autoExpandTimeoutRef.current && !isDragOver) {
      clearTimeout(autoExpandTimeoutRef.current);
    }
  }, [isDragging, dragStartPos, isExpanded, hasChildren, onToggleExpand, isDragOver]);

  // 마우스 업 처리
  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
    if (autoExpandTimeoutRef.current) {
      clearTimeout(autoExpandTimeoutRef.current);
    }
    
    // 드래그 중이면 드롭 처리
    if (isDragging) {
      const targetElement = document.elementFromPoint(e.clientX, e.clientY);
      if (targetElement) {
        const targetFolderItem = targetElement.closest('[data-folder-item]');
        if (targetFolderItem && targetFolderItem !== itemRef.current) {
          const targetFolderId = parseInt(targetFolderItem.getAttribute('data-folder-id') || '0');
          const targetParentId = parseInt(targetFolderItem.getAttribute('data-parent-id') || '0');
          const targetOrderIndex = parseInt(targetFolderItem.getAttribute('data-order-index') || '0');
          
          // 드롭 타입 계산
          const rect = targetFolderItem.getBoundingClientRect();
          const relativeY = e.clientY - rect.top;
          const itemHeight = rect.height;
          
          let dropType: 'before' | 'after' | 'into';
          if (relativeY < itemHeight * 0.3) {
            dropType = 'before';
            onMove(folder.id, targetParentId, targetOrderIndex);
          } else if (relativeY > itemHeight * 0.7) {
            dropType = 'after';
            onMove(folder.id, targetParentId, targetOrderIndex + 1);
          } else {
            dropType = 'into';
            onMove(folder.id, targetFolderId, 0);
          }
        }
      }
    }
    
    setIsDragging(false);
    setIsDragOver(false);
    setDropType(null);
    setShowGhost(false);
    
    // 클릭 이벤트가 처리될 수 있도록 약간의 지연 후 hasDragged 리셋
    setTimeout(() => {
      setHasDragged(false);
    }, 100);
  }, [isDragging, folder.id, onMove]);

  // 이벤트 리스너 등록/해제
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleCaretClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggleExpand();
    }
  };

  const handleItemClick = (e: React.MouseEvent) => {
    // 드래그 중이거나 드래그가 시작된 경우 클릭 무시
    if (isDragging || hasDragged) {
      console.log('📁 드래그 중이므로 클릭 무시:', folder.name);
      return;
    }
    
    // 드래그 타임아웃이 있는 경우도 클릭 무시
    if (dragTimeoutRef.current) {
      console.log('📁 드래그 타임아웃 중이므로 클릭 무시:', folder.name);
      return;
    }
    
    console.log('📁 FolderTreeItem에서 클릭됨:', folder.name, 'ID:', folder.id, 'isSelected:', isSelected);
    onClick();
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('➕ + 버튼 클릭됨:', folder.name, 'ID:', folder.id);
    onCreateSubFolder();
  };

  // 우클릭 컨텍스트 메뉴 처리
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  // 컨텍스트 메뉴 닫기
  const closeContextMenu = () => {
    setShowContextMenu(false);
  };

  // 수정 메뉴 클릭
  const handleRenameClick = () => {
    closeContextMenu();
    setIsEditing(true);
    setEditValue(folder.name);
  };

  // 삭제 메뉴 클릭
  const handleDeleteClick = () => {
    closeContextMenu();
    if (window.confirm(`"${folder.name}" 폴더를 삭제하시겠습니까?`)) {
      onDelete(folder.id);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const trimmedValue = editValue.trim();
      if (trimmedValue && trimmedValue !== folder.name) {
        onRename(folder.id, trimmedValue);
      }
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setEditValue(folder.name);
      setIsEditing(false);
    }
  };

  const handleEditBlur = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== folder.name) {
      onRename(folder.id, trimmedValue);
    }
    setIsEditing(false);
  };

  return (
    <>
      <ItemContainer
        ref={itemRef}
        depth={depth}
        isSelected={isSelected}
        isDragging={isDragging}
        isDragOver={isDragOver}
        dropType={dropType}
        onMouseDown={handleMouseDown}
        onClick={handleItemClick}
        onContextMenu={handleContextMenu}
        data-folder-item
        data-folder-id={folder.id}
        data-parent-id={folder.parentId || 0}
        data-order-index={folder.orderIndex}
      >
        <GuideLine depth={depth} />
        
        {dropType === 'before' && (
          <InsertLine 
            dropType="before" 
            depth={depth} 
            isVisible={isDragOver} 
          />
        )}
        
        {dropType === 'after' && (
          <InsertLine 
            dropType="after" 
            depth={depth} 
            isVisible={isDragOver} 
          />
        )}
        
        <CaretButton
          isExpanded={isExpanded}
          hasChildren={hasChildren}
          onClick={handleCaretClick}
        >
          {hasChildren && <CaretIcon />}
        </CaretButton>
        
        <FolderIcon />
        
        <TextContainer>
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleEditKeyDown}
              onBlur={handleEditBlur}
              autoFocus
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '14px',
                width: '100%'
              }}
            />
          ) : (
            <FolderName onDoubleClick={handleDoubleClick}>
              {folder.name}
            </FolderName>
          )}
        </TextContainer>
        
        <AddButton
          className="add-button"
          onClick={handleAddClick}
        >
          +
        </AddButton>
      </ItemContainer>
      
      {/* 드래그 고스트 */}
      <DragGhost 
        isVisible={showGhost}
        style={{
          transform: `translate(${ghostPos.x}px, ${ghostPos.y}px)`
        }}
      >
        <FolderIcon />
        <span>{folder.name}</span>
      </DragGhost>

      {/* 컨텍스트 메뉴 */}
      <ContextMenu
        isVisible={showContextMenu}
        x={contextMenuPos.x}
        y={contextMenuPos.y}
      >
        <ContextMenuItem onClick={handleRenameClick}>
          ✏️ 수정
        </ContextMenuItem>
        <ContextMenuDivider />
        <ContextMenuItem onClick={handleDeleteClick}>
          🗑️ 삭제
        </ContextMenuItem>
      </ContextMenu>
    </>
  );
};

export default FolderTreeItem;
