export interface TestCase {
    id: number;
    title: string;
    prereq?: string;
    steps: string[];
    expected: string;
    priority: 'High' | 'Medium' | 'Low';
    tags: string[];
    status: 'Active' | 'Archived';
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TestCaseVersion {
    id: number;
    testcaseId: number;
    version: number;
    data: Omit<TestCase, 'id' | 'createdAt' | 'updatedAt'>;
    createdAt: Date;
    createdBy: string;
} 