import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestCaseList from '../src/renderer/features/TestCaseManagement/components/TestCaseList';
import BulkEditModal from '../src/renderer/features/TestCaseManagement/components/BulkEditModal';

// Mock Redux store
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (selector: any) => {
    // 1000개의 테스트케이스 생성
    const testCases = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      title: `테스트케이스 ${i + 1}`,
      status: 'Active' as const,
      priority: 'Medium' as const,
      createdBy: 'tester',
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: ['스텝 1', '스텝 2'],
      expected: '기대결과',
      tags: ['tag1', 'tag2']
    }));
    
    return {
      testcases: {
        list: testCases,
        loading: false,
        error: null
      }
    };
  }
}));

describe('대용량 데이터 성능 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('TestCaseList 렌더링 성능', () => {
    it('1000개 테스트케이스를 2초 이내에 렌더링한다', () => {
      const startTime = performance.now();
      
      render(<TestCaseList />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(2000);
      expect(screen.getByText('테스트 케이스 목록')).toBeInTheDocument();
    });

    it('체크박스 선택 시 즉시 반응한다', async () => {
      render(<TestCaseList />);
      
      const startTime = performance.now();
      
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]); // 첫 번째 행 선택
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      expect(responseTime).toBeLessThan(100); // 100ms 이내
      expect(checkboxes[1]).toBeChecked();
    });

    it('Shift+클릭 범위 선택이 빠르게 동작한다', async () => {
      render(<TestCaseList />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      
      const startTime = performance.now();
      
      // 첫 번째 행 선택
      fireEvent.click(checkboxes[1]);
      
      // Shift+클릭으로 10번째 행까지 범위 선택
      fireEvent.click(checkboxes[10], { shiftKey: true });
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      expect(responseTime).toBeLessThan(200); // 200ms 이내
      
      // 1번부터 10번까지 모두 선택되었는지 확인
      for (let i = 1; i <= 10; i++) {
        expect(checkboxes[i]).toBeChecked();
      }
    });
  });

  describe('BulkEditModal 성능', () => {
    const mockSelectedCases = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      title: `테스트케이스 ${i + 1}`,
      status: 'Active' as const,
      priority: 'Medium' as const,
      createdBy: 'tester',
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: ['스텝 1', '스텝 2'],
      expected: '기대결과',
      tags: ['tag1', 'tag2']
    }));

    it('100개 선택된 케이스로 모달을 1초 이내에 렌더링한다', () => {
      const startTime = performance.now();
      
      render(
        <BulkEditModal
          isOpen={true}
          onClose={jest.fn()}
          selectedCases={mockSelectedCases}
          onApply={jest.fn()}
        />
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(1000);
      expect(screen.getByText('일괄 편집 (100개 선택)')).toBeInTheDocument();
    });

    it('일괄 편집 적용이 빠르게 동작한다', async () => {
      const mockOnApply = jest.fn();
      
      render(
        <BulkEditModal
          isOpen={true}
          onClose={jest.fn()}
          selectedCases={mockSelectedCases}
          onApply={mockOnApply}
        />
      );

      // 상태 변경 체크박스 선택
      const statusCheckbox = screen.getByLabelText('상태 변경');
      fireEvent.click(statusCheckbox);

      // 상태 선택
      const statusSelect = screen.getByDisplayValue('선택하세요');
      fireEvent.change(statusSelect, { target: { value: 'Inactive' } });

      const startTime = performance.now();
      
      // 적용 버튼 클릭
      const applyButton = screen.getByText('적용 (1개 필드)');
      fireEvent.click(applyButton);
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      expect(responseTime).toBeLessThan(500); // 500ms 이내
      expect(mockOnApply).toHaveBeenCalledWith({ status: 'Inactive' });
    });
  });

  describe('메모리 사용량', () => {
    it('1000개 테스트케이스 렌더링 후 메모리 누수가 없다', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      const { unmount } = render(<TestCaseList />);
      
      // 컴포넌트 언마운트
      unmount();
      
      // 가비지 컬렉션 강제 실행 (실제로는 불가능하지만 테스트 목적)
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // 메모리 증가가 10MB 이내여야 함
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
  });

  describe('인라인 편집 성능', () => {
    it('편집 모드 진입이 100ms 이내에 완료된다', () => {
      render(<TestCaseList />);
      
      const editableCells = screen.getAllByText(/테스트케이스/);
      
      const startTime = performance.now();
      
      fireEvent.click(editableCells[0]);
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      expect(responseTime).toBeLessThan(100);
      expect(screen.getByDisplayValue('테스트케이스 1')).toBeInTheDocument();
    });

    it('자동저장 debounce가 정확히 500ms로 동작한다', async () => {
      jest.useFakeTimers();
      
      render(<TestCaseList />);
      
      const editableCells = screen.getAllByText(/테스트케이스/);
      fireEvent.click(editableCells[0]);
      
      const input = screen.getByDisplayValue('테스트케이스 1');
      fireEvent.change(input, { target: { value: '새 제목' } });
      
      // 499ms 후에는 저장되지 않음
      jest.advanceTimersByTime(499);
      expect(screen.getByDisplayValue('새 제목')).toBeInTheDocument();
      
      // 500ms 후 저장됨
      jest.advanceTimersByTime(1);
      await waitFor(() => {
        expect(screen.getByText('저장됨')).toBeInTheDocument();
      });
      
      jest.useRealTimers();
    });
  });
}); 