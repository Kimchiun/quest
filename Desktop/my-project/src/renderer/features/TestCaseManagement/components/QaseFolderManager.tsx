import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';

// Qase 기반 인터페이스
interface Folder {
  id: number;
  name: string;
  parentId: number | null;
  level: number;
  children: Folder[];
  testCases: TestCase[];
  isExpanded?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TestCase {
  id: number;
  name: string;
  folderId: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface QaseFolderManagerProps {
  folders: Folder[];
  selectedFolderId?: number | null;
  onFolderSelect: (folderId: number) => void;
  onFolderCreate: (parentId: number | null) => void;
  onFolderUpdate: (folderId: number, newName: string) => void;
  onFolderDelete: (folderId: number) => void;
  onFolderDuplicate: (folderId: number) => void;
  onFolderMove: (folderId: number, newParentId: number | null) => void;
  onTestCaseCreate: (folderId: number) => void;
  onTestCaseUpdate: (testCaseId: number, newName: string) => void;
  onTestCaseDelete: (testCaseId: number) => void;
  onTestCaseDuplicate: (testCaseId: number) => void;
  onTestCaseMove: (testCaseId: number, newFolderId: number) => void;
  onFolderToggle: (folderId: number) => void;
}

// 스타일 컴포넌트들
const Container = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
`;

const TreeContainer = styled.div`
  padding: 16px;
`;

const TreeItem = styled.div<{ $level: number; $isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  margin: 2px 0;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  background: ${props => props.$isSelected ? '#3b82f6' : 'transparent'};
  color: ${props => props.$isSelected ? 'white' : '#374151'};
  margin-left: ${props => props.$level * 20}px;
  
  &:hover {
    background: ${props => props.$isSelected ? '#3b82f6' : '#f3f4f6'};
  }
`;

const FolderIcon = styled.div`
  width: 16px;
  height: 16px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

const TestCaseIcon = styled.div`
  width: 16px;
  height: 16px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const ExpandIcon = styled.div<{ $isExpanded: boolean }>`
  width: 16px;
  height: 16px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  transform: ${props => props.$isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'};
  
  &:hover {
    color: #3b82f6;
  }
`;

const ItemName = styled.span`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
`;

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

const ContextMenu = styled.div<{ $x: number; $y: number }>`
  position: fixed;
  left: ${props => props.$x}px;
  top: ${props => props.$y}px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 120px;
`;

const ContextMenuItem = styled.div`
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background: #f3f4f6;
  }
  
  &:first-child {
    border-radius: 6px 6px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 6px 6px;
  }
`;

const Toolbar = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  color: #374151;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
  }
  
