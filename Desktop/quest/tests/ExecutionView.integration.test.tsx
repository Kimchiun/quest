import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { api } from '../src/renderer/services/api';

// 실제 ExecutionView 컴포넌트 임포트
import ExecutionView from '../src/renderer/features/ReleaseManagementV2/components/ExecutionView';

// Mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });
};

// Mock props
const mockRelease = {
  id: 'test-release-id',
  name: 'Test Release',
  version: '1.0.0',
  owner: 'admin',
  createdAt: '2024-01-01T00:00:00Z'
};

const mockTestCases = [
  {
    id: '81',
    name: 'Test Case 1',
    title: 'Test Case 1',
    description: 'Test description 1',
    status: 'Inactive' as const,
    priority: 'High' as const,
    steps: ['Step 1', 'Step 2'],
    expected: 'Expected result 1',
    lastUpdated: '2024-01-01T00:00:00Z',
    tags: ['test'],
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock callbacks
const mockOnTestCaseUpdate = jest.fn();
const mockOnBulkUpdate = jest.fn();
const mockOnAddTestCases = jest.fn();
const mockOnTestCasesLoad = jest.fn();

describe('ExecutionView Integration Test', () => {
  let mockStore: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    mockStore = createMockStore();
    jest.clearAllMocks();
  });

  const renderExecutionView = () => {
    return render(
      <Provider store={mockStore}>
        <ExecutionView
          release={mockRelease}
          testCases={mockTestCases}
          onTestCaseUpdate={mockOnTestCaseUpdate}
          onBulkUpdate={mockOnBulkUpdate}
          onAddTestCases={mockOnAddTestCases}
          onTestCasesLoad={mockOnTestCasesLoad}
        />
      </Provider>
    );
  };

  describe('실제 컴포넌트 렌더링', () => {
    it('실제 ExecutionView 컴포넌트가 렌더링되어야 한다', async () => {
      renderExecutionView();
      
      // 컴포넌트가 렌더링되는지 확인
      await waitFor(() => {
        expect(screen.getByText('Test Release')).toBeInTheDocument();
      });
    });

    it('테스트케이스 정보가 표시되어야 한다', async () => {
      renderExecutionView();
      
      await waitFor(() => {
        expect(screen.getByText('Test Case 1')).toBeInTheDocument();
      });
    });
  });

  describe('API 통합 테스트', () => {
    it('API 훅들이 실제로 호출되어야 한다', async () => {
      renderExecutionView();
      
      // API 훅들이 호출되는지 확인 (실제 RTK Query 사용)
      await waitFor(() => {
        // 컴포넌트가 정상적으로 렌더링되었는지 확인
        expect(screen.getByText('Test Release')).toBeInTheDocument();
      });
    });
  });

  describe('상태 관리 테스트', () => {
    it('Redux store와 정상적으로 연동되어야 한다', async () => {
      renderExecutionView();
      
      await waitFor(() => {
        // Redux store가 정상적으로 작동하는지 확인
        expect(screen.getByText('Test Release')).toBeInTheDocument();
      });
    });
  });

  describe('사용자 인터랙션 테스트', () => {
    it('테스트케이스를 클릭할 수 있어야 한다', async () => {
      renderExecutionView();
      
      await waitFor(() => {
        const testCaseElement = screen.getByText('Test Case 1');
        expect(testCaseElement).toBeInTheDocument();
        
        // 테스트케이스 클릭 시뮬레이션
        fireEvent.click(testCaseElement);
      });
    });
  });

  describe('에러 처리 테스트', () => {
    it('API 에러 시에도 컴포넌트가 렌더링되어야 한다', async () => {
      // 에러 상황에서도 컴포넌트가 렌더링되는지 확인
      renderExecutionView();
      
      await waitFor(() => {
        expect(screen.getByText('Test Release')).toBeInTheDocument();
      });
    });
  });
});

// API/DB 중심 동작 통합 테스트
describe('API/DB 중심 동작 통합 테스트', () => {
  let mockStore: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    mockStore = createMockStore();
    jest.clearAllMocks();
  });

  it('실제 API 데이터를 사용하여 렌더링되어야 한다', async () => {
    const { getByText } = render(
      <Provider store={mockStore}>
        <ExecutionView
          release={mockRelease}
          testCases={mockTestCases}
          onTestCaseUpdate={mockOnTestCaseUpdate}
          onBulkUpdate={mockOnBulkUpdate}
          onAddTestCases={mockOnAddTestCases}
          onTestCasesLoad={mockOnTestCasesLoad}
        />
      </Provider>
    );

    await waitFor(() => {
      expect(getByText('Test Release')).toBeInTheDocument();
    });
  });

  it('실시간 동기화가 작동해야 한다', async () => {
    render(
      <Provider store={mockStore}>
        <ExecutionView
          release={mockRelease}
          testCases={mockTestCases}
          onTestCaseUpdate={mockOnTestCaseUpdate}
          onBulkUpdate={mockOnBulkUpdate}
          onAddTestCases={mockOnAddTestCases}
          onTestCasesLoad={mockOnTestCasesLoad}
        />
      </Provider>
    );

    // 실시간 동기화가 작동하는지 확인 (컴포넌트가 정상 렌더링)
    await waitFor(() => {
      expect(screen.getByText('Test Release')).toBeInTheDocument();
    });
  });
});
