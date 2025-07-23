import { createTestCaseWithVersion, updateTestCaseWithVersion, deleteTestCaseWithIndex, getTestCaseVersions } from '../src/main/app/domains/testcases/services/testCaseService';
import { getTestCaseById } from '../src/main/app/domains/testcases/repositories/testCaseRepository';
import esClient from '../src/main/app/infrastructure/elasticsearch/esClient';

describe('TestCaseService', () => {
  let testcaseId: number;
  beforeAll(async () => {
    await esClient.indices.delete({ index: 'testcases' }, { ignore: [404] });
    await esClient.indices.create({ index: 'testcases' });
  });

  it('createTestCaseWithVersion', async () => {
    const tc = await createTestCaseWithVersion({
      title: 'TC2',
      prereq: 'none',
      steps: ['step1', 'step2'],
      expected: 'ok',
      priority: 'Medium',
      tags: ['regression'],
      status: 'Active',
      createdBy: 'tester',
    });
    testcaseId = tc.id;
    expect(tc.title).toBe('TC2');
    const found = await getTestCaseById(tc.id);
    expect(found?.id).toBe(tc.id);
  });

  it('updateTestCaseWithVersion', async () => {
    const updated = await updateTestCaseWithVersion(testcaseId, { title: 'TC2-upd', steps: ['step1'], status: 'Archived' }, 'tester');
    expect(updated?.title).toBe('TC2-upd');
    expect(updated?.status).toBe('Archived');
  });

  it('getTestCaseVersions', async () => {
    const versions = await getTestCaseVersions(testcaseId);
    expect(versions.length).toBeGreaterThan(0);
  });

  it('deleteTestCaseWithIndex', async () => {
    const ok = await deleteTestCaseWithIndex(testcaseId);
    expect(ok).toBe(true);
    const found = await getTestCaseById(testcaseId);
    expect(found).toBeNull();
  });
}); 