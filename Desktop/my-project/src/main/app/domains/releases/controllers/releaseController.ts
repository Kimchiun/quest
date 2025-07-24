import { Router } from 'express';
import { createRelease, listReleases, getReleaseById, updateRelease, deleteRelease, listSuitesByRelease } from '../repositories/releaseRepository';
import { createSuite, updateSuite, deleteSuite, listSuites, assignCaseToSuite, removeCaseFromSuite, listCasesInSuite, suiteCaseCount } from '../../suites/repositories/suiteRepository';

const router = Router();

// 릴리즈 CRUD
router.get('/', async (req, res) => {
  const releases = await listReleases();
  res.json(releases);
});
router.post('/', async (req, res) => {
  const created = await createRelease(req.body);
  res.status(201).json(created);
});
router.get('/:id', async (req, res) => {
  const rel = await getReleaseById(Number(req.params.id));
  if (!rel) return res.status(404).json({ message: 'Not found' });
  res.json(rel);
});
router.put('/:id', async (req, res) => {
  const updated = await updateRelease(Number(req.params.id), req.body);
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});
router.delete('/:id', async (req, res) => {
  const ok = await deleteRelease(Number(req.params.id));
  if (!ok) return res.status(404).json({ message: 'Not found' });
  res.status(204).send();
});

// 릴리즈별 스위트 목록
router.get('/:id/suites', async (req, res) => {
  const suites = await listSuitesByRelease(Number(req.params.id));
  res.json(suites);
});

// 스위트 CRUD
router.post('/:id/suites', async (req, res) => {
  const created = await createSuite({ ...req.body, releaseId: Number(req.params.id) });
  res.status(201).json(created);
});
router.put('/suites/:suiteId', async (req, res) => {
  const updated = await updateSuite(Number(req.params.suiteId), req.body);
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});
router.delete('/suites/:suiteId', async (req, res) => {
  const ok = await deleteSuite(Number(req.params.suiteId));
  if (!ok) return res.status(404).json({ message: 'Not found' });
  res.status(204).send();
});

// 스위트-케이스 할당/해제
router.post('/suites/:suiteId/cases/:testcaseId', async (req, res) => {
  await assignCaseToSuite(Number(req.params.suiteId), Number(req.params.testcaseId));
  res.status(204).send();
});
router.delete('/suites/:suiteId/cases/:testcaseId', async (req, res) => {
  await removeCaseFromSuite(Number(req.params.suiteId), Number(req.params.testcaseId));
  res.status(204).send();
});

// 스위트별 케이스 목록/집계
router.get('/suites/:suiteId/cases', async (req, res) => {
  const cases = await listCasesInSuite(Number(req.params.suiteId));
  res.json(cases);
});
router.get('/suites/:suiteId/count', async (req, res) => {
  const count = await suiteCaseCount(Number(req.params.suiteId));
  res.json({ count });
});

export default router; 