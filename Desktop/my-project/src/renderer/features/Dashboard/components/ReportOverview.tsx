import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from '../../../utils/axios';

interface ReportData {
  progress: {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
  };
  defects: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
  trends: {
    testCasesCompleted: number[];
    defectsFound: number[];
    dates: string[];
  };
}

interface Props {
  releaseId: string;
  reports: ReportData;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e2e8f0;
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  padding: 16px;
  border-radius: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 8px;
`;

const ProgressFill = styled.div<{ percentage: number; color: string }>`
  height: 100%;
  width: ${({ percentage }) => percentage}%;
  background: ${({ color }) => color};
  transition: width 0.3s ease;
`;

const ChartContainer = styled.div`
  height: 200px;
  background: #f8fafc;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 14px;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  color: #64748b;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #ef4444;
`;

const ReportOverview: React.FC<Props> = ({ releaseId, reports }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (releaseId) {
      loadReportData();
    }
  }, [releaseId]);

  const loadReportData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await axios.get(`/api/releases/${releaseId}/reports`);
      setLoading(false);
    } catch (error) {
      setError('보고서 데이터를 불러올 수 없습니다.');
      setLoading(false);
    }
  };

  const calculateProgressPercentage = () => {
    if (!reports.progress.total) return 0;
    return Math.round((reports.progress.completed / reports.progress.total) * 100);
  };

  const getDefectSeverityDistribution = () => {
    // 실제 구현에서는 API에서 받아온 데이터 사용
    return {
      critical: 2,
      high: 5,
      medium: 8,
      low: 3
    };
  };

  if (loading) {
    return <LoadingSpinner>보고서를 불러오는 중...</LoadingSpinner>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  const progressPercentage = calculateProgressPercentage();
  const defectDistribution = getDefectSeverityDistribution();

  return (
    <Container>
      {/* 진행률 섹션 */}
      <Section>
        <SectionTitle>테스트 진행률</SectionTitle>
        <StatsGrid>
          <StatCard>
            <StatValue>{reports.progress.total}</StatValue>
            <StatLabel>전체 테스트케이스</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{reports.progress.completed}</StatValue>
            <StatLabel>완료된 테스트케이스</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{reports.progress.inProgress}</StatValue>
            <StatLabel>진행 중인 테스트케이스</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{reports.progress.notStarted}</StatValue>
            <StatLabel>시작하지 않은 테스트케이스</StatLabel>
          </StatCard>
        </StatsGrid>
        
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#64748b' }}>전체 진행률</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
              {progressPercentage}%
            </span>
          </div>
          <ProgressBar>
            <ProgressFill percentage={progressPercentage} color="#3b82f6" />
          </ProgressBar>
        </div>
      </Section>

      {/* 결함 통계 섹션 */}
      <Section>
        <SectionTitle>결함 통계</SectionTitle>
        <StatsGrid>
          <StatCard>
            <StatValue>{reports.defects.total}</StatValue>
            <StatLabel>전체 결함</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{reports.defects.open}</StatValue>
            <StatLabel>열린 결함</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{reports.defects.inProgress}</StatValue>
            <StatLabel>진행 중인 결함</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{reports.defects.resolved}</StatValue>
            <StatLabel>해결된 결함</StatLabel>
          </StatCard>
        </StatsGrid>

        <div style={{ marginTop: '16px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#374151' }}>
            결함 심각도 분포
          </h4>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '12px', height: '12px', background: '#dc2626', borderRadius: '2px' }}></div>
              <span style={{ fontSize: '12px' }}>치명적 ({defectDistribution.critical})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '12px', height: '12px', background: '#ea580c', borderRadius: '2px' }}></div>
              <span style={{ fontSize: '12px' }}>높음 ({defectDistribution.high})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '12px', height: '12px', background: '#d97706', borderRadius: '2px' }}></div>
              <span style={{ fontSize: '12px' }}>보통 ({defectDistribution.medium})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '12px', height: '12px', background: '#059669', borderRadius: '2px' }}></div>
              <span style={{ fontSize: '12px' }}>낮음 ({defectDistribution.low})</span>
            </div>
          </div>
        </div>
      </Section>

      {/* 트렌드 차트 섹션 */}
      <Section>
        <SectionTitle>주간 트렌드</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#374151' }}>
              완료된 테스트케이스
            </h4>
            <ChartContainer>
              📈 차트 영역 (Chart.js 또는 Recharts 사용 예정)
            </ChartContainer>
          </div>
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#374151' }}>
              발견된 결함
            </h4>
            <ChartContainer>
              📊 차트 영역 (Chart.js 또는 Recharts 사용 예정)
            </ChartContainer>
          </div>
        </div>
      </Section>

      {/* 품질 지표 섹션 */}
      <Section>
        <SectionTitle>품질 지표</SectionTitle>
        <StatsGrid>
          <StatCard>
            <StatValue>
              {reports.progress.total > 0 
                ? Math.round((reports.progress.completed / reports.progress.total) * 100)
                : 0}%
            </StatValue>
            <StatLabel>테스트 완료율</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>
              {reports.progress.completed > 0 
                ? Math.round((reports.defects.total / reports.progress.completed) * 100)
                : 0}%
            </StatValue>
            <StatLabel>결함 발견율</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>
              {reports.defects.total > 0 
                ? Math.round((reports.defects.resolved / reports.defects.total) * 100)
                : 0}%
            </StatValue>
            <StatLabel>결함 해결율</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>
              {reports.defects.total > 0 
                ? Math.round((reports.defects.closed / reports.defects.total) * 100)
                : 0}%
            </StatValue>
            <StatLabel>결함 종료율</StatLabel>
          </StatCard>
        </StatsGrid>
      </Section>
    </Container>
  );
};

export default ReportOverview; 