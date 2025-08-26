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