export interface Execution {
    id: number;
    testcaseId: number;
    suiteId?: number; // 소속 스위트(선택)
    releaseId?: number; // 소속 릴리즈(선택)
    status: 'Pass' | 'Fail' | 'Blocked' | 'Untested';
    executedBy: string; // 실행자(사용자 id)
    executedAt: Date;
    reproSteps?: string; // 실패 시 재현절차
    screenshotPath?: string; // 첨부 스크린샷 파일 경로
    logFilePath?: string; // 첨부 로그파일 경로
    comment?: string; // 기타 메모
    createdAt: Date;
    updatedAt: Date;
} 