import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/renderer/app/App';

describe('App 렌더링 smoke test', () => {
  it('최소한의 UI가 렌더링된다', () => {
    render(<App />);
    // 더 구체적인 텍스트 검색으로 변경
    expect(screen.getByText('Quest 로그인')).toBeInTheDocument();
    expect(screen.getByText('테스트 관리 시스템에 오신 것을 환영합니다.')).toBeInTheDocument();
  });
}); 