import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@/shared/components/Button';

// 타입 정의
interface Release {
  id: string;
  name: string;
  version: string;
  status: 'draft' | 'in-progress' | 'testing' | 'ready' | 'released';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  environment: string;
  folder: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  testCases: number;
  passed: number;
  failed: number;
  blocked: number;
  progress: number;
}

interface ReleaseTableViewProps {
  releases: Release[];
  selectedReleases: string[];
  onReleaseSelect: (release: Release) => void;
  onReleaseSelection: (releaseId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onBulkAction: (action: string, releaseIds: string[]) => void;
}

const ReleaseTableView: React.FC<ReleaseTableViewProps> = ({
  releases,
  selectedReleases,
  onReleaseSelect,
  onReleaseSelection,
  onSelectAll,
  onBulkAction
}) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Release>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Release) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedReleases = [...releases].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const allSelected = releases.length > 0 && selectedReleases.length === releases.length;
  const someSelected = selectedReleases.length > 0 && selectedReleases.length < releases.length;

  const getStatusColor = (status: Release['status']) => {
    switch (status) {
      case 'draft': return 'neutral';
      case 'in-progress': return 'primary';
      case 'testing': return 'warning';
      case 'ready': return 'success';
      case 'released': return 'success';
      default: return 'neutral';
    }
  };

  const getPriorityColor = (priority: Release['priority']) => {
    switch (priority) {
      case 'low': return 'neutral';
      case 'medium': return 'primary';
      case 'high': return 'warning';
      case 'critical': return 'danger';
      default: return 'neutral';
    }
  };

  return (
    <TableContainer>
      {selectedReleases.length > 0 && (
        <BulkActionBar>
          <BulkActionInfo>
            {selectedReleases.length}개 선택됨
          </BulkActionInfo>
          <BulkActionButtons>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onBulkAction('status', selectedReleases)}
            >상태 변경</Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onBulkAction('assignee', selectedReleases)}
            >담당자 지정</Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onBulkAction('environment', selectedReleases)}
            >환경 변경</Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onBulkAction('execute', selectedReleases)}
            >실행</Button>
          </BulkActionButtons>
        </BulkActionBar>
      )}
      
      <Table>
        <TableHeader>
          <tr>
            <HeaderCell width="48px" sticky>
              <Checkbox
                type="checkbox"
                checked={allSelected}
                ref={(input) => {
                  if (input) input.indeterminate = someSelected;
                }}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </HeaderCell>
            <HeaderCell 
              width="300px" 
              sticky 
              onClick={() => handleSort('name')}
              $sortable
            >
              릴리즈명
              {sortField === 'name' && (
                <SortIcon $direction={sortDirection}>▼</SortIcon>
              )}
            </HeaderCell>
            <HeaderCell 
              width="120px"
              onClick={() => handleSort('version')}
              $sortable
            >
              버전
              {sortField === 'version' && (
                <SortIcon $direction={sortDirection}>▼</SortIcon>
              )}
            </HeaderCell>
            <HeaderCell 
              width="100px"
              onClick={() => handleSort('status')}
              $sortable
            >
              상태
              {sortField === 'status' && (
                <SortIcon $direction={sortDirection}>▼</SortIcon>
              )}
            </HeaderCell>
            <HeaderCell 
              width="100px"
              onClick={() => handleSort('priority')}
              $sortable
            >
              우선순위
              {sortField === 'priority' && (
                <SortIcon $direction={sortDirection}>▼</SortIcon>
              )}
            </HeaderCell>
            <HeaderCell 
              width="120px"
              onClick={() => handleSort('assignee')}
              $sortable
            >
              담당자
              {sortField === 'assignee' && (
                <SortIcon $direction={sortDirection}>▼</SortIcon>
              )}
            </HeaderCell>
            <HeaderCell 
              width="120px"
              onClick={() => handleSort('environment')}
              $sortable
            >
              환경
              {sortField === 'environment' && (
                <SortIcon $direction={sortDirection}>▼</SortIcon>
              )}
            </HeaderCell>
            <HeaderCell 
              width="150px"
              onClick={() => handleSort('progress')}
              $sortable
            >
              진행률
              {sortField === 'progress' && (
                <SortIcon $direction={sortDirection}>▼</SortIcon>
              )}
            </HeaderCell>
            <HeaderCell 
              width="120px"
              onClick={() => handleSort('updatedAt')}
              $sortable
            >
              수정일
              {sortField === 'updatedAt' && (
                <SortIcon $direction={sortDirection}>▼</SortIcon>
              )}
            </HeaderCell>
            <HeaderCell width="80px">액션</HeaderCell>
          </tr>
        </TableHeader>
        <TableBody>
          {sortedReleases.map((release) => (
            <TableRow
              key={release.id}
              selected={selectedReleases.includes(release.id)}
              hovered={hoveredRow === release.id}
              onMouseEnter={() => setHoveredRow(release.id)}
              onMouseLeave={() => setHoveredRow(null)}
              onClick={() => onReleaseSelect(release)}
            >
              <TableCell sticky>
                <Checkbox
                  type="checkbox"
                  checked={selectedReleases.includes(release.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    onReleaseSelection(release.id, e.target.checked);
                  }}
                />
              </TableCell>
              <TableCell sticky>
                <ReleaseName>{release.name}</ReleaseName>
                <ReleaseFolder>{release.folder}</ReleaseFolder>
              </TableCell>
              <TableCell>
                <VersionBadge>{release.version}</VersionBadge>
              </TableCell>
              <TableCell>
                <StatusBadge $status={release.status}>
                  {release.status}
                </StatusBadge>
              </TableCell>
              <TableCell>
                <PriorityBadge $priority={release.priority}>
                  {release.priority}
                </PriorityBadge>
              </TableCell>
              <TableCell>
                <AssigneeInfo>
                  <AssigneeAvatar>{release.assignee.charAt(0)}</AssigneeAvatar>
                  <AssigneeName>{release.assignee}</AssigneeName>
                </AssigneeInfo>
              </TableCell>
              <TableCell>
                <EnvironmentBadge>{release.environment}</EnvironmentBadge>
              </TableCell>
              <TableCell>
                <ProgressContainer>
                  <ProgressBar $progress={release.progress} />
                  <ProgressText>{release.progress}%</ProgressText>
                </ProgressContainer>
              </TableCell>
              <TableCell>
                <UpdatedDate>{new Date(release.updatedAt).toLocaleDateString()}</UpdatedDate>
              </TableCell>
              <TableCell>
                <ActionButtons>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBulkAction('view', [release.id]);
                    }}
                  >보기</Button>
                </ActionButtons>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {releases.length === 0 && (
        <EmptyState>
          <EmptyIcon>📋</EmptyIcon>
          <EmptyTitle>릴리즈가 없습니다</EmptyTitle>
          <EmptyDescription>
            새 릴리즈를 생성하여 시작하세요.
          </EmptyDescription>
          <Button
            variant="primary"
            size="md"
          >+ 새 릴리즈 만들기</Button>
        </EmptyState>
      )}
    </TableContainer>
  );
};

