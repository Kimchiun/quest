interface PerformanceMetric {
  operation: string;
  duration: number;
  timestamp: Date;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

interface PerformanceStats {
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  lastOperation?: PerformanceMetric;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics = 1000; // 최대 저장 메트릭 수

  /**
   * 성능 측정을 위한 래퍼 함수
   */
  async measure<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const startTime = performance.now();
    const timestamp = new Date();
    
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      
      this.addMetric({
        operation,
        duration,
        timestamp,
        success: true,
        metadata
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      this.addMetric({
        operation,
        duration,
        timestamp,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        metadata
      });
      
      throw error;
    }
  }

  /**
   * 메트릭 추가
   */
  private addMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    // 최대 메트릭 수를 초과하면 가장 오래된 것부터 제거
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  /**
   * 특정 작업의 통계 반환
   */
  getStats(operation?: string): PerformanceStats {
    const filteredMetrics = operation 
      ? this.metrics.filter(m => m.operation === operation)
      : this.metrics;

    if (filteredMetrics.length === 0) {
      return {
        totalOperations: 0,
        successfulOperations: 0,
        failedOperations: 0,
        averageDuration: 0,
        minDuration: 0,
        maxDuration: 0
      };
    }

    const successfulMetrics = filteredMetrics.filter(m => m.success);
    const failedMetrics = filteredMetrics.filter(m => !m.success);
    const durations = filteredMetrics.map(m => m.duration);

    return {
      totalOperations: filteredMetrics.length,
      successfulOperations: successfulMetrics.length,
      failedOperations: failedMetrics.length,
      averageDuration: durations.reduce((sum, d) => sum + d, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      lastOperation: filteredMetrics[filteredMetrics.length - 1]
    };
  }

  /**
   * 최근 메트릭 조회
   */
  getRecentMetrics(limit: number = 10): PerformanceMetric[] {
    return this.metrics.slice(-limit);
  }

  /**
   * 성능 경고 체크
   */
  checkPerformanceWarnings(operation: string): string[] {
    const stats = this.getStats(operation);
    const warnings: string[] = [];

    if (stats.averageDuration > 1000) {
      warnings.push(`${operation}: 평균 응답 시간이 1초를 초과합니다 (${stats.averageDuration.toFixed(2)}ms)`);
    }

    if (stats.failedOperations / stats.totalOperations > 0.1) {
      warnings.push(`${operation}: 실패율이 10%를 초과합니다 (${((stats.failedOperations / stats.totalOperations) * 100).toFixed(1)}%)`);
    }

    if (stats.maxDuration > 5000) {
      warnings.push(`${operation}: 최대 응답 시간이 5초를 초과합니다 (${stats.maxDuration.toFixed(2)}ms)`);
    }

    return warnings;
  }

  /**
   * 메트릭 초기화
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * 성능 리포트 생성
   */
  generateReport(): string {
    const allStats = this.getStats();
    const folderDragDropStats = this.getStats('folder-dragdrop');
    const warnings = this.checkPerformanceWarnings('folder-dragdrop');

    return `
=== 성능 모니터링 리포트 ===
생성 시간: ${new Date().toLocaleString()}

전체 작업 통계:
- 총 작업 수: ${allStats.totalOperations}
- 성공률: ${allStats.totalOperations > 0 ? ((allStats.successfulOperations / allStats.totalOperations) * 100).toFixed(1) : 0}%
- 평균 응답 시간: ${allStats.averageDuration.toFixed(2)}ms

폴더 드래그 앤 드롭 통계:
- 총 작업 수: ${folderDragDropStats.totalOperations}
- 성공률: ${folderDragDropStats.totalOperations > 0 ? ((folderDragDropStats.successfulOperations / folderDragDropStats.totalOperations) * 100).toFixed(1) : 0}%
- 평균 응답 시간: ${folderDragDropStats.averageDuration.toFixed(2)}ms
- 최소 응답 시간: ${folderDragDropStats.minDuration.toFixed(2)}ms
- 최대 응답 시간: ${folderDragDropStats.maxDuration.toFixed(2)}ms

성능 경고:
${warnings.length > 0 ? warnings.map(w => `- ${w}`).join('\n') : '- 없음'}

최근 작업 (최대 5개):
${this.getRecentMetrics(5).map(m => 
  `- ${m.operation}: ${m.success ? '성공' : '실패'} (${m.duration.toFixed(2)}ms) - ${m.timestamp.toLocaleTimeString()}`
).join('\n')}
    `.trim();
  }
}

// 싱글톤 인스턴스
export const performanceMonitor = new PerformanceMonitor();

// 편의 함수들
export const measureOperation = performanceMonitor.measure.bind(performanceMonitor);
export const getPerformanceStats = performanceMonitor.getStats.bind(performanceMonitor);
export const generatePerformanceReport = performanceMonitor.generateReport.bind(performanceMonitor); 