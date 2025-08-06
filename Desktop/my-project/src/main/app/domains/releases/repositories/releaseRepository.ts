import { Client } from 'pg';
import { getPgClient } from '../../../infrastructure/database/pgClient';
import { Release, ReleaseStatus, ReleaseTestCase, ReleaseIssue, ReleaseChangeLog, ReleaseRetrospective } from '../types';

export class ReleaseRepository {
  private async getClient(): Promise<Client | null> {
    return getPgClient();
  }

  async findAll(): Promise<Release[]> {
    const client = await this.getClient();
    if (!client) {
      throw new Error('데이터베이스 연결을 할 수 없습니다.');
    }

    try {
      const query = `
        SELECT 
          r.*,
          COALESCE(tc.test_case_count, 0) as test_case_count,
          COALESCE(tc.passed_count, 0) as passed_count,
          COALESCE(tc.failed_count, 0) as failed_count,
          COALESCE(tc.blocked_count, 0) as blocked_count,
          COALESCE(i.issue_count, 0) as issue_count,
          COALESCE(i.bug_count, 0) as bug_count,
          COALESCE(i.resolved_count, 0) as resolved_count,
          CASE 
            WHEN COALESCE(tc.test_case_count, 0) = 0 THEN 0
            ELSE ROUND((COALESCE(tc.passed_count, 0) * 100.0 / COALESCE(tc.test_case_count, 1)), 2)
          END as progress_percentage
        FROM releases r
        LEFT JOIN (
          SELECT 
            release_id,
            COUNT(*) as test_case_count,
            COUNT(CASE WHEN status = 'PASSED' THEN 1 END) as passed_count,
            COUNT(CASE WHEN status = 'FAILED' THEN 1 END) as failed_count,
            COUNT(CASE WHEN status = 'BLOCKED' THEN 1 END) as blocked_count
          FROM release_test_cases 
          GROUP BY release_id
        ) tc ON r.id = tc.release_id
        LEFT JOIN (
          SELECT 
            release_id,
            COUNT(*) as issue_count,
            COUNT(CASE WHEN type = 'BUG' THEN 1 END) as bug_count,
            COUNT(CASE WHEN status = 'RESOLVED' OR status = 'CLOSED' THEN 1 END) as resolved_count
          FROM release_issues 
          GROUP BY release_id
        ) i ON r.id = i.release_id
        ORDER BY r.created_at DESC
      `;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('릴리즈 목록 조회 실패:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Release | null> {
    const client = await this.getClient();
    if (!client) {
      throw new Error('데이터베이스 연결을 할 수 없습니다.');
    }

    try {
      const query = `
        SELECT 
          r.*,
          COALESCE(tc.test_case_count, 0) as test_case_count,
          COALESCE(tc.passed_count, 0) as passed_count,
          COALESCE(tc.failed_count, 0) as failed_count,
          COALESCE(tc.blocked_count, 0) as blocked_count,
          COALESCE(i.issue_count, 0) as issue_count,
          COALESCE(i.bug_count, 0) as bug_count,
          COALESCE(i.resolved_count, 0) as resolved_count,
          CASE 
            WHEN COALESCE(tc.test_case_count, 0) = 0 THEN 0
            ELSE ROUND((COALESCE(tc.passed_count, 0) * 100.0 / COALESCE(tc.test_case_count, 1)), 2)
          END as progress_percentage
        FROM releases r
        LEFT JOIN (
          SELECT 
            release_id,
            COUNT(*) as test_case_count,
            COUNT(CASE WHEN status = 'PASSED' THEN 1 END) as passed_count,
            COUNT(CASE WHEN status = 'FAILED' THEN 1 END) as failed_count,
            COUNT(CASE WHEN status = 'BLOCKED' THEN 1 END) as blocked_count
          FROM release_test_cases 
          WHERE release_id = $1
          GROUP BY release_id
        ) tc ON r.id = tc.release_id
        LEFT JOIN (
          SELECT 
            release_id,
            COUNT(*) as issue_count,
            COUNT(CASE WHEN type = 'BUG' THEN 1 END) as bug_count,
            COUNT(CASE WHEN status = 'RESOLVED' OR status = 'CLOSED' THEN 1 END) as resolved_count
          FROM release_issues 
          WHERE release_id = $1
          GROUP BY release_id
        ) i ON r.id = i.release_id
        WHERE r.id = $1
      `;

      const result = await client.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('릴리즈 상세 조회 실패:', error);
      throw error;
    }
  }

  async create(release: Omit<Release, 'id' | 'created_at' | 'updated_at' | 'test_case_count' | 'passed_count' | 'failed_count' | 'blocked_count' | 'issue_count' | 'bug_count' | 'resolved_count' | 'progress_percentage'>): Promise<Release> {
    const client = await this.getClient();
    if (!client) {
      throw new Error('데이터베이스 연결을 할 수 없습니다.');
    }

    try {
      const query = `
        INSERT INTO releases (
          name, version, description, status, assignee_id, assignee_name,
          scheduled_date, deployed_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;

      const values = [
        release.name,
        release.version,
        release.description,
        release.status,
        release.assignee_id,
        release.assignee_name,
        release.scheduled_date,
        release.deployed_date
      ];

      const result = await client.query(query, values);
      const newRelease = result.rows[0];
      
      // 생성된 릴리즈의 상세 정보를 다시 조회하여 통계 포함
      return await this.findById(newRelease.id) as Release;
    } catch (error) {
      console.error('릴리즈 생성 실패:', error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<Release>): Promise<Release | null> {
    const client = await this.getClient();
    if (!client) {
      throw new Error('데이터베이스 연결을 할 수 없습니다.');
    }

    try {
      const setClauses = [];
      const values = [];
      let paramIndex = 1;

      if (updates.name !== undefined) {
        setClauses.push(`name = $${paramIndex++}`);
        values.push(updates.name);
      }
      if (updates.version !== undefined) {
        setClauses.push(`version = $${paramIndex++}`);
        values.push(updates.version);
      }
      if (updates.description !== undefined) {
        setClauses.push(`description = $${paramIndex++}`);
        values.push(updates.description);
      }
      if (updates.status !== undefined) {
        setClauses.push(`status = $${paramIndex++}`);
        values.push(updates.status);
      }
      if (updates.assignee_id !== undefined) {
        setClauses.push(`assignee_id = $${paramIndex++}`);
        values.push(updates.assignee_id);
      }
      if (updates.assignee_name !== undefined) {
        setClauses.push(`assignee_name = $${paramIndex++}`);
        values.push(updates.assignee_name);
      }
      if (updates.scheduled_date !== undefined) {
        setClauses.push(`scheduled_date = $${paramIndex++}`);
        values.push(updates.scheduled_date);
      }
      if (updates.deployed_date !== undefined) {
        setClauses.push(`deployed_date = $${paramIndex++}`);
        values.push(updates.deployed_date);
      }

      if (setClauses.length === 0) {
        return await this.findById(id);
      }

      setClauses.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const query = `
        UPDATE releases 
        SET ${setClauses.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await client.query(query, values);
      if ((result.rowCount || 0) === 0) {
        return null;
      }

      return await this.findById(id);
    } catch (error) {
      console.error('릴리즈 업데이트 실패:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    const client = await this.getClient();
    if (!client) {
      throw new Error('데이터베이스 연결을 할 수 없습니다.');
    }

    try {
      // 관련 데이터 먼저 삭제
      await client.query('DELETE FROM release_retrospectives WHERE release_id = $1', [id]);
      await client.query('DELETE FROM release_change_logs WHERE release_id = $1', [id]);
      await client.query('DELETE FROM release_issues WHERE release_id = $1', [id]);
      await client.query('DELETE FROM release_test_cases WHERE release_id = $1', [id]);
      
      // 릴리즈 삭제
      const result = await client.query('DELETE FROM releases WHERE id = $1', [id]);
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('릴리즈 삭제 실패:', error);
      throw error;
    }
  }

  // 릴리즈 테스트 케이스 관련 메서드들
  async findTestCasesByReleaseId(releaseId: string): Promise<ReleaseTestCase[]> {
    const client = await this.getClient();
    if (!client) {
      throw new Error('데이터베이스 연결을 할 수 없습니다.');
    }

    try {
      const query = `
        SELECT * FROM release_test_cases 
        WHERE release_id = $1 
        ORDER BY created_at DESC
      `;
      const result = await client.query(query, [releaseId]);
      return result.rows;
    } catch (error) {
      console.error('릴리즈 테스트 케이스 조회 실패:', error);
      throw error;
    }
  }

  // 릴리즈 이슈 관련 메서드들
  async findIssuesByReleaseId(releaseId: string): Promise<ReleaseIssue[]> {
    const client = await this.getClient();
    if (!client) {
      throw new Error('데이터베이스 연결을 할 수 없습니다.');
    }

    try {
      const query = `
        SELECT * FROM release_issues 
        WHERE release_id = $1 
        ORDER BY created_at DESC
      `;
      const result = await client.query(query, [releaseId]);
      return result.rows;
    } catch (error) {
      console.error('릴리즈 이슈 조회 실패:', error);
      throw error;
    }
  }

  // 릴리즈 변경 로그 관련 메서드들
  async findChangeLogsByReleaseId(releaseId: string): Promise<ReleaseChangeLog[]> {
    const client = await this.getClient();
    if (!client) {
      throw new Error('데이터베이스 연결을 할 수 없습니다.');
    }

    try {
      const query = `
        SELECT * FROM release_change_logs 
        WHERE release_id = $1 
        ORDER BY created_at DESC
      `;
      const result = await client.query(query, [releaseId]);
      return result.rows;
    } catch (error) {
      console.error('릴리즈 변경 로그 조회 실패:', error);
      throw error;
    }
  }

  // 릴리즈 회고 관련 메서드들
  async findRetrospectivesByReleaseId(releaseId: string): Promise<ReleaseRetrospective[]> {
    const client = await this.getClient();
    if (!client) {
      throw new Error('데이터베이스 연결을 할 수 없습니다.');
    }

    try {
      const query = `
        SELECT * FROM release_retrospectives 
        WHERE release_id = $1 
        ORDER BY created_at DESC
      `;
      const result = await client.query(query, [releaseId]);
      return result.rows;
    } catch (error) {
      console.error('릴리즈 회고 조회 실패:', error);
      throw error;
    }
  }
}