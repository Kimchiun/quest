import { calcDefectDensity, calcProgressRate, aggregateWorkload } from '../src/main/app/utils/dashboardStats';

// 단위 테스트

describe('dashboard 집계 로직', () => {
  it('defect density 계산', () => {
    expect(calcDefectDensity(5, 100)).toBe(0.05);
    expect(calcDefectDensity(0, 100)).toBe(0);
    expect(calcDefectDensity(10, 0)).toBe(0);
  });
  it('progress rate 계산', () => {
    expect(calcProgressRate(80, 100)).toBe(0.8);
    expect(calcProgressRate(0, 100)).toBe(0);
    expect(calcProgressRate(10, 0)).toBe(0);
  });
  it('작업량 집계', () => {
    const executions = [
      { executed_by: 'alice' },
      { executed_by: 'bob' },
      { executed_by: 'alice' },
    ];
    const workload = aggregateWorkload(executions);
    expect(workload).toEqual({ alice: 2, bob: 1 });
  });
}); 