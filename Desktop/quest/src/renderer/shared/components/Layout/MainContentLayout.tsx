import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme';

export type ViewType = 'dashboard' | 'list' | 'detail' | 'form';
export type LayoutVariant = 'default' | 'compact' | 'expanded';
export type Density = 'comfortable' | 'compact';

export interface MainContentLayoutProps {
  children: React.ReactNode;
  viewType: ViewType;
  variant?: LayoutVariant;
  density?: Density;
  leftPanel?: React.ReactNode;
  centerPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  showLeftPanel?: boolean;
  showRightPanel?: boolean;
  className?: string;
}

const getLayoutConfig = (viewType: ViewType, variant: LayoutVariant) => {
  const configs = {
    dashboard: {
      default: { left: 'auto-fit', center: '1fr', right: 'auto-fit' },
      compact: { left: 'auto-fit', center: '1fr', right: 'auto-fit' },
      expanded: { left: 'auto-fit', center: '1fr', right: 'auto-fit' }
    },
    list: {
      default: { left: 'auto-fit', center: '1fr', right: 'auto-fit' },
      compact: { left: 'auto-fit', center: '1fr', right: 'auto-fit' },
      expanded: { left: 'auto-fit', center: '1fr', right: 'auto-fit' }
    },
    detail: {
      default: { left: 'auto-fit', center: '1fr', right: 'auto-fit' },
      compact: { left: 'auto-fit', center: '1fr', right: 'auto-fit' },
      expanded: { left: 'auto-fit', center: '1fr', right: 'auto-fit' }
    },
    form: {
      default: { left: '0', center: '1fr', right: '0' },
      compact: { left: '0', center: '1fr', right: '0' },
      expanded: { left: '0', center: '1fr', right: '0' }
    }
  };
  
  return configs[viewType][variant];
};

const LayoutContainer = styled.div<{
  $viewType: ViewType;
  $variant: LayoutVariant;
  $density: Density;
  $showLeftPanel: boolean;
  $showRightPanel: boolean;
}>`
  display: grid;
  height: 100%;
  width: 100%;
  overflow: hidden;
  
  ${({ $viewType, $variant, $density, $showLeftPanel, $showRightPanel, theme }) => {
    const config = getLayoutConfig($viewType, $variant);
    const density = theme.density[$density];
    
    let templateColumns = '';
    
    if ($viewType === 'form') {
      templateColumns = '1fr';
    } else {
      const leftWidth = $showLeftPanel ? 'minmax(240px, auto-fit)' : '0px';
      const rightWidth = $showRightPanel ? 'minmax(280px, auto-fit)' : '0px';
      templateColumns = `${leftWidth} 1fr ${rightWidth}`;
    }
    
    return `
      grid-template-columns: ${templateColumns};
      grid-template-areas: ${$viewType === 'form' ? '"main"' : '"left center right"'};
      gap: ${density.gap};
      
      @media (max-width: ${theme.breakpoint.lg}) {
        grid-template-columns: ${$showLeftPanel ? 'minmax(200px, auto-fit) 1fr' : '1fr'};
        grid-template-areas: ${$showLeftPanel ? '"left center"' : '"center"'};
      }
      
      @media (max-width: ${theme.breakpoint.md}) {
        grid-template-columns: 1fr;
        grid-template-areas: "center";
      }
      
      @media (max-width: ${theme.breakpoint.sm}) {
        grid-template-columns: 1fr;
        grid-template-areas: "center";
        gap: ${theme.gap.tight};
      }
    `;
  }}
  
  transition: grid-template-columns ${({ theme }) => theme.motion.normal} ${({ theme }) => theme.animation.easing.out};
`;

const Panel = styled.div<{
  $area: 'left' | 'center' | 'right';
  $viewType: ViewType;
  $variant: LayoutVariant;
  $density: Density;
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
  
  ${({ $viewType, $variant, $density, theme }) => {
    const density = theme.density[$density];
    
    if ($viewType === 'form') {
      return `
        padding: ${theme.spacing.lg};
        max-width: 800px;
        margin: 0 auto;
        width: 100%;
      `;
    }
    
    return `
      padding: ${density.padding};
      border-radius: ${density.borderRadius};
    `;
  }}
`;

const MainContentLayout: React.FC<MainContentLayoutProps> = ({
  children,
  viewType,
  variant = 'default',
  density = 'comfortable',
  leftPanel,
  centerPanel,
  rightPanel,
  showLeftPanel = true,
  showRightPanel = true,
  className
}) => {
  if (viewType === 'form') {
    return (
      <LayoutContainer
        $viewType={viewType}
        $variant={variant}
        $density={density}
        $showLeftPanel={false}
        $showRightPanel={false}
        className={className}
      >
        <Panel $area="center" $viewType={viewType} $variant={variant} $density={density}>
          {children}
        </Panel>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer
      $viewType={viewType}
      $variant={variant}
      $density={density}
      $showLeftPanel={showLeftPanel}
      $showRightPanel={showRightPanel}
      className={className}
    >
      {showLeftPanel && leftPanel && (
        <Panel $area="left" $viewType={viewType} $variant={variant} $density={density}>
          {leftPanel}
        </Panel>
      )}
      
      <Panel $area="center" $viewType={viewType} $variant={variant} $density={density}>
        {centerPanel || children}
      </Panel>
      
      {showRightPanel && rightPanel && (
        <Panel $area="right" $viewType={viewType} $variant={variant} $density={density}>
          {rightPanel}
        </Panel>
      )}
    </LayoutContainer>
  );
};

export default MainContentLayout; 