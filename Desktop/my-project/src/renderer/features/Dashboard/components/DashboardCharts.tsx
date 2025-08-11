import React from 'react';
import styled from 'styled-components';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { Line, Doughnut, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const ChartTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  text-align: center;
`;

const ChartWrapper = styled.div`
  position: relative;
  height: 250px;
  width: 100%;
`;

// 테스트 진행률 도넛차트
const TestProgressChart: React.FC = () => {
  const data = {
    labels: ['통과', '실패', '차단', '미실행'],
    datasets: [
      {
        data: [65, 15, 8, 12],
        backgroundColor: [
          '#10b981', // 통과 - 초록
          '#ef4444', // 실패 - 빨강
          '#f59e0b', // 차단 - 주황
          '#6b7280', // 미실행 - 회색
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <ChartCard>
      <ChartTitle>테스트 진행률</ChartTitle>
      <ChartWrapper>
        <Doughnut data={data} options={options} />
      </ChartWrapper>
    </ChartCard>
  );
};

// 버그 추세 라인차트
const BugTrendChart: React.FC = () => {
  const data = {
    labels: ['1주', '2주', '3주', '4주', '5주', '6주'],
    datasets: [
      {
        label: '새로운 버그',
        data: [12, 19, 15, 25, 22, 18],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: '해결된 버그',
        data: [8, 15, 12, 20, 18, 16],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <ChartCard>
      <ChartTitle>버그 추세</ChartTitle>
      <ChartWrapper>
        <Line data={data} options={options} />
      </ChartWrapper>
    </ChartCard>
  );
};

// 릴리즈별 이슈 분포 파이차트
const ReleaseIssuesChart: React.FC = () => {
  const data = {
    labels: ['v2.0.0', 'v1.9.0', 'v1.8.0', 'v1.7.0'],
    datasets: [
      {
        data: [45, 32, 28, 15],
        backgroundColor: [
          '#3b82f6', // 파랑
          '#8b5cf6', // 보라
          '#06b6d4', // 청록
          '#f59e0b', // 주황
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed}개 (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <ChartCard>
      <ChartTitle>릴리즈별 이슈 분포</ChartTitle>
      <ChartWrapper>
        <Pie data={data} options={options} />
      </ChartWrapper>
    </ChartCard>
  );
};

const DashboardCharts: React.FC = () => {
  return (
    <ChartsContainer>
      <TestProgressChart />
      <BugTrendChart />
      <ReleaseIssuesChart />
    </ChartsContainer>
  );
};

export default DashboardCharts;
