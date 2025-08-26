import { Request, Response } from 'express';
import { releaseRepository } from '../repositories/releaseRepository';

/**
 * @swagger
 * components:
 *   schemas:
 *     Release:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 릴리즈 ID
 *         name:
 *           type: string
 *           description: 릴리즈 이름
 *         version:
 *           type: string
 *           description: 릴리즈 버전
 *         description:
 *           type: string
 *           description: 릴리즈 설명
 *         status:
 *           type: string
 *           enum: [Planning, In Progress, Completed, Cancelled]
 *           description: 릴리즈 상태
 *         startAt:
 *           type: string
 *           format: date-time
 *           description: 시작일
 *         endAt:
 *           type: string
 *           format: date-time
 *           description: 종료일
 *         owners:
 *           type: array
 *           items:
 *             type: string
 *           description: 소유자 목록
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 생성일
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 수정일
 *     ExecutionStats:
 *       type: object
 *       properties:
 *         planned:
 *           type: integer
 *           description: 계획된 테스트케이스 수
 *         executed:
 *           type: integer
 *           description: 실행된 테스트케이스 수
 *         passed:
 *           type: integer
 *           description: 통과한 테스트케이스 수
 *         failed:
 *           type: integer
 *           description: 실패한 테스트케이스 수
 *         blocked:
 *           type: integer
 *           description: 차단된 테스트케이스 수
 *         skipped:
 *           type: integer
 *           description: 건너뛴 테스트케이스 수
 *         passRate:
 *           type: integer
 *           description: 통과율 (%)
 */

export class ReleaseController {
  /**
   * @swagger
   * /api/releases:
   *   get:
   *     summary: 모든 릴리즈 조회
   *     description: 시스템의 모든 릴리즈 목록을 조회합니다.
   *     tags: [Releases]
   *     responses:
   *       200:
   *         description: 릴리즈 목록 조회 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Release'
   *                 message:
   *                   type: string
   *       500:
   *         description: 서버 오류
   */
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

  /**
   * @swagger
   * /api/releases/{id}:
   *   get:
   *     summary: ID로 릴리즈 조회
   *     description: 특정 ID의 릴리즈를 조회합니다.
   *     tags: [Releases]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: 릴리즈 ID
   *     responses:
   *       200:
   *         description: 릴리즈 조회 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Release'
   *                 message:
   *                   type: string
   *       404:
   *         description: 릴리즈를 찾을 수 없음
   *       500:
   *         description: 서버 오류
   */
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

  /**
   * @swagger
   * /api/releases:
   *   post:
   *     summary: 릴리즈 생성
   *     description: 새로운 릴리즈를 생성합니다.
   *     tags: [Releases]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - version
   *               - startAt
   *               - endAt
   *             properties:
   *               name:
   *                 type: string
   *                 description: 릴리즈 이름
   *               version:
   *                 type: string
   *                 description: 릴리즈 버전
   *               description:
   *                 type: string
   *                 description: 릴리즈 설명
   *               startAt:
   *                 type: string
   *                 format: date-time
   *                 description: 시작일
   *               endAt:
   *                 type: string
   *                 format: date-time
   *                 description: 종료일
   *               assignee:
   *                 type: string
   *                 description: 담당자
   *     responses:
   *       201:
   *         description: 릴리즈 생성 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Release'
   *                 message:
   *                   type: string
   *       400:
   *         description: 잘못된 요청
   *       500:
   *         description: 서버 오류
   */
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
      await releaseRepository.deleteRelease(id);

