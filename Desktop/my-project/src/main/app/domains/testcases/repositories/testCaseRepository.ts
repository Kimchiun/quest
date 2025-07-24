import pgClient, { ensurePgConnected } from '../../../infrastructure/database/pgClient';
import { TestCase, TestCaseVersion } from '../models/TestCase';

export async function createTestCase(tc: Omit<TestCase, 'id' | 'createdAt' | 'updatedAt'>): Promise<TestCase> {
    await ensurePgConnected();
    const result = await pgClient.query(
        `INSERT INTO testcases (title, prereq, steps, expected, priority, tags, status, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [tc.title, tc.prereq, JSON.stringify(tc.steps), tc.expected, tc.priority, tc.tags, tc.status, tc.createdBy]
    );
    return rowToTestCase(result.rows[0]);
}

export async function getTestCaseById(id: number): Promise<TestCase | null> {
    await ensurePgConnected();
    const result = await pgClient.query('SELECT * FROM testcases WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return rowToTestCase(result.rows[0]);
}

export async function updateTestCase(id: number, patch: Partial<TestCase>): Promise<TestCase | null> {
    await ensurePgConnected();
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
    await pgClient.query('DELETE FROM testcase_versions WHERE testcase_id = $1', [id]);
    const result = await pgClient.query('DELETE FROM testcases WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
}

export async function listTestCases(): Promise<TestCase[]> {
    await ensurePgConnected();
    const result = await pgClient.query('SELECT * FROM testcases ORDER BY id DESC');
    return result.rows.map(rowToTestCase);
}

export async function createTestCaseVersion(tcVersion: Omit<TestCaseVersion, 'id' | 'createdAt'>): Promise<TestCaseVersion> {
    await ensurePgConnected();
    const result = await pgClient.query(
        `INSERT INTO testcase_versions (testcase_id, version, data, created_by) VALUES ($1, $2, $3, $4) RETURNING *`,
        [tcVersion.testcaseId, tcVersion.version, JSON.stringify(tcVersion.data), tcVersion.createdBy]
    );
    return rowToTestCaseVersion(result.rows[0]);
}

export async function listTestCaseVersions(testcaseId: number): Promise<TestCaseVersion[]> {
    await ensurePgConnected();
    const result = await pgClient.query('SELECT * FROM testcase_versions WHERE testcase_id = $1 ORDER BY version DESC', [testcaseId]);
    return result.rows.map(rowToTestCaseVersion);
}

function rowToTestCase(row: any): TestCase {
    return {
        id: row.id,
        title: row.title,
        prereq: row.prereq,
        steps: JSON.parse(row.steps),
        expected: row.expected,
        priority: row.priority,
        tags: row.tags,
        status: row.status,
        createdBy: row.created_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
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