// Styled Components
const TableContainer = styled.div`
  background: ${({ theme }) => theme.color.surface.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.color.border.primary};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.elevation[1]};
`;

const BulkActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.color.primary[50]};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
`;

const BulkActionInfo = styled.span`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  color: ${({ theme }) => theme.color.text.secondary};
`;

const BulkActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.gap.sm};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.typography.body.fontSize};
`;

const TableHeader = styled.thead`
  background: ${({ theme }) => theme.color.surface.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
  position: sticky;
  top: 0;
  z-index: 2;
`;

const HeaderCell = styled.th<{ 
  width?: string; 
  sticky?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  $sortable?: boolean;
}>`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: ${({ textAlign = 'left' }) => textAlign};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.color.text.secondary};
  background: ${({ theme }) => theme.color.surface.secondary};
  border-right: 1px solid ${({ theme }) => theme.color.border.primary};
  width: ${({ width }) => width || 'auto'};
  min-width: ${({ width }) => width || 'auto'};
  position: ${({ sticky }) => sticky ? 'sticky' : 'static'};
  left: ${({ sticky }) => sticky ? '0' : 'auto'};
  z-index: ${({ sticky }) => sticky ? 3 : 1};
  cursor: ${({ $sortable }) => $sortable ? 'pointer' : 'default'};
  
  &:last-child {
    border-right: none;
  }
  
  &:hover {
    background: ${({ theme, $sortable }) => $sortable ? theme.color.surface.tertiary : theme.color.surface.secondary};
  }
`;

