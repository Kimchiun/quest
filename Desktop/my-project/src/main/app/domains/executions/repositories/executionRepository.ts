import { Execution } from '../models/Execution';
import { getPgClient, ensurePgConnected } from '../../../infrastructure/database/pgClient';

export const executionRepository = {
    async insert(execution: Omit<Execution, 'id' | 'createdAt' | 'updatedAt'>): Promise<Execution> {
        await ensurePgConnected();
        const pgClient = getPgClient();
        if (!pgClient) {
            throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
        }
        const now = new Date();
        const result = await pgClient.query(
            `INSERT INTO executions 
                (testcase_id, suite_id, release_id, status, executed_by, executed_at, repro_steps, screenshot_path, log_file_path, comment, created_at, updated_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
             RETURNING *`,
            [
                execution.testcaseId,
                execution.suiteId ?? null,
                execution.releaseId ?? null,
                execution.status,
                execution.executedBy,
                execution.executedAt,
                execution.reproSteps ?? null,
                execution.screenshotPath ?? null,
                execution.logFilePath ?? null,
                execution.comment ?? null,
                now,
                now
            ]
        );
        return mapRowToExecution(result.rows[0]);
    },

    async findById(id: number): Promise<Execution | null> {
        await ensurePgConnected();
        const pgClient = getPgClient();
        if (!pgClient) {
            throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
        }
        const result = await pgClient.query('SELECT * FROM executions WHERE id = $1', [id]);
        return result.rows[0] ? mapRowToExecution(result.rows[0]) : null;
    },

    async findByTestCase(testcaseId: number): Promise<Execution[]> {
        await ensurePgConnected();
        const pgClient = getPgClient();
        if (!pgClient) {
            throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
        }
        const result = await pgClient.query('SELECT * FROM executions WHERE testcase_id = $1', [testcaseId]);
        return result.rows.map(mapRowToExecution);
    },

    async update(id: number, update: Partial<Omit<Execution, 'id' | 'createdAt'>>): Promise<Execution | null> {
        await ensurePgConnected();
        const pgClient = getPgClient();
        if (!pgClient) {
            throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
        }
        // 동적 쿼리 빌드(간단화)
        const fields = Object.keys(update);
        if (fields.length === 0) return this.findById(id);
        const setClause = fields.map((f, i) => `${toSnakeCase(f)} = $${i + 1}`).join(', ');
        const values = fields.map(f => (update as any)[f]);
        values.push(new Date()); // updated_at
        const result = await pgClient.query(
            `UPDATE executions SET ${setClause}, updated_at = $${fields.length + 1} WHERE id = $${fields.length + 2} RETURNING *`,
            [...values, id]
        );
        return result.rows[0] ? mapRowToExecution(result.rows[0]) : null;
    },

    async delete(id: number): Promise<void> {
        await ensurePgConnected();
        const pgClient = getPgClient();
        if (!pgClient) {
            throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
        }
        await pgClient.query('DELETE FROM executions WHERE id = $1', [id]);
    }
};

function mapRowToExecution(row: any): Execution {
    return {
        id: row.id,
        testcaseId: row.testcase_id,
        suiteId: row.suite_id,
        releaseId: row.release_id,
        status: row.status,
        executedBy: row.executed_by,
        executedAt: row.executed_at,
        reproSteps: row.repro_steps,
        screenshotPath: row.screenshot_path,
        logFilePath: row.log_file_path,
        comment: row.comment,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

function toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
} 