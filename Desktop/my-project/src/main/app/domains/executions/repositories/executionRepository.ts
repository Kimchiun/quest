import { Execution } from '../types';
import { getPgClient, ensurePgConnected } from '../../../infrastructure/database/pgClient';

export const executionRepository = {
    async insert(execution: Omit<Execution, 'id' | 'createdAt' | 'updatedAt'>): Promise<Execution> {
        await ensurePgConnected();
        const pgClient = getPgClient();
        if (!pgClient) {
            throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
        }
        const now = new Date();
        
        console.log('Inserting execution:', execution);
        
        const sql = `INSERT INTO executions 
            (testcase_id, release_id, status, executed_by, executed_at, comments, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`;
        
        const params = [
            execution.testcaseId,
            execution.releaseId,
            execution.status,
            execution.executedBy,
            execution.executedAt,
            execution.comment || null,
            now,
            now
        ];
        
        console.log('Executing SQL:', sql);
        console.log('With params:', params);
        
        const result = await pgClient.query(sql, params);
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
        
        const setClauses: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;
        
        if (update.status !== undefined) {
            setClauses.push(`status = $${paramIndex++}`);
            values.push(update.status);
        }
        
        if (update.executedBy !== undefined) {
            setClauses.push(`executed_by = $${paramIndex++}`);
            values.push(update.executedBy);
        }
        
        if (update.executedAt !== undefined) {
            setClauses.push(`executed_at = $${paramIndex++}`);
            values.push(update.executedAt);
        }
        
        if (update.comment !== undefined) {
            setClauses.push(`comments = $${paramIndex++}`);
            values.push(update.comment);
        }
        
        if (setClauses.length === 0) return this.findById(id);
        
        setClauses.push(`updated_at = $${paramIndex++}`);
        values.push(new Date());
        values.push(id);
        
        const result = await pgClient.query(
            `UPDATE executions SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            values
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
        releaseId: row.release_id,
        status: row.status,
        executedBy: row.executed_by,
        executedAt: row.executed_at,
        comment: row.comments,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}