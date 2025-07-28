import React from 'react';
import styled from 'styled-components';
import Typography from '../../shared/components/Typography';
import Container from '../../shared/components/Container';
import Grid from '../../shared/components/Grid';
import DashboardContainer from './components/DashboardContainer';
import DashboardCharts from './components/DashboardCharts';

const PageContainer = styled.div`
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
`;

const DashboardPage: React.FC = () => {
  return (
    <PageContainer>
      <Container
        $maxWidth="1200px"
        $padding="24px"
        $background="white"
        $radius="8px"
        style={{ margin: '0 auto', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
      >
        <Grid
          $columns={1}
          $gap="16px"
        >
          <Container
            $padding="16px"
            $background="#f8fafc"
          >
            <Typography $variant="h2">대시보드</Typography>
          </Container>
          
          <Container
            $padding="16px"
            $background="#f8fafc"
          >
            <DashboardContainer />
          </Container>
          
          <Container
            $padding="16px"
            $background="#f8fafc"
          >
            <DashboardCharts />
          </Container>
        </Grid>
      </Container>
    </PageContainer>
  );
};

export default DashboardPage; 