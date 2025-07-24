// 결함 밀도 계산
export function calcDefectDensity(defectCount: number, totalCases: number): number {
  return totalCases > 0 ? defectCount / totalCases : 0;
}

// 진행률 계산
export function calcProgressRate(passCount: number, totalCases: number): number {
  return totalCases > 0 ? passCount / totalCases : 0;
}

// 작업량 집계
export function aggregateWorkload(executions: { executed_by: string }[]): Record<string, number> {
  const workload: Record<string, number> = {};
  executions.forEach(r => {
    workload[r.executed_by] = (workload[r.executed_by] || 0) + 1;
  });
  return workload;
} 