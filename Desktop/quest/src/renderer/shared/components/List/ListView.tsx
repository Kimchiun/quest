import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Skeleton } from '../Animation/Skeleton';

interface ListItem {
  id: string;
  [key: string]: any;
}

interface Column {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, item: ListItem) => React.ReactNode;
}

interface ListViewProps {
  items: ListItem[];
  columns: Column[];
  loading?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onItemClick?: (item: ListItem) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  onSearch?: (query: string) => void;
  onFilter?: (filters: Record<string, any>) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  actions?: React.ReactNode;
  emptyMessage?: string;
}

const ListContainer = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

// 상단 컨트롤 바
const ControlBar = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 300px;
  
  @media (max-width: 768px) {
    min-width: auto;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${props => props.active ? '#3b82f6' : '#d1d5db'};
  background: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? '#2563eb' : '#f9fafb'};
  }
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

// 테이블 스타일
const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const TableHeaderCell = styled.th<{ 
  sortable?: boolean;
  width?: string;
}>`
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #e2e8f0;
  width: ${props => props.width || 'auto'};
  cursor: ${props => props.sortable ? 'pointer' : 'default'};
  user-select: none;
  position: relative;
  
  &:hover {
    ${props => props.sortable && `
      background: #f1f5f9;
    `}
  }
  
  &::after {
    content: ${props => props.sortable ? '"↕"' : 'none'};
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    color: #9ca3af;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr<{ 
  selected?: boolean;
  clickable?: boolean;
}>`
  border-bottom: 1px solid #f1f5f9;
  background: ${props => props.selected ? '#eff6ff' : 'white'};
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${props => props.selected ? '#dbeafe' : '#f8fafc'};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 16px 12px;
  font-size: 14px;
  color: #374151;
  vertical-align: top;
`;

const CheckboxCell = styled(TableCell)`
  width: 40px;
  text-align: center;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

// 상태 칩
const StatusChip = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.status.toLowerCase()) {
      case 'pass':
      case 'success':
      case 'completed':
        return '#dcfce7';
      case 'fail':
      case 'error':
      case 'critical':
        return '#fee2e2';
      case 'blocked':
      case 'pending':
        return '#fef3c7';
      case 'untested':
      case 'draft':
        return '#f3f4f6';
      default:
        return '#e0e7ff';
    }
  }};
  color: ${props => {
    switch (props.status.toLowerCase()) {
      case 'pass':
      case 'success':
      case 'completed':
        return '#166534';
      case 'fail':
      case 'error':
      case 'critical':
        return '#dc2626';
      case 'blocked':
      case 'pending':
        return '#d97706';
      case 'untested':
      case 'draft':
        return '#6b7280';
      default:
        return '#3730a3';
    }
  }};
`;

// 페이지네이션
const PaginationContainer = styled.div`
  padding: 20px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const PaginationInfo = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PaginationButton = styled.button<{ disabled?: boolean }>`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  font-size: 14px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #f9fafb;
  }
  
  &:disabled {
    opacity: 0.5;
  }
`;

const PageButton = styled(PaginationButton)<{ active?: boolean }>`
  background: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  border-color: ${props => props.active ? '#3b82f6' : '#d1d5db'};
  
  &:hover:not(:disabled) {
    background: ${props => props.active ? '#2563eb' : '#f9fafb'};
  }
`;

// 빈 상태
const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyMessage = styled.p`
  font-size: 16px;
  margin: 0;
`;

