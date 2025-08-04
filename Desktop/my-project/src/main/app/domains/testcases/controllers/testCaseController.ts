import { Router } from 'express';
import * as testCaseService from '../services/testCaseService';

const router = Router();

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