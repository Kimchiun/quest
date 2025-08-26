import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@/shared/components/Button';

interface Release {
  id: string;
  name: string;
  version: string;
  status: 'draft' | 'in-progress' | 'testing' | 'ready' | 'released';
  startDate: string;
  endDate: string;
  progress: number;
  passRate: number;
  blockers: number;
  assignee: string;
  folder: string;
  updatedAt: string;
}

interface ReleaseTableViewProps {
  releases: Release[];
  selectedReleases: string[];
  onSelectRelease: (releaseId: string) => void;
  onSelectAll: () => void;
  onViewRelease: (releaseId: string) => void;
  onEditRelease: (releaseId: string) => void;
  onDeleteRelease: (releaseId: string) => void;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}

const TableContainer = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.color.surface.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.elevation[1]};
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.typography.body.fontSize};
`;

const TableHeader = styled.thead`
  background: ${({ theme }) => theme.color.surface.secondary};
`;

const TableBody = styled.tbody``;

const HeaderRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
`;

const DataRow = styled.tr<{ selected: boolean; hovered: boolean }>`
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
  
  &:hover {
    background: ${({ theme, selected }) => 
      selected ? theme.color.primary[100] : theme.color.surface.secondary};
  }
`;

const HeaderCell = styled.th<{ $sortable?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.color.text.secondary};
  cursor: ${({ $sortable }) => $sortable ? 'pointer' : 'default'};
  position: relative;
  white-space: nowrap;
  
  &:hover {
    color: ${({ theme, $sortable }) => $sortable ? theme.color.text.primary : theme.color.text.secondary};
  }
`;

const DataCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
`;

const CheckboxCell = styled(DataCell)`
  width: 40px;
  text-align: center;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const ReleaseName = styled.div`
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
`;

const ReleaseVersion = styled.div`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  color: ${({ theme }) => theme.color.text.tertiary};
`;

const StatusBadge = styled.span<{ $status: Release['status'] }>`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
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
`;

const PeriodText = styled.div`
  color: ${({ theme }) => theme.color.text.primary};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 6px;
  background: ${({ theme }) => theme.color.neutral[200]};
  border-radius: ${({ theme }) => theme.radius.sm};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background: ${({ theme, $progress }) => 
    $progress === 100 ? theme.color.success[500] : theme.color.primary[500]};
  transition: width ${({ theme }) => theme.motion.normal} ease;
`;

const ProgressText = styled.span`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  color: ${({ theme }) => theme.color.text.primary};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  min-width: 30px;
  text-align: right;
`;

const PassRateText = styled.div`
  color: ${({ theme }) => theme.color.text.primary};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
`;

const BlockersText = styled.div`
  color: ${({ theme }) => theme.color.text.primary};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
`;

const ActionCell = styled(DataCell)`
  width: 80px;
  text-align: center;
`;

const ActionButton = styled(Button)`
  min-width: 60px;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
`;

const SortIcon = styled.span<{ $direction: 'asc' | 'desc' }>`
  margin-left: ${({ theme }) => theme.spacing.xs};
  transform: rotate(${({ $direction }) => $direction === 'asc' ? '180deg' : '0deg'});
  transition: transform ${({ theme }) => theme.motion.normal} ease;
