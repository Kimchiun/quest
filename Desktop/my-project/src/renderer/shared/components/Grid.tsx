import React from 'react';
import styled from 'styled-components';

interface GridProps {
  children: React.ReactNode;
  $columns?: number;
  $gap?: string;
  style?: React.CSSProperties;
}

const StyledGrid = styled.div<GridProps>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns || 2}, 1fr);
  gap: ${({ $gap, theme }) => $gap || theme.spacing.md};
`;

const Grid: React.FC<GridProps> = ({ children, $columns = 2, $gap, style }) => (
  <StyledGrid $columns={$columns} $gap={$gap} style={style}>
    {children}
  </StyledGrid>
);

export default Grid; 