import React from 'react';
import styled, { css } from 'styled-components';

// Empty State 타입 정의
export interface EmptyStateProps {
  /** 아이콘 (이모지 또는 컴포넌트) */
  icon?: React.ReactNode;
  /** 제목 */
  title: string;
  /** 설명 텍스트 */
  description?: string;
  /** 액션 버튼들 */
  actions?: React.ReactNode;
  /** 크기 변형 */
  size?: 'sm' | 'md' | 'lg';
  /** 컨테이너 타입 */
  container?: 'table' | 'card' | 'page' | 'inline';
  /** 커스텀 스타일 */
  className?: string;
  /** 최소 높이 강제 (차트/그래프 등 특수 케이스) */
  forceMinHeight?: boolean;
}

// 크기별 설정
const sizeConfig = {
  sm: {
    iconSize: '32px',
    titleSize: '14px',
    descriptionSize: '12px',
    padding: '24px 16px',
    gap: '8px'
  },
  md: {
    iconSize: '48px',
    titleSize: '16px', 
    descriptionSize: '14px',
    padding: '40px 24px',
    gap: '12px'
  },
  lg: {
    iconSize: '64px',
    titleSize: '20px',
    descriptionSize: '16px',
    padding: '60px 32px',
    gap: '16px'
  }
};

// 컨테이너별 스타일
const containerStyles = {
  table: css`
    /* 테이블 셀 내부에서 사용 */
    padding: 40px 20px;
    min-height: auto;
  `,
  card: css`
    /* 카드 컴포넌트 내부 */
    padding: 32px 20px;
    min-height: auto;
    border-radius: 8px;
  `,
  page: css`
    /* 전체 페이지 Empty State */
    padding: 80px 20px;
    min-height: 200px;
  `,
  inline: css`
    /* 인라인 컴포넌트 내부 */
    padding: 20px 16px;
    min-height: auto;
  `
};

// 메인 컨테이너
const EmptyContainer = styled.div<{
  $size: 'sm' | 'md' | 'lg';
  $container: 'table' | 'card' | 'page' | 'inline';
  $forceMinHeight: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #6b7280;
  background: transparent;
  
  /* 크기별 기본 패딩 */
  padding: ${({ $size }) => sizeConfig[$size].padding};
  gap: ${({ $size }) => sizeConfig[$size].gap};
  
  /* 컨테이너별 스타일 적용 */
  ${({ $container }) => containerStyles[$container]}
  
  /* 높이 관리 - 기본은 auto, 특수 케이스만 min-height */
  min-height: ${({ $forceMinHeight, $container }) => 
    $forceMinHeight 
      ? ($container === 'page' ? '300px' : '200px')
      : 'auto'
  };
  
  /* 반응형 패딩 조정 */
  @media (max-width: 768px) {
    padding: ${({ $size }) => {
      const config = sizeConfig[$size];
      const [vertical, horizontal] = config.padding.split(' ');
      const reducedVertical = parseInt(vertical) * 0.6;
      const reducedHorizontal = parseInt(horizontal) * 0.8;
      return `${reducedVertical}px ${reducedHorizontal}px`;
    }};
    gap: ${({ $size }) => {
      const gap = parseInt(sizeConfig[$size].gap);
      return `${gap * 0.75}px`;
    }};
  }
  
  @media (max-width: 480px) {
    padding: ${({ $size }) => {
      const config = sizeConfig[$size];
      const [vertical, horizontal] = config.padding.split(' ');
      const reducedVertical = parseInt(vertical) * 0.4;
      const reducedHorizontal = parseInt(horizontal) * 0.7;
      return `${reducedVertical}px ${reducedHorizontal}px`;
    }};
  }
`;

// 아이콘 컨테이너
const IconContainer = styled.div<{ $size: 'sm' | 'md' | 'lg' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => sizeConfig[$size].iconSize};
  height: ${({ $size }) => sizeConfig[$size].iconSize};
  font-size: ${({ $size }) => {
    const size = parseInt(sizeConfig[$size].iconSize);
    return `${size * 0.6}px`;
  }};
  color: #9ca3af;
  opacity: 0.7;
  
  /* 이모지가 아닌 컴포넌트인 경우 */
  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`;

// 제목
const Title = styled.h3<{ $size: 'sm' | 'md' | 'lg' }>`
  margin: 0;
  font-size: ${({ $size }) => sizeConfig[$size].titleSize};
  font-weight: 600;
  color: #374151;
  line-height: 1.4;
`;

// 설명
const Description = styled.p<{ $size: 'sm' | 'md' | 'lg' }>`
  margin: 0;
  font-size: ${({ $size }) => sizeConfig[$size].descriptionSize};
  color: #6b7280;
  line-height: 1.5;
  max-width: 400px;
  
  @media (max-width: 480px) {
    max-width: 280px;
    font-size: ${({ $size }) => {
      const size = parseInt(sizeConfig[$size].descriptionSize);
      return `${size - 1}px`;
    }};
  }
`;

// 액션 컨테이너
const ActionsContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 100%;
    max-width: 200px;
  }
`;

// 메인 컴포넌트
const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📄',
  title,
  description,
  actions,
  size = 'md',
  container = 'inline',
  className,
  forceMinHeight = false
}) => {
  return (
    <EmptyContainer
      $size={size}
      $container={container}
      $forceMinHeight={forceMinHeight}
      className={className}
    >
      <IconContainer $size={size}>
        {icon}
      </IconContainer>
      
      <Title $size={size}>
        {title}
      </Title>
      
      {description && (
        <Description $size={size}>
          {description}
        </Description>
      )}
      
      {actions && (
        <ActionsContainer>
          {actions}
        </ActionsContainer>
      )}
    </EmptyContainer>
  );
};

export default EmptyState;
