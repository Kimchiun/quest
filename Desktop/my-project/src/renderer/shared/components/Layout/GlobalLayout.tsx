import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { setCurrentSection, NavigationSection } from '../../../store/navigationSlice';
import MainContent from './ContentComponents';
import { DashboardIcon, TestIcon, ReleaseIcon, BugIcon, ChartIcon, SettingsIcon, UserIcon } from '../Icons';

// 레이아웃 컨테이너
const LayoutContainer = styled.div`
  display: grid;
  grid-template-areas:
    "nav header"
    "nav main";
  grid-template-columns: 280px 1fr;
  grid-template-rows: 60px 1fr;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  
  @media (max-width: 1024px) {
    grid-template-columns: 240px 1fr;
  }
  
  @media (max-width: 768px) {
    grid-template-areas:
      "header"
      "nav"
      "main";
    grid-template-columns: 1fr;
    grid-template-rows: 60px auto 1fr;
  }
`;

// 좌측 네비게이션
const Navigation = styled.nav`
  grid-area: nav;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

// 상단 헤더
const Header = styled.header`
  grid-area: header;
  background: white;
  border-bottom: 1px solid #e1e5e9;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

// 메인 컨텐츠 영역
const MainContentArea = styled.main`
  grid-area: main;
  background: #f8f9fa;
  overflow-y: auto;
  overflow-x: hidden;
`;

// 네비게이션 메뉴 아이템
const NavItem = styled.div<{ active?: boolean; onClick?: () => void }>`
  padding: 12px 16px;
  margin: 4px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  display: flex;
  align-items: center;
  gap: 12px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const NavIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: white;
`;

// 헤더 타이틀
const HeaderTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
`;

// 헤더 액션 영역
const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

// 사용자 정보
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 20px;
  font-size: 14px;
  color: #6c757d;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e9ecef;
  }
`;

interface GlobalLayoutProps {
  children: React.ReactNode;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.users.me);
  const currentSection = useSelector((state: RootState) => state.navigation.currentSection);
  const selectedRelease = useSelector((state: RootState) => (state.releases as any).selectedRelease);

  const getCurrentPageTitle = () => {
    switch (currentSection) {
      case 'dashboard':
        return 'Quest - 대시보드';
      case 'test-management':
        return '테스트 관리';
      case 'release-management':
        return 'Quest - 릴리즈 관리';
      case 'defect-management':
        return 'Quest - 결함 관리';
      case 'report':
        return 'Quest - 리포트';
      case 'settings':
        return 'Quest - 설정';
      default:
        return '테스트 관리 시스템';
    }
  };

  const handleNavigationClick = (section: NavigationSection) => {
    dispatch(setCurrentSection(section));
  };

  const isActiveSection = (section: NavigationSection) => {
    return currentSection === section;
  };

  return (
    <LayoutContainer>
      <Navigation>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '600' }}>
            Quest
          </h2>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '14px' }}>
            테스트 관리 시스템
          </p>
        </div>
        
        <NavItem 
          active={isActiveSection('dashboard')}
          onClick={() => handleNavigationClick('dashboard')}
        >
          <NavIcon>
            <DashboardIcon size={20} color="white" />
          </NavIcon>
          대시보드
        </NavItem>
        <NavItem 
          active={isActiveSection('test-management')}
          onClick={() => handleNavigationClick('test-management')}
        >
          <NavIcon>
            <TestIcon size={20} color="white" />
          </NavIcon>
          테스트 관리
        </NavItem>
        <NavItem 
          active={isActiveSection('release-management')}
          onClick={() => handleNavigationClick('release-management')}
        >
          <NavIcon>
            <ReleaseIcon size={20} color="white" />
          </NavIcon>
          릴리즈 관리
        </NavItem>
        <NavItem 
          active={isActiveSection('defect-management')}
          onClick={() => handleNavigationClick('defect-management')}
        >
          <NavIcon>
            <BugIcon size={20} color="white" />
          </NavIcon>
          결함 관리
        </NavItem>
        <NavItem 
          active={isActiveSection('report')}
          onClick={() => handleNavigationClick('report')}
        >
          <NavIcon>
            <ChartIcon size={20} color="white" />
          </NavIcon>
          리포트
        </NavItem>
        <NavItem 
          active={isActiveSection('settings')}
          onClick={() => handleNavigationClick('settings')}
        >
          <NavIcon>
            <SettingsIcon size={20} color="white" />
          </NavIcon>
          설정
        </NavItem>
      </Navigation>

      <Header>
        <HeaderTitle>{getCurrentPageTitle()}</HeaderTitle>
        <HeaderActions>
          <UserInfo>
            <UserIcon size={16} color="#6b7280" />
            <span>{user?.username || '사용자'}</span>
          </UserInfo>
        </HeaderActions>
      </Header>

      <MainContentArea>
        <MainContent />
      </MainContentArea>
    </LayoutContainer>
  );
};

export default GlobalLayout; 