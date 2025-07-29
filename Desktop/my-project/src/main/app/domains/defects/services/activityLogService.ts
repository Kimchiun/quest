import { ActivityLog } from '../models/Defect';

export interface ActivityLogParams {
    page: number;
    size: number;
    dateRange?: string;
    activityType?: string;
    user?: string;
}

export const getDefectActivityLogs = async (
    defectId: number, 
    params: ActivityLogParams
): Promise<{
    logs: ActivityLog[];
    total: number;
    page: number;
    size: number;
}> => {
    // 실제 구현에서는 데이터베이스에서 조회
    // 현재는 목업 데이터 반환
    const mockLogs: ActivityLog[] = [
        {
            id: 1,
            defectId,
            action: '결함 생성',
            user: 'tester1',
            date: new Date(Date.now() - 86400000), // 1일 전
            details: '새로운 결함이 생성되었습니다.',
            type: 'create'
        },
        {
            id: 2,
            defectId,
            action: '상태 변경',
            user: 'developer1',
            date: new Date(Date.now() - 43200000), // 12시간 전
            details: '상태가 OPEN에서 IN_PROGRESS로 변경되었습니다.',
            type: 'status_change'
        },
        {
            id: 3,
            defectId,
            action: '코멘트 추가',
            user: 'tester1',
            date: new Date(Date.now() - 21600000), // 6시간 전
            details: '추가 테스트 결과를 확인했습니다.',
            type: 'comment'
        },
        {
            id: 4,
            defectId,
            action: '상태 변경',
            user: 'developer1',
            date: new Date(Date.now() - 3600000), // 1시간 전
            details: '상태가 IN_PROGRESS에서 RESOLVED로 변경되었습니다.',
            type: 'status_change'
        }
    ];

    // 필터링 로직 (실제로는 데이터베이스 쿼리에서 처리)
    let filteredLogs = mockLogs;

    if (params.activityType) {
        filteredLogs = filteredLogs.filter(log => log.type === params.activityType);
    }

    if (params.user) {
        filteredLogs = filteredLogs.filter(log => log.user === params.user);
    }

    if (params.dateRange) {
        const now = new Date();
        let startDate: Date;

        switch (params.dateRange) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                break;
            default:
                startDate = new Date(0); // 모든 날짜
        }

        filteredLogs = filteredLogs.filter(log => log.date >= startDate);
    }

    // 페이지네이션
    const startIndex = params.page * params.size;
    const endIndex = startIndex + params.size;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    return {
        logs: paginatedLogs,
        total: filteredLogs.length,
        page: params.page,
        size: params.size
    };
}; 