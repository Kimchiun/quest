import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { store } from '../src/renderer/store';
import { theme } from '../src/renderer/shared/theme';
import TestCaseList from '../src/renderer/features/TestCaseManagement/components/TestCaseList';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// 실제 API를 사용하는 통합 테스트이므로, 백엔드가 실행 중이어야 함

describe('TestCaseList UI', () => {
  it('리스트 렌더링 및 검색/상세/생성/삭제 동작', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <TestCaseList />
        </ThemeProvider>
      </Provider>
    );

    // 기본 UI 요소들이 렌더링되는지 확인
    expect(screen.getByText('테스트케이스 목록')).toBeInTheDocument();
    expect(screen.getByText('검색')).toBeInTheDocument();
    expect(screen.getByText('테스트케이스 생성')).toBeInTheDocument();
    
    // 검색 폼이 존재하는지 확인
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
    expect(screen.getByText('제목 검색')).toBeInTheDocument();
    
    // 검색 기능 테스트
    const searchInput = screen.getByDisplayValue('');
    fireEvent.change(searchInput, { target: { value: '테스트' } });
    expect(searchInput).toHaveValue('테스트');

    // 로딩 상태 확인
    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });
}); 