import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

// ===== STYLED COMPONENTS =====

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8fafc;
  overflow: hidden;
`;

// 1. Compact Summary Row
const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 24px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  height: 60px;
  flex-shrink: 0;
`;

const SummaryItem = styled.div<{ variant?: 'success' | 'warning' | 'error' | 'info' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => {
    switch (props.variant) {
      case 'success': return '#f0fdf4';
      case 'warning': return '#fffbeb';
      case 'error': return '#fef2f2';
      case 'info': return '#eff6ff';
      default: return '#f9fafb';
    }
  }};
  border: 1px solid ${props => {
    switch (props.variant) {
      case 'success': return '#bbf7d0';
      case 'warning': return '#fed7aa';
      case 'error': return '#fecaca';
      case 'info': return '#bfdbfe';
      default: return '#e5e7eb';
    }
  }};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const SummaryIcon = styled.span`
  font-size: 16px;
`;

const SummaryValue = styled.span`
  font-weight: 600;
  font-size: 16px;
  color: #1f2937;
`;

const SummaryLabel = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

// 2. Filter Bar
const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  height: 56px;
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  flex: 1;
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

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  min-width: 120px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

// 3. Main Content Area
const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TabContainer = styled.div`
  display: flex;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
`;

const Tab = styled.button<{ isActive: boolean }>`
  padding: 12px 24px;
  border: none;
  background: ${props => props.isActive ? '#3b82f6' : 'transparent'};
  color: ${props => props.isActive ? 'white' : '#6b7280'};
  font-weight: ${props => props.isActive ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.isActive ? '#2563eb' : '#f3f4f6'};
  }
`;

const TableContainer = styled.div`
  flex: 1;
  overflow: auto;
  background: white;
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
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
`;

const TableRow = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f9fafb;
  }
`;

// 4. Inline Visualizations
const ProgressBar = styled.div<{ progress: number; variant?: 'success' | 'warning' | 'error' }>`
  width: 60px;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    width: ${props => props.progress}%;
    height: 100%;
    background: ${props => {
      switch (props.variant) {
        case 'success': return '#10b981';
        case 'warning': return '#f59e0b';
        case 'error': return '#ef4444';
        default: return '#3b82f6';
      }
    }};
    transition: width 0.3s ease;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
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

// 5. Recent Events Log
const EventsLog = styled.div`
  height: 120px;
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 16px 24px;
  overflow-y: auto;
  flex-shrink: 0;
`;

const EventItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  font-size: 12px;
  color: #6b7280;
`;

const EventTime = styled.span`
  color: #9ca3af;
  font-family: monospace;
`;

const EventMessage = styled.span`
  color: #374151;
