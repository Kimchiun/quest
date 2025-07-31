import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme';

export type ViewType = 'dashboard' | 'list' | 'detail' | 'form';
export type LayoutVariant = 'default' | 'compact' | 'expanded';

export interface MainContentLayoutProps {
  children: React.ReactNode;
  viewType: ViewType;
  variant?: LayoutVariant;
  leftPanel?: React.ReactNode;
  centerPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  showLeftPanel?: boolean;
  showRightPanel?: boolean;
  leftPanelWidth?: number;
  rightPanelWidth?: number;
  className?: string;
}

const getLayoutConfig = (viewType: ViewType, variant: LayoutVariant) => {
  const configs = {
    dashboard: {
      default: { left: 280, center: 1, right: 320 },
      compact: { left: 240, center: 1, right: 280 },
      expanded: { left: 320, center: 1, right: 360 }
    },
    list: {
      default: { left: 260, center: 1, right: 300 },
      compact: { left: 220, center: 1, right: 260 },
      expanded: { left: 300, center: 1, right: 340 }
    },
    detail: {
      default: { left: 240, center: 1, right: 280 },
      compact: { left: 200, center: 1, right: 240 },
      expanded: { left: 280, center: 1, right: 320 }
    },
    form: {
      default: { left: 0, center: 1, right: 0 },
      compact: { left: 0, center: 1, right: 0 },
      expanded: { left: 0, center: 1, right: 0 }
    }
  };
  
  return configs[viewType][variant];
};

const LayoutContainer = styled.div<{
  $viewType: ViewType;
  $variant: LayoutVariant;
  $showLeftPanel: boolean;
  $showRightPanel: boolean;
  $leftPanelWidth: number;
  $rightPanelWidth: number;
}>`
  display: grid;
  height: 100%;
  width: 100%;
  overflow: hidden;
  
  ${({ $viewType, $variant, $showLeftPanel, $showRightPanel, $leftPanelWidth, $rightPanelWidth, theme }) => {
    const config = getLayoutConfig($viewType, $variant);
    
    let templateColumns = '';
    
    if ($viewType === 'form') {
      templateColumns = '1fr';
    } else {
      const leftWidth = $showLeftPanel ? `${$leftPanelWidth || config.left}px` : '0px';
      const rightWidth = $showRightPanel ? `${$rightPanelWidth || config.right}px` : '0px';
      templateColumns = `${leftWidth} 1fr ${rightWidth}`;
    }
    
    return `
      grid-template-columns: ${templateColumns};
      grid-template-areas: ${$viewType === 'form' ? '"main"' : '"left center right"'};
      
      @media (max-width: ${theme.breakpoint.lg}) {
        grid-template-columns: ${$showLeftPanel ? '240px 1fr' : '1fr'};
        grid-template-areas: ${$showLeftPanel ? '"left center"' : '"center"'};
      }
      
      @media (max-width: ${theme.breakpoint.md}) {
        grid-template-columns: 1fr;
        grid-template-areas: "center";
      }
    `;
  }}
  
  transition: grid-template-columns ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.out};
`;

const Panel = styled.div<{
  $area: 'left' | 'center' | 'right';
  $viewType: ViewType;
  $variant: LayoutVariant;
}>`
  grid-area: ${({ $area }) => $area};
  background: ${({ theme, $area }) => 
    $area === 'left' ? theme.color.surface.secondary :
    $area === 'right' ? theme.color.surface.secondary :
    theme.color.surface.primary
  };
  border-right: ${({ theme, $area }) => 
    $area === 'left' ? `1px solid ${theme.color.border.primary}` : 'none'
  };
  border-left: ${({ theme, $area }) => 
    $area === 'right' ? `1px solid ${theme.color.border.primary}` : 'none'
  };
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  ${({ $viewType, $variant, theme }) => {
    if ($viewType === 'form') {
      return `
        padding: ${theme.spacing[6]};
        max-width: 800px;
        margin: 0 auto;
        width: 100%;
      `;
    }
    
    return `
      padding: ${$variant === 'compact' ? theme.spacing[3] : theme.spacing[4]};
    `;
  }}
`;

const MainContentLayout: React.FC<MainContentLayoutProps> = ({
  children,
  viewType,
  variant = 'default',
  leftPanel,
  centerPanel,
  rightPanel,
  showLeftPanel = true,
  showRightPanel = true,
  leftPanelWidth,
  rightPanelWidth,
  className
}) => {
  const config = getLayoutConfig(viewType, variant);
  
  if (viewType === 'form') {
    return (
      <LayoutContainer
        $viewType={viewType}
        $variant={variant}
        $showLeftPanel={false}
        $showRightPanel={false}
        $leftPanelWidth={0}
        $rightPanelWidth={0}
        className={className}
      >
        <Panel $area="center" $viewType={viewType} $variant={variant}>
          {children}
        </Panel>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer
      $viewType={viewType}
      $variant={variant}
      $showLeftPanel={showLeftPanel}
      $showRightPanel={showRightPanel}
      $leftPanelWidth={leftPanelWidth || config.left}
      $rightPanelWidth={rightPanelWidth || config.right}
      className={className}
    >
      {showLeftPanel && leftPanel && (
        <Panel $area="left" $viewType={viewType} $variant={variant}>
          {leftPanel}
        </Panel>
      )}
      
      <Panel $area="center" $viewType={viewType} $variant={variant}>
        {centerPanel || children}
      </Panel>
      
      {showRightPanel && rightPanel && (
        <Panel $area="right" $viewType={viewType} $variant={variant}>
          {rightPanel}
        </Panel>
      )}
    </LayoutContainer>
  );
};

export default MainContentLayout; 