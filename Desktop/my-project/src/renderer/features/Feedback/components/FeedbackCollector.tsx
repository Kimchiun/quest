import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// 피드백 타입 정의
interface FeedbackData {
  id: string;
  timestamp: number;
  step: string;
  rating: number;
  comment: string;
  category: 'usability' | 'performance' | 'accessibility' | 'bug';
  userAgent: string;
  screenResolution: string;
}

// 토스트 알림 스타일 컴포넌트
const Toast = styled.div<{ show: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  background: #10b981;
  color: white;
  padding: 12px 20px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  transform: translateX(${props => props.show ? '0' : '120%'});
  opacity: ${props => props.show ? '1' : '0'};
  transition: all 0.3s ease-in-out;
  font-size: 14px;
  font-weight: 500;
  pointer-events: ${props => props.show ? 'auto' : 'none'};
`;

// 스타일 컴포넌트
const FeedbackModal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const RatingContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 16px 0;
`;

const RatingButton = styled.button<{ selected: boolean }>`
  background: ${props => props.selected ? '#3b82f6' : '#f3f4f6'};
  color: ${props => props.selected ? 'white' : '#374151'};
  border: 1px solid ${props => props.selected ? '#3b82f6' : '#d1d5db'};
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.selected ? '#2563eb' : '#e5e7eb'};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const CategorySelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  margin-bottom: 16px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const FeedbackCollector: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState<'usability' | 'performance' | 'accessibility' | 'bug'>('usability');
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackData[]>([]);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // 현재 페이지/단계 감지
  useEffect(() => {
    const detectCurrentStep = () => {
      const path = window.location.pathname;
      if (path.includes('/dashboard')) return '대시보드';
      if (path.includes('/testcases')) return '테스트케이스 관리';
      if (path.includes('/releases')) return '릴리즈 관리';
      if (path.includes('/execution')) return '테스트 실행';
      return '기타';
    };

    setCurrentStep(detectCurrentStep());
  }, []);

  // 피드백 제출
  const submitFeedback = async () => {
    if (rating === 0) {
      setToastMessage('평점을 선택해주세요.');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setToastMessage(''), 300);
      }, 3000);
      return;
    }

    const feedbackData: FeedbackData = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      step: currentStep,
      rating,
      comment,
      category,
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`
    };

    // 로컬 스토리지에 저장
    const existingFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
    const updatedFeedback = [...existingFeedback, feedbackData];
    localStorage.setItem('userFeedback', JSON.stringify(updatedFeedback));

    // 서버로 전송 (실제 구현 시)
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });
    } catch (error) {
      console.log('피드백 저장 실패:', error);
    }

    // 상태 초기화
    setRating(0);
    setComment('');
    setCategory('usability');
    setIsModalOpen(false);

    // 성공 메시지
    setToastMessage('피드백이 성공적으로 제출되었습니다. 감사합니다!');
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setTimeout(() => setToastMessage(''), 300);
    }, 3000);
  };

  // 피드백 통계 계산
  const getFeedbackStats = () => {
    const allFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
    
    if (allFeedback.length === 0) {
      return {
        totalFeedback: 0,
        averageRating: 0,
        categoryDistribution: {},
        stepDistribution: {}
      };
    }

    const totalFeedback = allFeedback.length;
    const averageRating = allFeedback.reduce((sum: number, f: FeedbackData) => sum + f.rating, 0) / totalFeedback;
    
    const categoryDistribution = allFeedback.reduce((acc: any, f: FeedbackData) => {
      acc[f.category] = (acc[f.category] || 0) + 1;
      return acc;
    }, {});
    
    const stepDistribution = allFeedback.reduce((acc: any, f: FeedbackData) => {
      acc[f.step] = (acc[f.step] || 0) + 1;
      return acc;
    }, {});

    return {
      totalFeedback,
      averageRating: Math.round(averageRating * 10) / 10,
      categoryDistribution,
      stepDistribution
    };
  };

  const stats = getFeedbackStats();

  return (
    <>
      {/* 피드백 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          background: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          zIndex: 1001,
          fontSize: '18px',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
        }}
        aria-label="피드백 제출"
      >
        💬
      </button>

      {/* 피드백 모달 */}
      <FeedbackModal isOpen={isModalOpen}>
        <ModalContent>
          <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>
            사용자 경험 피드백
          </h3>
          
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            현재 단계: <strong>{currentStep}</strong>
          </p>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              카테고리:
            </label>
            <CategorySelect
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
            >
              <option value="usability">사용성</option>
              <option value="performance">성능</option>
              <option value="accessibility">접근성</option>
              <option value="bug">버그/오류</option>
            </CategorySelect>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              만족도 평가:
            </label>
            <RatingContainer>
              {[1, 2, 3, 4, 5].map((star) => (
                <RatingButton
                  key={star}
                  selected={rating === star}
                  onClick={() => setRating(star)}
                  aria-label={`${star}점`}
                >
                  {star}점
                </RatingButton>
              ))}
            </RatingContainer>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              추가 의견 (선택사항):
            </label>
            <TextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="개선 사항이나 문제점을 자유롭게 작성해주세요..."
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              취소
            </button>
            <button
              onClick={submitFeedback}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                background: '#3b82f6',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              제출
            </button>
          </div>

          {/* 피드백 통계 */}
          {stats.totalFeedback > 0 && (
            <div style={{ marginTop: '24px', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px' }}>피드백 통계</h4>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                <div>총 피드백: {stats.totalFeedback}개</div>
                <div>평균 평점: {stats.averageRating}/5</div>
                <div>가장 많은 피드백: {
                  Object.entries(stats.categoryDistribution)
                    .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || '없음'
                }</div>
              </div>
            </div>
          )}
        </ModalContent>
      </FeedbackModal>
      
      {/* 토스트 알림 */}
      <Toast show={showToast}>
        {toastMessage}
      </Toast>
    </>
  );
};

export default FeedbackCollector; 