`;

// ===== MAIN COMPONENT =====

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'releases' | 'testcases' | 'issues' | 'tasks'>('releases');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Mock data - 실제로는 Redux store에서 가져올 데이터
  const summaryData = {
    testSuccessRate: { total: 85, thisWeek: 92, today: 88 },
    openIssues: 23,
    blockerIssues: 3,
    myTasks: { thisWeek: 12, today: 3 },
    upcomingReleases: 2
  };

  const releasesData = [
    {
      id: 1,
      version: 'v2.1.0',
      status: 'testing',
      deployDate: '2024-01-15',
      successRate: 92,
      openIssues: 5,
      blocker: 1,
      assignee: '김개발',
      changes: '로그인 개선, 성능 최적화',
      notes: 'QA 완료 대기'
    },
    {
      id: 2,
      version: 'v2.0.5',
      status: 'deployed',
      deployDate: '2024-01-10',
      successRate: 95,
      openIssues: 2,
      blocker: 0,
      assignee: '박운영',
      changes: '버그 수정',
      notes: '안정적'
    }
  ];

  const testCasesData = [
    {
      id: 1,
      name: '로그인 기능 테스트',
      status: 'passed',
      assignee: '김테스터',
      priority: 'high',
      lastExecuted: '2024-01-12 14:30',
      relatedRelease: 'v2.1.0',
      result: 'success'
    },
    {
      id: 2,
      name: '회원가입 검증',
      status: 'failed',
      assignee: '이테스터',
      priority: 'medium',
      lastExecuted: '2024-01-12 15:45',
      relatedRelease: 'v2.1.0',
      result: 'error'
    }
  ];

  const issuesData = [
    {
      id: 1,
      name: '로그인 시 간헐적 오류',
      status: 'open',
      priority: 'high',
      assignee: '김개발',
      createdDate: '2024-01-12',
      release: 'v2.1.0',
      relatedCase: 'TC-001',
      notes: '재현 어려움'
    },
    {
      id: 2,
      name: 'UI 레이아웃 깨짐',
      status: 'in_progress',
      priority: 'medium',
      assignee: '박디자인',
      createdDate: '2024-01-11',
      release: 'v2.1.0',
      relatedCase: 'TC-015',
      notes: '모바일에서만 발생'
    }
  ];

  const tasksData = [
    {
      id: 1,
      name: '테스트 케이스 리뷰',
      type: 'review',
      status: 'pending',
      dueDate: '2024-01-15',
      priority: 'high',
      link: '/testcases'
    },
    {
      id: 2,
      name: '버그 수정',
      type: 'fix',
      status: 'in_progress',
      dueDate: '2024-01-14',
      priority: 'medium',
      link: '/issues/123'
    }
  ];

  const eventsData = [
    { time: '08:55', user: '우승', action: 'Login 케이스 성공' },
    { time: '08:57', user: '김치운', action: 'v2.1 배포 완료' },
    { time: '09:02', user: '박테스터', action: '회원가입 테스트 실패' },
    { time: '09:15', user: '이개발', action: '버그 #123 수정 완료' },
    { time: '09:30', user: '최운영', action: '서버 점검 시작' }
  ];

  const handleSummaryClick = (type: string) => {
    console.log(`Summary clicked: ${type}`);
    // 실제로는 해당 섹션으로 이동하거나 필터 적용
  };

  const renderTable = () => {
    switch (activeTab) {
      case 'releases':
        return (
          <Table>
            <thead>
              <tr>
                <Th>버전</Th>
                <Th>상태</Th>
                <Th>배포일</Th>
                <Th>성공률</Th>
                <Th>오픈이슈</Th>
                <Th>Blocker</Th>
                <Th>담당자</Th>
                <Th>주요변경점</Th>
                <Th>비고</Th>
              </tr>
            </thead>
            <tbody>
              {releasesData.map(release => (
                <TableRow key={release.id}>
                  <Td>{release.version}</Td>
                  <Td>
                    <StatusBadge status={release.status === 'testing' ? 'warning' : 'success'}>
                      {release.status === 'testing' ? '테스트중' : '배포완료'}
                    </StatusBadge>
                  </Td>
                  <Td>{release.deployDate}</Td>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ProgressBar progress={release.successRate} variant="success" />
                      <span>{release.successRate}%</span>
                    </div>
                  </Td>
                  <Td>{release.openIssues}</Td>
                  <Td>{release.blocker}</Td>
                  <Td>{release.assignee}</Td>
                  <Td>{release.changes}</Td>
                  <Td>{release.notes}</Td>
                </TableRow>
              ))}
            </tbody>
          </Table>
        );

      case 'testcases':
        return (
          <Table>
            <thead>
              <tr>
                <Th>케이스명</Th>
                <Th>상태</Th>
                <Th>담당자</Th>
                <Th>우선순위</Th>
                <Th>최근실행</Th>
                <Th>연관릴리즈</Th>
                <Th>결과</Th>
              </tr>
            </thead>
            <tbody>
              {testCasesData.map(testCase => (
                <TableRow key={testCase.id}>
                  <Td>{testCase.name}</Td>
                  <Td>
                    <StatusBadge status={testCase.status === 'passed' ? 'success' : 'error'}>
                      {testCase.status === 'passed' ? '통과' : '실패'}
                    </StatusBadge>
                  </Td>
                  <Td>{testCase.assignee}</Td>
                  <Td>
                    <StatusBadge status={testCase.priority === 'high' ? 'error' : 'warning'}>
                      {testCase.priority === 'high' ? '높음' : '보통'}
                    </StatusBadge>
                  </Td>
                  <Td>{testCase.lastExecuted}</Td>
                  <Td>{testCase.relatedRelease}</Td>
                  <Td>
                    <StatusBadge status={testCase.result === 'success' ? 'success' : 'error'}>
                      {testCase.result === 'success' ? '성공' : '오류'}
                    </StatusBadge>
                  </Td>
                </TableRow>
              ))}
            </tbody>
          </Table>
        );

      case 'issues':
        return (
          <Table>
            <thead>
              <tr>
                <Th>이슈명</Th>
                <Th>상태</Th>
                <Th>우선순위</Th>
                <Th>담당자</Th>
                <Th>등록일</Th>
                <Th>릴리즈</Th>
                <Th>연관케이스</Th>
                <Th>비고</Th>
              </tr>
            </thead>
            <tbody>
              {issuesData.map(issue => (
                <TableRow key={issue.id}>
                  <Td>{issue.name}</Td>
                  <Td>
                    <StatusBadge status={issue.status === 'open' ? 'error' : 'warning'}>
                      {issue.status === 'open' ? '오픈' : '진행중'}
                    </StatusBadge>
                  </Td>
                  <Td>
                    <StatusBadge status={issue.priority === 'high' ? 'error' : 'warning'}>
                      {issue.priority === 'high' ? '높음' : '보통'}
                    </StatusBadge>
                  </Td>
                  <Td>{issue.assignee}</Td>
                  <Td>{issue.createdDate}</Td>
                  <Td>{issue.release}</Td>
                  <Td>{issue.relatedCase}</Td>
                  <Td>{issue.notes}</Td>
                </TableRow>
              ))}
            </tbody>
          </Table>
        );

      case 'tasks':
        return (
          <Table>
            <thead>
              <tr>
                <Th>업무명</Th>
                <Th>종류</Th>
                <Th>상태</Th>
                <Th>마감일</Th>
                <Th>우선순위</Th>
                <Th>링크</Th>
              </tr>
            </thead>
            <tbody>
              {tasksData.map(task => (
                <TableRow key={task.id}>
                  <Td>{task.name}</Td>
                  <Td>
                    <StatusBadge status="info">
                      {task.type === 'review' ? '리뷰' : '수정'}
                    </StatusBadge>
                  </Td>
                  <Td>
                    <StatusBadge status={task.status === 'pending' ? 'warning' : 'info'}>
                      {task.status === 'pending' ? '대기' : '진행중'}
                    </StatusBadge>
                  </Td>
                  <Td>{task.dueDate}</Td>
                  <Td>
                    <StatusBadge status={task.priority === 'high' ? 'error' : 'warning'}>
                      {task.priority === 'high' ? '높음' : '보통'}
                    </StatusBadge>
                  </Td>
                  <Td>
                    <a href={task.link} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                      바로가기 →
                    </a>
                  </Td>
                </TableRow>
              ))}
            </tbody>
          </Table>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardContainer>
      {/* 1. Compact Summary Row */}
      <SummaryRow>
        <SummaryItem variant="success" onClick={() => handleSummaryClick('test-success')}>
          <SummaryIcon>✅</SummaryIcon>
          <SummaryValue>{summaryData.testSuccessRate.total}%</SummaryValue>
          <SummaryLabel>테스트 성공률</SummaryLabel>
        </SummaryItem>
        
        <SummaryItem variant="error" onClick={() => handleSummaryClick('open-issues')}>
          <SummaryIcon>🐞</SummaryIcon>
          <SummaryValue>{summaryData.openIssues}</SummaryValue>
          <SummaryLabel>오픈 이슈</SummaryLabel>
        </SummaryItem>
        
        <SummaryItem variant="error" onClick={() => handleSummaryClick('blocker-issues')}>
          <SummaryIcon>🚨</SummaryIcon>
          <SummaryValue>{summaryData.blockerIssues}</SummaryValue>
          <SummaryLabel>Blocker</SummaryLabel>
        </SummaryItem>
        
        <SummaryItem variant="info" onClick={() => handleSummaryClick('my-tasks')}>
          <SummaryIcon>📋</SummaryIcon>
          <SummaryValue>{summaryData.myTasks.thisWeek}</SummaryValue>
          <SummaryLabel>내 할 일</SummaryLabel>
        </SummaryItem>
        
        <SummaryItem variant="warning" onClick={() => handleSummaryClick('upcoming-releases')}>
          <SummaryIcon>🚀</SummaryIcon>
          <SummaryValue>{summaryData.upcomingReleases}</SummaryValue>
          <SummaryLabel>예정 릴리즈</SummaryLabel>
        </SummaryItem>
      </SummaryRow>

      {/* 2. Filter Bar */}
      <FilterBar>
        <SearchInput
          placeholder="이름, 담당자 등으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <FilterSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">모든 상태</option>
          <option value="success">성공</option>
          <option value="error">실패</option>
          <option value="warning">경고</option>
        </FilterSelect>
        
        <FilterSelect value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">모든 우선순위</option>
          <option value="high">높음</option>
          <option value="medium">보통</option>
          <option value="low">낮음</option>
        </FilterSelect>
      </FilterBar>

      {/* 3. Main Content Area */}
      <MainContent>
        <TabContainer>
          <Tab isActive={activeTab === 'releases'} onClick={() => setActiveTab('releases')}>
            릴리즈
          </Tab>
          <Tab isActive={activeTab === 'testcases'} onClick={() => setActiveTab('testcases')}>
            테스트케이스
          </Tab>
          <Tab isActive={activeTab === 'issues'} onClick={() => setActiveTab('issues')}>
            이슈/버그
          </Tab>
          <Tab isActive={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')}>
            내 할 일
          </Tab>
        </TabContainer>
        
        <TableContainer>
          {renderTable()}
        </TableContainer>
      </MainContent>

      {/* 4. Recent Events Log */}
      <EventsLog>
        {eventsData.map((event, index) => (
          <EventItem key={index}>
            <EventTime>[{event.time}]</EventTime>
            <EventMessage>{event.user}, '{event.action}'</EventMessage>
          </EventItem>
        ))}
      </EventsLog>
    </DashboardContainer>
  );
};

export default DashboardPage; 