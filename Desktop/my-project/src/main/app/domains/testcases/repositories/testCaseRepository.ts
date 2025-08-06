import { getPgClient, ensurePgConnected } from '../../../infrastructure/database/pgClient';
import { TestCase, TestCaseVersion } from '../types';

export async function createTestCase(tc: Omit<TestCase, 'id' | 'createdAt' | 'updatedAt'>): Promise<TestCase> {
    await ensurePgConnected();
    const pgClient = getPgClient();
    if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    
    // 새로운 구조에 맞게 매핑
    const result = await pgClient.query(
        `INSERT INTO testcases (title, prereq, steps, expected, priority, tags, status, created_by, folder_id, sort_order) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [
            tc.title, 
            tc.prereq, 
            JSON.stringify(tc.steps), 
            tc.expected, 
            tc.priority, 
            tc.tags, 
            tc.status, 
            tc.createdBy,
            tc.folderId || null,
            tc.sortOrder || 0
        ]
    );
    return rowToTestCase(result.rows[0]);
}

export async function getTestCaseById(id: number): Promise<TestCase | null> {
    await ensurePgConnected();
    const pgClient = getPgClient();
    if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    const result = await pgClient.query('SELECT * FROM testcases WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return rowToTestCase(result.rows[0]);
}

export async function updateTestCase(id: number, patch: Partial<TestCase>): Promise<TestCase | null> {
    await ensurePgConnected();
    const pgClient = getPgClient();
    if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    const current = await getTestCaseById(id);
    if (!current) return null;
    const result = await pgClient.query(
        `UPDATE testcases SET title=$1, prereq=$2, steps=$3, expected=$4, priority=$5, tags=$6, status=$7, updated_at=NOW() WHERE id=$8 RETURNING *`,
        [
            patch.title ?? current.title,
            patch.prereq ?? current.prereq,
            JSON.stringify(patch.steps ?? current.steps),
            patch.expected ?? current.expected,
            patch.priority ?? current.priority,
            patch.tags ?? current.tags,
            patch.status ?? current.status,
            id
        ]
    );
    if (result.rows.length === 0) return null;
    return rowToTestCase(result.rows[0]);
}

export async function deleteTestCase(id: number): Promise<boolean> {
    await ensurePgConnected();
    const pgClient = getPgClient();
    if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    await pgClient.query('DELETE FROM testcase_versions WHERE testcase_id = $1', [id]);
    const result = await pgClient.query('DELETE FROM testcases WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
}

export async function listTestCases(): Promise<TestCase[]> {
    await ensurePgConnected();
    const pgClient = getPgClient();
    if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    const result = await pgClient.query('SELECT * FROM testcases ORDER BY id DESC');
    return result.rows.map(rowToTestCase);
}

export async function getTestCasesByFolderId(folderId: number): Promise<TestCase[]> {
    await ensurePgConnected();
    const pgClient = getPgClient();
    if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    const result = await pgClient.query('SELECT * FROM testcases WHERE folder_id = $1 ORDER BY sort_order, id', [folderId]);
    return result.rows.map(rowToTestCase);
}

export async function createTestCaseVersion(tcVersion: Omit<TestCaseVersion, 'id' | 'createdAt'>): Promise<TestCaseVersion> {
    await ensurePgConnected();
    const pgClient = getPgClient();
    if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    const result = await pgClient.query(
        `INSERT INTO testcase_versions (testcase_id, version, data, created_by) VALUES ($1, $2, $3, $4) RETURNING *`,
        [tcVersion.testcaseId, tcVersion.version, JSON.stringify(tcVersion.data), tcVersion.createdBy]
    );
    return rowToTestCaseVersion(result.rows[0]);
}

export async function listTestCaseVersions(testcaseId: number): Promise<TestCaseVersion[]> {
    await ensurePgConnected();
    const pgClient = getPgClient();
    if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    const result = await pgClient.query('SELECT * FROM testcase_versions WHERE testcase_id = $1 ORDER BY version DESC', [testcaseId]);
    return result.rows.map(rowToTestCaseVersion);
}

function rowToTestCase(row: any): TestCase {
    // steps 필드 안전한 파싱
    let steps: string[] = [];
    if (row.steps) {
        try {
            // JSON 문자열인 경우
            if (typeof row.steps === 'string' && row.steps.startsWith('[')) {
                steps = JSON.parse(row.steps);
            } else {
                // 일반 텍스트인 경우 배열로 변환
                steps = [row.steps];
            }
        } catch (error) {
            // 파싱 실패 시 빈 배열로 설정
            steps = [];
        }
    }

    return {
        id: row.id,
        title: row.title,
        prereq: row.prereq,
        steps: steps,
        expected: row.expected,
        priority: row.priority,
        tags: row.tags,
        status: row.status,
        createdBy: row.created_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        folderId: row.folder_id,
        sortOrder: row.sort_order,
    };
}

function rowToTestCaseVersion(row: any): TestCaseVersion {
    let dataObj;
    if (typeof row.data === 'string') {
        dataObj = JSON.parse(row.data);
    } else {
        dataObj = row.data;
    }
    return {
        id: row.id,
        testcaseId: row.testcase_id,
        version: row.version,
        data: dataObj,
        createdAt: row.created_at,
        createdBy: row.created_by,
    };
} 