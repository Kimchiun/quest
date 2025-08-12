// 릴리즈 메인 엔티티
export interface Release {
  id: string;
  projectId: string;
  name: string;
  version: string;
  description: string;
  status: 'Draft' | 'Active' | 'Complete' | 'Archived';
  startAt: string;
  endAt: string;
  owners: string[];
  watchers: string[];
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  settings: {
    gateCriteria: {
      minPassRate: number;
      maxFailCritical: number;
      zeroBlockers: boolean;
      coverageByPriority: {
        P0: number;
        P1: number;
        P2: number;
      };
    };
    autoSyncScope: boolean;
    allowReopen: boolean;
  };
}

// 릴리즈 스코프 엔티티
export interface ReleaseScope {
  id: string;
  releaseId: string;
  mode: 'live' | 'snapshot';
  selectors: {
    folders: string[];
    tags: string[];
    searchQuery: string;
  };
  includedTestCases: string[]; // 테스트 케이스 ID 배열
  excludedTestCases: string[]; // 제외할 테스트 케이스 ID 배열
  createdAt: string;
  updatedAt: string;
}

// 릴리즈 케이스 엔티티
export interface ReleaseCase {
  id: string;
  releaseId: string;
  testCaseId: string;
  status: 'Not Run' | 'In Progress' | 'Blocked' | 'Failed' | 'Passed' | 'Skipped';
  assignee?: string;
  estimatedTime?: number; // 분 단위
  actualTime?: number; // 분 단위
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  environment?: string;
  notes?: string;
  lastRunAt?: string;
  lastRunBy?: string;
  createdAt: string;
  updatedAt: string;
}

// 실행 결과 엔티티
export interface Run {
  id: string;
  releaseId: string;
  testCaseId: string;
  status: 'Passed' | 'Failed' | 'Blocked' | 'Skipped';
  executedBy: string;
  executedAt: string;
  duration: number; // 분 단위
  environment: string;
  browser?: string;
  device?: string;
  notes?: string;
  attachments: string[]; // 첨부파일 URL 배열
  defects: string[]; // 연결된 결함 ID 배열
  steps: {
    stepNumber: number;
    description: string;
    expectedResult: string;
    actualResult: string;
    status: 'Passed' | 'Failed' | 'Blocked';
    notes?: string;
    screenshots?: string[];
  }[];
}

// 결함 링크 엔티티
export interface DefectLink {
  id: string;
  releaseId: string;
  defectId: string;
  defectKey: string; // JIRA 등 외부 시스템의 키
  defectUrl?: string;
  severity: 'Blocker' | 'Critical' | 'Major' | 'Minor' | 'Trivial';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed' | 'Reopened';
  assignee?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 환경 엔티티
export interface Environment {
  id: string;
  releaseId: string;
  name: string;
  type: 'Browser' | 'Mobile' | 'Desktop' | 'API' | 'Database';
  details: {
    browser?: string;
    version?: string;
    os?: string;
    device?: string;
    resolution?: string;
    url?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 릴리즈 통계 엔티티
export interface ReleaseStatistics {
  releaseId: string;
  totalCases: number;
  passedCases: number;
  failedCases: number;
  blockedCases: number;
  notRunCases: number;
  skippedCases: number;
  passRate: number; // 백분율
  progress: number; // 백분율
  totalEstimatedTime: number; // 분 단위
  totalActualTime: number; // 분 단위
  averageExecutionTime: number; // 분 단위
  defectsCount: number;
  criticalDefectsCount: number;
  blockerDefectsCount: number;
  lastUpdated: string;
}

// 릴리즈 마일스톤 엔티티
export interface ReleaseMilestone {
  id: string;
  releaseId: string;
  name: string;
  description?: string;
  targetDate: string;
  actualDate?: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delayed';
  type: 'Planning' | 'Development' | 'Testing' | 'Deployment' | 'Release';
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}

// 릴리즈 사인오프 엔티티
export interface ReleaseSignoff {
  id: string;
  releaseId: string;
  signerId: string;
  signerName: string;
  role: 'QA Lead' | 'Product Manager' | 'Tech Lead' | 'DevOps' | 'Stakeholder';
  status: 'Pending' | 'Approved' | 'Rejected';
  comments?: string;
  signedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 릴리즈 변경 로그 엔티티
export interface ReleaseChangeLog {
  id: string;
  releaseId: string;
  changeType: 'Created' | 'Updated' | 'Status Changed' | 'Scope Changed' | 'Settings Changed';
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  changedBy: string;
  changedAt: string;
  description: string;
}

// 릴리즈 알림 엔티티
export interface ReleaseNotification {
  id: string;
  releaseId: string;
  type: 'Status Change' | 'Milestone Reached' | 'Gate Failed' | 'Defect Found' | 'Signoff Required';
  title: string;
  message: string;
  recipients: string[];
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}
