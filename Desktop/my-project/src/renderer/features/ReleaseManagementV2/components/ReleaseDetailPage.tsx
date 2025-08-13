import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@/shared/components/Button';

interface ReleaseDetailPageProps {
  release: {
    id: string;
    name: string;
    version: string;
    status: string;
    startDate: string;
    endDate: string;
    progress: number;
    passRate: number;
    blockers: number;
  };
  currentTab: string;
  onBackToList?: () => void;
}

const ReleaseDetailPage: React.FC<ReleaseDetailPageProps> = ({ release, currentTab, onBackToList }) => {
  const [activeTab, setActiveTab] = useState(currentTab);

  // 아이콘 렌더링 함수
  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'edit':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        );
      case 'build':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        );
      case 'check':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        );
      case 'rocket':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        );
    }
  };

  const tabs = [
    { id: 'overview', label: '개요' },
    { id: 'testplan', label: '테스트 계획' },
    { id: 'execution', label: '실행' },
    { id: 'settings', label: '설정 및 감사' }
  ];

  const kpiData = [
    { label: '계획됨', value: '100', color: 'blue' },
    { label: '실행됨', value: '60', color: 'green' },
    { label: '통과', value: '51', color: 'green' },
    { label: '실패', value: '5', color: 'red' },
    { label: '차단됨', value: '2', color: 'orange' },
    { label: '건너뜀', value: '2', color: 'gray' },
    { label: '통과율', value: '85%', color: 'blue' },
    { label: '미해결 결함', value: '10', color: 'red' },
    { label: '자동 커버리지', value: '70%', color: 'purple' }
  ];

  const chartData = [
    {
      title: '상태 분포',
      value: '60/100',
      trend: '+10%',
      trendColor: 'green',
      type: 'bar',
      data: ['통과', '실패', '차단됨', '건너뜀']
    },
    {
      title: '실행 트렌드',
      value: '60%',
      trend: '-5%',
      trendColor: 'red',
      type: 'line',
      data: ['1주차', '2주차', '3주차', '4주차']
    },
    {
      title: '우선순위별 통과/실패',
      value: '85%',
      trend: '+15%',
      trendColor: 'green',
      type: 'bar',
      data: ['높음', '보통', '낮음']
    },
    {
      title: '결함 심각도',
      value: '10',
      trend: '-2%',
      trendColor: 'red',
      type: 'bar',
      data: ['치명적', '주요', '부차적', '사소함']
    },
    {
      title: '이슈 리드타임',
      value: '70%',
      trend: '+8%',
      trendColor: 'green',
      type: 'line',
      data: ['1주차', '2주차', '3주차', '4주차']
    }
  ];

  const timelineData = [
    { event: '테스트 계획', date: '2024-07-15', icon: 'edit' },
    { event: '빌드 1.2.3', date: '2024-07-20', icon: 'build' },
    { event: '빌드 1.2.4', date: '2024-07-25', icon: 'build' },
    { event: '승인', date: '2024-08-01', icon: 'check' },
    { event: '릴리즈 1.2.3', date: '2024-08-05', icon: 'rocket' }
  ];

  return (
    <PageContainer>
      {/* 상단 네비게이션 바 */}


      {/* 릴리즈 헤더 섹션 */}
      <ReleaseHeader>
        <HeaderLeft>
          <BackButton onClick={onBackToList}>
            ← 릴리즈 목록으로
          </BackButton>
          <ReleaseTitle>{release.name}</ReleaseTitle>
          <ReleaseMetadata>
            버전 {release.version} • 상태: {release.status} • 기간: 2024년 3분기
          </ReleaseMetadata>
        </HeaderLeft>
        <HeaderRight>
          <OpenExecutionButton>실행 보드 열기</OpenExecutionButton>
        </HeaderRight>
      </ReleaseHeader>

      {/* 진행률 섹션 */}
      <ProgressSection>
        <ProgressLeft>
          <ProgressLabel>실행됨 / 계획됨</ProgressLabel>
          <ProgressBar>
            <ProgressFill width={release.progress} />
          </ProgressBar>
          <ProgressText>{release.progress}%</ProgressText>
          <ProgressMetrics>
            통과율: {release.passRate}% • 차단: {release.blockers}
          </ProgressMetrics>
        </ProgressLeft>
        <ProgressRight>
          <ActionButton>범위 동기화</ActionButton>
          <ActionButton>보고서</ActionButton>
          <SignOffButton>승인</SignOffButton>
        </ProgressRight>
      </ProgressSection>

      {/* 탭 네비게이션 */}
      <TabNavigation>
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabNavigation>

      {/* 콘텐츠 영역 */}
      <ContentArea>
        {activeTab === 'overview' && (
          <OverviewContent>
            {/* KPI 섹션 */}
            <Section>
              <SectionTitle>주요 성과 지표</SectionTitle>
              <KPIGrid>
                {kpiData.map((kpi, index) => (
                  <KPICard key={index}>
                    <KPILabel>{kpi.label}</KPILabel>
                    <KPIValue color={kpi.color}>{kpi.value}</KPIValue>
                  </KPICard>
                ))}
              </KPIGrid>
            </Section>

            {/* 차트 섹션 */}
            <Section>
              <SectionTitle>차트</SectionTitle>
              <ChartGrid>
                {chartData.map((chart, index) => (
                  <ChartCard key={index}>
                    <ChartHeader>
                      <ChartTitle>{chart.title}</ChartTitle>
                      <ChartValue>{chart.value}</ChartValue>
                    </ChartHeader>
                    <ChartTrend color={chart.trendColor}>
                      {chart.trend}
                    </ChartTrend>
                    <ChartVisual>
                      {chart.type === 'bar' ? (
                        <BarChart>
                          {chart.data.map((item, i) => (
                            <Bar key={i} height={60 + Math.random() * 40} />
                          ))}
                        </BarChart>
                      ) : (
                        <LineChart>
                          <Line />
                        </LineChart>
                      )}
                    </ChartVisual>
                  </ChartCard>
                ))}
              </ChartGrid>
            </Section>

            {/* 타임라인 섹션 */}
            <Section>
              <SectionTitle>타임라인</SectionTitle>
              <TimelineContainer>
                {timelineData.map((item, index) => (
                  <TimelineItem key={index}>
                    <TimelineIcon>{renderIcon(item.icon)}</TimelineIcon>
                    <TimelineContent>
                      <TimelineEvent>{item.event} <span>{item.date}</span></TimelineEvent>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </TimelineContainer>
            </Section>
          </OverviewContent>
        )}

        {activeTab === 'testplan' && (
          <TabContent>
            <h3>테스트 계획</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
              <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <h4>범위</h4>
                <p>테스트 범위 정의 및 요구사항 관리</p>
              </div>
              <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <h4>결함</h4>
                <p>결함 분석 및 우선순위 설정</p>
              </div>
              <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <h4>분석</h4>
                <p>테스트 분석 및 보고서</p>
              </div>
              <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <h4>환경</h4>
                <p>테스트 환경 구성 및 설정</p>
              </div>
              <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <h4>담당자</h4>
                <p>테스트 담당자 배정 및 역할 정의</p>
              </div>
              <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <h4>일정</h4>
                <p>테스트 일정 계획 및 조정</p>
              </div>
              <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <h4>승인</h4>
                <p>테스트 계획 승인 프로세스</p>
              </div>
            </div>
          </TabContent>
        )}

        {activeTab === 'execution' && (
          <TabContent>
            <h3>실행 콘텐츠</h3>
            <p>테스트 실행 세부사항 및 결과가 여기에 표시됩니다.</p>
          </TabContent>
        )}

        {activeTab === 'settings' && (
          <TabContent>
            <h3>설정 및 감사 콘텐츠</h3>
            <p>설정 및 감사 추적이 여기에 표시됩니다.</p>
          </TabContent>
        )}
      </ContentArea>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.color.surface.primary};
`;



const ReleaseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.color.surface.primary};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const HeaderRight = styled.div``;

const BackButton = styled(Button)`
  background: ${({ theme }) => theme.color.surface.primary};
  color: ${({ theme }) => theme.color.text.primary};
  border: 1px solid ${({ theme }) => theme.color.border.primary};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  cursor: pointer;
  margin-right: ${({ theme }) => theme.spacing.md};
  
  &:hover {
    background: ${({ theme }) => theme.color.surface.secondary};
  }
`;

const ReleaseTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.h1.fontSize};
  font-weight: ${({ theme }) => theme.typography.h1.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

const ReleaseMetadata = styled.div`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  color: ${({ theme }) => theme.color.text.secondary};
`;

const OpenExecutionButton = styled(Button)`
  background: ${({ theme }) => theme.color.primary[600]};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.color.primary[700]};
  }
`;

const ProgressSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.color.surface.primary};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
`;

const ProgressLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ProgressRight = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ProgressLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  color: ${({ theme }) => theme.color.text.secondary};
  white-space: nowrap;
`;

const ProgressBar = styled.div`
  width: 200px;
  height: 8px;
  background: ${({ theme }) => theme.color.surface.secondary};
  border-radius: ${({ theme }) => theme.radius.pill};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ width: number }>`
  width: ${props => props.width}%;
  height: 100%;
  background: ${({ theme }) => theme.color.primary[600]};
  border-radius: ${({ theme }) => theme.radius.pill};
  transition: width 0.3s ease;
`;

