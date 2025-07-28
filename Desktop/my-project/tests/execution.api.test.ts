import { TextEncoder, TextDecoder } from 'util';
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

// ClearImmediate 폴리필 추가
if (typeof (global as any).clearImmediate === 'undefined') {
  (global as any).clearImmediate = jest.fn();
}

if (typeof (global as any).ReadableStream === 'undefined') {
  (global as any).ReadableStream = require('stream').Readable;
}
if (typeof (global as any).setImmediate === 'undefined') {
  (global as any).setImmediate = (fn: any, ...args: any[]) => setTimeout(fn, 0, ...args);
}

import request from 'supertest';
import app from '../src/main/app/app';

// 모킹 설정 - 올바른 경로 사용
jest.mock('../src/main/app/infrastructure/database/pgClient', () => ({
  query: jest.fn().mockResolvedValue({ rows: [] }),
  connect: jest.fn().mockResolvedValue({}),
}));

jest.mock('../src/main/app/infrastructure/elasticsearch/esClient', () => ({
  search: jest.fn().mockResolvedValue({ hits: { hits: [] } }),
  index: jest.fn().mockResolvedValue({}),
}));

// 테스트용 fixture 데이터
const TESTCASE_ID = 1;
const EXECUTED_BY = 'testuser';

let executionId: number;

describe('Execution API', () => {
    beforeEach(() => {
        // 각 테스트 전에 모킹 초기화
        jest.clearAllMocks();
        
        // PostgreSQL 모킹 설정
        const { query } = require('../src/main/app/infrastructure/database/pgClient');
        query.mockImplementation((sql: string, params: any[]) => {
          if (sql.includes('INSERT INTO executions')) {
            return Promise.resolve({ rows: [{ id: 1 }] });
          }
          if (sql.includes('SELECT * FROM executions')) {
            return Promise.resolve({ 
              rows: [{ 
                id: 1, 
                testcase_id: TESTCASE_ID, 
                status: 'Fail', 
                executed_by: EXECUTED_BY,
                executed_at: new Date().toISOString(),
                repro_steps: '1. 실행\n2. 실패',
                comment: '테스트 실패'
              }] 
            });
          }
          if (sql.includes('UPDATE executions')) {
            return Promise.resolve({ rows: [{ id: 1, status: 'Pass', comment: '수정됨' }] });
          }
          if (sql.includes('DELETE FROM executions')) {
            return Promise.resolve({ rows: [] });
          }
          return Promise.resolve({ rows: [] });
        });
    });

    it('should create an execution', async () => {
        const res = await request(app)
            .post('/api/executions')
            .send({
                testcaseId: TESTCASE_ID,
                status: 'Fail',
                executedBy: EXECUTED_BY,
                executedAt: new Date().toISOString(),
                reproSteps: '1. 실행\n2. 실패',
                comment: '테스트 실패',
            });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        executionId = res.body.id;
    }, 60000);

    it('should get execution by id', async () => {
        const res = await request(app).get(`/api/executions/${executionId}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(executionId);
    }, 60000);

    it('should get executions by testcase', async () => {
        const res = await request(app).get(`/api/executions/testcase/${TESTCASE_ID}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    }, 60000);

    it('should update execution', async () => {
        const res = await request(app)
            .put(`/api/executions/${executionId}`)
            .send({ status: 'Pass', comment: '수정됨' });
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('Pass');
        expect(res.body.comment).toBe('수정됨');
    }, 60000);

    it('should delete execution', async () => {
        const res = await request(app).delete(`/api/executions/${executionId}`);
        expect(res.status).toBe(204);
    }, 60000);
}); 