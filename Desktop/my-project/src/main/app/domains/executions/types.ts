export interface Execution {
    id: number;
    testcaseId: number;
    suiteId?: number;
    releaseId?: number;
    status: 'Pass' | 'Fail' | 'Blocked' | 'Untested';
    executedBy: string;
    executedAt: Date;
    reproSteps?: string;
    screenshotPath?: string;
    logFilePath?: string;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
} 