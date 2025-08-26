import { Router } from 'express';
import { releaseController } from '../controllers/releaseController';

const router = Router();

// 기본 CRUD 라우트 - 구체적인 라우트를 먼저 정의
router.get('/', releaseController.getAllReleases);
router.get('/search', releaseController.searchReleases);
router.get('/status/:status', releaseController.getReleasesByStatus);
router.get('/project/:projectId', releaseController.getReleasesByProject);
router.get('/testcases/folders', releaseController.getTestFolders);
router.get('/folders/:folderId/testcases', releaseController.getFolderTestCases);
router.post('/', releaseController.createRelease);

// 테스트케이스 상태 변경 라우트 - :id 라우트보다 먼저 정의
router.put('/:id/testcases/:testCaseId/status', releaseController.updateTestCaseStatus);
router.get('/:id/testcases', releaseController.getReleaseTestCases);
router.delete('/:id/testcases', releaseController.deleteReleaseTestCases);
router.post('/:releaseId/testcases', releaseController.addTestCasesToRelease);

// 실행 통계 라우트
router.get('/:id/execution-stats', releaseController.getReleaseExecutionStats);
router.put('/:id/execution-stats', releaseController.updateReleaseExecutionStats);

// 일반적인 CRUD 라우트 - 가장 마지막에 정의
router.get('/:id', releaseController.getReleaseById);
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

// 가져온 폴더 관리 라우트
router.get('/:id/imported-folders', releaseController.getImportedFolders);
router.post('/:id/imported-folders', releaseController.addImportedFolders);
router.delete('/:id/imported-folders/:folderId', releaseController.removeImportedFolder);

// 개발용 라우트
router.post('/load-initial-data', releaseController.loadInitialData);

export default router;