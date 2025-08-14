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
  id: string; // UUID/ShortKey (TC-123 형식)
  projectId: string;
  folderId: string;
  title: string; // 1~200자
  status: 'Draft' | 'In Review' | 'Ready' | 'Deprecated';
  type: 'Manual' | 'Automated';
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  ownerId?: string;
  estimate?: number; // 예상 소요 시간 (분)
  automationId?: string; // 코드/테스트런너 식별자
  preconditions?: string;
  steps: TestCaseStep[];
  datasets: TestCaseDataset[];
  attachments: TestCaseAttachment[];
  tags: string[];
  links: TestCaseLink[];
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
  version: number; // 낙관적 잠금용
  history?: TestCaseHistory[];
}

export interface TestCaseStep {
  index: number;
  action: string; // text/MD
  expected: string; // text/MD
  dataBinding?: { key: string };
  attachments?: TestCaseAttachment[];
}

export interface TestCaseDataset {
  id: string;
  name: string;
  values: Record<string, string | number | boolean>;
  description?: string;
}

export interface TestCaseAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document' | 'other';
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface TestCaseLink {
  id: string;
  type: 'requirement' | 'bug' | 'ticket' | 'testcase' | 'checklist';
  url: string;
  title: string;
  description?: string;
}

export interface TestCaseHistory {
  id: string;
  version: number;
  changes: TestCaseChange[];
  createdBy: string;
  createdAt: Date;
  comment?: string;
}

export interface TestCaseChange {
  field: string;
  oldValue: any;
  newValue: any;
}

// TestFolder Types
export interface TestFolder {
  id: number;
  name: string;
  testCaseCount: number;
  children?: TestFolder[];
  projectId?: number;
  parentId?: number | null;
  orderIndex?: number;
  depth?: number;
  createdBy?: string;
  isLocked?: boolean;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 리스트 관련 타입
export interface TestCaseListColumn {
  key: string;
  title: string;
  width: number;
  visible: boolean;
  sortable: boolean;
  resizable: boolean;
  minWidth: number;
  maxWidth: number;
}

export interface TestCaseListFilter {
  status?: string[];
  type?: string[];
  priority?: string[];
  owner?: string[];
  tags?: string[];
  updatedRange?: {
    from: Date;
    to: Date;
  };
  hasAttachments?: boolean;
  hasAutomation?: boolean;
  hasLinkedDefects?: boolean;
}

export interface TestCaseListSort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface TestCaseListState {
  columns: TestCaseListColumn[];
  filters: TestCaseListFilter;
  sort: TestCaseListSort[];
  searchTerm: string;
  selectedIds: string[];
  page: number;
  pageSize: number;
  totalCount: number;
}

// 상세 패널 관련 타입
export interface TestCaseDetailTab {
  id: string;
  title: string;
  icon: string;
  component: React.ComponentType<any>;
}

export interface TestCaseQuickRun {
  id: string;
  testCaseId: string;
  environment: string;
  browser?: string;
  device?: string;
  datasetId?: string;
  screenshotEnabled: boolean;
  videoEnabled: boolean;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  results?: TestCaseRunResult[];
}

export interface TestCaseRunResult {
  stepIndex: number;
  status: 'pass' | 'fail' | 'blocked' | 'skipped';
  comment?: string;
  attachments?: TestCaseAttachment[];
  duration?: number;
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