const ListView: React.FC<ListViewProps> = ({
  items,
  columns,
  loading = false,
  searchable = true,
  filterable = true,
  sortable = true,
  selectable = false,
  pagination = true,
  pageSize = 20,
  onItemClick,
  onSelectionChange,
  onSearch,
  onFilter,
  onSort,
  actions,
  emptyMessage = '데이터가 없습니다.'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // 검색 처리
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    onSearch?.(query);
  }, [onSearch]);

  // 정렬 처리
  const handleSort = useCallback((column: string) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newDirection);
    onSort?.(column, newDirection);
  }, [sortColumn, sortDirection, onSort]);

  // 선택 처리
  const handleSelectAll = useCallback((checked: boolean) => {
    const newSelected = checked ? items.map(item => item.id) : [];
    setSelectedItems(newSelected);
    onSelectionChange?.(newSelected);
  }, [items, onSelectionChange]);

  const handleSelectItem = useCallback((id: string, checked: boolean) => {
    const newSelected = checked 
      ? [...selectedItems, id]
      : selectedItems.filter(itemId => itemId !== id);
    setSelectedItems(newSelected);
    onSelectionChange?.(newSelected);
  }, [selectedItems, onSelectionChange]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(items.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = items.slice(startIndex, endIndex);

  // 페이지 버튼 생성
  const getPageButtons = () => {
    const buttons = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      buttons.push(
        <PageButton
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </PageButton>
      );
    }
    return buttons;
  };

  if (loading) {
    return (
      <ListContainer>
        <ControlBar>
          <SearchContainer>
            <SearchInput placeholder="검색..." disabled />
          </SearchContainer>
        </ControlBar>
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                {selectable && <TableHeaderCell width="40px" />}
                {columns.map(column => (
                  <TableHeaderCell key={column.key} width={column.width}>
                    <Skeleton width="100px" height="16px" />
                  </TableHeaderCell>
                ))}
              </tr>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {selectable && (
                    <CheckboxCell>
                      <Skeleton width="16px" height="16px" />
                    </CheckboxCell>
                  )}
                  {columns.map(column => (
                    <TableCell key={column.key}>
                      <Skeleton width="80%" height="16px" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      <ControlBar>
        <SearchContainer>
          {searchable && (
            <SearchInput
              placeholder="검색..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          )}
        </SearchContainer>
        
        {filterable && (
          <FilterContainer>
            <FilterButton active={false}>
              필터
            </FilterButton>
          </FilterContainer>
        )}
        
        {actions && (
          <ActionContainer>
            {actions}
          </ActionContainer>
        )}
      </ControlBar>

      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              {selectable && (
                <TableHeaderCell width="40px">
                  <Checkbox
                    type="checkbox"
                    checked={selectedItems.length === items.length && items.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableHeaderCell>
              )}
              {columns.map(column => (
                <TableHeaderCell
                  key={column.key}
                  sortable={sortable && column.sortable}
                  width={column.width}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  {column.label}
                </TableHeaderCell>
              ))}
            </tr>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)}>
                  <EmptyState>
                    <EmptyIcon>📋</EmptyIcon>
                    <EmptyMessage>{emptyMessage}</EmptyMessage>
                  </EmptyState>
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map(item => (
                <TableRow
                  key={item.id}
                  selected={selectedItems.includes(item.id)}
                  clickable={!!onItemClick}
                  onClick={() => onItemClick?.(item)}
                >
                  {selectable && (
                    <CheckboxCell>
                      <Checkbox
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </CheckboxCell>
                  )}
                  {columns.map(column => (
                    <TableCell key={column.key}>
                      {column.render ? (
                        column.render(item[column.key], item)
                      ) : column.key === 'status' ? (
                        <StatusChip status={item[column.key]}>
                          {item[column.key]}
                        </StatusChip>
                      ) : (
                        item[column.key]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && totalPages > 1 && (
        <PaginationContainer>
          <PaginationInfo>
            {startIndex + 1}-{Math.min(endIndex, items.length)} / {items.length} 항목
          </PaginationInfo>
          <PaginationControls>
            <PaginationButton
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              이전
            </PaginationButton>
            {getPageButtons()}
            <PaginationButton
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              다음
            </PaginationButton>
          </PaginationControls>
        </PaginationContainer>
      )}
    </ListContainer>
  );
};

export default ListView; 