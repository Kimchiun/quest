import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReleaseSelection from './ReleaseSelection';
import releaseReducer from '../store/releaseSlice';
import { UserState, UserRole } from '../../../store';

function renderWithStore(user: Partial<UserState> = {}) {
  const store = configureStore({
    reducer: {
      releases: releaseReducer,
      users: (state = { me: { id: 1, username: 'admin', role: 'ADMIN' as UserRole }, isLoggedIn: true, ...user }) => state,
    },
    preloadedState: {
      releases: {
        releases: [
          { id: 1, name: 'Sprint 1', startDate: '2024-07-01', endDate: '2024-07-10', createdAt: '2024-06-01' },
          { id: 2, name: 'Sprint 2', startDate: '2024-07-11', endDate: '2024-07-20', createdAt: '2024-06-02' },
        ],
        suites: [],
        loading: false,
        error: null,
      },
      users: { me: { id: 1, username: 'admin', role: 'ADMIN' }, isLoggedIn: true, ...user },
    },
  });
  return render(
    <Provider store={store}>
      <ReleaseSelection />
    </Provider>
  );
}

describe('ReleaseSelection', () => {
  it('릴리즈 목록 렌더링 및 검색/필터 동작', () => {
    renderWithStore();
    expect(screen.getByText('Sprint 1')).toBeInTheDocument();
    expect(screen.getByText('Sprint 2')).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('릴리즈명 검색'), { target: { value: '1' } });
    expect(screen.getByText('Sprint 1')).toBeInTheDocument();
    expect(screen.queryByText('Sprint 2')).not.toBeInTheDocument();
    fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: '2024-07-01' } });
    fireEvent.change(screen.getAllByRole('textbox')[2], { target: { value: '2024-07-10' } });
    expect(screen.getByText('Sprint 1')).toBeInTheDocument();
    expect(screen.queryByText('Sprint 2')).not.toBeInTheDocument();
  });

  it('권한별로 CRUD 버튼 노출/비노출', () => {
    renderWithStore({ me: { id: 2, username: 'dev', role: 'DEV' } });
    expect(screen.queryByText('신규 생성')).not.toBeInTheDocument();
    renderWithStore({ me: { id: 1, username: 'admin', role: 'ADMIN' } });
    expect(screen.getByText('신규 생성')).toBeInTheDocument();
  });
}); 