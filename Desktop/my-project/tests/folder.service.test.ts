import { describe, it, expect, beforeEach, afterAll, jest } from '@jest/globals';
import * as folderService from '../src/main/app/domains/folders/services/folderService';
import * as testCaseRepository from '../src/main/app/domains/testcases/repositories/testCaseRepository';
import * as folderRepository from '../src/main/app/domains/folders/repositories/folderRepository';
import pgClient from '../src/main/app/infrastructure/database/pgClient';

jest.setTimeout(180000); // 3분 타임아웃

// 실제 DB를 사용하는 fixture 함수
async function createTestFolder(name = 'TestFolder', parentId?: number) {
  const folder = await folderRepository.createFolder({ name, description: '', parentId, createdBy: 'testuser' });
  return folder.id;
}
async function createTestCase(title = 'TestCase') {
  const testCase = await testCaseRepository.createTestCase({
    title,
    prereq: '',
    steps: [],
    expected: '',
    priority: 'Medium',
    tags: [],
    status: 'Active',
    createdBy: 'testuser'
  });
  return testCase.id;
}

// 테스트 후 DB 정리
async function cleanup() {
  await pgClient.query('TRUNCATE case_folders RESTART IDENTITY CASCADE');
  await pgClient.query('TRUNCATE folders RESTART IDENTITY CASCADE');
  await pgClient.query('TRUNCATE testcases RESTART IDENTITY CASCADE');
}

describe('Folder Service Tests (Integration)', () => {
  beforeEach(async () => {
    await cleanup();
  });
  afterAll(async () => {
    await cleanup();
    await pgClient.end();
  });

  describe('moveFolder (Edge Cases)', () => {
    it('should throw error when moving a folder into itself', async () => {
      const folderId = await createTestFolder('TestFolderSelf');
      await expect(folderService.moveFolder(folderId, { targetParentId: folderId, updatedBy: 'testuser' }))
        .rejects.toThrow(/순환|circular|self/i);
    });

    it('should throw error when moving a folder into its descendant', async () => {
      const parentId = await createTestFolder('TestFolderParent');
      const childId = await createTestFolder('TestFolderChild', parentId);
      await expect(folderService.moveFolder(parentId, { targetParentId: childId, updatedBy: 'testuser' }))
        .rejects.toThrow(/순환|circular|descendant/i);
    });
  });

  describe('addTestCaseToFolder (Edge Cases)', () => {
    it('should throw error when adding the same test case twice', async () => {
      const folderId = await createTestFolder('TestFolderDup');
      const testCaseId = await createTestCase('TestCaseDup');
      await folderService.addTestCaseToFolder(testCaseId, folderId);
      await expect(folderService.addTestCaseToFolder(testCaseId, folderId))
        .rejects.toThrow(/중복|duplicate|already|포함/i);
    });
  });
}); 