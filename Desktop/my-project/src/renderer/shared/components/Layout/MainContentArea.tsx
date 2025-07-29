import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { PageTransition } from '../Animation';
import { useLoadingAnimation } from '../Animation/useAnimation';
import { Skeleton } from '../Animation/Skeleton';

// 메인 컨텐츠 컨테이너
const MainContentContainer = styled.div<{ 
  viewMode: 'compact' | 'default' | 'spacious';
  isLoading: boolean;
}>`
  grid-area: main;
  background: #f8f9fa;
  padding: ${props => {
    switch (props.viewMode) {
      case 'compact': return '20px';
      case 'spacious': return '40px';
      default: return '30px';
    }
  }};
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  
  // 반응형 패딩
  @media (max-width: 768px) {
    padding: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
  }
  
  // 로딩 상태일 때 스크롤 방지
  ${props => props.isLoading && `
    overflow: hidden;
  `}
`;

// 콘텐츠 래퍼
const ContentWrapper = styled.div<{ viewMode: 'compact' | 'default' | 'spacious' }>`
  max-width: ${props => {
    switch (props.viewMode) {
      case 'compact': return '1400px';
      case 'spacious': return '1200px';
      default: return '1300px';
    }
  }};
  margin: 0 auto;
  width: 100%;
  
  // 그리드 레이아웃
  display: grid;
  gap: ${props => {
    switch (props.viewMode) {
      case 'compact': return '16px';
      case 'spacious': return '32px';
      default: return '24px';
    }
  }};
  
  // 반응형 그리드
  @media (min-width: 1200px) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
  
  @media (max-width: 1199px) and (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
  
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`;

// 뷰 모드 컨트롤
const ViewModeControl = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  
  @media (max-width: 768px) {
    position: static;
    margin-bottom: 16px;
    justify-content: center;
  }
`;

const ViewModeButton = styled.button<{ active: boolean }>`
  padding: 6px 12px;
  border: 1px solid ${props => props.active ? '#3b82f6' : '#e2e8f0'};
  background: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#64748b'};
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? '#2563eb' : '#f1f5f9'};
  }
  
  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

// 로딩 오버레이
const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(2px);
`;

// 페이지 타입별 스타일
const PageContainer = styled.div<{ pageType: 'dashboard' | 'list' | 'detail' | 'form' }>`
  width: 100%;
  
  ${props => {
    switch (props.pageType) {
      case 'dashboard':
        return `
          // 대시보드: 위젯 기반 그리드
          display: grid;
          gap: 24px;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          
          @media (max-width: 768px) {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        `;
      case 'list':
        return `
          // 목록 뷰: 테이블 또는 카드 리스트
          display: flex;
          flex-direction: column;
          gap: 16px;
        `;
      case 'detail':
        return `
          // 상세 뷰: 섹션 기반 레이아웃
          display: grid;
          gap: 24px;
          grid-template-columns: 1fr;
          
          @media (min-width: 1024px) {
            grid-template-columns: 2fr 1fr;
          }
        `;
      case 'form':
        return `
          // 폼 뷰: 섹션별 분리
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 800px;
          margin: 0 auto;
        `;
      default:
        return '';
    }
  }}
