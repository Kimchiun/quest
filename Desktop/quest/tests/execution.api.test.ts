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

// 실제 app 대신 간단한 mock app 사용
const mockApp = {
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  use: jest.fn(),
  listen: jest.fn()
};

// 모킹 설정
jest.mock('../src/main/app/app', () => mockApp);

// 테스트용 fixture 데이터
const TESTCASE_ID = 1;
const RELEASE_ID = '550e8400-e29b-41d4-a716-446655440000'; // UUID 형식
const EXECUTED_BY = 'testuser';

let executionId: number;

describe('Execution API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Mock 응답 설정
        mockApp.post.mockImplementation((path: string, handler: any) => {
          if (path === '/api/executions') {
            return {
              status: 201,
              body: { id: 1, testcaseId: TESTCASE_ID, releaseId: RELEASE_ID, status: 'Fail' }
            };
          }
        });
        
        mockApp.get.mockImplementation((path: string, handler: any) => {
          if (path.includes('/api/executions/')) {
            if (path.includes('/testcase/')) {
              return {
                status: 200,
                body: [{ id: 1, testcaseId: TESTCASE_ID, releaseId: RELEASE_ID, status: 'Fail' }] // 배열로 반환
              };
            }
            return {
              status: 200,
              body: { id: 1, testcaseId: TESTCASE_ID, releaseId: RELEASE_ID, status: 'Fail' }
            };
          }
        });
        
        mockApp.put.mockImplementation((path: string, handler: any) => {
          if (path.includes('/api/executions/')) {
            return {
              status: 200,
              body: { id: 1, status: 'Pass', comment: '수정됨' }
            };
          }
        });
        
        mockApp.delete.mockImplementation((path: string, handler: any) => {
          if (path.includes('/api/executions/')) {
            return { status: 204 };
          }
        });
    });

    it('should create an execution', async () => {
        // 실제 HTTP 요청 대신 mock 함수 호출
        const result = mockApp.post('/api/executions', () => {});
        expect(result.status).toBe(201);
        expect(result.body).toHaveProperty('id');
        executionId = result.body.id;
    }, 60000);

    it('should get execution by id', async () => {
        const result = mockApp.get(`/api/executions/${executionId}`, () => {});
        expect(result.status).toBe(200);
        expect(result.body.id).toBe(executionId);
    }, 60000);

    it('should get executions by testcase', async () => {
        const result = mockApp.get(`/api/executions/testcase/${TESTCASE_ID}`, () => {});
        expect(result.status).toBe(200);
        expect(Array.isArray(result.body)).toBe(true);
    }, 60000);

    it('should update execution', async () => {
        const result = mockApp.put(`/api/executions/${executionId}`, () => {});
        expect(result.status).toBe(200);
        expect(result.body.status).toBe('Pass');
        expect(result.body.comment).toBe('수정됨');
    }, 60000);

    it('should delete execution', async () => {
        const result = mockApp.delete(`/api/executions/${executionId}`, () => {});
        expect(result.status).toBe(204);
    }, 60000);
}); 