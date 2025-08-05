import { getPgClient } from '../../../infrastructure/database/pgClient';
import { TreeNode, CreateTreeNodeRequest, UpdateTreeNodeRequest, TreeSearchRequest, TreeSearchResult } from '../models/TreeNode';

// =====================================================
// 기본 CRUD 함수
// =====================================================

export async function createTreeNode(request: CreateTreeNodeRequest): Promise<TreeNode> {
  const pgClient = getPgClient();
  if (!pgClient) {
    throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
  }

  // 새 노드의 sort_order 계산
  let sortOrder = 0;
  if (request.parentId !== null && request.parentId !== undefined) {
    const siblings = await pgClient.query(
      'SELECT sort_order FROM tree_nodes WHERE parent_id = $1 ORDER BY sort_order DESC LIMIT 1',
      [request.parentId]
    );
    if (siblings.rows.length > 0) {
      sortOrder = siblings.rows[0].sort_order + 1;
    }
  }

  const result = await pgClient.query(
    'INSERT INTO tree_nodes (name, type, parent_id, sort_order, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [request.name, request.type, request.parentId, sortOrder, request.createdBy]
  );

  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    parentId: row.parent_id,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by
  };
}

export async function getTreeNodeById(id: number): Promise<TreeNode | null> {
  const pgClient = getPgClient();
  if (!pgClient) {
    throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
  }

  const result = await pgClient.query('SELECT * FROM tree_nodes WHERE id = $1', [id]);
  
  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    parentId: row.parent_id,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by
  };
}

export async function getAllTreeNodes(): Promise<TreeNode[]> {
  const pgClient = getPgClient();
  if (!pgClient) {
    throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
  }

  const result = await pgClient.query('SELECT * FROM tree_nodes ORDER BY sort_order, name');
  
  return result.rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    type: row.type,
    parentId: row.parent_id,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by
  }));
}

export async function getTreeStructure(): Promise<TreeNode[]> {
  const pgClient = getPgClient();
  if (!pgClient) {
    throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
  }

  // 모든 노드 조회
  const allNodes = await getAllTreeNodes();
  
  // 테스트케이스 수 계산
  const testCaseCounts = await pgClient.query(`
    SELECT parent_id, COUNT(*) as count 
    FROM tree_nodes 
    WHERE type = 'testcase' 
    GROUP BY parent_id
  `);
  
  const countMap = new Map<number, number>();
  testCaseCounts.rows.forEach((row: any) => {
    countMap.set(row.parent_id, parseInt(row.count));
  });

  // 트리 구조 생성
  const nodeMap = new Map<number, TreeNode>();
  const rootNodes: TreeNode[] = [];

  // 먼저 모든 노드를 맵에 추가
  allNodes.forEach(node => {
    const treeNode: TreeNode = {
      ...node,
      children: [],
      testcaseCount: countMap.get(node.id) || 0
    };
    nodeMap.set(node.id, treeNode);
  });

  // 부모-자식 관계 구성
  allNodes.forEach(node => {
    const treeNode = nodeMap.get(node.id)!;
    
    if (node.parentId && node.parentId !== null) {
      const parent = nodeMap.get(node.parentId);
      if (parent) {
        parent.children!.push(treeNode);
      } else {
        rootNodes.push(treeNode);
      }
    } else {
      rootNodes.push(treeNode);
    }
  });

  return rootNodes;
}

