import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Button from '@/shared/components/Button';
import TestPlanForm from './TestPlanForm';

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
  const containerRef = useRef<HTMLDivElement>(null);

  // 부드러운 스크롤 효과
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isScrolling) return;
      
      isScrolling = true;
      const delta = e.deltaY;
      const scrollAmount = Math.abs(delta) > 50 ? delta * 0.5 : delta;
      
      container.scrollBy({
        top: scrollAmount,
        behavior: 'smooth'
      });

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 150);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
      clearTimeout(scrollTimeout);
    };
  }, []);

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

  // 탭 데이터
  const tabs = [
    { id: 'overview', label: '개요' },
    { id: 'testplan', label: '테스트 계획' },
    { id: 'execution', label: '실행' },
    { id: 'settings', label: '설정 및 감사' }
  ];

  // KPI 데이터
  const kpiData = [
    { label: '테스트 케이스', value: '1,234', color: '#2563eb' },
    { label: '통과율', value: '87%', color: '#059669' },
    { label: '실패', value: '156', color: '#dc2626' },
    { label: '차단', value: '23', color: '#ea580c' }
  ];

  // 차트 데이터
  const chartData = [
    { title: '일별 진행률', value: '87%', trend: '+2.3%', trendColor: '#059669', type: 'line', data: [65, 70, 75, 80, 85, 87] },
    { title: '결함 분포', value: '156', trend: '-12', trendColor: '#dc2626', type: 'bar', data: [45, 32, 28, 25, 18, 8] },
    { title: '테스트 커버리지', value: '94%', trend: '+1.2%', trendColor: '#059669', type: 'line', data: [88, 90, 92, 93, 94, 94] }
  ];

  // 타임라인 데이터
  const timelineData = [
    { event: '릴리즈 계획', date: '2024-07-01', icon: 'edit' },
    { event: '개발 시작', date: '2024-07-05', icon: 'build' },
    { event: '테스트 계획', date: '2024-07-15', icon: 'edit' },
    { event: '1차 QA', date: '2024-07-20', icon: 'check' },
    { event: '릴리즈', date: '2024-07-31', icon: 'rocket' }
  ];

  return (
    <PageContainer ref={containerRef}>
      {/* 헤더 */}
      <ReleaseHeader>
        <HeaderLeft>
          <BackButton onClick={onBackToList}>
            ← 목록으로
          </BackButton>
          <div>
            <ReleaseTitle>{release.name}</ReleaseTitle>
            <ReleaseMetadata>
              버전 {release.version} • {release.status} • {release.startDate} ~ {release.endDate}
            </ReleaseMetadata>
          </div>
        </HeaderLeft>
        <HeaderRight>
          <OpenExecutionButton>실행 열기</OpenExecutionButton>
        </HeaderRight>
      </ReleaseHeader>

      {/* 진행률 섹션 */}
      <ProgressSection>
        <ProgressLeft>
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

            {/* 추가 콘텐츠 섹션 - 스크롤 테스트용 */}
            <Section>
              <SectionTitle>추가 정보</SectionTitle>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '20px' }}>
                <h4>릴리즈 상세 정보</h4>
                <p>이 섹션은 스크롤이 제대로 작동하는지 확인하기 위한 추가 콘텐츠입니다.</p>
                <p>릴리즈 {release.name}의 상세한 정보와 관련 문서들이 여기에 표시됩니다.</p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '20px' }}>
                <h4>관련 문서</h4>
                <p>릴리즈와 관련된 모든 문서와 참고 자료들이 여기에 나열됩니다.</p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '20px' }}>
                <h4>최종 확인</h4>
                <p>릴리즈 최종 확인 사항들이 여기에 표시됩니다.</p>
              </div>
            </Section>
          </OverviewContent>
        )}

        {activeTab === 'testplan' && (
          <TestPlanForm 
            onSave={(data) => console.log('테스트 계획 저장:', data)}
            onPreview={() => console.log('테스트 계획 미리보기')}
            onExport={() => console.log('테스트 계획 내보내기')}
          />
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
  overflow: hidden;
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
  background: ${({ theme }) => theme.color.surface.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
`;

const ProgressLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ProgressBar = styled.div`
  width: 200px;
  height: 8px;
  background: ${({ theme }) => theme.color.border.primary};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ width: number }>`
  width: ${props => props.width}%;
  height: 100%;
  background: ${({ theme }) => theme.color.primary[600]};
  transition: width 0.3s ease;
`;

const ProgressText = styled.span`
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
`;

const ProgressMetrics = styled.span`
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  color: ${({ theme }) => theme.color.text.secondary};
`;

const ProgressRight = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
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
  background: ${({ theme }) => theme.color.success.main};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.color.success.dark};
  }
`;

const TabNavigation = styled.div`
  display: flex;
  background: ${({ theme }) => theme.color.surface.primary};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme, active }) => active ? theme.color.primary.main : 'transparent'};
  color: ${({ theme, active }) => active ? 'white' : theme.color.text.primary};
  border: none;
  border-bottom: 2px solid ${({ theme, active }) => active ? theme.color.primary.main : 'transparent'};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme, active }) => active ? theme.color.primary.main : theme.color.surface.secondary};
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const OverviewContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  font-weight: ${({ theme }) => theme.typography.heading.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const KPICard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.color.surface.secondary};
  border: 1px solid ${({ theme }) => theme.color.border.primary};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const KPILabel = styled.div`
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  color: ${({ theme }) => theme.color.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const KPIValue = styled.div<{ color: string }>`
  font-size: ${({ theme }) => theme.typography.h2.fontSize};
  font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
  color: ${props => props.color};
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ChartCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.color.surface.secondary};
  border: 1px solid ${({ theme }) => theme.color.border.primary};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ChartTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.subheading.fontSize};
  font-weight: ${({ theme }) => theme.typography.subheading.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0;
`;

const ChartValue = styled.div`
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  font-weight: ${({ theme }) => theme.typography.heading.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
`;

const ChartTrend = styled.div<{ color: string }>`
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  color: ${props => props.color};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ChartVisual = styled.div`
  height: 100px;
  display: flex;
  align-items: end;
  gap: 4px;
`;

const BarChart = styled.div`
  display: flex;
  align-items: end;
  gap: 4px;
  width: 100%;
  height: 100%;
`;

const Bar = styled.div<{ height: number }>`
  flex: 1;
  height: ${props => props.height}%;
  background: ${({ theme }) => theme.color.primary.main};
  border-radius: 2px;
`;

const LineChart = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Line = styled.div`
  width: 100%;
  height: 2px;
  background: ${({ theme }) => theme.color.primary.main};
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
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
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.color.surface.secondary};
  border: 1px solid ${({ theme }) => theme.color.border.primary};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const TimelineIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.color.primary.main};
  color: white;
  border-radius: 50%;
`;

const TimelineContent = styled.div`
  flex: 1;
`;

const TimelineEvent = styled.div`
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  
  span {
    color: ${({ theme }) => theme.color.text.secondary};
    font-weight: normal;
    margin-left: ${({ theme }) => theme.spacing.sm};
  }
`;

const TabContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  
  h3 {
    font-size: ${({ theme }) => theme.typography.heading.fontSize};
    font-weight: ${({ theme }) => theme.typography.heading.fontWeight};
    color: ${({ theme }) => theme.color.text.primary};
    margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  }
  
  p {
    color: ${({ theme }) => theme.color.text.secondary};
    line-height: 1.6;
  }
`;

export default ReleaseDetailPage;
