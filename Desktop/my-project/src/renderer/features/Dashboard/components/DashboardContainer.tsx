import React from 'react';
import styled from 'styled-components';
import { SectionContainer, SectionHeader } from '../../../shared/components/Layout/MainContentArea';
import ProgressWidget from '../../../shared/components/Dashboard/ProgressWidget';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

const DetailCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const DetailTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const DetailItem = styled.div`
  text-align: center;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
`;

const DetailValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
`;

const DetailLabel = styled.div`
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
`;

const DashboardContainer: React.FC = () => {
  const testProgressData = {
    completed: 34,
    total: 59,
    label: '테스트 완료',
    color: '#10b981'
  };

  const defectProgressData = {
    completed: 12,
    total: 23,
    label: '결함 해결',
    color: '#ef4444'
  };

  const testStats = [
    { value: 12, label: '진행 중', color: '#3b82f6' },
    { value: 34, label: '완료', color: '#10b981' },
    { value: 5, label: '실패', color: '#ef4444' },
    { value: 8, label: '대기', color: '#f59e0b' }
  ];

  const defectStats = [
    { value: 8, label: 'Critical', color: '#dc2626' },
    { value: 12, label: 'Major', color: '#ea580c' },
    { value: 15, label: 'Minor', color: '#d97706' },
    { value: 5, label: '해결됨', color: '#059669' }
  ];

  return (
    <Container>
      <DetailCard>
        <DetailTitle>테스트 진행 상황</DetailTitle>
        <ProgressWidget
          data={testProgressData}
          variant="bar"
          size="small"
        />
        <DetailGrid>
          {testStats.map((stat, index) => (
            <DetailItem key={index}>
              <DetailValue style={{ color: stat.color }}>
                {stat.value}
              </DetailValue>
              <DetailLabel>{stat.label}</DetailLabel>
            </DetailItem>
          ))}
        </DetailGrid>
      </DetailCard>

      <DetailCard>
        <DetailTitle>결함 현황</DetailTitle>
        <ProgressWidget
          data={defectProgressData}
          variant="bar"
          size="small"
        />
        <DetailGrid>
          {defectStats.map((stat, index) => (
            <DetailItem key={index}>
              <DetailValue style={{ color: stat.color }}>
                {stat.value}
              </DetailValue>
              <DetailLabel>{stat.label}</DetailLabel>
            </DetailItem>
          ))}
        </DetailGrid>
      </DetailCard>
    </Container>
  );
};

export default DashboardContainer; 