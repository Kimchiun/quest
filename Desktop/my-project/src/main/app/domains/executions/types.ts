export interface Execution {
    id: number;
    testcaseId: number;
    releaseId: number;
    status: 'Pass' | 'Fail' | 'Blocked' | 'Untested';
    executedBy: string;
    executedAt: Date;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
} 