`;

// 섹션 컨테이너
const SectionContainer = styled.section<{ 
  variant: 'card' | 'panel' | 'section';
  spacing: 'compact' | 'default' | 'spacious';
}>`
  background: white;
  border-radius: ${props => props.variant === 'card' ? '12px' : '8px'};
  border: ${props => props.variant === 'card' ? '1px solid #e2e8f0' : 'none'};
  box-shadow: ${props => props.variant === 'card' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'};
  padding: ${props => {
    switch (props.spacing) {
      case 'compact': return '16px';
      case 'spacious': return '32px';
      default: return '24px';
    }
  }};
  margin-bottom: ${props => {
    switch (props.spacing) {
      case 'compact': return '12px';
      case 'spacious': return '24px';
      default: return '16px';
    }
  }};
  
  // 호버 효과 (카드인 경우)
  ${props => props.variant === 'card' && `
    transition: all 0.2s ease;
    cursor: pointer;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }
  `}
`;

// 섹션 헤더
const SectionHeader = styled.div<{ level: 1 | 2 | 3 }>`
  margin-bottom: ${props => {
    switch (props.level) {
      case 1: return '24px';
      case 2: return '16px';
      case 3: return '12px';
    }
  }};
  
  h${props => props.level} {
    font-size: ${props => {
      switch (props.level) {
        case 1: return '24px';
        case 2: return '20px';
        case 3: return '16px';
      }
    }};
    font-weight: ${props => props.level === 1 ? '600' : '500'};
    color: #1e293b;
    margin: 0;
    
    // 서브타이틀
    + p {
      margin: 4px 0 0 0;
      color: #64748b;
      font-size: 14px;
    }
  }
`;

// 액션 버튼 그룹
const ActionButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

// Primary 액션 버튼
const PrimaryButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #2563eb;
  }
  
  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`;

// Secondary 액션 버튼
const SecondaryButton = styled.button`
  background: white;
  color: #3b82f6;
  border: 1px solid #3b82f6;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8fafc;
  }
  
  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

interface MainContentAreaProps {
  children: React.ReactNode;
  pageType?: 'dashboard' | 'list' | 'detail' | 'form';
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  loading?: boolean;
  showViewModeControl?: boolean;
}

const MainContentArea: React.FC<MainContentAreaProps> = ({
  children,
  pageType = 'dashboard',
  title,
  subtitle,
  actions,
  loading = false,
  showViewModeControl = true
}) => {
  const [viewMode, setViewMode] = useState<'compact' | 'default' | 'spacious'>('default');
  const showSkeleton = useLoadingAnimation(loading);

  const handleViewModeChange = useCallback((mode: 'compact' | 'default' | 'spacious') => {
    setViewMode(mode);
  }, []);

  return (
    <MainContentContainer viewMode={viewMode} isLoading={loading}>
      {showViewModeControl && (
        <ViewModeControl>
          <span style={{ fontSize: '12px', color: '#64748b' }}>뷰:</span>
          <ViewModeButton 
            active={viewMode === 'compact'} 
            onClick={() => handleViewModeChange('compact')}
          >
            콤팩트
          </ViewModeButton>
          <ViewModeButton 
            active={viewMode === 'default'} 
            onClick={() => handleViewModeChange('default')}
          >
            기본
          </ViewModeButton>
          <ViewModeButton 
            active={viewMode === 'spacious'} 
            onClick={() => handleViewModeChange('spacious')}
          >
            여유
          </ViewModeButton>
        </ViewModeControl>
      )}

      <PageTransition location={pageType} classNames="fade">
        <ContentWrapper viewMode={viewMode}>
          {(title || actions) && (
            <SectionContainer variant="panel" spacing={viewMode}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {(title || subtitle) && (
                  <SectionHeader level={1}>
                    {title && <h1>{title}</h1>}
                    {subtitle && <p>{subtitle}</p>}
                  </SectionHeader>
                )}
                {actions && (
                  <ActionButtonGroup>
                    {actions}
                  </ActionButtonGroup>
                )}
              </div>
            </SectionContainer>
          )}

          <PageContainer pageType={pageType}>
            {showSkeleton ? (
              <LoadingOverlay>
                <div style={{ textAlign: 'center' }}>
                  <Skeleton width="200px" height="24px" />
                  <div style={{ marginTop: '16px' }}>
                    <Skeleton width="300px" height="16px" />
                    <Skeleton width="250px" height="16px" />
                  </div>
                </div>
              </LoadingOverlay>
            ) : (
              children
            )}
          </PageContainer>
        </ContentWrapper>
      </PageTransition>
    </MainContentContainer>
  );
};

export default MainContentArea;
export { 
  SectionContainer, 
  SectionHeader, 
  ActionButtonGroup, 
  PrimaryButton, 
  SecondaryButton 
}; 