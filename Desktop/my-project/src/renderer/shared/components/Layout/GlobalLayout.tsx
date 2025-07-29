import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

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

// 메인 컨텐츠
const MainContent = styled.main`
  grid-area: main;
  background: #f8f9fa;
  overflow-y: auto;
  overflow-x: hidden;
`;

// 네비게이션 메뉴 아이템
const NavItem = styled.div<{ active?: boolean }>`
  padding: 12px 16px;
  margin: 4px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
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
`;

interface GlobalLayoutProps {
  children: React.ReactNode;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  const user = useSelector((state: RootState) => state.users.me);
  const selectedRelease = useSelector((state: RootState) => (state.releases as any).selectedRelease);

  const getCurrentPageTitle = () => {
    if (selectedRelease) {
      return `${selectedRelease.name} - 테스트 관리`;
    }
    return 'ITMS - 통합 테스트 관리 시스템';
  };

  return (
    <LayoutContainer>
      <Navigation>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '600' }}>
            ITMS
          </h2>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '14px' }}>
            통합 테스트 관리 시스템
          </p>
        </div>
        
        <NavItem active={!selectedRelease}>
          📊 대시보드
        </NavItem>
        <NavItem active={selectedRelease}>
          🧪 테스트 관리
        </NavItem>
        <NavItem>
          📋 릴리즈 관리
        </NavItem>
        <NavItem>
          🐛 결함 관리
        </NavItem>
        <NavItem>
          📈 리포트
        </NavItem>
        <NavItem>
          ⚙️ 설정
        </NavItem>
      </Navigation>

      <Header>
        <HeaderTitle>{getCurrentPageTitle()}</HeaderTitle>
        <HeaderActions>
          <UserInfo>
            <span>👤</span>
            <span>{user?.username || '사용자'}</span>
          </UserInfo>
        </HeaderActions>
      </Header>

      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default GlobalLayout; 