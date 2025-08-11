import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../store';
import { setCurrentSection, NavigationSection } from '../../../store/navigationSlice';
import { logout } from '../../../store';
import MainContent from './ContentComponents';
import { DashboardIcon, TestIcon, BugIcon, ChartIcon, SettingsIcon, UserIcon, ReleaseIcon } from '../Icons';

// 레이아웃 컨테이너
const LayoutContainer = styled.div<{ sidebarCollapsed: boolean }>`
  display: grid;
  grid-template-areas:
    "nav header"
    "nav main";
  grid-template-columns: ${props => props.sidebarCollapsed ? '60px' : '280px'} 1fr;
  grid-template-rows: 60px 1fr;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  transition: grid-template-columns 0.3s ease;
  
  @media (max-width: 1024px) {
    grid-template-columns: ${props => props.sidebarCollapsed ? '60px' : '240px'} 1fr;
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
const Navigation = styled.nav<{ collapsed: boolean }>`
  grid-area: nav;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: ${props => props.collapsed ? '20px 10px' : '20px'};
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  transition: padding 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

// 상단 헤더
const Header = styled.header`
  grid-area: header;
  background: white;
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

// 토글 버튼
const ToggleButton = styled.button<{ collapsed: boolean }>`
  position: absolute;
  top: -10px;
  right: ${props => props.collapsed ? '50%' : '-12px'};
  transform: ${props => props.collapsed ? 'translateX(50%)' : 'none'};
  width: 24px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
  color: white;
  font-size: 16px;
  font-weight: 600;
  
  &:hover {
    transform: ${props => props.collapsed ? 'translateX(50%) translateX(2px)' : 'translateX(-2px)'};
    color: #f0f0f0;
  }
  
  &:active {
    transform: ${props => props.collapsed ? 'translateX(50%) translateX(1px)' : 'translateX(-1px)'};
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// 네비게이션 컨테이너 (상대 위치)
const NavigationContainer = styled.div<{ collapsed: boolean }>`
  position: relative;
  height: 100%;
  padding-right: ${props => props.collapsed ? '0' : '15px'};
`;

// 네비게이션 메뉴 아이템
const NavItem = styled.div<{ active?: boolean; onClick?: () => void; collapsed?: boolean }>`
  padding: ${props => props.collapsed ? '12px 8px' : '12px 16px'};
  margin: 4px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  display: flex;
  align-items: center;
  gap: ${props => props.collapsed ? '0' : '12px'};
  justify-content: ${props => props.collapsed ? 'center' : 'flex-start'};
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  ${props => props.collapsed && `
    &:hover::after {
      content: attr(data-title);
      position: absolute;
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 1000;
      margin-left: 8px;
      pointer-events: none;
    }
  `}
`;

const NavIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: white;
  flex-shrink: 0;
`;

const NavText = styled.span<{ collapsed?: boolean }>`
  color: white;
  font-size: 14px;
  font-weight: 500;
  opacity: ${props => props.collapsed ? '0' : '1'};
  transition: opacity 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
`;

// 헤더 타이틀
const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

// 헤더 액션 영역
const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

// 사용자 정보 컨테이너
const UserInfo = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
  }
`;

// 드롭다운 메뉴
const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 180px;
  z-index: 1000;
  opacity: ${props => props.isOpen ? '1' : '0'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-8px)'};
  transition: all 0.2s ease;
`;

// 드롭다운 메뉴 아이템
const DropdownItem = styled.button<{ isLogout?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: left;
  font-size: 14px;
  color: ${props => props.isLogout ? '#ef4444' : '#374151'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f9fafb;
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
    border-top: 1px solid #f3f4f6;
  }
`;

// 브랜드 영역
const BrandArea = styled.div<{ collapsed: boolean }>`
  margin-bottom: 30px;
  text-align: ${props => props.collapsed ? 'center' : 'left'};
`;

const BrandTitle = styled.h2<{ collapsed: boolean }>`
  margin: 0 0 ${props => props.collapsed ? '0' : '20px'} 0;
  font-size: ${props => props.collapsed ? '16px' : '20px'};
  font-weight: 600;
  opacity: ${props => props.collapsed ? '0' : '1'};
  transition: all 0.3s ease;
`;

const BrandSubtitle = styled.p<{ collapsed: boolean }>`
  margin: 0;
  opacity: ${props => props.collapsed ? '0' : '0.8'};
  font-size: 14px;
  transition: opacity 0.3s ease;
`;

interface GlobalLayoutProps {
  children: React.ReactNode;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.users.me);
  const currentSection = useSelector((state: RootState) => state.navigation.currentSection);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getCurrentPageTitle = () => {
    switch (currentSection) {
      case 'dashboard':
        return 'Quest - 대시보드';
      case 'test-management-v2':
        return 'Quest - 테스트 관리';

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
    console.log('🔍 Navigation clicked:', section);
    console.log('🔍 Current location before navigation:', window.location.href);
    dispatch(setCurrentSection(section));
    
    // 라우팅 처리
    switch (section) {
      case 'dashboard':
        console.log('🏠 Navigating to dashboard');
        navigate('/dashboard');
        break;
      case 'test-management-v2':
        console.log('🧪 Navigating to test-management-v2');
        navigate('/test-management-v2');
        break;

      case 'release-management':
        console.log('📦 Navigating to release-management');
        navigate('/release-management');
        break;
      case 'defect-management':
        console.log('🐛 Navigating to defect-management');
        navigate('/defect-management');
        break;
      case 'report':
        console.log('📊 Navigating to report');
        navigate('/report');
        break;
      case 'settings':
        console.log('⚙️ Navigating to settings');
        navigate('/settings');
        break;
      default:
        console.log('❓ Unknown section, navigating to dashboard:', section);
        navigate('/dashboard');
    }
    
    // 네비게이션 후 현재 위치 확인
    setTimeout(() => {
      console.log('🔍 Current location after navigation:', window.location.href);
    }, 100);
  };

  const isActiveSection = (section: NavigationSection) => {
    return currentSection === section;
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // Redux 상태에서 사용자 정보 제거
    dispatch(logout());
    
    // 로컬 스토리지에서 토큰 및 사용자 정보 제거
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('tempToken');
    
    // 드롭다운 닫기
    setIsDropdownOpen(false);
    
    // 로그인 페이지로 이동
    navigate('/login');
  };

  const handleProfileSettings = () => {
    // 설정 페이지로 이동 (나중에 구현)
    navigate('/settings');
    setIsDropdownOpen(false);
  };

  // 외부 클릭 감지
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <LayoutContainer sidebarCollapsed={sidebarCollapsed}>
      <Navigation collapsed={sidebarCollapsed}>
        <NavigationContainer collapsed={sidebarCollapsed}>
          <ToggleButton onClick={toggleSidebar} collapsed={sidebarCollapsed}>
            {sidebarCollapsed ? '>>' : '<<'}
          </ToggleButton>
          
          <BrandArea collapsed={sidebarCollapsed}>
            <BrandTitle collapsed={sidebarCollapsed}>
              Quest
            </BrandTitle>
            <BrandSubtitle collapsed={sidebarCollapsed}>
              테스트 관리 시스템
            </BrandSubtitle>
          </BrandArea>
          
          <NavItem 
            active={isActiveSection('dashboard')}
            onClick={() => handleNavigationClick('dashboard')}
            collapsed={sidebarCollapsed}
            data-title="대시보드"
          >
            <NavIcon>
              <DashboardIcon size={20} color="white" />
            </NavIcon>
            <NavText collapsed={sidebarCollapsed}>대시보드</NavText>
          </NavItem>

          <NavItem 
            active={isActiveSection('test-management-v2')}
            onClick={() => handleNavigationClick('test-management-v2')}
            collapsed={sidebarCollapsed}
            data-title="테스트 관리"
          >
            <NavIcon>
              <TestIcon size={20} color="white" />
            </NavIcon>
            <NavText collapsed={sidebarCollapsed}>테스트 관리</NavText>
          </NavItem>

          <NavItem 
            active={isActiveSection('release-management')}
            onClick={() => handleNavigationClick('release-management')}
            collapsed={sidebarCollapsed}
            data-title="릴리즈 관리"
          >
            <NavIcon>
              <ReleaseIcon size={20} color="white" />
            </NavIcon>
            <NavText collapsed={sidebarCollapsed}>릴리즈 관리</NavText>
          </NavItem>

          <NavItem 
            active={isActiveSection('defect-management')}
            onClick={() => handleNavigationClick('defect-management')}
            collapsed={sidebarCollapsed}
            data-title="결함 관리"
          >
            <NavIcon>
              <BugIcon size={20} color="white" />
            </NavIcon>
            <NavText collapsed={sidebarCollapsed}>결함 관리</NavText>
          </NavItem>
          <NavItem 
            active={isActiveSection('report')}
            onClick={() => handleNavigationClick('report')}
            collapsed={sidebarCollapsed}
            data-title="리포트"
          >
            <NavIcon>
              <ChartIcon size={20} color="white" />
            </NavIcon>
            <NavText collapsed={sidebarCollapsed}>리포트</NavText>
          </NavItem>
          <NavItem 
            active={isActiveSection('settings')}
            onClick={() => handleNavigationClick('settings')}
            collapsed={sidebarCollapsed}
            data-title="설정"
          >
            <NavIcon>
              <SettingsIcon size={20} color="white" />
            </NavIcon>
            <NavText collapsed={sidebarCollapsed}>설정</NavText>
          </NavItem>
        </NavigationContainer>
      </Navigation>

      <Header>
        <HeaderTitle>{getCurrentPageTitle()}</HeaderTitle>
        <HeaderActions>
          <UserInfo ref={dropdownRef} onClick={toggleDropdown}>
            <UserIcon size={16} color="#6b7280" />
            <span>{user?.username || '사용자'}</span>
            <DropdownMenu isOpen={isDropdownOpen}>
              <DropdownItem onClick={handleProfileSettings}>
                <SettingsIcon size={16} color="#6b7280" />
                프로필 설정
              </DropdownItem>
              <DropdownItem onClick={handleLogout} isLogout={true}>
                <UserIcon size={16} color="#ef4444" />
                로그아웃
              </DropdownItem>
            </DropdownMenu>
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