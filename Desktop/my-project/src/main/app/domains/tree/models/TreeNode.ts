export type TreeNode = {
  id: number;
  name: string;
  type: 'folder' | 'testcase';
  parentId: number | null;
  sortOrder: number;
  testcaseCount?: number; // 폴더일 때만
  children?: TreeNode[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
};

export interface CreateTreeNodeRequest {
  name: string;
  type: 'folder' | 'testcase';
  parentId: number | null;
  createdBy: string;
}

export interface UpdateTreeNodeRequest {
  name?: string;
  parentId?: number | null;
  sortOrder?: number;
}

export interface DragDropRequest {
  draggedNodeId: number;
  targetNodeId: number;
  dropType: 'reorder' | 'hierarchy';
  position: 'before' | 'after' | null;
}

export interface DragDropResult {
  success: boolean;
  message: string;
  data?: {
    movedNode: TreeNode;
    newPosition: {
      parentId: number | null;
      sortOrder: number;
    };
  };
}

export interface TreeSearchRequest {
  query?: string;
  type?: 'folder' | 'testcase';
  parentId?: number;
  limit?: number;
  offset?: number;
}

export interface TreeSearchResult {
  nodes: TreeNode[];
  total: number;
}

// 드래그 앤 드롭 관련 타입
export type DropType = 'reorder' | 'hierarchy';
export type DropPosition = 'before' | 'after' | null;

// 드롭 영역 타입
export type DropZone = 'top' | 'middle' | 'bottom' | 'invalid';

// 드래그 상태
export interface DragState {
  isDragging: boolean;
  draggedNode: TreeNode | null;
  dropTarget: TreeNode | null;
  dropZone: DropZone | null;
} 