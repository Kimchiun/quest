import request from 'supertest';
import { app } from '../src/main/app';
import { pgClient } from '../src/main/app/infrastructure/database/connection';

describe('일괄 작업 API 테스트', () => {
  beforeAll(async () => {
    // 테스트 데이터베이스 초기화
    await pgClient.query('TRUNCATE folders, testcases, case_folders RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await pgClient.end();
  });

  beforeEach(async () => {
    // 각 테스트 전에 데이터 초기화
    await pgClient.query('TRUNCATE folders, testcases, case_folders RESTART IDENTITY CASCADE');
  });

  describe('POST /api/folders/bulk/move', () => {
    it('폴더와 테스트 케이스를 일괄 이동할 수 있다', async () => {
      // 테스트 데이터 생성
      const folder1 = await pgClient.query(
        'INSERT INTO folders (name, description, created_by) VALUES ($1, $2, $3) RETURNING id',
        ['폴더1', '테스트 폴더1', 'testuser']
      );
      const folder2 = await pgClient.query(
        'INSERT INTO folders (name, description, created_by) VALUES ($1, $2, $3) RETURNING id',
        ['폴더2', '테스트 폴더2', 'testuser']
      );
      const targetFolder = await pgClient.query(
        'INSERT INTO folders (name, description, created_by) VALUES ($1, $2, $3) RETURNING id',
        ['대상 폴더', '대상 폴더', 'testuser']
      );

      const testCase1 = await pgClient.query(
        'INSERT INTO testcases (title, steps, expected, priority, status, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        ['테스트 케이스1', ['step1'], 'expected1', 'High', 'Active', 'testuser']
      );
      const testCase2 = await pgClient.query(
        'INSERT INTO testcases (title, steps, expected, priority, status, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        ['테스트 케이스2', ['step2'], 'expected2', 'Medium', 'Active', 'testuser']
      );

      // 테스트 케이스를 폴더에 추가
      await pgClient.query(
        'INSERT INTO case_folders (testcase_id, folder_id) VALUES ($1, $2), ($1, $3)',
        [testCase1.rows[0].id, folder1.rows[0].id, folder2.rows[0].id]
      );

      const response = await request(app)
        .post('/api/folders/bulk/move')
        .send({
          folderIds: [folder1.rows[0].id, folder2.rows[0].id],
          testCaseIds: [testCase1.rows[0].id, testCase2.rows[0].id],
          targetFolderId: targetFolder.rows[0].id,
          updatedBy: 'testuser'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('일괄 이동이 완료되었습니다.');
      expect(response.body.results.folders.success).toBe(2);
      expect(response.body.results.testCases.success).toBe(2);
    });

    it('대상 폴더 ID가 없으면 에러를 반환한다', async () => {
      const response = await request(app)
        .post('/api/folders/bulk/move')
        .send({
          folderIds: [1],
          testCaseIds: [1]
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('대상 폴더 ID가 필요합니다.');
    });
  });

  describe('POST /api/folders/bulk/copy', () => {
    it('폴더와 테스트 케이스를 일괄 복사할 수 있다', async () => {
      // 테스트 데이터 생성
      const sourceFolder = await pgClient.query(
        'INSERT INTO folders (name, description, created_by) VALUES ($1, $2, $3) RETURNING id',
        ['원본 폴더', '원본 폴더', 'testuser']
      );
      const targetFolder = await pgClient.query(
        'INSERT INTO folders (name, description, created_by) VALUES ($1, $2, $3) RETURNING id',
        ['대상 폴더', '대상 폴더', 'testuser']
      );

      const testCase = await pgClient.query(
        'INSERT INTO testcases (title, steps, expected, priority, status, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        ['테스트 케이스', ['step1'], 'expected1', 'High', 'Active', 'testuser']
      );

      const response = await request(app)
        .post('/api/folders/bulk/copy')
        .send({
          folderIds: [sourceFolder.rows[0].id],
          testCaseIds: [testCase.rows[0].id],
          targetFolderId: targetFolder.rows[0].id,
          createdBy: 'testuser'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('일괄 복사가 완료되었습니다.');
      expect(response.body.results.folders.success).toBe(1);
      expect(response.body.results.testCases.success).toBe(1);
    });
  });

  describe('DELETE /api/folders/bulk', () => {
    it('폴더와 테스트 케이스를 일괄 삭제할 수 있다', async () => {
      // 테스트 데이터 생성
      const folder = await pgClient.query(
        'INSERT INTO folders (name, description, created_by) VALUES ($1, $2, $3) RETURNING id',
        ['삭제할 폴더', '삭제할 폴더', 'testuser']
      );
      const testCase = await pgClient.query(
        'INSERT INTO testcases (title, steps, expected, priority, status, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        ['삭제할 테스트 케이스', ['step1'], 'expected1', 'High', 'Active', 'testuser']
      );

      const response = await request(app)
        .delete('/api/folders/bulk')
        .send({
          folderIds: [folder.rows[0].id],
          testCaseIds: [testCase.rows[0].id]
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('일괄 삭제가 완료되었습니다.');
      expect(response.body.results.folders.success).toBe(1);
      expect(response.body.results.testCases.success).toBe(1);
    });
  });

  describe('PATCH /api/folders/bulk/status', () => {
    it('테스트 케이스 상태를 일괄 변경할 수 있다', async () => {
      // 테스트 데이터 생성
      const testCase1 = await pgClient.query(
        'INSERT INTO testcases (title, steps, expected, priority, status, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        ['테스트 케이스1', ['step1'], 'expected1', 'High', 'Active', 'testuser']
      );
      const testCase2 = await pgClient.query(
        'INSERT INTO testcases (title, steps, expected, priority, status, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        ['테스트 케이스2', ['step2'], 'expected2', 'Medium', 'Active', 'testuser']
      );

      const response = await request(app)
        .patch('/api/folders/bulk/status')
        .send({
          testCaseIds: [testCase1.rows[0].id, testCase2.rows[0].id],
          status: 'Archived'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('일괄 상태 변경이 완료되었습니다.');
      expect(response.body.results.success).toBe(2);
    });

    it('상태 값이 없으면 에러를 반환한다', async () => {
      const response = await request(app)
        .patch('/api/folders/bulk/status')
        .send({
          testCaseIds: [1, 2]
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('상태 값이 필요합니다.');
    });

    it('테스트 케이스 ID가 없으면 에러를 반환한다', async () => {
      const response = await request(app)
        .patch('/api/folders/bulk/status')
        .send({
          status: 'Archived'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('테스트 케이스 ID가 필요합니다.');
    });
  });
}); 