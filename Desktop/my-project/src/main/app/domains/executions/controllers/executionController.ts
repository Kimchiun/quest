import { Router, Request, Response } from 'express';
import { executionService } from '../services/executionService';

const router = Router();

// 실행 기록 생성
router.post('/', async (req: Request, res: Response) => {
    try {
        const execution = await executionService.createExecution(req.body);
        res.status(201).json(execution);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// 실행 기록 단건 조회
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const execution = await executionService.getExecutionById(Number(req.params.id));
        if (!execution) return res.status(404).json({ error: 'Not found' });
        res.json(execution);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// 특정 테스트케이스의 실행 기록 전체 조회
router.get('/testcase/:testcaseId', async (req: Request, res: Response) => {
    try {
        const executions = await executionService.getExecutionsByTestCase(Number(req.params.testcaseId));
        res.json(executions);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// 실행 기록 수정
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const updated = await executionService.updateExecution(Number(req.params.id), req.body);
        if (!updated) return res.status(404).json({ error: 'Not found' });
        res.json(updated);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// 실행 기록 삭제
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        await executionService.deleteExecution(Number(req.params.id));
        res.status(204).send();
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router; 