import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FolderIcon, ChevronRightIcon, ChevronDownIcon } from '../../../shared/components/Icons';

interface Folder {
  id: number;
  name: string;
  description?: string;
  parentId?: number | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  children: Folder[];
  testCaseCount: number;
  level?: number;
  // 고유 식별자 추가
  uniqueId?: string;
}

interface DraggableFolderListProps {
  folders: Folder[];
  selectedFolderId?: number | null;
  selectedFolderUniqueId?: string | null; // 고유 ID 기반 선택 추가
  onFolderSelect: (folderId: number, uniqueId: string) => void; // 고유 ID도 함께 전달
  onFolderMove?: (folderId: number, newParentId: number | null) => void;
  onFolderReorder?: (folderId: number, targetFolderId: number, position: 'before' | 'after') => void;
  onFolderUpdate?: (folderId: number, newName: string) => void;
  onFolderDelete?: (folderId: number) => void;
  onFolderDuplicate?: (folderId: number) => void;
  onFolderCreate?: (parentId: number | null) => void;
}

interface DragState {
  isDragging: boolean;
  draggedId: number | null;
  dropTargetId: number | null;
  dropType: 'hierarchy' | 'reorder' | null;
  mouseX: number;
  mouseY: number;
  draggedFolderName: string;
}

interface ContextMenuState {
  isVisible: boolean;
  x: number;
  y: number;
  folderId: number | null;
}

interface EditState {
  folderId: number | null;
  name: string;
  error: string | null;
}

// 고유 ID 생성 함수
const generateUniqueId = (folder: Folder, level: number, parentPath: string = ''): string => {
  const currentPath = parentPath ? `${parentPath}/${folder.id}` : `${folder.id}`;
  return `${currentPath}-${level}`;
};

// 폴더에 고유 ID 추가하는 함수
const addUniqueIds = (folders: Folder[], level = 0, parentPath = ''): Folder[] => {
  return folders.map(folder => {
    const uniqueId = generateUniqueId(folder, level, parentPath);
    const currentPath = parentPath ? `${parentPath}/${folder.id}` : `${folder.id}`;
    
    return {
      ...folder,
      uniqueId,
      level,
      children: folder.children ? addUniqueIds(folder.children, level + 1, currentPath) : []
    };
  });
};

// 스타일 컴포넌트들
const FolderListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 8px 0;
  position: relative;
  min-height: 100px;
  user-select: none;
`;

const FolderItem = styled.div<{ 
  $level: number; 
  $isSelected: boolean;
  $isHovered: boolean;
  $isDragOver: boolean;
  $dropType: 'hierarchy' | 'reorder' | null;
}>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  padding-left: ${props => 12 + props.$level * 20}px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  background: ${props => {
    if (props.$isDragOver) {
      if (props.$dropType === 'hierarchy') return '#dbeafe';
      if (props.$dropType === 'reorder') return '#f0f9ff';
      return 'transparent';
    }
    if (props.$isHovered) {
      return props.$isSelected ? '#eff6ff' : '#f8fafc';
    }
    return props.$isSelected ? '#eff6ff' : 'transparent';
  }};
  
  color: ${props => props.$isSelected ? '#3b82f6' : '#374151'};
  border-left: ${props => props.$level > 0 ? '2px solid #e5e7eb' : 'none'};
  
  &:hover {
    background: ${props => {
      if (props.$isDragOver) {
        return props.$dropType === 'hierarchy' ? '#dbeafe' : '#f0f9ff';
      }
      return props.$isSelected ? '#eff6ff' : '#f8fafc';
    }};
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

const FolderName = styled.span<{ $level: number }>`
  font-size: 14px;
  font-weight: 500;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${props => props.$level === 0 ? '#1f2937' : '#374151'};
`;

const TestCaseCount = styled.span`
  font-size: 12px;
  color: #6b7280;
  margin-left: auto;
`;

const ExpandIcon = styled.div<{ $isExpanded: boolean; $hasChildren: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
  cursor: ${props => props.$hasChildren ? 'pointer' : 'default'};
  margin-right: 4px;
  opacity: ${props => props.$hasChildren ? 1 : 0.3};
  color: ${props => props.$hasChildren ? '#6b7280' : '#d1d5db'};
  
  &:hover {
    color: ${props => props.$hasChildren ? '#374151' : '#d1d5db'};
  }
`;

