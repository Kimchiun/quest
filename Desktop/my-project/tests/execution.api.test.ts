import { TextEncoder, TextDecoder } from 'util';
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
if (typeof (global as any).ReadableStream === 'undefined') {
  (global as any).ReadableStream = require('stream').Readable;
}
if (typeof (global as any).setImmediate === 'undefined') {
  (global as any).setImmediate = (fn: any, ...args: any[]) => setTimeout(fn, 0, ...args);
}

import request from 'supertest';
import app from '../src/main/app/app';

// 테스트용 fixture 데이터(실제 환경에 맞게 조정 필요)
const TESTCASE_ID = 1;
const EXECUTED_BY = 'testuser';

let executionId: number;

describe('Execution API', () => {
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
    });

    it('should get execution by id', async () => {
        const res = await request(app).get(`/api/executions/${executionId}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(executionId);
    });

    it('should get executions by testcase', async () => {
        const res = await request(app).get(`/api/executions/testcase/${TESTCASE_ID}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should update execution', async () => {
        const res = await request(app)
            .put(`/api/executions/${executionId}`)
            .send({ status: 'Pass', comment: '수정됨' });
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('Pass');
        expect(res.body.comment).toBe('수정됨');
    });

    it('should delete execution', async () => {
        const res = await request(app).delete(`/api/executions/${executionId}`);
        expect(res.status).toBe(204);
    });
}); 