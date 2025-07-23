import request from 'supertest';
import app from '../src/main/app/app';
import pgClient, { ensurePgConnected } from '../src/main/app/infrastructure/database/pgClient';

describe('인증/권한 API', () => {
  beforeAll(async () => {
    await ensurePgConnected();
    await pgClient.query('DELETE FROM users'); // 테스트 격리
  });

  const user = { username: 'testuser', password: 'testpass123', role: 'QA' };
  let token: string;

  it('회원가입 성공', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(201);
    expect(res.body.username).toBe(user.username);
    expect(res.body.role).toBe(user.role);
  });

  it('중복 회원가입 실패', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(409);
  });

  it('로그인 성공 및 JWT 반환', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: user.username, password: user.password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('잘못된 비밀번호 로그인 실패', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: user.username, password: 'wrongpass' });
    expect(res.status).toBe(401);
  });

  // RBAC 미들웨어 테스트용 protected 엔드포인트 예시
  it('권한 미들웨어: QA만 접근 허용', async () => {
    // 임시 라우트 추가 필요 (app에 직접 추가)
    app.get('/api/protected-qa', (req, res, next) => {
      (req as any).user = { ...user, role: 'QA' }; // 테스트용 강제 주입
      next();
    }, require('../src/main/app/domains/users/middleware/rbacMiddleware').requireRole(['QA']), (req, res) => {
      res.json({ ok: true });
    });
    const res = await request(app).get('/api/protected-qa');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  afterAll(async () => {
    await pgClient.query('DELETE FROM users');
    await pgClient.end();
  });
}); 