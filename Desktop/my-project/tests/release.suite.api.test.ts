(global as any).setImmediate = ((fn: any, ...args: any[]) => setTimeout(fn, 0, ...args)) as any;
if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = require('stream').Readable;
}
(global as any).TextEncoder = require('util').TextEncoder;
(global as any).TextDecoder = require('util').TextDecoder;
const request = require('supertest');
const app = require('../src/main/app/app').default;
const pgClient = require('../src/main/app/infrastructure/database/pgClient').default;
const ensurePgConnected = require('../src/main/app/infrastructure/database/pgClient').ensurePgConnected;

describe('릴리즈/스위트/케이스 할당 API', () => {
  let releaseId: number;
  let suiteId: number;
  let testcaseId: number;

  beforeAll(async () => {
    await ensurePgConnected();
    await pgClient.query('DELETE FROM suite_cases');
    await pgClient.query('DELETE FROM suites');
    await pgClient.query('DELETE FROM releases');
    await pgClient.query('DELETE FROM testcases');
    // 테스트케이스 생성
    const tcRes = await pgClient.query(
      `INSERT INTO testcases (title, steps, expected, priority, tags, status, created_by) VALUES ('TC', '[]', 'ok', 'High', '{}', 'Active', 'tester') RETURNING id`
    );
    testcaseId = tcRes.rows[0].id;
  });

  it('릴리즈 생성', async () => {
    const res = await request(app).post('/api/releases').send({ name: 'R1', description: '릴리즈1' });
    expect(res.status).toBe(201);
    releaseId = res.body.id;
  });

  it('스위트 생성', async () => {
    const res = await request(app).post(`/api/releases/${releaseId}/suites`).send({ name: 'S1', description: '스위트1' });
    expect(res.status).toBe(201);
    suiteId = res.body.id;
  });

  it('테스트케이스 할당', async () => {
    const res = await request(app).post(`/api/releases/suites/${suiteId}/cases/${testcaseId}`);
    expect(res.status).toBe(204);
  });

  it('스위트별 케이스 목록', async () => {
    const res = await request(app).get(`/api/releases/suites/${suiteId}/cases`);
    expect(res.status).toBe(200);
    expect(res.body).toContain(testcaseId);
  });

  it('테스트케이스 할당 해제', async () => {
    const res = await request(app).delete(`/api/releases/suites/${suiteId}/cases/${testcaseId}`);
    expect(res.status).toBe(204);
  });

  afterAll(async () => {
    await pgClient.query('DELETE FROM suite_cases');
    await pgClient.query('DELETE FROM suites');
    await pgClient.query('DELETE FROM releases');
    await pgClient.end();
  });
}); 