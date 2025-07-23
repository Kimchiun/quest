import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import TestCaseList from '../features/TestCaseManagement/components/TestCaseList';
import ReleaseBoard from '../features/ReleasePlanning/components/ReleaseBoard';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <h1>ITMS 테스트케이스 관리</h1>
        <div style={{ display: 'flex', gap: 32 }}>
          <div style={{ flex: 1 }}>
            <ReleaseBoard />
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default App; 