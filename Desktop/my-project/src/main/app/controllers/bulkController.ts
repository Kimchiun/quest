import { Request, Response } from 'express';
import { getPgClient, ensurePgConnected } from '../infrastructure/database/pgClient';

interface BulkOperationRequest {
  ids: number[];
  type: 'testcase' | 'folder';
  targetFolderId?: number;
  newStatus?: string;
}

export const bulkMove = async (req: Request, res: Response) => {
  try {
    await ensurePgConnected();
    const pgClient = getPgClient();
    if (!pgClient) {
      throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    
    const { ids, type, targetFolderId }: BulkOperationRequest = req.body;
    
    if (!ids || ids.length === 0) {
      return res.status(400).json({ error: '선택된 항목이 없습니다.' });
    }
    
    if (!targetFolderId) {
      return res.status(400).json({ error: '대상 폴더가 지정되지 않았습니다.' });
    }

    try {
      await pgClient.query('BEGIN');
      
      if (type === 'testcase') {
        const updateQuery = `
          UPDATE testcases 
          SET folder_id = $1, updated_at = NOW() 
          WHERE id = ANY($2)
        `;
        await pgClient.query(updateQuery, [targetFolderId, ids]);
      } else if (type === 'folder') {
        const updateQuery = `
          UPDATE folders 
          SET parent_id = $1, updated_at = NOW() 
          WHERE id = ANY($2)
        `;
        await pgClient.query(updateQuery, [targetFolderId, ids]);
      }
      
      await pgClient.query('COMMIT');
      
      res.json({ 
        success: true, 
        message: `${ids.length}개 항목이 이동되었습니다.`,
        movedCount: ids.length 
      });
    } catch (error) {
      await pgClient.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('일괄 이동 오류:', error);
    res.status(500).json({ error: '일괄 이동 중 오류가 발생했습니다.' });
  }
};

export const bulkCopy = async (req: Request, res: Response) => {
  try {
    await ensurePgConnected();
    const pgClient = getPgClient();
    if (!pgClient) {
      throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    
    const { ids, type, targetFolderId }: BulkOperationRequest = req.body;
    
    if (!ids || ids.length === 0) {
      return res.status(400).json({ error: '선택된 항목이 없습니다.' });
    }
    
    if (!targetFolderId) {
      return res.status(400).json({ error: '대상 폴더가 지정되지 않았습니다.' });
    }

    try {
      await pgClient.query('BEGIN');
      
      if (type === 'testcase') {
        // 테스트 케이스 복사
        const selectQuery = `
          SELECT title, description, steps, expected_result, priority, tags, status
          FROM testcases WHERE id = ANY($1)
        `;
        const { rows } = await pgClient.query(selectQuery, [ids]);
        
        for (const row of rows) {
          const insertQuery = `
            INSERT INTO testcases (title, description, steps, expected_result, priority, tags, status, folder_id, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
          `;
          await pgClient.query(insertQuery, [
            row.title + ' (복사본)',
            row.description,
            row.steps,
            row.expected_result,
            row.priority,
            row.tags,
            row.status,
            targetFolderId
          ]);
        }
      } else if (type === 'folder') {
        // 폴더 복사 (재귀적 복사 로직 필요)
        const selectQuery = `
          SELECT name, description, parent_id
          FROM folders WHERE id = ANY($1)
        `;
        const { rows } = await pgClient.query(selectQuery, [ids]);
        
        for (const row of rows) {
          const insertQuery = `
            INSERT INTO folders (name, description, parent_id, created_at, updated_at)
            VALUES ($1, $2, $3, NOW(), NOW())
          `;
          await pgClient.query(insertQuery, [
            row.name + ' (복사본)',
            row.description,
            targetFolderId
          ]);
        }
      }
      
      await pgClient.query('COMMIT');
      
      res.json({ 
        success: true, 
        message: `${ids.length}개 항목이 복사되었습니다.`,
        copiedCount: ids.length 
      });
    } catch (error) {
      await pgClient.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('일괄 복사 오류:', error);
    res.status(500).json({ error: '일괄 복사 중 오류가 발생했습니다.' });
  }
};

export const bulkDelete = async (req: Request, res: Response) => {
  try {
    await ensurePgConnected();
    const pgClient = getPgClient();
    if (!pgClient) {
      throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    
    const { ids, type }: BulkOperationRequest = req.body;
    
    if (!ids || ids.length === 0) {
      return res.status(400).json({ error: '선택된 항목이 없습니다.' });
    }

    try {
      await pgClient.query('BEGIN');
      
      if (type === 'testcase') {
        const deleteQuery = `DELETE FROM testcases WHERE id = ANY($1)`;
        await pgClient.query(deleteQuery, [ids]);
      } else if (type === 'folder') {
        // 폴더 삭제 시 하위 항목도 함께 삭제
        const deleteQuery = `DELETE FROM folders WHERE id = ANY($1)`;
        await pgClient.query(deleteQuery, [ids]);
      }
      
      await pgClient.query('COMMIT');
      
      res.json({ 
        success: true, 
        message: `${ids.length}개 항목이 삭제되었습니다.`,
        deletedCount: ids.length 
      });
    } catch (error) {
      await pgClient.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('일괄 삭제 오류:', error);
    res.status(500).json({ error: '일괄 삭제 중 오류가 발생했습니다.' });
  }
};

export const bulkUpdateStatus = async (req: Request, res: Response) => {
  try {
    await ensurePgConnected();
    const pgClient = getPgClient();
    if (!pgClient) {
      throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    
    const { ids, newStatus }: BulkOperationRequest = req.body;
    
    if (!ids || ids.length === 0) {
      return res.status(400).json({ error: '선택된 항목이 없습니다.' });
    }
    
    if (!newStatus) {
      return res.status(400).json({ error: '새로운 상태가 지정되지 않았습니다.' });
    }

    try {
      await pgClient.query('BEGIN');
      
      const updateQuery = `
        UPDATE testcases 
        SET status = $1, updated_at = NOW() 
        WHERE id = ANY($2)
      `;
      await pgClient.query(updateQuery, [newStatus, ids]);
      
      await pgClient.query('COMMIT');
      
      res.json({ 
        success: true, 
        message: `${ids.length}개 테스트 케이스의 상태가 변경되었습니다.`,
        updatedCount: ids.length 
      });
    } catch (error) {
      await pgClient.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('일괄 상태 변경 오류:', error);
    res.status(500).json({ error: '일괄 상태 변경 중 오류가 발생했습니다.' });
  }
}; 