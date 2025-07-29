import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditableCell from '../src/renderer/shared/components/EditableCell';

describe('EditableCell', () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('텍스트 타입', () => {
    it('기본값을 표시한다', () => {
      render(
        <EditableCell
          value="테스트 제목"
          type="text"
          onSave={mockOnSave}
        />
      );

      expect(screen.getByText('테스트 제목')).toBeInTheDocument();
    });

    it('클릭 시 편집 모드로 진입한다', () => {
      render(
        <EditableCell
          value="테스트 제목"
          type="text"
          onSave={mockOnSave}
        />
      );

      const displayElement = screen.getByText('테스트 제목');
      fireEvent.click(displayElement);

      expect(screen.getByDisplayValue('테스트 제목')).toBeInTheDocument();
    });

    it('Enter 키로 저장한다', async () => {
      render(
        <EditableCell
          value="테스트 제목"
          type="text"
          onSave={mockOnSave}
        />
      );

      const displayElement = screen.getByText('테스트 제목');
      fireEvent.click(displayElement);

      const input = screen.getByDisplayValue('테스트 제목');
      fireEvent.change(input, { target: { value: '새 제목' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith('새 제목');
      });
    });

    it('Escape 키로 취소한다', () => {
      render(
        <EditableCell
          value="테스트 제목"
          type="text"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const displayElement = screen.getByText('테스트 제목');
      fireEvent.click(displayElement);

      const input = screen.getByDisplayValue('테스트 제목');
      fireEvent.change(input, { target: { value: '새 제목' } });
      fireEvent.keyDown(input, { key: 'Escape' });

      expect(mockOnCancel).toHaveBeenCalled();
      expect(screen.getByText('테스트 제목')).toBeInTheDocument();
    });

    it('자동저장을 500ms debounce로 실행한다', async () => {
      jest.useFakeTimers();

      render(
        <EditableCell
          value="테스트 제목"
          type="text"
          onSave={mockOnSave}
        />
      );

      const displayElement = screen.getByText('테스트 제목');
      fireEvent.click(displayElement);

      const input = screen.getByDisplayValue('테스트 제목');
      fireEvent.change(input, { target: { value: '새 제목' } });

      // 500ms 이전에는 호출되지 않음
      expect(mockOnSave).not.toHaveBeenCalled();

      // 500ms 후 호출됨
      jest.advanceTimersByTime(500);
      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith('새 제목');
      });

      jest.useRealTimers();
    });
  });

  describe('셀렉트 타입', () => {
    const options = [
      { value: 'Active', label: '활성' },
      { value: 'Inactive', label: '비활성' },
      { value: 'Draft', label: '초안' }
    ];

    it('옵션을 표시한다', () => {
      render(
        <EditableCell
          value="Active"
          type="select"
          options={options}
          onSave={mockOnSave}
        />
      );

      expect(screen.getByText('활성')).toBeInTheDocument();
    });

    it('클릭 시 셀렉트로 변경된다', () => {
      render(
        <EditableCell
          value="Active"
          type="select"
          options={options}
          onSave={mockOnSave}
        />
      );

      const displayElement = screen.getByText('활성');
      fireEvent.click(displayElement);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('값 변경 시 저장된다', async () => {
      render(
        <EditableCell
          value="Active"
          type="select"
          options={options}
          onSave={mockOnSave}
        />
      );

      const displayElement = screen.getByText('활성');
      fireEvent.click(displayElement);

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'Inactive' } });

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith('Inactive');
      });
    });
  });

  describe('체크박스 타입', () => {
    it('체크박스를 표시한다', () => {
      render(
        <EditableCell
          value={true}
          type="checkbox"
          onSave={mockOnSave}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('체크박스 변경 시 저장된다', async () => {
      render(
        <EditableCell
          value={true}
          type="checkbox"
          onSave={mockOnSave}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('비활성화 상태', () => {
    it('disabled 시 클릭해도 편집되지 않는다', () => {
      render(
        <EditableCell
          value="테스트 제목"
          type="text"
          onSave={mockOnSave}
          disabled={true}
        />
      );

      const displayElement = screen.getByText('테스트 제목');
      fireEvent.click(displayElement);

      expect(screen.queryByDisplayValue('테스트 제목')).not.toBeInTheDocument();
      expect(screen.getByText('테스트 제목')).toBeInTheDocument();
    });
  });

  describe('저장 표시', () => {
    it('저장 중 표시를 보여준다', async () => {
      render(
        <EditableCell
          value="테스트 제목"
          type="text"
          onSave={mockOnSave}
        />
      );

      const displayElement = screen.getByText('테스트 제목');
      fireEvent.click(displayElement);

      const input = screen.getByDisplayValue('테스트 제목');
      fireEvent.change(input, { target: { value: '새 제목' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      await waitFor(() => {
        expect(screen.getByText('저장됨')).toBeInTheDocument();
      });
    });
  });
}); 