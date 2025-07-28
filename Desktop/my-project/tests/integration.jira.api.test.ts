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
if (typeof (global as any).Response === 'undefined') {
  (global as any).Response = class {};
}
if (typeof (global as any).TransformStream === 'undefined') {
  (global as any).TransformStream = class {};
}
if (typeof (global as any).Request === 'undefined') {
  (global as any).Request = class {};
}

import request from 'supertest';
import app from '../src/main/app/app';
import nock from 'nock';

// 모킹 설정 - 올바른 경로 사용
jest.mock('../src/main/app/infrastructure/database/pgClient', () => ({
  query: jest.fn().mockResolvedValue({ rows: [] }),
  connect: jest.fn().mockResolvedValue({}),
}));

jest.mock('../src/main/app/infrastructure/elasticsearch/esClient', () => ({
  search: jest.fn().mockResolvedValue({ hits: { hits: [] } }),
  index: jest.fn().mockResolvedValue({}),
}));

// MSW와의 충돌 방지를 위한 설정
beforeAll(() => {
  // nock이 모든 HTTP 요청을 가로채도록 설정
  nock.disableNetConnect();
  nock.enableNetConnect('127.0.0.1');
  nock.enableNetConnect('localhost');
});

afterAll(() => {
  nock.restore();
});

describe('Jira Integration API', () => {
    const JIRA_URL = 'http://mock-jira.local';
    const API_PATH = '/rest/api/2/issue';
    const TEST_EXECUTION_ID = 1;
    const TEST_PARAMS = {
        executionId: TEST_EXECUTION_ID,
        summary: 'Test bug summary',
        description: 'Bug description',
        projectKey: 'TEST',
        jiraUrl: JIRA_URL,
        username: 'user',
        apiToken: 'token',
    };

    beforeEach(() => {
        // 각 테스트 전에 nock 초기화
        nock.cleanAll();
        jest.clearAllMocks();
    });

    afterEach(() => {
        nock.cleanAll();
    });

    it('should create a Jira issue and update execution', async () => {
        nock(JIRA_URL)
            .post(API_PATH)
            .reply(201, { key: 'TEST-123' });

        const res = await request(app)
            .post('/api/integrations/jira-issue')
            .send(TEST_PARAMS);
        expect(res.status).toBe(200);
        expect(res.body.key).toBe('TEST-123');
        expect(res.body.url).toContain('TEST-123');
    }, 60000);

    it('should handle Jira API error', async () => {
        nock(JIRA_URL)
            .post(API_PATH)
            .reply(400, { errorMessages: ['Invalid project'] });

        const res = await request(app)
            .post('/api/integrations/jira-issue')
            .send(TEST_PARAMS);
        expect(res.status).toBe(500);
        expect(res.body.error).toMatch(/Invalid project/);
    }, 60000);

    it('should handle Jira API timeout', async () => {
        nock(JIRA_URL)
            .post(API_PATH)
            .delay(9000)
            .reply(201, { key: 'TEST-999' });

        const res = await request(app)
            .post('/api/integrations/jira-issue')
            .send({ ...TEST_PARAMS, timeoutMs: 1000 });
        expect(res.status).toBe(500);
        expect(res.body.error).toMatch(/timed out/);
    }, 60000);
}); 