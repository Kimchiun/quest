import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store, RootState } from '../store';
import TestCaseList from '../features/TestCaseManagement/components/TestCaseList';
import ReleaseBoard from '../features/ReleasePlanning/components/ReleaseBoard';
import DashboardContainer from '../features/Dashboard/components/DashboardContainer';
import NotificationBadge from '../features/ExecutionManagement/components/NotificationBadge';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { theme } from '../shared/theme';
import GlobalStyle from '../shared/GlobalStyle';
import Icon from '../shared/components/Icon';
import LoginPage from '../features/Login/LoginPage';
import ReleaseSelection from '../features/ReleasePlanning/components/ReleaseSelection';

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
  return (
    <>
      <a href="#main-content" className="skip-link">본문 바로가기</a>
      <nav style={{ padding: 16, borderBottom: '1px solid #eee', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} aria-label="주요 메뉴">
        <div>
          <Link to="/dashboard" style={{ marginRight: 16 }}>Dashboard</Link>
          <Link to="/releases" style={{ marginRight: 16 }}>릴리즈 관리</Link>
          {/* 다른 메뉴 추가 가능 */}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Icon name="logo" size={32} />
          <NotificationBadge />
        </div>
      </nav>
      <main id="main-content" role="main" aria-label="주요 컨텐츠">
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={() => { onLogin(); navigate('/dashboard'); }} />} />
          <Route path="/dashboard" element={isLoggedIn ? <DashboardContainer /> : <Navigate to="/login" replace />} />
          <Route path="/dashboard/:releaseId" element={isLoggedIn ? <DashboardContainer /> : <Navigate to="/login" replace />} />
          <Route path="/releases" element={isLoggedIn ? <ReleaseSelection /> : <Navigate to="/login" replace />} />
          <Route path="/testcases" element={isLoggedIn ? <TestCaseList /> : <Navigate to="/login" replace />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          {/* 다른 라우트 추가 가능 */}
        </Routes>
      </main>
    </>
  );
};

const App: React.FC = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isLoggedIn = useSelector((state: RootState) => state.users.isLoggedIn);
  const dispatch = useDispatch();
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <SkipLinkStyle />
        <Router>
          <AppRoutes isLoggedIn={isLoggedIn} onLogin={() => {}} />
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App; 