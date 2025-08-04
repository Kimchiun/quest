// User Types
export type UserRole = 'ADMIN' | 'QA' | 'DEV' | 'PM';

export interface User {
  id: number;
  username: string;
  role: UserRole;
  createdAt: Date;
}

// TestCase Types
export interface TestCase {
  id: number;
  title: string;
  prereq?: string;
  steps: string[];
  expected: string;
  priority: 'High' | 'Medium' | 'Low';
  tags?: string[];
  status: 'Active' | 'Archived';
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
  folderId?: number;
}

// Release Types
export interface Release {
  id: number;
  name: string;
  description?: string;
  version: string;
  status: 'Planning' | 'In Progress' | 'Testing' | 'Released';
  startDate: Date;
  endDate: Date;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

// Suite Types
export interface Suite {
  id: number;
  name: string;
  description?: string;
  releaseId: number;
  executor?: string;
  environment?: string;
  dueDate?: Date;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

// Execution Types
export interface Execution {
  id: number;
  testcaseId: number;
  status: 'Pass' | 'Fail' | 'Blocked' | 'Untested';
  executedBy: number;
  executedAt: Date;
  duration?: number;
  notes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Defect Types
export interface Defect {
  id: number;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo?: number;
  reportedBy: number;
  testcaseId?: number;
  executionId?: number;
  externalId?: string; // Jira/Redmine ID
  createdAt: Date;
  updatedAt: Date;
}

// Comment Types
export interface Comment {
  id: number;
  content: string;
  authorId: number;
  executionId?: number;
  defectId?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Folder Types
export interface Folder {
  id: number;
  name: string;
  parentId?: number;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Search & Filter Types
export interface SearchFilter {
  keyword?: string;
  status?: string[];
  priority?: string[];
  tags?: string[];
  createdBy?: number[];
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface AdvancedSearchFilter {
  folders?: string[];
  tags?: string[];
  status?: ('Active' | 'Archived')[];
  createdBy?: string[];
  priority?: ('High' | 'Medium' | 'Low')[];
  dateRange?: {
    from: string;
    to: string;
  };
  keyword?: string;
}

// Bulk Operation Types
export interface BulkOperation {
  ids: number[];
  operation: 'move' | 'copy' | 'delete' | 'updateStatus';
  targetFolder?: string;
  status?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Network Status
export interface NetworkStatus {
  isOnline: boolean;
  isConnected: boolean;
  lastSync?: Date;
}

// Auth Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresAt: Date;
}

export interface RegisterData {
  username: string;
  password: string;
  role: UserRole;
}

// Dashboard Types
export interface DashboardStats {
  totalTestCases: number;
  totalReleases: number;
  totalDefects: number;
  totalExecutions: number;
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: number;
  action: string;
  entityType: 'TestCase' | 'Release' | 'Execution' | 'Defect';
  entityId: number;
  userId: number;
  timestamp: Date;
  details?: Record<string, any>;
}

// Widget Types
export interface Widget {
  id: string;
  type: 'chart' | 'table' | 'stats' | 'list';
  title: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

// Chart Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
  }[];
}

// Table Types
export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  render?: (value: any, record: any) => React.ReactNode;
}

export interface TableConfig {
  columns: TableColumn[];
  data: any[];
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
  };
  sorting?: {
    key: string;
    order: 'asc' | 'desc';
  };
  filtering?: Record<string, any>;
}

// Tree Node Types
export interface TreeNode {
  id: number;
  name: string;
  type: 'folder' | 'testcase';
  parentId?: number;
  children?: TreeNode[];
  sortOrder?: number;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Drag & Drop Types
export interface DragDropRequest {
  draggedNodeId: number;
  targetNodeId: number;
  dropType: 'before' | 'after' | 'inside';
  position?: number;
}

// Performance Types
export interface PerformanceMetrics {
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  timestamp: Date;
}

// Integration Types
export interface IntegrationConfig {
  type: 'jira' | 'redmine' | 'gitlab' | 'github';
  url: string;
  apiToken: string;
  projectKey?: string;
  enabled: boolean;
}

// Feedback Types
export interface FeedbackData {
  category: 'usability' | 'performance' | 'accessibility' | 'bug';
  rating: number;
  comment: string;
  userAgent: string;
  timestamp: Date;
} 