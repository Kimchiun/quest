import { createTestCase, getTestCaseById, updateTestCase, deleteTestCase, listTestCases, createTestCaseVersion, listTestCaseVersions } from '../src/main/app/domains/testcases/repositories/testCaseRepository';
import pgClient, { ensurePgConnected } from '../src/main/app/infrastructure/database/pgClient';

describe('TestCaseRepository', () => {
  let testcaseId: number;
  beforeAll(async () => {
    await ensurePgConnected();
    await pgClient.query('DELETE FROM testcase_versions');
    await pgClient.query('DELETE FROM testcases');
  });

  it('createTestCase & getTestCaseById', async () => {
    const tc = await createTestCase({
      title: 'TC1',
      prereq: 'none',
      steps: ['step1', 'step2'],
      expected: 'ok',
      priority: 'High',
      tags: ['smoke'],
      status: 'Active',
      createdBy: 'tester',
    });
    testcaseId = tc.id;
    expect(tc.title).toBe('TC1');
    const found = await getTestCaseById(tc.id);
    expect(found?.id).toBe(tc.id);
  });

  it('updateTestCase', async () => {
    const updated = await updateTestCase(testcaseId, { title: 'TC1-upd', steps: ['step1'], status: 'Archived' });
    expect(updated?.title).toBe('TC1-upd');
    expect(updated?.status).toBe('Archived');
  });

  it('listTestCases', async () => {
    const list = await listTestCases();
    expect(list.length).toBeGreaterThan(0);
  });

  it('createTestCaseVersion & listTestCaseVersions', async () => {
    const v = await createTestCaseVersion({
      testcaseId,
      version: 1,
      data: { title: 'TC1', prereq: 'none', steps: ['step1', 'step2'], expected: 'ok', priority: 'High', tags: ['smoke'], status: 'Active', createdBy: 'tester' },
      createdBy: 'tester',
    });
    expect(v.version).toBe(1);
    const versions = await listTestCaseVersions(testcaseId);
    expect(versions.length).toBeGreaterThan(0);
  });

  it('deleteTestCase', async () => {
    const ok = await deleteTestCase(testcaseId);
    expect(ok).toBe(true);
    const found = await getTestCaseById(testcaseId);
    expect(found).toBeNull();
  });

  afterAll(async () => {
    await pgClient.query('DELETE FROM testcase_versions');
    await pgClient.query('DELETE FROM testcases');
    await pgClient.end();
  });
}); 