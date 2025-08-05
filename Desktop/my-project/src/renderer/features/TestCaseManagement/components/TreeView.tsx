import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { TreeNode, DragState, DropZone } from '../../../../main/app/domains/tree/models/TreeNode';

// =====================================================
// 스타일 컴포넌트
// =====================================================

const TreeContainer = styled.div`
  width: 100%;
  max-width: 280px;
  min-width: 220px;
  height: 100%;
  overflow-y: auto;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const TreeRoot = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const TreeSub = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const TreeNodeItem = styled.li<{
  isFolder: boolean;
  isSelected: boolean;
  isDragging: boolean;
  depth: number;
  dropZone: DropZone | null;
}>`
  display: flex;
  align-items: center;
  height: 28px;
  user-select: none;
  position: relative;
  border-radius: 6px;
  padding-left: ${props => props.depth * 18 + 8}px;
  font-weight: ${props => props.isFolder ? '500' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  background-color: ${props => {
    if (props.isDragging) return 'rgba(59, 130, 246, 0.1)';
    if (props.isSelected) return '#DBEAFE';
    if (props.dropZone === 'middle') return '#DBEAFE';
    return 'transparent';
  }};
  
  border-left: ${props => props.isSelected ? '2px solid #3B82F6' : 'none'};
  
  &:hover:not(.dragging) {
    background-color: #F1F5F9;
  }
  
  &.dragging {
    opacity: 0.5;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
  
  .expand-icon {
    width: 18px;
    display: flex;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
    margin-right: 2px;
    color: #6B7280;
    transition: transform 0.15s ease-in-out;
    
    &.expanded {
      transform: rotate(90deg);
    }
  }
  
  .icon {
    margin: 0 5px 0 0;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .node-title {
    flex: 1 1 auto;
    font-size: 14px;
    color: #374151;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .badge {
    min-width: 22px;
    height: 18px;
    background: #E5E7EB;
    color: #374151;
    font-size: 12px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
    padding: 0 8px;
  }
  
  .drop-indicator {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: #3B82F6;
    z-index: 2;
    pointer-events: none;
    
    &.top {
      top: 0;
    }
    
    &.bottom {
      bottom: 0;
    }
  }
  
  .drop-zone {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(59, 130, 246, 0.1);
    border: 2px solid #3B82F6;
    border-radius: 6px;
    z-index: 1;
    pointer-events: none;
  }
`;

// 알림 메시지 컴포넌트
const Notification = styled.div<{ type: 'success' | 'error' }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 16px;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  
  background-color: ${props => props.type === 'success' ? '#10B981' : '#EF4444'};
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

// =====================================================
// 트리 노드 아이템 컴포넌트
// =====================================================

interface TreeNodeItemProps {
  node: TreeNode;
  depth?: number;
  isSelected: boolean;
  onSelect: (node: TreeNode) => void;
  onExpand: (nodeId: number, expanded: boolean) => void;
  expandedNodes: Set<number>;
  dragState: DragState;
  onDragStart: (node: TreeNode, e: React.MouseEvent) => void;
  onDragOver: (node: TreeNode, dropZone: DropZone, e: React.MouseEvent) => void;
  onDrop: (draggedNode: TreeNode, targetNode: TreeNode, dropZone: DropZone) => void;
}

const TreeNodeItemComponent: React.FC<TreeNodeItemProps> = ({
  node,
  depth = 0,
  isSelected,
  onSelect,
  onExpand,
  expandedNodes,
  dragState,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  const isFolder = node.type === 'folder';
  const isExpanded = expandedNodes.has(node.id);
  const isDragging = dragState.isDragging && dragState.draggedNode?.id === node.id;
  const isDropTarget = dragState.dropTarget?.id === node.id;
  const dropZone = isDropTarget ? dragState.dropZone : null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node);
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExpand(node.id, !isExpanded);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // 좌클릭만 처리
    
    let startX = e.clientX;
    let startY = e.clientY;
    let hasMoved = false;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = Math.abs(moveEvent.clientX - startX);
      const deltaY = Math.abs(moveEvent.clientY - startY);
      
      if (deltaX > 5 || deltaY > 5) {
        hasMoved = true;
        onDragStart(node, e as any);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseOver = (e: React.MouseEvent) => {
    if (!dragState.isDragging || !dragState.draggedNode) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const height = rect.height;
    
    let dropZone: DropZone = 'invalid';
    
    if (relativeY < height * 0.2) {
      dropZone = 'top';
    } else if (relativeY > height * 0.8) {
      dropZone = 'bottom';
    } else {
      dropZone = 'middle';
    }

    onDragOver(node, dropZone, e);
  };

  const handleMouseLeave = () => {
    if (dragState.isDragging) {
      onDragOver(node, 'invalid', {} as any);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragState.isDragging && dragState.draggedNode && dragState.dropTarget && dragState.dropZone) {
      onDrop(dragState.draggedNode, dragState.dropTarget, dragState.dropZone);
    }
  };

  return (
    <TreeNodeItem
      isFolder={isFolder}
      isSelected={isSelected}
      isDragging={isDragging}
      depth={depth}
      dropZone={dropZone}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={isDragging ? 'dragging' : ''}
    >
      {isFolder && (
        <span
          className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
          onClick={handleExpandClick}
        >
          {isExpanded ? '▼' : '▶'}
        </span>
      )}
      
      <span className="icon">
        {isFolder ? '📁' : '📄'}
      </span>
      
      <span className="node-title" title={node.name}>
        {node.name}
      </span>
      
      {isFolder && node.testcaseCount !== undefined && node.testcaseCount > 0 && (
        <span className="badge">
          {node.testcaseCount}
        </span>
      )}
      
      {dropZone === 'top' && <div className="drop-indicator top" />}
      {dropZone === 'bottom' && <div className="drop-indicator bottom" />}
      {dropZone === 'middle' && <div className="drop-zone" />}
      
      {isFolder && isExpanded && node.children && node.children.length > 0 && (
        <TreeSub>
          {node.children.map(child => (
            <TreeNodeItemComponent
              key={child.id}
              node={child}
              depth={depth + 1}
              isSelected={isSelected}
              onSelect={onSelect}
              onExpand={onExpand}
              expandedNodes={expandedNodes}
              dragState={dragState}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
            />
          ))}
        </TreeSub>
      )}
    </TreeNodeItem>
  );
};

// =====================================================
// 메인 트리 컴포넌트
// =====================================================

interface TreeViewProps {
  onNodeSelect: (node: TreeNode) => void;
  selectedNodeId?: number;
}

const TreeView: React.FC<TreeViewProps> = ({ onNodeSelect, selectedNodeId }) => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedNode: null,
    dropTarget: null,
    dropZone: null
  });
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // 트리 데이터 로드
  const loadTreeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3000/api/tree/structure');
      if (!response.ok) {
        throw new Error('트리 구조를 불러오는데 실패했습니다.');
      }
      
      const data = await response.json();
      setTreeData(data);
      
      // 기본적으로 루트 노드들 확장
      const initialExpanded = new Set<number>();
      data.forEach((node: TreeNode) => {
        if (node.type === 'folder') {
          initialExpanded.add(node.id);
        }
      });
      setExpandedNodes(initialExpanded);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTreeData();
  }, [loadTreeData]);

  // 알림 메시지 표시
  const showNotification = useCallback((message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), type === 'success' ? 3000 : 5000);
  }, []);

  // 노드 선택
  const handleNodeSelect = useCallback((node: TreeNode) => {
    onNodeSelect(node);
  }, [onNodeSelect]);

  // 노드 확장/축소
  const handleNodeExpand = useCallback((nodeId: number, expanded: boolean) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (expanded) {
        newSet.add(nodeId);
      } else {
        newSet.delete(nodeId);
      }
      return newSet;
    });
  }, []);

  // 드래그 시작
  const handleDragStart = useCallback((node: TreeNode, e: React.MouseEvent) => {
    setDragState({
      isDragging: true,
      draggedNode: node,
      dropTarget: null,
      dropZone: null
    });
  }, []);

  // 드래그 오버
  const handleDragOver = useCallback((node: TreeNode, dropZone: DropZone, e: React.MouseEvent) => {
    setDragState(prev => ({
      ...prev,
      dropTarget: node,
      dropZone
    }));
  }, []);

  // 드롭 처리
  const handleDrop = useCallback(async (draggedNode: TreeNode, targetNode: TreeNode, dropZone: DropZone) => {
    if (!dragState.isDragging || !dragState.draggedNode) return;

    try {
      // 드롭 영역 유효성 검사
      const validationResponse = await fetch('http://localhost:3000/api/tree/validate-drop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          draggedNodeId: draggedNode.id,
          targetNodeId: targetNode.id,
          dropZone
        }),
      });

      if (!validationResponse.ok) {
        const errorData = await validationResponse.json();
        throw new Error(errorData.message || '드롭 영역 유효성 검사에 실패했습니다.');
      }

      const validation = await validationResponse.json();
      
      if (!validation.isValid) {
        showNotification(validation.message, 'error');
        return;
      }

      // 드래그 앤 드롭 실행
      const response = await fetch('http://localhost:3000/api/tree/dragdrop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          draggedNodeId: draggedNode.id,
          targetNodeId: targetNode.id,
          dropType: validation.dropType,
          position: validation.position
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '드래그 앤 드롭에 실패했습니다.');
      }

      const result = await response.json();
      
      if (result.success) {
        showNotification(result.message, 'success');
        await loadTreeData(); // 트리 새로고침
      } else {
        showNotification(result.message, 'error');
      }
    } catch (error) {
      console.error('드롭 처리 실패:', error);
      showNotification(error instanceof Error ? error.message : '드롭 처리에 실패했습니다.', 'error');
    } finally {
      // 드래그 상태 초기화
      setDragState({
        isDragging: false,
        draggedNode: null,
        dropTarget: null,
        dropZone: null
      });
    }
  }, [dragState.isDragging, dragState.draggedNode, loadTreeData, showNotification]);

  // 드래그 종료 처리
  useEffect(() => {
    const handleMouseUp = () => {
      if (dragState.isDragging) {
        setDragState({
          isDragging: false,
          draggedNode: null,
          dropTarget: null,
          dropZone: null
        });
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [dragState.isDragging]);

  if (loading) {
    return (
      <TreeContainer>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          로딩 중...
        </div>
      </TreeContainer>
    );
  }

  if (error) {
    return (
      <TreeContainer>
        <div style={{ padding: '20px', textAlign: 'center', color: '#ef4444' }}>
          {error}
        </div>
      </TreeContainer>
    );
  }

  return (
    <>
      <TreeContainer>
        <TreeRoot>
          {treeData.map(node => (
            <TreeNodeItemComponent
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
              onSelect={handleNodeSelect}
              onExpand={handleNodeExpand}
              expandedNodes={expandedNodes}
              dragState={dragState}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </TreeRoot>
      </TreeContainer>
      
      {notification && (
        <Notification type={notification.type}>
          {notification.message}
        </Notification>
      )}
    </>
  );
};

export default TreeView; 