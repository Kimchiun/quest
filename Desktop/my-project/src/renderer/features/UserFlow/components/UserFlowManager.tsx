import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import styled from 'styled-components';

// 사용자 플로우 단계 정의
export enum UserFlowStep {
  LOGIN = 'login',
  DASHBOARD = 'dashboard',
  RELEASE_SELECTION = 'release_selection',
  TEST_MANAGEMENT = 'test_management',
  DETAIL_VIEW = 'detail_view',
  FILTER_SEARCH = 'filter_search'
}

interface UserFlowState {
  currentStep: UserFlowStep;
  previousSteps: UserFlowStep[];
  stepCompletionTime: { [key in UserFlowStep]?: number };
  userFeedback: { [key in UserFlowStep]?: string };
}

// 스타일 컴포넌트
const FlowIndicator = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  font-size: 12px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StepProgress = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const StepDot = styled.div<{ active: boolean; completed: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => 
    props.completed ? '#10b981' : 
    props.active ? '#3b82f6' : '#e5e7eb'
  };
  transition: all 0.2s ease;
`;

const UserFlowManager: React.FC = () => {
  const [flowState, setFlowState] = useState<UserFlowState>({
    currentStep: UserFlowStep.LOGIN,
    previousSteps: [],
    stepCompletionTime: {},
    userFeedback: {}
  });

  const user = useSelector((state: RootState) => state.users.me);
  const selectedRelease = useSelector((state: RootState) => (state.releases as any).selectedRelease || null);
  const selectedTestCase = useSelector((state: RootState) => (state.testcases as any).selectedTestCase || null);

  // 현재 단계 자동 감지
  useEffect(() => {
    let currentStep = UserFlowStep.LOGIN;
    
    if (user) {
      currentStep = UserFlowStep.DASHBOARD;
      
      if (selectedRelease) {
        currentStep = UserFlowStep.TEST_MANAGEMENT;
        
        if (selectedTestCase) {
          currentStep = UserFlowStep.DETAIL_VIEW;
        }
      }
    }

    setFlowState(prev => ({
      ...prev,
      currentStep,
      previousSteps: prev.currentStep !== currentStep 
        ? [...prev.previousSteps, prev.currentStep]
        : prev.previousSteps
    }));
  }, [user, selectedRelease, selectedTestCase]);

  // 단계별 완료 시간 기록
  useEffect(() => {
    if (flowState.currentStep && !flowState.stepCompletionTime[flowState.currentStep]) {
      setFlowState(prev => ({
        ...prev,
        stepCompletionTime: {
          ...prev.stepCompletionTime,
          [prev.currentStep]: Date.now()
        }
      }));
    }
  }, [flowState.currentStep]);

  // 사용자 피드백 수집
  const collectFeedback = (step: UserFlowStep, feedback: string) => {
    setFlowState(prev => ({
      ...prev,
      userFeedback: {
        ...prev.userFeedback,
        [step]: feedback
      }
    }));
  };

  // 플로우 분석 데이터
  const getFlowAnalytics = () => {
    const analytics = {
      totalSteps: Object.keys(UserFlowStep).length,
      completedSteps: flowState.previousSteps.length,
      averageStepTime: 0,
      userSatisfaction: 0
    };

    // 평균 단계 완료 시간 계산
    const completionTimes = Object.values(flowState.stepCompletionTime);
    if (completionTimes.length > 1) {
      const timeDiffs = completionTimes.slice(1).map((time, index) => 
        time - completionTimes[index]
      );
      analytics.averageStepTime = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
    }

    // 사용자 만족도 계산 (피드백 기반)
    const feedbackScores: number[] = Object.values(flowState.userFeedback)
      .filter(feedback => feedback)
      .map(feedback => {
        // 간단한 감정 분석 (실제로는 더 정교한 분석 필요)
        const positiveWords = ['좋다', '편리', '쉽다', '빠르다'];
        const negativeWords = ['어렵다', '불편', '느리다', '복잡'];
        
        const positiveCount = positiveWords.filter(word => feedback.includes(word)).length;
        const negativeCount = negativeWords.filter(word => feedback.includes(word)).length;
        
        return positiveCount > negativeCount ? 1 : negativeCount > positiveCount ? -1 : 0;
      });
    
    if (feedbackScores.length > 0) {
      const totalScore = feedbackScores.reduce((sum: number, score: number) => sum + score, 0);
      analytics.userSatisfaction = totalScore / feedbackScores.length;
    }

    return analytics;
  };

  const analytics = getFlowAnalytics();

  return (
    <>
      <FlowIndicator>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          사용자 플로우 진행률
        </div>
        <div style={{ fontSize: '11px', color: '#6b7280' }}>
          {analytics.completedSteps} / {analytics.totalSteps} 단계 완료
        </div>
        <StepProgress>
          {Object.values(UserFlowStep).map((step, index) => (
            <StepDot
              key={step}
              active={flowState.currentStep === step}
              completed={flowState.previousSteps.includes(step)}
            />
          ))}
        </StepProgress>
        {analytics.averageStepTime > 0 && (
          <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>
            평균 단계 시간: {Math.round(analytics.averageStepTime / 1000)}초
          </div>
        )}
      </FlowIndicator>
    </>
  );
};

export default UserFlowManager; 