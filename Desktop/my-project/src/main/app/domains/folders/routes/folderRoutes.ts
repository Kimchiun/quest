import { Router } from 'express';
import * as folderController from '../controllers/folderController';

const router = Router();

// 폴더 트리 조회
router.get('/tree', folderController.getFolderTree);

// 프로젝트별 폴더 목록
router.get('/project/:projectId', folderController.listFoldersByProject);

// 폴더 생성
router.post('/', folderController.createFolder);

// 특정 폴더 조회
router.get('/:id', folderController.getFolderById);

// 폴더 수정
router.patch('/:id', folderController.updateFolder);

// 폴더 이동
router.patch('/:id/move', folderController.moveFolder);

// 폴더 배치 이동 (8.13 스펙)
router.patch('/move-batch', folderController.moveFolderBatch);

// 폴더 삭제
router.delete('/:id', folderController.deleteFolder);

export default router;
