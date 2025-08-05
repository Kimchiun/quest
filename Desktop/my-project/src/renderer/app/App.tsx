import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Link, useNavigate, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store, RootState, setMe } from '../store';
import TestCaseList from '../features/TestCaseManagement/components/TestCaseList';
import ReleaseBoard from '../features/ReleasePlanning/components/ReleaseBoard';
import ReleaseManagementPage from '../features/ReleasePlanning/components/ReleaseManagementPage';
import DashboardLayout from '../features/Dashboard/components/DashboardLayout';
import FolderManagementPage from '../features/FolderManagement/components/FolderManagementPage';
import QaseTestManagementPage from '../features/TestCaseManagement/components/QaseTestManagementPage';
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
import ConnectionStatusIndicator from '../shared/components/ConnectionStatus';
import { testBackendConnection, logConnectionStatus } from '../utils/connectionTest';

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
          <Routes>
            <Route path="/dashboard" element={<DashboardLayout />} />
            <Route path="/test-management" element={<QaseTestManagementPage />} />
            <Route path="/test-cases" element={<TestCaseList />} />
            <Route path="/release-planning" element={<ReleaseBoard />} />
            <Route path="/release-selection" element={<ReleaseSelection />} />
            <Route path="/folder-management" element={<FolderManagementPage />} />
            <Route path="/release-management" element={<ReleaseManagementPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ResponsiveLayout>
      </GlobalLayout>
    </LayoutProvider>
  );
};

const AppInner: React.FC = () => {
  const user = useSelector((state: RootState) => state.users.me);
  const dispatch = useDispatch();
  const isLoggedIn = !!user;
  
  // 개발 환경에서 MSW를 통한 자동 로그인
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !isLoggedIn) {
      console.log('🔧 개발 환경 MSW 자동 로그인 시도...');
      
      const autoLoginWithMSW = async () => {
        try {
          // MSW를 통해 로그인 시도
          const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: 'admin@test.com',
              password: 'password123'
            })
          });
          
          if (loginResponse.ok) {
            const data = await loginResponse.json();
            if (data.user) {
              dispatch(setMe(data.user));
              console.log('✅ MSW 자동 로그인 성공:', data.user);
            }
          } else {
            console.log('⚠️ MSW 로그인 실패. 로그인 페이지를 표시합니다.');
          }
        } catch (error) {
          console.log('⚠️ MSW 연결 실패. 로그인 페이지를 표시합니다:', error);
        }
      };
      
      // 1초 후에 MSW 자동 로그인 실행
      setTimeout(autoLoginWithMSW, 1000);
    }
  }, [isLoggedIn, dispatch]);
  
  // 앱 시작 시 백엔드 연결 테스트
  useEffect(() => {
    const testConnection = async () => {
      console.log('🔗 백엔드 연결 테스트 시작...');
      const status = await testBackendConnection();
      logConnectionStatus(status);
      
      if (!status.backend) {
        console.error('⚠️ 백엔드 서버가 실행되지 않았습니다.');
        console.log('💡 다음 명령어로 백엔드를 시작하세요:');
        console.log('   npm run dev:backend');
      }
    };
    
    // 3초 후에 연결 테스트 실행 (서버 시작 시간 고려)
    const timer = setTimeout(testConnection, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <SkipLinkStyle />
      <Router>
        <AppRoutes isLoggedIn={isLoggedIn} onLogin={() => {}} />
      </Router>
      {/* Toast 알림 시스템 */}
      <ToastContainer />
      {/* 연결 상태 표시기 */}
      <ConnectionStatusIndicator />
    </ThemeProvider>
  );
};

const App: React.FC = () => (
  <Provider store={store}>
    <AppInner />
  </Provider>
);

export default App; 