import React from 'react';
import styled from 'styled-components';
import Typography from '../../../shared/components/Typography';

const Container = styled.div`
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin: 8px 0;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.progress}%;
    background: #2563eb;
    transition: width 0.3s ease;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 16px;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DashboardContainer: React.FC = () => {
  const progress = 75; // 예시 데이터

  return (
    <Container>
      <Typography $variant="h4" style={{ marginBottom: '16px' }}>
        테스트 진행률
      </Typography>
      
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <Typography $variant="body">전체 진행률</Typography>
          <Typography $variant="body">{progress}%</Typography>
        </div>
        <ProgressBar progress={progress} />
      </div>

      <StatsGrid>
        <StatItem>
          <StatValue>12</StatValue>
          <StatLabel>진행 중</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>34</StatValue>
          <StatLabel>완료</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>5</StatValue>
          <StatLabel>실패</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>8</StatValue>
          <StatLabel>대기</StatLabel>
        </StatItem>
      </StatsGrid>
    </Container>
  );
};

export default DashboardContainer; 