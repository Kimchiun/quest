import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '../store';
import App from './App';

// MSW 비활성화 - 실제 API 사용
// if (process.env.NODE_ENV === 'development') {
//   const { startMSW } = require('../mocks/browser');
//   startMSW().catch(console.error);
// }

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
} else {
  console.error('Root element not found');
} 