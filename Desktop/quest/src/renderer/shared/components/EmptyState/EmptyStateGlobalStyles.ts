import { createGlobalStyle } from 'styled-components';

/**
 * 전역 Empty State 및 자동 높이 관리 스타일
 * 모든 컴포넌트에서 일관된 Empty State 동작을 보장
 */
export const EmptyStateGlobalStyles = createGlobalStyle`
  /* =================================
     전역 Empty State 규칙
     ================================= */
  
  /* 1. 기본 컨테이너 규칙 - 데이터 없을 때 불필요한 높이 제거 */
  .empty-state-container {
    min-height: auto !important;
    height: auto !important;
    padding-bottom: 0 !important;
    
    /* 스크롤바 제거 */
    overflow: visible !important;
    
    /* 불필요한 마진 제거 */
    margin-bottom: 0 !important;
  }
  
  /* 2. 테이블 Empty State */
  .table-empty-state {
    /* 테이블 셀 내부 Empty State */
    td& {
      padding: 40px 20px !important;
      text-align: center;
      vertical-align: middle;
      
      @media (max-width: 768px) {
        padding: 24px 16px !important;
      }
      
      @media (max-width: 480px) {
        padding: 16px 12px !important;
      }
    }
    
    /* 테이블 컨테이너 자체가 Empty일 때 */
    &.table-container {
      min-height: auto !important;
      
      /* 헤더만 있고 데이터 없을 때 */
      tbody:empty + * {
        display: none;
      }
    }
  }
  
  /* 3. 리스트/그리드 Empty State */
  .list-empty-state,
  .grid-empty-state {
    /* 컨테이너 높이 자동 조정 */
    min-height: auto !important;
    flex: none !important;
    
    /* 데이터 없을 때 패딩 최소화 */
    padding: 0 !important;
    
    /* 스크롤 제거 */
    overflow: visible !important;
  }
  
  /* 4. 카드 컴포넌트 Empty State */
  .card-empty-state {
    min-height: auto !important;
    padding: 0 !important;
    
    /* Empty 상태에서는 그림자 제거 */
    box-shadow: none !important;
    border: 1px solid #e5e7eb !important;
  }
  
  /* 5. 페이지 레벨 Empty State */
  .page-empty-state {
    /* 페이지 전체를 차지하는 Empty State */
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    
    @media (max-width: 768px) {
      min-height: 150px;
      padding: 48px 16px;
    }
    
    @media (max-width: 480px) {
      min-height: 120px;
      padding: 32px 12px;
    }
  }
  
  /* =================================
     자동 높이 관리 규칙
     ================================= */
  
  /* 6. 데이터 기반 높이 자동 조정 */
  .auto-height-container {
    /* 기본적으로 자동 높이 */
    height: auto !important;
    min-height: auto !important;
    
    /* 데이터가 있을 때만 적용되는 스타일 */
    &.has-data {
      /* 필요한 경우에만 스크롤 */
      overflow-y: auto;
      
      /* 적절한 최대 높이 (뷰포트 기준) */
      max-height: calc(100vh - 200px);
      
      @media (max-width: 768px) {
        max-height: calc(100vh - 150px);
      }
    }
    
    /* 데이터가 없을 때 */
    &.no-data {
      overflow: visible !important;
      max-height: none !important;
    }
  }
  
  /* 7. 반응형 패딩 자동 조정 */
  .responsive-padding {
    /* 데스크톱 */
    padding: 32px;
    
    /* 태블릿 */
    @media (max-width: 1024px) {
      padding: 24px;
    }
    
    /* 모바일 */
    @media (max-width: 768px) {
      padding: 16px;
    }
    
    /* 작은 모바일 */
    @media (max-width: 480px) {
      padding: 12px;
    }
    
    /* Empty State일 때는 패딩 제거 */
    &.empty-state {
      padding: 0 !important;
    }
  }
  
  /* =================================
     특수 케이스 예외 규칙
     ================================= */
  
  /* 8. 차트/그래프 컴포넌트 예외 */
  .chart-container,
  .graph-container,
  .dashboard-widget {
    /* 차트는 디자인상 최소 높이 필요 */
    min-height: 200px !important;
    
    /* Empty State도 최소 높이 유지 */
    .empty-state {
      min-height: inherit !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    
    @media (max-width: 768px) {
      min-height: 150px !important;
    }
  }
  
  /* 9. 모달/다이얼로그 내부 Empty State */
  .modal-content .empty-state,
  .dialog-content .empty-state {
    /* 모달 내부에서는 패딩 유지 */
    padding: 40px 24px !important;
    min-height: 120px !important;
    
    @media (max-width: 480px) {
      padding: 24px 16px !important;
      min-height: 80px !important;
    }
  }
  
  /* =================================
     애니메이션 및 전환 효과
     ================================= */
  
  /* 10. Empty State 전환 애니메이션 */
  .empty-state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    /* 데이터 로딩 중 */
    &.loading {
      opacity: 0.6;
      pointer-events: none;
    }
    
    /* Empty에서 데이터 있음으로 전환 */
    &.fade-in {
      animation: fadeIn 0.4s ease-out;
    }
    
    /* 데이터에서 Empty로 전환 */
    &.fade-out {
      animation: fadeOut 0.3s ease-in;
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-5px);
    }
  }
  
  /* =================================
     디버깅 및 개발 도구
     ================================= */
  
  /* 11. 개발 모드에서 Empty State 시각화 */
  .debug-empty-state {
    /* 개발 환경에서만 표시되는 디버그 정보 */
    &::before {
      content: "🔍 Empty State Debug";
      position: absolute;
      top: 0;
      right: 0;
      background: #fbbf24;
      color: #92400e;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 0 0 0 4px;
      font-family: monospace;
      z-index: 9999;
    }
    
    border: 1px dashed #fbbf24 !important;
    position: relative;
  }
`;

export default EmptyStateGlobalStyles;