const SortIcon = styled.span<{ $direction: 'asc' | 'desc' }>`
  margin-left: ${({ theme }) => theme.spacing.xs};
  transform: rotate(${({ $direction }) => $direction === 'asc' ? '180deg' : '0deg'});
  transition: transform ${({ theme }) => theme.motion.normal} ease;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr<{ 
  selected: boolean; 
  hovered: boolean;
}>`
  border-bottom: 1px solid ${({ theme }) => theme.color.border.tertiary};
  background: ${({ theme, selected, hovered }) => {
    if (selected) return theme.color.primary[50];
    if (hovered) return theme.color.surface.secondary;
    return theme.color.surface.primary;
  }};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.motion.normal} ease;
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td<{ sticky?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border-right: 1px solid ${({ theme }) => theme.color.border.tertiary};
  position: ${({ sticky }) => sticky ? 'sticky' : 'static'};
  left: ${({ sticky }) => sticky ? '0' : 'auto'};
  background: inherit;
  z-index: ${({ sticky }) => sticky ? 1 : 'auto'};
  
  &:last-child {
    border-right: none;
  }
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const ReleaseName = styled.div`
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ReleaseFolder = styled.div`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  color: ${({ theme }) => theme.color.text.tertiary};
`;

const VersionBadge = styled.span`
  background: ${({ theme }) => theme.color.neutral[100]};
  color: ${({ theme }) => theme.color.neutral[700]};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
`;

const StatusBadge = styled.span<{ $status: Release['status'] }>`
  background: ${({ theme, $status }) => {
    switch ($status) {
      case 'draft': return theme.color.neutral[100];
      case 'in-progress': return theme.color.primary[100];
      case 'testing': return theme.color.warning[100];
      case 'ready': return theme.color.success[100];
      case 'released': return theme.color.success[100];
      default: return theme.color.neutral[100];
    }
  }};
  color: ${({ theme, $status }) => {
    switch ($status) {
      case 'draft': return theme.color.neutral[700];
      case 'in-progress': return theme.color.primary[700];
      case 'testing': return theme.color.warning[700];
      case 'ready': return theme.color.success[700];
      case 'released': return theme.color.success[700];
      default: return theme.color.neutral[700];
    }
  }};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
`;

const PriorityBadge = styled.span<{ $priority: Release['priority'] }>`
  background: ${({ theme, $priority }) => {
    switch ($priority) {
      case 'low': return theme.color.neutral[100];
      case 'medium': return theme.color.primary[100];
      case 'high': return theme.color.warning[100];
      case 'critical': return theme.color.danger[100];
      default: return theme.color.neutral[100];
    }
  }};
  color: ${({ theme, $priority }) => {
    switch ($priority) {
      case 'low': return theme.color.neutral[700];
      case 'medium': return theme.color.primary[700];
      case 'high': return theme.color.warning[700];
      case 'critical': return theme.color.danger[700];
      default: return theme.color.neutral[700];
    }
  }};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
`;

const AssigneeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.gap.sm};
`;

const AssigneeAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.color.primary[500]};
  color: ${({ theme }) => theme.color.text.inverse};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
`;

const AssigneeName = styled.span`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  color: ${({ theme }) => theme.color.text.primary};
`;

const EnvironmentBadge = styled.span`
  background: ${({ theme }) => theme.color.neutral[100]};
  color: ${({ theme }) => theme.color.neutral[700]};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.gap.sm};
`;

const ProgressBar = styled.div<{ $progress: number }>`
  flex: 1;
  height: 6px;
  background: ${({ theme }) => theme.color.neutral[200]};
  border-radius: ${({ theme }) => theme.radius.pill};
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ $progress }) => $progress}%;
    background: ${({ theme, $progress }) => {
      if ($progress >= 100) return theme.color.success[500];
      if ($progress >= 80) return theme.color.primary[500];
      if ($progress >= 50) return theme.color.warning[500];
      return theme.color.neutral[500];
    }};
    transition: width ${({ theme }) => theme.motion.normal} ease;
  }
`;

const ProgressText = styled.span`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  color: ${({ theme }) => theme.color.text.secondary};
  min-width: 40px;
  text-align: right;
`;

const UpdatedDate = styled.span`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  color: ${({ theme }) => theme.color.text.secondary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.gap.xs};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.h3.fontSize};
  font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

const EmptyDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  color: ${({ theme }) => theme.color.text.secondary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

export default ReleaseTableView;
