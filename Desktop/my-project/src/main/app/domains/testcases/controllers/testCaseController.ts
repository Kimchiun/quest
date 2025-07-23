import { Router } from 'express';
import { createTestCaseWithVersion, updateTestCaseWithVersion, deleteTestCaseWithIndex, getTestCaseVersions } from '../services/testCaseService';
import { listTestCases, getTestCaseById } from '../repositories/testCaseRepository';
import { searchTestCases } from '../elasticsearch/testCaseIndexer';

const router = Router();

router.get('/', async (req, res) => {
    const cases = await listTestCases();
    res.json(cases);
});

router.get('/:id', async (req, res) => {
    const tc = await getTestCaseById(Number(req.params.id));
    if (!tc) return res.status(404).json({ message: 'Not found' });
    res.json(tc);
});

router.post('/', async (req, res) => {
    const created = await createTestCaseWithVersion({ ...req.body, createdBy: req.body.createdBy });
    res.status(201).json(created);
});

router.put('/:id', async (req, res) => {
    const updated = await updateTestCaseWithVersion(Number(req.params.id), req.body, req.body.updatedBy);
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
});

router.delete('/:id', async (req, res) => {
    const ok = await deleteTestCaseWithIndex(Number(req.params.id));
    if (!ok) return res.status(404).json({ message: 'Not found' });
    res.status(204).send();
});

router.get('/:id/versions', async (req, res) => {
    const versions = await getTestCaseVersions(Number(req.params.id));
    res.json(versions);
});

router.post('/search', async (req, res) => {
    // req.body: Elasticsearch DSL 쿼리
    const results = await searchTestCases(req.body);
    res.json(results);
});

export default router; 