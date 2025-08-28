import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import * as folderService from '../src/main/app/domains/folders/services/folderService';
import * as folderRepository from '../src/main/app/domains/folders/repositories/folderRepository';

// Mock folderRepository
jest.mock('../src/main/app/domains/folders/repositories/folderRepository');
const mockFolderRepository = folderRepository as jest.Mocked<typeof folderRepository>;

describe('Folder Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // listFolders 모킹 추가
    mockFolderRepository.listFolders.mockResolvedValue([]);
    
    // getFolderById 모킹 추가
    mockFolderRepository.getFolderById.mockResolvedValue({
      id: 1,
      name: 'Test Folder',
      description: 'Test Description',
      parentId: undefined,
      projectId: 1,
      orderIndex: 100,
      depth: 0,
      createdBy: 'testuser',
      isLocked: false,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });

  describe('createFolder', () => {
    it('should create a folder successfully', async () => {
      const folderData = {
        name: 'Test Folder',
        description: 'Test Description',
        parentId: undefined,
        projectId: 1
      };

      const expectedFolder = {
        id: 1,
        name: 'Test Folder',
        description: 'Test Description',
        parentId: undefined,
        projectId: 1,
        orderIndex: 100,
        depth: 0,
        createdBy: 'testuser',
        isLocked: false,
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockFolderRepository.createFolder.mockResolvedValue(expectedFolder);

      const result = await folderService.createFolder(folderData, 'testuser');

      expect(result).toEqual(expectedFolder);
      expect(mockFolderRepository.createFolder).toHaveBeenCalledWith({
        projectId: 1,
        parentId: undefined,
        name: 'Test Folder',
        description: 'Test Description',
        orderIndex: 100,
        depth: 0,
        createdBy: 'testuser',
        isLocked: false,
        isArchived: false
      });
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
        projectId: 1,
        orderIndex: 100,
        depth: 0,
        createdBy: 'testuser',
        isLocked: false,
        isArchived: false,
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
          projectId: 1,
          orderIndex: 100,
          depth: 0,
          createdBy: 'testuser',
          isLocked: false,
          isArchived: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          name: 'Folder 2',
          description: 'Description 2',
          parentId: 1,
          projectId: 1,
          orderIndex: 200,
          depth: 1,
          createdBy: 'testuser',
          isLocked: false,
          isArchived: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      mockFolderRepository.listFolders.mockResolvedValue(expectedFolders);

      const result = await folderService.listFoldersByProject(1);

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
        projectId: 1,
        orderIndex: 100,
        depth: 0,
        createdBy: 'testuser',
        isLocked: false,
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockFolderRepository.updateFolder.mockResolvedValue(expectedFolder);

      const result = await folderService.updateFolder(folderId, updateData, 'testuser');

      expect(result).toEqual(expectedFolder);
      expect(mockFolderRepository.updateFolder).toHaveBeenCalledWith(folderId, { ...updateData, updatedBy: 'testuser' });
    });

    it('should return null when folder not found', async () => {
      const folderId = 999;
      const updateData = {
        name: 'Updated Folder',
        updatedBy: 'testuser'
      };

      mockFolderRepository.updateFolder.mockResolvedValue(null);

      const result = await folderService.updateFolder(folderId, updateData, 'testuser');

      expect(result).toBeNull();
      expect(mockFolderRepository.updateFolder).toHaveBeenCalledWith(folderId, { ...updateData, updatedBy: 'testuser' });
    });
  });

  describe('deleteFolder', () => {
    it('should delete folder successfully', async () => {
      const folderId = 1;

      mockFolderRepository.deleteFolder.mockResolvedValue(true);

      const result = await folderService.deleteFolder(folderId, 'soft', 'testuser');

      expect(result).toBe(true);
      expect(mockFolderRepository.deleteFolder).toHaveBeenCalledWith(folderId, 'soft', 'testuser');
    });

    it('should return false when folder not found', async () => {
      const folderId = 999;

      mockFolderRepository.deleteFolder.mockResolvedValue(false);

      const result = await folderService.deleteFolder(folderId, 'soft', 'testuser');

      expect(result).toBe(false);
      expect(mockFolderRepository.deleteFolder).toHaveBeenCalledWith(folderId, 'soft', 'testuser');
    });
  });


}); 