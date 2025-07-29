import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import GlobalLayout from '../GlobalLayout';

// Mock store 생성
const createMockStore = () => {
  return configureStore({
    reducer: {
      users: (state = { me: { username: 'testuser' } }, action: any) => state,
      releases: (state = { selectedRelease: null }, action: any) => state,
      testcases: (state = { selectedTestCase: null }, action: any) => state
    }
  });
};

// Mock styled-components
jest.mock('styled-components', () => ({
  ...jest.requireActual('styled-components'),
  styled: {
    div: (strings: any, ...args: any[]) => {
      return ({ children, ...props }: any) => React.createElement('div', props, children);
    },
    nav: (strings: any, ...args: any[]) => {
      return ({ children, ...props }: any) => React.createElement('nav', props, children);
    },
    header: (strings: any, ...args: any[]) => {
      return ({ children, ...props }: any) => React.createElement('header', props, children);
    },
    main: (strings: any, ...args: any[]) => {
      return ({ children, ...props }: any) => React.createElement('main', props, children);
    }
  }
}));

describe('GlobalLayout', () => {
  let store: any;

  beforeEach(() => {
    store = createMockStore();
  });

  it('should render without crashing', () => {
    const { container } = render(
      <Provider store={store}>
        <GlobalLayout>
          <div>Test Content</div>
        </GlobalLayout>
      </Provider>
    );
    
    expect(container).toBeInTheDocument();
  });

  it('should render navigation area', () => {
    const { getByText } = render(
      <Provider store={store}>
        <GlobalLayout>
          <div>Test Content</div>
        </GlobalLayout>
      </Provider>
    );
    
    expect(getByText('ITMS')).toBeInTheDocument();
    expect(getByText('통합 테스트 관리 시스템')).toBeInTheDocument();
    expect(getByText('📊 대시보드')).toBeInTheDocument();
    expect(getByText('🧪 테스트 관리')).toBeInTheDocument();
  });

  it('should render header with user info', () => {
    const { getByText } = render(
      <Provider store={store}>
        <GlobalLayout>
          <div>Test Content</div>
        </GlobalLayout>
      </Provider>
    );
    
    expect(getByText('ITMS - 통합 테스트 관리 시스템')).toBeInTheDocument();
    expect(getByText('testuser')).toBeInTheDocument();
  });

  it('should render children in main content area', () => {
    const { getByText } = render(
      <Provider store={store}>
        <GlobalLayout>
          <div>Test Content</div>
        </GlobalLayout>
      </Provider>
    );
    
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(
      <Provider store={store}>
        <GlobalLayout>
          <div>Test Content</div>
        </GlobalLayout>
      </Provider>
    );
    
    expect(container).toMatchSnapshot();
  });
}); 