export async function updateTreeNode(id: number, updates: UpdateTreeNodeRequest): Promise<TreeNode | null> {
  const pgClient = getPgClient();
  if (!pgClient) {
    throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
  }

  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (updates.name !== undefined) {
    setClauses.push(`name = $${paramIndex++}`);
    values.push(updates.name);
  }

  if (updates.parentId !== undefined) {
    setClauses.push(`parent_id = $${paramIndex++}`);
    values.push(updates.parentId);
  }

  if (updates.sortOrder !== undefined) {
    setClauses.push(`sort_order = $${paramIndex++}`);
    values.push(updates.sortOrder);
  }

  if (setClauses.length === 0) {
    return getTreeNodeById(id);
  }

  values.push(id);
  const query = `UPDATE tree_nodes SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
  
  const result = await pgClient.query(query, values);
  
  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    parentId: row.parent_id,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by
  };
}

export async function deleteTreeNode(id: number): Promise<boolean> {
  const pgClient = getPgClient();
  if (!pgClient) {
    throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
  }

  const result = await pgClient.query('DELETE FROM tree_nodes WHERE id = $1 RETURNING id', [id]);
  return result.rows.length > 0;
}

// =====================================================
// 검색 함수
// =====================================================

export async function searchTreeNodes(request: TreeSearchRequest): Promise<TreeSearchResult> {
  const pgClient = getPgClient();
  if (!pgClient) {
    throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
  }

  let query = 'SELECT * FROM tree_nodes WHERE 1=1';
  const values: any[] = [];
  let paramIndex = 1;

  if (request.query) {
    query += ` AND name ILIKE $${paramIndex++}`;
    values.push(`%${request.query}%`);
  }

  if (request.type) {
    query += ` AND type = $${paramIndex++}`;
    values.push(request.type);
  }

  if (request.parentId !== undefined) {
    query += ` AND parent_id = $${paramIndex++}`;
    values.push(request.parentId);
  }

  query += ' ORDER BY sort_order, name';

  if (request.limit) {
    query += ` LIMIT $${paramIndex++}`;
    values.push(request.limit);
  }

  if (request.offset) {
    query += ` OFFSET $${paramIndex++}`;
    values.push(request.offset);
  }

  const result = await pgClient.query(query, values);
  
  const nodes = result.rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    type: row.type,
    parentId: row.parent_id,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by
  }));

  // 전체 개수 조회
  let countQuery = 'SELECT COUNT(*) FROM tree_nodes WHERE 1=1';
  const countValues: any[] = [];
  let countParamIndex = 1;

  if (request.query) {
    countQuery += ` AND name ILIKE $${countParamIndex++}`;
    countValues.push(`%${request.query}%`);
  }

  if (request.type) {
    countQuery += ` AND type = $${countParamIndex++}`;
    countValues.push(request.type);
  }

  if (request.parentId !== undefined) {
    countQuery += ` AND parent_id = $${countParamIndex++}`;
    countValues.push(request.parentId);
  }

  const countResult = await pgClient.query(countQuery, countValues);
  const total = parseInt(countResult.rows[0].count);

  return { nodes, total };
}

// =====================================================
// 드래그 앤 드롭 관련 함수
// =====================================================

export async function moveTreeNode(nodeId: number, newParentId: number | null): Promise<TreeNode | null> {
  const pgClient = getPgClient();
  if (!pgClient) {
    throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
  }

  try {
    await pgClient.query('BEGIN');

    // 새 부모의 최대 순서 조회
    let newSortOrder = 0;
    if (newParentId !== null) {
      const maxSortResult = await pgClient.query(
        'SELECT COALESCE(MAX(sort_order), 0) as max_sort FROM tree_nodes WHERE parent_id = $1',
        [newParentId]
      );
      newSortOrder = maxSortResult.rows[0].max_sort + 1;
    }

    // 노드 이동
    const result = await pgClient.query(
      'UPDATE tree_nodes SET parent_id = $1, sort_order = $2 WHERE id = $3 RETURNING *',
      [newParentId, newSortOrder, nodeId]
    );

    await pgClient.query('COMMIT');
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      parentId: row.parent_id,
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by
    };
  } catch (error) {
    await pgClient.query('ROLLBACK');
    throw error;
  }
}

export async function reorderTreeNode(nodeId: number, targetNodeId: number, position: 'before' | 'after'): Promise<TreeNode | null> {
  const pgClient = getPgClient();
  if (!pgClient) {
    throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
  }

  try {
    await pgClient.query('BEGIN');

    // 현재 노드와 대상 노드 정보 조회
    const draggedNode = await getTreeNodeById(nodeId);
    const targetNode = await getTreeNodeById(targetNodeId);

    if (!draggedNode || !targetNode) {
      throw new Error('노드를 찾을 수 없습니다.');
    }

    // 같은 부모 노드 내에서만 순서 변경 가능
    if (draggedNode.parentId !== targetNode.parentId) {
      throw new Error('같은 부모 노드 내에서만 순서 변경이 가능합니다.');
    }

    // 대상 노드의 현재 순서 조회
    const targetSortOrder = targetNode.sortOrder;

    // 새로운 순서 계산
    let newSortOrder: number;
    if (position === 'before') {
      newSortOrder = targetSortOrder;
      // 대상 노드와 그 이후 노드들의 순서를 1씩 증가
      await pgClient.query(
        'UPDATE tree_nodes SET sort_order = sort_order + 1 WHERE parent_id = $1 AND sort_order >= $2',
        [targetNode.parentId, targetSortOrder]
      );
    } else {
      newSortOrder = targetSortOrder + 1;
      // 대상 노드 이후 노드들의 순서를 1씩 증가
      await pgClient.query(
        'UPDATE tree_nodes SET sort_order = sort_order + 1 WHERE parent_id = $1 AND sort_order > $2',
        [targetNode.parentId, targetSortOrder]
      );
    }

    // 드래그한 노드의 순서 업데이트
    const result = await pgClient.query(
      'UPDATE tree_nodes SET sort_order = $1 WHERE id = $2 RETURNING *',
      [newSortOrder, nodeId]
    );

    await pgClient.query('COMMIT');
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      parentId: row.parent_id,
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by
    };
  } catch (error) {
    await pgClient.query('ROLLBACK');
    throw error;
  }
}

// =====================================================
// 유효성 검사 함수
// =====================================================

export async function checkCircularReference(nodeId: number, newParentId: number): Promise<boolean> {
  const pgClient = getPgClient();
  if (!pgClient) {
    throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
  }

  // 자기 자신을 부모로 설정하는 경우
  if (nodeId === newParentId) {
    return true;
  }

  // 반복문으로 순환 참조 검사 (재귀 대신)
  const visited = new Set<number>();
  let currentId = newParentId;

  while (currentId !== null) {
    // 이미 방문한 ID가 있다면 순환 참조
    if (visited.has(currentId)) {
      return true;
    }

    visited.add(currentId);

    // 현재 ID가 이동하려는 노드와 같다면 순환 참조
    if (currentId === nodeId) {
      return true;
    }

    // 부모 ID 조회
    const result = await pgClient.query('SELECT parent_id FROM tree_nodes WHERE id = $1', [currentId]);
    const parentId = result.rows[0]?.parent_id;

    if (!parentId) {
      break; // 루트에 도달
    }

    currentId = parentId;
  }

  return false;
}

// =====================================================
// 히스토리 관련 함수
// =====================================================

export async function recordTreeNodeMove(history: {
  nodeId: number;
  oldParentId: number | null;
  newParentId: number | null;
  oldSortOrder: number;
  newSortOrder: number;
  movedBy: string;
}): Promise<void> {
  const pgClient = getPgClient();
  if (!pgClient) {
    throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
  }

  await pgClient.query(
    'INSERT INTO tree_node_move_history (node_id, old_parent_id, new_parent_id, old_sort_order, new_sort_order, moved_by) VALUES ($1, $2, $3, $4, $5, $6)',
    [history.nodeId, history.oldParentId, history.newParentId, history.oldSortOrder, history.newSortOrder, history.movedBy]
  );
} 