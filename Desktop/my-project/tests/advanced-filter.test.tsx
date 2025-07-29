import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from 'styled-components';
import AdvancedFilter from '../src/renderer/features/TestCaseManagement/components/AdvancedFilter';
import { theme } from '../src/renderer/shared/theme';
import '@testing-library/jest-dom';

// Mock axios
jest.mock('../src/renderer/utils/axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));

const mockAxios = require('../src/renderer/utils/axios');

const createTestStore = () => {
  return configureStore({
    reducer: {
      // 필요한 리듀서들 추가
    },
    preloadedState: {}
  });
};

const renderAdvancedFilter = (props = {}) => {
  const store = createTestStore();
  const defaultProps = {
    onSearch: jest.fn(),
    onClear: jest.fn(),
    ...props
  };

  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <AdvancedFilter {...defaultProps} />
      </ThemeProvider>
    </Provider>
  );
};

describe('AdvancedFilter Component', () => {
  beforeEach(() => {
    mockAxios.get.mockClear();
    mockAxios.post.mockClear();
    mockAxios.delete.mockClear();
  });

  describe('기본 렌더링', () => {
    it('should render advanced filter component', () => {
      renderAdvancedFilter();
      
      expect(screen.getByText('고급 검색')).toBeInTheDocument();
      expect(screen.getByText('키워드 검색')).toBeInTheDocument();
      expect(screen.getByText('폴더')).toBeInTheDocument();
      expect(screen.getByText('태그')).toBeInTheDocument();
      expect(screen.getByText('상태')).toBeInTheDocument();
      expect(screen.getByText('우선순위')).toBeInTheDocument();
      expect(screen.getByText('작성자')).toBeInTheDocument();
      expect(screen.getByText('생성일 (시작)')).toBeInTheDocument();
      expect(screen.getByText('생성일 (종료)')).toBeInTheDocument();
    });

    it('should render search and clear buttons', () => {
      renderAdvancedFilter();
      
      expect(screen.getByText('초기화')).toBeInTheDocument();
      expect(screen.getByText('검색')).toBeInTheDocument();
      expect(screen.getByText('현재 조건 저장')).toBeInTheDocument();
    });
  });

  describe('키워드 검색', () => {
    it('should handle keyword input', () => {
      const onSearch = jest.fn();
      renderAdvancedFilter({ onSearch });

      const keywordInput = screen.getByPlaceholderText('제목, 설명, 스텝에서 검색...');
      fireEvent.change(keywordInput, { target: { value: 'login test' } });

      expect(keywordInput).toHaveValue('login test');
    });

    it('should trigger search with keyword', () => {
      const onSearch = jest.fn();
      renderAdvancedFilter({ onSearch });

      const keywordInput = screen.getByPlaceholderText('제목, 설명, 스텝에서 검색...');
      fireEvent.change(keywordInput, { target: { value: 'login test' } });

      const searchButton = screen.getByText('검색');
      fireEvent.click(searchButton);

      expect(onSearch).toHaveBeenCalledWith({
        keyword: 'login test'
      });
    });
  });

  describe('다중 선택 필터', () => {
    it('should open folder dropdown when clicked', () => {
      renderAdvancedFilter();

      const folderSelect = screen.getByText('선택하세요');
      fireEvent.click(folderSelect);

      expect(screen.getByText('Smoke Tests')).toBeInTheDocument();
      expect(screen.getByText('Regression Tests')).toBeInTheDocument();
      expect(screen.getByText('Integration Tests')).toBeInTheDocument();
      expect(screen.getByText('Unit Tests')).toBeInTheDocument();
    });

    it('should select multiple folders', () => {
      const onSearch = jest.fn();
      renderAdvancedFilter({ onSearch });

      // 폴더 드롭다운 열기
      const folderSelect = screen.getByText('선택하세요');
      fireEvent.click(folderSelect);

      // Smoke Tests 선택
      fireEvent.click(screen.getByText('Smoke Tests'));
      
      // Regression Tests 선택
      fireEvent.click(screen.getByText('Regression Tests'));

      // 검색 버튼 클릭
      const searchButton = screen.getByText('검색');
      fireEvent.click(searchButton);

      expect(onSearch).toHaveBeenCalledWith({
        folders: ['Smoke Tests', 'Regression Tests']
      });
    });

    it('should select multiple tags', () => {
      const onSearch = jest.fn();
      renderAdvancedFilter({ onSearch });

      // 태그 드롭다운 열기
      const tagSelect = screen.getByText('선택하세요');
      fireEvent.click(tagSelect);

      // critical 태그 선택
      fireEvent.click(screen.getByText('critical'));
      
      // smoke 태그 선택
      fireEvent.click(screen.getByText('smoke'));

      // 검색 버튼 클릭
      const searchButton = screen.getByText('검색');
      fireEvent.click(searchButton);

      expect(onSearch).toHaveBeenCalledWith({
        tags: ['critical', 'smoke']
      });
    });

    it('should select status and priority', () => {
      const onSearch = jest.fn();
      renderAdvancedFilter({ onSearch });

      // 상태 드롭다운 열기
      const statusSelect = screen.getByText('선택하세요');
      fireEvent.click(statusSelect);
      fireEvent.click(screen.getByText('Active'));

      // 우선순위 드롭다운 열기
      const prioritySelect = screen.getByText('선택하세요');
      fireEvent.click(prioritySelect);
      fireEvent.click(screen.getByText('High'));

      // 검색 버튼 클릭
      const searchButton = screen.getByText('검색');
      fireEvent.click(searchButton);

      expect(onSearch).toHaveBeenCalledWith({
        status: ['Active'],
        priority: ['High']
      });
    });
  });

  describe('작성자 필터', () => {
    it('should handle author input', () => {
      const onSearch = jest.fn();
      renderAdvancedFilter({ onSearch });

      const authorInput = screen.getByPlaceholderText('작성자 입력...');
      fireEvent.change(authorInput, { target: { value: 'tester1, tester2' } });

      const searchButton = screen.getByText('검색');
      fireEvent.click(searchButton);

      expect(onSearch).toHaveBeenCalledWith({
        createdBy: ['tester1', 'tester2']
      });
    });
  });

  describe('날짜 범위 필터', () => {
    it('should handle date range inputs', () => {
      const onSearch = jest.fn();
      renderAdvancedFilter({ onSearch });

      const fromDateInput = screen.getByLabelText('생성일 (시작)');
      const toDateInput = screen.getByLabelText('생성일 (종료)');

      fireEvent.change(fromDateInput, { target: { value: '2024-01-01' } });
      fireEvent.change(toDateInput, { target: { value: '2024-12-31' } });

      const searchButton = screen.getByText('검색');
      fireEvent.click(searchButton);

      expect(onSearch).toHaveBeenCalledWith({
        dateRange: {
          from: '2024-01-01',
          to: '2024-12-31'
        }
      });
    });
  });

  describe('복합 필터', () => {
    it('should combine multiple filters', () => {
      const onSearch = jest.fn();
      renderAdvancedFilter({ onSearch });

      // 키워드 입력
      const keywordInput = screen.getByPlaceholderText('제목, 설명, 스텝에서 검색...');
      fireEvent.change(keywordInput, { target: { value: 'login' } });

      // 폴더 선택
      const folderSelect = screen.getByText('선택하세요');
      fireEvent.click(folderSelect);
      fireEvent.click(screen.getByText('Smoke Tests'));

      // 우선순위 선택
      const prioritySelect = screen.getAllByText('선택하세요')[3]; // 우선순위는 4번째
      fireEvent.click(prioritySelect);
      fireEvent.click(screen.getByText('High'));

      // 검색 버튼 클릭
      const searchButton = screen.getByText('검색');
      fireEvent.click(searchButton);

      expect(onSearch).toHaveBeenCalledWith({
        keyword: 'login',
        folders: ['Smoke Tests'],
        priority: ['High']
      });
    });
  });

  describe('초기화 기능', () => {
    it('should clear all filters when clear button is clicked', () => {
      const onClear = jest.fn();
      renderAdvancedFilter({ onClear });

      // 필터 설정
      const keywordInput = screen.getByPlaceholderText('제목, 설명, 스텝에서 검색...');
      fireEvent.change(keywordInput, { target: { value: 'test' } });

      // 초기화 버튼 클릭
      const clearButton = screen.getByText('초기화');
      fireEvent.click(clearButton);

      expect(onClear).toHaveBeenCalled();
      expect(keywordInput).toHaveValue('');
    });
  });

  describe('검색 프리셋', () => {
    it('should load and display saved presets', async () => {
      const mockPresets = [
        {
          id: 'preset_1',
          name: 'Critical Tests',
          filters: { priority: ['High'], tags: ['critical'] },
          createdBy: 'tester1',
          createdAt: '2024-01-15T00:00:00Z'
        }
      ];

      mockAxios.get.mockResolvedValue({ data: mockPresets });

      renderAdvancedFilter();

      await waitFor(() => {
        expect(screen.getByText('Critical Tests')).toBeInTheDocument();
      });
    });

    it('should open save preset modal when save button is clicked', () => {
      renderAdvancedFilter();

      const saveButton = screen.getByText('현재 조건 저장');
      fireEvent.click(saveButton);

      expect(screen.getByText('검색 조건 저장')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('프리셋 이름을 입력하세요')).toBeInTheDocument();
    });

    it('should save preset when modal form is submitted', async () => {
      const mockPreset = {
        id: 'preset_123',
        name: 'My Preset',
        filters: {},
        createdBy: 'tester1',
        createdAt: '2024-01-15T00:00:00Z'
      };

      mockAxios.post.mockResolvedValue({ data: mockPreset });

      renderAdvancedFilter();

      // 저장 모달 열기
      const saveButton = screen.getByText('현재 조건 저장');
      fireEvent.click(saveButton);

      // 프리셋 이름 입력
      const nameInput = screen.getByPlaceholderText('프리셋 이름을 입력하세요');
      fireEvent.change(nameInput, { target: { value: 'My Preset' } });

      // 저장 버튼 클릭
      const modalSaveButton = screen.getByText('저장');
      fireEvent.click(modalSaveButton);

      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith('/api/testcases/search/presets', {
          name: 'My Preset',
          filters: {},
          createdBy: 'current-user'
        });
      });
    });

    it('should load preset when preset tag is clicked', async () => {
      const onSearch = jest.fn();
      const mockPresets = [
        {
          id: 'preset_1',
          name: 'Critical Tests',
          filters: { priority: ['High'], tags: ['critical'] },
          createdBy: 'tester1',
          createdAt: '2024-01-15T00:00:00Z'
        }
      ];

      mockAxios.get.mockResolvedValue({ data: mockPresets });

      renderAdvancedFilter({ onSearch });

      await waitFor(() => {
        const presetTag = screen.getByText('Critical Tests');
        fireEvent.click(presetTag);
      });

      expect(onSearch).toHaveBeenCalledWith({
        priority: ['High'],
        tags: ['critical']
      });
    });
  });

  describe('접근성', () => {
    it('should have proper ARIA labels', () => {
      renderAdvancedFilter();

      expect(screen.getByLabelText('키워드 검색')).toBeInTheDocument();
      expect(screen.getByLabelText('작성자')).toBeInTheDocument();
      expect(screen.getByLabelText('생성일 (시작)')).toBeInTheDocument();
      expect(screen.getByLabelText('생성일 (종료)')).toBeInTheDocument();
    });

    it('should support keyboard navigation', () => {
      renderAdvancedFilter();

      const keywordInput = screen.getByPlaceholderText('제목, 설명, 스텝에서 검색...');
      keywordInput.focus();
      
      expect(keywordInput).toHaveFocus();
    });
  });
}); 