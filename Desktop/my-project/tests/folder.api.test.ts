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

describe('POST /api/folders/:id/move', () => {
  it('should prevent moving a folder into itself', async () => {
    // 1. 폴더 생성
    const folder = await request(app)
      .post('/api/folders')
      .send({ name: 'SelfMove', createdBy: 'testuser' })
      .expect(201);
    // 2. 자기 자신으로 이동 시도
    const res = await request(app)
      .post(`/api/folders/${folder.body.id}/move`)
      .send({ targetParentId: folder.body.id, updatedBy: 'testuser' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/순환|circular|self/i);
  });

  it('should prevent moving a folder into its descendant', async () => {
    // 1. 부모-자식 폴더 생성
    const parent = await request(app)
      .post('/api/folders')
      .send({ name: 'Parent', createdBy: 'testuser' })
      .expect(201);
    const child = await request(app)
      .post('/api/folders')
      .send({ name: 'Child', parentId: parent.body.id, createdBy: 'testuser' })
      .expect(201);
    // 2. 부모를 자식의 하위로 이동 시도
    const res = await request(app)
      .post(`/api/folders/${parent.body.id}/move`)
      .send({ targetParentId: child.body.id, updatedBy: 'testuser' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/순환|circular|descendant/i);
  });
});

describe('POST /api/folders/:id/testcases/:testCaseId', () => {
  it('should prevent adding the same test case to the same folder twice', async () => {
    // 1. 폴더, 테스트케이스 생성
    const folder = await request(app)
      .post('/api/folders')
      .send({ name: 'DupFolder', createdBy: 'testuser' })
      .expect(201);
    const testcase = { id: 9999 }; // 실제 환경에 맞게 생성/fixture 필요
    // 2. 최초 추가
    await request(app)
      .post(`/api/folders/${folder.body.id}/testcases/${testcase.id}`)
      .send({ updatedBy: 'testuser' });
    // 3. 중복 추가 시도
    const res = await request(app)
      .post(`/api/folders/${folder.body.id}/testcases/${testcase.id}`)
      .send({ updatedBy: 'testuser' });
    expect([400, 409]).toContain(res.status);
  });
});

describe('Concurrency Tests', () => {
  it('should handle concurrent folder moves without data corruption', async () => {
    // 1. 부모-자식 폴더 생성
    const parent = await request(app)
      .post('/api/folders')
      .send({ name: 'ParentForConcurrent', createdBy: 'testuser' })
      .expect(201);
    const child = await request(app)
      .post('/api/folders')
      .send({ name: 'ChildForConcurrent', parentId: parent.body.id, createdBy: 'testuser' })
      .expect(201);
    
    // 2. 동시에 같은 폴더를 다른 위치로 이동 시도
    const targetFolder = await request(app)
      .post('/api/folders')
      .send({ name: 'TargetForConcurrent', createdBy: 'testuser' })
      .expect(201);
    
    const concurrentMoves = [
      request(app).post(`/api/folders/${child.body.id}/move`)
        .send({ targetParentId: targetFolder.body.id, updatedBy: 'user1' }),
      request(app).post(`/api/folders/${child.body.id}/move`)
        .send({ targetParentId: null, updatedBy: 'user2' })
    ];
    
    const results = await Promise.allSettled(concurrentMoves);
    
    // 3. 하나는 성공, 하나는 실패해야 함 (동시성 제어)
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value.status === 200).length;
    const failureCount = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && r.value.status !== 200)).length;
    
    expect(successCount).toBe(1);
    expect(failureCount).toBe(1);
  });

  it('should handle concurrent test case additions without duplicates', async () => {
    // 1. 폴더와 테스트케이스 생성
    const folder = await request(app)
      .post('/api/folders')
      .send({ name: 'FolderForConcurrent', createdBy: 'testuser' })
      .expect(201);
    const testcase = await request(app)
      .post('/api/testcases')
      .send({ title: 'TestCaseForConcurrent', createdBy: 'testuser' })
      .expect(201);
    
    // 2. 동시에 같은 케이스를 같은 폴더에 추가 시도
    const concurrentAdds = [
      request(app).post(`/api/folders/${folder.body.id}/testcases/${testcase.body.id}`)
        .send({ updatedBy: 'user1' }),
      request(app).post(`/api/folders/${folder.body.id}/testcases/${testcase.body.id}`)
        .send({ updatedBy: 'user2' })
    ];
    
    const results = await Promise.allSettled(concurrentAdds);
    
    // 3. 하나는 성공, 하나는 실패해야 함 (중복 방지)
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value.status === 204).length;
    const failureCount = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && r.value.status !== 204)).length;
    
    expect(successCount).toBe(1);
    expect(failureCount).toBe(1);
  });
});

describe('Performance Tests', () => {
  it('should handle large folder tree within 2 seconds', async () => {
    const startTime = Date.now();
    
    // 대량 폴더 조회 테스트
    const response = await request(app)
      .get('/api/folders/tree')
      .expect(200);
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(responseTime).toBeLessThan(2000); // 2초 이내
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should handle paginated folder loading efficiently', async () => {
    const startTime = Date.now();
    
    // 페이징된 폴더 조회 (실제 구현 시)
    const response = await request(app)
      .get('/api/folders?page=1&limit=100')
      .expect(200);
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(responseTime).toBeLessThan(1000); // 1초 이내
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should handle batch test case moves efficiently', async () => {
    // 대량 케이스 이동 성능 테스트 (실제 구현 시)
    const startTime = Date.now();
    
    // 실제 배치 이동 API 호출
    const response = await request(app)
      .post('/api/folders/1/testcases/batch')
      .send({ testCaseIds: [1, 2, 3, 4, 5], updatedBy: 'testuser' })
      .expect(204);
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(responseTime).toBeLessThan(1000); // 1초 이내
  });
});

// 권한/동시성 테스트는 실제 인증/락 구현에 따라 추가 가능 