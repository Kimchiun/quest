import React from 'react';
import styled, { css } from 'styled-components';

// 자동 높이 관리 컨테이너 Props
export interface AutoHeightContainerProps {
  /** 자식 요소들 */
  children: React.ReactNode;
  /** 데이터 존재 여부 */
  hasData: boolean;
  /** 컨테이너 타입 */
  type?: 'table' | 'list' | 'grid' | 'card';
  /** 최소 높이 강제 (차트 등 특수 케이스) */
  forceMinHeight?: string;
  /** 커스텀 클래스 */
  className?: string;
  /** 패딩 제어 */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

// 패딩 설정
const paddingConfig = {
  none: '0',
  sm: '12px',
  md: '20px',
  lg: '32px'
};

// 타입별 기본 스타일
const typeStyles = {
  table: css<{ $hasData: boolean; $forceMinHeight?: string; $padding: string }>`
    /* 테이블 컨테이너 */
    width: 100%;
    background: white;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    
    /* 데이터가 있을 때는 자동 높이, 없을 때는 최소 높이 제거 */
    min-height: ${({ $hasData, $forceMinHeight }) => 
      $forceMinHeight || ($hasData ? 'auto' : 'auto')
    };
    
    /* 패딩은 내부 요소가 관리 */
    padding: 0;
  `,
  
  list: css<{ $hasData: boolean; $forceMinHeight?: string; $padding: string }>`
    /* 리스트 컨테이너 */
    width: 100%;
    background: white;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    
    min-height: ${({ $hasData, $forceMinHeight }) => 
      $forceMinHeight || ($hasData ? 'auto' : 'auto')
    };
    
    padding: ${({ $hasData, $padding }) => 
      $hasData ? paddingConfig[$padding] : '0'
    };
    
    /* 데이터가 없을 때 스크롤 제거 */
    overflow-y: ${({ $hasData }) => $hasData ? 'auto' : 'visible'};
  `,
  
  grid: css<{ $hasData: boolean; $forceMinHeight?: string; $padding: string }>`
    /* 그리드 컨테이너 */
    width: 100%;
    display: grid;
    gap: 16px;
    
    min-height: ${({ $hasData, $forceMinHeight }) => 
      $forceMinHeight || ($hasData ? 'auto' : 'auto')
    };
    
    padding: ${({ $hasData, $padding }) => 
      $hasData ? paddingConfig[$padding] : '0'
    };
    
    /* 데이터에 따른 그리드 설정 */
    grid-template-columns: ${({ $hasData }) => 
      $hasData ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr'
    };
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 12px;
      padding: ${({ $hasData, $padding }) => {
        if (!$hasData) return '0';
        const pad = parseInt(paddingConfig[$padding]);
        return `${pad * 0.7}px`;
      }};
    }
  `,
  
  card: css<{ $hasData: boolean; $forceMinHeight?: string; $padding: string }>`
    /* 카드 컨테이너 */
    width: 100%;
    background: white;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    
    min-height: ${({ $hasData, $forceMinHeight }) => 
      $forceMinHeight || ($hasData ? 'auto' : 'auto')
    };
    
    padding: ${({ $hasData, $padding }) => 
      $hasData ? paddingConfig[$padding] : '0'
    };
    
    /* Empty state일 때 그림자 제거 */
    box-shadow: ${({ $hasData }) => 
      $hasData ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
    };
  `
};

// 메인 컨테이너
const Container = styled.div<{
  $type: 'table' | 'list' | 'grid' | 'card';
  $hasData: boolean;
  $forceMinHeight?: string;
  $padding: 'none' | 'sm' | 'md' | 'lg';
}>`
  /* 기본 레이아웃 */
  width: 100%;
  position: relative;
  
  /* 타입별 스타일 적용 */
  ${({ $type }) => typeStyles[$type]}
  
  /* 공통 반응형 */
  @media (max-width: 480px) {
    border-radius: 8px;
  }
  
  /* 데이터 없을 때 전환 효과 */
  transition: min-height 0.3s ease, padding 0.3s ease;
`;

// 데이터 컨테이너 (실제 데이터가 들어가는 영역)
const DataContainer = styled.div<{ $hasData: boolean }>`
  width: 100%;
  
  /* 데이터가 있을 때만 필요한 스타일 */
  ${({ $hasData }) => $hasData && css`
    /* 스크롤 등 데이터 관련 스타일 */
  `}
`;

// 메인 컴포넌트
const AutoHeightContainer: React.FC<AutoHeightContainerProps> = ({
  children,
  hasData,
  type = 'list',
  forceMinHeight,
  className,
  padding = 'md'
}) => {
  return (
    <Container
      $type={type}
      $hasData={hasData}
      $forceMinHeight={forceMinHeight}
      $padding={padding}
      className={className}
    >
      <DataContainer $hasData={hasData}>
        {children}
      </DataContainer>
    </Container>
  );
};

export default AutoHeightContainer;
