import React from 'react';
import styled from 'styled-components';
import Icon from '../../../shared/components/Icon';

// 스타일 컴포넌트
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
`;

const CreateButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

const ReleaseListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const ReleaseItem = styled.div<{ isSelected: boolean }>`
  padding: 16px;
  margin-bottom: 8px;
  background: ${props => props.isSelected ? '#eff6ff' : '#ffffff'};
  border: 1px solid ${props => props.isSelected ? '#3b82f6' : '#e5e7eb'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.isSelected ? '#eff6ff' : '#f9fafb'};
    border-color: ${props => props.isSelected ? '#3b82f6' : '#d1d5db'};
  }
`;

const ReleaseName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
`;

const ReleaseVersion = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
`;

const ReleaseStatus = styled.div<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'planning': return '#fef3c7';
      case 'in-progress': return '#dbeafe';
      case 'completed': return '#d1fae5';
      case 'on-hold': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'planning': return '#92400e';
      case 'in-progress': return '#1e40af';
      case 'completed': return '#065f46';
      case 'on-hold': return '#991b1b';
      default: return '#6b7280';
    }
  }};
`;

const ProgressBar = styled.div`
  margin-top: 8px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: #10b981;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
  font-size: 14px;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
  font-size: 14px;
`;

interface Release {
  id: number;
  name: string;
  version?: string;
  description?: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  startDate?: string;
  endDate?: string;
  assignee?: string;
  progress: number;
  totalTestCases: number;
  passedTestCases: number;
  failedTestCases: number;
  notExecutedTestCases: number;
  createdAt: string;
}

interface ReleaseListProps {
  releases: Release[];
  selectedRelease: Release | null;
  onReleaseSelect: (release: Release) => void;
  onCreateRelease: () => void;
  loading: boolean;
}

const getStatusText = (status: string): string => {
  switch (status) {
    case 'planning': return '계획';
    case 'in-progress': return '진행중';
    case 'completed': return '완료';
    case 'on-hold': return '보류';
    default: return '알 수 없음';
  }
};

const getStatusIcon = (status: string): string => {
  switch (status) {
    case 'planning': return '📋';
    case 'in-progress': return '🔄';
    case 'completed': return '✅';
    case 'on-hold': return '⏸️';
    default: return '❓';
  }
};

const ReleaseList: React.FC<ReleaseListProps> = ({
  releases,
  selectedRelease,
  onReleaseSelect,
  onCreateRelease,
  loading
}) => {
  if (loading) {
    return (
      <Container>
        <Header>
          <Title>릴리즈 목록</Title>
          <CreateButton onClick={onCreateRelease}>
            <Icon name="plus" size={16} />
            새 릴리즈
          </CreateButton>
        </Header>
        <LoadingState>로딩 중...</LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>릴리즈 목록</Title>
        <CreateButton onClick={onCreateRelease}>
          <Icon name="plus" size={16} />
          새 릴리즈
        </CreateButton>
      </Header>
      
      <ReleaseListContainer>
        {releases.length === 0 ? (
          <EmptyState>
            <div>아직 릴리즈가 없습니다.</div>
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
              새 릴리즈를 생성해보세요.
            </div>
          </EmptyState>
        ) : (
          releases.map((release) => (
            <ReleaseItem
              key={release.id}
              isSelected={selectedRelease?.id === release.id}
              onClick={() => onReleaseSelect(release)}
            >
              <ReleaseName>{release.name}</ReleaseName>
              {release.version && (
                <ReleaseVersion>v{release.version}</ReleaseVersion>
              )}
              <ReleaseStatus status={release.status}>
                {getStatusIcon(release.status)} {getStatusText(release.status)}
              </ReleaseStatus>
              <ProgressBar>
                <ProgressFill progress={release.progress} />
              </ProgressBar>
            </ReleaseItem>
          ))
        )}
      </ReleaseListContainer>
    </Container>
  );
};

export default ReleaseList; 