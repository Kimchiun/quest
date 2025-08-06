import { getPgClient, ensurePgConnected } from '../../../infrastructure/database/pgClient';
import { Folder, CreateFolderRequest, UpdateFolderRequest } from '../types';

export async function createFolder(folderData: CreateFolderRequest): Promise<Folder> {
    await ensurePgConnected();
    const pgClient = getPgClient();
    if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    
    const result = await pgClient.query(
        `INSERT INTO folders (name, description, parent_id, sort_order, created_by) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
            folderData.name,
            folderData.description,
            folderData.parentId,
            folderData.sortOrder || 0,
            folderData.createdBy
        ]
    );
    return rowToFolder(result.rows[0]);
}

export async function getFolderById(id: number): Promise<Folder | null> {
    await ensurePgConnected();
    const pgClient = getPgClient();
    if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    
    const result = await pgClient.query('SELECT * FROM folders WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return rowToFolder(result.rows[0]);
}

export async function updateFolder(id: number, folderData: UpdateFolderRequest): Promise<Folder | null> {
    await ensurePgConnected();
    const pgClient = getPgClient();
    if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    
    const current = await getFolderById(id);
    if (!current) return null;
    
    const result = await pgClient.query(
        `UPDATE folders SET name=$1, description=$2, parent_id=$3, sort_order=$4, updated_at=NOW() WHERE id=$5 RETURNING *`,
        [
            folderData.name ?? current.name,
            folderData.description ?? current.description,
            folderData.parentId ?? current.parentId,
            folderData.sortOrder ?? current.sortOrder,
            id
        ]
    );
    
    if (result.rows.length === 0) return null;
    return rowToFolder(result.rows[0]);
}

export async function deleteFolder(id: number): Promise<boolean> {
    await ensurePgConnected();
    const pgClient = getPgClient();
    if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    
    // 하위 폴더들을 먼저 삭제
    await pgClient.query('DELETE FROM folders WHERE parent_id = $1', [id]);
    
    // 테스트케이스들의 폴더 참조 제거
    await pgClient.query('UPDATE testcases SET folder_id = NULL WHERE folder_id = $1', [id]);
    
    // 폴더 삭제
    const result = await pgClient.query('DELETE FROM folders WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
}

export async function listFolders(): Promise<Folder[]> {
    await ensurePgConnected();
    const pgClient = getPgClient();
    if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    
    const result = await pgClient.query('SELECT * FROM folders ORDER BY sort_order, name');
    return result.rows.map(rowToFolder);
}

export async function getFoldersByParentId(parentId?: number): Promise<Folder[]> {
    await ensurePgConnected();
    const pgClient = getPgClient();
    if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    
    const query = parentId 
        ? 'SELECT * FROM folders WHERE parent_id = $1 ORDER BY sort_order, name'
        : 'SELECT * FROM folders WHERE parent_id IS NULL ORDER BY sort_order, name';
    
    const params = parentId ? [parentId] : [];
    const result = await pgClient.query(query, params);
    return result.rows.map(rowToFolder);
}

export async function addTestCaseToFolder(testCaseId: number, folderId: number): Promise<boolean> {
    await ensurePgConnected();
    const pgClient = getPgClient();
    if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    
    const result = await pgClient.query(
        'UPDATE testcases SET folder_id = $1 WHERE id = $2',
        [folderId, testCaseId]
    );
    return (result.rowCount ?? 0) > 0;
}

function rowToFolder(row: any): Folder {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        parentId: row.parent_id,
        sortOrder: row.sort_order || 0,
        createdBy: row.created_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
} 