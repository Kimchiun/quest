import { Router } from 'express';
import * as folderService from '../services/folderService';
import { CreateFolderRequest, UpdateFolderRequest, MoveFolderRequest, MoveTestCaseRequest } from '../models/Folder';

const router = Router();

// 폴더 트리 조회
router.get('/tree', async (req, res) => {
    try {
        const tree = await folderService.getFolderTree();
        res.json(tree);
    } catch (error) {
        console.error('폴더 트리 조회 실패:', error);
        res.status(500).json({ message: '폴더 트리 조회에 실패했습니다.' });
    }
});

// 모든 폴더 조회
router.get('/', async (req, res) => {
    try {
        const folders = await folderService.getAllFolders();
        res.json(folders);
    } catch (error) {
        console.error('폴더 목록 조회 실패:', error);
        res.status(500).json({ message: '폴더 목록 조회에 실패했습니다.' });
    }
});

// 특정 폴더 조회
router.get('/:id', async (req, res) => {
    try {
        const folder = await folderService.getFolderById(Number(req.params.id));
        if (!folder) {
            return res.status(404).json({ message: '폴더를 찾을 수 없습니다.' });
        }
        res.json(folder);
    } catch (error) {
        console.error('폴더 조회 실패:', error);
        res.status(500).json({ message: '폴더 조회에 실패했습니다.' });
    }
});

// 폴더 생성
router.post('/', async (req, res) => {
    try {
        const request: CreateFolderRequest = {
            name: req.body.name,
            description: req.body.description,
            parentId: req.body.parentId,
            createdBy: req.body.createdBy || 'system'
        };
        
        const folder = await folderService.createFolder(request);
        res.status(201).json(folder);
    } catch (error) {
        console.error('폴더 생성 실패:', error);
        if (error instanceof Error && error.message.includes('순환 참조')) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: '폴더 생성에 실패했습니다.' });
        }
    }
});

// 폴더 수정
router.put('/:id', async (req, res) => {
    try {
        const request: UpdateFolderRequest = {
            name: req.body.name,
            description: req.body.description,
            parentId: req.body.parentId,
            updatedBy: req.body.updatedBy || 'system'
        };
        
        const folder = await folderService.updateFolder(Number(req.params.id), request);
        if (!folder) {
            return res.status(404).json({ message: '폴더를 찾을 수 없습니다.' });
        }
        res.json(folder);
    } catch (error) {
        console.error('폴더 수정 실패:', error);
        if (error instanceof Error && error.message.includes('순환 참조')) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: '폴더 수정에 실패했습니다.' });
        }
    }
});

// 폴더 삭제
router.delete('/:id', async (req, res) => {
    try {
        const success = await folderService.deleteFolder(Number(req.params.id));
        if (!success) {
            return res.status(404).json({ message: '폴더를 찾을 수 없습니다.' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('폴더 삭제 실패:', error);
        if (error instanceof Error && error.message.includes('루트 폴더')) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: '폴더 삭제에 실패했습니다.' });
        }
    }
});

// 폴더 이동
router.post('/:id/move', async (req, res) => {
    try {
        const request: MoveFolderRequest = {
            targetParentId: req.body.targetParentId,
            updatedBy: req.body.updatedBy || 'system'
        };
        
        const folder = await folderService.moveFolder(Number(req.params.id), request);
        if (!folder) {
            return res.status(404).json({ message: '폴더를 찾을 수 없습니다.' });
        }
        res.json(folder);
    } catch (error) {
        console.error('폴더 이동 실패:', error);
        if (error instanceof Error && error.message.includes('순환 참조')) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: '폴더 이동에 실패했습니다.' });
        }
    }
});

// 폴더 내 테스트 케이스 목록 조회
router.get('/:id/testcases', async (req, res) => {
    try {
        const testCaseIds = await folderService.getTestCasesInFolder(Number(req.params.id));
        res.json(testCaseIds);
    } catch (error) {
        console.error('폴더 내 테스트 케이스 조회 실패:', error);
        res.status(500).json({ message: '테스트 케이스 조회에 실패했습니다.' });
    }
});

// 테스트 케이스를 폴더에 추가
router.post('/:id/testcases/:testCaseId', async (req, res) => {
    try {
        await folderService.addTestCaseToFolder(
            Number(req.params.testCaseId),
            Number(req.params.id)
        );
        res.status(204).send();
    } catch (error) {
        console.error('테스트 케이스 추가 실패:', error);
        res.status(500).json({ message: '테스트 케이스 추가에 실패했습니다.' });
    }
});

// 테스트 케이스를 폴더에서 제거
router.delete('/:id/testcases/:testCaseId', async (req, res) => {
    try {
        await folderService.removeTestCaseFromFolder(
            Number(req.params.testCaseId),
            Number(req.params.id)
        );
        res.status(204).send();
    } catch (error) {
        console.error('테스트 케이스 제거 실패:', error);
        res.status(500).json({ message: '테스트 케이스 제거에 실패했습니다.' });
    }
});

export default router; 