import { Router, Request, Response } from 'express';
import { executionService } from '../services/executionService';

/**
 * @swagger
 * components:
 *   schemas:
 *     Execution:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 실행 기록 ID
 *         testCaseId:
 *           type: integer
 *           description: 테스트케이스 ID
 *         status:
 *           type: string
 *           enum: [Pass, Fail, Blocked, Skip, Not Executed]
 *           description: 실행 상태
 *         executedBy:
 *           type: string
 *           description: 실행자
 *         executedAt:
 *           type: string
 *           format: date-time
 *           description: 실행 시간
 *         comment:
 *           type: string
 *           description: 실행 코멘트
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 생성일
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 수정일
 */

const router = Router();

// 테스트 엔드포인트
router.get('/test', (req: Request, res: Response) => {
    console.log('=== Execution test endpoint called ===');
    res.json({ message: 'Execution controller is working' });
});

/**
 * @swagger
 * /api/executions:
 *   post:
 *     summary: 실행 기록 생성
 *     description: 새로운 테스트 실행 기록을 생성합니다.
 *     tags: [Executions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - testCaseId
 *               - status
 *             properties:
 *               testCaseId:
 *                 type: integer
 *                 description: 테스트케이스 ID
 *               status:
 *                 type: string
 *                 enum: [Pass, Fail, Blocked, Skip, Not Executed]
 *                 description: 실행 상태
 *               executedBy:
 *                 type: string
 *                 description: 실행자
 *               comment:
 *                 type: string
 *                 description: 실행 코멘트
 *     responses:
 *       201:
 *         description: 실행 기록 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Execution'
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
// 실행 기록 생성
router.post('/', async (req: Request, res: Response) => {
    console.log('=== ExecutionController POST / called ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    try {
        console.log('Calling executionService.createExecution...');
        const execution = await executionService.createExecution(req.body);
        console.log('ExecutionService returned:', execution);
        res.status(201).json(execution);
    } catch (err: any) {
        console.error('ExecutionController error:', err);
        console.error('Error stack:', err.stack);
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/executions/{id}:
 *   get:
 *     summary: 실행 기록 단건 조회
 *     description: ID로 특정 실행 기록을 조회합니다.
 *     tags: [Executions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 실행 기록 ID
 *     responses:
 *       200:
 *         description: 실행 기록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Execution'
 *       404:
 *         description: 실행 기록을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
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

/**
 * @swagger
 * /api/executions/testcase/{testcaseId}:
 *   get:
 *     summary: 테스트케이스별 실행 기록 조회
 *     description: 특정 테스트케이스의 모든 실행 기록을 조회합니다.
 *     tags: [Executions]
 *     parameters:
 *       - in: path
 *         name: testcaseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 테스트케이스 ID
 *     responses:
 *       200:
 *         description: 테스트케이스 실행 기록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Execution'
 *       500:
 *         description: 서버 오류
 */
// 특정 테스트케이스의 실행 기록 전체 조회
router.get('/testcase/:testcaseId', async (req: Request, res: Response) => {
    try {
        const executions = await executionService.getExecutionsByTestCase(Number(req.params.testcaseId));
        res.json(executions);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/executions/{id}:
 *   put:
 *     summary: 실행 기록 수정
 *     description: 특정 실행 기록을 수정합니다.
 *     tags: [Executions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 실행 기록 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pass, Fail, Blocked, Skip, Not Executed]
 *                 description: 실행 상태
 *               executedBy:
 *                 type: string
 *                 description: 실행자
 *               comment:
 *                 type: string
 *                 description: 실행 코멘트
 *     responses:
 *       200:
 *         description: 실행 기록 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Execution'
 *       404:
 *         description: 실행 기록을 찾을 수 없음
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
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

/**
 * @swagger
 * /api/executions/{id}:
 *   delete:
 *     summary: 실행 기록 삭제
 *     description: 특정 실행 기록을 삭제합니다.
 *     tags: [Executions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 실행 기록 ID
 *     responses:
 *       204:
 *         description: 실행 기록 삭제 성공
 *       500:
 *         description: 서버 오류
 */
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