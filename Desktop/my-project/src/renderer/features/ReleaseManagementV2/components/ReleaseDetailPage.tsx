import React, { useState } from 'react';
import styled from 'styled-components';
import ExecutionBoard from './ExecutionBoard';

// 타입 정의
interface Release {
  id: string;
  projectId: string;
  name: string;
  version: string;
  description: string;
  status: 'Draft' | 'Active' | 'Complete' | 'Archived';
  startAt: string;
  endAt: string;
  owners: string[];
  watchers: string[];
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  settings: {
    gateCriteria: {
      minPassRate: number;
      maxFailCritical: number;
      zeroBlockers: boolean;
      coverageByPriority: {
        P0: number;
        P1: number;
        P2: number;
      };
    };
    autoSyncScope: boolean;
    allowReopen: boolean;
  };
}

interface ReleaseDetailPageProps {
  release: Release;
  onBack: () => void;
}

// 스타일 컴포넌트
const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f9fafb;
`;

const Header = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  color: #6b7280;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'Draft': return '#fef3c7';
      case 'Active': return '#dbeafe';
      case 'Complete': return '#d1fae5';
      case 'Archived': return '#f3f4f6';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Draft': return '#92400e';
      case 'Active': return '#1e40af';
      case 'Complete': return '#065f46';
      case 'Archived': return '#6b7280';
      default: return '#6b7280';
    }
  }};
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: 1px solid ${props => props.variant === 'primary' ? '#3b82f6' : '#d1d5db'};
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.variant === 'primary' ? '#3b82f6' : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : '#374151'};

  &:hover {
    background: ${props => props.variant === 'primary' ? '#2563eb' : '#f9fafb'};
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const TabContainer = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 24px;
`;

const TabList = styled.div`
  display: flex;
  gap: 0;
`;

const Tab = styled.button<{ isActive: boolean }>`
  padding: 12px 16px;
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  color: ${props => props.isActive ? '#3b82f6' : '#6b7280'};
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

const TabPanel = styled.div<{ isActive: boolean }>`
  display: ${props => props.isActive ? 'block' : 'none'};
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 16px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.progress}%;
    background: #10b981;
    transition: width 0.3s ease;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 12px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
  color: #374151;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyStateTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
`;

const EmptyStateDescription = styled.p`
  margin: 0;
  font-size: 14px;
