import pgClient from '../../../infrastructure/database/pgClient';
import { Folder, FolderTree } from '../models/Folder';

export async function createFolder(folder: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>): Promise<Folder> {
    const result = await pgClient.query(
        'INSERT INTO folders (name, description, parent_id, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
        [folder.name, folder.description, folder.parentId, folder.createdBy]
    );
    return result.rows[0];
}

export async function getFolderById(id: number): Promise<Folder | null> {
    const result = await pgClient.query('SELECT * FROM folders WHERE id = $1', [id]);
    return result.rows[0] || null;
}

export async function getAllFolders(): Promise<Folder[]> {
    const result = await pgClient.query('SELECT * FROM folders ORDER BY name');
    return result.rows;
}

export async function getFolderTree(): Promise<FolderTree[]> {
    // 모든 폴더 조회
    const folders = await getAllFolders();
    
    // 테스트 케이스 수 조회
    const testCaseCounts = await pgClient.query(`
        SELECT folder_id, COUNT(*) as count 
        FROM case_folders 
        GROUP BY folder_id
    `);
    
    const countMap = new Map<number, number>();
    testCaseCounts.rows.forEach(row => {
        countMap.set(row.folder_id, parseInt(row.count));
    });
    
    // 트리 구조 생성
    const folderMap = new Map<number, FolderTree>();
    const rootFolders: FolderTree[] = [];
    
    folders.forEach(folder => {
        const folderTree: FolderTree = {
            ...folder,
            children: [],
            testCaseCount: countMap.get(folder.id) || 0
        };
        folderMap.set(folder.id, folderTree);
    });
    
    folders.forEach(folder => {
        const folderTree = folderMap.get(folder.id)!;
        if (folder.parentId) {
            const parent = folderMap.get(folder.parentId);
            if (parent) {
                parent.children.push(folderTree);
            }
        } else {
            rootFolders.push(folderTree);
        }
    });
    
    return rootFolders;
}

export async function updateFolder(id: number, updates: Partial<Folder>): Promise<Folder | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;
    
    if (updates.name !== undefined) {
        fields.push(`name = $${paramIndex++}`);
        values.push(updates.name);
    }
    if (updates.description !== undefined) {
        fields.push(`description = $${paramIndex++}`);
        values.push(updates.description);
    }
    if (updates.parentId !== undefined) {
        fields.push(`parent_id = $${paramIndex++}`);
        values.push(updates.parentId);
    }
    
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);
    
    const result = await pgClient.query(
        `UPDATE folders SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
    );
    
    return result.rows[0] || null;
}

export async function deleteFolder(id: number): Promise<boolean> {
    const result = await pgClient.query('DELETE FROM folders WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
}

export async function getTestCasesInFolder(folderId: number): Promise<number[]> {
    const result = await pgClient.query(
        'SELECT testcase_id FROM case_folders WHERE folder_id = $1',
        [folderId]
    );
    return result.rows.map(row => row.testcase_id);
}

export async function addTestCaseToFolder(testCaseId: number, folderId: number): Promise<void> {
    const result = await pgClient.query(
        'INSERT INTO case_folders (testcase_id, folder_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id',
        [testCaseId, folderId]
    );
    if (result.rowCount === 0) {
        throw new Error('이미 해당 폴더에 포함된 테스트케이스입니다.');
    }
}

export async function removeTestCaseFromFolder(testCaseId: number, folderId: number): Promise<void> {
    await pgClient.query(
        'DELETE FROM case_folders WHERE testcase_id = $1 AND folder_id = $2',
        [testCaseId, folderId]
    );
}

export async function moveTestCase(testCaseId: number, fromFolderId: number, toFolderId: number): Promise<void> {
    await pgClient.query('BEGIN');
    try {
        await removeTestCaseFromFolder(testCaseId, fromFolderId);
        await addTestCaseToFolder(testCaseId, toFolderId);
        await pgClient.query('COMMIT');
    } catch (error) {
        await pgClient.query('ROLLBACK');
        throw error;
    }
}

export async function checkCircularReference(folderId: number, newParentId: number): Promise<boolean> {
    if (!newParentId) return false;
    
    const visited = new Set<number>();
    let currentId = newParentId;
    
    while (currentId) {
        if (visited.has(currentId) || currentId === folderId) {
            return true; // 순환 참조 발견
        }
        
        visited.add(currentId);
        const result = await pgClient.query(
            'SELECT parent_id FROM folders WHERE id = $1',
            [currentId]
        );
        
        if (result.rows.length === 0) break;
        currentId = result.rows[0].parent_id;
    }
    
    return false;
} 