const ProgressText = styled.span`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  min-width: 40px;
`;

const ProgressMetrics = styled.span`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  color: ${({ theme }) => theme.color.text.secondary};
`;

const ActionButton = styled(Button)`
  background: ${({ theme }) => theme.color.surface.primary};
  color: ${({ theme }) => theme.color.text.primary};
  border: 1px solid ${({ theme }) => theme.color.border.primary};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.color.surface.secondary};
  }
`;

const SignOffButton = styled(Button)`
  background: ${({ theme }) => theme.color.primary[600]};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.color.primary[700]};
  }
`;

const TabNavigation = styled.div`
  display: flex;
  background: ${({ theme }) => theme.color.surface.primary};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
  padding: 0 ${({ theme }) => theme.spacing.xl};
`;

const TabButton = styled.button<{ active?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: transparent;
  border: none;
  color: ${({ theme, active }) => active ? theme.color.primary[600] : theme.color.text.secondary};
  font-weight: ${({ theme, active }) => active ? theme.typography.label.fontWeight : 'normal'};
  cursor: pointer;
  border-bottom: 2px solid ${({ theme, active }) => active ? theme.color.primary[600] : 'transparent'};
  transition: all ${({ theme }) => theme.motion.fast} ease;
  
  &:hover {
    color: ${({ theme }) => theme.color.primary[600]};
  }
`;

const ContentArea = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const OverviewContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Section = styled.div``;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.h2.fontSize};
  font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const KPICard = styled.div`
  background: ${({ theme }) => theme.color.surface.primary};
  border: 1px solid ${({ theme }) => theme.color.border.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.elevation[1]};
`;

const KPILabel = styled.div`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  color: ${({ theme }) => theme.color.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const KPIValue = styled.div<{ color: string }>`
  font-size: ${({ theme }) => theme.typography.h2.fontSize};
  font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
  color: ${({ theme, color }) => {
    switch (color) {
      case 'green': return theme.color.success[600];
      case 'red': return theme.color.danger[600];
      case 'orange': return theme.color.warning[600];
      case 'blue': return theme.color.primary[600];
      case 'purple': return theme.color.secondary[600];
      default: return theme.color.text.primary;
    }
  }};
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ChartCard = styled.div`
  background: ${({ theme }) => theme.color.surface.primary};
  border: 1px solid ${({ theme }) => theme.color.border.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.elevation[1]};
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ChartTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
`;

const ChartValue = styled.div`
  font-size: ${({ theme }) => theme.typography.h3.fontSize};
  font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
`;

const ChartTrend = styled.div<{ color: string }>`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  color: ${({ theme, color }) => color === 'green' ? theme.color.success[600] : theme.color.danger[600]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ChartVisual = styled.div`
  height: 100px;
  display: flex;
  align-items: end;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const BarChart = styled.div`
  display: flex;
  align-items: end;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
  height: 100%;
`;

const Bar = styled.div<{ height: number }>`
  flex: 1;
  height: ${props => props.height}%;
  background: ${({ theme }) => theme.color.surface.secondary};
  border-radius: ${({ theme }) => theme.radius.sm};
  min-height: 20px;
`;

const LineChart = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Line = styled.div`
  width: 100%;
  height: 2px;
  background: ${({ theme }) => theme.color.text.primary};
  position: absolute;
  bottom: 20px;
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: 0;
    width: 100%;
    height: 10px;
    background: linear-gradient(45deg, transparent 30%, ${({ theme }) => theme.color.surface.secondary} 30%, ${({ theme }) => theme.color.surface.secondary} 70%, transparent 70%);
  }
`;

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TimelineItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TimelineIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.color.surface.secondary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color.primary[600]};
  flex-shrink: 0;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const TimelineContent = styled.div``;

const TimelineEvent = styled.div`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  
  span:last-child {
    color: ${({ theme }) => theme.color.text.secondary};
    margin-left: ${({ theme }) => theme.spacing.sm};
  }
`;

const TabContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.color.surface.primary};
  border: 1px solid ${({ theme }) => theme.color.border.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  
  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
    color: ${({ theme }) => theme.color.text.primary};
  }
  
  p {
    color: ${({ theme }) => theme.color.text.secondary};
    margin: 0;
  }
`;

export default ReleaseDetailPage;
