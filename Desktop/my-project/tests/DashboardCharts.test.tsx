import React from 'react';
import { render, screen, act } from '@testing-library/react';
import DashboardCharts from '../src/renderer/features/Dashboard/components/DashboardCharts';
import 'jest-canvas-mock';
import '@testing-library/jest-dom';

jest.mock('react-chartjs-2', () => ({
  Doughnut: (props: any) => <div data-testid="doughnut-chart">{JSON.stringify(props.data)}</div>,
  Bar: (props: any) => <div data-testid="bar-chart">{JSON.stringify(props.data)}</div>,
}));

const sampleStats = {
  totalCases: 100,
  statusCounts: { Pass: 80, Fail: 10, Blocked: 5, Untested: 5 },
  defectCount: 10,
  defectDensity: 0.1,
  progressRate: 0.8,
  workload: { alice: 50, bob: 30, carol: 20 },
};

describe('DashboardCharts', () => {
  it('renders all charts and tables with correct data', () => {
    render(<DashboardCharts stats={sampleStats} />);
    expect(screen.getByText(/Progress Rate/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Defect Density/i })).toBeInTheDocument();
    expect(screen.getByText(/Workload by User/i)).toBeInTheDocument();
    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('bob')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('carol')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText(/80%/)).toBeInTheDocument();
    expect(screen.getByText(/10.00%/)).toBeInTheDocument();
  });

  it('updates when stats change', () => {
    const { rerender } = render(<DashboardCharts stats={sampleStats} />);
    expect(screen.getByText('alice')).toBeInTheDocument();
    rerender(<DashboardCharts stats={{ ...sampleStats, workload: { alice: 10, bob: 5 } }} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders within 3 seconds', () => {
    const start = performance.now();
    act(() => {
      render(<DashboardCharts stats={sampleStats} />);
    });
    const end = performance.now();
    expect(end - start).toBeLessThan(3000);
  });
}); 