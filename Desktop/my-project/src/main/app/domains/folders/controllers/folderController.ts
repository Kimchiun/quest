import { Router } from 'express';
import * as folderService from '../services/folderService';
import { CreateFolderRequest, UpdateFolderRequest } from '../models/Folder';

const router = Router();

// 폴더 목록 조회
router.get('/', async (req, res) => {
    try {
        const folders = await folderService.listFolders();
        res.json(folders);
    } catch (error) {
        console.error('폴더 목록 조회 실패:', error);
        res.status(500).json({ message: '폴더 목록 조회에 실패했습니다.' });
    }
});

// 폴더 트리 구조 조회
router.get('/tree', async (req, res) => {
    try {
        const folderTree = await folderService.getFolderTree();
        res.json(folderTree);
    } catch (error) {
        console.error('폴더 트리 조회 실패:', error);
        res.status(500).json({ message: '폴더 트리 조회에 실패했습니다.' });
    }
});

// 폴더 검색 (특정 ID 라우터보다 먼저 정의)
router.get('/search/:query', async (req, res) => {
    try {
        const query = req.params.query;
        const folders = await folderService.searchFolders(query);
        res.json(folders);
    } catch (error) {
        console.error('폴더 검색 실패:', error);
        res.status(500).json({ message: '폴더 검색에 실패했습니다.' });
    }
});

// 특정 폴더 조회
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: '유효하지 않은 폴더 ID입니다.' });
        }

        const folder = await folderService.getFolderById(id);
        if (!folder) {
            return res.status(404).json({ message: '폴더를 찾을 수 없습니다.' });
        }

        res.json(folder);
    } catch (error) {
        console.error('폴더 조회 실패:', error);
        res.status(500).json({ message: '폴더 조회에 실패했습니다.' });
    }
});

// 폴더 통계 조회
router.get('/:id/stats', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: '유효하지 않은 폴더 ID입니다.' });
        }

        const stats = await folderService.getFolderStats(id);
        res.json(stats);
    } catch (error) {
        console.error('폴더 통계 조회 실패:', error);
        res.status(500).json({ message: '폴더 통계 조회에 실패했습니다.' });
    }
});

// 폴더 생성
router.post('/', async (req, res) => {
    try {
        const folderData: CreateFolderRequest = {
            name: req.body.name,
            description: req.body.description,
            parentId: req.body.parentId,
            sortOrder: req.body.sortOrder,
            testcaseCount: req.body.testcaseCount,
            createdBy: req.body.createdBy || 'system',
            isExpanded: req.body.isExpanded,
            isReadOnly: req.body.isReadOnly,
            permissions: req.body.permissions
        };

        const folder = await folderService.createFolder(folderData);
        res.status(201).json(folder);
    } catch (error) {
        console.error('폴더 생성 실패:', error);
        res.status(400).json({ message: '폴더 생성에 실패했습니다.' });
    }
});

// 폴더 수정
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: '유효하지 않은 폴더 ID입니다.' });
        }

        const updateData: UpdateFolderRequest = {
            name: req.body.name,
            description: req.body.description,
            parentId: req.body.parentId,
            sortOrder: req.body.sortOrder,
            testcaseCount: req.body.testcaseCount,
            updatedBy: req.body.updatedBy || 'system',
            isExpanded: req.body.isExpanded,
            isReadOnly: req.body.isReadOnly,
            permissions: req.body.permissions
        };

        const folder = await folderService.updateFolder(id, updateData);
        if (!folder) {
            return res.status(404).json({ message: '폴더를 찾을 수 없습니다.' });
        }

        res.json(folder);
    } catch (error) {
        console.error('폴더 수정 실패:', error);
        res.status(400).json({ message: '폴더 수정에 실패했습니다.' });
    }
});

// 폴더 삭제
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: '유효하지 않은 폴더 ID입니다.' });
        }

        const success = await folderService.deleteFolder(id);
        if (!success) {
            return res.status(404).json({ message: '폴더를 찾을 수 없습니다.' });
        }

        res.json({ message: '폴더가 성공적으로 삭제되었습니다.' });
    } catch (error) {
        console.error('폴더 삭제 실패:', error);
        res.status(400).json({ message: '폴더 삭제에 실패했습니다.' });
    }
});

