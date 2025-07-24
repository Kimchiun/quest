import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/renderer/store';
import { fetchDashboardStats } from '../store/dashboardSlice';
import DashboardCharts from './DashboardCharts';
import Container from '@/renderer/shared/components/Container';
import Typography from '@/renderer/shared/components/Typography';
import Grid from '@/renderer/shared/components/Grid';

const DashboardContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const stats = useSelector((state: RootState) => state.dashboard.stats);
  const loading = useSelector((state: RootState) => state.dashboard.loading);
  const error = useSelector((state: RootState) => state.dashboard.error);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    const interval = setInterval(() => {
      dispatch(fetchDashboardStats());
    }, 5000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <Container maxWidth="1200px" padding="32px" background="#fff" radius="md" style={{ margin: '32px auto' }}>
      <Typography variant="h2" style={{ marginBottom: 24 }}>대시보드</Typography>
      <Grid columns={1} gap="32px">
        {loading && <Typography variant="body">로딩 중...</Typography>}
        {error && <Typography variant="body" color="red">{error}</Typography>}
        {stats && <DashboardCharts stats={stats} />}
      </Grid>
    </Container>
  );
};

export default DashboardContainer; 