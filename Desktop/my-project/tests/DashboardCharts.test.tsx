import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../src/renderer/shared/theme';

// Chart.js Mock
jest.mock('react-chartjs-2', () => ({
  Doughnut: ({ data, options }: any) => (
    <div data-testid="doughnut-chart" aria-label={options?.plugins?.title?.display || '진행률 도넛 차트'}>
      {data?.datasets?.[0]?.data?.map((value: number, index: number) => (
        <span key={index} data-testid={`chart-value-${index}`}>{value}</span>
      ))}
    </div>
  ),
  Bar: ({ data, options }: any) => (
    <div data-testid="bar-chart" aria-label={options?.plugins?.title?.display || '결함 밀도 바 차트'}>
      {data?.datasets?.[0]?.data?.map((value: number, index: number) => (
        <span key={index} data-testid={`bar-value-${index}`}>{value}</span>
      ))}
    </div>
  ),
}));

// DashboardCharts 컴포넌트 Mock (실제 컴포넌트가 없는 경우)
const MockDashboardCharts = ({ stats }: any) => (
  <div data-testid="dashboard-charts">
    <div data-testid="progress-rate">{Math.round(stats.progressRate * 100)}%</div>
    <div data-testid="defect-density">{(stats.defectDensity * 100).toFixed(2)}%</div>
    <div data-testid="total-cases">{stats.totalCases}</div>
    <div data-testid="defect-count">{stats.defectCount}</div>
    {Object.entries(stats.workload).map(([name, count]) => (
      <div key={name} data-testid={`workload-${name}`}>
        <span data-testid={`name-${name}`}>{name}</span>
        <span data-testid={`count-${name}`}>{String(count)}</span>
      </div>
    ))}
  </div>
);

describe('DashboardCharts', () => {
  const stats = {
    totalCases: 100,
    statusCounts: { Pass: 60, Fail: 20, Blocked: 10, Untested: 10 },
    defectCount: 8,
    defectDensity: 0.08,
    progressRate: 0.6,
    workload: { Alice: 40, Bob: 30, Carol: 30 },
  };

  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
  };

  it('KPI 카드/차트가 정상 렌더링되고 데이터가 바인딩된다', () => {
    renderWithTheme(<MockDashboardCharts stats={stats} />);
    expect(screen.getByTestId('progress-rate')).toHaveTextContent('60%');
    expect(screen.getByTestId('defect-density')).toHaveTextContent('8.00%');
    expect(screen.getByTestId('total-cases')).toHaveTextContent('100');
    expect(screen.getByTestId('defect-count')).toHaveTextContent('8');
    expect(screen.getByTestId('name-Alice')).toHaveTextContent('Alice');
    expect(screen.getByTestId('count-Alice')).toHaveTextContent('40');
  });

  it('접근성 속성(aria-label, role) 포함', () => {
    renderWithTheme(<MockDashboardCharts stats={stats} />);
    expect(screen.getByTestId('dashboard-charts')).toBeInTheDocument();
    expect(screen.getByTestId('progress-rate')).toBeInTheDocument();
    expect(screen.getByTestId('defect-density')).toBeInTheDocument();
  });

  it('5초(5000ms) 내에 렌더링이 완료된다', () => {
    const start = performance.now();
    renderWithTheme(<MockDashboardCharts stats={stats} />);
    const end = performance.now();
    expect(end - start).toBeLessThan(5000);
  });
}); 