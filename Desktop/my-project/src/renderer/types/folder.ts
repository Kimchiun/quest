export interface Folder {
  id: number;
  projectId: number;
  parentId?: number;
  name: string;
  description?: string;
  orderIndex: number;
  depth: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isLocked?: boolean;
  isArchived?: boolean;
}

export interface FolderTree extends Folder {
  children?: FolderTree[];
  testCaseCount?: number;
  isExpanded?: boolean;
  isSelected?: boolean;
  isDragging?: boolean;
  isDropTarget?: boolean;
  dropZone?: 'before' | 'after' | 'inside' | null;
}

export interface FolderCreateRequest {
  projectId: number;
  parentId?: number;
  name: string;
  description?: string;
}

export interface FolderUpdateRequest {
  name?: string;
  description?: string;
  parentId?: number;
}

export interface FolderMoveRequest {
  targetParentId?: number;
  orderIndex: number;
}

export type DropType = 'before' | 'after' | 'inside';
