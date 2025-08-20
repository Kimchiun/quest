export interface TestCase {
    id: number;
    title: string;
    prereq?: string;
    steps: string[];
    expected?: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Active' | 'Inactive' | 'Deprecated';
    folderId?: number;
    tags?: string[];
    sortOrder?: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TestCaseVersion {
    id: number;
    testcaseId: number;
    version: number;
    data: Omit<TestCase, 'id' | 'createdAt' | 'updatedAt'>;
    createdBy: string;
    createdAt: Date;
} 