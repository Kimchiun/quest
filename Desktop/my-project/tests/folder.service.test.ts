import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import * as folderService from '../src/main/app/domains/folders/services/folderService';
import * as folderRepository from '../src/main/app/domains/folders/repositories/folderRepository';

// Mock folderRepository
jest.mock('../src/main/app/domains/folders/repositories/folderRepository');
const mockFolderRepository = folderRepository as jest.Mocked<typeof folderRepository>;

describe('Folder Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createFolder', () => {
    it('should create a folder successfully', async () => {
      const folderData = {
        name: 'Test Folder',
        description: 'Test Description',
        parentId: undefined,
        sortOrder: 0,
        createdBy: 'testuser'
      };

      const expectedFolder = {
        id: 1,
        name: 'Test Folder',
        description: 'Test Description',
        parentId: undefined,
        sortOrder: 0,
        createdBy: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockFolderRepository.createFolder.mockResolvedValue(expectedFolder);

      const result = await folderService.createFolder(folderData);

      expect(result).toEqual(expectedFolder);
      expect(mockFolderRepository.createFolder).toHaveBeenCalledWith(folderData);
    });
  });

  describe('getFolderById', () => {
    it('should return folder when found', async () => {
      const folderId = 1;
      const expectedFolder = {
        id: 1,
        name: 'Test Folder',
        description: 'Test Description',
        parentId: undefined,
        sortOrder: 0,
        createdBy: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockFolderRepository.getFolderById.mockResolvedValue(expectedFolder);

      const result = await folderService.getFolderById(folderId);

      expect(result).toEqual(expectedFolder);
      expect(mockFolderRepository.getFolderById).toHaveBeenCalledWith(folderId);
    });

    it('should return null when folder not found', async () => {
      const folderId = 999;

      mockFolderRepository.getFolderById.mockResolvedValue(null);

      const result = await folderService.getFolderById(folderId);

      expect(result).toBeNull();
      expect(mockFolderRepository.getFolderById).toHaveBeenCalledWith(folderId);
    });
  });

  describe('listFolders', () => {
    it('should return list of folders', async () => {
      const expectedFolders = [
        {
          id: 1,
          name: 'Folder 1',
          description: 'Description 1',
          parentId: undefined,
          sortOrder: 0,
          createdBy: 'testuser',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          name: 'Folder 2',
          description: 'Description 2',
          parentId: 1,
          sortOrder: 1,
          createdBy: 'testuser',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      mockFolderRepository.listFolders.mockResolvedValue(expectedFolders);

      const result = await folderService.listFolders();

      expect(result).toEqual(expectedFolders);
      expect(mockFolderRepository.listFolders).toHaveBeenCalled();
    });
  });

  describe('updateFolder', () => {
    it('should update folder successfully', async () => {
      const folderId = 1;
      const updateData = {
        name: 'Updated Folder',
        description: 'Updated Description',
        updatedBy: 'testuser'
      };

      const expectedFolder = {
        id: 1,
        name: 'Updated Folder',
        description: 'Updated Description',
        parentId: undefined,
        sortOrder: 0,
        createdBy: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockFolderRepository.updateFolder.mockResolvedValue(expectedFolder);

      const result = await folderService.updateFolder(folderId, updateData);

      expect(result).toEqual(expectedFolder);
      expect(mockFolderRepository.updateFolder).toHaveBeenCalledWith(folderId, updateData);
    });

    it('should return null when folder not found', async () => {
      const folderId = 999;
      const updateData = {
        name: 'Updated Folder',
        updatedBy: 'testuser'
      };

      mockFolderRepository.updateFolder.mockResolvedValue(null);

      const result = await folderService.updateFolder(folderId, updateData);

      expect(result).toBeNull();
      expect(mockFolderRepository.updateFolder).toHaveBeenCalledWith(folderId, updateData);
    });
  });

  describe('deleteFolder', () => {
    it('should delete folder successfully', async () => {
      const folderId = 1;

      mockFolderRepository.deleteFolder.mockResolvedValue(true);

      const result = await folderService.deleteFolder(folderId);

      expect(result).toBe(true);
      expect(mockFolderRepository.deleteFolder).toHaveBeenCalledWith(folderId);
    });

    it('should return false when folder not found', async () => {
      const folderId = 999;

      mockFolderRepository.deleteFolder.mockResolvedValue(false);

      const result = await folderService.deleteFolder(folderId);

      expect(result).toBe(false);
      expect(mockFolderRepository.deleteFolder).toHaveBeenCalledWith(folderId);
    });
  });

  describe('addTestCaseToFolder', () => {
    it('should add test case to folder successfully', async () => {
      const testCaseId = 1;
      const folderId = 1;

      const mockFolder = {
        id: 1,
        name: 'Test Folder',
        description: 'Test Description',
        parentId: undefined,
        sortOrder: 0,
        createdBy: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockFolderRepository.getFolderById.mockResolvedValue(mockFolder);
      mockFolderRepository.addTestCaseToFolder.mockResolvedValue(true);

      const result = await folderService.addTestCaseToFolder(testCaseId, folderId);

      expect(result).toBe(true);
      expect(mockFolderRepository.getFolderById).toHaveBeenCalledWith(folderId);
      expect(mockFolderRepository.addTestCaseToFolder).toHaveBeenCalledWith(testCaseId, folderId);
    });

    it('should throw error when folder not found', async () => {
      const testCaseId = 1;
      const folderId = 999;

      mockFolderRepository.getFolderById.mockResolvedValue(null);

      await expect(folderService.addTestCaseToFolder(testCaseId, folderId))
        .rejects
        .toThrow('폴더를 찾을 수 없습니다.');
    });
  });
}); 