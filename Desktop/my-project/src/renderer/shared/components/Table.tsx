import React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from '../theme';

export type TableVariant = 'default' | 'bordered' | 'striped';
export type TableSize = 'sm' | 'md' | 'lg';

export interface TableColumn<T> {
  key: string;
  title: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, rowIndex: number) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  variant?: TableVariant;
  size?: TableSize;
  striped?: boolean;
  bordered?: boolean;
  style?: React.CSSProperties;
}

const sizeStyle = (size: TableSize, theme: Theme) => {
  switch (size) {
    case 'sm': return css`font-size: ${theme.font.sizeSm}; padding: ${theme.spacing.xs} ${theme.spacing.sm};`;
    case 'lg': return css`font-size: ${theme.font.sizeLg}; padding: ${theme.spacing.md} ${theme.spacing.xl};`;
    case 'md':
    default: return css`font-size: ${theme.font.sizeBase}; padding: ${theme.spacing.sm} ${theme.spacing.lg};`;
  }
};

const TableWrap = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const StyledTable = styled.table<{ variant: TableVariant; bordered: boolean; striped: boolean; theme: Theme }>`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.text};
  ${({ bordered, theme }) => bordered && css`border: 1px solid ${theme.color.border};`}
`;

const Th = styled.th<{ size: TableSize; theme: Theme }>`
  background: ${({ theme }) => theme.color.background};
  font-weight: ${({ theme }) => theme.font.weightBold};
  text-align: left;
  ${({ size, theme }) => sizeStyle(size, theme)}
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`;

const Td = styled.td<{ size: TableSize; theme: Theme }>`
  ${({ size, theme }) => sizeStyle(size, theme)}
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`;

const Tr = styled.tr<{ striped: boolean; rowIndex: number; theme: Theme }>`
  ${({ striped, rowIndex, theme }) =>
    striped && rowIndex % 2 === 1 && css`background: ${theme.color.background};`}
`;

function Table<T extends { [key: string]: any }>({ columns, data, variant = 'default', size = 'md', striped = false, bordered = false, style }: TableProps<T>) {
  return (
    <TableWrap style={style}>
      <StyledTable variant={variant} bordered={bordered} striped={striped}>
        <thead>
          <tr>
            {columns.map(col => (
              <Th key={col.key} size={size} style={{ width: col.width, textAlign: col.align }}>{col.title}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <Tr key={rowIndex} striped={striped} rowIndex={rowIndex}>
              {columns.map(col => (
                <Td key={col.key} size={size} style={{ textAlign: col.align }}>
                  {col.render ? col.render(row[col.key], row, rowIndex) : row[col.key]}
                </Td>
              ))}
            </Tr>
          ))}
        </tbody>
      </StyledTable>
    </TableWrap>
  );
}

export default Table; 