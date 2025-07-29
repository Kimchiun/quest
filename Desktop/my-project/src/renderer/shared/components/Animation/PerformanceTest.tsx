import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PageTransition from './PageTransition';
import { useAnimation } from './useAnimation';

const PerformanceContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PerformanceMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const MetricCard = styled.div`
  padding: 12px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #007bff;
`;

const MetricValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
`;

const MetricLabel = styled.div`
  font-size: 12px;
  color: #6c757d;
  margin-top: 4px;
`;

const AnimationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

const AnimationItem = styled.div<{ isAnimating: boolean }>`
  height: 100px;
  background: ${props => props.isAnimating ? '#28a745' : '#6c757d'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  transition: all 0.3s ease;
  transform: ${props => props.isAnimating ? 'scale(1.1)' : 'scale(1)'};
`;

interface PerformanceData {
  fps: number;
  frameTime: number;
  animationCount: number;
  memoryUsage: number;
}

const PerformanceTest: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    fps: 0,
    frameTime: 0,
    animationCount: 0,
    memoryUsage: 0
  });
  
  const [isRunning, setIsRunning] = useState(false);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const animationRef = useRef<number>();

  const { state, enter, exit } = useAnimation({
    duration: 1000,
    onEnter: () => {
      setPerformanceData(prev => ({ ...prev, animationCount: prev.animationCount + 1 }));
    }
  });

  // FPS 측정
  const measurePerformance = () => {
    const currentTime = performance.now();
    frameCount.current++;

    if (currentTime - lastTime.current >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
      const frameTime = (currentTime - lastTime.current) / frameCount.current;
      
      setPerformanceData(prev => ({
        ...prev,
        fps,
        frameTime: Math.round(frameTime * 100) / 100
      }));

      frameCount.current = 0;
      lastTime.current = currentTime;
    }

    animationRef.current = requestAnimationFrame(measurePerformance);
  };

  useEffect(() => {
    if (isRunning) {
      measurePerformance();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning]);

  // 메모리 사용량 측정 (브라우저 지원 시)
  useEffect(() => {
    if ('memory' in performance) {
      const updateMemoryUsage = () => {
        const memory = (performance as any).memory;
        setPerformanceData(prev => ({
          ...prev,
          memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024 * 100) / 100
        }));
      };

      const interval = setInterval(updateMemoryUsage, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  const togglePerformanceTest = () => {
    setIsRunning(!isRunning);
  };

  const triggerAnimation = () => {
    if (state.isVisible) {
      exit();
    } else {
      enter();
    }
  };

  return (
    <PerformanceContainer>
      <h2>애니메이션 성능 테스트</h2>
      
      <PerformanceMetrics>
        <MetricCard>
          <MetricValue>{performanceData.fps}</MetricValue>
          <MetricLabel>FPS</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>{performanceData.frameTime}ms</MetricValue>
          <MetricLabel>Frame Time</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>{performanceData.animationCount}</MetricValue>
          <MetricLabel>Animation Count</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>{performanceData.memoryUsage}MB</MetricValue>
          <MetricLabel>Memory Usage</MetricLabel>
        </MetricCard>
      </PerformanceMetrics>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={togglePerformanceTest}
          style={{ 
            padding: '8px 16px', 
            marginRight: '10px',
            background: isRunning ? '#dc3545' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isRunning ? '성능 측정 중지' : '성능 측정 시작'}
        </button>
        
        <button 
          onClick={triggerAnimation}
          style={{ 
            padding: '8px 16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          애니메이션 트리거
        </button>
      </div>

      <AnimationGrid>
        {Array.from({ length: 20 }).map((_, index) => (
          <AnimationItem 
            key={index}
            isAnimating={isRunning && index % 3 === 0}
          >
            {index + 1}
          </AnimationItem>
        ))}
      </AnimationGrid>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#6c757d' }}>
        <p>• FPS가 60 이상이면 부드러운 애니메이션</p>
        <p>• Frame Time이 16ms 이하면 좋은 성능</p>
        <p>• 메모리 사용량이 지속적으로 증가하면 메모리 누수 가능성</p>
      </div>
    </PerformanceContainer>
  );
};

export default PerformanceTest; 