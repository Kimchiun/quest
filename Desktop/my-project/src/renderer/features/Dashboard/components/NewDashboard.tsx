import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import Card from '../../../shared/components/Card';
import Typography from '../../../shared/components/Typography';
import Icon from '../../../shared/components/Icon';
import TestCaseModal, { TestCaseFormData } from '../../TestCaseManagement/components/TestCaseModal';
import { createTestCase } from '../../TestCaseManagement/store/testCaseSlice';

const DashboardContainer = styled.div`
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
`;

const DashboardHeader = styled.div`
  margin-bottom: 32px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled(Card)`
  padding: 24px;
  text-align: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const ActionCard = styled(Card)`
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;

  &:hover {
    border-color: #3b82f6;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }
`;

const ActionIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 12px;
  color: #3b82f6;
`;

const RecentActivitySection = styled.div`
  margin-top: 32px;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8fafc;
  }
`;

const ActivityIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 0.875rem;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 2px;
`;

const ActivityTime = styled.div`
  font-size: 0.75rem;
  color: #64748b;
`;

const NewDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const [isTestCaseModalOpen, setIsTestCaseModalOpen] = useState(false);

  // 실제 데이터는 Redux store에서 가져와야 합니다
  const mockStats = {
    totalTestCases: 1247,
    totalExecutions: 8923,
    totalDefects: 156,
    passRate: 94.2
  };

  const mockRecentActivity = [
    {
      id: 1,
      type: 'execution',
      title: '테스트 케이스 TC-001 실행 완료',
      time: '2분 전',
      icon: '✓'
    },
    {
      id: 2,
      type: 'defect',
      title: '새로운 결함 DEF-089 등록됨',
      time: '15분 전',
      icon: '⚠'
    },
    {
      id: 3,
      type: 'testcase',
      title: '테스트 케이스 TC-045 수정됨',
      time: '1시간 전',
      icon: '✏'
    },
    {
      id: 4,
      type: 'execution',
      title: '테스트 스위트 Regression Suite 실행 시작',
      time: '2시간 전',
      icon: '▶'
    }
  ];

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`);
    
    switch (action) {
      case 'create-testcase':
        console.log('테스트 케이스 생성 모달 열기');
        setIsTestCaseModalOpen(true);
        break;
      case 'start-execution':
        // 테스트 실행 로직
        console.log('테스트 실행 시작');
        break;
      case 'create-defect':
        // 결함 등록 로직
        console.log('결함 등록');
        break;
      case 'view-reports':
        // 보고서 보기 로직
        console.log('보고서 보기');
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  };

  const handleTestCaseSubmit = async (data: TestCaseFormData) => {
    try {
      console.log('테스트 케이스 생성:', data);
      
      // API 호출
      const response = await fetch('/api/testcases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status,
          steps: data.steps,
          expected: data.expectedResult,
          tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          createdBy: 'current-user' // 실제로는 현재 사용자 정보를 사용해야 함
        }),
      });

      if (!response.ok) {
        throw new Error('테스트 케이스 생성에 실패했습니다.');
      }

      const createdTestCase = await response.json();
      
      // 성공 알림
      alert('테스트 케이스가 성공적으로 생성되었습니다!');
      
      // 모달 닫기
      setIsTestCaseModalOpen(false);
    } catch (error) {
      console.error('테스트 케이스 생성 오류:', error);
      alert('테스트 케이스 생성에 실패했습니다.');
    }
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <Typography variant="h1" style={{ marginBottom: '8px' }}>
          Quest 대시보드
        </Typography>
        <Typography variant="body" color="secondary">
          테스트 관리 현황을 한눈에 확인하세요
        </Typography>
      </DashboardHeader>

      {/* 통계 카드 */}
      <StatsGrid>
        <StatCard>
          <StatValue>{mockStats.totalTestCases.toLocaleString()}</StatValue>
          <StatLabel>총 테스트 케이스</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{mockStats.totalExecutions.toLocaleString()}</StatValue>
          <StatLabel>총 실행 횟수</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{mockStats.passRate}%</StatValue>
          <StatLabel>통과율</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{mockStats.totalDefects}</StatValue>
          <StatLabel>활성 결함</StatLabel>
        </StatCard>
      </StatsGrid>

      {/* 빠른 액션 */}
      <Typography variant="h2" style={{ marginBottom: '16px' }}>
        빠른 액션
      </Typography>
      <QuickActionsGrid>
        <ActionCard 
          onClick={() => {
            console.log('테스트 케이스 생성 버튼 클릭됨');
            handleQuickAction('create-testcase');
          }}
          style={{ cursor: 'pointer' }}
        >
          <ActionIcon>➕</ActionIcon>
          <Typography variant="h3" style={{ marginBottom: '4px' }}>
            테스트 케이스 생성
          </Typography>
          <Typography variant="body" color="secondary">
            새로운 테스트 케이스를 작성하세요
          </Typography>
        </ActionCard>
        <ActionCard onClick={() => handleQuickAction('start-execution')}>
          <ActionIcon>▶</ActionIcon>
          <Typography variant="h3" style={{ marginBottom: '4px' }}>
            테스트 실행
          </Typography>
          <Typography variant="body" color="secondary">
            테스트 케이스를 실행하세요
          </Typography>
        </ActionCard>
        <ActionCard onClick={() => handleQuickAction('create-defect')}>
          <ActionIcon>⚠</ActionIcon>
          <Typography variant="h3" style={{ marginBottom: '4px' }}>
            결함 등록
          </Typography>
          <Typography variant="body" color="secondary">
            새로운 결함을 등록하세요
          </Typography>
        </ActionCard>
        <ActionCard onClick={() => handleQuickAction('view-reports')}>
          <ActionIcon>📊</ActionIcon>
          <Typography variant="h3" style={{ marginBottom: '4px' }}>
            보고서 보기
          </Typography>
          <Typography variant="body" color="secondary">
            테스트 결과 보고서를 확인하세요
          </Typography>
        </ActionCard>
      </QuickActionsGrid>

      {/* 최근 활동 */}
      <RecentActivitySection>
        <Typography variant="h2" style={{ marginBottom: '16px' }}>
          최근 활동
        </Typography>
        <ActivityList>
          {mockRecentActivity.map((activity) => (
            <ActivityItem key={activity.id}>
              <ActivityIcon>{activity.icon}</ActivityIcon>
              <ActivityContent>
                <ActivityTitle>{activity.title}</ActivityTitle>
                <ActivityTime>{activity.time}</ActivityTime>
              </ActivityContent>
            </ActivityItem>
          ))}
        </ActivityList>
      </RecentActivitySection>

      {/* 테스트 케이스 생성 모달 */}
      <TestCaseModal
        isOpen={isTestCaseModalOpen}
        onClose={() => setIsTestCaseModalOpen(false)}
        onSubmit={handleTestCaseSubmit}
        mode="create"
      />
    </DashboardContainer>
  );
};

export default NewDashboard; 