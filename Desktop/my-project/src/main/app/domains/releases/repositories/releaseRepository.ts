import { Release, ReleaseScope, ReleaseCase, Run, DefectLink, Environment } from '../entities/release';

// 임시 메모리 저장소 (실제로는 데이터베이스 사용)
let releases: Release[] = [];
let nextId = 1;

export class ReleaseRepository {
  // 모든 릴리즈 조회
  async findAll(): Promise<Release[]> {
    return releases;
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