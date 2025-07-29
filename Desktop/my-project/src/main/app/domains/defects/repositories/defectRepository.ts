import pgClient from '../../../infrastructure/database/pgClient';
import { Defect, DefectStatus, DefectPriority } from '../models/Defect';

export interface DefectListParams {
    page: number;
    size: number;
    status?: string;
    priority?: string;
    assignee?: string;
}

class DefectRepository {
    async create(defect: Omit<Defect, 'id'>): Promise<Defect> {
        const query = `
            INSERT INTO defects (
                title, description, status, priority, assignee, reporter, 
                created_by, test_case_id, release_id, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `;
        
        const values = [
            defect.title,
            defect.description,
            defect.status,
            defect.priority,
            defect.assignee,
            defect.reporter,
            defect.createdBy,
            defect.testCaseId,
            defect.releaseId,
            defect.createdAt,
            defect.updatedAt
        ];
        
        const result = await pgClient.query(query, values);
        return result.rows[0];
    }

    async update(id: number, updates: Partial<Defect>): Promise<Defect | null> {
        const setClause = Object.keys(updates)
            .filter(key => key !== 'id')
            .map((key, index) => `${key} = $${index + 2}`)
            .join(', ');
        
        const query = `
            UPDATE defects 
            SET ${setClause}
            WHERE id = $1
            RETURNING *
        `;
        
        const values = [id, ...Object.values(updates).filter(val => val !== undefined)];
        const result = await pgClient.query(query, values);
        
        return result.rows[0] || null;
    }

    async delete(id: number): Promise<boolean> {
        const query = 'DELETE FROM defects WHERE id = $1';
        const result = await pgClient.query(query, [id]);
        return (result.rowCount || 0) > 0;
    }

    async findById(id: number): Promise<Defect | null> {
        const query = 'SELECT * FROM defects WHERE id = $1';
        const result = await pgClient.query(query, [id]);
        return result.rows[0] || null;
    }

    async findWithPagination(params: DefectListParams): Promise<{
        defects: Defect[];
        total: number;
    }> {
        let whereClause = 'WHERE 1=1';
        const values: any[] = [];
        let valueIndex = 1;

        if (params.status) {
            whereClause += ` AND status = $${valueIndex++}`;
            values.push(params.status);
        }

        if (params.priority) {
            whereClause += ` AND priority = $${valueIndex++}`;
            values.push(params.priority);
        }

        if (params.assignee) {
            whereClause += ` AND assignee = $${valueIndex++}`;
            values.push(params.assignee);
        }

        // 총 개수 조회
        const countQuery = `SELECT COUNT(*) FROM defects ${whereClause}`;
        const countResult = await pgClient.query(countQuery, values);
        const total = parseInt(countResult.rows[0].count);

        // 페이지네이션된 데이터 조회
        const offset = params.page * params.size;
        const dataQuery = `
            SELECT * FROM defects 
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT $${valueIndex} OFFSET $${valueIndex + 1}
        `;
        
        const dataResult = await pgClient.query(dataQuery, [...values, params.size, offset]);
        
        return {
            defects: dataResult.rows,
            total
        };
    }
}

export const defectRepository = new DefectRepository(); 