// 드래그 오버레이 컴포넌트 개선
const DragOverlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1000;
  display: ${props => props.$isVisible ? 'block' : 'none'};
`;

const DragPreview = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: ${props => props.$x}px;
  top: ${props => props.$y}px;
  background: rgba(59, 130, 246, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transform: translate(-50%, -50%);
  pointer-events: none;
  white-space: nowrap;
  z-index: 1001;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  /* 부드러운 애니메이션 */
  animation: dragPreviewAppear 0.2s ease-out;
  
  @keyframes dragPreviewAppear {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

// 드롭 영역 표시 개선
const DropZone = styled.div<{ $isActive: boolean; $type: 'hierarchy' | 'reorder' | null }>`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: ${props => {
    if (!props.$isActive) return 'transparent';
    if (props.$type === 'hierarchy') return 'rgba(59, 130, 246, 0.15)';
    if (props.$type === 'reorder') return 'rgba(16, 185, 129, 0.15)';
    return 'transparent';
  }};
  border: ${props => {
    if (!props.$isActive) return 'none';
    if (props.$type === 'hierarchy') return '2px solid #3b82f6';
    if (props.$type === 'reorder') return '2px solid #10b981';
    return 'none';
  }};
  border-radius: 8px;
  pointer-events: none;
  z-index: 10;
  transition: all 0.2s ease-in-out;
  
  /* 애니메이션 효과 */
  animation: ${props => props.$isActive ? 'dropZonePulse 1.5s ease-in-out infinite' : 'none'};
  
  @keyframes dropZonePulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
    }
    50% {
      box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
    }
  }
`;

// 드롭 가이드 라인 개선
const DropGuideLine = styled.div<{ $type: 'hierarchy' | 'reorder' }>`
  position: absolute;
  left: 12px;
  right: 12px;
  height: 4px;
  background: ${props => props.$type === 'hierarchy' ? '#3b82f6' : '#10b981'};
  box-shadow: 0 0 12px ${props => props.$type === 'hierarchy' ? 'rgba(59, 130, 246, 0.6)' : 'rgba(16, 185, 129, 0.6)'};
  z-index: 100;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 2px;
  transition: all 0.2s ease-in-out;
  
  /* 애니메이션 효과 */
  animation: guideLineAppear 0.3s ease-out;
  
  @keyframes guideLineAppear {
    from {
      opacity: 0;
      transform: translateY(-50%) scaleX(0);
    }
    to {
      opacity: 1;
      transform: translateY(-50%) scaleX(1);
    }
  }
`;

// 무효한 드롭 영역 표시 개선
const InvalidDropZone = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid #ef4444;
  border-radius: 8px;
  pointer-events: none;
  z-index: 10;
  transition: all 0.2s ease-in-out;
  
  /* 애니메이션 효과 */
  animation: invalidDropShake 0.5s ease-in-out;
  
  @keyframes invalidDropShake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
  
  &::after {
    content: '🚫';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    background: white;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    animation: invalidIconBounce 0.6s ease-in-out;
  }
  
  @keyframes invalidIconBounce {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.1); }
  }
`;

// 컨텍스트 메뉴
const ContextMenu = styled.div<{ $x: number; $y: number }>`
  position: fixed;
  top: ${props => props.$y}px;
  left: ${props => props.$x}px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 2000;
  min-width: 120px;
  padding: 4px 0;
`;

const ContextMenuItem = styled.div`
  padding: 8px 12px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
  }
`;

// 편집 입력 필드
const EditInput = styled.input<{ $hasError: boolean }>`
  flex: 1;
  border: 1px solid ${props => props.$hasError ? '#ef4444' : '#3b82f6'};
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 14px;
  outline: none;
  background: white;
  
  &:focus {
    border-color: ${props => props.$hasError ? '#ef4444' : '#3b82f6'};
    box-shadow: 0 0 0 2px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)'};
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  padding: 0 8px;
`;

