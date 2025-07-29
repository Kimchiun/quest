import { Router } from 'express';
import { createTestCaseWithVersion, updateTestCaseWithVersion, deleteTestCaseWithIndex, getTestCaseVersions } from '../services/testCaseService';
import { listTestCases, getTestCaseById } from '../repositories/testCaseRepository';
import { searchTestCases } from '../elasticsearch/testCaseIndexer';
import { advancedSearch, saveSearchPreset, getSearchPresets, deleteSearchPreset, AdvancedSearchFilter } from '../elasticsearch/advancedSearchService';

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

// 고급 검색 API
router.post('/search/advanced', async (req, res) => {
    try {
        const { filters, page = 0, size = 20 } = req.body;
        const result = await advancedSearch(filters as AdvancedSearchFilter, page, size);
        res.json(result);
    } catch (error) {
        console.error('Advanced search error:', error);
        res.status(500).json({ message: '검색 중 오류가 발생했습니다.' });
    }
});

// 검색 프리셋 저장
router.post('/search/presets', async (req, res) => {
    try {
        const preset = await saveSearchPreset(req.body);
        res.status(201).json(preset);
    } catch (error) {
        console.error('Save preset error:', error);
        res.status(500).json({ message: '프리셋 저장 중 오류가 발생했습니다.' });
    }
});

// 검색 프리셋 목록 조회
router.get('/search/presets', async (req, res) => {
    try {
        const { createdBy } = req.query;
        const presets = await getSearchPresets(createdBy as string);
        res.json(presets);
    } catch (error) {
        console.error('Get presets error:', error);
        res.status(500).json({ message: '프리셋 조회 중 오류가 발생했습니다.' });
    }
});

// 검색 프리셋 삭제
router.delete('/search/presets/:id', async (req, res) => {
    try {
        const success = await deleteSearchPreset(req.params.id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: '프리셋을 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error('Delete preset error:', error);
        res.status(500).json({ message: '프리셋 삭제 중 오류가 발생했습니다.' });
    }
});

export default router; 