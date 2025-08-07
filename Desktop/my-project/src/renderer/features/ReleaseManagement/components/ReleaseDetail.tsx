import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Release, ReleaseTestCase, ReleaseIssue, ReleaseChangeLog, ReleaseRetrospective } from '../types';

interface ReleaseDetailProps {
  release: Release;
  onReleaseUpdate: () => void;
}

const DetailContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const DetailHeader = styled.div`
  padding: 9px;
  border-bottom: 1px solid #e5e7eb;
  background: white;
`;

const ReleaseTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
`;

const ReleaseVersion = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-family: 'Monaco', 'Consolas', monospace;
  margin-bottom: 16px;
`;

const HeaderInfo = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
  margin-bottom: 16px;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
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
  gap: 8px;
`;

const AssigneeAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Description = styled.p`
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
`;

const TabContainer = styled.div`
  border-bottom: 1px solid #e5e7eb;
  background: white;
`;

const TabList = styled.div`
  display: flex;
  padding: 0 24px;
`;

const Tab = styled.button<{ isActive: boolean }>`
  padding: 12px 16px;
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.isActive ? '#3b82f6' : '#6b7280'};
  cursor: pointer;
  border-bottom: 2px solid ${props => props.isActive ? '#3b82f6' : 'transparent'};
  transition: all 0.2s;

  &:hover {
    color: ${props => props.isActive ? '#3b82f6' : '#374151'};
  }
`;

const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProgressSection = styled.div`
  margin-bottom: 24px;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  width: ${props => props.progress}%;
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%);
  transition: width 0.3s ease;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ItemCard = styled.div`
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const ItemTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const ItemMeta = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  color: #6b7280;
`;

const ItemDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 8px 0 0 0;
  line-height: 1.5;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
