import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme';

export interface ViewToggleProps {
  variant: 'default' | 'compact' | 'expanded';
  onVariantChange: (variant: 'default' | 'compact' | 'expanded') => void;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ToggleContainer = styled.div<{ $size: string }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  
  ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return `font-size: ${theme.font.size.sm};`;
      case 'lg':
        return `font-size: ${theme.font.size.lg};`;
      default:
        return `font-size: ${theme.font.size.md};`;
    }
  }}
`;

const ToggleButton = styled.button<{
  $active: boolean;
  $size: string;
}>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme, $size }) => {
    switch ($size) {
      case 'sm':
        return `${theme.spacing[1]} ${theme.spacing[2]}`;
      case 'lg':
        return `${theme.spacing[3]} ${theme.spacing[4]}`;
      default:
        return `${theme.spacing[2]} ${theme.spacing[3]}`;
    }
  }};
  border: 1px solid ${({ theme, $active }) => 
    $active ? theme.color.primary[500] : theme.color.border.primary
  };
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $active }) => 
    $active ? theme.color.primary[500] : theme.color.surface.primary
  };
  color: ${({ theme, $active }) => 
    $active ? 'white' : theme.color.text.primary
  };
  cursor: pointer;
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.out};
  
  &:hover {
    background: ${({ theme, $active }) => 
      $active ? theme.color.primary[600] : theme.color.surface.secondary
    };
    border-color: ${({ theme, $active }) => 
      $active ? theme.color.primary[600] : theme.color.border.secondary
    };
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.color.primary[200]};
    outline-offset: 2px;
  }
`;

const ViewToggle: React.FC<ViewToggleProps> = ({
  variant,
  onVariantChange,
  showLabels = true,
  size = 'md'
}) => {
  const getIcon = (viewType: string) => {
    switch (viewType) {
      case 'compact':
        return '⊞';
      case 'expanded':
        return '⊟';
      default:
        return '⊡';
    }
  };

  const getLabel = (viewType: string) => {
    switch (viewType) {
      case 'compact':
        return '콤팩트';
      case 'expanded':
        return '확장';
      default:
        return '기본';
    }
  };

  return (
    <ToggleContainer $size={size}>
      {(['compact', 'default', 'expanded'] as const).map((viewType) => (
        <ToggleButton
          key={viewType}
          $active={variant === viewType}
          $size={size}
          onClick={() => onVariantChange(viewType)}
          aria-label={`${getLabel(viewType)} 뷰로 전환`}
        >
          <span>{getIcon(viewType)}</span>
          {showLabels && <span>{getLabel(viewType)}</span>}
        </ToggleButton>
      ))}
    </ToggleContainer>
  );
};

export default ViewToggle;

