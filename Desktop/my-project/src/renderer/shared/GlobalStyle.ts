import { createGlobalStyle } from 'styled-components';
import { Theme } from './theme';

const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html, body, #root {
    height: 100%;
    background: ${({ theme }) => theme.color.background};
    color: ${({ theme }) => theme.color.text};
    font-family: ${({ theme }) => theme.font.family};
    font-size: ${({ theme }) => theme.font.sizeBase};
    line-height: 1.5;
  }
  ::selection {
    background: ${({ theme }) => theme.color.primary};
    color: #fff;
  }
  a {
    color: ${({ theme }) => theme.color.primary};
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
  button, input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }
`;

export default GlobalStyle; 