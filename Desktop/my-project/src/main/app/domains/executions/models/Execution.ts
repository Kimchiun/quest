export interface Execution {
    id: number;
    testcaseId: number;
    releaseId: number; // 소속 릴리즈(필수)
    status: 'Pass' | 'Fail' | 'Blocked' | 'Untested';
    executedBy: string; // 실행자(사용자 id)
    executedAt: Date;
    comment?: string; // 기타 메모
    createdAt: Date;
    updatedAt: Date;
} 