import { http, HttpResponse } from 'msw';

const baseURL = 'http://localhost:3000';

// Mock 데이터
const mockTestCases = [
  {
    id: 1,
    title: '사용자 로그인 테스트',
    prereq: '사용자 계정이 등록되어 있어야 함',
    steps: ['이메일 입력', '비밀번호 입력', '로그인 버튼 클릭'],
    expected: '로그인 성공 후 대시보드로 이동',
    priority: 'High' as const,
    tags: ['로그인', '인증'],
    status: 'Active' as const,
    createdBy: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 2,
    title: '상품 검색 테스트',
    prereq: '상품 데이터가 등록되어 있어야 함',
    steps: ['검색창 클릭', '상품명 입력', '검색 버튼 클릭'],
    expected: '검색 결과 목록이 표시됨',
    priority: 'Medium' as const,
    tags: ['검색', '상품'],
    status: 'Active' as const,
    createdBy: 1,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

const mockReleases = [
  {
    id: 1,
    name: 'v1.0.0',
    description: '첫 번째 릴리즈',
    version: '1.0.0',
    status: 'Released' as const,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    createdBy: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

const mockDefects = [
  {
    id: 1,
    title: '로그인 버튼 클릭 시 오류 발생',
    description: '로그인 버튼을 클릭했을 때 서버 오류가 발생합니다.',
    severity: 'High' as const,
    priority: 'High' as const,
    status: 'Open' as const,
    reportedBy: 1,
    testcaseId: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

const mockExecutions = [
  {
    id: 1,
    testcaseId: 1,
    status: 'Pass' as const,
    executedBy: 1,
    executedAt: new Date('2024-01-01'),
    duration: 30,
    notes: '정상적으로 실행됨',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

const mockComments = [
  {
    id: 1,
    content: '테스트 실행 완료',
    authorId: 1,
    executionId: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// API 핸들러
export const handlers = [
  // TestCase API
  http.get(`${baseURL}/api/testcases`, () => {
    return HttpResponse.json(mockTestCases);
  }),

  http.get(`${baseURL}/api/testcases/:id`, ({ params }) => {
    const { id } = params;
    const testCase = mockTestCases.find(tc => tc.id === Number(id));
    
    if (!testCase) {
      return HttpResponse.json(
        { message: '테스트 케이스를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(testCase);
  }),

  http.post(`${baseURL}/api/testcases`, async ({ request }) => {
    const newTestCase = await request.json() as any;
    const testCase = {
      ...newTestCase,
      id: mockTestCases.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockTestCases.push(testCase);
    
    return HttpResponse.json(testCase, { status: 201 });
  }),

  http.put(`${baseURL}/api/testcases/:id`, async ({ params, request }) => {
    const { id } = params;
    const updateData = await request.json() as any;
    const index = mockTestCases.findIndex(tc => tc.id === Number(id));
    
    if (index === -1) {
      return HttpResponse.json(
        { message: '테스트 케이스를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    mockTestCases[index] = {
      ...mockTestCases[index],
      ...updateData,
      updatedAt: new Date(),
    };
    
    return HttpResponse.json(mockTestCases[index]);
  }),

  http.delete(`${baseURL}/api/testcases/:id`, ({ params }) => {
    const { id } = params;
    const index = mockTestCases.findIndex(tc => tc.id === Number(id));
    
    if (index === -1) {
      return HttpResponse.json(
        { message: '테스트 케이스를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    mockTestCases.splice(index, 1);
    
    return new HttpResponse(null, { status: 204 });
  }),

  // Release API
  http.get(`${baseURL}/api/releases`, () => {
    return HttpResponse.json(mockReleases);
  }),

  http.get(`${baseURL}/api/releases/:id`, ({ params }) => {
    const { id } = params;
    const release = mockReleases.find(r => r.id === Number(id));
    
    if (!release) {
      return HttpResponse.json(
        { message: '릴리즈를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(release);
  }),

  // Defect API
  http.get(`${baseURL}/api/defects`, () => {
    return HttpResponse.json(mockDefects);
  }),

  http.get(`${baseURL}/api/defects/:id`, ({ params }) => {
    const { id } = params;
    const defect = mockDefects.find(d => d.id === Number(id));
    
    if (!defect) {
      return HttpResponse.json(
        { message: '결함을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(defect);
  }),

  // Execution API
  http.get(`${baseURL}/api/executions/testcase/:testcaseId`, ({ params }) => {
    const { testcaseId } = params;
    const executions = mockExecutions.filter(e => e.testcaseId === Number(testcaseId));
    
    return HttpResponse.json(executions);
  }),

  // Comment API
  http.get(`${baseURL}/api/comments/execution/:executionId`, ({ params }) => {
    const { executionId } = params;
    const comments = mockComments.filter(c => c.executionId === Number(executionId));
    
    return HttpResponse.json(comments);
  }),

  // Auth API
  http.post(`${baseURL}/api/auth/login`, async ({ request }) => {
    const { username, password } = await request.json() as any;
    
    if (username === 'admin' && password === 'admin123') {
      return HttpResponse.json({
        token: 'mock-jwt-token',
        user: {
          id: 1,
          username: 'admin',
          role: 'ADMIN',
          createdAt: new Date(),
        },
      });
    }
    
    return HttpResponse.json(
      { message: '잘못된 인증 정보입니다.' },
      { status: 401 }
    );
  }),

  http.post(`${baseURL}/api/auth/register`, async ({ request }) => {
    const userData = await request.json() as any;
    
    return HttpResponse.json({
      id: 2,
      username: userData?.username || '',
      role: userData?.role || 'USER',
      createdAt: new Date(),
    }, { status: 201 });
  }),

  // Bulk Operations
  http.post(`${baseURL}/api/bulk/move`, async ({ request }) => {
    const { ids, targetFolder } = await request.json() as any;
    
    return HttpResponse.json({ message: `${ids?.length || 0}개의 테스트 케이스가 이동되었습니다.` });
  }),

  http.post(`${baseURL}/api/bulk/copy`, async ({ request }) => {
    const { ids, targetFolder } = await request.json() as any;
    
    return HttpResponse.json({ message: `${ids?.length || 0}개의 테스트 케이스가 복사되었습니다.` });
  }),

  http.delete(`${baseURL}/api/bulk`, async ({ request }) => {
    const { ids } = await request.json() as any;
    
    return HttpResponse.json({ message: `${ids?.length || 0}개의 테스트 케이스가 삭제되었습니다.` });
  }),

  http.patch(`${baseURL}/api/bulk/status`, async ({ request }) => {
    const { ids, status } = await request.json() as any;
    
    return HttpResponse.json({ message: `${ids?.length || 0}개의 테스트 케이스 상태가 변경되었습니다.` });
  }),

  // Health Check
  http.get(`${baseURL}/health`, () => {
    return HttpResponse.json({ status: 'ok' });
  }),
]; 