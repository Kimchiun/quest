export interface Folder {
    id: number;
    projectId: number;
    parentId?: number;
    name: string;
    description?: string;
    orderIndex: number;
    depth: number;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    isLocked?: boolean;
    isArchived?: boolean;
}

export interface FolderTree extends Folder {
    children?: FolderTree[];
    testCaseCount?: number;
}

export interface FolderCreateRequest {
    name: string;
    parentId?: number;
    projectId: number;
    description?: string;
    orderIndex?: number;
}

export interface FolderUpdateRequest {
    name?: string;
    parentId?: number;
    description?: string;
    orderIndex?: number;
    isExpanded?: boolean;
}

export interface FolderMoveRequest {
    targetParentId?: number;
    dropType?: 'into' | 'before' | 'after';
    relativeToId?: number;
    orderIndex?: number;
    updatedBy?: string;
}

export interface FolderBatchMoveRequest {
    items: Array<{
        id: string;
        targetParentId?: number;
        dropType: 'into' | 'before' | 'after';
        relativeToId?: number;
        orderIndex?: number;
    }>;
    idempotencyKey?: string;
    clientVersion?: string;
}

export interface FolderBatchMoveResponse {
    success: Array<{ id: string; folder: any }>;
    failed: Array<{ id: string; error: string; reason: string }>;
    totalProcessed: number;
    successCount: number;
    failureCount: number;
}

export interface FolderPermission {
    id: number;
    scope: 'project' | 'folder';
    principalId: string;
    role: 'VIEW' | 'EDIT' | 'ADMIN';
    folderId?: number;
    projectId?: number;
    createdAt: Date;
    createdBy: string;
} 