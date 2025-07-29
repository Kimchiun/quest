import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { configureStore } from '@reduxjs/toolkit';
import CentralReleaseDetail from '../src/renderer/features/Dashboard/components/CentralReleaseDetail';
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
        ...initialState
      }
    }
  });
};

// 컴포넌트 렌더링 헬퍼
const renderCentralReleaseDetail = (initialState = {}) => {
  const store = createTestStore(initialState);
  const result = render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CentralReleaseDetail />
      </ThemeProvider>
    </Provider>
  );
  return { ...result, store };
};

const mockRelease = {
  id: '1',
  title: 'v2.1.0 - 기능 개선',
  status: 'active',
  description: '새로운 기능 추가 및 성능 개선',
  version: '2.1.0',
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-01-20T00:00:00Z'
};

const mockTestCases = [
  { id: 1, title: '로그인 테스트', priority: 'High', status: 'Active', createdBy: 'tester1', createdAt: '2024-01-15T00:00:00Z' },
  { id: 2, title: '회원가입 테스트', priority: 'Medium', status: 'Active', createdBy: 'tester2', createdAt: '2024-01-16T00:00:00Z' }
];

const mockDefects = [
  { id: 1, title: '로그인 버튼 클릭 시 오류', severity: 'High', status: 'Open', createdBy: 'tester1', createdAt: '2024-01-15T00:00:00Z' },
  { id: 2, title: '회원가입 폼 검증 오류', severity: 'Medium', status: 'In Progress', createdBy: 'tester2', createdAt: '2024-01-16T00:00:00Z' }
];

const mockReports = {
  progress: { total: 10, completed: 6, inProgress: 3, notStarted: 1 },
  defects: { total: 5, open: 2, inProgress: 2, resolved: 1, closed: 0 },
  trends: { testCasesCompleted: [1, 2, 3], defectsFound: [1, 0, 2], dates: ['2024-01-15', '2024-01-16', '2024-01-17'] }
};

