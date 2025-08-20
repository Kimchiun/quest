import { Release, ReleaseScope, ReleaseCase, Run, DefectLink, Environment } from '../entities/release';

// 임시 메모리 저장소 (실제로는 데이터베이스 사용)
let releases: Release[] = [];
let nextId = 1;

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
      return releases; // 실패 시 메모리 데이터 반환
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
    return releases.filter(release => release.projectId === projectId);
  }

  // 릴리즈 생성
  async create(releaseData: Omit<Release, 'id' | 'createdAt' | 'updatedAt'>): Promise<Release> {
    const now = new Date().toISOString();
    const newRelease: Release = {
      ...releaseData,
      id: String(nextId++),
      createdAt: now,
      updatedAt: now
    };
    
    releases.push(newRelease);
    return newRelease;
  }

  // 릴리즈 업데이트
  async update(id: string, updateData: Partial<Release>): Promise<Release | null> {
    const index = releases.findIndex(release => release.id === id);
    if (index === -1) return null;

    releases[index] = {
      ...releases[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return releases[index];
  }

  // 릴리즈 삭제
  async delete(id: string): Promise<boolean> {
    const index = releases.findIndex(release => release.id === id);
    if (index === -1) return false;

    releases.splice(index, 1);
    return true;
  }

  // 상태별 릴리즈 조회
  async findByStatus(status: Release['status']): Promise<Release[]> {
    return releases.filter(release => release.status === status);
  }

  // 검색어로 릴리즈 조회
  async search(query: string): Promise<Release[]> {
    const lowerQuery = query.toLowerCase();
    return releases.filter(release => 
      release.name.toLowerCase().includes(lowerQuery) ||
      release.description.toLowerCase().includes(lowerQuery) ||
      release.version.toLowerCase().includes(lowerQuery) ||
      release.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
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

  // 테스트케이스 상태 변경
  async updateTestCaseStatus(releaseId: string, testCaseId: string, status: string, comment?: string): Promise<any> {
    try {
      const { getPgClient } = await import('../../../infrastructure/database/pgClient');
      const pgClient = getPgClient();
      
      if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
      }

      // release_test_cases 테이블에서 상태 업데이트
      const result = await pgClient.query(`
        UPDATE release_test_cases
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE release_id = $2 AND test_case_id = $3
        RETURNING *
      `, [status, releaseId, testCaseId]);

      if (result.rows.length === 0) {
        throw new Error('테스트케이스를 찾을 수 없습니다.');
      }

      // 실행 기록 추가 (executions 테이블)
      await pgClient.query(`
        INSERT INTO executions (
          testcase_id, release_id, status, executed_by, executed_at, comment, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [testCaseId, releaseId, status, 'system', comment || '']);

      console.log(`테스트케이스 ${testCaseId} 상태가 ${status}로 변경되었습니다.`);
      
      return result.rows[0];
    } catch (error) {
      console.error('테스트케이스 상태 변경 실패:', error);
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
          // folders 테이블의 폴더인 경우
          const testCaseCountResult = await pgClient.query(`
            WITH RECURSIVE folder_hierarchy AS (
              -- 현재 폴더
              SELECT id, parent_id
              FROM folders 
              WHERE id = $1
              
              UNION ALL
              
              -- 하위 폴더들
              SELECT f.id, f.parent_id
              FROM folders f
              INNER JOIN folder_hierarchy fh ON f.parent_id = fh.id
            )
            SELECT 
              (SELECT COUNT(*) FROM testcases WHERE folder_id IN (SELECT id FROM folder_hierarchy)) as count
          `, [folder.id]);
          
          folder.testCaseCount = parseInt(testCaseCountResult.rows[0]?.count || '0');
        } else {
          // tree_nodes 테이블의 폴더인 경우
          const testCaseCountResult = await pgClient.query(`
            WITH RECURSIVE folder_hierarchy AS (
              -- 현재 폴더
              SELECT id, parent_id
              FROM tree_nodes 
              WHERE id = $1 AND type = 'folder'
              
              UNION ALL
              
              -- 하위 폴더들
              SELECT tn.id, tn.parent_id
              FROM tree_nodes tn
              INNER JOIN folder_hierarchy fh ON tn.parent_id = fh.id
              WHERE tn.type = 'folder'
            )
            SELECT 
              (SELECT COUNT(*) FROM tree_nodes WHERE type = 'testcase' AND parent_id IN (SELECT id FROM folder_hierarchy)) +
              (SELECT COUNT(*) FROM testcases WHERE folder_id IN (SELECT id FROM folder_hierarchy)) as count
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
          COUNT(CASE WHEN status = 'Block' THEN 1 END) as blocked,
          COUNT(CASE WHEN status = 'NOT_EXECUTED' THEN 1 END) as notRun
        FROM release_test_cases
        WHERE release_id = $1::uuid
      `, [releaseId]);

      const stats = result.rows[0];
      const total = parseInt(stats.total) || 0;
      const passed = parseInt(stats.passed) || 0;
      const failed = parseInt(stats.failed) || 0;
      const blocked = parseInt(stats.blocked) || 0;
      const notRun = parseInt(stats.notRun) || 0;
      const executed = total - notRun;
      const passRate = executed > 0 ? Math.round((passed / executed) * 100) : 0;

      return {
        planned: total,
        executed,
        passed,
        failed,
        blocked,
        skipped: 0, // 현재는 skipped 상태가 없으므로 0
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
          COUNT(CASE WHEN status = 'Block' THEN 1 END) as blocked,
          COUNT(CASE WHEN status = 'Not Run' THEN 1 END) as notRun
        FROM release_test_cases
        WHERE release_id = $1
      `, [releaseId]);

      const stats = result.rows[0];
      const passed = parseInt(stats.passed) || 0;
      const failed = parseInt(stats.failed) || 0;
      const blocked = parseInt(stats.blocked) || 0;
      const notRun = parseInt(stats.notRun) || 0;
      const executed = plannedCount - notRun;
      const passRate = executed > 0 ? Math.round((passed / executed) * 100) : 0;

      return {
        planned: plannedCount,
        executed,
        passed,
        failed,
        blocked,
        skipped: 0,
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

  // 초기 데이터 로드 (개발용)
  async loadInitialData(): Promise<void> {
    if (releases.length > 0) return; // 이미 데이터가 있으면 스킵

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