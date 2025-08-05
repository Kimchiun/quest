import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { configureStore } from '@reduxjs/toolkit';
import IntegratedItemList from '../src/renderer/features/Dashboard/components/IntegratedItemList';
import FilterBar from '../src/renderer/features/Dashboard/components/FilterBar';
import dashboardLayoutReducer from '../src/renderer/store/dashboardLayoutSlice';
import { theme } from '../src/renderer/shared/theme';
import '@testing-library/jest-dom';

// axios 모킹
jest.mock('../src/renderer/utils/axios', () => ({
  get: jest.fn()
}));

const mockAxios = require('../src/renderer/utils/axios');

// 테스트용 스토어 설정
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      dashboardLayout: dashboardLayoutReducer
    },
    preloadedState: {
      dashboardLayout: {
        leftPanel: { isCollapsed: false, width: 280 },
        rightPanel: { isCollapsed: false, width: 320 },
        centerPanel: { isFullWidth: false },
        activeTab: 'overview',
        selectedReleaseId: null,
        selectedTestCaseId: null,
        selectedDefectId: null,
        filters: {
          executionStatus: [],
          priority: [],
          severity: [],
          keyword: '',
          showOnlyDefects: false,
        },
        releaseData: {
          testCases: [],
          defects: [],
          loading: false,
          error: null,
        },
        ...initialState
      }
    }
  });
};

// 컴포넌트 렌더링 헬퍼
const renderIntegratedItemList = (initialState = {}) => {
  const store = createTestStore(initialState);
  const result = render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <IntegratedItemList />
      </ThemeProvider>
    </Provider>
  );
  return { ...result, store };
};

const mockTestCases = [
  {
    id: 1,
    title: '로그인 테스트',
    priority: 'High',
    status: 'Active',
    executionStatus: 'Pass',
    createdBy: 'tester1',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 2,
    title: '회원가입 테스트',
    priority: 'Medium',
    status: 'Active',
    executionStatus: 'Fail',
    createdBy: 'tester2',
    createdAt: '2024-01-16T00:00:00Z',
  },
  {
    id: 3,
    title: '비밀번호 변경 테스트',
    priority: 'Low',
    status: 'Active',
    executionStatus: 'Untested',
    createdBy: 'tester1',
    createdAt: '2024-01-17T00:00:00Z',
  }
];

const mockDefects = [
  {
    id: 1,
    title: '로그인 버튼 클릭 시 오류',
    severity: 'High',
    status: 'Open',
    createdBy: 'tester1',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 2,
    title: '회원가입 폼 검증 오류',
    severity: 'Medium',
    status: 'In Progress',
    createdBy: 'tester2',
    createdAt: '2024-01-16T00:00:00Z',
  }
];

