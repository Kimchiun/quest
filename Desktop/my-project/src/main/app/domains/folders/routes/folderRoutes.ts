import { Router } from 'express';
import * as folderController from '../controllers/folderController';

/**
 * @swagger
 * /api/folders/tree:
 *   get:
 *     summary: 폴더 트리 조회
 *     description: 전체 폴더 트리 구조를 조회합니다.
 *     tags: [Folders]
 *     responses:
 *       200:
 *         description: 폴더 트리 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Folder'
 *       500:
 *         description: 서버 오류
 */

const router = Router();

// 폴더 트리 조회
router.get('/tree', folderController.getFolderTree);

/**
 * @swagger
 * /api/folders/project/{projectId}:
 *   get:
 *     summary: 프로젝트별 폴더 목록
 *     description: 특정 프로젝트의 폴더 목록을 조회합니다.
 *     tags: [Folders]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: 프로젝트 ID
 *     responses:
 *       200:
 *         description: 프로젝트 폴더 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Folder'
 *       500:
 *         description: 서버 오류
 */
// 프로젝트별 폴더 목록
router.get('/project/:projectId', folderController.listFoldersByProject);

/**
 * @swagger
 * /api/folders:
 *   post:
 *     summary: 폴더 생성
 *     description: 새로운 폴더를 생성합니다.
 *     tags: [Folders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - projectId
 *             properties:
 *               name:
 *                 type: string
 *                 description: 폴더 이름
 *               description:
 *                 type: string
 *                 description: 폴더 설명
 *               parentId:
 *                 type: integer
 *                 description: 부모 폴더 ID
 *               projectId:
 *                 type: string
 *                 description: 프로젝트 ID
 *     responses:
 *       201:
 *         description: 폴더 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Folder'
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
// 폴더 생성
router.post('/', folderController.createFolder);

/**
 * @swagger
 * /api/folders/{id}:
 *   get:
 *     summary: 특정 폴더 조회
 *     description: ID로 특정 폴더를 조회합니다.
 *     tags: [Folders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 폴더 ID
 *     responses:
 *       200:
 *         description: 폴더 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Folder'
 *       404:
 *         description: 폴더를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
// 특정 폴더 조회
router.get('/:id', folderController.getFolderById);

/**
 * @swagger
 * /api/folders/{id}:
 *   patch:
 *     summary: 폴더 수정
 *     description: 특정 폴더를 수정합니다.
 *     tags: [Folders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 폴더 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 폴더 이름
 *               description:
 *                 type: string
 *                 description: 폴더 설명
 *               sortOrder:
 *                 type: integer
 *                 description: 정렬 순서
 *     responses:
 *       200:
 *         description: 폴더 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Folder'
 *       404:
 *         description: 폴더를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
// 폴더 수정
router.patch('/:id', folderController.updateFolder);

/**
 * @swagger
 * /api/folders/{id}/move:
 *   patch:
 *     summary: 폴더 이동
 *     description: 특정 폴더를 다른 위치로 이동합니다.
 *     tags: [Folders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 폴더 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newParentId
 *             properties:
 *               newParentId:
 *                 type: integer
 *                 description: 새로운 부모 폴더 ID
 *     responses:
 *       200:
 *         description: 폴더 이동 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Folder'
 *       404:
 *         description: 폴더를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
// 폴더 이동
router.patch('/:id/move', folderController.moveFolder);

/**
 * @swagger
 * /api/folders/move-batch:
 *   patch:
 *     summary: 폴더 배치 이동
 *     description: 여러 폴더를 한 번에 이동합니다.
 *     tags: [Folders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - folderIds
 *               - newParentId
 *             properties:
 *               folderIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: 이동할 폴더 ID 목록
 *               newParentId:
 *                 type: integer
 *                 description: 새로운 부모 폴더 ID
 *     responses:
 *       200:
 *         description: 폴더 배치 이동 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
// 폴더 배치 이동 (8.13 스펙)
router.patch('/move-batch', folderController.moveFolderBatch);

/**
 * @swagger
 * /api/folders/{id}:
 *   delete:
 *     summary: 폴더 삭제
 *     description: 특정 폴더를 삭제합니다.
 *     tags: [Folders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 폴더 ID
 *       - in: query
 *         name: mode
 *         schema:
 *           type: string
 *           enum: [soft, hard]
 *           default: soft
 *         description: '삭제 모드 (soft: 논리 삭제, hard: 물리 삭제)'
 *     responses:
 *       200:
 *         description: 폴더 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: 폴더를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
// 폴더 삭제
router.delete('/:id', folderController.deleteFolder);

export default router;
