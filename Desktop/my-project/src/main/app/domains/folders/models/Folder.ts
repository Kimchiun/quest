export interface Folder {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  sortOrder: number;
  testcaseCount: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isExpanded?: boolean;
  isSelected?: boolean;
  isReadOnly?: boolean;
  permissions?: {
    read: boolean;
    write: boolean;
    delete: boolean;
    manage: boolean;
  };
}

export interface CreateFolderRequest {
  name: string;
  description?: string;
  parentId?: number;
  sortOrder?: number;
  testcaseCount?: number;
  createdBy: string;
  isExpanded?: boolean;
  isReadOnly?: boolean;
  permissions?: {
    read: boolean;
    write: boolean;
    delete: boolean;
    manage: boolean;
  };
}

export interface UpdateFolderRequest {
  name?: string;
  description?: string;
  parentId?: number;
  sortOrder?: number;
  testcaseCount?: number;
  updatedBy: string;
  isExpanded?: boolean;
  isReadOnly?: boolean;
  permissions?: {
    read: boolean;
    write: boolean;
    delete: boolean;
    manage: boolean;
  };
}

export interface MoveFolderRequest {
  targetParentId: number;
  updatedBy: string;
}

export interface FolderTree {
  id: number;
  name: string;
  type: 'folder' | 'testcase';
  parentId?: number;
  children?: FolderTree[];
  sortOrder: number;
  testcaseCount: number;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isExpanded?: boolean;
  isSelected?: boolean;
  isReadOnly?: boolean;
  permissions?: {
    read: boolean;
    write: boolean;
    delete: boolean;
    manage: boolean;
  };
  // 드래그 앤 드롭 관련
  isDragging?: boolean;
  isDropTarget?: boolean;
  dropZone?: 'before' | 'after' | 'inside' | null;
}

export type DropType = 'before' | 'after' | 'inside'; 