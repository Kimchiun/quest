export interface Folder {
    id: number;
    name: string;
    description?: string;
    parentId?: number;
    sortOrder?: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateFolderRequest {
    name: string;
    description?: string;
    parentId?: number;
    sortOrder?: number;
    createdBy?: string;
}

export interface UpdateFolderRequest {
    name?: string;
    description?: string;
    parentId?: number;
    sortOrder?: number;
    updatedBy?: string;
}

export interface MoveFolderRequest {
    targetParentId?: number;
    updatedBy?: string;
}

export interface FolderTree {
    id: number;
    name: string;
    description?: string;
    parentId?: number;
    sortOrder?: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    children?: FolderTree[];
    testcaseCount?: number;
    isExpanded?: boolean;
    isReadOnly?: boolean;
    permissions?: any;
} 