// 폴더 이동
router.post('/:id/move', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: '유효하지 않은 폴더 ID입니다.' });
        }

        const { targetParentId, updatedBy } = req.body;
        const folder = await folderService.moveFolder(id, { targetParentId, updatedBy });
        
        if (!folder) {
            return res.status(404).json({ message: '폴더를 찾을 수 없습니다.' });
        }

        res.json(folder);
    } catch (error) {
        console.error('폴더 이동 실패:', error);
        res.status(400).json({ message: '폴더 이동에 실패했습니다.' });
    }
});

// 권한 업데이트
router.put('/:id/permissions', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: '유효하지 않은 폴더 ID입니다.' });
        }

        const { permissions } = req.body;
        const folder = await folderService.updateFolderPermissions(id, permissions);
        
        if (!folder) {
            return res.status(404).json({ message: '폴더를 찾을 수 없습니다.' });
        }

        res.json(folder);
    } catch (error) {
        console.error('권한 업데이트 실패:', error);
        res.status(400).json({ message: '권한 업데이트에 실패했습니다.' });
    }
});

// 일괄 작업 - 폴더 이동
router.post('/bulk/move', async (req, res) => {
    try {
        const { folderIds, targetParentId } = req.body;
        
        if (!Array.isArray(folderIds) || folderIds.length === 0) {
            return res.status(400).json({ message: '폴더 ID 목록이 필요합니다.' });
        }

        const success = await folderService.bulkMoveFolders(folderIds, targetParentId);
        res.json({ success, message: '일괄 이동이 완료되었습니다.' });
    } catch (error) {
        console.error('일괄 이동 실패:', error);
        res.status(400).json({ message: '일괄 이동에 실패했습니다.' });
    }
});

// 일괄 작업 - 폴더 삭제
router.post('/bulk/delete', async (req, res) => {
    try {
        const { folderIds } = req.body;
        
        if (!Array.isArray(folderIds) || folderIds.length === 0) {
            return res.status(400).json({ message: '폴더 ID 목록이 필요합니다.' });
        }

        const success = await folderService.bulkDeleteFolders(folderIds);
        res.json({ success, message: '일괄 삭제가 완료되었습니다.' });
    } catch (error) {
        console.error('일괄 삭제 실패:', error);
        res.status(400).json({ message: '일괄 삭제에 실패했습니다.' });
    }
});

// 테스트케이스 폴더 추가
router.post('/:id/testcases/:testCaseId', async (req, res) => {
    try {
        const folderId = parseInt(req.params.id);
        const testCaseId = parseInt(req.params.testCaseId);
        
        if (isNaN(folderId) || isNaN(testCaseId)) {
            return res.status(400).json({ message: '유효하지 않은 ID입니다.' });
        }

        const success = await folderService.addTestCaseToFolder(testCaseId, folderId);
        res.json({ success, message: '테스트케이스가 폴더에 추가되었습니다.' });
    } catch (error) {
        console.error('테스트케이스 추가 실패:', error);
        res.status(400).json({ message: '테스트케이스 추가에 실패했습니다.' });
    }
});

// 드래그 앤 드롭 처리
router.post('/dragdrop', async (req, res) => {
    try {
        const { draggedNodeId, targetNodeId, dropType, position } = req.body;

        if (!draggedNodeId || !targetNodeId || !dropType) {
            return res.status(400).json({ message: '필수 파라미터가 누락되었습니다.' });
        }

        const result = await folderService.handleFolderDragDrop({
            draggedNodeId,
            targetNodeId,
            dropType,
            position
        });

        res.json(result);
    } catch (error) {
        console.error('드래그 앤 드롭 실패:', error);
        res.status(400).json({ message: '드래그 앤 드롭에 실패했습니다.' });
    }
});

// 드롭 영역 유효성 검사
router.post('/validate-drop', async (req, res) => {
    try {
        const { draggedNodeId, targetNodeId, dropZone } = req.body;

        if (!draggedNodeId || !targetNodeId || !dropZone) {
            return res.status(400).json({ message: '필수 파라미터가 누락되었습니다.' });
        }

        const validation = await folderService.validateDropZone(draggedNodeId, targetNodeId, dropZone);
        res.json({ isValid: validation });
    } catch (error) {
        console.error('드롭 영역 유효성 검사 실패:', error);
        res.status(500).json({ message: '드롭 영역 유효성 검사에 실패했습니다.' });
    }
});

export default router; 