`;

type TabType = 'testplan' | 'overview' | 'testcases' | 'issues' | 'changelogs' | 'retrospectives';

const ReleaseDetail: React.FC<ReleaseDetailProps> = ({ release, onReleaseUpdate }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [testCases, setTestCases] = useState<ReleaseTestCase[]>([]);
  const [issues, setIssues] = useState<ReleaseIssue[]>([]);
  const [changeLogs, setChangeLogs] = useState<ReleaseChangeLog[]>([]);
  const [retrospectives, setRetrospectives] = useState<ReleaseRetrospective[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab !== 'overview') {
      loadTabData(activeTab);
    }
  }, [activeTab, release.id]);

  const loadTabData = async (tab: TabType) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/releases/${release.id}/${tab}`);
      if (response.ok) {
        const data = await response.json();
        switch (tab) {
          case 'testcases':
            setTestCases(data.data || []);
            break;
          case 'issues':
            setIssues(data.data || []);
            break;
          case 'changelogs':
            setChangeLogs(data.data || []);
            break;
          case 'retrospectives':
            setRetrospectives(data.data || []);
            break;
        }
      }
    } catch (error) {
      console.error(`Failed to load ${tab}:`, error);
    } finally {
      setLoading(false);
    }
  };

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
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAssigneeInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const renderOverviewTab = () => (
    <div>
      <StatsGrid>
        <StatCard>
          <StatValue>{release.test_case_count}</StatValue>
          <StatLabel>총 테스트케이스</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{release.passed_count}</StatValue>
          <StatLabel>통과</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{release.failed_count}</StatValue>
          <StatLabel>실패</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{release.blocked_count}</StatValue>
          <StatLabel>차단</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{release.issue_count}</StatValue>
          <StatLabel>총 이슈</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{release.bug_count}</StatValue>
          <StatLabel>버그</StatLabel>
        </StatCard>
      </StatsGrid>

      {release.test_case_count > 0 && (
        <ProgressSection>
          <ProgressLabel>
            <span>테스트 진행률</span>
            <span>{release.progress_percentage}%</span>
          </ProgressLabel>
          <ProgressBar>
            <ProgressFill progress={release.progress_percentage} />
          </ProgressBar>
        </ProgressSection>
      )}

      <div>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          릴리즈 정보
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
          {release.scheduled_date && (
            <div>
              <span style={{ color: '#6b7280' }}>예정일: </span>
              <span>{formatDate(release.scheduled_date)}</span>
            </div>
          )}
          {release.deployed_date && (
            <div>
              <span style={{ color: '#6b7280' }}>배포일: </span>
              <span>{formatDate(release.deployed_date)}</span>
            </div>
          )}
          <div>
            <span style={{ color: '#6b7280' }}>생성일: </span>
            <span>{formatDate(release.created_at)}</span>
          </div>
          <div>
            <span style={{ color: '#6b7280' }}>수정일: </span>
            <span>{formatDate(release.updated_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTestCasesTab = () => {
    if (loading) return <LoadingState>테스트케이스를 불러오는 중...</LoadingState>;
    if (testCases.length === 0) return <EmptyState>테스트케이스가 없습니다.</EmptyState>;

    return (
      <ItemList>
        {testCases.map(testCase => (
          <ItemCard key={testCase.id}>
            <ItemHeader>
              <ItemTitle>{testCase.test_case_name}</ItemTitle>
              <StatusBadge status={testCase.status}>
                {testCase.status}
              </StatusBadge>
            </ItemHeader>
            <ItemMeta>
              {testCase.assignee_name && (
                <span>담당자: {testCase.assignee_name}</span>
              )}
              {testCase.executed_at && (
                <span>실행일: {formatDate(testCase.executed_at)}</span>
              )}
            </ItemMeta>
          </ItemCard>
        ))}
      </ItemList>
    );
  };

  const renderIssuesTab = () => {
    if (loading) return <LoadingState>이슈를 불러오는 중...</LoadingState>;
    if (issues.length === 0) return <EmptyState>이슈가 없습니다.</EmptyState>;

    return (
      <ItemList>
        {issues.map(issue => (
          <ItemCard key={issue.id}>
            <ItemHeader>
              <ItemTitle>{issue.title}</ItemTitle>
              <div style={{ display: 'flex', gap: '8px' }}>
                <StatusBadge status={issue.priority}>
                  {issue.priority}
                </StatusBadge>
                <StatusBadge status={issue.status}>
                  {issue.status}
                </StatusBadge>
              </div>
            </ItemHeader>
            <ItemMeta>
              <span>{issue.type}</span>
              {issue.assignee_name && (
                <span>담당자: {issue.assignee_name}</span>
              )}
              <span>생성일: {formatDate(issue.created_at)}</span>
            </ItemMeta>
            {issue.description && (
              <ItemDescription>{issue.description}</ItemDescription>
            )}
          </ItemCard>
        ))}
      </ItemList>
    );
  };

  const renderChangeLogsTab = () => {
    if (loading) return <LoadingState>변경 로그를 불러오는 중...</LoadingState>;
    if (changeLogs.length === 0) return <EmptyState>변경 로그가 없습니다.</EmptyState>;

    return (
      <ItemList>
        {changeLogs.map(log => (
          <ItemCard key={log.id}>
            <ItemHeader>
              <ItemTitle>{log.title}</ItemTitle>
              <StatusBadge status={log.type}>
                {log.type}
              </StatusBadge>
            </ItemHeader>
            <ItemMeta>
              <span>작성자: {log.author}</span>
              {log.commit_hash && (
                <span>커밋: {log.commit_hash.substring(0, 8)}</span>
              )}
              <span>{formatDate(log.created_at)}</span>
            </ItemMeta>
            {log.description && (
              <ItemDescription>{log.description}</ItemDescription>
            )}
          </ItemCard>
        ))}
      </ItemList>
    );
  };

  const renderRetrospectivesTab = () => {
    if (loading) return <LoadingState>회고를 불러오는 중...</LoadingState>;
    if (retrospectives.length === 0) return <EmptyState>회고가 없습니다.</EmptyState>;

    return (
      <ItemList>
        {retrospectives.map(retro => (
          <ItemCard key={retro.id}>
            <ItemHeader>
              <ItemTitle>{retro.author_name}</ItemTitle>
              <StatusBadge status={retro.type}>
                {retro.type.replace(/_/g, ' ')}
              </StatusBadge>
            </ItemHeader>
            <ItemMeta>
              <span>{formatDate(retro.created_at)}</span>
            </ItemMeta>
            <ItemDescription>{retro.content}</ItemDescription>
          </ItemCard>
        ))}
      </ItemList>
    );
  };

  const renderTestPlanTab = () => (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
        테스트 계획
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ padding: '16px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
            테스트 범위
          </h4>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
            {release.description || '테스트 범위가 정의되지 않았습니다.'}
          </p>
        </div>

        <div style={{ padding: '16px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
            테스트 환경
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
            <div>
              <span style={{ fontWeight: '500', color: '#374151' }}>개발 환경:</span> Dev Server
            </div>
            <div>
              <span style={{ fontWeight: '500', color: '#374151' }}>테스트 환경:</span> QA Server
            </div>
            <div>
              <span style={{ fontWeight: '500', color: '#374151' }}>스테이징 환경:</span> Staging Server
            </div>
          </div>
        </div>

        <div style={{ padding: '16px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
            테스트 일정
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
            {release.scheduled_date && (
              <div>
                <span style={{ fontWeight: '500', color: '#374151' }}>예정일:</span> {formatDate(release.scheduled_date)}
              </div>
            )}
            <div>
              <span style={{ fontWeight: '500', color: '#374151' }}>테스트 기간:</span> 3일
            </div>
            <div>
              <span style={{ fontWeight: '500', color: '#374151' }}>검토 기간:</span> 1일
            </div>
          </div>
        </div>

        <div style={{ padding: '16px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
            테스트 담당자
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
            {release.assignee_name ? (
              <div>
                <span style={{ fontWeight: '500', color: '#374151' }}>담당자:</span> {release.assignee_name}
              </div>
            ) : (
              <div style={{ color: '#9ca3af' }}>담당자가 지정되지 않았습니다.</div>
            )}
            <div>
              <span style={{ fontWeight: '500', color: '#374151' }}>검토자:</span> QA 리드
            </div>
          </div>
        </div>

        <div style={{ padding: '16px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
            테스트 기준
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
            <div>• 모든 테스트케이스 실행 완료</div>
            <div>• 주요 기능 100% 통과</div>
            <div>• 크리티컬 버그 0개</div>
            <div>• 성능 기준 충족</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'testplan':
        return renderTestPlanTab();
      case 'overview':
        return renderOverviewTab();
      case 'testcases':
        return renderTestCasesTab();
      case 'issues':
        return renderIssuesTab();
      case 'changelogs':
        return renderChangeLogsTab();
      case 'retrospectives':
        return renderRetrospectivesTab();
      default:
        return renderTestPlanTab();
    }
  };

  return (
    <DetailContainer>
      <DetailHeader>
        <ReleaseTitle>{release.name}</ReleaseTitle>
        <ReleaseVersion>v{release.version}</ReleaseVersion>
        
        <HeaderInfo>
          <StatusBadge status={release.status}>
            {getStatusLabel(release.status)}
          </StatusBadge>
          
          {release.assignee_name && (
            <AssigneeInfo>
              <AssigneeAvatar>
                {getAssigneeInitials(release.assignee_name)}
              </AssigneeAvatar>
              <span>{release.assignee_name}</span>
            </AssigneeInfo>
          )}
        </HeaderInfo>

        {release.description && (
          <Description>{release.description}</Description>
        )}
      </DetailHeader>

      <TabContainer>
        <TabList>
          <Tab 
            isActive={activeTab === 'testplan'} 
            onClick={() => setActiveTab('testplan')}
          >
            테스트 계획
          </Tab>
          <Tab 
            isActive={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
          >
            개요
          </Tab>
          <Tab 
            isActive={activeTab === 'testcases'} 
            onClick={() => setActiveTab('testcases')}
          >
            테스트케이스 ({release.test_case_count})
          </Tab>
          <Tab 
            isActive={activeTab === 'issues'} 
            onClick={() => setActiveTab('issues')}
          >
            이슈 ({release.issue_count})
          </Tab>
          <Tab 
            isActive={activeTab === 'changelogs'} 
            onClick={() => setActiveTab('changelogs')}
          >
            변경내역
          </Tab>
          <Tab 
            isActive={activeTab === 'retrospectives'} 
            onClick={() => setActiveTab('retrospectives')}
          >
            회고
          </Tab>
        </TabList>
      </TabContainer>

      <TabContent>
        {renderTabContent()}
      </TabContent>
    </DetailContainer>
  );
};

export default ReleaseDetail;