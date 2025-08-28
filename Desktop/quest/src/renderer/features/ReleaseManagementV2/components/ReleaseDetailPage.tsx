import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import TestPlanForm from './TestPlanForm';
import ExecutionView from './ExecutionView';

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
  const [testPlanData, setTestPlanData] = useState(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [testCases, setTestCases] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 기본 스크롤 사용 (커스텀 휠 핸들러 제거)

  // 테스트 계획 저장 함수
  const handleTestPlanSave = async (data: any) => {
    try {
      setSaveStatus('saving');
      
      // 실제 저장 로직 (API 호출 등)
      // 여기서는 시뮬레이션을 위해 setTimeout 사용
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTestPlanData(data);
      setSaveStatus('success');
      
      // 3초 후 상태 초기화
      setTimeout(() => setSaveStatus('idle'), 3000);
      
      console.log('테스트 계획 저장 완료:', data);
    } catch (error) {
      setSaveStatus('error');
      console.error('테스트 계획 저장 실패:', error);
      
      // 3초 후 상태 초기화
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // 테스트 케이스 업데이트 함수
  const handleTestCaseUpdate = (testCaseId: string, updates: any) => {
    console.log('👨‍👦 부모 컴포넌트 테스트 케이스 업데이트:', { testCaseId, updates });
    
    // 로컬 상태 업데이트
    setTestCases(prev => {
      const updated = prev.map(testCase => 
        testCase.id === testCaseId 
          ? { ...testCase, ...updates }
          : testCase
      );
      // console.log('부모 컴포넌트 상태 업데이트 완료');
      
      // 부모에서도 로컬 스토리지에 저장
      const localStorageKey = `testCases_release_${release.id}`;
      try {
        localStorage.setItem(localStorageKey, JSON.stringify(updated));
        // console.log('부모 컴포넌트에서 로컬 스토리지에 저장 완료');
      } catch (error) {
        console.error('부모 컴포넌트 로컬 스토리지 저장 실패:', error);
      }
      
      return updated;
    });
  };

  // 일괄 업데이트 함수
  const handleBulkUpdate = (testCaseIds: string[], updates: any) => {
    console.log('일괄 업데이트:', testCaseIds, updates);
    // TODO: 실제 API 호출로 일괄 업데이트
  };

  // 테스트케이스 추가 함수
  const handleAddTestCases = (newTestCases: any[]) => {
    console.log('테스트케이스 추가:', newTestCases);
    setTestCases(prev => [...prev, ...newTestCases]);
  };

  // API에서 테스트케이스 로드 함수
  const handleTestCasesLoad = (loadedTestCases: any[]) => {
    // console.log('=== API에서 테스트케이스 로드 ===');
    // console.log('로드된 테스트케이스 개수:', loadedTestCases.length);
    setTestCases(loadedTestCases);
  };

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
      

      {/* 탭 네비게이션 - 항상 보임 */}
      <TabNavigation>
        <TabLeft>
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabLeft>
        <TabRight>
          <BackButton onClick={onBackToList}>
            ← 목록으로
          </BackButton>
        </TabRight>
      </TabNavigation>

      {/* 스크롤 가능한 콘텐츠 영역 */}
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
          <>
            {saveStatus === 'saving' && (
              <SaveStatusMessage style={{ color: '#2563eb' }}>
                저장 중...
              </SaveStatusMessage>
            )}
            {saveStatus === 'success' && (
              <SaveStatusMessage style={{ color: '#059669' }}>
                저장 완료!
              </SaveStatusMessage>
            )}
            {saveStatus === 'error' && (
              <SaveStatusMessage style={{ color: '#dc2626' }}>
                저장 실패. 다시 시도해주세요.
              </SaveStatusMessage>
            )}
            <TestPlanForm 
              onSave={handleTestPlanSave}
              onPreview={() => console.log('테스트 계획 미리보기')}
              onExport={() => console.log('테스트 계획 내보내기')}
            />
          </>
        )}

        {activeTab === 'execution' && (
          <ExecutionView
            release={{
              id: release.id,
              name: release.name,
              version: release.version,
              owner: 'John Doe',
              createdAt: release.startDate
            }}
            testCases={testCases}
            onTestCaseUpdate={handleTestCaseUpdate}
            onBulkUpdate={handleBulkUpdate}
            onAddTestCases={handleAddTestCases}
            onTestCasesLoad={handleTestCasesLoad}
          />
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
  height: 100%;
  background: ${({ theme }) => theme.color.surface.primary};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 1280px) {
    height: 100%;
  }
  
  @media (max-width: 768px) {
    height: 100%;
  }
`;









const BackButton = styled.button`
  background: ${({ theme }) => theme.color.surface.primary};
  color: ${({ theme }) => theme.color.text.primary};
  border: 1px solid ${({ theme }) => theme.color.border.primary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  cursor: pointer;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: ${({ theme }) => theme.color.surface.secondary};
  }
`;





const ProgressSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.color.surface.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
  
  @media (max-width: 1440px) {
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  }
  
  @media (max-width: 1280px) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    align-items: stretch;
  }
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;



const TabNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.color.surface.primary};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
  position: sticky;
  top: 0;
  z-index: 999;
  flex-shrink: 0;
  
  @media (max-width: 1280px) {
    flex-direction: column;
    gap: 8px;
    padding: 8px 0;
    align-items: stretch;
  }
  
  @media (max-width: 768px) {
    padding: 4px 0;
  }
`;

const TabLeft = styled.div`
  display: flex;
`;

const TabRight = styled.div`
  display: flex;
  align-items: center;
  padding-right: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 1280px) {
    padding-right: 0;
    justify-content: center;
  }
  
  @media (max-width: 768px) {
    padding-right: 0;
  }
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme, active }) => active ? theme.color.primary[600] : 'transparent'};
  color: ${({ theme, active }) => active ? 'white' : theme.color.text.primary};
  border: none;
  border-bottom: 2px solid ${({ theme, active }) => active ? theme.color.primary[600] : 'transparent'};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme, active }) => active ? theme.color.primary[600] : theme.color.surface.secondary};
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0; // ExecutionView가 자체 패딩을 관리하도록 함
  scroll-behavior: smooth;
  min-height: 0; // flex 축소 허용
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.color.surface.secondary};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color.border.primary};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.color.text.secondary};
  }
`;

const OverviewContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.h2.fontSize};
  font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
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
  font-size: ${({ theme }) => theme.typography.label.fontSize};
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
  font-size: ${({ theme }) => theme.typography.h3.fontSize};
  font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0;
`;

const ChartValue = styled.div`
  font-size: ${({ theme }) => theme.typography.h2.fontSize};
  font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
`;

const ChartTrend = styled.div<{ color: string }>`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
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
  background: ${({ theme }) => theme.color.primary[600]};
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
  background: ${({ theme }) => theme.color.primary[600]};
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
  background: ${({ theme }) => theme.color.primary[600]};
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
    font-size: ${({ theme }) => theme.typography.h3.fontSize};
    font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
    color: ${({ theme }) => theme.color.text.primary};
    margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  }
  
  p {
    color: ${({ theme }) => theme.color.text.secondary};
    line-height: 1.6;
  }
`;

const SaveStatusMessage = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.color.surface.primary};
  border: 1px solid ${({ theme }) => theme.color.border.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  z-index: 10000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

export default ReleaseDetailPage;