/**
 * # 메인 컨텐트 영역 레이아웃 API 문서
 * 
 * ## MainContentLayout
 * 
 * 메인 컨텐트 영역의 공통 레이아웃 컴포넌트입니다.
 * 
 * ### Props
 * 
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | `viewType` | `'dashboard' \| 'list' \| 'detail' \| 'form'` | - | 뷰 타입 (필수) |
 * | `variant` | `'default' \| 'compact' \| 'expanded'` | `'default'` | 레이아웃 변형 |
 * | `leftPanel` | `React.ReactNode` | - | 좌측 패널 내용 |
 * | `centerPanel` | `React.ReactNode` | - | 중앙 패널 내용 |
 * | `rightPanel` | `React.ReactNode` | - | 우측 패널 내용 |
 * | `showLeftPanel` | `boolean` | `true` | 좌측 패널 표시 여부 |
 * | `showRightPanel` | `boolean` | `true` | 우측 패널 표시 여부 |
 * | `leftPanelWidth` | `number` | - | 좌측 패널 너비 (px) |
 * | `rightPanelWidth` | `number` | - | 우측 패널 너비 (px) |
 * | `className` | `string` | - | CSS 클래스명 |
 * 
 * ### 사용 예시
 * 
 * ```tsx
 * <MainContentLayout
 *   viewType="dashboard"
 *   variant="default"
 *   leftPanel={<FilterPanel />}
 *   centerPanel={<DashboardContent />}
 *   rightPanel={<WidgetPanel />}
 * />
 * ```
 * 
 * ## ViewLayouts
 * 
 * 각 뷰 타입별로 최적화된 레이아웃 컴포넌트들입니다.
 * 
 * ### DashboardLayout
 * 
 * 대시보드 뷰에 최적화된 레이아웃입니다.
 * 
 * #### Props
 * 
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | `variant` | `LayoutVariant` | `'default'` | 레이아웃 변형 |
 * | `showFilters` | `boolean` | `true` | 필터 표시 여부 |
 * | `showWidgets` | `boolean` | `true` | 위젯 표시 여부 |
 * 
 * ### ListLayout
 * 
 * 목록 뷰에 최적화된 레이아웃입니다.
 * 
 * #### Props
 * 
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | `variant` | `LayoutVariant` | `'default'` | 레이아웃 변형 |
 * | `showSearch` | `boolean` | `true` | 검색 표시 여부 |
 * | `showFilters` | `boolean` | `true` | 필터 표시 여부 |
 * | `showActions` | `boolean` | `true` | 액션 버튼 표시 여부 |
 * 
 * ### DetailLayout
 * 
 * 상세 뷰에 최적화된 레이아웃입니다.
 * 
 * #### Props
 * 
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | `variant` | `LayoutVariant` | `'default'` | 레이아웃 변형 |
 * | `showActions` | `boolean` | `true` | 액션 버튼 표시 여부 |
 * | `showTabs` | `boolean` | `true` | 탭 표시 여부 |
 * 
 * ### FormLayout
 * 
 * 폼 뷰에 최적화된 레이아웃입니다.
 * 
 * #### Props
 * 
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | `variant` | `LayoutVariant` | `'default'` | 레이아웃 변형 |
 * | `showActions` | `boolean` | `true` | 액션 버튼 표시 여부 |
 * | `showValidation` | `boolean` | `true` | 유효성 검사 표시 여부 |
 * 
 * ## ControlComponents
 * 
 * 컨트롤 컴포넌트들의 배치 및 동작 가이드라인입니다.
 * 
 * ### SearchControl
 * 
 * 검색 기능을 제공하는 컴포넌트입니다.
 * 
 * #### Props
 * 
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | `placeholder` | `string` | `'검색...'` | 플레이스홀더 텍스트 |
 * | `value` | `string` | `''` | 검색어 값 |
 * | `onChange` | `(value: string) => void` | - | 값 변경 핸들러 |
 * | `onSearch` | `(value: string) => void` | - | 검색 실행 핸들러 |
 * | `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 크기 |
 * | `variant` | `'default' \| 'outlined' \| 'filled'` | `'default'` | 스타일 변형 |
 * 
 * ### FilterControl
 * 
 * 필터링 기능을 제공하는 컴포넌트입니다.
 * 
 * #### Props
 * 
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | `filters` | `FilterConfig[]` | - | 필터 설정 (필수) |
 * | `values` | `Record<string, any>` | - | 필터 값 (필수) |
 * | `onChange` | `(key: string, value: any) => void` | - | 값 변경 핸들러 (필수) |
 * | `onApply` | `() => void` | - | 적용 핸들러 (필수) |
 * | `onClear` | `() => void` | - | 초기화 핸들러 (필수) |
 * 
 * ### SortControl
 * 
 * 정렬 기능을 제공하는 컴포넌트입니다.
 * 
 * #### Props
 * 
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | `options` | `SortOption[]` | - | 정렬 옵션 (필수) |
 * | `value` | `string` | - | 현재 정렬 필드 (필수) |
 * | `direction` | `'asc' \| 'desc'` | - | 정렬 방향 (필수) |
 * | `onChange` | `(key: string, direction: 'asc' \| 'desc') => void` | - | 변경 핸들러 (필수) |
 * 
 * ### StatusDisplay
 * 
 * 상태 정보를 표시하는 컴포넌트입니다.
 * 
 * #### Props
 * 
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | `status` | `'success' \| 'warning' \| 'error' \| 'info' \| 'neutral'` | - | 상태 타입 (필수) |
 * | `text` | `string` | - | 표시 텍스트 (필수) |
 * | `count` | `number` | - | 개수 |
 * | `showCount` | `boolean` | `false` | 개수 표시 여부 |
 * 
 * ### ActionButton
 * 
 * 액션 버튼 컴포넌트입니다.
 * 
 * #### Props
 * 
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | `type` | `'primary' \| 'secondary' \| 'danger' \| 'success' \| 'warning'` | - | 버튼 타입 (필수) |
 * | `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 크기 |
 * | `variant` | `'solid' \| 'outline' \| 'ghost'` | `'solid'` | 스타일 변형 |
 * | `disabled` | `boolean` | `false` | 비활성화 여부 |
 * | `loading` | `boolean` | `false` | 로딩 상태 |
 * | `icon` | `React.ReactNode` | - | 아이콘 |
 * | `children` | `React.ReactNode` | - | 버튼 텍스트 (필수) |
 * | `onClick` | `() => void` | - | 클릭 핸들러 |
 * 
 * ## ViewToggle
 * 
 * 뷰 변형을 토글하는 컴포넌트입니다.
 * 
 * #### Props
 * 
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | `variant` | `'default' \| 'compact' \| 'expanded'` | - | 현재 변형 (필수) |
 * | `onVariantChange` | `(variant: 'default' \| 'compact' \| 'expanded') => void` | - | 변형 변경 핸들러 (필수) |
 * | `showLabels` | `boolean` | `true` | 라벨 표시 여부 |
 * | `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 크기 |
 * 
 * ## 레이아웃 가이드라인
 * 
 * ### 1. 정보 밀도
 * - **대시보드**: 높은 정보 밀도, 위젯 기반 레이아웃
 * - **목록**: 중간 정보 밀도, 테이블/카드 기반 레이아웃
 * - **상세**: 낮은 정보 밀도, 폼/탭 기반 레이아웃
 * - **폼**: 최소 정보 밀도, 단일 컬럼 레이아웃
 * 
 * ### 2. 시각적 계층
 * - 헤더 → 툴바 → 컨텐츠 → 액션 순서
 * - 중요도에 따른 색상 및 크기 구분
 * - 일관된 간격 및 정렬 사용
 * 
 * ### 3. 그룹화
 * - 관련 기능들을 논리적으로 그룹화
 * - 시각적 구분선 및 여백 활용
 * - 계층적 정보 구조 표현
 * 
 * ### 4. 반응형
 * - 데스크톱: 3분할 레이아웃
 * - 태블릿: 2분할 레이아웃
 * - 모바일: 단일 컬럼 레이아웃
 * 
 * ### 5. 액션 버튼 구분
 * - **Primary**: 주요 액션 (저장, 확인 등)
 * - **Secondary**: 보조 액션 (취소, 뒤로 등)
 * - **Danger**: 위험 액션 (삭제, 취소 등)
 * - **Success**: 성공 액션 (완료, 승인 등)
 * - **Warning**: 경고 액션 (주의, 확인 등)
 */ 