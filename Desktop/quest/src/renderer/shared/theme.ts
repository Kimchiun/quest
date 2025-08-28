import tokens from './tokens.json';

export const theme = {
  color: tokens.color,
  font: tokens.font,
  radius: tokens.radius,
  spacing: tokens.spacing,
  gap: tokens.gap,
  elevation: tokens.elevation,
  shadow: tokens.shadow,
  typography: tokens.typography,
  motion: tokens.motion,
  density: tokens.density,
  animation: tokens.animation,
  zIndex: tokens.zIndex,
  breakpoint: tokens.breakpoint,
  grid: tokens.grid,
  component: tokens.component,
};

export type Theme = typeof theme;

// Z-Index 계층 구조 상수
export const Z_INDEX = {
  // 기본 레이어 (0-99)
  BASE: 0,
  BACKGROUND: 1,
  CONTENT: 2,
  
  // 컴포넌트 레이어 (100-999)
  CARD: 100,
  BUTTON: 200,
  INPUT: 300,
  TABLE_ROW: 400,
  TABLE_HEADER: 500,
  
  // 오버레이 레이어 (1000-9999)
  DROPDOWN: 1000,
  TOOLTIP: 2000,
  MODAL_BACKDROP: 3000,
  MODAL: 4000,
  SIDEBAR: 5000,
  HEADER: 6000,
  
  // 최상위 레이어 (10000+)
  NOTIFICATION: 10000,
  LOADING: 11000,
  ERROR_BOUNDARY: 12000,
  DEV_TOOLS: 13000,
  
  // 드롭다운 전용 (최우선)
  DROPDOWN_MENU: 99999,
  DROPDOWN_ITEM: 99999,
} as const;