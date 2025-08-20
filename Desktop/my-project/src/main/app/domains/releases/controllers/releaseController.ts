import { Request, Response } from 'express';
import { releaseRepository } from '../repositories/releaseRepository';

export class ReleaseController {
  // 모든 릴리즈 조회
  async getAllReleases(req: Request, res: Response) {
    try {
      const releases = await releaseRepository.findAll();
      res.json({
        success: true,
        data: releases,
        message: '릴리즈 목록을 성공적으로 조회했습니다.'
      });
    } catch (error) {
      console.error('릴리즈 목록 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '릴리즈 목록 조회 중 오류가 발생했습니다.'
      });
    }
  }

  // ID로 릴리즈 조회
  async getReleaseById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const release = await releaseRepository.findById(id);
      
      if (!release) {
        return res.status(404).json({
          success: false,
          message: '해당 릴리즈를 찾을 수 없습니다.'
        });
      }

      res.json({
        success: true,
        data: release,
        message: '릴리즈를 성공적으로 조회했습니다.'
      });
    } catch (error) {
      console.error('릴리즈 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '릴리즈 조회 중 오류가 발생했습니다.'
      });
    }
  }

  // 프로젝트별 릴리즈 조회
  async getReleasesByProject(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const releases = await releaseRepository.findByProjectId(projectId);
      
      res.json({
        success: true,
        data: releases,
        message: '프로젝트 릴리즈 목록을 성공적으로 조회했습니다.'
      });
    } catch (error) {
      console.error('프로젝트 릴리즈 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '프로젝트 릴리즈 조회 중 오류가 발생했습니다.'
      });
    }
  }

  // 릴리즈 생성
  async createRelease(req: Request, res: Response) {
    try {
      const releaseData = req.body;
      
      // 필수 필드 검증
      if (!releaseData.name || !releaseData.version || !releaseData.startAt || !releaseData.endAt) {
        return res.status(400).json({
          success: false,
          message: '필수 필드가 누락되었습니다. (name, version, startAt, endAt)'
        });
      }

      const newRelease = await releaseRepository.create({
        ...releaseData,
        createdBy: 'system',
        updatedBy: 'system'
      });

      res.status(201).json({
        success: true,
        data: newRelease,
        message: '릴리즈가 성공적으로 생성되었습니다.'
      });
    } catch (error) {
      console.error('릴리즈 생성 실패:', error);
      res.status(500).json({
        success: false,
        message: '릴리즈 생성 중 오류가 발생했습니다.'
      });
    }
  }

  // 릴리즈 업데이트
  async updateRelease(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedRelease = await releaseRepository.update(id, {
        ...updateData,
        updatedBy: 'system'
      });

      if (!updatedRelease) {
        return res.status(404).json({
          success: false,
          message: '해당 릴리즈를 찾을 수 없습니다.'
        });
      }

      res.json({
        success: true,
        data: updatedRelease,
        message: '릴리즈가 성공적으로 업데이트되었습니다.'
      });
    } catch (error) {
      console.error('릴리즈 업데이트 실패:', error);
      res.status(500).json({
        success: false,
        message: '릴리즈 업데이트 중 오류가 발생했습니다.'
      });
    }
  }

  // 릴리즈 삭제
  async deleteRelease(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await releaseRepository.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: '해당 릴리즈를 찾을 수 없습니다.'
        });
      }

      res.json({
        success: true,
        message: '릴리즈가 성공적으로 삭제되었습니다.'
      });
    } catch (error) {
      console.error('릴리즈 삭제 실패:', error);
      res.status(500).json({
        success: false,
        message: '릴리즈 삭제 중 오류가 발생했습니다.'
      });
    }
  }

  // 릴리즈 검색
  async searchReleases(req: Request, res: Response) {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({
          success: false,
          message: '검색어를 입력해주세요.'
        });
      }

      const releases = await releaseRepository.search(q);
      
      res.json({
        success: true,
        data: releases,
        message: '검색 결과를 성공적으로 조회했습니다.'
      });
    } catch (error) {
      console.error('릴리즈 검색 실패:', error);
      res.status(500).json({
        success: false,
        message: '릴리즈 검색 중 오류가 발생했습니다.'
      });
    }
  }

  // 상태별 릴리즈 조회
  async getReleasesByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      const releases = await releaseRepository.findByStatus(status as any);
      
      res.json({
        success: true,
        data: releases,
        message: '상태별 릴리즈 목록을 성공적으로 조회했습니다.'
      });
    } catch (error) {
      console.error('상태별 릴리즈 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '상태별 릴리즈 조회 중 오류가 발생했습니다.'
      });
    }
  }

  // 릴리즈 통계 조회
  async getReleaseStatistics(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const statistics = await releaseRepository.getStatistics(id);

      if (!statistics) {
        return res.status(404).json({
          success: false,
          message: '해당 릴리즈를 찾을 수 없습니다.'
        });
      }

      res.json({
        success: true,
        data: statistics,
        message: '릴리즈 통계를 성공적으로 조회했습니다.'
      });
    } catch (error) {
      console.error('릴리즈 통계 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '릴리즈 통계 조회 중 오류가 발생했습니다.'
      });
    }
  }

  // 게이트 기준 업데이트
  async updateGateCriteria(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { gateCriteria } = req.body;

      const updatedRelease = await releaseRepository.updateGateCriteria(id, gateCriteria);

      if (!updatedRelease) {
        return res.status(404).json({
          success: false,
          message: '해당 릴리즈를 찾을 수 없습니다.'
        });
      }

      res.json({
        success: true,
        data: updatedRelease,
        message: '게이트 기준이 성공적으로 업데이트되었습니다.'
      });
    } catch (error) {
      console.error('게이트 기준 업데이트 실패:', error);
      res.status(500).json({
        success: false,
        message: '게이트 기준 업데이트 중 오류가 발생했습니다.'
      });
    }
  }

  // 릴리즈 케이스 업데이트
  async updateReleaseCase(req: Request, res: Response) {
    try {
      const { releaseId, caseId } = req.params;
      const updates = req.body;

      const updatedRelease = await releaseRepository.updateCase(releaseId, caseId, updates);

      if (!updatedRelease) {
        return res.status(404).json({
          success: false,
          message: '해당 릴리즈 또는 케이스를 찾을 수 없습니다.'
        });
      }

      res.json({
        success: true,
        data: updatedRelease,
        message: '릴리즈 케이스가 성공적으로 업데이트되었습니다.'
      });
    } catch (error) {
      console.error('릴리즈 케이스 업데이트 실패:', error);
      res.status(500).json({
        success: false,
        message: '릴리즈 케이스 업데이트 중 오류가 발생했습니다.'
      });
    }
  }

  // 실행 결과 저장
  async saveRun(req: Request, res: Response) {
    try {
      const { releaseId } = req.params;
      const runData = req.body;

      const updatedRelease = await releaseRepository.saveRun(releaseId, {
        ...runData,
        executedBy: 'system',
        executedAt: new Date().toISOString()
      });

      if (!updatedRelease) {
        return res.status(404).json({
          success: false,
          message: '해당 릴리즈를 찾을 수 없습니다.'
        });
      }

      res.json({
        success: true,
        data: updatedRelease,
        message: '실행 결과가 성공적으로 저장되었습니다.'
      });
    } catch (error) {
      console.error('실행 결과 저장 실패:', error);
      res.status(500).json({
        success: false,
        message: '실행 결과 저장 중 오류가 발생했습니다.'
      });
    }
  }

  // 결함 링크 추가
  async addDefectLink(req: Request, res: Response) {
    try {
      const { releaseId } = req.params;
      const defectLinkData = req.body;

      const updatedRelease = await releaseRepository.addDefectLink(releaseId, {
        ...defectLinkData,
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      if (!updatedRelease) {
        return res.status(404).json({
          success: false,
          message: '해당 릴리즈를 찾을 수 없습니다.'
        });
      }

      res.json({
        success: true,
        data: updatedRelease,
        message: '결함 링크가 성공적으로 추가되었습니다.'
      });
    } catch (error) {
      console.error('결함 링크 추가 실패:', error);
      res.status(500).json({
        success: false,
        message: '결함 링크 추가 중 오류가 발생했습니다.'
      });
    }
  }

  // 환경 정보 업데이트
  async updateEnvironment(req: Request, res: Response) {
    try {
      const { releaseId } = req.params;
      const environmentData = req.body;

      const updatedRelease = await releaseRepository.updateEnvironment(releaseId, {
        ...environmentData,
        updatedAt: new Date().toISOString()
      });

      if (!updatedRelease) {
        return res.status(404).json({
          success: false,
          message: '해당 릴리즈를 찾을 수 없습니다.'
        });
      }

      res.json({
        success: true,
        data: updatedRelease,
        message: '환경 정보가 성공적으로 업데이트되었습니다.'
      });
    } catch (error) {
      console.error('환경 정보 업데이트 실패:', error);
      res.status(500).json({
        success: false,
        message: '환경 정보 업데이트 중 오류가 발생했습니다.'
      });
    }
  }

  // 릴리즈 테스트 케이스 조회
  async getReleaseTestCases(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const testCases = await releaseRepository.getTestCases(id);
      
      res.json({
        success: true,
        data: testCases,
        message: '릴리즈 테스트 케이스를 성공적으로 조회했습니다.'
      });
    } catch (error) {
      console.error('릴리즈 테스트 케이스 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '릴리즈 테스트 케이스 조회 중 오류가 발생했습니다.'
      });
    }
  }

  // 테스트 폴더 조회
  async getTestFolders(req: Request, res: Response) {
    try {
      console.log('테스트 폴더 조회 요청 받음');
      const folders = await releaseRepository.getTestFolders();
      console.log('조회된 폴더:', folders);
      
      res.json({
        success: true,
        data: folders,
        message: '테스트 폴더를 성공적으로 조회했습니다.'
      });
    } catch (error) {
      console.error('테스트 폴더 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '테스트 폴더 조회 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 폴더별 테스트케이스 조회
  async getFolderTestCases(req: Request, res: Response) {
    try {
      const { folderId } = req.params;
      const testCases = await releaseRepository.getFolderTestCases(folderId);
      
      res.json({
        success: true,
        data: testCases,
        message: '폴더 테스트케이스를 성공적으로 조회했습니다.'
      });
    } catch (error) {
      console.error('폴더 테스트케이스 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '폴더 테스트케이스 조회 중 오류가 발생했습니다.'
      });
    }
  }

  // 릴리즈에 테스트케이스 추가
  async addTestCasesToRelease(req: Request, res: Response) {
    try {
      const { releaseId } = req.params;
      const { testCaseIds } = req.body;
      
      if (!testCaseIds || !Array.isArray(testCaseIds)) {
        return res.status(400).json({
          success: false,
          message: '테스트케이스 ID 목록이 필요합니다.'
        });
      }

      const result = await releaseRepository.addTestCasesToRelease(releaseId, testCaseIds);
      
      res.json({
        success: true,
        data: result,
        message: '테스트케이스가 성공적으로 릴리즈에 추가되었습니다.'
      });
    } catch (error) {
      console.error('테스트케이스 추가 실패:', error);
      res.status(500).json({
        success: false,
        message: '테스트케이스 추가 중 오류가 발생했습니다.'
      });
    }
  }

  // 릴리즈 실행 통계 조회
  async getReleaseExecutionStats(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const stats = await releaseRepository.getExecutionStats(id);
      
      res.json({
        success: true,
        data: stats,
        message: '릴리즈 실행 통계를 성공적으로 조회했습니다.'
      });
    } catch (error) {
      console.error('릴리즈 실행 통계 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '릴리즈 실행 통계 조회 중 오류가 발생했습니다.'
      });
    }
  }

  // 릴리즈 실행 통계 업데이트 (테스트케이스 가져오기 후)
  async updateReleaseExecutionStats(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { plannedCount } = req.body;
      
      // 릴리즈에 추가된 테스트케이스 개수로 통계 업데이트
      const stats = await releaseRepository.updateExecutionStats(id, plannedCount);
      
      res.json({
        success: true,
        data: stats,
        message: '릴리즈 실행 통계를 성공적으로 업데이트했습니다.'
      });
    } catch (error) {
      console.error('릴리즈 실행 통계 업데이트 실패:', error);
      res.status(500).json({
        success: false,
        message: '릴리즈 실행 통계 업데이트 중 오류가 발생했습니다.'
      });
    }
  }

  // 릴리즈 테스트케이스 삭제
  async deleteReleaseTestCases(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await releaseRepository.deleteTestCases(id);
      
      res.json({
        success: true,
        message: '릴리즈 테스트 케이스를 성공적으로 삭제했습니다.'
      });
    } catch (error) {
      console.error('릴리즈 테스트케이스 삭제 실패:', error);
      res.status(500).json({
        success: false,
        message: '릴리즈 테스트케이스 삭제 중 오류가 발생했습니다.'
      });
    }
  }

  // 테스트케이스 상태 변경
  async updateTestCaseStatus(req: Request, res: Response) {
    try {
      const { id: releaseId, testCaseId } = req.params;
      const { status, comment } = req.body;
      
      if (!status || !['Pass', 'Fail', 'Blocked', 'Skip', 'Not Executed'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: '유효하지 않은 상태입니다. (Pass, Fail, Blocked, Skip, Not Executed)'
        });
      }

      const result = await releaseRepository.updateTestCaseStatus(releaseId, testCaseId, status, comment);
      
      res.json({
        success: true,
        data: result,
        message: '테스트케이스 상태를 성공적으로 업데이트했습니다.'
      });
    } catch (error) {
      console.error('테스트케이스 상태 업데이트 실패:', error);
      res.status(500).json({
        success: false,
        message: '테스트케이스 상태 업데이트 중 오류가 발생했습니다.'
      });
    }
  }

  // 초기 데이터 로드 (개발용)
  async loadInitialData(req: Request, res: Response) {
    try {
      await releaseRepository.loadInitialData();
      
      res.json({
        success: true,
        message: '초기 데이터가 성공적으로 로드되었습니다.'
      });
    } catch (error) {
      console.error('초기 데이터 로드 실패:', error);
      res.status(500).json({
        success: false,
        message: '초기 데이터 로드 중 오류가 발생했습니다.'
      });
    }
  }
}

export const releaseController = new ReleaseController();