`;

const ReleaseDetailPage: React.FC<ReleaseDetailPageProps> = ({
  release,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [testCases, setTestCases] = useState([
    {
      id: '1',
      name: '사용자 로그인 테스트',
      description: '올바른 자격 증명으로 로그인이 성공하는지 확인',
      priority: 'P0' as const,
      status: 'Not Run' as const,
      assignee: 'tester1',
      estimatedTime: 30,
      actualTime: undefined,
      lastUpdated: new Date().toISOString(),
      tags: ['login', 'regression']
    },
    {
      id: '2',
      name: '상품 검색 기능 테스트',
      description: '검색어 입력 시 관련 상품이 올바르게 표시되는지 확인',
      priority: 'P1' as const,
      status: 'In Progress' as const,
      assignee: 'tester2',
      estimatedTime: 45,
      actualTime: 30,
      lastUpdated: new Date().toISOString(),
      tags: ['search', 'ui']
    },
    {
      id: '3',
      name: '결제 프로세스 테스트',
      description: '신용카드 결제가 정상적으로 처리되는지 확인',
      priority: 'P0' as const,
      status: 'Blocked' as const,
      assignee: 'tester1',
      estimatedTime: 60,
      actualTime: undefined,
      lastUpdated: new Date().toISOString(),
      tags: ['payment', 'critical']
    },
    {
      id: '4',
      name: '장바구니 기능 테스트',
      description: '상품을 장바구니에 추가하고 수량을 변경하는 기능 확인',
      priority: 'P2' as const,
      status: 'Passed' as const,
      assignee: 'tester3',
      estimatedTime: 30,
      actualTime: 25,
      lastUpdated: new Date().toISOString(),
      tags: ['cart', 'ui']
    },
    {
      id: '5',
      name: '회원가입 테스트',
      description: '새 사용자 등록 프로세스가 정상적으로 작동하는지 확인',
      priority: 'P1' as const,
      status: 'Failed' as const,
      assignee: 'tester2',
      estimatedTime: 40,
      actualTime: 35,
      lastUpdated: new Date().toISOString(),
      tags: ['registration', 'regression']
    }
  ]);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'scope', label: 'Scope' },
    { id: 'execution', label: 'Execution' },
    { id: 'defects', label: 'Defects' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'environments', label: 'Environments' },
    { id: 'people', label: 'People' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'signoff', label: 'Sign-off' },
    { id: 'settings', label: 'Settings & Audit' }
  ];

  const getProgressPercentage = () => {
    // 임시 계산 로직
    return Math.floor(Math.random() * 100);
  };

  const handleTestCaseUpdate = (testCaseId: string, updates: any) => {
    setTestCases(prev => 
      prev.map(testCase => 
        testCase.id === testCaseId 
          ? { ...testCase, ...updates, lastUpdated: new Date().toISOString() }
          : testCase
      )
    );
  };

  const renderOverviewTab = () => (
    <TabPanel isActive={activeTab === 'overview'}>
      <Grid>
        <StatCard>
          <StatValue>85%</StatValue>
          <StatLabel>통과율</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>127</StatValue>
          <StatLabel>총 테스트 케이스</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>108</StatValue>
          <StatLabel>통과</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>19</StatValue>
          <StatLabel>실패</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>0</StatValue>
          <StatLabel>블로커</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>3</StatValue>
          <StatLabel>Critical</StatLabel>
        </StatCard>
      </Grid>

      <Card>
        <CardTitle>진행 상황</CardTitle>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#374151' }}>전체 진행률</span>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
              {getProgressPercentage()}%
            </span>
          </div>
          <ProgressBar progress={getProgressPercentage()} />
        </div>
      </Card>

      <Card>
        <CardTitle>릴리즈 정보</CardTitle>
        <Table>
          <tbody>
            <tr>
              <TableHeader>이름</TableHeader>
              <TableCell>{release.name}</TableCell>
            </tr>
            <tr>
              <TableHeader>버전</TableHeader>
              <TableCell>{release.version}</TableCell>
            </tr>
            <tr>
              <TableHeader>설명</TableHeader>
              <TableCell>{release.description}</TableCell>
            </tr>
            <tr>
              <TableHeader>상태</TableHeader>
              <TableCell>
                <StatusBadge status={release.status}>
                  {release.status}
                </StatusBadge>
              </TableCell>
            </tr>
            <tr>
              <TableHeader>기간</TableHeader>
              <TableCell>{release.startAt} ~ {release.endAt}</TableCell>
            </tr>
            <tr>
              <TableHeader>생성일</TableHeader>
              <TableCell>{new Date(release.createdAt).toLocaleDateString()}</TableCell>
            </tr>
          </tbody>
        </Table>
      </Card>
    </TabPanel>
  );

  const renderScopeTab = () => (
    <TabPanel isActive={activeTab === 'scope'}>
      <Card>
        <CardTitle>스코프 요약</CardTitle>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          이 릴리즈에 포함된 테스트 케이스들의 개요입니다.
        </p>
        
        <Grid>
          <StatCard>
            <StatValue>127</StatValue>
            <StatLabel>총 테스트 케이스</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>15</StatValue>
            <StatLabel>폴더</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>8</StatValue>
            <StatLabel>태그</StatLabel>
          </StatCard>
        </Grid>

        <EmptyState>
          <EmptyStateIcon>📋</EmptyStateIcon>
          <EmptyStateTitle>스코프 상세 정보</EmptyStateTitle>
          <EmptyStateDescription>
            포함된 테스트 케이스들의 상세 목록이 여기에 표시됩니다.
          </EmptyStateDescription>
        </EmptyState>
      </Card>
    </TabPanel>
  );

  const renderExecutionTab = () => (
    <TabPanel isActive={activeTab === 'execution'}>
      <Card>
        <CardTitle>실행 보드</CardTitle>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          테스트 실행 상태를 관리하는 칼럼형 보드입니다. 드래그 앤 드롭으로 상태를 변경할 수 있습니다.
        </p>
        
        <ExecutionBoard
          testCases={testCases}
          onTestCaseUpdate={handleTestCaseUpdate}
        />
      </Card>
    </TabPanel>
  );

  const renderDefectsTab = () => (
    <TabPanel isActive={activeTab === 'defects'}>
      <Card>
        <CardTitle>결함 관리</CardTitle>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          이 릴리즈와 관련된 결함들을 관리합니다.
        </p>
        
        <EmptyState>
          <EmptyStateIcon>🐛</EmptyStateIcon>
          <EmptyStateTitle>결함 목록</EmptyStateTitle>
          <EmptyStateDescription>
            릴리즈와 연결된 결함들이 여기에 표시됩니다.
          </EmptyStateDescription>
        </EmptyState>
      </Card>
    </TabPanel>
  );

  const renderAnalyticsTab = () => (
    <TabPanel isActive={activeTab === 'analytics'}>
      <Card>
        <CardTitle>분석 및 차트</CardTitle>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          릴리즈 진행 상황에 대한 다양한 차트와 분석을 제공합니다.
        </p>
        
        <EmptyState>
          <EmptyStateIcon>📊</EmptyStateIcon>
          <EmptyStateTitle>분석 차트</EmptyStateTitle>
          <EmptyStateDescription>
            진행률, 통과율, 결함 트렌드 등의 차트가 여기에 표시됩니다.
          </EmptyStateDescription>
        </EmptyState>
      </Card>
    </TabPanel>
  );

  const renderEnvironmentsTab = () => (
    <TabPanel isActive={activeTab === 'environments'}>
      <Card>
        <CardTitle>테스트 환경</CardTitle>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          이 릴리즈에서 사용되는 테스트 환경들을 관리합니다.
        </p>
        
        <EmptyState>
          <EmptyStateIcon>🖥️</EmptyStateIcon>
          <EmptyStateTitle>환경 관리</EmptyStateTitle>
          <EmptyStateDescription>
            Chrome, Firefox, Safari 등의 테스트 환경 정보가 여기에 표시됩니다.
          </EmptyStateDescription>
        </EmptyState>
      </Card>
    </TabPanel>
  );

  const renderPeopleTab = () => (
    <TabPanel isActive={activeTab === 'people'}>
      <Card>
        <CardTitle>담당자 및 관찰자</CardTitle>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          이 릴리즈와 관련된 사람들을 관리합니다.
        </p>
        
        <Table>
          <thead>
            <tr>
              <TableHeader>역할</TableHeader>
              <TableHeader>사용자</TableHeader>
              <TableHeader>이메일</TableHeader>
            </tr>
          </thead>
          <tbody>
            <tr>
              <TableCell>소유자</TableCell>
              <TableCell>{release.owners.join(', ') || '미지정'}</TableCell>
              <TableCell>-</TableCell>
            </tr>
            <tr>
              <TableCell>관찰자</TableCell>
              <TableCell>{release.watchers.join(', ') || '없음'}</TableCell>
              <TableCell>-</TableCell>
            </tr>
          </tbody>
        </Table>
      </Card>
    </TabPanel>
  );

  const renderScheduleTab = () => (
    <TabPanel isActive={activeTab === 'schedule'}>
      <Card>
        <CardTitle>일정 관리</CardTitle>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          릴리즈 일정과 마일스톤을 관리합니다.
        </p>
        
        <EmptyState>
          <EmptyStateIcon>📅</EmptyStateIcon>
          <EmptyStateTitle>일정 및 마일스톤</EmptyStateTitle>
          <EmptyStateDescription>
            릴리즈 일정과 주요 마일스톤이 여기에 표시됩니다.
          </EmptyStateDescription>
        </EmptyState>
      </Card>
    </TabPanel>
  );

  const renderSignoffTab = () => (
    <TabPanel isActive={activeTab === 'signoff'}>
      <Card>
        <CardTitle>사인오프</CardTitle>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          릴리즈 완료를 위한 사인오프 프로세스를 관리합니다.
        </p>
        
        <EmptyState>
          <EmptyStateIcon>✍️</EmptyStateIcon>
          <EmptyStateTitle>사인오프 프로세스</EmptyStateTitle>
          <EmptyStateDescription>
            게이트 기준 충족 여부와 사인오프 상태가 여기에 표시됩니다.
          </EmptyStateDescription>
        </EmptyState>
      </Card>
    </TabPanel>
  );

  const renderSettingsTab = () => (
    <TabPanel isActive={activeTab === 'settings'}>
      <Card>
        <CardTitle>설정 및 감사</CardTitle>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          릴리즈 설정과 변경 이력을 관리합니다.
        </p>
        
        <Table>
          <tbody>
            <tr>
              <TableHeader>게이트 기준</TableHeader>
              <TableCell>
                최소 통과율: {release.settings.gateCriteria.minPassRate}%<br/>
                최대 Critical 실패: {release.settings.gateCriteria.maxFailCritical}<br/>
                Blocker = 0: {release.settings.gateCriteria.zeroBlockers ? '예' : '아니오'}
              </TableCell>
            </tr>
            <tr>
              <TableHeader>자동 동기화</TableHeader>
              <TableCell>{release.settings.autoSyncScope ? '활성화' : '비활성화'}</TableCell>
            </tr>
            <tr>
              <TableHeader>재오픈 허용</TableHeader>
              <TableCell>{release.settings.allowReopen ? '허용' : '금지'}</TableCell>
            </tr>
          </tbody>
        </Table>
      </Card>
    </TabPanel>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'scope':
        return renderScopeTab();
      case 'execution':
        return renderExecutionTab();
      case 'defects':
        return renderDefectsTab();
      case 'analytics':
        return renderAnalyticsTab();
      case 'environments':
        return renderEnvironmentsTab();
      case 'people':
        return renderPeopleTab();
      case 'schedule':
        return renderScheduleTab();
      case 'signoff':
        return renderSignoffTab();
      case 'settings':
        return renderSettingsTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton onClick={onBack}>←</BackButton>
          <HeaderTitle>{release.name}</HeaderTitle>
        </HeaderLeft>
        <HeaderActions>
          <StatusBadge status={release.status}>
            {release.status}
          </StatusBadge>
          <ActionButton variant="secondary">편집</ActionButton>
          <ActionButton variant="primary">실행</ActionButton>
        </HeaderActions>
      </Header>

      <TabContainer>
        <TabList>
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Tab>
          ))}
        </TabList>
      </TabContainer>

      <Content>
        <TabContent>
          {renderTabContent()}
        </TabContent>
      </Content>
    </Container>
  );
};

export default ReleaseDetailPage;
