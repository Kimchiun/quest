import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import Typography from '../../../shared/components/Typography';
import Grid from '../../../shared/components/Grid';
import Card from '../../../shared/components/Card';
import { FaChartPie, FaBug, FaUserCheck } from 'react-icons/fa';

Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

interface DashboardStats {
  totalCases: number;
  statusCounts: Record<string, number>;
  defectCount: number;
  defectDensity: number;
  progressRate: number;
  workload: Record<string, number>;
}

interface DashboardChartsProps {
  stats: DashboardStats;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ stats }) => {
  const progressData = {
    labels: ['Pass', 'Fail', 'Blocked', 'Untested'],
    datasets: [
      {
        data: [
          stats.statusCounts['Pass'] || 0,
          stats.statusCounts['Fail'] || 0,
          stats.statusCounts['Blocked'] || 0,
          stats.statusCounts['Untested'] || 0,
        ],
        backgroundColor: ['#4caf50', '#f44336', '#ff9800', '#bdbdbd'],
      },
    ],
  };
  const defectData = {
    labels: ['Defect Density'],
    datasets: [
      {
        label: 'Defect Density',
        data: [stats.defectDensity],
        backgroundColor: ['#2196f3'],
      },
    ],
  };
  const workloadData = {
    labels: Object.keys(stats.workload),
    datasets: [
      {
        label: 'Workload',
        data: Object.values(stats.workload),
        backgroundColor: '#9c27b0',
      },
    ],
  };
  return (
    <Grid columns={3} gap="32px">
      <Card
        icon={<FaUserCheck size={24} color="#4caf50" />}
        value={Math.round(stats.progressRate * 100) + '%'}
        label="진행률 차트"
        color="#4caf50"
        description="상태별 진행률 분포"
        ariaLabel="진행률 차트"
        style={{ minHeight: 340 }}
      >
        <Doughnut data={progressData} aria-label="진행률 도넛 차트" />
      </Card>
      <Card
        icon={<FaBug size={24} color="#2196f3" />}
        value={(stats.defectDensity * 100).toFixed(2) + '%'}
        label="결함 밀도 차트"
        color="#2196f3"
        description="케이스당 결함 비율"
        ariaLabel="결함 밀도 차트"
        style={{ minHeight: 340 }}
      >
        <Bar data={defectData} options={{ indexAxis: 'y', plugins: { legend: { display: false } } }} aria-label="결함 밀도 바 차트" />
      </Card>
      <Card
        icon={<FaChartPie size={24} color="#9c27b0" />}
        value={Object.values(stats.workload).reduce((a, b) => a + b, 0)}
        label="사용자별 작업량"
        color="#9c27b0"
        description="테스터별 테스트케이스 처리량"
        ariaLabel="사용자별 작업량 차트"
        style={{ minHeight: 340 }}
      >
        <Bar data={workloadData} options={{ plugins: { legend: { display: false } } }} aria-label="사용자별 작업량 바 차트" />
        <table style={{ width: '100%', marginTop: 8, fontSize: 14, borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 4 }}><Typography variant="caption">User</Typography></th>
              <th style={{ textAlign: 'right', padding: 4 }}><Typography variant="caption">Count</Typography></th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats.workload).map(([user, count]) => (
              <tr key={user}>
                <td style={{ textAlign: 'left', padding: 4 }}><Typography variant="body">{user}</Typography></td>
                <td style={{ textAlign: 'right', padding: 4 }}><Typography variant="body">{count}</Typography></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Grid>
  );
};

export default DashboardCharts; 