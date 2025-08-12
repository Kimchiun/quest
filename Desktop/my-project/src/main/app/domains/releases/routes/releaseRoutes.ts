import { Router } from 'express';
import { releaseController } from '../controllers/releaseController';

const router = Router();

// 기본 CRUD 라우트
router.get('/', releaseController.getAllReleases);
router.get('/search', releaseController.searchReleases);
router.get('/status/:status', releaseController.getReleasesByStatus);
router.get('/project/:projectId', releaseController.getReleasesByProject);
router.get('/:id', releaseController.getReleaseById);
router.post('/', releaseController.createRelease);
router.put('/:id', releaseController.updateRelease);
router.delete('/:id', releaseController.deleteRelease);

// 통계 및 분석 라우트
router.get('/:id/statistics', releaseController.getReleaseStatistics);

// 게이트 기준 관리
router.put('/:id/gate-criteria', releaseController.updateGateCriteria);

// 릴리즈 케이스 관리
router.put('/:releaseId/cases/:caseId', releaseController.updateReleaseCase);

// 실행 결과 관리
router.post('/:releaseId/runs', releaseController.saveRun);

// 결함 관리
router.post('/:releaseId/defects', releaseController.addDefectLink);

// 환경 관리
router.put('/:releaseId/environment', releaseController.updateEnvironment);

// 개발용 라우트
router.post('/load-initial-data', releaseController.loadInitialData);

export default router;