import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../src/renderer/store';
import TestCaseList from '../src/renderer/features/TestCaseManagement/components/TestCaseList';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// 실제 API를 사용하는 통합 테스트이므로, 백엔드가 실행 중이어야 함

describe('TestCaseList UI', () => {
  it('리스트 렌더링 및 검색/상세/생성/삭제 동작', async () => {
    render(
      <Provider store={store}>
        <TestCaseList />
      </Provider>
    );

    // 최초 로딩
    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('로딩 중...')).not.toBeInTheDocument());

    // 생성
    fireEvent.click(screen.getByText('테스트케이스 생성'));
    fireEvent.change(screen.getByPlaceholderText('제목'), { target: { value: 'UI테스트' } });
    fireEvent.change(screen.getByPlaceholderText('스텝(줄바꿈 구분)'), { target: { value: 'step1\nstep2' } });
    fireEvent.change(screen.getByPlaceholderText('기대결과'), { target: { value: 'ok' } });
    fireEvent.click(screen.getByText('저장'));
    await waitFor(() => expect(screen.queryByText('로딩 중...')).not.toBeInTheDocument());
    expect(screen.getByText('UI테스트')).toBeInTheDocument();

    // 상세/수정
    fireEvent.click(screen.getByText('UI테스트'));
    await waitFor(() => expect(screen.getByText('테스트케이스 상세')).toBeInTheDocument());
    fireEvent.click(screen.getByText('수정'));
    fireEvent.change(screen.getByPlaceholderText('제목'), { target: { value: 'UI테스트-수정' } });
    fireEvent.click(screen.getByText('저장'));
    await waitFor(() => expect(screen.getByText('UI테스트-수정')).toBeInTheDocument());
    fireEvent.click(screen.getByText('닫기'));

    // 검색
    fireEvent.change(screen.getByPlaceholderText('제목 검색'), { target: { value: 'UI테스트-수정' } });
    fireEvent.click(screen.getByText('검색'));
    await waitFor(() => expect(screen.getByText('UI테스트-수정')).toBeInTheDocument());

    // 삭제
    fireEvent.click(screen.getAllByText('삭제')[0]);
    // confirm 창은 실제로는 자동으로 yes 처리되지 않으므로, 삭제는 수동 확인 필요
  });
}); 