  &:active {
    background: #e5e7eb;
  }
`;

// 드래그 앤 드롭 관련 인터페이스
interface DragState {
  isDragging: boolean;
  draggedId: number | null;
  draggedType: 'folder' | 'testcase' | null;
  dropTargetId: number | null;
  dropType: 'hierarchy' | 'reorder' | null;
  mouseX: number;
  mouseY: number;
}

interface ContextMenuState {
  isVisible: boolean;
  x: number;
  y: number;
  itemId: number | null;
  itemType: 'folder' | 'testcase' | null;
}

interface EditState {
  itemId: number | null;
  itemType: 'folder' | 'testcase' | null;
  name: string;
  error: string | null;
}

const QaseFolderManager: React.FC<QaseFolderManagerProps> = ({
  folders,
  selectedFolderId,
  onFolderSelect,
  onFolderCreate,
  onFolderUpdate,
  onFolderDelete,
  onFolderDuplicate,
  onFolderMove,
  onTestCaseCreate,
  onTestCaseUpdate,
  onTestCaseDelete,
  onTestCaseDuplicate,
  onTestCaseMove,
  onFolderToggle
}) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedId: null,
    draggedType: null,
    dropTargetId: null,
    dropType: null,
    mouseX: 0,
    mouseY: 0
  });
  
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isVisible: false,
    x: 0,
    y: 0,
    itemId: null,
    itemType: null
  });
  
  const [editState, setEditState] = useState<EditState>({
    itemId: null,
    itemType: null,
    name: '',
    error: null
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // 폴더를 평면화하여 렌더링
  const flattenItems = (folders: Folder[], level = 0): Array<{ item: Folder | TestCase; type: 'folder' | 'testcase'; level: number }> => {
    const result: Array<{ item: Folder | TestCase; type: 'folder' | 'testcase'; level: number }> = [];
    
    for (const folder of folders) {
      result.push({ item: folder, type: 'folder', level });
      
      if (folder.isExpanded) {
        // 테스트 케이스들 추가
        folder.testCases.forEach(testCase => {
          result.push({ item: testCase, type: 'testcase', level: level + 1 });
        });
        
        // 하위 폴더들 재귀적으로 추가
        result.push(...flattenItems(folder.children, level + 1));
      }
    }
    
    return result;
  };

  const flatItems = flattenItems(folders);

  // 이름 유효성 검사
  const validateName = useCallback((name: string, itemType: 'folder' | 'testcase', excludeId?: number): string | null => {
    if (name.length < 2) {
      return '이름은 2자 이상이어야 합니다.';
    }
    if (name.length > 50) {
      return '이름은 50자 이하여야 합니다.';
    }
    if (!/^[a-zA-Z0-9가-힣\s]+$/.test(name)) {
      return '이름에는 영문, 한글, 숫자, 공백만 사용할 수 있습니다.';
    }
    
    // 중복 검사 (같은 레벨 내에서만)
    const currentItem = flatItems.find(item => 
      item.item.id === excludeId && item.type === itemType
    );
    
    if (currentItem) {
      const sameLevelItems = flatItems.filter(item => 
        item.level === currentItem.level && 
        item.type === itemType &&
        item.item.id !== excludeId
      );
      
      if (sameLevelItems.some(item => item.item.name === name)) {
        return '같은 레벨에 같은 이름의 항목이 이미 존재합니다.';
      }
    }
    
    return null;
  }, [flatItems]);

  // 드롭 타입 감지
  const getDropType = useCallback((draggedId: number, targetId: number, mouseY: number, elementRect: DOMRect): 'hierarchy' | 'reorder' | null => {
    if (draggedId === targetId) return null;
    
    const draggedItem = flatItems.find(item => item.item.id === draggedId);
    const targetItem = flatItems.find(item => item.item.id === targetId);
    
    if (!draggedItem || !targetItem) return null;
    
    // 자기 자신이나 자식으로는 이동 불가
    if (draggedItem.type === 'folder' && targetItem.type === 'folder') {
      const draggedFolder = draggedItem.item as Folder;
      const targetFolder = targetItem.item as Folder;
      
      // 순환 참조 검사
      const isChild = (parentId: number, childId: number): boolean => {
        const parent = folders.find(f => f.id === parentId);
        if (!parent) return false;
        if (parent.children.some(child => child.id === childId)) return true;
        return parent.children.some(child => isChild(child.id, childId));
      };
      
      if (isChild(draggedFolder.id, targetFolder.id)) {
        return null;
      }
    }
    
    const relativeY = mouseY - elementRect.top;
    const elementHeight = elementRect.height;
    const centerY = elementHeight / 2;
    
    // 중앙 50% 영역은 계층 변경, 나머지는 순서 변경
    if (Math.abs(relativeY - centerY) < centerY * 0.5) {
      return 'hierarchy';
    } else {
      return 'reorder';
    }
  }, [flatItems, folders]);

  // 마우스 이벤트 핸들러들
  const handleMouseDown = useCallback((e: React.MouseEvent, itemId: number, itemType: 'folder' | 'testcase') => {
    const item = flatItems.find(item => item.item.id === itemId && item.type === itemType);
    if (!item) return;
    
    document.body.style.cursor = 'grabbing';
    
    setDragState(prev => ({
      ...prev,
      draggedId: itemId,
      draggedType: itemType,
      mouseX: e.clientX,
      mouseY: e.clientY
    }));
  }, [flatItems]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.draggedId) return;

    setDragState(prev => ({
      ...prev,
      mouseX: e.clientX,
      mouseY: e.clientY
    }));

    const distance = Math.sqrt(
      Math.pow(e.clientX - (dragState.mouseX || 0), 2) +
      Math.pow(e.clientY - (dragState.mouseY || 0), 2)
    );

    if (distance < 5) return;

    if (!dragState.isDragging) {
      setDragState(prev => ({ ...prev, isDragging: true }));
    }

    // 가장 가까운 요소 찾기
    const elements = document.querySelectorAll('[data-item-id]');
    let closestElement: HTMLElement | null = null;
    let minDistance = Infinity;

    elements.forEach((element) => {
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
      const targetId = parseInt((closestElement as HTMLElement).dataset.itemId || '0');
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
  }, [dragState.draggedId, dragState.isDragging, dragState.mouseX, dragState.mouseY, getDropType]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    document.body.style.cursor = 'default';
    
    if (!dragState.isDragging || !dragState.draggedId || !dragState.dropTargetId || !dragState.dropType) {
      setDragState({
        isDragging: false,
        draggedId: null,
        draggedType: null,
        dropTargetId: null,
        dropType: null,
        mouseX: 0,
        mouseY: 0
      });
      return;
    }

    // 드롭 처리
    if (dragState.draggedType === 'folder' && dragState.dropType === 'hierarchy') {
      onFolderMove(dragState.draggedId, dragState.dropTargetId);
    } else if (dragState.draggedType === 'testcase' && dragState.dropType === 'hierarchy') {
      onTestCaseMove(dragState.draggedId, dragState.dropTargetId);
    }

    setDragState({
      isDragging: false,
      draggedId: null,
      draggedType: null,
      dropTargetId: null,
      dropType: null,
      mouseX: 0,
      mouseY: 0
    });
  }, [dragState, onFolderMove, onTestCaseMove]);

  // 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // 드래그 취소
        if (dragState.isDragging) {
          setDragState({
            isDragging: false,
            draggedId: null,
            draggedType: null,
            dropTargetId: null,
            dropType: null,
            mouseX: 0,
            mouseY: 0
          });
          document.body.style.cursor = 'default';
        }
        
        // 컨텍스트 메뉴 닫기
        setContextMenu(prev => ({ ...prev, isVisible: false }));
        
        // 편집 취소
        setEditState(prev => ({ ...prev, itemId: null, itemType: null, name: '', error: null }));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dragState.isDragging]);

  // 마우스 이벤트 리스너
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // 컨텍스트 메뉴 핸들러
  const handleContextMenu = useCallback((e: React.MouseEvent, itemId: number, itemType: 'folder' | 'testcase') => {
    e.preventDefault();
    setContextMenu({
      isVisible: true,
      x: e.clientX,
      y: e.clientY,
      itemId,
      itemType
    });
  }, []);

  const handleContextMenuAction = useCallback((action: string) => {
    if (!contextMenu.itemId || !contextMenu.itemType) return;
    
    const { itemId, itemType } = contextMenu;
    
    switch (action) {
      case 'rename':
        const item = flatItems.find(item => item.item.id === itemId && item.type === itemType);
        if (item) {
          setEditState({
            itemId,
            itemType,
            name: item.item.name,
            error: null
          });
        }
        break;
      case 'delete':
        if (itemType === 'folder') {
          onFolderDelete(itemId);
        } else {
          onTestCaseDelete(itemId);
        }
        break;
      case 'duplicate':
        if (itemType === 'folder') {
          onFolderDuplicate(itemId);
        } else {
          onTestCaseDuplicate(itemId);
        }
        break;
    }
    
    setContextMenu(prev => ({ ...prev, isVisible: false }));
  }, [contextMenu, flatItems, onFolderDelete, onFolderDuplicate, onTestCaseDelete, onTestCaseDuplicate]);

  // 편집 핸들러
  const handleEditSubmit = useCallback(() => {
    if (!editState.itemId || !editState.itemType) return;
    
    const error = validateName(editState.name, editState.itemType, editState.itemId);
    if (error) {
      setEditState(prev => ({ ...prev, error }));
      return;
    }
    
    if (editState.itemType === 'folder') {
      onFolderUpdate(editState.itemId, editState.name);
    } else {
      onTestCaseUpdate(editState.itemId, editState.name);
    }
    
    setEditState({ itemId: null, itemType: null, name: '', error: null });
  }, [editState, validateName, onFolderUpdate, onTestCaseUpdate]);

  const handleEditCancel = useCallback(() => {
    setEditState({ itemId: null, itemType: null, name: '', error: null });
  }, []);

  // 클릭 핸들러
  const handleItemClick = useCallback((itemId: number, itemType: 'folder' | 'testcase') => {
    if (itemType === 'folder') {
      onFolderSelect(itemId);
    }
  }, [onFolderSelect]);

  const handleExpandClick = useCallback((e: React.MouseEvent, folderId: number) => {
    e.stopPropagation();
    onFolderToggle(folderId);
  }, [onFolderToggle]);

  // 더블클릭 핸들러
  const handleItemDoubleClick = useCallback((itemId: number, itemType: 'folder' | 'testcase') => {
    const item = flatItems.find(item => item.item.id === itemId && item.type === itemType);
    if (item) {
      setEditState({
        itemId,
        itemType,
        name: item.item.name,
        error: null
      });
    }
  }, [flatItems]);

  return (
    <Container ref={containerRef}>
      <Toolbar>
        <Button onClick={() => onFolderCreate(null)}>+ 새 폴더</Button>
        {selectedFolderId && (
          <Button onClick={() => onTestCaseCreate(selectedFolderId)}>+ 새 테스트 케이스</Button>
        )}
      </Toolbar>
      
      <TreeContainer>
        {flatItems.map(({ item, type, level }) => (
          <TreeItem
            key={`${type}-${item.id}`}
            $level={level}
            $isSelected={selectedFolderId === item.id}
            data-item-id={item.id}
            data-item-type={type}
            onClick={() => handleItemClick(item.id, type)}
            onDoubleClick={() => handleItemDoubleClick(item.id, type)}
            onMouseDown={(e) => handleMouseDown(e, item.id, type)}
            onContextMenu={(e) => handleContextMenu(e, item.id, type)}
          >
            {type === 'folder' ? (
              <>
                <ExpandIcon
                  $isExpanded={(item as Folder).isExpanded}
                  onClick={(e) => handleExpandClick(e, item.id)}
                >
                  ▶
                </ExpandIcon>
                <FolderIcon>📁</FolderIcon>
                {editState.itemId === item.id && editState.itemType === 'folder' ? (
                  <EditInput
                    $hasError={!!editState.error}
                    value={editState.name}
                    onChange={(e) => setEditState(prev => ({ ...prev, name: e.target.value, error: null }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleEditSubmit();
                      if (e.key === 'Escape') handleEditCancel();
                    }}
                    onBlur={handleEditSubmit}
                    autoFocus
                  />
                ) : (
                  <ItemName>{item.name}</ItemName>
                )}
              </>
            ) : (
              <>
                <TestCaseIcon>📄</TestCaseIcon>
                {editState.itemId === item.id && editState.itemType === 'testcase' ? (
                  <EditInput
                    $hasError={!!editState.error}
                    value={editState.name}
                    onChange={(e) => setEditState(prev => ({ ...prev, name: e.target.value, error: null }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleEditSubmit();
                      if (e.key === 'Escape') handleEditCancel();
                    }}
                    onBlur={handleEditSubmit}
                    autoFocus
                  />
                ) : (
                  <ItemName>{item.name}</ItemName>
                )}
              </>
            )}
          </TreeItem>
        ))}
        
        {editState.error && (
          <ErrorMessage>{editState.error}</ErrorMessage>
        )}
      </TreeContainer>
      
      {contextMenu.isVisible && (
        <ContextMenu $x={contextMenu.x} $y={contextMenu.y}>
          <ContextMenuItem onClick={() => handleContextMenuAction('rename')}>
            이름 변경
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleContextMenuAction('duplicate')}>
            복제
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleContextMenuAction('delete')}>
            삭제
          </ContextMenuItem>
        </ContextMenu>
      )}
    </Container>
  );
};

export default QaseFolderManager; 