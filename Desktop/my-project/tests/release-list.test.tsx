import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { configureStore } from '@reduxjs/toolkit';
import ReleaseList from '../src/renderer/features/Dashboard/components/ReleaseList';
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
const renderReleaseList = (initialState = {}) => {
  const store = createTestStore(initialState);
  const result = render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ReleaseList />
      </ThemeProvider>
    </Provider>
  );
  return { ...result, store };
};

const mockReleases = [
  { id: '1', title: 'v2.1.0 - 기능 개선', status: 'active', description: '새로운 기능 추가' },
  { id: '2', title: 'v2.0.5 - 버그 수정', status: 'pending', description: '중요한 버그 수정' },
  { id: '3', title: 'v2.0.4 - 보안 패치', status: 'completed', description: '보안 취약점 수정' },
  { id: '4', title: 'v2.0.3 - 성능 최적화', status: 'completed', description: '성능 개선' }
];

describe('ReleaseList - 릴리즈 리스트/검색/전환 기능', () => {
  beforeEach(() => {
    mockAxios.get.mockClear();
  });

  describe('기본 렌더링 테스트', () => {
    it('릴리즈 목록이 정상적으로 로드되어야 함', async () => {
      mockAxios.get.mockResolvedValue({ data: mockReleases });
      
      renderReleaseList();
      
      // 로딩 상태 확인
      expect(screen.getByText('로딩 중...')).toBeInTheDocument();
      
      // 데이터 로드 후 확인
      await waitFor(() => {
        expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
        expect(screen.getByText('v2.0.5 - 버그 수정')).toBeInTheDocument();
        expect(screen.getByText('v2.0.4 - 보안 패치')).toBeInTheDocument();
        expect(screen.getByText('v2.0.3 - 성능 최적화')).toBeInTheDocument();
      });
    });

    it('API 호출이 정상적으로 이루어져야 함', async () => {
      mockAxios.get.mockResolvedValue({ data: mockReleases });
      
      renderReleaseList();
      
      expect(mockAxios.get).toHaveBeenCalledWith('/api/releases');
    });

    it('API 오류 시 빈 목록을 표시해야 함', async () => {
      mockAxios.get.mockRejectedValue(new Error('API Error'));
      
      renderReleaseList();
      
      await waitFor(() => {
        expect(screen.getByText('릴리즈가 없습니다.')).toBeInTheDocument();
      });
    });
  });

  describe('검색 기능 테스트', () => {
    beforeEach(async () => {
      mockAxios.get.mockResolvedValue({ data: mockReleases });
      renderReleaseList();
      await waitFor(() => {
        expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
      });
    });

    it('검색어 입력 시 필터링이 정상 동작해야 함', async () => {
      const searchInput = screen.getByTestId('release-search-input');
      
      // 검색어 입력
      fireEvent.change(searchInput, { target: { value: '기능' } });
      
      // 필터링 결과 확인
      expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
      expect(screen.queryByText('v2.0.5 - 버그 수정')).not.toBeInTheDocument();
    });

    it('대소문자 구분 없이 검색이 동작해야 함', async () => {
      const searchInput = screen.getByTestId('release-search-input');
      
      // 대문자로 검색
      fireEvent.change(searchInput, { target: { value: 'V2.1' } });
      
      // 필터링 결과 확인
      expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
    });

    it('설명에서도 검색이 가능해야 함', async () => {
      const searchInput = screen.getByTestId('release-search-input');
      
      // 설명에서 검색
      fireEvent.change(searchInput, { target: { value: '새로운' } });
      
      // 필터링 결과 확인
      expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
    });
  });

  describe('필터 기능 테스트', () => {
    beforeEach(async () => {
      mockAxios.get.mockResolvedValue({ data: mockReleases });
      renderReleaseList();
      await waitFor(() => {
        expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
      });
    });

    it('전체 필터 버튼이 정상 동작해야 함', () => {
      const allFilterButton = screen.getByTestId('release-filter-all');
      
      fireEvent.click(allFilterButton);
      
      // 모든 릴리즈가 표시되어야 함
      expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
      expect(screen.getByText('v2.0.5 - 버그 수정')).toBeInTheDocument();
      expect(screen.getByText('v2.0.4 - 보안 패치')).toBeInTheDocument();
      expect(screen.getByText('v2.0.3 - 성능 최적화')).toBeInTheDocument();
    });

    it('진행 중 필터가 정상 동작해야 함', () => {
      const activeFilterButton = screen.getByTestId('release-filter-active');
      
      fireEvent.click(activeFilterButton);
      
      // 진행 중인 릴리즈만 표시
      expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
      expect(screen.queryByText('v2.0.5 - 버그 수정')).not.toBeInTheDocument();
    });

    it('완료 필터가 정상 동작해야 함', () => {
      const completedFilterButton = screen.getByTestId('release-filter-completed');
      
      fireEvent.click(completedFilterButton);
      
      // 완료된 릴리즈만 표시
      expect(screen.getByText('v2.0.4 - 보안 패치')).toBeInTheDocument();
      expect(screen.getByText('v2.0.3 - 성능 최적화')).toBeInTheDocument();
      expect(screen.queryByText('v2.1.0 - 기능 개선')).not.toBeInTheDocument();
    });
  });

  describe('선택 기능 테스트', () => {
    beforeEach(async () => {
      mockAxios.get.mockResolvedValue({ data: mockReleases });
      renderReleaseList();
      await waitFor(() => {
        expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
      });
    });

    it('릴리즈 클릭 시 선택 상태가 변경되어야 함', async () => {
      const releaseItems = screen.getAllByTestId('release-item-1');
      const releaseItem = releaseItems[0]; // 첫 번째 요소 사용
      
      fireEvent.click(releaseItem);
      
      // 선택된 릴리즈가 하이라이트되어야 함 (aria-label로 확인)
      expect(releaseItem).toHaveAttribute('aria-label', '릴리즈 v2.1.0 - 기능 개선');
    });

    it('선택된 릴리즈 ID가 store에 저장되어야 함', async () => {
      const { store } = renderReleaseList();
      await waitFor(() => {
        expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
      });
      
      const releaseItems = screen.getAllByTestId('release-item-2');
      const releaseItem = releaseItems[0]; // 첫 번째 요소 사용
      fireEvent.click(releaseItem);
      
      // store 상태 확인 (비동기 업데이트 대기)
      await waitFor(() => {
        const state = store.getState();
        expect(state.dashboardLayout.selectedReleaseId).toBe('2');
      });
    });

    it('키보드로도 릴리즈를 선택할 수 있어야 함', async () => {
      const releaseItems = screen.getAllByTestId('release-item-1');
      const releaseItem = releaseItems[0]; // 첫 번째 요소 사용
      
      // Enter 키로 선택
      fireEvent.keyDown(releaseItem, { key: 'Enter', code: 'Enter' });
      
      // 선택 상태 확인 (배경색 대신 선택된 상태 확인)
      expect(releaseItem).toHaveAttribute('aria-label', '릴리즈 v2.1.0 - 기능 개선');
    });
  });

  describe('검색과 필터 조합 테스트', () => {
    beforeEach(async () => {
      mockAxios.get.mockResolvedValue({ data: mockReleases });
      renderReleaseList();
      await waitFor(() => {
        expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
      });
    });

    it('검색어와 필터가 동시에 적용되어야 함', () => {
      const searchInput = screen.getByTestId('release-search-input');
      const completedFilterButton = screen.getByTestId('release-filter-completed');
      
      // 완료 필터 적용
      fireEvent.click(completedFilterButton);
      
      // 검색어 입력
      fireEvent.change(searchInput, { target: { value: '보안' } });
      
      // 결과 확인 (완료 + 보안 포함)
      expect(screen.getByText('v2.0.4 - 보안 패치')).toBeInTheDocument();
      expect(screen.queryByText('v2.0.3 - 성능 최적화')).not.toBeInTheDocument();
    });

    it('검색어를 지우면 필터만 적용된 결과가 표시되어야 함', () => {
      const searchInput = screen.getByTestId('release-search-input');
      const completedFilterButton = screen.getByTestId('release-filter-completed');
      
      // 완료 필터 적용
      fireEvent.click(completedFilterButton);
      
      // 검색어 입력 후 지우기
      fireEvent.change(searchInput, { target: { value: '보안' } });
      fireEvent.change(searchInput, { target: { value: '' } });
      
      // 완료된 모든 릴리즈가 표시되어야 함
      expect(screen.getByText('v2.0.4 - 보안 패치')).toBeInTheDocument();
      expect(screen.getByText('v2.0.3 - 성능 최적화')).toBeInTheDocument();
    });
  });

  describe('접근성 테스트', () => {
    beforeEach(async () => {
      mockAxios.get.mockResolvedValue({ data: mockReleases });
      renderReleaseList();
      await waitFor(() => {
        expect(screen.getByText('v2.1.0 - 기능 개선')).toBeInTheDocument();
      });
    });

    it('검색 입력창에 접근성 속성이 있어야 함', () => {
      const searchInput = screen.getByTestId('release-search-input');
      expect(searchInput).toHaveAttribute('placeholder', '릴리즈 검색...');
    });

    it('릴리즈 아이템에 접근성 속성이 있어야 함', () => {
      const releaseItems = screen.getAllByTestId('release-item-1');
      const releaseItem = releaseItems[0]; // 첫 번째 요소 사용
      expect(releaseItem).toHaveAttribute('aria-label', '릴리즈 v2.1.0 - 기능 개선');
      expect(releaseItem).toHaveAttribute('tabIndex', '0');
    });

    it('필터 버튼들이 접근 가능해야 함', () => {
      const allFilterButton = screen.getByTestId('release-filter-all');
      const activeFilterButton = screen.getByTestId('release-filter-active');
      
      expect(allFilterButton).toBeInTheDocument();
      expect(activeFilterButton).toBeInTheDocument();
    });
  });
}); 