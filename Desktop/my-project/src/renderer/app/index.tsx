import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '../store';
import App from './App';

// MSW 설정 (개발 환경에서만)
if (process.env.NODE_ENV === 'development') {
  const { worker } = require('../mocks/browser');
  worker.start({
    onUnhandledRequest: 'bypass',
  });
}

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