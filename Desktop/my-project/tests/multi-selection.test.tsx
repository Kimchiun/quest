import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import selectionReducer from '../src/renderer/features/TestCaseManagement/store/selectionSlice';
import FolderTree from '../src/renderer/features/TestCaseManagement/components/FolderTree';
import TestCaseList from '../src/renderer/features/TestCaseManagement/components/TestCaseList';
import '@testing-library/jest-dom';

// Mock store 생성
const createTestStore = () => {
  return configureStore({
    reducer: {
      selection: selectionReducer,
      testcases: {
        list: [
          {
            id: 1,
            title: '테스트 케이스 1',
            status: 'Active',
            priority: 'High',
            createdBy: 'user1',
            createdAt: new Date(),
            updatedAt: new Date(),
            steps: ['step1'],
            expected: 'expected1',
            tags: [],
            prereq: ''
          },
          {
            id: 2,
            title: '테스트 케이스 2',
            status: 'Active',
            priority: 'Medium',
            createdBy: 'user2',
            createdAt: new Date(),
            updatedAt: new Date(),
            steps: ['step2'],
            expected: 'expected2',
            tags: [],
            prereq: ''
          }
        ]
      }
    }
  });
};

// Mock fetch
global.fetch = jest.fn();

describe('다중 선택 기능 테스트', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    (fetch as jest.Mock).mockClear();
  });

  describe('FolderTree 다중 선택', () => {
    beforeEach(() => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: 1,
            name: '폴더 1',
            testCaseCount: 5,
            children: [
              {
                id: 2,
                name: '하위 폴더 1',
                testCaseCount: 2
              }
            ]
          }
        ]
      });
    });

    it('폴더 체크박스를 클릭하여 선택할 수 있다', async () => {
      render(
        <Provider store={store}>
          <FolderTree onFolderSelect={() => {}} />
        </Provider>
      );

      // 폴더 로딩 대기
      await screen.findByText('폴더 구조');

      // 체크박스 찾기 및 클릭
      const checkboxes = screen.getAllByRole('checkbox');
      const firstCheckbox = checkboxes[0];
      
      fireEvent.click(firstCheckbox);
      
      // 선택 상태 확인
      expect(firstCheckbox).toBeChecked();
    });

    it('여러 폴더를 선택할 수 있다', async () => {
      render(
        <Provider store={store}>
          <FolderTree onFolderSelect={() => {}} />
        </Provider>
      );

      await screen.findByText('폴더 구조');

      const checkboxes = screen.getAllByRole('checkbox');
      
      // 첫 번째 폴더 선택
      fireEvent.click(checkboxes[0]);
      // 두 번째 폴더 선택
      fireEvent.click(checkboxes[1]);
      
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).toBeChecked();
    });
  });

  describe('TestCaseList 다중 선택', () => {
    it('테스트 케이스 체크박스를 클릭하여 선택할 수 있다', () => {
      render(
        <Provider store={store}>
          <TestCaseList />
        </Provider>
      );

      const checkboxes = screen.getAllByRole('checkbox');
      const firstTestCaseCheckbox = checkboxes[1]; // 첫 번째는 전체 선택 체크박스
      
      fireEvent.click(firstTestCaseCheckbox);
      
      expect(firstTestCaseCheckbox).toBeChecked();
    });

    it('전체 선택 체크박스로 모든 테스트 케이스를 선택할 수 있다', () => {
      render(
        <Provider store={store}>
          <TestCaseList />
        </Provider>
      );

      const checkboxes = screen.getAllByRole('checkbox');
      const selectAllCheckbox = checkboxes[0];
      
      fireEvent.click(selectAllCheckbox);
      
      // 모든 테스트 케이스 체크박스가 선택되었는지 확인
      const testCaseCheckboxes = checkboxes.slice(1);
      testCaseCheckboxes.forEach(checkbox => {
        expect(checkbox).toBeChecked();
      });
    });

    it('Shift+클릭으로 범위 선택할 수 있다', () => {
      render(
        <Provider store={store}>
          <TestCaseList />
        </Provider>
      );

      const checkboxes = screen.getAllByRole('checkbox');
      const firstTestCaseCheckbox = checkboxes[1];
      const secondTestCaseCheckbox = checkboxes[2];
      
      // 첫 번째 테스트 케이스 선택
      fireEvent.click(firstTestCaseCheckbox);
      
      // Shift+클릭으로 두 번째 테스트 케이스 선택
      fireEvent.click(secondTestCaseCheckbox, { shiftKey: true });
      
      expect(firstTestCaseCheckbox).toBeChecked();
      expect(secondTestCaseCheckbox).toBeChecked();
    });
  });

  describe('키보드 단축키 테스트', () => {
    it('Esc 키로 선택을 해제할 수 있다', () => {
      render(
        <Provider store={store}>
          <TestCaseList />
        </Provider>
      );

      const checkboxes = screen.getAllByRole('checkbox');
      const firstTestCaseCheckbox = checkboxes[1];
      
      // 테스트 케이스 선택
      fireEvent.click(firstTestCaseCheckbox);
      expect(firstTestCaseCheckbox).toBeChecked();
      
      // Esc 키 누르기
      fireEvent.keyDown(document, { key: 'Escape' });
      
      // 선택 해제 확인
      expect(firstTestCaseCheckbox).not.toBeChecked();
    });

    it('Ctrl+A로 전체 선택할 수 있다', () => {
      render(
        <Provider store={store}>
          <TestCaseList />
        </Provider>
      );

      const checkboxes = screen.getAllByRole('checkbox');
      const testCaseCheckboxes = checkboxes.slice(1);
      
      // Ctrl+A 누르기
      fireEvent.keyDown(document, { key: 'A', ctrlKey: true });
      
      // 모든 테스트 케이스가 선택되었는지 확인
      testCaseCheckboxes.forEach(checkbox => {
        expect(checkbox).toBeChecked();
      });
    });
  });

  describe('선택 정보 표시', () => {
    it('선택된 항목 수를 표시한다', () => {
      render(
        <Provider store={store}>
          <TestCaseList />
        </Provider>
      );

      const checkboxes = screen.getAllByRole('checkbox');
      const firstTestCaseCheckbox = checkboxes[1];
      
      // 테스트 케이스 선택
      fireEvent.click(firstTestCaseCheckbox);
      
      // 선택 정보가 표시되는지 확인
      expect(screen.getByText('1개 선택됨')).toBeInTheDocument();
    });

    it('일괄 편집 버튼이 표시된다', () => {
      render(
        <Provider store={store}>
          <TestCaseList />
        </Provider>
      );

      const checkboxes = screen.getAllByRole('checkbox');
      const firstTestCaseCheckbox = checkboxes[1];
      
      // 테스트 케이스 선택
      fireEvent.click(firstTestCaseCheckbox);
      
      // 일괄 편집 버튼이 표시되는지 확인
      expect(screen.getByText('일괄 편집')).toBeInTheDocument();
    });
  });
}); 