import React from 'react';
import Container from '@/renderer/shared/components/Container';
import Typography from '@/renderer/shared/components/Typography';
import Grid from '@/renderer/shared/components/Grid';
import Card from '@/renderer/shared/components/Container'; // Card는 Container 재활용 또는 별도 분리 가능
import DashboardCharts from './components/DashboardCharts';

const dummyStats = {
  totalCases: 51,
  statusCounts: { Pass: 30, Fail: 12, Blocked: 3, Untested: 6 },
  defectCount: 5,
  defectDensity: 0.098,
  progressRate: 0.78,
  workload: { '홍길동': 12, '김철수': 20, '이영희': 19 },
};

const DashboardPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '32px 0' }}>
      <Container maxWidth="1200px" padding="32px 24px" background="#fff" radius="md" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
        <Typography variant="h1" style={{ marginBottom: 24 }}>대시보드</Typography>
        <Grid columns={3} gap="24px">
          <Card padding="24px" background="#e0f2fe">
            <Typography variant="h4">진행 중 테스트</Typography>
            <Typography variant="h2" color="#2563eb">12</Typography>
          </Card>
          <Card padding="24px" background="#fef9c3">
            <Typography variant="h4">완료 테스트</Typography>
            <Typography variant="h2" color="#ca8a04">34</Typography>
          </Card>
          <Card padding="24px" background="#fee2e2">
            <Typography variant="h4">결함 건수</Typography>
            <Typography variant="h2" color="#dc2626">5</Typography>
          </Card>
        </Grid>
        <div style={{ marginTop: 40 }}>
          <DashboardCharts stats={dummyStats} />
        </div>
      </Container>
    </div>
  );
};

export default DashboardPage; 