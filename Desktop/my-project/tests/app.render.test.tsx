import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/renderer/app/App';

describe('App 렌더링 smoke test', () => {
  it('최소한의 UI가 렌더링된다', () => {
    render(<App />);
    expect(
      screen.getByText(/로그인|대시보드|폴더 구조|테스트 진행률/i)
    ).toBeInTheDocument();
  });
}); 