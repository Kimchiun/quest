export interface TreeNode {
    id: number;
    name: string;
    type: 'folder' | 'testcase';
    parentId?: number;
    children?: TreeNode[];
    sortOrder?: number;
    createdBy?: string;
    testcaseCount?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTreeNodeRequest {
    name: string;
    type: 'folder' | 'testcase';
    parentId?: number;
    sortOrder?: number;
    createdBy?: string;
}

export interface UpdateTreeNodeRequest {
    name?: string;
    parentId?: number;
    sortOrder?: number;
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
    hasMore: boolean;
}

export interface DragDropRequest {
    sourceId: number;
    targetId: number;
    position: 'before' | 'after' | 'inside';
    draggedNodeId?: number;
}

export interface DragDropResult {
    success: boolean;
    message: string;
    movedNode?: TreeNode;
    oldPosition?: { parentId: number | null; sortOrder: number };
    newPosition?: { parentId: number | null; sortOrder: number };
} 