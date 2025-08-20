import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import type { 
  TestCase, 
  Release, 
  Suite, 
  Execution, 
  Defect, 
  Comment,
  User,
  TestFolder
} from '../types';

// 인증 토큰 관리
const getAuthToken = () => localStorage.getItem('accessToken');
const setAuthToken = (token: string) => localStorage.setItem('accessToken', token);
const removeAuthToken = () => localStorage.removeItem('accessToken');

// 토큰 갱신 함수
const refreshToken = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      setAuthToken(data.token);
      return data.token;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }
  return null;
};

// Base Query 설정
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3001',
  prepareHeaders: (headers) => {
    const token = getAuthToken();
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// 재시도 로직이 포함된 base query
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // 토큰 갱신 시도
    const refreshResult = await refreshToken();
    if (refreshResult) {
      // 새로운 토큰으로 재시도
      result = await baseQuery(args, api, extraOptions);
    } else {
      // 갱신 실패 시 로그아웃
      removeAuthToken();
      window.location.href = '/login';
    }
  }
  
  return result;
};

// API 서비스 정의
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['TestCase', 'Release', 'Suite', 'Execution', 'Defect', 'Comment', 'User'],
  endpoints: (builder) => ({
    // TestCase API
    getTestCases: builder.query<TestCase[], void>({
      query: () => '/api/testcases',
      providesTags: ['TestCase'],
    }),
    
    getTestCase: builder.query<TestCase, number>({
      query: (id) => `/api/testcases/${id}`,
      providesTags: (result, error, id) => [{ type: 'TestCase', id }],
    }),
    
    createTestCase: builder.mutation<TestCase, Partial<TestCase>>({
      query: (testCase) => ({
        url: '/api/testcases',
        method: 'POST',
        body: testCase,
      }),
      invalidatesTags: ['TestCase'],
    }),
    
    updateTestCase: builder.mutation<TestCase, { id: number; data: Partial<TestCase> }>({
      query: ({ id, data }) => ({
        url: `/api/testcases/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'TestCase', id }],
    }),
    
    deleteTestCase: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/testcases/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TestCase'],
    }),
    
    // Release API
    getReleases: builder.query<Release[], void>({
      query: () => '/api/releases',
      providesTags: ['Release'],
    }),
    
    getRelease: builder.query<Release, number>({
      query: (id) => `/api/releases/${id}`,
      providesTags: (result, error, id) => [{ type: 'Release', id }],
    }),
    
    getReleaseTestCases: builder.query<TestCase[], number>({
      query: (releaseId) => `/api/releases/${releaseId}/testcases`,
      providesTags: (result, error, releaseId) => [{ type: 'Release', id: releaseId }, 'TestCase'],
    }),
      getTestFolders: builder.query<TestFolder[], void>({
    query: () => '/api/releases/testcases/folders',
    transformResponse: (response: { success: boolean; data: TestFolder[] }) => response.data,
    providesTags: ['TestFolder'],
  }),
  getFolderTestCases: builder.query<any[], number>({
    query: (folderId) => `/api/releases/folders/${folderId}/testcases`,
    providesTags: (result, error, folderId) => [{ type: 'Folder', id: folderId }, 'TestCase'],
  }),
    
    createRelease: builder.mutation<Release, Partial<Release>>({
      query: (release) => ({
        url: '/api/releases',
        method: 'POST',
        body: release,
      }),
      invalidatesTags: ['Release'],
    }),
    
    updateRelease: builder.mutation<Release, { id: number; data: Partial<Release> }>({
      query: ({ id, data }) => ({
        url: `/api/releases/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Release', id }],
    }),
    
    deleteRelease: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/releases/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Release'],
    }),
    
    // Suite API
    getSuites: builder.query<Suite[], void>({
      query: () => '/api/suites',
      providesTags: ['Suite'],
    }),
    
    createSuite: builder.mutation<Suite, Partial<Suite>>({
      query: (suite) => ({
        url: '/api/suites',
        method: 'POST',
        body: suite,
      }),
      invalidatesTags: ['Suite'],
    }),
    
    // Execution API
    getExecutions: builder.query<Execution[], number>({
      query: (testcaseId) => `/api/executions/testcase/${testcaseId}`,
      providesTags: ['Execution'],
    }),
    
    createExecution: builder.mutation<Execution, Partial<Execution>>({
      query: (execution) => ({
        url: '/api/executions',
        method: 'POST',
        body: execution,
      }),
      invalidatesTags: ['Execution'],
    }),
    
    updateExecution: builder.mutation<Execution, { id: number; data: Partial<Execution> }>({
      query: ({ id, data }) => ({
        url: `/api/executions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Execution', id }],
    }),
    
    // Defect API
    getDefects: builder.query<Defect[], void>({
      query: () => '/api/defects',
      providesTags: ['Defect'],
    }),
    
    getDefect: builder.query<Defect, number>({
      query: (id) => `/api/defects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Defect', id }],
    }),
    
    createDefect: builder.mutation<Defect, Partial<Defect>>({
      query: (defect) => ({
        url: '/api/defects',
        method: 'POST',
        body: defect,
      }),
      invalidatesTags: ['Defect'],
    }),
    
    updateDefect: builder.mutation<Defect, { id: number; data: Partial<Defect> }>({
      query: ({ id, data }) => ({
        url: `/api/defects/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Defect', id }],
    }),
    
    // Comment API
    getComments: builder.query<Comment[], number>({
      query: (executionId) => `/api/comments/execution/${executionId}`,
      providesTags: ['Comment'],
    }),
    
    createComment: builder.mutation<Comment, Partial<Comment>>({
      query: (comment) => ({
        url: '/api/comments',
        method: 'POST',
        body: comment,
      }),
      invalidatesTags: ['Comment'],
    }),
    
    // Auth API
    login: builder.mutation<{ token: string; user: User }, { username: string; password: string }>({
      query: (credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    register: builder.mutation<User, { username: string; password: string; role: string }>({
      query: (userData) => ({
        url: '/api/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    
    // Bulk Operations
    bulkMove: builder.mutation<void, { ids: number[]; targetFolder: string }>({
      query: (data) => ({
        url: '/api/bulk/move',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['TestCase'],
    }),
    
    bulkCopy: builder.mutation<void, { ids: number[]; targetFolder: string }>({
      query: (data) => ({
        url: '/api/bulk/copy',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['TestCase'],
    }),
    
    bulkDelete: builder.mutation<void, { ids: number[] }>({
      query: (data) => ({
        url: '/api/bulk',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['TestCase'],
    }),
    
    bulkUpdateStatus: builder.mutation<void, { ids: number[]; status: string }>({
      query: (data) => ({
        url: '/api/bulk/status',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['TestCase'],
    }),
  }),
});

// Auto-generated hooks
export const {
  // TestCase hooks
  useGetTestCasesQuery,
  useGetTestCaseQuery,
  useCreateTestCaseMutation,
  useUpdateTestCaseMutation,
  useDeleteTestCaseMutation,
  
  // Release hooks
  useGetReleasesQuery,
  useGetReleaseQuery,
  useGetReleaseTestCasesQuery,
  useGetTestFoldersQuery,
  useGetFolderTestCasesQuery,
  useCreateReleaseMutation,
  useUpdateReleaseMutation,
  useDeleteReleaseMutation,
  
  // Suite hooks
  useGetSuitesQuery,
  useCreateSuiteMutation,
  
  // Execution hooks
  useGetExecutionsQuery,
  useCreateExecutionMutation,
  useUpdateExecutionMutation,
  
  // Defect hooks
  useGetDefectsQuery,
  useGetDefectQuery,
  useCreateDefectMutation,
  useUpdateDefectMutation,
  
  // Comment hooks
  useGetCommentsQuery,
  useCreateCommentMutation,
  
  // Auth hooks
  useLoginMutation,
  useRegisterMutation,
  
  // Bulk operation hooks
  useBulkMoveMutation,
  useBulkCopyMutation,
  useBulkDeleteMutation,
  useBulkUpdateStatusMutation,
} = api; 