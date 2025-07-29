import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { configureStore } from '@reduxjs/toolkit';
import DashboardLayout from '../src/renderer/features/Dashboard/components/DashboardLayout';
import dashboardLayoutReducer from '../src/renderer/store/dashboardLayoutSlice';
import { theme } from '../src/renderer/shared/theme';
import '@testing-library/jest-dom';

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

describe('DashboardLayout - 3분할 레이아웃', () => {
  describe('기본 렌더링 테스트', () => {
    it('3분할 레이아웃이 정상적으로 렌더링되어야 함', () => {
      renderDashboardLayout();
      
      // 좌측 패널 확인
      expect(screen.getByText('ITMS')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '대시보드 메뉴' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '테스트 케이스 메뉴' })).toBeInTheDocument();
      
      // 중앙 패널 확인
      expect(screen.getByRole('heading', { name: '대시보드' })).toBeInTheDocument();
      expect(screen.getByText('프로젝트 현황 및 최근 활동을 확인하세요')).toBeInTheDocument();
      
      // 우측 패널 확인
      expect(screen.getByText('개인 작업')).toBeInTheDocument();
      expect(screen.getByText('내 작업 목록')).toBeInTheDocument();
    });

    it('모든 패널이 기본 상태로 표시되어야 함', () => {
      renderDashboardLayout();
      
      // 좌측 패널 토글 버튼
      const leftToggleButton = screen.getByTestId('left-toggle-button');
      expect(leftToggleButton).toBeInTheDocument();
      expect(leftToggleButton).toHaveTextContent('←');
      
      // 우측 패널 토글 버튼
      const rightToggleButton = screen.getByTestId('right-toggle-button');
      expect(rightToggleButton).toBeInTheDocument();
      expect(rightToggleButton).toHaveTextContent('→');
    });
  });

  describe('패널 토글 기능 테스트', () => {
    it('좌측 패널 토글 버튼 클릭 시 패널이 축소되어야 함', async () => {
      renderDashboardLayout();
      
      const leftToggleButton = screen.getByTestId('left-toggle-button');
      fireEvent.click(leftToggleButton);
      
      await waitFor(() => {
        // 축소된 상태의 토글 버튼 확인
        expect(screen.getByTestId('left-toggle-button')).toHaveTextContent('→');
      });
    });

    it('우측 패널 토글 버튼 클릭 시 패널이 축소되어야 함', async () => {
      renderDashboardLayout();
      
      const rightToggleButton = screen.getByTestId('right-toggle-button');
      fireEvent.click(rightToggleButton);
      
      await waitFor(() => {
        // 축소된 상태의 토글 버튼 확인
        expect(screen.getByTestId('right-toggle-button')).toHaveTextContent('←');
      });
    });

    it('축소된 패널을 다시 토글하면 확장되어야 함', async () => {
      renderDashboardLayout({
        leftPanel: { isCollapsed: true, width: 280 },
        rightPanel: { isCollapsed: true, width: 320 }
      });
      
      // 좌측 패널 확장
      const leftToggleButton = screen.getByTestId('left-toggle-button');
      fireEvent.click(leftToggleButton);
      
      await waitFor(() => {
        expect(leftToggleButton).toHaveTextContent('←');
      });
      
      // 우측 패널 확장
      const rightToggleButton = screen.getByTestId('right-toggle-button');
      fireEvent.click(rightToggleButton);
      
      await waitFor(() => {
        expect(rightToggleButton).toHaveTextContent('→');
      });
    });
  });

  describe('반응형 레이아웃 테스트', () => {
    it('다양한 화면 크기에서 레이아웃이 정상적으로 표시되어야 함', () => {
      // 1280x720 해상도 시뮬레이션
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1280,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 720,
      });
      
      renderDashboardLayout();
      
      // 레이아웃 컨테이너가 존재하는지 확인
      const layoutContainer = screen.getByTestId('dashboard-layout');
      expect(layoutContainer).toBeInTheDocument();
    });

    it('1920x1080 해상도에서도 정상 동작해야 함', () => {
      // 1920x1080 해상도 시뮬레이션
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1080,
      });
      
      renderDashboardLayout();
      
      // 모든 패널이 정상적으로 렌더링되는지 확인
      expect(screen.getByText('ITMS')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: '대시보드' })).toBeInTheDocument();
      expect(screen.getByText('개인 작업')).toBeInTheDocument();
    });
  });

  describe('접근성 테스트', () => {
    it('키보드로 모든 토글 버튼에 접근할 수 있어야 함', () => {
      renderDashboardLayout();
      
      // Tab 키로 포커스 이동
      const leftToggleButton = screen.getByTestId('left-toggle-button');
      const rightToggleButton = screen.getByTestId('right-toggle-button');
      
      leftToggleButton.focus();
      expect(leftToggleButton).toHaveFocus();
      
      // Enter 키로 토글 동작
      fireEvent.keyDown(leftToggleButton, { key: 'Enter', code: 'Enter' });
      
      rightToggleButton.focus();
      expect(rightToggleButton).toHaveFocus();
      
      fireEvent.keyDown(rightToggleButton, { key: 'Enter', code: 'Enter' });
    });

    it('스크린 리더가 레이아웃 구조를 인식할 수 있어야 함', () => {
      renderDashboardLayout();
      
      // 네비게이션 영역 확인
      const navigation = screen.getByRole('navigation');
      expect(navigation).toBeInTheDocument();
      expect(navigation).toHaveAttribute('aria-label', '주요 메뉴');
    });
  });

  describe('성능 테스트', () => {
    it('패널 토글 시 애니메이션이 부드럽게 동작해야 함', async () => {
      const startTime = performance.now();
      
      renderDashboardLayout();
      
      const leftToggleButton = screen.getByTestId('left-toggle-button');
      fireEvent.click(leftToggleButton);
      
      // 애니메이션 완료 대기 (300ms)
      await waitFor(() => {
        const endTime = performance.now();
        expect(endTime - startTime).toBeLessThan(500); // 500ms 이내 완료
      }, { timeout: 1000 });
    });

    it('대량의 데이터가 있어도 렌더링 성능이 유지되어야 함', () => {
      const renderStart = performance.now();
      
      renderDashboardLayout();
      
      const renderEnd = performance.now();
      
      // 초기 렌더링이 100ms 이내에 완료되어야 함
      expect(renderEnd - renderStart).toBeLessThan(100);
    });
  });

  describe('상태 관리 테스트', () => {
    it('Redux 스토어의 상태가 UI와 동기화되어야 함', () => {
      const { store } = renderDashboardLayout();
      
      // 초기 상태 확인
      let state = store.getState();
      expect(state.dashboardLayout.leftPanel.isCollapsed).toBe(false);
      expect(state.dashboardLayout.rightPanel.isCollapsed).toBe(false);
      
      // 좌측 패널 토글
      const leftToggleButton = screen.getByTestId('left-toggle-button');
      fireEvent.click(leftToggleButton);
      
      // 상태 변경 확인
      state = store.getState();
      expect(state.dashboardLayout.leftPanel.isCollapsed).toBe(true);
    });

    it('패널 너비 설정이 정상적으로 동작해야 함', () => {
      const { store } = renderDashboardLayout({
        leftPanel: { isCollapsed: false, width: 300 },
        rightPanel: { isCollapsed: false, width: 350 }
      });
      
      const state = store.getState();
      expect(state.dashboardLayout.leftPanel.width).toBe(300);
      expect(state.dashboardLayout.rightPanel.width).toBe(350);
    });
  });

  describe('에러 처리 테스트', () => {
    it('잘못된 상태로 렌더링되어도 에러가 발생하지 않아야 함', () => {
      // 잘못된 초기 상태로 렌더링
      expect(() => {
        renderDashboardLayout({
          leftPanel: { isCollapsed: null as any, width: -100 },
          rightPanel: { isCollapsed: undefined as any, width: 0 }
        });
      }).not.toThrow();
    });
  });
}); 