      res.json({
        success: true,
        message: '릴리즈가 성공적으로 삭제되었습니다.'
      });
    } catch (error) {
      console.error('릴리즈 삭제 실패:', error);
      
      if (error instanceof Error && error.message.includes('찾을 수 없습니다')) {
        return res.status(404).json({
          success: false,
          message: '해당 릴리즈를 찾을 수 없습니다.'
        });
      }
      
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

  /**
   * @swagger
   * /api/releases/{id}/testcases:
   *   get:
   *     summary: 릴리즈 테스트케이스 조회
   *     description: 특정 릴리즈에 포함된 테스트케이스 목록을 조회합니다.
   *     tags: [Releases]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: 릴리즈 ID
   *     responses:
   *       200:
   *         description: 릴리즈 테스트케이스 조회 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/TestCase'
   *                 message:
   *                   type: string
   *       500:
   *         description: 서버 오류
   */
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

  /**
   * @swagger
   * /api/releases/testcases/folders:
   *   get:
   *     summary: 테스트 폴더 목록 조회
   *     description: 테스트케이스 가져오기를 위한 폴더 목록을 조회합니다.
   *     tags: [Releases]
   *     responses:
   *       200:
   *         description: 테스트 폴더 조회 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Folder'
   *                 message:
   *                   type: string
   *       500:
   *         description: 서버 오류
   */
  // 테스트 폴더 조회
  async getTestFolders(req: Request, res: Response) {
    try {
      const folders = await releaseRepository.getTestFolders();
      
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

  /**
   * @swagger
   * /api/releases/folders/{folderId}/testcases:
   *   get:
   *     summary: 폴더별 테스트케이스 조회
   *     description: 특정 폴더에 포함된 테스트케이스 목록을 조회합니다.
   *     tags: [Releases]
   *     parameters:
   *       - in: path
   *         name: folderId
   *         required: true
   *         schema:
   *           type: integer
   *         description: 폴더 ID
   *     responses:
   *       200:
   *         description: 폴더 테스트케이스 조회 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/TestCase'
   *                 message:
   *                   type: string
   *       500:
   *         description: 서버 오류
   */
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

  /**
   * @swagger
   * /api/releases/{releaseId}/testcases:
   *   post:
   *     summary: 릴리즈에 테스트케이스 추가
   *     description: 특정 릴리즈에 테스트케이스들을 추가합니다.
   *     tags: [Releases]
   *     parameters:
   *       - in: path
   *         name: releaseId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: 릴리즈 ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - testCaseIds
   *             properties:
   *               testCaseIds:
   *                 type: array
   *                 items:
   *                   type: integer
   *                 description: 추가할 테스트케이스 ID 목록
   *     responses:
   *       200:
   *         description: 테스트케이스 추가 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                 message:
   *                   type: string
   *       400:
   *         description: 잘못된 요청
   *       500:
   *         description: 서버 오류
   */
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



  // 릴리즈 테스트케이스 삭제 (전체 또는 특정)
  async deleteReleaseTestCases(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { testCaseIds } = req.body;
      
      if (testCaseIds && Array.isArray(testCaseIds)) {
        // 특정 테스트케이스들 삭제
        await releaseRepository.deleteSpecificTestCases(id, testCaseIds.map(tcId => tcId.toString()));
        res.json({
          success: true,
          message: '선택한 테스트케이스가 성공적으로 릴리즈에서 삭제되었습니다.'
        });
      } else {
        // 모든 테스트케이스 삭제
        await releaseRepository.deleteTestCases(id);
        res.json({
          success: true,
          message: '릴리즈의 모든 테스트케이스를 성공적으로 삭제했습니다.'
        });
      }
    } catch (error) {
      console.error('릴리즈 테스트케이스 삭제 실패:', error);
      res.status(500).json({
        success: false,
        message: '릴리즈 테스트케이스 삭제 중 오류가 발생했습니다.'
      });
    }
  }



  /**
   * @swagger
   * /api/releases/{id}/imported-folders:
   *   get:
   *     summary: 릴리즈에 가져온 폴더 목록 조회
   *     description: 특정 릴리즈에 가져온 폴더 목록을 조회합니다.
   *     tags: [Releases]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: 릴리즈 ID
   *     responses:
   *       200:
   *         description: 가져온 폴더 목록 조회 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                       release_id:
   *                         type: string
   *                         format: uuid
   *                       folder_id:
   *                         type: string
   *                         format: uuid
   *                       folder_name:
   *                         type: string
   *                       parent_id:
   *                         type: string
   *                         format: uuid
   *                       test_case_count:
   *                         type: integer
   *                       created_at:
   *                         type: string
   *                         format: date-time
   *       500:
   *         description: 서버 오류
   */
  // 릴리즈에 가져온 폴더 목록 조회
  async getImportedFolders(req: Request, res: Response) {
    try {
      const { id: releaseId } = req.params;
      
      const folders = await releaseRepository.getImportedFolders(releaseId);
      
      res.json({
        success: true,
        data: folders,
        message: '가져온 폴더 목록을 성공적으로 조회했습니다.'
      });
    } catch (error) {
      console.error('가져온 폴더 목록 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '가져온 폴더 목록 조회 중 오류가 발생했습니다.'
      });
    }
  }

  /**
   * @swagger
   * /api/releases/{id}/imported-folders:
   *   post:
   *     summary: 릴리즈에 폴더 추가
   *     description: 특정 릴리즈에 폴더를 추가합니다.
   *     tags: [Releases]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: 릴리즈 ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - folders
   *             properties:
   *               folders:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     folder_id:
   *                       type: string
   *                       format: uuid
   *                     folder_name:
   *                       type: string
   *                     parent_id:
   *                       type: string
   *                       format: uuid
   *                     test_case_count:
   *                       type: integer
   *     responses:
   *       200:
   *         description: 폴더 추가 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                 message:
   *                   type: string
   *       400:
   *         description: 잘못된 요청
   *       500:
   *         description: 서버 오류
   */
  // 릴리즈에 폴더 추가
  async addImportedFolders(req: Request, res: Response) {
    try {
      const { id: releaseId } = req.params;
      const { folders } = req.body;
      
      if (!folders || !Array.isArray(folders)) {
        return res.status(400).json({
          success: false,
          message: '폴더 목록이 필요합니다.'
        });
      }

      const result = await releaseRepository.addImportedFolders(releaseId, folders);
      
      res.json({
        success: true,
        data: result,
        message: '폴더를 성공적으로 추가했습니다.'
      });
    } catch (error) {
      console.error('폴더 추가 실패:', error);
      res.status(500).json({
        success: false,
        message: '폴더 추가 중 오류가 발생했습니다.'
      });
    }
  }

  /**
   * @swagger
   * /api/releases/{id}/imported-folders/{folderId}:
   *   delete:
   *     summary: 릴리즈에서 폴더 제거
   *     description: 특정 릴리즈에서 폴더를 제거합니다.
   *     tags: [Releases]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: 릴리즈 ID
   *       - in: path
   *         name: folderId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: 폴더 ID
   *     responses:
   *       200:
   *         description: 폴더 제거 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *       500:
   *         description: 서버 오류
   */
  // 릴리즈에서 폴더 제거
  async removeImportedFolder(req: Request, res: Response) {
    try {
      const { id: releaseId, folderId } = req.params;
      
      await releaseRepository.removeImportedFolder(releaseId, parseInt(folderId));
      
      res.json({
        success: true,
        message: '폴더를 성공적으로 제거했습니다.'
      });
    } catch (error) {
      console.error('폴더 제거 실패:', error);
      res.status(500).json({
        success: false,
        message: '폴더 제거 중 오류가 발생했습니다.'
      });
    }
  }

  /**
   * @swagger
   * /api/releases/{id}/testcases/{testCaseId}/status:
   *   put:
   *     summary: 테스트케이스 상태 변경
   *     description: 특정 릴리즈의 테스트케이스 상태를 변경합니다.
   *     tags: [Releases]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: 릴리즈 ID
   *       - in: path
   *         name: testCaseId
   *         required: true
   *         schema:
   *           type: string
   *         description: 테스트케이스 ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [Pass, Fail, Block, Skip, Not Run]
   *                 description: 새로운 상태
   *               comment:
   *                 type: string
   *                 description: 코멘트 (선택사항)
   *     responses:
   *       200:
   *         description: 상태 변경 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                 message:
   *                   type: string
   *       500:
   *         description: 서버 오류
   */
  // 테스트케이스 상태 변경
  async updateTestCaseStatus(req: Request, res: Response) {
    try {
      const { id: releaseId, testCaseId } = req.params;
      const { status, comment } = req.body;
      
      console.log('=== ReleaseController.updateTestCaseStatus 호출됨 ===');
      console.log('releaseId:', releaseId);
      console.log('testCaseId:', testCaseId);
      console.log('status:', status);
      console.log('comment:', comment);
      
      // 상태 검증 - 프론트엔드 상태값 허용
      if (!status || !['Pass', 'Fail', 'Block', 'Blocked', 'Skip', 'Not Run'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: '유효하지 않은 상태입니다. (Pass, Fail, Block, Blocked, Skip, Not Run)'
        });
      }
      
      console.log('=== 컨트롤러에서 리포지토리 호출 전 ===');
      console.log('전달할 매개변수:', { releaseId, testCaseId, status, comment });
      
      const result = await releaseRepository.updateTestCaseStatus(releaseId, testCaseId, status, comment);
      
      console.log('=== 상태 변경 성공 ===');
      console.log('result:', result);
      
      res.json({
        success: true,
        data: result,
        message: '테스트케이스 상태가 성공적으로 변경되었습니다.'
      });
    } catch (error) {
      console.error('=== 테스트케이스 상태 변경 실패 ===');
      console.error('Error details:', error);
      res.status(500).json({
        success: false,
        message: '테스트케이스 상태 변경 중 오류가 발생했습니다.'
      });
    }
  }

  // 릴리즈 실행 통계 조회
  async getReleaseExecutionStats(req: Request, res: Response) {
    try {
      const { id: releaseId } = req.params;
      
      console.log('=== ReleaseController.getReleaseExecutionStats 호출됨 ===');
      console.log('releaseId:', releaseId);
      
      const stats = await releaseRepository.getExecutionStats(releaseId);
      
      console.log('=== 실행 통계 조회 성공 ===');
      console.log('stats:', stats);
      
      res.json({
        success: true,
        data: stats,
        message: '릴리즈 실행 통계를 성공적으로 조회했습니다.'
      });
    } catch (error) {
      console.error('=== 실행 통계 조회 실패 ===');
      console.error('Error details:', error);
      res.status(500).json({
        success: false,
        message: '실행 통계 조회 중 오류가 발생했습니다.'
      });
    }
  }

  // 릴리즈 실행 통계 업데이트
  async updateReleaseExecutionStats(req: Request, res: Response) {
    try {
      const { id: releaseId } = req.params;
      const { plannedCount } = req.body;
      
      console.log('=== ReleaseController.updateReleaseExecutionStats 호출됨 ===');
      console.log('releaseId:', releaseId);
      console.log('plannedCount:', plannedCount);
      
      const stats = await releaseRepository.updateExecutionStats(releaseId, plannedCount);
      
      console.log('=== 실행 통계 업데이트 성공 ===');
      console.log('stats:', stats);
      
      res.json({
        success: true,
        data: stats,
        message: '릴리즈 실행 통계를 성공적으로 업데이트했습니다.'
      });
    } catch (error) {
      console.error('=== 실행 통계 업데이트 실패 ===');
      console.error('Error details:', error);
      res.status(500).json({
        success: false,
        message: '실행 통계 업데이트 중 오류가 발생했습니다.'
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