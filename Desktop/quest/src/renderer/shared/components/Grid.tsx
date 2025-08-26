import React from 'react';
import styled from 'styled-components';

export interface GridProps {
  children: React.ReactNode;
  columns?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: string | { xs?: string; sm?: string; md?: string; lg?: string; xl?: string };
  rowGap?: string;
  columnGap?: string;
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyItems?: 'start' | 'center' | 'end' | 'stretch';
  style?: React.CSSProperties;
  className?: string;
}

const getGridColumns = (columns: GridProps['columns'], theme: any) => {
  if (typeof columns === 'number') {
    return `repeat(${columns}, 1fr)`;
  }
  
  if (typeof columns === 'object') {
    return `
      repeat(${columns.xs || 1}, 1fr);
      @media (min-width: ${theme.breakpoint.sm}) {
        grid-template-columns: repeat(${columns.sm || columns.xs || 1}, 1fr);
      }
      @media (min-width: ${theme.breakpoint.md}) {
        grid-template-columns: repeat(${columns.md || columns.sm || columns.xs || 1}, 1fr);
      }
      @media (min-width: ${theme.breakpoint.lg}) {
        grid-template-columns: repeat(${columns.lg || columns.md || columns.sm || columns.xs || 1}, 1fr);
      }
      @media (min-width: ${theme.breakpoint.xl}) {
        grid-template-columns: repeat(${columns.xl || columns.lg || columns.md || columns.sm || columns.xs || 1}, 1fr);
      }
    `;
  }
  
  return `repeat(${theme.grid.columns}, 1fr)`;
};

const getGridGap = (gap: GridProps['gap'], theme: any) => {
  if (typeof gap === 'string') {
    return gap;
  }
  
  if (typeof gap === 'object') {
    return `
      ${gap.xs || theme.grid.gutter};
      @media (min-width: ${theme.breakpoint.sm}) {
        gap: ${gap.sm || gap.xs || theme.grid.gutter};
      }
      @media (min-width: ${theme.breakpoint.md}) {
        gap: ${gap.md || gap.sm || gap.xs || theme.grid.gutter};
      }
      @media (min-width: ${theme.breakpoint.lg}) {
        gap: ${gap.lg || gap.md || gap.sm || gap.xs || theme.grid.gutter};
      }
      @media (min-width: ${theme.breakpoint.xl}) {
        gap: ${gap.xl || gap.lg || gap.md || gap.sm || gap.xs || theme.grid.gutter};
      }
    `;
  }
  
  return theme.grid.gutter;
};

const GridContainer = styled.div<{
  $columns: GridProps['columns'];
  $gap: GridProps['gap'];
  $rowGap?: string;
  $columnGap?: string;
  $alignItems?: string;
  $justifyItems?: string;
}>`
  display: grid;
  grid-template-columns: ${({ $columns, theme }) => getGridColumns($columns, theme)};
  gap: ${({ $gap, theme }) => getGridGap($gap, theme)};
  row-gap: ${({ $rowGap, theme }) => $rowGap || theme.grid.gutter};
  column-gap: ${({ $columnGap, theme }) => $columnGap || theme.grid.gutter};
  align-items: ${({ $alignItems }) => $alignItems || 'stretch'};
  justify-items: ${({ $justifyItems }) => $justifyItems || 'stretch'};
  
  /* Grid auto-fit for responsive behavior */
  &.auto-fit {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  
  /* Grid auto-fill for fixed column behavior */
  &.auto-fill {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  /* Masonry layout */
  &.masonry {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-auto-rows: 0;
    grid-auto-flow: dense;
  }
`;

const Grid: React.FC<GridProps> = ({ 
  children, 
  columns = 2, 
  gap, 
  rowGap, 
  columnGap,
  alignItems,
  justifyItems,
  style, 
  className 
}) => (
  <GridContainer 
    $columns={columns}
    $gap={gap}
    $rowGap={rowGap}
    $columnGap={columnGap}
    $alignItems={alignItems}
    $justifyItems={justifyItems}
    style={style}
    className={className}
  >
    {children}
  </GridContainer>
);

export default Grid; 