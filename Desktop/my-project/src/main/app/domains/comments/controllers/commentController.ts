import { Router, Request, Response } from 'express';
import { commentService } from '../services/commentService';

const router = Router();

// GET /api/comments/:objectType/:objectId
router.get('/:objectType/:objectId', async (req: Request, res: Response) => {
  const { objectType, objectId } = req.params;
  try {
    const comments = await commentService.getComments(objectType, Number(objectId));
    res.json(comments);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/comments
router.post('/', async (req: Request, res: Response) => {
  try {
    const comment = await commentService.createComment(req.body);
    res.status(201).json(comment);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/comments/:id
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, mentions } = req.body;
  try {
    const updated = await commentService.updateComment(Number(id), content, mentions);
    if (!updated) return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/comments/:id
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const ok = await commentService.deleteComment(Number(id));
    if (!ok) return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router; 