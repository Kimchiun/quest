import request from 'supertest';
import app from '../src/main/app/app';

describe('Folder API', () => {
  describe('GET /api/folders/tree', () => {
    it('should return folder tree structure', async () => {
      const response = await request(app)
        .get('/api/folders/tree')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Root 폴더가 있는지 확인
      const rootFolder = response.body.find((folder: any) => folder.name === 'Root');
      expect(rootFolder).toBeDefined();
    });
  });

  describe('GET /api/folders', () => {
    it('should return all folders', async () => {
      const response = await request(app)
        .get('/api/folders')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/folders', () => {
    it('should create a new folder', async () => {
      const newFolder = {
        name: 'Test Folder',
        description: 'Test folder description',
        createdBy: 'testuser'
      };

      const response = await request(app)
        .post('/api/folders')
        .send(newFolder)
        .expect(201);

      expect(response.body.name).toBe(newFolder.name);
      expect(response.body.description).toBe(newFolder.description);
      expect(response.body.createdBy).toBe(newFolder.createdBy);
    });

    it('should create a folder with parent', async () => {
      // 먼저 부모 폴더 생성
      const parentFolder = {
        name: 'Parent Folder',
        description: 'Parent folder description',
        createdBy: 'testuser'
      };

      const parentResponse = await request(app)
        .post('/api/folders')
        .send(parentFolder)
        .expect(201);

      // 자식 폴더 생성
      const childFolder = {
        name: 'Child Folder',
        description: 'Child folder description',
        parentId: parentResponse.body.id,
        createdBy: 'testuser'
      };

      const childResponse = await request(app)
        .post('/api/folders')
        .send(childFolder)
        .expect(201);

      expect(childResponse.body.parentId).toBe(parentResponse.body.id);
    });
  });

  describe('GET /api/folders/:id', () => {
    it('should return folder by id', async () => {
      // 먼저 폴더 생성
      const newFolder = {
        name: 'Test Folder for Get',
        description: 'Test folder description',
        createdBy: 'testuser'
      };

      const createResponse = await request(app)
        .post('/api/folders')
        .send(newFolder)
        .expect(201);

      const folderId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/folders/${folderId}`)
        .expect(200);

      expect(response.body.id).toBe(folderId);
      expect(response.body.name).toBe(newFolder.name);
    });

    it('should return 404 for non-existent folder', async () => {
      await request(app)
        .get('/api/folders/99999')
        .expect(404);
    });
  });

  describe('PUT /api/folders/:id', () => {
    it('should update folder', async () => {
      // 먼저 폴더 생성
      const newFolder = {
        name: 'Test Folder for Update',
        description: 'Original description',
        createdBy: 'testuser'
      };

      const createResponse = await request(app)
        .post('/api/folders')
        .send(newFolder)
        .expect(201);

      const folderId = createResponse.body.id;

      // 폴더 업데이트
      const updateData = {
        name: 'Updated Folder Name',
        description: 'Updated description',
        updatedBy: 'testuser'
      };

      const response = await request(app)
        .put(`/api/folders/${folderId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.description).toBe(updateData.description);
    });
  });

  describe('DELETE /api/folders/:id', () => {
    it('should delete folder', async () => {
      // 먼저 폴더 생성
      const newFolder = {
        name: 'Test Folder for Delete',
        description: 'Test folder description',
        createdBy: 'testuser'
      };

      const createResponse = await request(app)
        .post('/api/folders')
        .send(newFolder)
        .expect(201);

      const folderId = createResponse.body.id;

      // 폴더 삭제
      await request(app)
        .delete(`/api/folders/${folderId}`)
        .expect(204);

      // 삭제 확인
      await request(app)
        .get(`/api/folders/${folderId}`)
        .expect(404);
    });
  });

  describe('GET /api/folders/:id/testcases', () => {
    it('should return test cases in folder', async () => {
      // 먼저 폴더 생성
      const newFolder = {
        name: 'Test Folder for Test Cases',
        description: 'Test folder description',
        createdBy: 'testuser'
      };

      const createResponse = await request(app)
        .post('/api/folders')
        .send(newFolder)
        .expect(201);

      const folderId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/folders/${folderId}/testcases`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
}); 