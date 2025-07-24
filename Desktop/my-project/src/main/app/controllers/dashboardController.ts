import { Router, Request, Response } from 'express';
import pgClient from '../../../main/app/infrastructure/database/pgClient';
import { calcDefectDensity, calcProgressRate, aggregateWorkload } from '../../../main/app/utils/dashboardStats';

const router = Router();

// GET /api/dashboard/stats
router.get('/stats', async (req: Request, res: Response) => {
    try {
        // 전체 테스트 케이스 수
        const { rows: caseRows } = await pgClient.query('SELECT COUNT(*) FROM testcases');
        const totalCases = Number(caseRows[0].count);
        // 실행 상태별 집계
        const { rows: execRows } = await pgClient.query(`
            SELECT status, COUNT(*) FROM executions GROUP BY status
        `);
        const statusCounts: Record<string, number> = {};
        execRows.forEach(r => { statusCounts[r.status] = Number(r.count); });
        // 결함(이슈) 수 (comment에 [Jira: 또는 [Redmine: 포함된 실행)
        const { rows: defectRows } = await pgClient.query(`
            SELECT COUNT(*) FROM executions WHERE comment LIKE '%[Jira:%' OR comment LIKE '%[Redmine:%'
        `);
        const defectCount = Number(defectRows[0].count);
        // 사용자별 작업량
        const { rows: workloadRows } = await pgClient.query(`
            SELECT executed_by FROM executions
        `);
        const workload = aggregateWorkload(workloadRows);
        // 결함 밀도 = 결함수 / 전체 케이스수
        const defectDensity = calcDefectDensity(defectCount, totalCases);
        // 진행률 = 완료(Pass) / 전체 케이스수
        const progressRate = calcProgressRate(statusCounts['Pass'] || 0, totalCases);
        res.json({
            totalCases,
            statusCounts,
            defectCount,
            defectDensity,
            progressRate,
            workload,
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router; 