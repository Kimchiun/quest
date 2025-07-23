export interface Suite {
  id: number;
  releaseId: number;
  name: string;
  description?: string;
  executor?: string;
  environment?: string;
  dueDate?: string;
  createdAt: string;
}

export interface SuiteCase {
  suiteId: number;
  testcaseId: number;
} 