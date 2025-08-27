import { createGlobalStyle } from 'styled-components';
import { Theme } from './theme';

const GlobalStyle = createGlobalStyle`
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

  /* Empty State 전역 규칙 */
  .empty-state-container {
    min-height: auto !important;
    height: auto !important;
    padding-bottom: 0 !important;
    overflow: visible !important;
    margin-bottom: 0 !important;
  }

  .table-empty-state {
    td& {
      padding: 40px 20px !important;
      text-align: center;
      vertical-align: middle;
      
      @media (max-width: 768px) {
        padding: 24px 16px !important;
      }
      
      @media (max-width: 480px) {
        padding: 16px 12px !important;
      }
    }
    
    &.table-container {
      min-height: auto !important;
    }
  }

  .auto-height-container {
    height: auto !important;
    min-height: auto !important;
    
    &.has-data {
      overflow-y: auto;
      max-height: calc(100vh - 200px);
      
      @media (max-width: 768px) {
        max-height: calc(100vh - 150px);
      }
    }
    
    &.no-data {
      overflow: visible !important;
      max-height: none !important;
    }
  }

  .chart-container,
  .graph-container,
  .dashboard-widget {
    min-height: 200px !important;
    
    .empty-state {
      min-height: inherit !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    
    @media (max-width: 768px) {
      min-height: 150px !important;
    }
  }
`;

export default GlobalStyle; 