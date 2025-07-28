import React from 'react';
import styled from 'styled-components';
import Typography from '../../../shared/components/Typography';

const ChartContainer = styled.div`
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 16px;
`;

const ChartItem = styled.div`
  text-align: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
`;

const ChartValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
`;

const ChartLabel = styled.div`
  font-size: 14px;
  color: #64748b;
`;

interface DashboardChartsProps {
  stats?: any;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ stats }) => {
  const defaultStats = {
    totalCases: 51,
    defectCount: 5,
    progressRate: 0.78,
    defectDensity: 0.098
  };

  const currentStats = stats || defaultStats;

  return (
    <ChartContainer>
      <Typography $variant="h4" style={{ marginBottom: '16px' }}>
        차트 및 통계
      </Typography>
      
      <ChartGrid>
        <ChartItem>
          <ChartValue>{currentStats.totalCases}</ChartValue>
          <ChartLabel>전체 케이스</ChartLabel>
        </ChartItem>
        <ChartItem>
          <ChartValue>{currentStats.defectCount}</ChartValue>
          <ChartLabel>결함 수</ChartLabel>
        </ChartItem>
        <ChartItem>
          <ChartValue>{(currentStats.progressRate * 100).toFixed(1)}%</ChartValue>
          <ChartLabel>진행률</ChartLabel>
        </ChartItem>
        <ChartItem>
          <ChartValue>{(currentStats.defectDensity * 100).toFixed(1)}%</ChartValue>
          <ChartLabel>결함 밀도</ChartLabel>
        </ChartItem>
      </ChartGrid>
    </ChartContainer>
  );
};

export default DashboardCharts; 