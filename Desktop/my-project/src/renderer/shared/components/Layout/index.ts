export { default as GlobalLayout } from './GlobalLayout';
export { default as ResponsiveLayout } from './ResponsiveLayout';
export { LayoutProvider, useLayout } from './LayoutContext';
export { default as withLayout } from './withLayout';
export { default as MainContentArea } from './MainContentArea';
export { default as MainContentLayout } from './MainContentLayout';

// 레이아웃 타입들
export interface LayoutState {
  isNavigationCollapsed: boolean;
  isHeaderVisible: boolean;
  currentSection: string;
}

export interface ResponsiveBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
} 