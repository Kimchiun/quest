import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import FolderTree from '../src/renderer/features/TestCaseManagement/components/FolderTree';

describe('FolderTree 렌더링', () => {
  it('폴더 구조 타이틀이 보인다', () => {
    render(<FolderTree onFolderSelect={() => {}} />);
    expect(screen.getByText(/폴더 구조/)).toBeInTheDocument();
  });
}); 