import { Router } from 'express';
import * as folderService from '../services/folderService';
import { createTestCase, getTestCaseById, updateTestCase, deleteTestCase } from '../../testcases/repositories/testCaseRepository';

const router = Router();

// 일괄 이동 API
router.post('/move', async (req, res) => {
    try {
        const { folderIds, testCaseIds, targetFolderId } = req.body;
        
        if (!targetFolderId) {
            return res.status(400).json({ message: '대상 폴더 ID가 필요합니다.' });
        }

        const results = {
            folders: { success: 0, failed: 0, errors: [] as Array<{ folderId: number; error: string }> },
            testCases: { success: 0, failed: 0, errors: [] as Array<{ testCaseId: number; error: string }> }
        };

        // 폴더 일괄 이동
        if (folderIds && folderIds.length > 0) {
            for (const folderId of folderIds) {
                try {
                    await folderService.moveFolder(folderId, { targetParentId: targetFolderId, updatedBy: req.body.updatedBy || 'system' });
                    results.folders.success++;
                } catch (error) {
                    results.folders.failed++;
                    results.folders.errors.push({ folderId, error: error instanceof Error ? error.message : 'Unknown error' });
                }
            }
        }

        // 테스트 케이스 일괄 이동
        if (testCaseIds && testCaseIds.length > 0) {
            for (const testCaseId of testCaseIds) {
                try {
                    await folderService.addTestCaseToFolder(testCaseId, targetFolderId);
                    results.testCases.success++;
                } catch (error) {
                    results.testCases.failed++;
                    results.testCases.errors.push({ testCaseId, error: error instanceof Error ? error.message : 'Unknown error' });
                }
            }
        }

        res.json({
            message: '일괄 이동이 완료되었습니다.',
            results
        });
    } catch (error) {
        console.error('일괄 이동 실패:', error);
        res.status(500).json({ message: '일괄 이동에 실패했습니다.' });
    }
});

// 일괄 복사 API
router.post('/copy', async (req, res) => {
    try {
        const { folderIds, testCaseIds, targetFolderId } = req.body;
        
        if (!targetFolderId) {
            return res.status(400).json({ message: '대상 폴더 ID가 필요합니다.' });
        }

        const results = {
            folders: { success: 0, failed: 0, errors: [] as Array<{ folderId: number; error: string }> },
            testCases: { success: 0, failed: 0, errors: [] as Array<{ testCaseId: number; error: string }> }
        };

        // 폴더 일괄 복사
        if (folderIds && folderIds.length > 0) {
            for (const folderId of folderIds) {
                try {
                    const folder = await folderService.getFolderById(folderId);
                    if (folder) {
                        await folderService.createFolder({
                            name: `${folder.name} (복사본)`,
                            description: folder.description,
                            parentId: targetFolderId,
                            createdBy: req.body.createdBy || 'system'
                        });
                        results.folders.success++;
                    }
                } catch (error) {
                    results.folders.failed++;
                    results.folders.errors.push({ folderId, error: error instanceof Error ? error.message : 'Unknown error' });
                }
            }
        }

        // 테스트 케이스 일괄 복사
        if (testCaseIds && testCaseIds.length > 0) {
            for (const testCaseId of testCaseIds) {
                try {
                    const testCase = await getTestCaseById(testCaseId);
                    if (testCase) {
                        const copiedTestCase = await createTestCase({
                            title: `${testCase.title} (복사본)`,
                            prereq: testCase.prereq,
                            steps: testCase.steps,
                            expected: testCase.expected,
                            priority: testCase.priority,
                            tags: testCase.tags,
                            status: testCase.status,
                            createdBy: req.body.createdBy || 'system'
                        });
                        
                        await folderService.addTestCaseToFolder(copiedTestCase.id, targetFolderId);
                        results.testCases.success++;
                    }
                } catch (error) {
                    results.testCases.failed++;
                    results.testCases.errors.push({ testCaseId, error: error instanceof Error ? error.message : 'Unknown error' });
                }
            }
        }

        res.json({
            message: '일괄 복사가 완료되었습니다.',
            results
        });
    } catch (error) {
        console.error('일괄 복사 실패:', error);
        res.status(500).json({ message: '일괄 복사에 실패했습니다.' });
    }
});

// 일괄 삭제 API
router.delete('/', async (req, res) => {
    try {
        const { folderIds, testCaseIds } = req.body;
        
        const results = {
            folders: { success: 0, failed: 0, errors: [] as Array<{ folderId: number; error: string }> },
            testCases: { success: 0, failed: 0, errors: [] as Array<{ testCaseId: number; error: string }> }
        };

        // 폴더 일괄 삭제
        if (folderIds && folderIds.length > 0) {
            for (const folderId of folderIds) {
                try {
                    await folderService.deleteFolder(folderId);
                    results.folders.success++;
                } catch (error) {
                    results.folders.failed++;
                    results.folders.errors.push({ folderId, error: error instanceof Error ? error.message : 'Unknown error' });
                }
            }
        }

        // 테스트 케이스 일괄 삭제
        if (testCaseIds && testCaseIds.length > 0) {
            for (const testCaseId of testCaseIds) {
                try {
                    await deleteTestCase(testCaseId);
                    results.testCases.success++;
                } catch (error) {
                    results.testCases.failed++;
                    results.testCases.errors.push({ testCaseId, error: error instanceof Error ? error.message : 'Unknown error' });
                }
            }
        }

        res.json({
            message: '일괄 삭제가 완료되었습니다.',
            results
        });
    } catch (error) {
        console.error('일괄 삭제 실패:', error);
        res.status(500).json({ message: '일괄 삭제에 실패했습니다.' });
    }
});

// 일괄 상태 변경 API
router.patch('/status', async (req, res) => {
    try {
        const { testCaseIds, status } = req.body;
        
        if (!status) {
            return res.status(400).json({ message: '상태 값이 필요합니다.' });
        }

        if (!testCaseIds || testCaseIds.length === 0) {
            return res.status(400).json({ message: '테스트 케이스 ID가 필요합니다.' });
        }

        const results = {
            success: 0,
            failed: 0,
            errors: [] as Array<{ testCaseId: number; error: string }>
        };

        for (const testCaseId of testCaseIds) {
            try {
                await updateTestCase(testCaseId, { status });
                results.success++;
            } catch (error) {
                results.failed++;
                results.errors.push({ testCaseId, error: error instanceof Error ? error.message : 'Unknown error' });
            }
        }

        res.json({
            message: '일괄 상태 변경이 완료되었습니다.',
            results
        });
    } catch (error) {
        console.error('일괄 상태 변경 실패:', error);
        res.status(500).json({ message: '일괄 상태 변경에 실패했습니다.' });
    }
});

export default router; 