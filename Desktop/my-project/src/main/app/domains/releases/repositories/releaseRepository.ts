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
    return releases.find(release => release.id === id) || null;
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
    // 실제로는 release_test_cases 테이블에서 조회해야 함
    // 임시로 모든 테스트 케이스를 반환
    try {
      const { getPgClient } = await import('../../../infrastructure/database/pgClient');
      const pgClient = getPgClient();
      
      if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
      }

      // release_test_cases 테이블에서 해당 릴리즈의 테스트 케이스 조회
      const result = await pgClient.query(`
        SELECT 
          tn.id,
          tn.name as title,
          '' as description,
          'MEDIUM' as priority,
          'ACTIVE' as status,
          tn.created_by,
          tn.created_at,
          tn.updated_at,
          rtc.status as execution_status,
          rtc.assignee_name as assigned_to,
          rtc.executed_at,
          '' as executed_by
        FROM tree_nodes tn
        INNER JOIN release_test_cases rtc ON tn.id::text = rtc.test_case_id::text
        WHERE rtc.release_id = $1 AND tn.type = 'testcase'
        ORDER BY tn.id
      `, [releaseId]);

      return result.rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        priority: row.priority,
        status: row.status,
        createdBy: row.created_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        executionStatus: row.execution_status,
        assignedTo: row.assigned_to,
        executedAt: row.executed_at,
        executedBy: row.executed_by
      }));
    } catch (error) {
      console.error('릴리즈 테스트 케이스 조회 실패:', error);
      // 에러 발생 시 빈 배열 반환
      return [];
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
  
      // 실제 데이터베이스에서 폴더 구조를 가져오는 쿼리
      const result = await pgClient.query(`
        WITH RECURSIVE folder_tree AS (
          -- 루트 폴더들 (parent_id가 NULL인 폴더들)
          SELECT 
            id,
            name,
            parent_id,
            created_by,
            created_at,
            updated_at,
            0 as depth,
            ARRAY[id] as path
          FROM tree_nodes 
          WHERE type = 'folder' AND parent_id IS NULL
          
          UNION ALL
          
          -- 하위 폴더들
          SELECT 
            tn.id,
            tn.name,
            tn.parent_id,
            tn.created_by,
            tn.created_at,
            tn.updated_at,
            ft.depth + 1,
            ft.path || tn.id
          FROM tree_nodes tn
          INNER JOIN folder_tree ft ON tn.parent_id = ft.id
          WHERE tn.type = 'folder'
        )
        SELECT 
          id,
          name,
          parent_id,
          created_by,
          created_at,
          updated_at,
          depth,
          path
        FROM folder_tree
        ORDER BY path
      `);

      // 각 폴더의 테스트케이스 개수 계산 (재귀적으로 모든 하위 폴더 포함)
      const foldersWithCounts = await Promise.all(
        result.rows.map(async (row: any) => {
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
            SELECT COUNT(*) as count 
            FROM tree_nodes 
            WHERE type = 'testcase' AND parent_id IN (
              SELECT id FROM folder_hierarchy
            )
          `, [row.id]);
          
          return {
            ...row,
            testCaseCount: parseInt(testCaseCountResult.rows[0].count)
          };
        })
      );

      // 트리 구조로 변환
      const folderMap = new Map();
      const rootFolders: any[] = [];

      foldersWithCounts.forEach(folder => {
        folderMap.set(folder.id, {
          ...folder,
          children: []
        });
      });

      foldersWithCounts.forEach(folder => {
        if (folder.parent_id && folderMap.has(folder.parent_id)) {
          folderMap.get(folder.parent_id).children.push(folderMap.get(folder.id));
        } else {
          rootFolders.push(folderMap.get(folder.id));
        }
      });

      return rootFolders;
    } catch (error) {
      console.error('테스트 폴더 조회 실패:', error);
      return [];
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
  
      // 실제 데이터베이스에서 해당 폴더의 테스트케이스 조회
      const result = await pgClient.query(`
        SELECT 
          id,
          name as title,
          '' as description,
          'MEDIUM' as priority,
          'ACTIVE' as status,
          created_by,
          created_at,
          updated_at,
          parent_id as folderId
        FROM tree_nodes 
        WHERE type = 'testcase' AND parent_id = $1
        ORDER BY id
      `, [folderId]);

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