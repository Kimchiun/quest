import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardCharts from '@/renderer/features/Dashboard/components/DashboardCharts';

describe('DashboardCharts', () => {
  const stats = {
    totalCases: 100,
    statusCounts: { Pass: 60, Fail: 20, Blocked: 10, Untested: 10 },
    defectCount: 8,
    defectDensity: 0.08,
    progressRate: 0.6,
    workload: { Alice: 40, Bob: 30, Carol: 30 },
  };

  it('KPI 카드/차트가 정상 렌더링되고 데이터가 바인딩된다', () => {
    render(<DashboardCharts stats={stats} />);
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('8.00%')).toBeInTheDocument();
    expect(screen.getByLabelText('진행률 도넛 차트')).toBeInTheDocument();
    expect(screen.getByLabelText('결함 밀도 바 차트')).toBeInTheDocument();
    expect(screen.getByLabelText('사용자별 작업량 바 차트')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
  });

  it('접근성 속성(aria-label, role) 포함', () => {
    render(<DashboardCharts stats={stats} />);
    expect(screen.getByLabelText('진행률 차트')).toBeInTheDocument();
    expect(screen.getByLabelText('결함 밀도 차트')).toBeInTheDocument();
    expect(screen.getByLabelText('사용자별 작업량 차트')).toBeInTheDocument();
  });

  it('5초(5000ms) 내에 렌더링이 완료된다', () => {
    const start = performance.now();
    render(<DashboardCharts stats={stats} />);
    const end = performance.now();
    expect(end - start).toBeLessThan(5000);
  });
}); 