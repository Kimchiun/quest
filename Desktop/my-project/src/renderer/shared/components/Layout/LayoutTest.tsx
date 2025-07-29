import React from 'react';
import styled from 'styled-components';

const TestContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const TestSection = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: #f8f9fa;
`;

const TestTitle = styled.h3`
  margin: 0 0 12px 0;
  color: #2c3e50;
  font-size: 18px;
`;

const TestContent = styled.div`
  color: #6c757d;
  font-size: 14px;
`;

const LayoutTest: React.FC = () => {
  return (
    <TestContainer>
      <TestTitle>레이아웃 테스트</TestTitle>
      
      <TestSection>
        <TestTitle>해상도별 테스트</TestTitle>
        <TestContent>
          <p>• 1024px - 태블릿 레이아웃</p>
          <p>• 1440px - 데스크톱 레이아웃</p>
          <p>• 1920px - 와이드 스크린 레이아웃</p>
        </TestContent>
      </TestSection>

      <TestSection>
        <TestTitle>컴포넌트 구조</TestTitle>
        <TestContent>
          <p>• 좌측 네비게이션: 280px (고정)</p>
          <p>• 상단 헤더: 60px (고정)</p>
          <p>• 메인 컨텐츠: 나머지 영역</p>
        </TestContent>
      </TestSection>

      <TestSection>
        <TestTitle>반응형 동작</TestTitle>
        <TestContent>
          <p>• 768px 이하: 모바일 레이아웃</p>
          <p>• 1024px 이하: 태블릿 레이아웃</p>
          <p>• 1024px 초과: 데스크톱 레이아웃</p>
        </TestContent>
      </TestSection>

      <TestSection>
        <TestTitle>접근성</TestTitle>
        <TestContent>
          <p>• 키보드 네비게이션 지원</p>
          <p>• 스크린 리더 호환성</p>
          <p>• 고대비 모드 지원</p>
        </TestContent>
      </TestSection>
    </TestContainer>
  );
};

export default LayoutTest; 