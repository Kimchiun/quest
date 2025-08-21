import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DashboardCharts from './components/DashboardCharts';

// ===== 전문가용 대시보드 스타일 컴포넌트 =====
const DashboardContainer = styled.div`
  padding: 0;
  background: #f8fafc;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
`;

// 1. 상단 헤드라인 (핵심 지표/트렌드)
const HeadlineSection = styled.div`
  background: white;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
  border: none;
  border-bottom: none;
`;

const HeadlineItem = styled.div<{ trend?: 'up' | 'down' | 'stable' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  
  .value {
    color: ${props => {
      if (props.trend === 'up') return '#059669';
      if (props.trend === 'down') return '#dc2626';
      return '#374151';
    }};
  }
  
  .trend {
    font-size: 12px;
    color: ${props => {
      if (props.trend === 'up') return '#059669';
      if (props.trend === 'down') return '#dc2626';
      return '#6b7280';
    }};
  }
`;

// 2. 필터/검색 바
const FilterSection = styled.div`
  background: white;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  border: none;
  border-bottom: none;
`;

const FilterTab = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: none;
  background: ${props => props.active ? '#3b82f6' : 'transparent'};
  color: ${props => props.active ? 'white' : '#374151'};
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#2563eb' : '#f3f4f6'};
  }
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

// 커스텀 드롭다운 컴포넌트
const CustomDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 140px;
  transition: all 0.2s;
  
  &:hover {
    border-color: #9ca3af;
  }
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const DropdownArrow = styled.span<{ isOpen: boolean }>`
  transition: transform 0.2s;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  font-size: 12px;
  color: #6b7280;
`;

const DropdownOptions = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 1000;
  max-height: ${props => props.isOpen ? '200px' : '0'};
  overflow: hidden;
  transition: all 0.2s ease;
  margin-top: 4px;
`;

const DropdownOption = styled.div<{ isSelected: boolean }>`
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
  color: ${props => props.isSelected ? '#1d4ed8' : '#374151'};
  font-weight: ${props => props.isSelected ? '600' : '400'};
  background: ${props => props.isSelected ? '#eff6ff' : 'transparent'};
  transition: all 0.15s ease;
  
  &:hover {
    background-color: ${props => props.isSelected ? '#dbeafe' : '#f3f4f6'};
  }
  
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

// 3. 메인 컨텐츠 영역
const MainContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 4. 통합 테이블 스타일
const DataTable = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;

const TableHeader = styled.div`
  background: #f9fafb;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TableTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  background: #f9fafb;
  white-space: nowrap;
  cursor: pointer;
  
  &:hover {
    background: #f3f4f6;
  }
`;

const Td = styled.td`
  padding: 12px 16px;
  vertical-align: middle;
`;

const TableRow = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #f9fafb;
  }
`;

// 5. 상태 뱃지 컴포넌트
const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'success': return '#dcfce7';
      case 'warning': return '#fef3c7';
      case 'error': return '#fee2e2';
      case 'info': return '#dbeafe';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'success': return '#166534';
      case 'warning': return '#92400e';
      case 'error': return '#991b1b';
      case 'info': return '#1e40af';
      default: return '#374151';
    }
  }};
`;

// 6. 미니 차트/진행바 컴포넌트
const MiniProgressBar = styled.div<{ percentage: number; color?: string }>`
  width: 60px;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.percentage}%;
    background: ${props => props.color || '#3b82f6'};
    border-radius: 3px;
  }
`;

const TrendIndicator = styled.span<{ trend: 'up' | 'down' | 'stable' }>`
  font-size: 12px;
  margin-left: 4px;
  color: ${props => {
    if (props.trend === 'up') return '#059669';
    if (props.trend === 'down') return '#dc2626';
    return '#6b7280';
  }};
`;

// 7. 이벤트 로그 스타일
const EventLog = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 16px;
`;

const EventItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
  
  &:last-child {
    border-bottom: none;
  }
`;

const EventTime = styled.span`
  color: #6b7280;
  font-size: 12px;
  min-width: 60px;
`;

const EventMessage = styled.span`
  color: #374151;
