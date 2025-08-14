import { Folder, FolderTree } from '../models/Folder';
import { getPgClient } from '../../../infrastructure/database/pgClient';

export async function createFolder(data: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>): Promise<Folder> {
    try {
        const pgClient = getPgClient();
        if (!pgClient) {
            throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
        }

        const result = await pgClient.query(`
            INSERT INTO tree_nodes (name, type, parent_id, sort_order, created_by)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, type, parent_id, sort_order, created_by, created_at, updated_at
        `, [data.name, 'folder', data.parentId, data.orderIndex, data.createdBy]);

        const row = result.rows[0];
        return {
            id: row.id,
            projectId: data.projectId,
            parentId: row.parent_id,
            name: row.name,
            description: data.description || '',
            orderIndex: row.sort_order,
            depth: data.depth || 0,
            createdBy: row.created_by,
            updatedBy: data.createdBy,
            isLocked: false,
            isArchived: false,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    } catch (error) {
        console.error('폴더 생성 실패:', error);
        throw error;
    }
}

export async function getFolderById(id: number): Promise<Folder | null> {
    try {
        const pgClient = getPgClient();
        if (!pgClient) {
            throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
        }

        console.log(`🔍 폴더 조회 시도: ID ${id}`);
        
        // 먼저 모든 폴더를 조회해서 데이터베이스 연결 확인
        const allFolders = await pgClient.query(`
            SELECT id, name, type FROM tree_nodes WHERE type = 'folder' ORDER BY id
        `);
        console.log(`🔍 전체 폴더 수: ${allFolders.rows.length}개`);
        allFolders.rows.forEach(row => {
            console.log(`  - ID: ${row.id}, 이름: ${row.name}`);
        });
        
        const result = await pgClient.query(`
            SELECT id, name, type, parent_id, sort_order, created_by, created_at, updated_at
            FROM tree_nodes 
            WHERE id = $1 AND type = 'folder'
        `, [id]);

        console.log(`🔍 쿼리 결과: ${result.rows.length}개 행`);
        if (result.rows.length === 0) {
            console.log(`❌ 폴더를 찾을 수 없음: ID ${id}`);
            return null;
        }

        const row = result.rows[0];
        console.log(`✅ 폴더 찾음: ${row.name} (ID: ${row.id})`);
        return {
            id: row.id,
            projectId: 1, // 기본값
            parentId: row.parent_id,
            name: row.name,
            description: '',
            orderIndex: row.sort_order,
            depth: 0, // 기본값
            createdBy: row.created_by,
            updatedBy: row.created_by,
            isLocked: false,
            isArchived: false,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    } catch (error) {
        console.error('폴더 조회 실패:', error);
        return null;
    }
}

export async function updateFolder(id: number, data: Partial<Folder> & { updatedBy?: string }): Promise<Folder | null> {
    try {
        const pgClient = getPgClient();
        if (!pgClient) {
            throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
        }

        const result = await pgClient.query(`
            UPDATE tree_nodes 
            SET name = $1, parent_id = $2, sort_order = $3, updated_at = NOW()
            WHERE id = $4 AND type = 'folder'
            RETURNING id, name, type, parent_id, sort_order, created_by, created_at, updated_at
        `, [data.name, data.parentId, data.orderIndex, id]);

        if (result.rows.length === 0) {
            return null;
        }

        const row = result.rows[0];
        return {
            id: row.id,
            projectId: 1, // 기본값
            parentId: row.parent_id,
            name: row.name,
            description: '',
            orderIndex: row.sort_order,
            depth: 0, // 기본값
            createdBy: row.created_by,
            updatedBy: data.updatedBy || row.created_by,
            isLocked: false,
            isArchived: false,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    } catch (error) {
        console.error('폴더 업데이트 실패:', error);
        return null;
    }
}

export async function deleteFolder(id: number, mode: 'soft' | 'hard' = 'soft', deletedBy: string): Promise<boolean> {
    try {
        const pgClient = getPgClient();
        if (!pgClient) {
            throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
        }

        // 현재는 하드 삭제만 지원
        const result = await pgClient.query(`
            DELETE FROM tree_nodes 
            WHERE id = $1 AND type = 'folder'
        `, [id]);
        return (result.rowCount || 0) > 0;
    } catch (error) {
        console.error('폴더 삭제 실패:', error);
        return false;
    }
}

export async function listFolders(params: {
    parentId?: number;
    projectId?: number;
} = {}): Promise<Folder[]> {
    try {
        const pgClient = getPgClient();
        if (!pgClient) {
            throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
        }

        let query = `
            SELECT id, name, type, parent_id, sort_order, created_by, created_at, updated_at
            FROM tree_nodes 
            WHERE type = 'folder'
        `;
        const queryParams: any[] = [];
        let paramIndex = 1;

        if (params.parentId !== undefined) {
            query += ` AND parent_id = $${paramIndex}`;
            queryParams.push(params.parentId);
            paramIndex++;
        }

        // project_id 컬럼이 없으므로 제거
        // if (params.projectId !== undefined) {
        //     query += ` AND project_id = $${paramIndex}`;
        //     queryParams.push(params.projectId);
        // }

        query += ` ORDER BY sort_order`;

        const result = await pgClient.query(query, queryParams);

        return result.rows.map((row: any) => ({
            id: row.id,
            projectId: params.projectId || 1,
            parentId: row.parent_id,
            name: row.name,
            description: '',
            orderIndex: row.sort_order,
            depth: 0, // 기본값
            createdBy: row.created_by,
            updatedBy: row.created_by,
            isLocked: false,
            isArchived: false,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));
    } catch (error) {
        console.error('폴더 목록 조회 실패:', error);
        return [];
    }
}

export async function getFolderTree(projectId: number, depth?: number): Promise<FolderTree[]> {
    const allFolders = await listFolders({ projectId });
    const folderMap = new Map<number, FolderTree>();
    const rootFolders: FolderTree[] = [];
    
    // 모든 폴더를 맵에 추가
    allFolders.forEach(folder => {
        if (depth === undefined || folder.depth <= depth) {
            folderMap.set(folder.id, {
                ...folder,
                children: [],
                testCaseCount: 0
            });
        }
    });
    
    // 트리 구조 생성
    allFolders.forEach(folder => {
        if (depth === undefined || folder.depth <= depth) {
            const folderTree = folderMap.get(folder.id)!;
            
            if (folder.parentId && folderMap.has(folder.parentId)) {
                const parent = folderMap.get(folder.parentId)!;
                parent.children!.push(folderTree);
            } else {
                rootFolders.push(folderTree);
            }
        }
    });
    
    // 각 폴더의 테스트 케이스 개수 계산
    for (const folderTree of folderMap.values()) {
        try {
            const pgClient = getPgClient();
            if (pgClient) {
                const result = await pgClient.query(`
                    SELECT COUNT(*) as count 
                    FROM tree_nodes 
                    WHERE type = 'testcase' AND parent_id = $1
                `, [folderTree.id]);
                
                folderTree.testCaseCount = parseInt(result.rows[0].count);
            }
        } catch (error) {
            console.error(`테스트 케이스 개수 계산 실패 (폴더 ID: ${folderTree.id}):`, error);
            folderTree.testCaseCount = 0;
        }
    }
    
    return rootFolders.sort((a, b) => a.orderIndex - b.orderIndex);
} 