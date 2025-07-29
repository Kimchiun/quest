import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { configureStore } from '@reduxjs/toolkit';
import DashboardLayout from '../src/renderer/features/Dashboard/components/DashboardLayout';
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
const renderDashboardLayout = (initialState = {}) => {
  const store = createTestStore(initialState);
  const result = render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <DashboardLayout />
      </ThemeProvider>
    </Provider>
  );
  return { ...result, store };
};

const mockReleases = [
  { id: '1', title: 'v2.1.0 - 기능 개선', status: 'active', description: '새로운 기능 추가' },
  { id: '2', title: 'v2.0.5 - 버그 수정', status: 'pending', description: '중요한 버그 수정' },
  { id: '3', title: 'v2.0.4 - 보안 패치', status: 'completed', description: '보안 취약점 수정' }
];

const mockReleaseDetail = {
  id: '1',
  title: 'v2.1.0 - 기능 개선',
  status: 'active',
  description: '새로운 기능 추가',
  version: '2.1.0',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T14:30:00Z'
};

describe('ReleaseList-CenterPanel 연동 테스트', () => {
  beforeEach(() => {
    mockAxios.get.mockClear();
  });

  describe('릴리즈 선택 시 중앙 패널 업데이트', () => {
    it('릴리즈 선택 시 중앙 패널에 상세 정보가 표시되어야 함', async () => {
      // 릴리즈 목록 API 모킹
      mockAxios.get.mockImplementation((url: string) => {
        if (url === '/api/releases') {
          return Promise.resolve({ data: mockReleases });
        }
        if (url === '/api/releases/1') {
          return Promise.resolve({ data: mockReleaseDetail });
        }
        return Promise.reject(new Error('Not found'));
      });

      const { store } = renderDashboardLayout();

      // 릴리즈 목록 로드 대기
      await waitFor(() => {
        expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
      });

      // 릴리즈 선택
      const releaseItem = screen.getByTestId('release-item-1');
      fireEvent.click(releaseItem);

      // 선택된 릴리즈 ID가 store에 저장되었는지 확인
      const state = store.getState();
      expect(state.dashboardLayout.selectedReleaseId).toBe('1');

      // 중앙 패널에 상세 정보가 표시되는지 확인
      await waitFor(() => {
        expect(screen.getByTestId('selected-release-info')).toBeInTheDocument();
        expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
        expect(screen.getByText('새로운 기능 추가')).toBeInTheDocument();
        expect(screen.getByText('진행 중')).toBeInTheDocument();
      });
    });

    it('릴리즈 선택 시 API 호출이 정상적으로 이루어져야 함', async () => {
      mockAxios.get.mockImplementation((url: string) => {
        if (url === '/api/releases') {
          return Promise.resolve({ data: mockReleases });
        }
        if (url === '/api/releases/2') {
          return Promise.resolve({ data: { ...mockReleaseDetail, id: '2' } });
        }
        return Promise.reject(new Error('Not found'));
      });

      renderDashboardLayout();

      // 릴리즈 목록 로드 대기
      await waitFor(() => {
        expect(screen.getByText('v2.0.5 - 버그 수정')).toBeInTheDocument();
      });

      // 다른 릴리즈 선택
      const releaseItem = screen.getByTestId('release-item-2');
      fireEvent.click(releaseItem);

      // API 호출 확인
      await waitFor(() => {
        expect(mockAxios.get).toHaveBeenCalledWith('/api/releases/2');
      });
    });

    it('API 오류 시 중앙 패널에 오류 메시지가 표시되어야 함', async () => {
      mockAxios.get.mockImplementation((url: string) => {
        if (url === '/api/releases') {
          return Promise.resolve({ data: mockReleases });
        }
        if (url === '/api/releases/1') {
          return Promise.reject(new Error('API Error'));
        }
        return Promise.reject(new Error('Not found'));
      });

      renderDashboardLayout();

      // 릴리즈 목록 로드 대기
      await waitFor(() => {
        expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
      });

      // 릴리즈 선택
      const releaseItem = screen.getByTestId('release-item-1');
      fireEvent.click(releaseItem);

      // 오류 메시지 확인
      await waitFor(() => {
        expect(screen.getByText('릴리즈 정보를 불러올 수 없습니다')).toBeInTheDocument();
      });
    });
  });

  describe('릴리즈 선택 해제 시 중앙 패널 상태', () => {
    it('릴리즈가 선택되지 않았을 때 안내 메시지가 표시되어야 함', async () => {
      mockAxios.get.mockResolvedValue({ data: mockReleases });

      renderDashboardLayout();

      // 릴리즈 목록 로드 대기
      await waitFor(() => {
        expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
      });

      // 중앙 패널에 안내 메시지 확인
      expect(screen.getByText('릴리즈를 선택해주세요')).toBeInTheDocument();
      expect(screen.getByText('좌측 패널에서 릴리즈를 선택하면 상세 정보를 확인할 수 있습니다.')).toBeInTheDocument();
    });
  });

  describe('로딩 상태 처리', () => {
    it('릴리즈 상세 정보 로딩 중 로딩 메시지가 표시되어야 함', async () => {
      // 릴리즈 목록은 즉시 반환, 상세 정보는 지연
      mockAxios.get.mockImplementation((url: string) => {
        if (url === '/api/releases') {
          return Promise.resolve({ data: mockReleases });
        }
        if (url === '/api/releases/1') {
          return new Promise(resolve => {
            setTimeout(() => resolve({ data: mockReleaseDetail }), 100);
          });
        }
        return Promise.reject(new Error('Not found'));
      });

      renderDashboardLayout();

      // 릴리즈 목록 로드 대기
      await waitFor(() => {
        expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
      });

      // 릴리즈 선택
      const releaseItem = screen.getByTestId('release-item-1');
      fireEvent.click(releaseItem);

      // 로딩 메시지 확인
      expect(screen.getByText('릴리즈 정보를 불러오는 중...')).toBeInTheDocument();

      // 로딩 완료 후 상세 정보 확인
      await waitFor(() => {
        expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
      }, { timeout: 200 });
    });
  });

  describe('릴리즈 메타데이터 표시', () => {
    it('릴리즈의 메타데이터가 올바르게 표시되어야 함', async () => {
      mockAxios.get.mockImplementation((url: string) => {
        if (url === '/api/releases') {
          return Promise.resolve({ data: mockReleases });
        }
        if (url === '/api/releases/1') {
          return Promise.resolve({ data: mockReleaseDetail });
        }
        return Promise.reject(new Error('Not found'));
      });

      renderDashboardLayout();

      // 릴리즈 목록 로드 대기
      await waitFor(() => {
        expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
      });

      // 릴리즈 선택
      const releaseItem = screen.getByTestId('release-item-1');
      fireEvent.click(releaseItem);

      // 메타데이터 확인
      await waitFor(() => {
        expect(screen.getByText('버전')).toBeInTheDocument();
        expect(screen.getByText('2.1.0')).toBeInTheDocument();
        expect(screen.getByText('생성일')).toBeInTheDocument();
        expect(screen.getByText('수정일')).toBeInTheDocument();
      });
    });
  });

  describe('상태 라벨 표시', () => {
    it('릴리즈 상태가 올바른 라벨로 표시되어야 함', async () => {
      const completedRelease = {
        ...mockReleaseDetail,
        status: 'completed'
      };

      mockAxios.get.mockImplementation((url: string) => {
        if (url === '/api/releases') {
          return Promise.resolve({ data: mockReleases });
        }
        if (url === '/api/releases/1') {
          return Promise.resolve({ data: completedRelease });
        }
        return Promise.reject(new Error('Not found'));
      });

      renderDashboardLayout();

      // 릴리즈 목록 로드 대기
      await waitFor(() => {
        expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
      });

      // 릴리즈 선택
      const releaseItem = screen.getByTestId('release-item-1');
      fireEvent.click(releaseItem);

      // 상태 라벨 확인
      await waitFor(() => {
        expect(screen.getByText('완료')).toBeInTheDocument();
      });
    });
  });

  describe('키보드 네비게이션', () => {
    it('키보드로 릴리즈를 선택할 수 있어야 함', async () => {
      mockAxios.get.mockImplementation((url: string) => {
        if (url === '/api/releases') {
          return Promise.resolve({ data: mockReleases });
        }
        if (url === '/api/releases/1') {
          return Promise.resolve({ data: mockReleaseDetail });
        }
        return Promise.reject(new Error('Not found'));
      });

      const { store } = renderDashboardLayout();

      // 릴리즈 목록 로드 대기
      await waitFor(() => {
        expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
      });

      // 키보드로 릴리즈 선택
      const releaseItem = screen.getByTestId('release-item-1');
      fireEvent.keyDown(releaseItem, { key: 'Enter', code: 'Enter' });

      // 선택 상태 확인
      const state = store.getState();
      expect(state.dashboardLayout.selectedReleaseId).toBe('1');
    });
  });
}); 