`;

// 8. 분석 그래프 영역
const AnalyticsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;



// ===== 타입 정의 =====
type TrendType = 'up' | 'down' | 'stable';

// ===== 전문가용 대시보드 컴포넌트 =====
const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('releases');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [assigneeDropdownOpen, setAssigneeDropdownOpen] = useState(false);

  // ===== 전문가용 데이터 구조 =====
  const headlineData: Record<string, { value: number; trend: TrendType; change: number }> = {
    qualityScore: { value: 95, trend: 'up', change: 3 },
    successRate: { value: 92, trend: 'down', change: 1 },
    blockerCount: { value: 2, trend: 'up', change: 1 },
    avgResolutionTime: { value: 18, trend: 'down', change: 3 },
    automationRate: { value: 68, trend: 'stable', change: 0 },
    weeklyDeployments: { value: 2, trend: 'stable', change: 0 }
  };

  const releasesData: any[] = [];

  const issuesData = [
    {
      id: 1,
      name: '결제 오류',
      status: 'blocker',
      priority: 'high',
      assignee: '우승',
      createdAt: '2024-08-05',
      linkedRelease: 'v2.3.0',
      daysOpen: 2,
      isBlocker: true,
      recentComment: '실행 환경: iOS Safari에서 발생'
    },
    {
      id: 2,
      name: '로그인 실패',
      status: 'in_progress',
      priority: 'medium',
      assignee: '태영',
      createdAt: '2024-08-06',
      linkedRelease: 'v2.3.0',
      daysOpen: 1,
      isBlocker: false,
      recentComment: '로그 첨부함'
    },
    {
      id: 3,
      name: 'API 응답 지연',
      status: 'open',
      priority: 'high',
      assignee: '김치운',
      createdAt: '2024-08-04',
      linkedRelease: 'v2.3.0',
      daysOpen: 3,
      isBlocker: false,
      recentComment: '성능 테스트 필요'
    }
  ];

  const testCasesData = [
    {
      id: 1,
      name: '회원가입 API',
      status: 'success',
      priority: 'high',
      assignee: '우승',
      lastExecuted: '2024-08-07 11:20',
      isAutomated: true,
      linkedRelease: 'v2.3.0',
      failCount: 0
    },
    {
      id: 2,
      name: '카드 결제 시나리오',
      status: 'blocker',
      priority: 'high',
      assignee: '김치운',
      lastExecuted: '2024-08-07 09:40',
      isAutomated: false,
      linkedRelease: 'v2.3.0',
      failCount: 3
    },
    {
      id: 3,
      name: '로그인 검증',
      status: 'success',
      priority: 'medium',
      assignee: '태영',
      lastExecuted: '2024-08-07 10:15',
      isAutomated: true,
      linkedRelease: 'v2.3.0',
      failCount: 1
    }
  ];

  const teamPerformanceData = [
    {
      id: 1,
      name: '김치운',
      testExecutions: 16,
      issuesHandled: 8,
      avgResponseTime: 12,
      blockerSolved: 1,
      trend: 'up' as const
    },
    {
      id: 2,
      name: '우승',
      testExecutions: 14,
      issuesHandled: 7,
      avgResponseTime: 15,
      blockerSolved: 1,
      trend: 'stable' as const
    },
    {
      id: 3,
      name: '태영',
      testExecutions: 12,
      issuesHandled: 5,
      avgResponseTime: 18,
      blockerSolved: 0,
      trend: 'down' as const
    }
  ];

  const recentEvents = [
    { time: '09:01', user: '김치운', action: 'Login 테스트 성공' },
    { time: '09:03', user: '우승', action: 'Payment 이슈 Blocker 등록' },
    { time: '09:15', user: '우승', action: 'v2.3.0 배포 성공' },
    { time: '09:30', user: '태영', action: 'API 테스트 실패' },
    { time: '09:45', user: '김치운', action: '자동화 테스트 실행' }
  ];

  // ===== 핸들러 함수들 =====
  const handleRowClick = (type: string, id: number) => {
    console.log(`${type} 상세 진입: ${id}`);
    // TODO: Drill-down 구현
  };

  const handleHeadlineClick = (metric: string) => {
    console.log(`헤드라인 지표 클릭: ${metric}`);
    // TODO: 해당 지표 상세 페이지로 이동
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'completed':
        return 'success';
      case 'testing':
      case 'in_progress':
        return 'info';
      case 'blocker':
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const getAutomationIcon = (isAutomated: boolean) => {
    return isAutomated ? '🤖' : '👤';
  };

  // ===== 렌더링 함수들 =====
  const renderHeadlineSection = () => (
    <HeadlineSection>
      <HeadlineItem trend={headlineData.qualityScore.trend} onClick={() => handleHeadlineClick('quality')}>
        <span>품질점수</span>
        <span className="value">{headlineData.qualityScore.value}</span>
        <span className="trend">({headlineData.qualityScore.trend === 'up' ? '+' : ''}{headlineData.qualityScore.change})</span>
      </HeadlineItem>
      
      <HeadlineItem trend={headlineData.successRate.trend} onClick={() => handleHeadlineClick('success')}>
        <span>전체 성공률</span>
        <span className="value">{headlineData.successRate.value}%</span>
        <span className="trend">({headlineData.successRate.trend === 'up' ? '+' : ''}{headlineData.successRate.change}%)</span>
      </HeadlineItem>
      
      <HeadlineItem trend={headlineData.blockerCount.trend} onClick={() => handleHeadlineClick('blocker')}>
        <span>Blocker</span>
        <span className="value">{headlineData.blockerCount.value}</span>
        <span className="trend">({headlineData.blockerCount.trend === 'up' ? '+' : ''}{headlineData.blockerCount.change})</span>
      </HeadlineItem>
      
      <HeadlineItem trend={headlineData.avgResolutionTime.trend} onClick={() => handleHeadlineClick('resolution')}>
        <span>평균 버그 처리</span>
        <span className="value">{headlineData.avgResolutionTime.value}h</span>
        <span className="trend">({headlineData.avgResolutionTime.trend === 'up' ? '+' : ''}{headlineData.avgResolutionTime.change}h)</span>
      </HeadlineItem>
      
      <HeadlineItem trend={headlineData.automationRate.trend} onClick={() => handleHeadlineClick('automation')}>
        <span>자동화율</span>
        <span className="value">{headlineData.automationRate.value}%</span>
        <span className="trend">({headlineData.automationRate.change === 0 ? '=' : headlineData.automationRate.change > 0 ? '+' : ''}{headlineData.automationRate.change}%)</span>
      </HeadlineItem>
      
      <HeadlineItem trend={headlineData.weeklyDeployments.trend} onClick={() => handleHeadlineClick('deployments')}>
        <span>이번주 배포</span>
        <span className="value">{headlineData.weeklyDeployments.value}건</span>
        <span className="trend">({headlineData.weeklyDeployments.change === 0 ? '=' : headlineData.weeklyDeployments.change > 0 ? '+' : ''}{headlineData.weeklyDeployments.change})</span>
      </HeadlineItem>
    </HeadlineSection>
  );

  const renderFilterSection = () => (
    <FilterSection>
      <div style={{ display: 'flex', gap: '8px' }}>
        <FilterTab active={activeTab === 'releases'} onClick={() => setActiveTab('releases')}>
          릴리즈
        </FilterTab>
        <FilterTab active={activeTab === 'issues'} onClick={() => setActiveTab('issues')}>
          이슈/버그
        </FilterTab>
        <FilterTab active={activeTab === 'tests'} onClick={() => setActiveTab('tests')}>
          테스트케이스
        </FilterTab>
        <FilterTab active={activeTab === 'team'} onClick={() => setActiveTab('team')}>
          팀 성과
        </FilterTab>
      </div>
      
      <SearchInput
        placeholder="검색..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
             <CustomDropdown>
         <DropdownButton 
           onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
           onBlur={() => setTimeout(() => setStatusDropdownOpen(false), 200)}
         >
           <span>상태: {statusFilter === 'all' ? '전체' : 
             statusFilter === 'success' ? '성공' : 
             statusFilter === 'testing' ? '테스트중' : 
             statusFilter === 'blocker' ? 'Blocker' : 
             statusFilter === 'completed' ? '완료' : statusFilter}</span>
           <DropdownArrow isOpen={statusDropdownOpen}>▼</DropdownArrow>
         </DropdownButton>
         <DropdownOptions isOpen={statusDropdownOpen}>
           <DropdownOption 
             isSelected={statusFilter === 'all'} 
             onClick={() => setStatusFilter('all')}
           >
             전체
           </DropdownOption>
           <DropdownOption 
             isSelected={statusFilter === 'success'} 
             onClick={() => setStatusFilter('success')}
           >
             성공
           </DropdownOption>
           <DropdownOption 
             isSelected={statusFilter === 'testing'} 
             onClick={() => setStatusFilter('testing')}
           >
             테스트중
           </DropdownOption>
           <DropdownOption 
             isSelected={statusFilter === 'blocker'} 
             onClick={() => setStatusFilter('blocker')}
           >
             Blocker
           </DropdownOption>
           <DropdownOption 
             isSelected={statusFilter === 'completed'} 
             onClick={() => setStatusFilter('completed')}
           >
             완료
           </DropdownOption>
         </DropdownOptions>
       </CustomDropdown>
       
       <CustomDropdown>
         <DropdownButton 
           onClick={() => setAssigneeDropdownOpen(!assigneeDropdownOpen)}
           onBlur={() => setTimeout(() => setAssigneeDropdownOpen(false), 200)}
         >
           <span>담당자: {assigneeFilter === 'all' ? '전체' : assigneeFilter}</span>
           <DropdownArrow isOpen={assigneeDropdownOpen}>▼</DropdownArrow>
         </DropdownButton>
         <DropdownOptions isOpen={assigneeDropdownOpen}>
           <DropdownOption 
             isSelected={assigneeFilter === 'all'} 
             onClick={() => setAssigneeFilter('all')}
           >
             전체
           </DropdownOption>
           <DropdownOption 
             isSelected={assigneeFilter === '김치운'} 
             onClick={() => setAssigneeFilter('김치운')}
           >
             김치운
           </DropdownOption>
           <DropdownOption 
             isSelected={assigneeFilter === '우승'} 
             onClick={() => setAssigneeFilter('우승')}
           >
             우승
           </DropdownOption>
           <DropdownOption 
             isSelected={assigneeFilter === '태영'} 
             onClick={() => setAssigneeFilter('태영')}
           >
             태영
           </DropdownOption>
         </DropdownOptions>
       </CustomDropdown>
    </FilterSection>
  );

  const renderReleasesTable = () => (
    <DataTable>
      <TableHeader>
        <TableTitle>릴리즈 현황</TableTitle>
      </TableHeader>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>버전</Th>
              <Th>상태</Th>
              <Th>배포일</Th>
              <Th>성공률(%)</Th>
              <Th>Blocker</Th>
              <Th>오픈이슈</Th>
              <Th>커밋/PR</Th>
              <Th>담당자</Th>
              <Th>주요변경점</Th>
            </tr>
          </thead>
          <tbody>
            {releasesData.map((release) => (
              <TableRow key={release.id} onClick={() => handleRowClick('release', release.id)}>
                <Td><strong>{release.version}</strong></Td>
                <Td>
                  <StatusBadge status={getStatusColor(release.status)}>
                    {release.status === 'testing' ? '테스트중' : 
                     release.status === 'completed' ? '완료' : 
                     release.status === 'deployed' ? '배포됨' : release.status}
                  </StatusBadge>
                </Td>
                <Td>{release.deployDate}</Td>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MiniProgressBar percentage={release.successRate} />
                    <span>{release.successRate}%</span>
                                         <TrendIndicator trend={release.trend as 'up' | 'down' | 'stable'}>
                       {release.trend === 'up' ? '▲' : release.trend === 'down' ? '▼' : '='}
                       {release.change}
                     </TrendIndicator>
                  </div>
                </Td>
                <Td>
                  {release.blockerCount > 0 ? (
                    <span style={{ color: '#dc2626', fontWeight: '600' }}>● {release.blockerCount}</span>
                  ) : (
                    <span style={{ color: '#6b7280' }}>-</span>
                  )}
                </Td>
                <Td>{release.openIssues}</Td>
                <Td>{release.commits}</Td>
                <Td>{release.assignee}</Td>
                <Td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {release.majorChanges}
                </Td>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </DataTable>
  );

  const renderIssuesTable = () => (
    <DataTable>
      <TableHeader>
        <TableTitle>이슈/버그 집중 분석</TableTitle>
      </TableHeader>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>이슈명</Th>
              <Th>상태</Th>
              <Th>우선순위</Th>
              <Th>담당자</Th>
              <Th>등록일</Th>
              <Th>릴리즈</Th>
              <Th>미해결일수</Th>
              <Th>Blocker</Th>
              <Th>최근코멘트</Th>
            </tr>
          </thead>
          <tbody>
            {issuesData.map((issue) => (
              <TableRow key={issue.id} onClick={() => handleRowClick('issue', issue.id)}>
                <Td><strong>{issue.name}</strong></Td>
                <Td>
                  <StatusBadge status={getStatusColor(issue.status)}>
                    {issue.status === 'blocker' ? 'Blocker' : 
                     issue.status === 'in_progress' ? '진행' : 
                     issue.status === 'open' ? '오픈' : issue.status}
                  </StatusBadge>
                </Td>
                <Td>
                  <span style={{ marginRight: '4px' }}>{getPriorityIcon(issue.priority)}</span>
                  {issue.priority}
                </Td>
                <Td>{issue.assignee}</Td>
                <Td>{issue.createdAt}</Td>
                <Td>{issue.linkedRelease}</Td>
                <Td>{issue.daysOpen}일</Td>
                <Td>
                  {issue.isBlocker ? (
                    <span style={{ color: '#dc2626', fontWeight: '600' }}>●</span>
                  ) : (
                    <span style={{ color: '#6b7280' }}>-</span>
                  )}
                </Td>
                <Td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {issue.recentComment}
                </Td>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </DataTable>
  );

  const renderTestCasesTable = () => (
    <DataTable>
      <TableHeader>
        <TableTitle>테스트케이스/자동화 품질</TableTitle>
      </TableHeader>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>케이스명</Th>
              <Th>상태</Th>
              <Th>우선순위</Th>
              <Th>담당자</Th>
              <Th>최근실행</Th>
              <Th>자동화여부</Th>
              <Th>연관릴리즈</Th>
              <Th>실패횟수</Th>
              <Th>상세</Th>
            </tr>
          </thead>
          <tbody>
            {testCasesData.map((testCase) => (
              <TableRow key={testCase.id} onClick={() => handleRowClick('testcase', testCase.id)}>
                <Td><strong>{testCase.name}</strong></Td>
                <Td>
                  <StatusBadge status={getStatusColor(testCase.status)}>
                    {testCase.status === 'success' ? '성공' : 
                     testCase.status === 'blocker' ? 'Blocker' : 
                     testCase.status === 'failed' ? '실패' : testCase.status}
                  </StatusBadge>
                </Td>
                <Td>
                  <span style={{ marginRight: '4px' }}>{getPriorityIcon(testCase.priority)}</span>
                  {testCase.priority}
                </Td>
                <Td>{testCase.assignee}</Td>
                <Td>{testCase.lastExecuted}</Td>
                <Td>
                  <span style={{ marginRight: '4px' }}>{getAutomationIcon(testCase.isAutomated)}</span>
                  {testCase.isAutomated ? '자동화' : '수동'}
                </Td>
                <Td>{testCase.linkedRelease}</Td>
                <Td>
                  {testCase.failCount > 0 ? (
                    <span style={{ color: '#dc2626', fontWeight: '600' }}>{testCase.failCount}</span>
                  ) : (
                    <span style={{ color: '#059669' }}>0</span>
                  )}
                </Td>
                <Td>
                  <button style={{ 
                    padding: '4px 8px', 
                    background: '#3b82f6', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}>
                    보기
                  </button>
                </Td>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </DataTable>
  );

  const renderTeamPerformanceTable = () => (
    <DataTable>
      <TableHeader>
        <TableTitle>팀/개인 성과 랭킹</TableTitle>
      </TableHeader>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>담당자</Th>
              <Th>테스트 실행</Th>
              <Th>이슈처리</Th>
              <Th>평균응답시간</Th>
              <Th>Blocker 해결</Th>
              <Th>트렌드</Th>
            </tr>
          </thead>
          <tbody>
            {teamPerformanceData.map((member) => (
              <TableRow key={member.id} onClick={() => handleRowClick('member', member.id)}>
                <Td><strong>{member.name}</strong></Td>
                <Td>{member.testExecutions}</Td>
                <Td>{member.issuesHandled}</Td>
                <Td>{member.avgResponseTime}h</Td>
                <Td>{member.blockerSolved}</Td>
                                 <Td>
                   <TrendIndicator trend={member.trend as 'up' | 'down' | 'stable'}>
                     {member.trend === 'up' ? '▲' : member.trend === 'down' ? '▼' : '='}
                   </TrendIndicator>
                 </Td>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </DataTable>
  );

  const renderAnalyticsSection = () => (
    <AnalyticsSection>
      <DashboardCharts />
    </AnalyticsSection>
  );

  const renderEventLog = () => (
    <EventLog>
      <TableTitle style={{ marginBottom: '16px' }}>최근 이벤트 로그</TableTitle>
      {recentEvents.map((event, index) => (
        <EventItem key={index}>
          <EventTime>{event.time}</EventTime>
          <EventMessage>
            <strong>{event.user}</strong>, {event.action}
          </EventMessage>
        </EventItem>
      ))}
    </EventLog>
  );

  const renderMainTable = () => {
    switch (activeTab) {
      case 'releases':
        return renderReleasesTable();
      case 'issues':
        return renderIssuesTable();
      case 'tests':
        return renderTestCasesTable();
      case 'team':
        return renderTeamPerformanceTable();
      default:
        return renderReleasesTable();
    }
  };

  return (
    <DashboardContainer>
      {renderHeadlineSection()}
      {renderFilterSection()}
      <MainContent>
        {renderMainTable()}
        {renderAnalyticsSection()}
        {renderEventLog()}
      </MainContent>
    </DashboardContainer>
  );
};

export default DashboardPage; 