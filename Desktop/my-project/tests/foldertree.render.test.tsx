import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../src/renderer/store';
import FolderTree from '../src/renderer/features/TestCaseManagement/components/FolderTree';

describe('FolderTree 렌더링', () => {
  it('폴더 로딩 상태가 표시된다', () => {
    render(
      <Provider store={store}>
        <FolderTree onFolderSelect={() => {}} />
      </Provider>
    );
    expect(screen.getByText('폴더 로딩 중...')).toBeInTheDocument();
  });
}); 