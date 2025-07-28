export interface Folder {
    id: number;
    name: string;
    description?: string;
    parentId?: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface FolderTree {
    id: number;
    name: string;
    description?: string;
    parentId?: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    children: FolderTree[];
    testCaseCount: number;
}

export interface CreateFolderRequest {
    name: string;
    description?: string;
    parentId?: number;
    createdBy: string;
}

export interface UpdateFolderRequest {
    name?: string;
    description?: string;
    parentId?: number;
    updatedBy: string;
}

export interface MoveFolderRequest {
    targetParentId?: number;
    updatedBy: string;
}

export interface MoveTestCaseRequest {
    targetFolderId: number;
    updatedBy: string;
} 