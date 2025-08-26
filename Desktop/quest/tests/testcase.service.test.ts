import { createTestCaseWithVersion, updateTestCaseWithVersion, deleteTestCaseWithIndex, getTestCaseVersions } from '../src/main/app/domains/testcases/services/testCaseService';
import { getTestCaseById } from '../src/main/app/domains/testcases/repositories/testCaseRepository';

// Mock Elasticsearch client
jest.mock('../src/main/app/infrastructure/elasticsearch/esClient', () => ({
  indices: {
    delete: jest.fn().mockResolvedValue({}),
    create: jest.fn().mockResolvedValue({}),
  },
  index: jest.fn().mockResolvedValue({}),
  search: jest.fn().mockResolvedValue({ hits: { hits: [] } }),
  update: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({}),
}));

// Mock PostgreSQL client with ensurePgConnected
jest.mock('../src/main/app/infrastructure/database/pgClient', () => ({
  query: jest.fn().mockResolvedValue({ rows: [] }),
  connect: jest.fn().mockResolvedValue({}),
  ensurePgConnected: jest.fn().mockResolvedValue({}),
}));

describe('TestCaseService', () => {
  let testcaseId: number;
  
  beforeEach(() => {
    jest.clearAllMocks();
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
  }, 60000);

  it('updateTestCaseWithVersion', async () => {
    const updated = await updateTestCaseWithVersion(testcaseId, { title: 'TC2-upd', steps: ['step1'], status: 'Archived' }, 'tester');
    expect(updated?.title).toBe('TC2-upd');
    expect(updated?.status).toBe('Archived');
  }, 60000);

  it('getTestCaseVersions', async () => {
    const versions = await getTestCaseVersions(testcaseId);
    expect(versions.length).toBeGreaterThan(0);
  }, 60000);

  it('deleteTestCaseWithIndex', async () => {
    const ok = await deleteTestCaseWithIndex(testcaseId);
    expect(ok).toBe(true);
    const found = await getTestCaseById(testcaseId);
    expect(found).toBeNull();
  }, 60000);
}); 