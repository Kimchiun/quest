import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import ReleaseList from './ReleaseList';

const Panel = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
`;

const NavigationMenu = styled.nav`
  padding: 20px;
  flex: 1;
`;

const MenuItem = styled.div<{ isActive?: boolean }>`
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isActive ? '#eff6ff' : 'transparent'};
  color: ${props => props.isActive ? '#1d4ed8' : '#64748b'};
  font-weight: ${props => props.isActive ? '500' : '400'};
  
  &:hover {
    background: ${props => props.isActive ? '#dbeafe' : '#f1f5f9'};
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

const MenuIcon = styled.span`
  margin-right: 12px;
  font-size: 16px;
`;

const CollapsedContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;
  height: 100%;
`;

const CollapsedIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-size: 18px;
`;

const LeftPanel: React.FC = () => {
  const layout = useSelector((state: RootState) => state.dashboardLayout);
  const isCollapsed = layout.leftPanel.isCollapsed;

  // 메모이제이션된 메뉴 아이템
  const menuItems = useMemo(() => [
    { id: 'dashboard', label: '대시보드', icon: '📊' },
    { id: 'testcases', label: '테스트 케이스', icon: '🧪' },
    { id: 'releases', label: '릴리즈', icon: '🚀' },
    { id: 'executions', label: '실행 관리', icon: '⚡' },
    { id: 'reports', label: '보고서', icon: '📈' },
    { id: 'settings', label: '설정', icon: '⚙️' }
  ], []);

  const handleMenuClick = (menuId: string) => {
    // 메뉴 클릭 핸들러 (향후 라우팅 구현)
    console.log(`메뉴 클릭: ${menuId}`);
  };

  const handleReleaseClick = (releaseId: number) => {
    // 릴리즈 클릭 핸들러 (향후 상세 페이지 구현)
    console.log(`릴리즈 클릭: ${releaseId}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  if (isCollapsed) {
    return (
      <Panel>
        <CollapsedContent>
          {menuItems.map((item, index) => (
            <CollapsedIcon 
              key={item.id} 
              title={item.label}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, () => handleMenuClick(item.id))}
            >
              {item.icon}
            </CollapsedIcon>
          ))}
        </CollapsedContent>
      </Panel>
    );
  }

  return (
    <Panel>
      <Header>
        <Title>Quest</Title>
      </Header>
      
      <NavigationMenu role="navigation" aria-label="주요 메뉴">
        {menuItems.map((item) => (
          <MenuItem 
            key={item.id} 
            isActive={item.id === 'dashboard'}
            role="button"
            tabIndex={0}
            onClick={() => handleMenuClick(item.id)}
            onKeyDown={(e) => handleKeyDown(e, () => handleMenuClick(item.id))}
            aria-label={`${item.label} 메뉴`}
          >
            <MenuIcon>{item.icon}</MenuIcon>
            {item.label}
          </MenuItem>
        ))}
      </NavigationMenu>
      
      {/* ReleaseList 삽입 */}
      <ReleaseList />
    </Panel>
  );
};

export default React.memo(LeftPanel); 