import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import Typography from '@/renderer/shared/components/Typography';
import Grid from '@/renderer/shared/components/Grid';

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
      <div>
        <Typography variant="h4" style={{ marginBottom: 12 }}>진행률</Typography>
        <Doughnut data={progressData} />
        <Typography variant="body" align="center" style={{ marginTop: 8 }}>
          <b>{Math.round(stats.progressRate * 100)}%</b> 완료
        </Typography>
      </div>
      <div>
        <Typography variant="h4" style={{ marginBottom: 12 }}>결함 밀도</Typography>
        <Bar data={defectData} options={{ indexAxis: 'y', plugins: { legend: { display: false } } }} />
        <Typography variant="body" align="center" style={{ marginTop: 8 }}>
          <b>{(stats.defectDensity * 100).toFixed(2)}%</b> defects per case
        </Typography>
      </div>
      <div>
        <Typography variant="h4" style={{ marginBottom: 12 }}>사용자별 작업량</Typography>
        <Bar data={workloadData} options={{ plugins: { legend: { display: false } } }} />
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
      </div>
    </Grid>
  );
};

export default DashboardCharts; 