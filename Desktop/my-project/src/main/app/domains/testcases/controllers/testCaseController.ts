import { Router } from 'express';
import * as testCaseService from '../services/testCaseService';

/**
 * @swagger
 * components:
 *   schemas:
 *     TestCase:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 테스트케이스 ID
 *         title:
 *           type: string
 *           description: 테스트케이스 제목
 *         description:
 *           type: string
 *           description: 테스트케이스 설명
 *         priority:
 *           type: string
 *           enum: [High, Medium, Low]
 *           description: 우선순위
 *         status:
 *           type: string
 *           enum: [Active, Inactive, Draft]
 *           description: 상태
 *         folderId:
 *           type: integer
 *           description: 폴더 ID
 *         createdBy:
 *           type: string
 *           description: 생성자
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

/**
 * @swagger
 * /api/testcases:
 *   get:
 *     summary: 테스트케이스 목록 조회
 *     description: 페이지네이션, 검색, 필터링을 지원하는 테스트케이스 목록을 조회합니다.
 *     tags: [Test Cases]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 검색어
 *       - in: query
 *         name: folderId
 *         schema:
 *           type: integer
 *         description: 폴더 ID로 필터링
 *     responses:
 *       200:
 *         description: 테스트케이스 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TestCase'
 *       500:
 *         description: 서버 오류
 */
// 테스트케이스 목록 조회
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20, search, folderId } = req.query;
        const testCases = await testCaseService.getTestCases({
            page: Number(page),
            limit: Number(limit),
            search: search as string,
            folderId: folderId ? Number(folderId) : undefined
        });
        res.json(testCases);
    } catch (error) {
        console.error('테스트케이스 조회 실패:', error);
        res.status(500).json({ message: '테스트케이스 조회에 실패했습니다.' });
    }
});

/**
 * @swagger
 * /api/testcases/{id}:
 *   get:
 *     summary: 특정 테스트케이스 조회
 *     description: ID로 특정 테스트케이스를 조회합니다.
 *     tags: [Test Cases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 테스트케이스 ID
 *     responses:
 *       200:
 *         description: 테스트케이스 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestCase'
 *       404:
 *         description: 테스트케이스를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
// 특정 테스트케이스 조회
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const testCase = await testCaseService.getTestCaseById(id);
        if (!testCase) {
            return res.status(404).json({ message: '테스트케이스를 찾을 수 없습니다.' });
        }
        res.json(testCase);
    } catch (error) {
        console.error('테스트케이스 조회 실패:', error);
        res.status(500).json({ message: '테스트케이스 조회에 실패했습니다.' });
    }
});

/**
 * @swagger
 * /api/testcases:
 *   post:
 *     summary: 테스트케이스 생성
 *     description: 새로운 테스트케이스를 생성합니다.
 *     tags: [Test Cases]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - priority
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *                 description: 테스트케이스 제목
 *               description:
 *                 type: string
 *                 description: 테스트케이스 설명
 *               priority:
 *                 type: string
 *                 enum: [High, Medium, Low]
 *                 description: 우선순위
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive, Draft]
 *                 description: 상태
 *               folderId:
 *                 type: integer
 *                 description: 폴더 ID
 *     responses:
 *       201:
 *         description: 테스트케이스 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestCase'
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
// 테스트케이스 생성
router.post('/', async (req, res) => {
    try {
        const testCase = await testCaseService.createTestCase(req.body);
        res.status(201).json(testCase);
    } catch (error) {
        console.error('테스트케이스 생성 실패:', error);
        res.status(400).json({ message: '테스트케이스 생성에 실패했습니다.' });
    }
});

/**
 * @swagger
 * /api/testcases/{id}:
 *   put:
 *     summary: 테스트케이스 수정
 *     description: 특정 테스트케이스를 수정합니다.
 *     tags: [Test Cases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 테스트케이스 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 테스트케이스 제목
 *               description:
 *                 type: string
 *                 description: 테스트케이스 설명
 *               priority:
 *                 type: string
 *                 enum: [High, Medium, Low]
 *                 description: 우선순위
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive, Draft]
 *                 description: 상태
 *               folderId:
 *                 type: integer
 *                 description: 폴더 ID
 *     responses:
 *       200:
 *         description: 테스트케이스 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestCase'
 *       404:
 *         description: 테스트케이스를 찾을 수 없음
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
// 테스트케이스 수정
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const testCase = await testCaseService.updateTestCase(id, req.body);
        if (!testCase) {
            return res.status(404).json({ message: '테스트케이스를 찾을 수 없습니다.' });
        }
        res.json(testCase);
    } catch (error) {
        console.error('테스트케이스 수정 실패:', error);
        res.status(400).json({ message: '테스트케이스 수정에 실패했습니다.' });
    }
});

/**
 * @swagger
 * /api/testcases/{id}:
 *   delete:
 *     summary: 테스트케이스 삭제
 *     description: 특정 테스트케이스를 삭제합니다.
 *     tags: [Test Cases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 테스트케이스 ID
 *     responses:
 *       200:
 *         description: 테스트케이스 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '테스트케이스가 성공적으로 삭제되었습니다.'
 *       404:
 *         description: 테스트케이스를 찾을 수 없음
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
// 테스트케이스 삭제
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const success = await testCaseService.deleteTestCase(id);
        if (!success) {
            return res.status(404).json({ message: '테스트케이스를 찾을 수 없습니다.' });
        }
        res.json({ message: '테스트케이스가 성공적으로 삭제되었습니다.' });
    } catch (error) {
        console.error('테스트케이스 삭제 실패:', error);
        res.status(400).json({ message: '테스트케이스 삭제에 실패했습니다.' });
    }
});

export default router; 