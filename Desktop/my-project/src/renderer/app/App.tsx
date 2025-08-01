import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes, Link, useNavigate, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store, RootState } from '../store';
import TestCaseList from '../features/TestCaseManagement/components/TestCaseList';
import ReleaseBoard from '../features/ReleasePlanning/components/ReleaseBoard';
import DashboardLayout from '../features/Dashboard/components/DashboardLayout';
import FolderManagementPage from '../features/FolderManagement/components/FolderManagementPage';
import NotificationBadge from '../features/ExecutionManagement/components/NotificationBadge';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { theme } from '../shared/theme';
import GlobalStyle from '../shared/GlobalStyle';
import Icon from '../shared/components/Icon';
import LoginPage from '../features/Login/LoginPage';
import ReleaseSelection from '../features/ReleasePlanning/components/ReleaseSelection';
import UserFlowManager from '../features/UserFlow/components/UserFlowManager';
import AccessibilityManager from '../features/Accessibility/components/AccessibilityManager';
import FeedbackCollector from '../features/Feedback/components/FeedbackCollector';
import { LayoutProvider } from '../shared/components/Layout/LayoutContext';
import GlobalLayout from '../shared/components/Layout/GlobalLayout';
import ResponsiveLayout from '../shared/components/Layout/ResponsiveLayout';
import ToastContainer from '../shared/components/Toast/ToastContainer';

const SkipLinkStyle = createGlobalStyle`
  .skip-link {
    position: absolute;
    left: -9999px;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
    z-index: 10000;
    background: #2563eb;
    color: #fff;
    font-weight: bold;
    border-radius: 4px;
    padding: 8px 16px;
    transition: left 0.2s;
  }
  .skip-link:focus {
    left: 16px;
    top: 16px;
    width: auto;
    height: auto;
    outline: 2px solid #fff;
  }
`;

const AppRoutes: React.FC<{ isLoggedIn: boolean; onLogin: () => void }> = ({ isLoggedIn, onLogin }) => {
  const navigate = useNavigate();
  
  if (!isLoggedIn) {
    return (
      <>
        <a href="#main-content" className="skip-link">본문 바로가기</a>
        <main id="main-content" role="main" aria-label="주요 컨텐츠">
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={() => { onLogin(); navigate('/dashboard'); }} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </>
    );
  }

  return (
    <LayoutProvider>
      <GlobalLayout>
        <ResponsiveLayout>
          <a href="#main-content" className="skip-link">본문 바로가기</a>
          <UserFlowManager />
          <AccessibilityManager />
          <FeedbackCollector />
        </ResponsiveLayout>
      </GlobalLayout>
    </LayoutProvider>
  );
};

const AppInner: React.FC = () => {
  const user = useSelector((state: RootState) => state.users.me);
  const isLoggedIn = !!user;
  
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <SkipLinkStyle />
      <Router>
        <AppRoutes isLoggedIn={isLoggedIn} onLogin={() => {}} />
      </Router>
      {/* Toast 알림 시스템 */}
      <ToastContainer />
    </ThemeProvider>
  );
};

const App: React.FC = () => (
  <Provider store={store}>
    <AppInner />
  </Provider>
);

export default App; 