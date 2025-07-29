import { Router } from 'express';
import { createDefect, updateDefect, deleteDefect, getDefectById, listDefects } from '../services/defectService';
import { getDefectAttachments, downloadAttachment } from '../services/attachmentService';
import { getDefectActivityLogs } from '../services/activityLogService';

const router = Router();

// 결함 목록 조회
router.get('/', async (req, res) => {
    try {
        const { page = 0, size = 20, status, priority, assignee } = req.query;
        const defects = await listDefects({
            page: Number(page),
            size: Number(size),
            status: status as string,
            priority: priority as string,
            assignee: assignee as string
        });
        res.json(defects);
    } catch (error) {
        console.error('List defects error:', error);
        res.status(500).json({ message: '결함 목록 조회 중 오류가 발생했습니다.' });
    }
});

// 결함 상세 조회
router.get('/:id', async (req, res) => {
    try {
        const defect = await getDefectById(Number(req.params.id));
        if (!defect) {
            return res.status(404).json({ message: '결함을 찾을 수 없습니다.' });
        }
        res.json(defect);
    } catch (error) {
        console.error('Get defect error:', error);
        res.status(500).json({ message: '결함 조회 중 오류가 발생했습니다.' });
    }
});

// 결함 생성
router.post('/', async (req, res) => {
    try {
        const defect = await createDefect({
            ...req.body,
            createdBy: req.body.createdBy || 'system'
        });
        res.status(201).json(defect);
    } catch (error) {
        console.error('Create defect error:', error);
        res.status(500).json({ message: '결함 생성 중 오류가 발생했습니다.' });
    }
});

// 결함 수정
router.put('/:id', async (req, res) => {
    try {
        const defect = await updateDefect(Number(req.params.id), {
            ...req.body,
            updatedBy: req.body.updatedBy || 'system'
        });
        if (!defect) {
            return res.status(404).json({ message: '결함을 찾을 수 없습니다.' });
        }
        res.json(defect);
    } catch (error) {
        console.error('Update defect error:', error);
        res.status(500).json({ message: '결함 수정 중 오류가 발생했습니다.' });
    }
});

// 결함 삭제
router.delete('/:id', async (req, res) => {
    try {
        const success = await deleteDefect(Number(req.params.id));
        if (!success) {
            return res.status(404).json({ message: '결함을 찾을 수 없습니다.' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Delete defect error:', error);
        res.status(500).json({ message: '결함 삭제 중 오류가 발생했습니다.' });
    }
});

// 결함 첨부파일 목록 조회
router.get('/:id/attachments', async (req, res) => {
    try {
        const attachments = await getDefectAttachments(Number(req.params.id));
        res.json(attachments);
    } catch (error) {
        console.error('Get attachments error:', error);
        res.status(500).json({ message: '첨부파일 조회 중 오류가 발생했습니다.' });
    }
});

// 첨부파일 다운로드
router.get('/:id/attachments/:attachmentId', async (req, res) => {
    try {
        const { fileStream, filename, contentType } = await downloadAttachment(
            Number(req.params.id),
            Number(req.params.attachmentId)
        );
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        fileStream.pipe(res);
    } catch (error) {
        console.error('Download attachment error:', error);
        res.status(404).json({ message: '첨부파일을 찾을 수 없습니다.' });
    }
});

// 결함 활동 로그 조회
router.get('/:id/activity-logs', async (req, res) => {
    try {
        const { page = 0, size = 20, dateRange, activityType, user } = req.query;
        const logs = await getDefectActivityLogs(Number(req.params.id), {
            page: Number(page),
            size: Number(size),
            dateRange: dateRange as string,
            activityType: activityType as string,
            user: user as string
        });
        res.json(logs);
    } catch (error) {
        console.error('Get activity logs error:', error);
        res.status(500).json({ message: '활동 로그 조회 중 오류가 발생했습니다.' });
    }
});

export default router; 