describe('CentralReleaseDetail - 릴리즈 상세 정보 및 탭 기능', () => {
  beforeEach(() => {
    mockAxios.get.mockClear();
  });

  describe('기본 렌더링 테스트', () => {
    it('릴리즈가 선택되지 않았을 때 안내 메시지를 표시해야 함', () => {
      renderCentralReleaseDetail();

      expect(screen.getByText('릴리즈를 선택해주세요')).toBeInTheDocument();
      expect(screen.getByText('좌측 패널에서 릴리즈를 선택하면 상세 정보를 확인할 수 있습니다.')).toBeInTheDocument();
    });

    it('릴리즈가 선택되었을 때 상세 정보를 표시해야 함', async () => {
      mockAxios.get.mockResolvedValue({ data: mockRelease });

      renderCentralReleaseDetail({ selectedReleaseId: '1' });

      await waitFor(() => {
        expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
        expect(screen.getByText('진행 중')).toBeInTheDocument();
        expect(screen.getByText('새로운 기능 추가 및 성능 개선')).toBeInTheDocument();
      });
    });

    it('API 호출이 정상적으로 이루어져야 함', async () => {
      mockAxios.get.mockResolvedValue({ data: mockRelease });

      renderCentralReleaseDetail({ selectedReleaseId: '1' });

      expect(mockAxios.get).toHaveBeenCalledWith('/api/releases/1');
    });
  });

  describe('탭 기능 테스트', () => {
    beforeEach(async () => {
      mockAxios.get.mockResolvedValue({ data: mockRelease });
      renderCentralReleaseDetail({ selectedReleaseId: '1' });
      await waitFor(() => {
        expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
      });
    });

    it('기본적으로 테스트케이스 탭이 활성화되어야 함', () => {
      expect(screen.getByTestId('tab-testcases')).toHaveTextContent('🧪 테스트케이스');
    });

    it('탭 클릭 시 해당 탭이 활성화되어야 함', () => {
      const defectsTab = screen.getByTestId('tab-defects');
      fireEvent.click(defectsTab);

      expect(defectsTab).toHaveTextContent('🐛 결함');
    });

    it('모든 탭이 표시되어야 함', () => {
      expect(screen.getByTestId('tab-testcases')).toBeInTheDocument();
      expect(screen.getByTestId('tab-defects')).toBeInTheDocument();
      expect(screen.getByTestId('tab-reports')).toBeInTheDocument();
    });
  });

  describe('테스트케이스 탭 테스트', () => {
    beforeEach(async () => {
      mockAxios.get
        .mockResolvedValueOnce({ data: mockRelease })
        .mockResolvedValueOnce({ data: mockTestCases });

      renderCentralReleaseDetail({ selectedReleaseId: '1' });
      await waitFor(() => {
        expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
      });
    });

    it('테스트케이스 목록이 표시되어야 함', async () => {
      await waitFor(() => {
        expect(screen.getByText('로그인 테스트')).toBeInTheDocument();
        expect(screen.getByText('회원가입 테스트')).toBeInTheDocument();
      });
    });

    it('새 테스트케이스 생성 버튼이 표시되어야 함', async () => {
      await waitFor(() => {
        expect(screen.getByTestId('create-testcase-btn')).toBeInTheDocument();
      });
    });

    it('검색 기능이 동작해야 함', async () => {
      await waitFor(() => {
        expect(screen.getByTestId('testcase-search-input')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('testcase-search-input');
      fireEvent.change(searchInput, { target: { value: '로그인' } });

      expect(screen.getByText('로그인 테스트')).toBeInTheDocument();
      expect(screen.queryByText('회원가입 테스트')).not.toBeInTheDocument();
    });
  });

  describe('결함 탭 테스트', () => {
    beforeEach(async () => {
      mockAxios.get
        .mockResolvedValueOnce({ data: mockRelease })
        .mockResolvedValueOnce({ data: mockDefects });

      renderCentralReleaseDetail({ selectedReleaseId: '1' });
      await waitFor(() => {
        expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
      });

      const defectsTab = screen.getByTestId('tab-defects');
      fireEvent.click(defectsTab);
    });

    it('결함 목록이 표시되어야 함', async () => {
      await waitFor(() => {
        expect(screen.getByText('로그인 버튼 클릭 시 오류')).toBeInTheDocument();
        expect(screen.getByText('회원가입 폼 검증 오류')).toBeInTheDocument();
      });
    });

    it('새 결함 생성 버튼이 표시되어야 함', async () => {
      await waitFor(() => {
        expect(screen.getByTestId('create-defect-btn')).toBeInTheDocument();
      });
    });

    it('결함 검색 기능이 동작해야 함', async () => {
      await waitFor(() => {
        expect(screen.getByTestId('defect-search-input')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('defect-search-input');
      fireEvent.change(searchInput, { target: { value: '로그인' } });

      expect(screen.getByText('로그인 버튼 클릭 시 오류')).toBeInTheDocument();
      expect(screen.queryByText('회원가입 폼 검증 오류')).not.toBeInTheDocument();
    });
  });

  describe('보고서 탭 테스트', () => {
    beforeEach(async () => {
      mockAxios.get
        .mockResolvedValueOnce({ data: mockRelease })
        .mockResolvedValueOnce({ data: mockReports });

      renderCentralReleaseDetail({ selectedReleaseId: '1' });
      await waitFor(() => {
        expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
      });

      const reportsTab = screen.getByTestId('tab-reports');
      fireEvent.click(reportsTab);
    });

    it('테스트 진행률이 표시되어야 함', async () => {
      await waitFor(() => {
        expect(screen.getByText('테스트 진행률')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument(); // 전체 테스트케이스
        expect(screen.getByText('6')).toBeInTheDocument(); // 완료된 테스트케이스
      });
    });

    it('결함 통계가 표시되어야 함', async () => {
      await waitFor(() => {
        expect(screen.getByText('결함 통계')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument(); // 전체 결함
        expect(screen.getByText('2')).toBeInTheDocument(); // 열린 결함
      });
    });

    it('품질 지표가 표시되어야 함', async () => {
      await waitFor(() => {
        expect(screen.getByText('품질 지표')).toBeInTheDocument();
        expect(screen.getByText('60%')).toBeInTheDocument(); // 테스트 완료율
      });
    });
  });

  describe('에러 처리 테스트', () => {
    it('API 오류 시 에러 메시지를 표시해야 함', async () => {
      mockAxios.get.mockRejectedValue(new Error('API Error'));

      renderCentralReleaseDetail({ selectedReleaseId: '1' });

      await waitFor(() => {
        expect(screen.getByText('릴리즈 정보를 불러올 수 없습니다.')).toBeInTheDocument();
      });
    });
  });
}); 