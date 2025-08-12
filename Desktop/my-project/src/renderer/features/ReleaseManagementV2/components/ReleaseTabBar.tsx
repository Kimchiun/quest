import React from 'react';
import styled from 'styled-components';

// 타입 정의
interface Tab {
  id: string;
  label: string;
  icon?: string;
  badge?: number;
  disabled?: boolean;
}

interface ReleaseTabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

// 탭 바 컨테이너
const TabBarContainer = styled.div`
  background: ${({ theme }) => theme.color.surface.primary};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
  height: 44px;
  display: flex;
  align-items: center;
  overflow-x: auto;
  
  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

// 탭 버튼
const TabButton = styled.button<{ 
  active: boolean; 
  disabled: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 16px;
  border: none;
  background: none;
  color: ${({ theme, active, disabled }) => {
    if (disabled) return theme.color.text.disabled;
    if (active) return theme.color.primary[600];
    return theme.color.text.secondary;
  }};
  font-size: 14px;
  font-weight: ${({ active }) => active ? 600 : 500};
  line-height: 20px;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  white-space: nowrap;
  position: relative;
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.out};
  
  &:hover {
    ${({ disabled, theme }) => !disabled && `
      color: ${theme.color.primary[600]};
      background: ${theme.color.primary[50]};
    `}
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.color.focus};
    outline-offset: -2px;
  }
  
  /* 활성 탭 언더라인 */
  ${({ active, theme }) => active && `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: ${theme.color.primary[500]};
      border-radius: 1px 1px 0 0;
    }
  `}
  
  /* 비활성화 상태 */
  ${({ disabled }) => disabled && `
    opacity: 0.5;
  `}
`;

// 탭 아이콘
const TabIcon = styled.span`
  font-size: 16px;
  line-height: 1;
`;

// 배지
const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  background: ${({ theme }) => theme.color.primary[100]};
  color: ${({ theme }) => theme.color.primary[700]};
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  line-height: 14px;
`;

// 탭 구분선
const TabDivider = styled.div`
  width: 1px;
  height: 24px;
  background: ${({ theme }) => theme.color.border.primary};
  margin: 0 8px;
`;

// 반응형 조정
const ResponsiveContainer = styled.div`
  @media (max-width: 1024px) {
    ${TabBarContainer} {
      padding: 0 16px;
    }
    
    ${TabButton} {
      padding: 0 12px;
      font-size: 13px;
    }
  }
  
  @media (max-width: 768px) {
    ${TabBarContainer} {
      padding: 0 12px;
    }
    
    ${TabButton} {
      padding: 0 8px;
      font-size: 12px;
      gap: 4px;
    }
    
    ${TabIcon} {
      font-size: 14px;
    }
  }
`;

const ReleaseTabBar: React.FC<ReleaseTabBarProps> = ({
  tabs,
  activeTab,
  onTabChange
}) => {
  const handleTabClick = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab && !tab.disabled) {
      onTabChange(tabId);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, tabId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTabClick(tabId);
    }
  };

  return (
    <ResponsiveContainer>
      <TabBarContainer role="tablist" aria-label="릴리즈 상세 탭">
        {tabs.map((tab, index) => (
          <React.Fragment key={tab.id}>
            <TabButton
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-disabled={tab.disabled}
              active={activeTab === tab.id}
              disabled={tab.disabled}
              onClick={() => handleTabClick(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              tabIndex={tab.disabled ? -1 : activeTab === tab.id ? 0 : -1}
            >
              {tab.icon && <TabIcon>{tab.icon}</TabIcon>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <Badge>{tab.badge}</Badge>
              )}
            </TabButton>
            
            {/* 탭 그룹 간 구분선 */}
            {index < tabs.length - 1 && (
              <TabDivider />
            )}
          </React.Fragment>
        ))}
      </TabBarContainer>
    </ResponsiveContainer>
  );
};

export default ReleaseTabBar;