const DraggableFolderList: React.FC<DraggableFolderListProps> = ({
  folders,
  selectedFolderId,
  selectedFolderUniqueId,
  onFolderSelect,
  onFolderMove,
  onFolderReorder,
  onFolderUpdate,
  onFolderDelete,
  onFolderDuplicate,
  onFolderCreate,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedId: null,
    dropTargetId: null,
    dropType: null,
    mouseX: 0,
    mouseY: 0,
    draggedFolderName: '',
  });
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isVisible: false,
    x: 0,
    y: 0,
    folderId: null,
  });
  const [editState, setEditState] = useState<EditState>({
    folderId: null,
    name: '',
    error: null,
  });
  
  const containerRef = useRef<HTMLDivElement>(null);

  // 폴더를 평면화하여 렌더링 (고유 ID 추가)
  const flattenFolders = (folders: Folder[], level = 0): Folder[] => {
    const result: Folder[] = [];
    for (const folder of folders) {
      const folderWithLevel = { 
        ...folder, 
        level,
        uniqueId: folder.uniqueId || generateUniqueId(folder, level)
      };
      result.push(folderWithLevel);
      if (expandedFolders.has(folder.id) && folder.children && folder.children.length > 0) {
        result.push(...flattenFolders(folder.children, level + 1));
      }
    }
    return result;
  };

  const flatFolders = flattenFolders(folders);

  // 폴더 이름 유효성 검사
  const validateFolderName = useCallback((name: string, excludeId?: number): string | null => {
    if (name.length < 2) {
      return '폴더 이름은 2자 이상이어야 합니다.';
    }
    if (name.length > 50) {
      return '폴더 이름은 50자 이하여야 합니다.';
    }
    if (!/^[a-zA-Z0-9가-힣\s]+$/.test(name)) {
      return '폴더 이름에는 영문, 한글, 숫자, 공백만 사용할 수 있습니다.';
    }
    
    // 중복 검사 (동일 계층 내에서만)
    const currentFolder = flatFolders.find(f => f.id === excludeId);
    const sameLevelFolders = flatFolders.filter(f => 
      f.level === currentFolder?.level && 
      f.parentId === currentFolder?.parentId &&
      f.id !== excludeId
    );
    
    const existingFolder = sameLevelFolders.find(f => f.name === name);
    if (existingFolder) {
      return '동일한 계층에 같은 이름의 폴더가 이미 존재합니다.';
    }
    
    return null;
  }, [flatFolders]);

  // 개선된 드롭 타입 감지 - 폴더 계층 구조 고려
  const getDropType = useCallback((draggedId: number, targetId: number, mouseY: number, elementRect: DOMRect): 'hierarchy' | 'reorder' | null => {
    if (draggedId === targetId) return null;
    
    // 폴더 정보 찾기
    const draggedFolder = flatFolders.find(f => f.id === draggedId);
    const targetFolder = flatFolders.find(f => f.id === targetId);
    
    if (!draggedFolder || !targetFolder) return null;
    
    // 자기 자신이나 자식 폴더로는 이동 불가
    if (draggedFolder.id === targetFolder.id) return null;
    
    // 자식 폴더인지 확인
    const isChild = (parentId: number, childId: number): boolean => {
      const parent = flatFolders.find(f => f.id === parentId);
      if (!parent) return false;
      if (parent.children.some(child => child.id === childId)) return true;
      return parent.children.some(child => isChild(child.id, childId));
    };
    
    if (isChild(draggedFolder.id, targetFolder.id)) {
      return null; // 자식 폴더로는 이동 불가
    }
    
    const relativeY = mouseY - elementRect.top;
    const elementHeight = elementRect.height;
    const centerY = elementHeight / 2;
    
    // 같은 레벨의 폴더인지 확인
    const isSameLevel = draggedFolder.level === targetFolder.level && 
                       draggedFolder.parentId === targetFolder.parentId;
    
    // 중앙 50% 영역은 계층 변경, 나머지는 순서 변경
    if (Math.abs(relativeY - centerY) < centerY * 0.5) {
      // 계층 변경 조건:
      // 1. 다른 레벨의 폴더이거나
      // 2. 같은 레벨이지만 부모가 다른 경우
      if (!isSameLevel) {
        return 'hierarchy';
      } else {
        return null; // 같은 레벨, 같은 부모면 계층 변경 불가
      }
    } else {
      // 순서 변경 조건:
      // 1. 같은 레벨의 폴더이거나
      // 2. 최상위 레벨에서 다른 최상위 폴더로 이동하는 경우
      if (isSameLevel || (draggedFolder.level === 0 && targetFolder.level === 0)) {
        return 'reorder';
      } else {
        return null; // 다른 레벨이면 순서 변경 불가
      }
    }
  }, [flatFolders]);

  // 마우스 이벤트 핸들러들
  const handleMouseDown = useCallback((e: React.MouseEvent, folderId: number) => {
    const folder = flatFolders.find(f => f.id === folderId);
    if (!folder) return;
    
    // 드래그 시작 시 커서 변경
    document.body.style.cursor = 'grabbing';
    
    setDragState(prev => ({
      ...prev,
      draggedId: folderId,
      draggedFolderName: folder.name,
    }));
  }, [flatFolders]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.draggedId) return;

    // 마우스 위치 업데이트
    setDragState(prev => ({
      ...prev,
      mouseX: e.clientX,
      mouseY: e.clientY,
    }));

    const distance = Math.sqrt(
      Math.pow(e.clientX - (dragState.mouseX || 0), 2) +
      Math.pow(e.clientY - (dragState.mouseY || 0), 2)
    );

    if (distance < 5) return;

    if (!dragState.isDragging) {
      setDragState(prev => ({ ...prev, isDragging: true }));
      console.log('🔄 드래그 시작!', dragState.draggedFolderName);
    }

    // 가장 가까운 폴더 요소 찾기
    const folderElements = document.querySelectorAll('[data-folder-id]');
    let closestElement: HTMLElement | null = null;
    let minDistance = Infinity;

    folderElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      const rect = htmlElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestElement = htmlElement;
      }
    });

    if (closestElement && dragState.draggedId) {
      const targetId = parseInt((closestElement as HTMLElement).dataset.folderId || '0');
      const rect = (closestElement as HTMLElement).getBoundingClientRect();
      const dropType = getDropType(dragState.draggedId, targetId, e.clientY, rect);
      
      // 드롭 타입에 따른 커서 변경
      if (dropType === 'hierarchy') {
        document.body.style.cursor = 'copy';
      } else if (dropType === 'reorder') {
        document.body.style.cursor = 'move';
      } else {
        document.body.style.cursor = 'not-allowed';
      }
      
      setDragState(prev => ({
        ...prev,
        dropTargetId: targetId,
        dropType,
      }));
    } else {
      document.body.style.cursor = 'not-allowed';
      setDragState(prev => ({
        ...prev,
        dropTargetId: null,
        dropType: null,
      }));
    }
  }, [dragState.draggedId, dragState.isDragging, dragState.mouseX, dragState.mouseY, dragState.draggedFolderName, getDropType]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    // 커서 복원
    document.body.style.cursor = 'default';
    
    if (!dragState.isDragging || !dragState.draggedId || !dragState.dropTargetId || !dragState.dropType) {
      setDragState({
        isDragging: false,
        draggedId: null,
        dropTargetId: null,
        dropType: null,
        mouseX: 0,
        mouseY: 0,
        draggedFolderName: '',
      });
      return;
    }

    console.log('📦 드롭 완료:', {
      draggedId: dragState.draggedId,
      dropTargetId: dragState.dropTargetId,
      dropType: dragState.dropType,
      draggedFolderName: dragState.draggedFolderName
    });

    // 드롭 처리
    if (dragState.dropType === 'hierarchy') {
      if (onFolderMove) {
        onFolderMove(dragState.draggedId, dragState.dropTargetId);
        setExpandedFolders(prev => new Set([...prev, dragState.dropTargetId!]));
      }
    } else if (dragState.dropType === 'reorder') {
      if (onFolderReorder) {
        onFolderReorder(dragState.draggedId, dragState.dropTargetId, 'after');
      }
    }

    setDragState({
      isDragging: false,
      draggedId: null,
      dropTargetId: null,
      dropType: null,
      mouseX: 0,
      mouseY: 0,
      draggedFolderName: '',
    });
  }, [dragState, onFolderMove, onFolderReorder]);

  // 단일 선택 처리 - 이전 선택 상태 완전 초기화
  const handleSelect = useCallback((folderId: number, uniqueId: string) => {
    // 단일 선택만 허용 - 항상 하나의 폴더만 선택
    // 이전 선택 상태를 완전히 초기화
    onFolderSelect(folderId, uniqueId);
  }, [onFolderSelect]);

  // 빈 공간 클릭 시 선택 해제
  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    // 컨테이너 자체를 클릭했을 때만 선택 해제
    if (e.target === e.currentTarget) {
      onFolderSelect(0, ''); // 선택 해제
    }
  }, [onFolderSelect]);

  // 더블클릭으로 이름 변경 시작
  const handleDoubleClick = useCallback((e: React.MouseEvent, folderId: number) => {
    e.stopPropagation();
    const folder = flatFolders.find(f => f.id === folderId);
    if (folder) {
      setEditState({
        folderId,
        name: folder.name,
        error: null,
      });
    }
  }, [flatFolders]);

  // 우클릭 메뉴 처리
  const handleContextMenu = useCallback((e: React.MouseEvent, folderId: number) => {
    e.preventDefault();
    setContextMenu({
      isVisible: true,
      x: e.clientX,
      y: e.clientY,
      folderId,
    });
  }, []);

  // 컨텍스트 메뉴 아이템 클릭 처리
  const handleContextMenuAction = useCallback((action: 'edit' | 'delete' | 'duplicate') => {
    if (!contextMenu.folderId) return;

    switch (action) {
      case 'edit':
        const folder = flatFolders.find(f => f.id === contextMenu.folderId);
        if (folder) {
          setEditState({
            folderId: contextMenu.folderId,
            name: folder.name,
            error: null,
          });
        }
        break;
      case 'delete':
        if (onFolderDelete) {
          onFolderDelete(contextMenu.folderId);
        }
        break;
      case 'duplicate':
        if (onFolderDuplicate) {
          onFolderDuplicate(contextMenu.folderId);
        }
        break;
    }
    setContextMenu({ isVisible: false, x: 0, y: 0, folderId: null });
  }, [contextMenu.folderId, flatFolders, onFolderDelete, onFolderDuplicate]);

  // 폴더 이름 수정 처리
  const handleEditSubmit = useCallback(() => {
    if (!editState.folderId || !editState.name.trim()) return;

    const error = validateFolderName(editState.name, editState.folderId);
    if (error) {
      setEditState(prev => ({ ...prev, error }));
      return;
    }

    if (onFolderUpdate) {
      onFolderUpdate(editState.folderId, editState.name.trim());
    }
    setEditState({ folderId: null, name: '', error: null });
  }, [editState, validateFolderName, onFolderUpdate]);

  const handleEditCancel = useCallback(() => {
    setEditState({ folderId: null, name: '', error: null });
  }, []);

  // 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // 드래그 취소
        if (dragState.isDragging) {
          document.body.style.cursor = 'default';
          setDragState({
            isDragging: false,
            draggedId: null,
            dropTargetId: null,
            dropType: null,
            mouseX: 0,
            mouseY: 0,
            draggedFolderName: '',
          });
        }
        
        // 컨텍스트 메뉴 닫기
        if (contextMenu.isVisible) {
          setContextMenu({ isVisible: false, x: 0, y: 0, folderId: null });
        }
        
        // 편집 모드 취소
        if (editState.folderId) {
          setEditState({ folderId: null, name: '', error: null });
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dragState.isDragging, contextMenu.isVisible, editState.folderId]);

  // 마우스 이벤트 리스너
  React.useEffect(() => {
    if (dragState.draggedId) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.draggedId, handleMouseMove, handleMouseUp]);

  // 컨텍스트 메뉴 외부 클릭 처리
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.isVisible) {
        setContextMenu({ isVisible: false, x: 0, y: 0, folderId: null });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu.isVisible]);

  return (
    <>
      <FolderListContainer 
        ref={containerRef}
        onClick={handleContainerClick}
      >
        {flatFolders.map((folder) => {
          const isDragOver = dragState.dropTargetId === folder.id;
          const isHovered = hoveredId === folder.id;
          // 고유 ID 기반 선택 상태 비교
          const isSelected = selectedFolderUniqueId === folder.uniqueId;
          const hasChildren = folder.children && folder.children.length > 0;
          const isEditing = editState.folderId === folder.id;
          
          // 고유한 키 생성 (고유 ID 사용)
          const uniqueKey = folder.uniqueId || `${folder.id}-${folder.level}-${folder.parentId || 'root'}`;
          
          return (
            <FolderItem
              key={uniqueKey}
              data-folder-id={folder.id}
              data-folder-unique-id={folder.uniqueId}
              data-folder-level={folder.level}
              data-folder-parent={folder.parentId}
              $level={folder.level ?? 0}
              $isSelected={isSelected}
              $isHovered={isHovered}
              $isDragOver={isDragOver}
              $dropType={isDragOver ? dragState.dropType : null}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(folder.id, folder.uniqueId || '');
              }}
              onDoubleClick={(e) => handleDoubleClick(e, folder.id)}
              onMouseDown={(e) => handleMouseDown(e, folder.id)}
              onMouseEnter={() => setHoveredId(folder.id)}
              onMouseLeave={() => setHoveredId(null)}
              onContextMenu={(e) => handleContextMenu(e, folder.id)}
              style={{
                cursor: dragState.isDragging && dragState.draggedId === folder.id ? 'grabbing' : 'grab'
              }}
            >
              {/* 드롭 영역 표시 */}
              {isDragOver && dragState.dropType && (
                <DropZone $isActive={true} $type={dragState.dropType} />
              )}
              
              {/* 무효한 드롭 영역 표시 */}
              {isDragOver && !dragState.dropType && dragState.draggedId !== folder.id && (
                <InvalidDropZone />
              )}
              
              <ExpandIcon
                $isExpanded={expandedFolders.has(folder.id)}
                $hasChildren={hasChildren}
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasChildren) {
                    setExpandedFolders(prev => {
                      const newSet = new Set(prev);
                      if (newSet.has(folder.id)) {
                        newSet.delete(folder.id);
                      } else {
                        newSet.add(folder.id);
                      }
                      return newSet;
                    });
                  }
                }}
              >
                {expandedFolders.has(folder.id) ? (
                  <ChevronDownIcon size={12} color="#6b7280" />
                ) : (
                  <ChevronRightIcon size={12} color="#6b7280" />
                )}
              </ExpandIcon>
              
              <FolderIconWrapper>
                <FolderIcon 
                  size={16} 
                  color={isSelected ? '#3b82f6' : '#6b7280'} 
                />
              </FolderIconWrapper>
              
              {isEditing ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <EditInput
                    type="text"
                    value={editState.name}
                    onChange={(e) => setEditState(prev => ({ ...prev, name: e.target.value, error: null }))}
                    onBlur={handleEditSubmit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEditSubmit();
                      } else if (e.key === 'Escape') {
                        handleEditCancel();
                      }
                    }}
                    $hasError={!!editState.error}
                    autoFocus
                  />
                  {editState.error && <ErrorMessage>{editState.error}</ErrorMessage>}
                </div>
              ) : (
                <FolderName 
                  $level={folder.level ?? 0}
                  data-folder-name
                >
                  {folder.name}
                </FolderName>
              )}
              
              {folder.testCaseCount > 0 && (
                <TestCaseCount>({folder.testCaseCount})</TestCaseCount>
              )}
              
              {isDragOver && dragState.dropType && (
                <DropGuideLine $type={dragState.dropType} />
              )}
            </FolderItem>
          );
        })}
      </FolderListContainer>
      
      {/* 드래그 오버레이 */}
      <DragOverlay $isVisible={dragState.isDragging}>
        <DragPreview $x={dragState.mouseX} $y={dragState.mouseY}>
          📁 {dragState.draggedFolderName}
        </DragPreview>
      </DragOverlay>
      
      {contextMenu.isVisible && (
        <ContextMenu $x={contextMenu.x} $y={contextMenu.y}>
          <ContextMenuItem onClick={() => handleContextMenuAction('edit')}>
            수정
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleContextMenuAction('duplicate')}>
            복제
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleContextMenuAction('delete')}>
            삭제
          </ContextMenuItem>
        </ContextMenu>
      )}
    </>
  );
};

export default DraggableFolderList; 