`;

const ReleaseTableView: React.FC<ReleaseTableViewProps> = ({
  releases,
  selectedReleases,
  onSelectRelease,
  onSelectAll,
  onViewRelease,
  onEditRelease,
  onDeleteRelease,
  sortBy,
  sortDirection,
  onSort
}) => {
  const [hoveredRelease, setHoveredRelease] = useState<string | null>(null);
  
  const isAllSelected = releases.length > 0 && selectedReleases.length === releases.length;
  const isIndeterminate = selectedReleases.length > 0 && selectedReleases.length < releases.length;

  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  const formatPeriod = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
    const end = new Date(endDate).toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
    return `${start} ~ ${end}`;
  };

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <HeaderRow>
            <HeaderCell>
              <Checkbox
                type="checkbox"
                checked={isAllSelected}
                ref={(input) => {
                  if (input) input.indeterminate = isIndeterminate;
                }}
                onChange={onSelectAll}
              />
            </HeaderCell>
            <HeaderCell $sortable onClick={() => handleSort('name')}>
              Name
              {sortBy === 'name' && <SortIcon $direction={sortDirection || 'asc'}>▼</SortIcon>}
            </HeaderCell>
            <HeaderCell $sortable onClick={() => handleSort('version')}>
              Version
              {sortBy === 'version' && <SortIcon $direction={sortDirection || 'asc'}>▼</SortIcon>}
            </HeaderCell>
            <HeaderCell $sortable onClick={() => handleSort('status')}>
              Status
              {sortBy === 'status' && <SortIcon $direction={sortDirection || 'asc'}>▼</SortIcon>}
            </HeaderCell>
            <HeaderCell $sortable onClick={() => handleSort('startDate')}>
              Period
              {sortBy === 'startDate' && <SortIcon $direction={sortDirection || 'asc'}>▼</SortIcon>}
            </HeaderCell>
            <HeaderCell $sortable onClick={() => handleSort('progress')}>
              Progress
              {sortBy === 'progress' && <SortIcon $direction={sortDirection || 'asc'}>▼</SortIcon>}
            </HeaderCell>
            <HeaderCell $sortable onClick={() => handleSort('passRate')}>
              Pass Rate
              {sortBy === 'passRate' && <SortIcon $direction={sortDirection || 'asc'}>▼</SortIcon>}
            </HeaderCell>
            <HeaderCell $sortable onClick={() => handleSort('blockers')}>
              Blockers
              {sortBy === 'blockers' && <SortIcon $direction={sortDirection || 'asc'}>▼</SortIcon>}
            </HeaderCell>
            <HeaderCell>Actions</HeaderCell>
          </HeaderRow>
        </TableHeader>
        <TableBody>
          {releases.map((release) => (
            <DataRow
              key={release.id}
              selected={selectedReleases.includes(release.id)}
              hovered={hoveredRelease === release.id}
              onMouseEnter={() => setHoveredRelease(release.id)}
              onMouseLeave={() => setHoveredRelease(null)}
              onClick={() => onViewRelease(release.id)}
            >
              <CheckboxCell>
                <Checkbox
                  type="checkbox"
                  checked={selectedReleases.includes(release.id)}
                  onChange={() => onSelectRelease(release.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </CheckboxCell>
              <DataCell>
                <ReleaseName>{release.name}</ReleaseName>
                <ReleaseVersion>{release.version}</ReleaseVersion>
              </DataCell>
              <DataCell>
                <StatusBadge $status={release.status}>
                  {release.status === 'in-progress' ? 'In Progress' : 
                   release.status === 'draft' ? 'Planning' :
                   release.status === 'released' ? 'Completed' :
                   release.status.charAt(0).toUpperCase() + release.status.slice(1)}
                </StatusBadge>
              </DataCell>
              <DataCell>
                <PeriodText>
                  {formatPeriod(release.startDate, release.endDate)}
                </PeriodText>
              </DataCell>
              <DataCell>
                <ProgressContainer>
                  <ProgressBar>
                    <ProgressFill $progress={release.progress} />
                  </ProgressBar>
                  <ProgressText>{release.progress}</ProgressText>
                </ProgressContainer>
              </DataCell>
              <DataCell>
                <PassRateText>{release.passRate}%</PassRateText>
              </DataCell>
              <DataCell>
                <BlockersText>{release.blockers}</BlockersText>
              </DataCell>
              <ActionCell>
                <ActionButton
                  variant="secondary"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewRelease(release.id);
                  }}
                >
                  View
                </ActionButton>
              </ActionCell>
            </DataRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReleaseTableView;
