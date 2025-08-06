import { ReleaseRepository } from '../repositories/releaseRepository';
import { Release, ReleaseStatus, ReleaseTestCase, ReleaseIssue, ReleaseChangeLog, ReleaseRetrospective } from '../types';

export class ReleaseService {
  private releaseRepository: ReleaseRepository;

  constructor() {
    this.releaseRepository = new ReleaseRepository();
  }

  async getAllReleases(): Promise<Release[]> {
    try {
      return await this.releaseRepository.findAll();
    } catch (error) {
      console.error('릴리즈 목록 조회 서비스 에러:', error);
      throw new Error('릴리즈 목록을 불러올 수 없습니다.');
    }
  }

  async getReleaseById(id: string): Promise<Release | null> {
    try {
      if (!id) {
        throw new Error('릴리즈 ID가 필요합니다.');
      }
      return await this.releaseRepository.findById(id);
    } catch (error) {
      console.error('릴리즈 상세 조회 서비스 에러:', error);
      throw new Error('릴리즈 정보를 불러올 수 없습니다.');
    }
  }

  async createRelease(releaseData: {
    name: string;
    version: string;
    description?: string;
    status?: ReleaseStatus;
    assignee_id?: string;
    assignee_name?: string;
    scheduled_date?: Date;
    deployed_date?: Date;
  }): Promise<Release> {
    try {
      // 유효성 검사
      if (!releaseData.name || !releaseData.version) {
        throw new Error('릴리즈 이름과 버전은 필수입니다.');
      }

      const release = {
        ...releaseData,
        status: releaseData.status || ReleaseStatus.PLANNING
      };

      return await this.releaseRepository.create(release);
    } catch (error) {
      console.error('릴리즈 생성 서비스 에러:', error);
      throw new Error('릴리즈를 생성할 수 없습니다.');
    }
  }

  async updateRelease(id: string, updates: Partial<Release>): Promise<Release | null> {
    try {
      if (!id) {
        throw new Error('릴리즈 ID가 필요합니다.');
      }

      return await this.releaseRepository.update(id, updates);
    } catch (error) {
      console.error('릴리즈 업데이트 서비스 에러:', error);
      throw new Error('릴리즈를 업데이트할 수 없습니다.');
    }
  }

  async deleteRelease(id: string): Promise<boolean> {
    try {
      if (!id) {
        throw new Error('릴리즈 ID가 필요합니다.');
      }

      return await this.releaseRepository.delete(id);
    } catch (error) {
      console.error('릴리즈 삭제 서비스 에러:', error);
      throw new Error('릴리즈를 삭제할 수 없습니다.');
    }
  }

  async getReleaseTestCases(releaseId: string): Promise<ReleaseTestCase[]> {
    try {
      if (!releaseId) {
        throw new Error('릴리즈 ID가 필요합니다.');
      }

      return await this.releaseRepository.findTestCasesByReleaseId(releaseId);
    } catch (error) {
      console.error('릴리즈 테스트 케이스 조회 서비스 에러:', error);
      throw new Error('릴리즈 테스트 케이스를 불러올 수 없습니다.');
    }
  }

  async getReleaseIssues(releaseId: string): Promise<ReleaseIssue[]> {
    try {
      if (!releaseId) {
        throw new Error('릴리즈 ID가 필요합니다.');
      }

      return await this.releaseRepository.findIssuesByReleaseId(releaseId);
    } catch (error) {
      console.error('릴리즈 이슈 조회 서비스 에러:', error);
      throw new Error('릴리즈 이슈를 불러올 수 없습니다.');
    }
  }

  async getReleaseChangeLogs(releaseId: string): Promise<ReleaseChangeLog[]> {
    try {
      if (!releaseId) {
        throw new Error('릴리즈 ID가 필요합니다.');
      }

      return await this.releaseRepository.findChangeLogsByReleaseId(releaseId);
    } catch (error) {
      console.error('릴리즈 변경 로그 조회 서비스 에러:', error);
      throw new Error('릴리즈 변경 로그를 불러올 수 없습니다.');
    }
  }

  async getReleaseRetrospectives(releaseId: string): Promise<ReleaseRetrospective[]> {
    try {
      if (!releaseId) {
        throw new Error('릴리즈 ID가 필요합니다.');
      }

      return await this.releaseRepository.findRetrospectivesByReleaseId(releaseId);
    } catch (error) {
      console.error('릴리즈 회고 조회 서비스 에러:', error);
      throw new Error('릴리즈 회고를 불러올 수 없습니다.');
    }
  }

  async getReleaseStats(): Promise<{
    total: number;
    planning: number;
    in_progress: number;
    testing: number;
    ready: number;
    deployed: number;
    completed: number;
  }> {
    try {
      const releases = await this.releaseRepository.findAll();
      
      const stats = {
        total: releases.length,
        planning: releases.filter(r => r.status === ReleaseStatus.PLANNING).length,
        in_progress: releases.filter(r => r.status === ReleaseStatus.IN_PROGRESS).length,
        testing: releases.filter(r => r.status === ReleaseStatus.TESTING).length,
        ready: releases.filter(r => r.status === ReleaseStatus.READY).length,
        deployed: releases.filter(r => r.status === ReleaseStatus.DEPLOYED).length,
        completed: releases.filter(r => r.status === ReleaseStatus.COMPLETED).length,
      };

      return stats;
    } catch (error) {
      console.error('릴리즈 통계 조회 서비스 에러:', error);
      throw new Error('릴리즈 통계를 불러올 수 없습니다.');
    }
  }
}