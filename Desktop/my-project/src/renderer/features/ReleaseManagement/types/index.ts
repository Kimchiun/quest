export interface Release {
  id: string;
  name: string;
  version: string;
  description?: string;
  status: ReleaseStatus;
  assignee_id?: string;
  assignee_name?: string;
  scheduled_date?: string;
  deployed_date?: string;
  created_at: string;
  updated_at: string;
  
  // 테스트 관련 통계
  test_case_count: number;
  passed_count: number;
  failed_count: number;
  blocked_count: number;
  
  // 이슈 관련 통계
  issue_count: number;
  bug_count: number;
  resolved_count: number;
  
  // 진행률
  progress_percentage: number;
}

export enum ReleaseStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS', 
  TESTING = 'TESTING',
  READY = 'READY',
  DEPLOYED = 'DEPLOYED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface ReleaseTestCase {
  id: string;
  release_id: string;
  test_case_id: string;
  test_case_name: string;
  status: TestCaseStatus;
  assignee_id?: string;
  assignee_name?: string;
  executed_at?: string;
  created_at: string;
  updated_at: string;
}

export enum TestCaseStatus {
  NOT_EXECUTED = 'NOT_EXECUTED',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  BLOCKED = 'BLOCKED',
  SKIPPED = 'SKIPPED'
}

export interface ReleaseIssue {
  id: string;
  release_id: string;
  title: string;
  description?: string;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  assignee_id?: string;
  assignee_name?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export enum IssueType {
  BUG = 'BUG',
  FEATURE = 'FEATURE',
  IMPROVEMENT = 'IMPROVEMENT',
  TASK = 'TASK'
}

export enum IssueStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum IssuePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ReleaseChangeLog {
  id: string;
  release_id: string;
  title: string;
  description?: string;
  type: ChangeLogType;
  author: string;
  commit_hash?: string;
  created_at: string;
}

export enum ChangeLogType {
  FEATURE = 'FEATURE',
  BUGFIX = 'BUGFIX',
  IMPROVEMENT = 'IMPROVEMENT',
  BREAKING_CHANGE = 'BREAKING_CHANGE'
}

export interface ReleaseRetrospective {
  id: string;
  release_id: string;
  author_id: string;
  author_name: string;
  content: string;
  type: RetrospectiveType;
  created_at: string;
  updated_at: string;
}

export enum RetrospectiveType {
  WHAT_WENT_WELL = 'WHAT_WENT_WELL',
  WHAT_COULD_BE_IMPROVED = 'WHAT_COULD_BE_IMPROVED',
  ACTION_ITEMS = 'ACTION_ITEMS'
}

export interface ReleaseStats {
  total: number;
  planning: number;
  in_progress: number;
  testing: number;
  ready: number;
  deployed: number;
  completed: number;
}