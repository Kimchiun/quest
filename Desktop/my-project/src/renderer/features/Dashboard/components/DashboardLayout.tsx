import React, { useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { toggleLeftPanel, toggleRightPanel } from '../../../store/dashboardLayoutSlice';
import LeftPanel from './LeftPanel';
import CenterPanel from './CenterPanel';
import RightPanel from './RightPanel';

interface LayoutContainerProps {
  layout: {
    leftPanel: {
      isCollapsed: boolean;
      width: number;
    };
    rightPanel: {
      isCollapsed: boolean;
      width: number;
    };
  };
}

const LayoutContainer = styled.div<LayoutContainerProps>`
  display: grid;
  grid-template-columns: ${props => {
    const { leftPanel, rightPanel } = props.layout;
    const leftWidth = leftPanel.isCollapsed ? '60px' : `${leftPanel.width}px`;
    const rightWidth = rightPanel.isCollapsed ? '60px' : `${rightPanel.width}px`;
    return `${leftWidth} 1fr ${rightWidth}`;
  }};
  height: 100vh;
  transition: grid-template-columns 0.3s ease;
  overflow: hidden;
`;

const ToggleButton = styled.button<{ position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${props => props.position === 'left' ? 'right: -15px' : 'left: -15px'};
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: #2563eb;
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

const PanelContainer = styled.div<{ isCollapsed: boolean }>`
  position: relative;
  background: ${props => props.isCollapsed ? '#f8fafc' : 'white'};
  border-right: ${props => props.isCollapsed ? '1px solid #e2e8f0' : '1px solid #e2e8f0'};
  overflow: hidden;
  transition: all 0.3s ease;
`;

const DashboardLayout: React.FC = () => {
  const dispatch = useDispatch();
  const layout = useSelector((state: RootState) => state.dashboardLayout);

  // 메모이제이션된 콜백 함수들
  const handleToggleLeftPanel = useCallback(() => {
    dispatch(toggleLeftPanel());
  }, [dispatch]);

  const handleToggleRightPanel = useCallback(() => {
    dispatch(toggleRightPanel());
  }, [dispatch]);

  // 메모이제이션된 레이아웃 설정
  const layoutConfig = useMemo(() => ({
    leftPanel: layout.leftPanel,
    rightPanel: layout.rightPanel
  }), [layout.leftPanel, layout.rightPanel]);

  // 메모이제이션된 토글 버튼 텍스트
  const leftToggleText = useMemo(() => 
    layout.leftPanel.isCollapsed ? '→' : '←', 
    [layout.leftPanel.isCollapsed]
  );

  const rightToggleText = useMemo(() => 
    layout.rightPanel.isCollapsed ? '←' : '→', 
    [layout.rightPanel.isCollapsed]
  );

  return (
    <LayoutContainer 
      layout={layoutConfig}
      data-testid="dashboard-layout"
    >
      <PanelContainer 
        isCollapsed={layout.leftPanel.isCollapsed}
        data-testid="left-panel"
        className={layout.leftPanel.isCollapsed ? 'collapsed' : ''}
      >
        <LeftPanel />
        <ToggleButton 
          position="left" 
          onClick={handleToggleLeftPanel}
          aria-label={layout.leftPanel.isCollapsed ? '좌측 패널 확장' : '좌측 패널 축소'}
          data-testid="left-toggle-button"
        >
          {leftToggleText}
        </ToggleButton>
      </PanelContainer>
      
      <div data-testid="center-panel">
        <CenterPanel />
      </div>
      
      <PanelContainer 
        isCollapsed={layout.rightPanel.isCollapsed}
        data-testid="right-panel"
        className={layout.rightPanel.isCollapsed ? 'collapsed' : ''}
      >
        <RightPanel />
        <ToggleButton 
          position="right" 
          onClick={handleToggleRightPanel}
          aria-label={layout.rightPanel.isCollapsed ? '우측 패널 확장' : '우측 패널 축소'}
          data-testid="right-toggle-button"
        >
          {rightToggleText}
        </ToggleButton>
      </PanelContainer>
    </LayoutContainer>
  );
};

export default React.memo(DashboardLayout); 