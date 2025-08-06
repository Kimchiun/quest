import { Request, Response } from 'express';
import { ReleaseService } from '../services/releaseService';
import { ReleaseStatus } from '../types';

export class ReleaseController {
  private releaseService: ReleaseService;

  constructor() {
    this.releaseService = new ReleaseService();
  }

  // GET /api/releases
  async getAllReleases(req: Request, res: Response): Promise<void> {
    try {
      const releases = await this.releaseService.getAllReleases();
      res.json({
        success: true,
        data: releases
      });
    } catch (error) {
      console.error('릴리즈 목록 조회 에러:', error);
      res.status(500).json({
        success: false,
        message: '릴리즈 목록을 불러올 수 없습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  }

  // GET /api/releases/:id
  async getReleaseById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const release = await this.releaseService.getReleaseById(id);
      
      if (!release) {
        res.status(404).json({
          success: false,
          message: '릴리즈를 찾을 수 없습니다.'
        });
        return;
      }

      res.json({
        success: true,
        data: release
      });
    } catch (error) {
      console.error('릴리즈 상세 조회 에러:', error);
      res.status(500).json({
        success: false,
        message: '릴리즈 정보를 불러올 수 없습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  }

  // POST /api/releases
  async createRelease(req: Request, res: Response): Promise<void> {
    try {
      const { name, version, description, status, assignee_id, assignee_name, scheduled_date, deployed_date } = req.body;

      if (!name || !version) {
        res.status(400).json({
          success: false,
          message: '릴리즈 이름과 버전은 필수입니다.'
        });
        return;
      }

      const releaseData = {
        name,
        version,
        description,
        status: status as ReleaseStatus || ReleaseStatus.PLANNING,
        assignee_id,
        assignee_name,
        scheduled_date: scheduled_date ? new Date(scheduled_date) : undefined,
        deployed_date: deployed_date ? new Date(deployed_date) : undefined
      };

      const release = await this.releaseService.createRelease(releaseData);
      
      res.status(201).json({
        success: true,
        data: release,
        message: '릴리즈가 성공적으로 생성되었습니다.'
      });
    } catch (error) {
      console.error('릴리즈 생성 에러:', error);
      res.status(500).json({
        success: false,
        message: '릴리즈를 생성할 수 없습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  }

  // PUT /api/releases/:id
  async updateRelease(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      // 날짜 필드 변환
      if (updates.scheduled_date) {
        updates.scheduled_date = new Date(updates.scheduled_date);
      }
      if (updates.deployed_date) {
        updates.deployed_date = new Date(updates.deployed_date);
      }

      const release = await this.releaseService.updateRelease(id, updates);
      
      if (!release) {
        res.status(404).json({
          success: false,
          message: '릴리즈를 찾을 수 없습니다.'
        });
        return;
      }

      res.json({
        success: true,
        data: release,
        message: '릴리즈가 성공적으로 업데이트되었습니다.'
      });
    } catch (error) {
      console.error('릴리즈 업데이트 에러:', error);
      res.status(500).json({
        success: false,
        message: '릴리즈를 업데이트할 수 없습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  }

  // DELETE /api/releases/:id
  async deleteRelease(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.releaseService.deleteRelease(id);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: '릴리즈를 찾을 수 없습니다.'
        });
        return;
      }

      res.json({
        success: true,
        message: '릴리즈가 성공적으로 삭제되었습니다.'
      });
    } catch (error) {
      console.error('릴리즈 삭제 에러:', error);
      res.status(500).json({
        success: false,
        message: '릴리즈를 삭제할 수 없습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  }

  // GET /api/releases/:id/test-cases
  async getReleaseTestCases(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const testCases = await this.releaseService.getReleaseTestCases(id);
      
      res.json({
        success: true,
        data: testCases
      });
    } catch (error) {
      console.error('릴리즈 테스트 케이스 조회 에러:', error);
      res.status(500).json({
        success: false,
        message: '릴리즈 테스트 케이스를 불러올 수 없습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  }

  // GET /api/releases/:id/issues
  async getReleaseIssues(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const issues = await this.releaseService.getReleaseIssues(id);
      
      res.json({
        success: true,
        data: issues
      });
    } catch (error) {
      console.error('릴리즈 이슈 조회 에러:', error);
      res.status(500).json({
        success: false,
        message: '릴리즈 이슈를 불러올 수 없습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  }

  // GET /api/releases/:id/change-logs
  async getReleaseChangeLogs(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const changeLogs = await this.releaseService.getReleaseChangeLogs(id);
      
      res.json({
        success: true,
        data: changeLogs
      });
    } catch (error) {
      console.error('릴리즈 변경 로그 조회 에러:', error);
      res.status(500).json({
        success: false,
        message: '릴리즈 변경 로그를 불러올 수 없습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  }

  // GET /api/releases/:id/retrospectives
  async getReleaseRetrospectives(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const retrospectives = await this.releaseService.getReleaseRetrospectives(id);
      
      res.json({
        success: true,
        data: retrospectives
      });
    } catch (error) {
      console.error('릴리즈 회고 조회 에러:', error);
      res.status(500).json({
        success: false,
        message: '릴리즈 회고를 불러올 수 없습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  }

  // GET /api/releases/stats
  async getReleaseStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.releaseService.getReleaseStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('릴리즈 통계 조회 에러:', error);
      res.status(500).json({
        success: false,
        message: '릴리즈 통계를 불러올 수 없습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  }
}