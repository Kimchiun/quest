import { Router } from 'express';
import { ReleaseController } from '../controllers/releaseController';

const router = Router();
const releaseController = new ReleaseController();

// 릴리즈 통계 (이 라우트가 /:id 보다 먼저 와야 함)
router.get('/stats', releaseController.getReleaseStats.bind(releaseController));

// 기본 CRUD
router.get('/', releaseController.getAllReleases.bind(releaseController));
router.get('/:id', releaseController.getReleaseById.bind(releaseController));
router.post('/', releaseController.createRelease.bind(releaseController));
router.put('/:id', releaseController.updateRelease.bind(releaseController));
router.delete('/:id', releaseController.deleteRelease.bind(releaseController));

// 릴리즈 관련 세부 데이터
router.get('/:id/test-cases', releaseController.getReleaseTestCases.bind(releaseController));
router.get('/:id/issues', releaseController.getReleaseIssues.bind(releaseController));
router.get('/:id/change-logs', releaseController.getReleaseChangeLogs.bind(releaseController));
router.get('/:id/retrospectives', releaseController.getReleaseRetrospectives.bind(releaseController));

export default router;