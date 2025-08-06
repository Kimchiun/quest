import * as treeRepository from '../repositories/treeRepository';
import { TreeNode, CreateTreeNodeRequest, UpdateTreeNodeRequest, DragDropRequest, DragDropResult, TreeSearchRequest, TreeSearchResult } from '../types';

// =====================================================
// 기본 CRUD 서비스
// =====================================================

export async function createTreeNode(request: CreateTreeNodeRequest): Promise<TreeNode> {
  // 순환 참조 검사 (parentId가 있는 경우)
  if (request.parentId !== null && request.parentId !== undefined) {
    const hasCircularReference = await treeRepository.checkCircularReference(0, request.parentId);
    if (hasCircularReference) {
      throw new Error('순환 참조가 감지되었습니다. 노드를 생성할 수 없습니다.');
    }
  }

  return await treeRepository.createTreeNode(request);
}

export async function getTreeNodeById(id: number): Promise<TreeNode | null> {
  return await treeRepository.getTreeNodeById(id);
}

export async function getAllTreeNodes(): Promise<TreeNode[]> {
  return await treeRepository.getAllTreeNodes();
}

export async function getTreeStructure(): Promise<TreeNode[]> {
  return await treeRepository.getTreeStructure();
}

export async function updateTreeNode(id: number, updates: UpdateTreeNodeRequest): Promise<TreeNode | null> {
  const node = await treeRepository.getTreeNodeById(id);
  if (!node) {
    throw new Error('노드를 찾을 수 없습니다.');
  }

  // 순환 참조 검사 (parentId가 변경되는 경우)
  if (updates.parentId !== undefined && updates.parentId !== node.parentId) {
    if (updates.parentId !== null) {
      const hasCircularReference = await treeRepository.checkCircularReference(id, updates.parentId);
      if (hasCircularReference) {
        throw new Error('순환 참조가 감지되었습니다. 노드를 이동할 수 없습니다.');
      }
    }
  }

  return await treeRepository.updateTreeNode(id, updates);
}

export async function deleteTreeNode(id: number): Promise<boolean> {
  const node = await treeRepository.getTreeNodeById(id);
  if (!node) {
    throw new Error('노드를 찾을 수 없습니다.');
  }

  // 루트 노드는 삭제 불가
  if (node.name === '루트' && node.parentId === null) {
    throw new Error('루트 노드는 삭제할 수 없습니다.');
  }

  return await treeRepository.deleteTreeNode(id);
}

// =====================================================
// 검색 서비스
// =====================================================

export async function searchTreeNodes(request: TreeSearchRequest): Promise<TreeSearchResult> {
  return await treeRepository.searchTreeNodes(request);
}

// =====================================================
// 드래그 앤 드롭 서비스
// =====================================================

export async function handleTreeNodeDragDrop(request: DragDropRequest): Promise<DragDropResult> {
  const { sourceId: draggedNodeId, targetId: targetNodeId, position } = request;

  // 드래그한 노드와 대상 노드 조회
  const draggedNode = await treeRepository.getTreeNodeById(draggedNodeId);
  const targetNode = await treeRepository.getTreeNodeById(targetNodeId);

  if (!draggedNode || !targetNode) {
    throw new Error('노드를 찾을 수 없습니다.');
  }

  // 자기 자신에 대한 드롭 방지
  if (draggedNodeId === targetNodeId) {
    throw new Error('자기 자신으로는 이동할 수 없습니다.');
  }

  let movedNode: TreeNode;

  if (position === 'before' || position === 'after') {
    // 순서 변경
    const reorderedNode = await treeRepository.reorderTreeNode(draggedNodeId, targetNodeId, position);
    if (!reorderedNode) {
      throw new Error('노드 순서 변경에 실패했습니다.');
    }
    movedNode = reorderedNode;
  } else {
    // 계층 변경 (inside)
    // 순환 참조 검사
    const hasCircularReference = await treeRepository.checkCircularReference(draggedNodeId, targetNodeId);
    if (hasCircularReference) {
      throw new Error('순환 참조가 감지되었습니다. 노드를 이동할 수 없습니다.');
    }

    const movedTreeNode = await treeRepository.moveTreeNode(draggedNodeId, targetNodeId);
    if (!movedTreeNode) {
      throw new Error('노드 이동에 실패했습니다.');
    }
    movedNode = movedTreeNode;
  }

  // 히스토리 기록
  await treeRepository.recordTreeNodeMove({
    nodeId: draggedNodeId,
    oldParentId: draggedNode.parentId || null,
    newParentId: movedNode.parentId || null,
    oldSortOrder: draggedNode.sortOrder || 0,
    newSortOrder: movedNode.sortOrder || 0,
    movedBy: 'system'
  });

  return {
    success: true,
    message: '노드가 성공적으로 이동되었습니다.',
    movedNode,
    newPosition: {
      parentId: movedNode.parentId || null,
      sortOrder: movedNode.sortOrder || 0
    }
  };
}

// =====================================================
// 유효성 검사 서비스
// =====================================================

export async function validateDropZone(draggedNodeId: number, targetNodeId: number, dropZone: 'top' | 'middle' | 'bottom'): Promise<{
  isValid: boolean;
  message: string;
  dropType: 'reorder' | 'hierarchy' | null;
  position: 'before' | 'after' | null;
}> {
  const draggedNode = await treeRepository.getTreeNodeById(draggedNodeId);
  const targetNode = await treeRepository.getTreeNodeById(targetNodeId);

  if (!draggedNode || !targetNode) {
    return {
      isValid: false,
      message: '노드를 찾을 수 없습니다.',
      dropType: null,
      position: null
    };
  }

  // 자기 자신에 대한 드롭 방지
  if (draggedNodeId === targetNodeId) {
    return {
      isValid: false,
      message: '자기 자신으로는 이동할 수 없습니다.',
      dropType: null,
      position: null
    };
  }

  if (dropZone === 'top' || dropZone === 'bottom') {
    // 순서 변경 (같은 부모 내에서만 가능)
    if (draggedNode.parentId !== targetNode.parentId) {
      return {
        isValid: false,
        message: '같은 부모 노드 내에서만 순서 변경이 가능합니다.',
        dropType: null,
        position: null
      };
    }

    return {
      isValid: true,
      message: '순서 변경이 가능합니다.',
      dropType: 'reorder',
      position: dropZone === 'top' ? 'before' : 'after'
    };
  } else if (dropZone === 'middle') {
    // 계층 변경 (대상이 폴더인 경우만)
    if (targetNode.type !== 'folder') {
      return {
        isValid: false,
        message: '테스트케이스는 하위 노드를 가질 수 없습니다.',
        dropType: null,
        position: null
      };
    }

    // 순환 참조 검사
    const hasCircularReference = await treeRepository.checkCircularReference(draggedNodeId, targetNodeId);
    if (hasCircularReference) {
      return {
        isValid: false,
        message: '순환 참조가 감지되었습니다. 노드를 이동할 수 없습니다.',
        dropType: null,
        position: null
      };
    }

    return {
      isValid: true,
      message: '계층 변경이 가능합니다.',
      dropType: 'hierarchy',
      position: null
    };
  }

  return {
    isValid: false,
    message: '유효하지 않은 드롭 영역입니다.',
    dropType: null,
    position: null
  };
} 