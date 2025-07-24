import tokens from './tokens.json';

export const theme = {
  color: tokens.color,
  font: tokens.font,
  radius: tokens.radius,
  spacing: tokens.spacing,
};

export type Theme = typeof theme;

// styled-components DefaultTheme 타입 확장 안내:
// src/renderer/shared/styled.d.ts 파일을 생성하여 아래와 같이 선언하세요.
//
// import 'styled-components';
// import { Theme } from './theme';
//
// declare module 'styled-components' {
//   export interface DefaultTheme extends Theme {}
// } 