import { Router } from 'express';
import * as treeService from '../services/treeService';
import { CreateTreeNodeRequest, UpdateTreeNodeRequest, DragDropRequest } from '../models/TreeNode';

const router = Router();

// =====================================================
// 기본 CRUD 엔드포인트
// =====================================================

// 트리 구조 조회
router.get('/structure', async (req, res) => {
  try {
    const treeStructure = await treeService.getTreeStructure();
    res.json(treeStructure);
  } catch (error) {
    console.error('트리 구조 조회 실패:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : '트리 구조 조회에 실패했습니다.',
      error: error instanceof Error ? error.stack : String(error)
    });
  }
});

// 모든 노드 조회
router.get('/', async (req, res) => {
  try {
    const nodes = await treeService.getAllTreeNodes();
    res.json(nodes);
  } catch (error) {
    console.error('노드 조회 실패:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : '노드 조회에 실패했습니다.',
      error: error instanceof Error ? error.stack : String(error)
    });
  }
});

// 특정 노드 조회
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: '유효하지 않은 노드 ID입니다.' });
    }

    const node = await treeService.getTreeNodeById(id);
    if (!node) {
      return res.status(404).json({ message: '노드를 찾을 수 없습니다.' });
    }

    res.json(node);
  } catch (error) {
    console.error('노드 조회 실패:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : '노드 조회에 실패했습니다.',
      error: error instanceof Error ? error.stack : String(error)
    });
  }
});

// 노드 생성
router.post('/', async (req, res) => {
  try {
    console.log('노드 생성 요청:', req.body);

    const nodeData: CreateTreeNodeRequest = {
      name: req.body.name,
      type: req.body.type,
      parentId: req.body.parentId || null,
      createdBy: req.body.createdBy || 'system'
    };

    console.log('노드 데이터:', nodeData);

    const node = await treeService.createTreeNode(nodeData);
    console.log('노드 생성 성공:', node);
    res.status(201).json(node);
  } catch (error) {
    console.error('노드 생성 실패:', error);
    res.status(400).json({ 
      message: error instanceof Error ? error.message : '노드 생성에 실패했습니다.',
      error: error instanceof Error ? error.stack : String(error)
    });
  }
});

// 노드 수정
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: '유효하지 않은 노드 ID입니다.' });
    }

    const updateData: UpdateTreeNodeRequest = {
      name: req.body.name,
      parentId: req.body.parentId,
      sortOrder: req.body.sortOrder
    };

    const node = await treeService.updateTreeNode(id, updateData);
    if (!node) {
      return res.status(404).json({ message: '노드를 찾을 수 없습니다.' });
    }

    res.json(node);
  } catch (error) {
    console.error('노드 수정 실패:', error);
    res.status(400).json({ 
      message: error instanceof Error ? error.message : '노드 수정에 실패했습니다.',
      error: error instanceof Error ? error.stack : String(error)
    });
  }
});

// 노드 삭제
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: '유효하지 않은 노드 ID입니다.' });
    }

    const success = await treeService.deleteTreeNode(id);
    if (!success) {
      return res.status(404).json({ message: '노드를 찾을 수 없습니다.' });
    }

    res.json({ message: '노드가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('노드 삭제 실패:', error);
    res.status(400).json({ 
      message: error instanceof Error ? error.message : '노드 삭제에 실패했습니다.',
      error: error instanceof Error ? error.stack : String(error)
    });
  }
});

// =====================================================
// 검색 엔드포인트
// =====================================================

// 노드 검색
router.get('/search', async (req, res) => {
  try {
    const searchRequest = {
      query: req.query.query as string,
      type: req.query.type as 'folder' | 'testcase',
      parentId: req.query.parentId ? parseInt(req.query.parentId as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
    };

    const result = await treeService.searchTreeNodes(searchRequest);
    res.json(result);
  } catch (error) {
    console.error('노드 검색 실패:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : '노드 검색에 실패했습니다.',
      error: error instanceof Error ? error.stack : String(error)
    });
  }
});

// =====================================================
// 드래그 앤 드롭 엔드포인트
// =====================================================

// 드래그 앤 드롭 처리
router.post('/dragdrop', async (req, res) => {
  try {
    const { draggedNodeId, targetNodeId, dropType, position } = req.body;

    if (!draggedNodeId || !targetNodeId || !dropType) {
      return res.status(400).json({ message: '필수 파라미터가 누락되었습니다.' });
    }

    const dragDropRequest: DragDropRequest = {
      draggedNodeId,
      targetNodeId,
      dropType,
      position
    };

    const result = await treeService.handleTreeNodeDragDrop(dragDropRequest);
    res.json(result);
  } catch (error) {
    console.error('드래그 앤 드롭 실패:', error);
    res.status(400).json({ 
      message: error instanceof Error ? error.message : '드래그 앤 드롭에 실패했습니다.',
      error: error instanceof Error ? error.stack : String(error)
    });
  }
});

// 드롭 영역 유효성 검사
router.post('/validate-drop', async (req, res) => {
  try {
    const { draggedNodeId, targetNodeId, dropZone } = req.body;

    if (!draggedNodeId || !targetNodeId || !dropZone) {
      return res.status(400).json({ message: '필수 파라미터가 누락되었습니다.' });
    }

    const validation = await treeService.validateDropZone(draggedNodeId, targetNodeId, dropZone);
    res.json(validation);
  } catch (error) {
    console.error('드롭 영역 유효성 검사 실패:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : '드롭 영역 유효성 검사에 실패했습니다.',
      error: error instanceof Error ? error.stack : String(error)
    });
  }
});

// =====================================================
// 성능 모니터링 엔드포인트
// =====================================================

// 성능 통계 조회
router.get('/performance/stats', async (req, res) => {
  try {
    // 성능 통계 로직 구현
    res.json({ message: '성능 통계 기능은 추후 구현 예정입니다.' });
  } catch (error) {
    console.error('성능 통계 조회 실패:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : '성능 통계 조회에 실패했습니다.',
      error: error instanceof Error ? error.stack : String(error)
    });
  }
});

export default router; 