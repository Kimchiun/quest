import React from 'react';
import MainContentArea, { SectionContainer, SectionHeader } from '../../shared/components/Layout/MainContentArea';
import ProgressWidget from '../../shared/components/Dashboard/ProgressWidget';
import StatsWidget from '../../shared/components/Dashboard/StatsWidget';
import DashboardContainer from './components/DashboardContainer';
import DashboardCharts from './components/DashboardCharts';

const DashboardPage: React.FC = () => {
  // 모의 데이터
  const progressData = [
    {
      completed: 75,
      total: 100,
      label: '테스트 진행률',
      color: '#3b82f6'
    },
    {
      completed: 45,
      total: 60,
      label: '결함 해결률',
      color: '#10b981'
    },
    {
      completed: 12,
      total: 20,
      label: '릴리즈 준비도',
      color: '#f59e0b'
    }
  ];

  const statsData = [
    {
      value: 156,
      label: '총 테스트 케이스',
      icon: '🧪',
      color: '#3b82f6',
      change: 12,
      changeType: 'increase' as const
    },
    {
      value: 23,
      label: '미해결 결함',
      icon: '🐛',
      color: '#ef4444',
      change: -5,
      changeType: 'decrease' as const
    },
    {
      value: 89,
      label: '통과율',
      icon: '✅',
      color: '#10b981',
      format: 'percentage' as const
    },
    {
      value: 4.2,
      label: '평균 해결 시간',
      icon: '⏱️',
      color: '#f59e0b'
    }
  ];

  return (
    <MainContentArea
      pageType="dashboard"
      title="프로젝트 대시보드"
      subtitle="현재 릴리즈의 진행 상황과 주요 지표를 확인하세요"
      showViewModeControl={true}
    >
      <SectionContainer variant="card" spacing="default">
        <SectionHeader level={2}>
          <h2>진행률 요약</h2>
        </SectionHeader>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {progressData.map((data, index) => (
            <ProgressWidget
              key={index}
              data={data}
              variant="circular"
              size="medium"
              onClick={() => console.log(`Progress widget ${index} clicked`)}
            />
          ))}
        </div>
      </SectionContainer>

      <SectionContainer variant="card" spacing="default">
        <SectionHeader level={2}>
          <h2>주요 통계</h2>
        </SectionHeader>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {statsData.map((data, index) => (
            <StatsWidget
              key={index}
              data={data}
              size="medium"
              variant="card"
              onClick={() => console.log(`Stats widget ${index} clicked`)}
            />
          ))}
        </div>
      </SectionContainer>

      <SectionContainer variant="card" spacing="default">
        <SectionHeader level={2}>
          <h2>상세 분석</h2>
        </SectionHeader>
        <DashboardContainer />
      </SectionContainer>

      <SectionContainer variant="card" spacing="default">
        <SectionHeader level={2}>
          <h2>차트 및 그래프</h2>
        </SectionHeader>
        <DashboardCharts />
      </SectionContainer>
    </MainContentArea>
  );
};

export default DashboardPage; 