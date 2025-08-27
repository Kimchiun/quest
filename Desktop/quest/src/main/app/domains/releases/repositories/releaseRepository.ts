import { Release, ReleaseScope, ReleaseCase, Run, DefectLink, Environment } from '../entities/release';

export class ReleaseRepository {
  // 모든 릴리즈 조회
  async findAll(): Promise<Release[]> {
    try {
      const { getPgClient } = await import('../../../infrastructure/database/pgClient');
      const pgClient = getPgClient();
      
      if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
      }

      const result = await pgClient.query(`
        SELECT 
          id,
          name,
          version,
          description,
          status,
          assignee_name,
          scheduled_date,
          deployed_date,
          created_at,
          updated_at
        FROM releases
        ORDER BY created_at DESC
      `);

      return result.rows.map((row: any) => ({
        id: row.id,
        projectId: '1',
        name: row.name,
        version: row.version,
        description: row.description || '',
        status: row.status,
        startAt: row.scheduled_date,
        endAt: row.deployed_date,
        owners: row.assignee_name ? [row.assignee_name] : [],
        assignee_name: row.assignee_name,
        watchers: [],
        tags: [],
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        settings: {
          gateCriteria: {
            minPassRate: 85,
            maxFailCritical: 0,
            zeroBlockers: true,
            coverageByPriority: {
              P0: 100,
              P1: 95,
              P2: 90
            }
          },
          autoSyncScope: true,
          allowReopen: false
        }
      }));
    } catch (error) {
      console.error('릴리즈 조회 실패:', error);
      return []; // 실패 시 빈 배열 반환
    }
  }

  // ID로 릴리즈 조회
  async findById(id: string): Promise<Release | null> {
    try {
      const { getPgClient } = await import('../../../infrastructure/database/pgClient');
      const pgClient = getPgClient();
      
      if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
      }

      const result = await pgClient.query(`
        SELECT 
          id,
          name,
          version,
          description,
          status,
          assignee_name,
          scheduled_date,
          deployed_date,
          created_at,
          updated_at
        FROM releases
        WHERE id = $1
      `, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: String(row.id),
        projectId: '1',
        name: row.name,
        version: row.version,
        description: row.description || '',
        status: row.status,
        startAt: row.scheduled_date,
        endAt: row.deployed_date,
        owners: row.assignee_name ? [row.assignee_name] : [],
        assignee_name: row.assignee_name,
        watchers: [],
        tags: [],
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        settings: {
          gateCriteria: {
            minPassRate: 85,
            maxFailCritical: 0,
            zeroBlockers: true,
            coverageByPriority: {
              P0: 100,
              P1: 95,
              P2: 90
            }
          },
          autoSyncScope: true,
          allowReopen: false
        }
      };
    } catch (error) {
      console.error('릴리즈 조회 실패:', error);
      return null;
    }
  }

  // 프로젝트별 릴리즈 조회
  async findByProjectId(projectId: string): Promise<Release[]> {
    try {
      const { getPgClient } = await import('../../../infrastructure/database/pgClient');
      const pgClient = getPgClient();
      
      if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
      }

      const result = await pgClient.query(`
        SELECT 
          id,
          name,
          version,
          description,
          status,
          assignee_name,
          scheduled_date,
          deployed_date,
          created_at,
          updated_at
        FROM releases
        ORDER BY created_at DESC
      `);

      return result.rows.map((row: any) => ({
        id: row.id,
        projectId: '1',
        name: row.name,
        version: row.version,
        description: row.description || '',
        status: row.status,
        startAt: row.scheduled_date,
        endAt: row.deployed_date,
        owners: row.assignee_name ? [row.assignee_name] : [],
        assignee_name: row.assignee_name,
        watchers: [],
        tags: [],
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        settings: {
          gateCriteria: {
            minPassRate: 85,
            maxFailCritical: 0,
            zeroBlockers: true,
            coverageByPriority: {
              P0: 100,
              P1: 95,
              P2: 90
            }
          },
          autoSyncScope: true,
          allowReopen: false
        }
      }));
    } catch (error) {
      console.error('프로젝트별 릴리즈 조회 실패:', error);
      return [];
    }
  }

  // 릴리즈 생성
  async create(releaseData: Omit<Release, 'id' | 'createdAt' | 'updatedAt'>): Promise<Release> {
    try {
      const { getPgClient } = await import('../../../infrastructure/database/pgClient');
      const pgClient = getPgClient();
      
      if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
      }

      const now = new Date().toISOString();
      
      const result = await pgClient.query(`
        INSERT INTO releases (
          name, version, description, status, assignee_name, 
          scheduled_date, deployed_date, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        releaseData.name,
        releaseData.version,
        releaseData.description || '',
        releaseData.status,
        releaseData.assignee || releaseData.owners?.[0] || null,
        releaseData.startAt || null,
        releaseData.endAt || null,
        now,
        now
      ]);

      const createdRelease = result.rows[0];
      
      return {
        id: createdRelease.id,
        projectId: '1',
        name: createdRelease.name,
        version: createdRelease.version,
        description: createdRelease.description || '',
        status: createdRelease.status,
        startAt: createdRelease.scheduled_date,
        endAt: createdRelease.deployed_date,
        owners: createdRelease.assignee_name ? [createdRelease.assignee_name] : [],
        assignee_name: createdRelease.assignee_name,
        watchers: [],
        tags: [],
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: createdRelease.created_at,
        updatedAt: createdRelease.updated_at,
        settings: {
          gateCriteria: {
            minPassRate: 85,
            maxFailCritical: 0,
            zeroBlockers: true,
            coverageByPriority: {
              P0: 100,
              P1: 95,
              P2: 90
            }
          },
          autoSyncScope: true,
          allowReopen: false
        }
      };
    } catch (error) {
      console.error('릴리즈 생성 실패:', error);
      throw error;
    }
  }

  // 릴리즈 업데이트
  async update(id: string, updateData: Partial<Release>): Promise<Release | null> {
    try {
      const { getPgClient } = await import('../../../infrastructure/database/pgClient');
      const pgClient = getPgClient();
      
      if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
      }

      const now = new Date().toISOString();
      
      const result = await pgClient.query(`
        UPDATE releases 
        SET 
          name = COALESCE($1, name),
          version = COALESCE($2, version),
          description = COALESCE($3, description),
          status = COALESCE($4, status),
          assignee_name = COALESCE($5, assignee_name),
          scheduled_date = COALESCE($6, scheduled_date),
          deployed_date = COALESCE($7, deployed_date),
          updated_at = $8
        WHERE id = $9
        RETURNING *
      `, [
        updateData.name,
        updateData.version,
        updateData.description,
        updateData.status,
        updateData.owners?.[0] || null,
        updateData.startAt,
        updateData.endAt,
        now,
        id
      ]);

      if (result.rows.length === 0) {
        return null;
      }

      const updatedRelease = result.rows[0];
      
      return {
        id: updatedRelease.id,
        projectId: '1',
        name: updatedRelease.name,
        version: updatedRelease.version,
        description: updatedRelease.description || '',
        status: updatedRelease.status,
        startAt: updatedRelease.scheduled_date,
        endAt: updatedRelease.deployed_date,
        owners: updatedRelease.assignee_name ? [updatedRelease.assignee_name] : [],
        watchers: [],
        tags: [],
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: updatedRelease.created_at,
        updatedAt: updatedRelease.updated_at,
        settings: {
          gateCriteria: {
            minPassRate: 85,
            maxFailCritical: 0,
            zeroBlockers: true,
            coverageByPriority: {
              P0: 100,
              P1: 95,
              P2: 90
            }
          },
          autoSyncScope: true,
          allowReopen: false
        }
      };
    } catch (error) {
      console.error('릴리즈 업데이트 실패:', error);
      throw error;
    }
  }

  // 릴리즈 삭제 (메모리 배열 기반 - deprecated)
  async delete(id: string): Promise<boolean> {
    try {
      await this.deleteRelease(id);
      return true;
    } catch (error) {
      console.error('릴리즈 삭제 실패:', error);
      return false;
    }
  }

  // 상태별 릴리즈 조회
  async findByStatus(status: Release['status']): Promise<Release[]> {
    try {
      const { getPgClient } = await import('../../../infrastructure/database/pgClient');
      const pgClient = getPgClient();
      
      if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
      }

      const result = await pgClient.query(`
        SELECT 
          id,
          name,
          version,
          description,
          status,
          assignee_name,
          scheduled_date,
          deployed_date,
          created_at,
          updated_at
        FROM releases
        WHERE status = $1
        ORDER BY created_at DESC
      `, [status]);

      return result.rows.map((row: any) => ({
        id: row.id,
        projectId: '1',
        name: row.name,
        version: row.version,
        description: row.description || '',
        status: row.status,
        startAt: row.scheduled_date,
        endAt: row.deployed_date,
        owners: row.assignee_name ? [row.assignee_name] : [],
        assignee_name: row.assignee_name,
        watchers: [],
        tags: [],
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        settings: {
          gateCriteria: {
            minPassRate: 85,
            maxFailCritical: 0,
            zeroBlockers: true,
            coverageByPriority: {
              P0: 100,
              P1: 95,
              P2: 90
            }
          },
          autoSyncScope: true,
          allowReopen: false
        }
      }));
    } catch (error) {
      console.error('상태별 릴리즈 조회 실패:', error);
      return [];
    }
  }

  // 검색어로 릴리즈 조회
  async search(query: string): Promise<Release[]> {
    try {
      const { getPgClient } = await import('../../../infrastructure/database/pgClient');
      const pgClient = getPgClient();
      
      if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
      }

      const searchPattern = `%${query}%`;
      
      const result = await pgClient.query(`
        SELECT 
          id,
          name,
          version,
          description,
          status,
          assignee_name,
          scheduled_date,
          deployed_date,
          created_at,
          updated_at
        FROM releases
        WHERE 
          name ILIKE $1 OR 
          description ILIKE $1 OR 
          version ILIKE $1
        ORDER BY created_at DESC
      `, [searchPattern]);

      return result.rows.map((row: any) => ({
        id: row.id,
        projectId: '1',
        name: row.name,
        version: row.version,
        description: row.description || '',
        status: row.status,
        startAt: row.scheduled_date,
        endAt: row.deployed_date,
        owners: row.assignee_name ? [row.assignee_name] : [],
        assignee_name: row.assignee_name,
        watchers: [],
        tags: [],
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        settings: {
          gateCriteria: {
            minPassRate: 85,
            maxFailCritical: 0,
            zeroBlockers: true,
            coverageByPriority: {
              P0: 100,
              P1: 95,
              P2: 90
            }
          },
          autoSyncScope: true,
          allowReopen: false
        }
      }));
    } catch (error) {
      console.error('릴리즈 검색 실패:', error);
      return [];
    }
  }

  // 릴리즈 스코프 업데이트
  async updateScope(releaseId: string, scope: ReleaseScope): Promise<Release | null> {
    const release = await this.findById(releaseId);
    if (!release) return null;

    // 실제로는 ReleaseScope 엔티티를 업데이트하는 로직이 필요
    return this.update(releaseId, { updatedAt: new Date().toISOString() });
  }

  // 릴리즈 케이스 추가
  async addCase(releaseId: string, releaseCase: ReleaseCase): Promise<Release | null> {
    const release = await this.findById(releaseId);
    if (!release) return null;

    // 실제로는 ReleaseCase를 추가하는 로직이 필요
    return this.update(releaseId, { updatedAt: new Date().toISOString() });
  }

  // 릴리즈 케이스 업데이트
  async updateCase(releaseId: string, caseId: string, updates: Partial<ReleaseCase>): Promise<Release | null> {
    const release = await this.findById(releaseId);
    if (!release) return null;

    // 실제로는 ReleaseCase를 업데이트하는 로직이 필요
    return this.update(releaseId, { updatedAt: new Date().toISOString() });
  }

  // 실행 결과 저장
  async saveRun(releaseId: string, run: Run): Promise<Release | null> {
    const release = await this.findById(releaseId);
    if (!release) return null;

    // 실제로는 Run을 저장하는 로직이 필요
    return this.update(releaseId, { updatedAt: new Date().toISOString() });
  }

  // 결함 링크 추가
  async addDefectLink(releaseId: string, defectLink: DefectLink): Promise<Release | null> {
    const release = await this.findById(releaseId);
    if (!release) return null;

    // 실제로는 DefectLink를 추가하는 로직이 필요
    return this.update(releaseId, { updatedAt: new Date().toISOString() });
  }

  // 환경 정보 업데이트
  async updateEnvironment(releaseId: string, environment: Environment): Promise<Release | null> {
    const release = await this.findById(releaseId);
    if (!release) return null;

    // 실제로는 Environment를 업데이트하는 로직이 필요
    return this.update(releaseId, { updatedAt: new Date().toISOString() });
  }

  // 게이트 기준 업데이트
  async updateGateCriteria(releaseId: string, gateCriteria: Release['settings']['gateCriteria']): Promise<Release | null> {
    const release = await this.findById(releaseId);
    if (!release) return null;

    return this.update(releaseId, {
      settings: {
        ...release.settings,
        gateCriteria
      }
    });
  }

  // 릴리즈 테스트 케이스 조회
  async getTestCases(releaseId: string): Promise<any[]> {
    try {
      const { getPgClient } = await import('../../../infrastructure/database/pgClient');
      const pgClient = getPgClient();
      
      if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
      }

      // release_test_cases 테이블과 testcases 테이블을 조인하여 모든 상세 정보 조회
      const result = await pgClient.query(`
        SELECT 
          tc.id,
          tc.title,
          tc.prereq as description,
          tc.steps,
          tc.expected,
          tc.priority,
          tc.status,
          tc.created_by,
          tc.created_at,
          tc.updated_at,
          rtc.status as execution_status,
          rtc.assignee_name as assigned_to,
          rtc.executed_at,
          tc.folder_id
        FROM testcases tc
        INNER JOIN release_test_cases rtc ON tc.id = rtc.test_case_id
        WHERE rtc.release_id = $1
        ORDER BY tc.id
      `, [releaseId]);

      return result.rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description || '',
        steps: row.steps || '',
        expected: row.expected || '',
        priority: row.priority,
        status: row.status,
        createdBy: row.created_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        executionStatus: row.execution_status,
        assignedTo: row.assigned_to,
        executedAt: row.executed_at,
        executedBy: '', // executed_by 컬럼이 없으므로 빈 문자열로 설정
        folderId: row.folder_id
      }));
    } catch (error) {
      console.error('릴리즈 테스트 케이스 조회 실패:', error);
      // 에러 발생 시 빈 배열 반환
      return [];
    }
  }

  // 릴리즈 테스트케이스 삭제
  async deleteTestCases(releaseId: string): Promise<void> {
    try {
      const { getPgClient } = await import('../../../infrastructure/database/pgClient');
      const pgClient = getPgClient();
      
      if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
      }

      // 릴리즈에 연결된 모든 테스트케이스 삭제
      await pgClient.query(`
        DELETE FROM release_test_cases
        WHERE release_id = $1
      `, [releaseId]);

      console.log(`릴리즈 ${releaseId}의 모든 테스트케이스가 삭제되었습니다.`);
    } catch (error) {
      console.error('릴리즈 테스트케이스 삭제 실패:', error);
      throw error;
    }
  }

  // 특정 테스트케이스들 삭제
  async deleteSpecificTestCases(releaseId: string, testCaseIds: string[]): Promise<void> {
    try {
      const { getPgClient } = await import('../../../infrastructure/database/pgClient');
      const pgClient = getPgClient();
      
      if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
      }

      if (testCaseIds.length === 0) {
        return;
      }

      // 릴리즈에서 특정 테스트케이스들 삭제
      // testCaseIds를 정수 배열로 변환
      const testCaseIdsAsIntegers = testCaseIds.map(id => parseInt(id, 10));
      await pgClient.query(`
        DELETE FROM release_test_cases
        WHERE release_id = $1 AND test_case_id = ANY($2::integer[])
      `, [releaseId, testCaseIdsAsIntegers]);

      console.log(`릴리즈 ${releaseId}에서 ${testCaseIds.length}개의 테스트케이스가 삭제되었습니다.`);
    } catch (error) {
      console.error('특정 테스트케이스 삭제 실패:', error);
      throw error;
    }
  }

  // 테스트케이스 상태 변경
  async updateTestCaseStatus(releaseId: string, testCaseId: string, status: string, comment?: string): Promise<any> {
    try {
      const { getPgClient } = await import('../../../infrastructure/database/pgClient');
      const pgClient = getPgClient();
      
      if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
      }

      console.log('=== updateTestCaseStatus called ===');
      console.log('Parameters:', { releaseId, testCaseId, status, comment });
      console.log('Status received (already mapped):', status);

      // release_test_cases 테이블에서 상태 업데이트
      const updateQuery = `
        UPDATE release_test_cases
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE release_id = $2 AND test_case_id = $3
        RETURNING *
      `;
      
      console.log('Update query:', updateQuery);
      console.log('Update parameters:', [status, releaseId, testCaseId]);

      const result = await pgClient.query(updateQuery, [status, releaseId, testCaseId]);

      if (result.rows.length === 0) {
        throw new Error('테스트케이스를 찾을 수 없습니다.');
      }

      console.log('Update result:', result.rows[0]);

      // 실행 기록 추가 (executions 테이블) - 안전한 upsert 처리
      try {
        // 먼저 INSERT 시도
        const insertQuery = `
          INSERT INTO executions (
            release_id, testcase_id, status, executed_by, executed_at, comments, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `;
        
        await pgClient.query(insertQuery, [releaseId, testCaseId, status, 'system', comment || '']);
        console.log(`새로운 실행 기록 생성: release_id=${releaseId}, testcase_id=${testCaseId}`);
      } catch (insertError: any) {
        // UNIQUE 제약 조건 위반인 경우 UPDATE 수행
        if (insertError.code === '23505') { // unique_violation
          const updateQuery = `
            UPDATE executions 
            SET 
              status = $1,
              executed_by = $2,
              executed_at = CURRENT_TIMESTAMP,
              comments = $3,
              updated_at = CURRENT_TIMESTAMP
            WHERE release_id = $4 AND testcase_id = $5
          `;
          
          await pgClient.query(updateQuery, [status, 'system', comment || '', releaseId, testCaseId]);
          console.log(`기존 실행 기록 업데이트: release_id=${releaseId}, testcase_id=${testCaseId}`);
        } else {
          throw insertError;
        }
      }

      console.log(`=== 테스트케이스 ${testCaseId} 상태가 ${status}로 변경되었습니다. ===`);
      
      return result.rows[0];
    } catch (error) {
      console.error('=== 테스트케이스 상태 변경 실패 ===');
      console.error('Error details:', error);
      throw error;
    }
  }

  // 테스트 폴더 조회
  async getTestFolders(): Promise<any[]> {
    try {
      const { getPgClient } = await import('../../../infrastructure/database/pgClient');
      const pgClient = getPgClient();
      
      if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
      }
  
      // folders 테이블과 tree_nodes 테이블에서 폴더 구조를 가져오는 쿼리 (중복 제거)
      const result = await pgClient.query(`
        WITH RECURSIVE folders_tree AS (
          -- folders 테이블의 루트 폴더들
          SELECT 
            id,
            name,
            description,
            parent_id,
            created_by,
            created_at,
            updated_at,
            0 as depth,
            ARRAY[id] as path,
            'folders' as source_table
          FROM folders 
          WHERE parent_id IS NULL
          
          UNION ALL
          
          -- folders 테이블의 하위 폴더들
          SELECT 
            f.id,
            f.name,
            f.description,
            f.parent_id,
            f.created_by,
            f.created_at,
            f.updated_at,
            ft.depth + 1,
            ft.path || f.id,
            'folders' as source_table
          FROM folders f
          INNER JOIN folders_tree ft ON f.parent_id = ft.id
        ),
        tree_nodes_tree AS (
          -- tree_nodes 테이블의 루트 폴더들
          SELECT 
            id,
            name,
            '' as description,
            parent_id,
            created_by,
            created_at,
            updated_at,
            0 as depth,
            ARRAY[id] as path,
            'tree_nodes' as source_table
          FROM tree_nodes 
          WHERE type = 'folder' AND parent_id IS NULL
          
          UNION ALL
          
          -- tree_nodes 테이블의 하위 폴더들
          SELECT 
            tn.id,
            tn.name,
            '' as description,
            tn.parent_id,
            tn.created_by,
            tn.created_at,
            tn.updated_at,
            tnt.depth + 1,
            tnt.path || tn.id,
            'tree_nodes' as source_table
          FROM tree_nodes tn
          INNER JOIN tree_nodes_tree tnt ON tn.parent_id = tnt.id
          WHERE tn.type = 'folder'
        ),
        combined_folders AS (
          -- tree_nodes 테이블의 폴더들을 우선시하고, 중복되지 않는 folders 테이블의 폴더들 추가
          SELECT * FROM tree_nodes_tree
          UNION ALL
          SELECT * FROM folders_tree ft
          WHERE NOT EXISTS (
            SELECT 1 FROM tree_nodes_tree tnt WHERE tnt.id = ft.id
          )
        )
        SELECT
          id,
          name,
          description,
          parent_id,
          created_by,
          created_at,
          updated_at,
          depth,
          path,
          source_table
        FROM combined_folders
        ORDER BY path
      `);

      const folders = result.rows;

      // 각 폴더에 대해 테스트케이스 개수 계산
      for (const folder of folders) {
        if (folder.source_table === 'folders') {
          // folders 테이블의 폴더인 경우 - 해당 폴더의 직접적인 테스트케이스만 계산
          const testCaseCountResult = await pgClient.query(`
            SELECT COUNT(*) as count
            FROM testcases 
            WHERE folder_id = $1
          `, [folder.id]);
          
          folder.testCaseCount = parseInt(testCaseCountResult.rows[0]?.count || '0');
        } else {
          // tree_nodes 테이블의 폴더인 경우 - 해당 폴더의 직접적인 테스트케이스만 계산
          const testCaseCountResult = await pgClient.query(`
            SELECT 
              (SELECT COUNT(*) FROM tree_nodes WHERE type = 'testcase' AND parent_id = $1) +
              (SELECT COUNT(*) FROM testcases WHERE folder_id = $1) as count
          `, [folder.id]);
          
          folder.testCaseCount = parseInt(testCaseCountResult.rows[0]?.count || '0');
        }
      }

      return folders;
    } catch (error) {
      console.error('테스트 폴더 조회 실패:', error);
      throw error;
    }
  }

  // 폴더별 테스트케이스 조회
  async getFolderTestCases(folderId: string): Promise<any[]> {
    try {
      const { getPgClient } = await import('../../../infrastructure/database/pgClient');
      const pgClient = getPgClient();
      
      if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
      }

      // 먼저 해당 폴더가 어떤 테이블에 있는지 확인
      const folderCheckResult = await pgClient.query(`
        SELECT 'folders' as source_table FROM folders WHERE id = $1
        UNION ALL
        SELECT 'tree_nodes' as source_table FROM tree_nodes WHERE id = $1 AND type = 'folder'
      `, [folderId]);

      if (folderCheckResult.rows.length === 0) {
        return [];
      }

      const sourceTable = folderCheckResult.rows[0].source_table;
      let result;

      if (sourceTable === 'folders') {
        // folders 테이블의 폴더인 경우
        result = await pgClient.query(`
          SELECT 
            id,
            title,
            prereq as description,
            priority,
            status,
            created_by,
            created_at,
            updated_at,
            folder_id as folderId
          FROM testcases 
          WHERE folder_id = $1
          ORDER BY sort_order, id
        `, [folderId]);
      } else {
        // tree_nodes 테이블의 폴더인 경우 - testcases 테이블에서 조회
        result = await pgClient.query(`
          SELECT 
            id,
            title,
            prereq as description,
            priority,
            status,
            created_by,
            created_at,
            updated_at,
            folder_id as folderId
          FROM testcases 
          WHERE folder_id = $1
          ORDER BY sort_order, id
        `, [folderId]);
      }

      return result.rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        priority: row.priority,
        status: row.status,
        createdBy: row.created_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        folderId: row.folderid
      }));
    } catch (error) {
      console.error('폴더 테스트케이스 조회 실패:', error);
      return [];
    }
  }

  // 릴리즈에 테스트케이스 추가
  async addTestCasesToRelease(releaseId: string, testCaseIds: number[]): Promise<any> {
    try {
      const { getPgClient } = await import('../../../infrastructure/database/pgClient');
      const pgClient = getPgClient();
      
      if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
      }

      // 트랜잭션 시작
      await pgClient.query('BEGIN');

      const addedTestCases = [];
      
      for (const testCaseId of testCaseIds) {
        try {
          // 먼저 테스트케이스 정보 조회
          const testCaseResult = await pgClient.query(
            'SELECT id, title, priority, status FROM testcases WHERE id = $1',
            [testCaseId]
          );

          if (testCaseResult.rows.length === 0) {
            console.warn(`테스트케이스 ${testCaseId}를 찾을 수 없습니다.`);
            continue;
          }

          const testCase = testCaseResult.rows[0];

          // 이미 추가된 테스트케이스인지 확인
          const existingResult = await pgClient.query(
            'SELECT id FROM release_test_cases WHERE release_id = $1 AND test_case_id = $2',
            [releaseId, testCaseId]
          );

          if (existingResult.rows.length === 0) {
            // 릴리즈에 테스트케이스 추가
            const insertResult = await pgClient.query(
              `INSERT INTO release_test_cases (release_id, test_case_id, test_case_name, status, created_at, updated_at)
               VALUES ($1, $2, $3, 'NOT_EXECUTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
               RETURNING *`,
              [releaseId, testCaseId, testCase.title]
            );

            addedTestCases.push({
              ...insertResult.rows[0],
              testCase: testCase
            });
          } else {
            // 이미 존재하는 테스트케이스도 카운트에 포함
            const existingTestCase = existingResult.rows[0];
            addedTestCases.push({
              ...existingTestCase,
              testCase: testCase
            });
          }
        } catch (error) {
          console.error(`테스트케이스 ${testCaseId} 추가 실패:`, error);
        }
      }

      // 트랜잭션 커밋
      await pgClient.query('COMMIT');

      return {
        addedCount: addedTestCases.length,
        testCases: addedTestCases
      };
    } catch (error) {
      console.error('릴리즈에 테스트케이스 추가 실패:', error);
      throw error;
    }
  }

  // 통계 정보 조회
  async getStatistics(releaseId: string): Promise<{
    totalCases: number;
    passedCases: number;
    failedCases: number;
    blockedCases: number;
    notRunCases: number;
    passRate: number;
    progress: number;
  } | null> {
    const release = await this.findById(releaseId);
    if (!release) return null;

    // 임시 통계 데이터 (실제로는 ReleaseCase 데이터를 기반으로 계산)
    return {
      totalCases: 127,
      passedCases: 108,
      failedCases: 19,
      blockedCases: 3,
      notRunCases: 15,
      passRate: 85,
      progress: 88
    };
  }

  // 릴리즈 실행 통계 조회
  async getExecutionStats(releaseId: string): Promise<{
    planned: number;
    executed: number;
    passed: number;
    failed: number;
    blocked: number;
    skipped: number;
    passRate: number;
  }> {
    try {
      const { getPgClient } = await import('../../../infrastructure/database/pgClient');
      const pgClient = getPgClient();
      
      if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
      }

      // 릴리즈에 연결된 테스트케이스들의 실행 상태를 조회
      const result = await pgClient.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'Pass' THEN 1 END) as passed,
          COUNT(CASE WHEN status = 'Fail' THEN 1 END) as failed,
          COUNT(CASE WHEN status IN ('Block', 'Blocked') THEN 1 END) as blocked,
          COUNT(CASE WHEN status = 'Skip' THEN 1 END) as skipped,
          COUNT(CASE WHEN status = 'NOT_EXECUTED' THEN 1 END) as notRun
        FROM release_test_cases
        WHERE release_id = $1::uuid
      `, [releaseId]);

      const stats = result.rows[0];
      const total = parseInt(stats.total) || 0;
      const passed = parseInt(stats.passed) || 0;
      const failed = parseInt(stats.failed) || 0;
      const blocked = parseInt(stats.blocked) || 0;
      const skipped = parseInt(stats.skipped) || 0;
      const notRun = parseInt(stats.notRun) || 0;
      const executed = total - notRun;
      const passRate = executed > 0 ? Math.round((passed / executed) * 100) : 0;

      return {
        planned: total,
        executed,
        passed,
        failed,
        blocked,
        skipped,
        passRate
      };
    } catch (error) {
      console.error('실행 통계 조회 실패:', error);
      
      // 에러 시 0개 반환 (실시간 동기화를 위해)
      return {
        planned: 0,
        executed: 0,
        passed: 0,
        failed: 0,
        blocked: 0,
        skipped: 0,
        passRate: 0
      };
    }
  }

  // 릴리즈 실행 통계 업데이트
  async updateExecutionStats(releaseId: string, plannedCount: number): Promise<{
    planned: number;
    executed: number;
    passed: number;
    failed: number;
    blocked: number;
    skipped: number;
    passRate: number;
  }> {
    try {
      const { getPgClient } = await import('../../../infrastructure/database/pgClient');
      const pgClient = getPgClient();
      
      if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
      }

      // release_test_cases 테이블에서 실행 상태 조회
      const result = await pgClient.query(`
        SELECT 
          COUNT(CASE WHEN status = 'Pass' THEN 1 END) as passed,
          COUNT(CASE WHEN status = 'Fail' THEN 1 END) as failed,
          COUNT(CASE WHEN status IN ('Block', 'Blocked') THEN 1 END) as blocked,
          COUNT(CASE WHEN status = 'Skip' THEN 1 END) as skipped,
          COUNT(CASE WHEN status = 'Not Run' THEN 1 END) as notRun
        FROM release_test_cases
        WHERE release_id = $1
      `, [releaseId]);

      const stats = result.rows[0];
      const passed = parseInt(stats.passed) || 0;
      const failed = parseInt(stats.failed) || 0;
      const blocked = parseInt(stats.blocked) || 0;
      const skipped = parseInt(stats.skipped) || 0;
      const notRun = parseInt(stats.notRun) || 0;
      const executed = plannedCount - notRun;
      const passRate = executed > 0 ? Math.round((passed / executed) * 100) : 0;

      return {
        planned: plannedCount,
        executed,
        passed,
        failed,
        blocked,
        skipped,
        passRate
      };
    } catch (error) {
      console.error('실행 통계 업데이트 실패:', error);
      
      // 에러 시 기본값 반환
      return {
        planned: plannedCount,
        executed: 0,
        passed: 0,
        failed: 0,
        blocked: 0,
        skipped: 0,
        passRate: 0
      };
    }
  }

  // 릴리즈에 가져온 폴더 목록 조회
  async getImportedFolders(releaseId: string): Promise<any[]> {
    try {
      const { getPgClient } = await import('../../../infrastructure/database/pgClient');
      const pgClient = getPgClient();
      
      if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
      }

      const result = await pgClient.query(`
        SELECT 
          id,
          release_id,
          folder_id,
          folder_name,
          parent_id,
          test_case_count,
          created_at,
          updated_at
        FROM release_imported_folders
        WHERE release_id = $1
        ORDER BY created_at ASC
      `, [releaseId]);

      return result.rows.map((row: any) => ({
        id: row.id,
        releaseId: row.release_id,
        folderId: row.folder_id,
        name: row.folder_name,
        parentId: row.parent_id,
        testCaseCount: row.test_case_count,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      console.error('가져온 폴더 목록 조회 실패:', error);
      return [];
    }
  }

  // 릴리즈에 폴더 추가
  async addImportedFolders(releaseId: string, folders: any[]): Promise<any[]> {
    try {
      const { getPgClient } = await import('../../../infrastructure/database/pgClient');
      const pgClient = getPgClient();
      
      if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
      }

      const addedFolders = [];

      for (const folder of folders) {
        // 중복 체크
        const existingResult = await pgClient.query(`
          SELECT id FROM release_imported_folders 
          WHERE release_id = $1 AND folder_id = $2
        `, [releaseId, folder.folder_id]);

        if (existingResult.rows.length === 0) {
          // 새 폴더 추가
          const result = await pgClient.query(`
            INSERT INTO release_imported_folders 
            (release_id, folder_id, folder_name, parent_id, test_case_count)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
          `, [
            releaseId,
            folder.folder_id,
            folder.folder_name,
            folder.parent_id || null,
            folder.test_case_count || 0
          ]);

          addedFolders.push(result.rows[0]);
        }
      }

      return addedFolders;
    } catch (error) {
      console.error('폴더 추가 실패:', error);
      throw error;
    }
  }

  // 릴리즈에서 폴더 제거
  async removeImportedFolder(releaseId: string, folderId: number): Promise<void> {
    try {
      const { getPgClient } = await import('../../../infrastructure/database/pgClient');
      const pgClient = getPgClient();
      
      if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
      }

      await pgClient.query(`
        DELETE FROM release_imported_folders 
        WHERE release_id = $1 AND folder_id = $2
      `, [releaseId, folderId]);

    } catch (error) {
      console.error('폴더 제거 실패:', error);
      throw error;
    }
  }

  // 릴리즈 삭제
  async deleteRelease(id: string): Promise<void> {
    try {
      const { getPgClient } = await import('../../../infrastructure/database/pgClient');
      const pgClient = getPgClient();
      
      if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
      }

      // 릴리즈와 관련된 데이터들을 먼저 삭제 (존재하는 테이블만)
      await pgClient.query('DELETE FROM release_imported_folders WHERE release_id = $1', [id]);
      await pgClient.query('DELETE FROM release_test_cases WHERE release_id = $1', [id]);
      
      // 마지막으로 릴리즈 삭제
      const result = await pgClient.query('DELETE FROM releases WHERE id = $1', [id]);
      
      if (result.rowCount === 0) {
        throw new Error('삭제할 릴리즈를 찾을 수 없습니다.');
      }

    } catch (error) {
      console.error('릴리즈 삭제 실패:', error);
      throw error;
    }
  }

  // 초기 데이터 로드 (개발용)
  async loadInitialData(): Promise<void> {
    // 데이터베이스에 이미 데이터가 있는지 확인
    const existingReleases = await this.findAll();
    if (existingReleases.length > 0) return; // 이미 데이터가 있으면 스킵

    const initialReleases: Omit<Release, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        projectId: '1',
        name: '2024.12.0 릴리즈',
        version: '2024.12.0',
        description: '2024년 12월 정기 릴리즈',
        status: 'Active',
        startAt: '2024-12-01',
        endAt: '2024-12-15',
        owners: ['user1'],
        watchers: ['user2', 'user3'],
        tags: ['정기', '중요'],
        createdBy: 'user1',
        updatedBy: 'user1',
        settings: {
          gateCriteria: {
            minPassRate: 85,
            maxFailCritical: 0,
            zeroBlockers: true,
            coverageByPriority: {
              P0: 100,
              P1: 95,
              P2: 90
            }
          },
          autoSyncScope: true,
          allowReopen: false
        }
      },
      {
        projectId: '1',
        name: '2024.11.1 핫픽스',
        version: '2024.11.1',
        description: '긴급 버그 수정 릴리즈',
        status: 'Complete',
        startAt: '2024-11-15',
        endAt: '2024-11-20',
        owners: ['user2'],
        watchers: ['user1'],
        tags: ['핫픽스', '긴급'],
        createdBy: 'user2',
        updatedBy: 'user2',
        settings: {
          gateCriteria: {
            minPassRate: 90,
            maxFailCritical: 0,
            zeroBlockers: true,
            coverageByPriority: {
              P0: 100,
              P1: 100,
              P2: 95
            }
          },
          autoSyncScope: false,
          allowReopen: true
        }
      }
    ];

    for (const releaseData of initialReleases) {
      await this.create(releaseData);
    }
  }
}

export const releaseRepository = new ReleaseRepository();