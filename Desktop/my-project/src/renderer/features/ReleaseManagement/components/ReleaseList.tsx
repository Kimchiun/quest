import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Release } from '../types';

interface ReleaseListProps {
  releases: Release[];
  selectedRelease: Release | null;
  onReleaseSelect: (release: Release) => void;
  searchQuery: string;
  statusFilter: string;
}

const ListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const ReleaseItem = styled.div<{ isSelected: boolean }>`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background-color 0.2s;
  background: ${props => props.isSelected ? '#eff6ff' : 'transparent'};
  border-left: ${props => props.isSelected ? '3px solid #3b82f6' : '3px solid transparent'};

  &:hover {
    background: ${props => props.isSelected ? '#eff6ff' : '#f9fafb'};
  }
`;

const ReleaseHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const ReleaseTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
  margin-bottom: 4px;
`;

const ReleaseVersion = styled.div`
  font-size: 12px;
  color: #6b7280;
  font-family: 'Monaco', 'Consolas', monospace;
`;

const ReleaseInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.status) {
      case 'PLANNING':
        return 'background: #fef3c7; color: #92400e;';
      case 'IN_PROGRESS':
        return 'background: #dbeafe; color: #1e40af;';
      case 'TESTING':
        return 'background: #fde68a; color: #92400e;';
      case 'READY':
        return 'background: #d1fae5; color: #065f46;';
      case 'DEPLOYED':
        return 'background: #dcfce7; color: #166534;';
      case 'COMPLETED':
        return 'background: #e5e7eb; color: #374151;';
      case 'CANCELLED':
        return 'background: #fee2e2; color: #991b1b;';
      default:
        return 'background: #f3f4f6; color: #6b7280;';
    }
  }}
`;

const AssigneeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const AssigneeAvatar = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AssigneeName = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

const ProgressSection = styled.div`
  margin-top: 8px;
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const ProgressLabel = styled.span`
  font-size: 11px;
  color: #6b7280;
`;

const ProgressPercent = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #374151;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  width: ${props => props.progress}%;
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%);
  transition: width 0.3s ease;
`;

const TestStats = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  font-size: 11px;
`;

const StatItem = styled.span<{ type: 'passed' | 'failed' | 'blocked' | 'total' }>`
  color: ${props => {
    switch (props.type) {
      case 'passed': return '#065f46';
      case 'failed': return '#991b1b';
      case 'blocked': return '#92400e';
      default: return '#6b7280';
    }
  }};
`;

const DateInfo = styled.div`
  font-size: 11px;
  color: #6b7280;
  margin-top: 4px;
`;

const ReleaseList: React.FC<ReleaseListProps> = ({
  releases,
  selectedRelease,
  onReleaseSelect,
  searchQuery,
  statusFilter
}) => {
  const filteredReleases = useMemo(() => {
    return releases.filter(release => {
      const matchesSearch = !searchQuery || 
        release.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        release.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (release.assignee_name && release.assignee_name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'ALL' || release.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [releases, searchQuery, statusFilter]);

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      'PLANNING': '계획',
      'IN_PROGRESS': '진행중',
      'TESTING': '테스트',
      'READY': '준비완료',
      'DEPLOYED': '배포됨',
      'COMPLETED': '완료',
      'CANCELLED': '취소됨'
    };
    return statusLabels[status] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getAssigneeInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  if (filteredReleases.length === 0) {
    return (
      <ListContainer>
        <div style={{ 
          padding: '40px 20px', 
          textAlign: 'center', 
          color: '#6b7280',
          fontSize: '14px'
        }}>
          {searchQuery || statusFilter !== 'ALL' 
            ? '검색 조건에 맞는 릴리즈가 없습니다.' 
            : '릴리즈가 없습니다.'}
        </div>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      {filteredReleases.map(release => (
        <ReleaseItem
          key={release.id}
          isSelected={selectedRelease?.id === release.id}
          onClick={() => onReleaseSelect(release)}
        >
          <ReleaseHeader>
            <div style={{ flex: 1 }}>
              <ReleaseTitle>{release.name}</ReleaseTitle>
              <ReleaseVersion>v{release.version}</ReleaseVersion>
            </div>
          </ReleaseHeader>

          <ReleaseInfo>
            <StatusBadge status={release.status}>
              {getStatusLabel(release.status)}
            </StatusBadge>
            
            {release.assignee_name && (
              <AssigneeInfo>
                <AssigneeAvatar>
                  {getAssigneeInitials(release.assignee_name)}
                </AssigneeAvatar>
                <AssigneeName>{release.assignee_name}</AssigneeName>
              </AssigneeInfo>
            )}
          </ReleaseInfo>

          {release.test_case_count > 0 && (
            <ProgressSection>
              <ProgressInfo>
                <ProgressLabel>테스트 진행률</ProgressLabel>
                <ProgressPercent>{release.progress_percentage}%</ProgressPercent>
              </ProgressInfo>
              <ProgressBar>
                <ProgressFill progress={release.progress_percentage} />
              </ProgressBar>
              
              <TestStats>
                <StatItem type="total">
                  총 {release.test_case_count}개
                </StatItem>
                <StatItem type="passed">
                  통과 {release.passed_count}
                </StatItem>
                <StatItem type="failed">
                  실패 {release.failed_count}
                </StatItem>
                {release.blocked_count > 0 && (
                  <StatItem type="blocked">
                    차단 {release.blocked_count}
                  </StatItem>
                )}
              </TestStats>
            </ProgressSection>
          )}

          <DateInfo>
            {release.scheduled_date && (
              <div>예정일: {formatDate(release.scheduled_date)}</div>
            )}
            {release.deployed_date && (
              <div>배포일: {formatDate(release.deployed_date)}</div>
            )}
            {!release.scheduled_date && !release.deployed_date && (
              <div>생성일: {formatDate(release.created_at)}</div>
            )}
          </DateInfo>
        </ReleaseItem>
      ))}
    </ListContainer>
  );
};

export default ReleaseList;