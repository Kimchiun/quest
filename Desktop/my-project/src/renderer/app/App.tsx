import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import TestCaseList from '../features/TestCaseManagement/components/TestCaseList';
import ReleaseBoard from '../features/ReleasePlanning/components/ReleaseBoard';
import DashboardContainer from '../features/Dashboard/components/DashboardContainer';
import NotificationBadge from '../features/ExecutionManagement/components/NotificationBadge';
import { ThemeProvider } from 'styled-components';
import { theme } from '../shared/theme';
import GlobalStyle from '../shared/GlobalStyle';
import Icon from '../shared/components/Icon';
import LoginPage from '../features/Login/LoginPage';

const AppRoutes: React.FC<{ isLoggedIn: boolean; onLogin: () => void }> = ({ isLoggedIn, onLogin }) => {
  const navigate = useNavigate();
  return (
    <>
      <nav style={{ padding: 16, borderBottom: '1px solid #eee', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Link to="/dashboard" style={{ marginRight: 16 }}>Dashboard</Link>
          {/* 다른 메뉴 추가 가능 */}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Icon name="logo" size={32} />
          <NotificationBadge />
        </div>
      </nav>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={() => { onLogin(); navigate('/dashboard'); }} />} />
        <Route path="/dashboard" element={isLoggedIn ? <DashboardContainer /> : <Navigate to="/login" replace />} />
        <Route path="/testcases" element={isLoggedIn ? <TestCaseList /> : <Navigate to="/login" replace />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {/* 다른 라우트 추가 가능 */}
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router>
          <AppRoutes isLoggedIn={isLoggedIn} onLogin={() => setIsLoggedIn(true)} />
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App; 