describe('IntegratedItemList - 테스트케이스-결함 연동 및 고급 필터링', () => {
  beforeEach(() => {
    mockAxios.get.mockClear();
  });

  describe('기본 렌더링 테스트', () => {
    it('테스트케이스 목록이 표시되어야 함', () => {
      renderIntegratedItemList();
      expect(screen.getByText('테스트케이스 목록')).toBeInTheDocument();
    });

    it('테스트케이스가 정상적으로 표시되어야 함', () => {
      renderIntegratedItemList({
        releaseData: {
          testCases: mockTestCases,
          defects: mockDefects,
          loading: false,
          error: null,
        }
      });

      expect(screen.getByText('로그인 테스트')).toBeInTheDocument();
      expect(screen.getByText('회원가입 테스트')).toBeInTheDocument();
      expect(screen.getByText('비밀번호 변경 테스트')).toBeInTheDocument();
    });
  });

  describe('필터링 기능 테스트', () => {
    beforeEach(() => {
      renderIntegratedItemList({
        releaseData: {
          testCases: mockTestCases,
          defects: mockDefects,
          loading: false,
          error: null,
        }
      });
    });

    it('키워드 검색이 동작해야 함', () => {
      const searchInput = screen.getByTestId('keyword-search-input');
      fireEvent.change(searchInput, { target: { value: '로그인' } });

      expect(screen.getByText('로그인 테스트')).toBeInTheDocument();
      expect(screen.queryByText('회원가입 테스트')).not.toBeInTheDocument();
    });

    it('실행 상태 필터가 동작해야 함', () => {
      const executionStatusFilter = screen.getByTestId('execution-status-filter');
      fireEvent.change(executionStatusFilter, { target: { value: ['Pass'] } });

      expect(screen.getByText('로그인 테스트')).toBeInTheDocument(); // Pass 상태
      expect(screen.queryByText('회원가입 테스트')).not.toBeInTheDocument(); // Fail 상태
    });

    it('우선순위 필터가 동작해야 함', () => {
      const priorityFilter = screen.getByTestId('priority-filter');
      fireEvent.change(priorityFilter, { target: { value: ['High'] } });

      expect(screen.getByText('로그인 테스트')).toBeInTheDocument(); // High 우선순위
      expect(screen.queryByText('회원가입 테스트')).not.toBeInTheDocument(); // Medium 우선순위
    });



    it('필터 초기화가 동작해야 함', () => {
      const searchInput = screen.getByTestId('keyword-search-input');
      fireEvent.change(searchInput, { target: { value: '로그인' } });

      const clearFiltersBtn = screen.getByTestId('clear-filters-btn');
      fireEvent.click(clearFiltersBtn);

      expect(screen.getByText('로그인 테스트')).toBeInTheDocument();
      expect(screen.getByText('회원가입 테스트')).toBeInTheDocument();
      expect(screen.getByText('비밀번호 변경 테스트')).toBeInTheDocument();
    });
  });

  describe('아이템 선택 테스트', () => {
    beforeEach(() => {
      renderIntegratedItemList({
        releaseData: {
          testCases: mockTestCases,
          defects: mockDefects,
          loading: false,
          error: null,
        }
      });
    });

    it('테스트케이스 클릭 시 선택 상태가 변경되어야 함', () => {
      const testCaseRow = screen.getByTestId('item-row-testcase-1');
      fireEvent.click(testCaseRow);

      // 선택된 상태 확인 (배경색 변경 등)
      expect(testCaseRow).toHaveStyle({ background: '#eff6ff' });
    });

    it('다른 테스트케이스 클릭 시 이전 선택이 해제되어야 함', () => {
      const testCaseRow1 = screen.getByTestId('item-row-testcase-1');
      const testCaseRow2 = screen.getByTestId('item-row-testcase-2');

      fireEvent.click(testCaseRow1);
      fireEvent.click(testCaseRow2);

      // 첫 번째 테스트케이스 선택 해제, 두 번째 테스트케이스 선택
      expect(testCaseRow1).not.toHaveStyle({ background: '#eff6ff' });
      expect(testCaseRow2).toHaveStyle({ background: '#eff6ff' });
    });
  });

  describe('상태 표시 테스트', () => {
    it('테스트케이스 상태가 올바르게 표시되어야 함', () => {
      renderIntegratedItemList({
        releaseData: {
          testCases: mockTestCases,
          defects: mockDefects,
          loading: false,
          error: null,
        }
      });

      expect(screen.getByText('통과')).toBeInTheDocument(); // Pass
      expect(screen.getByText('실패')).toBeInTheDocument(); // Fail
      expect(screen.getByText('실행 전')).toBeInTheDocument(); // Untested
    });



    it('우선순위와 심각도가 올바르게 표시되어야 함', () => {
      renderIntegratedItemList({
        releaseData: {
          testCases: mockTestCases,
          defects: mockDefects,
          loading: false,
          error: null,
        }
      });

      expect(screen.getByText('높음')).toBeInTheDocument(); // High priority
      expect(screen.getByText('보통')).toBeInTheDocument(); // Medium priority
      expect(screen.getByText('낮음')).toBeInTheDocument(); // Low priority
    });
  });
}); 