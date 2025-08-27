# Empty State 시스템 가이드

## 개요

ITMS 시스템 전체에서 일관된 Empty State 경험을 제공하기 위한 컴포넌트 및 규칙 시스템입니다.

## 핵심 원칙

1. **자동 높이 관리**: 데이터가 없을 때 불필요한 빈공간 제거
2. **일관된 디자인**: 모든 Empty State에서 동일한 시각적 패턴
3. **반응형 지원**: 모든 화면 크기에서 적절한 표시
4. **접근성 고려**: 스크린 리더 및 키보드 네비게이션 지원

## 컴포넌트 구조

### 1. EmptyState 컴포넌트
메인 Empty State 표시 컴포넌트

```tsx
import EmptyState from '@/shared/components/EmptyState';

<EmptyState
  icon="📝"
  title="데이터가 없습니다"
  description="새로운 항목을 추가해보세요."
  size="md"
  container="card"
  actions={
    <Button onClick={handleCreate}>
      새로 만들기
    </Button>
  }
/>
```

#### Props
- `icon`: 아이콘 (이모지 또는 React 컴포넌트)
- `title`: 제목 (필수)
- `description`: 설명 텍스트
- `size`: 크기 (`sm`, `md`, `lg`)
- `container`: 컨테이너 타입 (`table`, `card`, `page`, `inline`)
- `actions`: 액션 버튼들
- `forceMinHeight`: 최소 높이 강제 (차트 등 특수 케이스)

### 2. AutoHeightContainer 컴포넌트
자동 높이 관리를 위한 래퍼 컴포넌트

```tsx
import AutoHeightContainer from '@/shared/components/EmptyState/AutoHeightContainer';

<AutoHeightContainer 
  hasData={items.length > 0} 
  type="list"
>
  {items.length === 0 ? (
    <EmptyState ... />
  ) : (
    <ItemList items={items} />
  )}
</AutoHeightContainer>
```

#### Props
- `hasData`: 데이터 존재 여부 (필수)
- `type`: 컨테이너 타입 (`table`, `list`, `grid`, `card`)
- `forceMinHeight`: 최소 높이 강제
- `padding`: 패딩 설정 (`none`, `sm`, `md`, `lg`)

## 사용 가이드

### 테이블에서 사용
```tsx
// 테이블 셀 내부
<TableCell colSpan={columns.length} className="table-empty-state">
  <EmptyState
    icon="📋"
    title="데이터가 없습니다"
    size="sm"
    container="table"
  />
</TableCell>
```

### 리스트에서 사용
```tsx
<AutoHeightContainer hasData={items.length > 0} type="list">
  {items.length === 0 ? (
    <EmptyState
      icon="📝"
      title="항목이 없습니다"
      container="card"
    />
  ) : (
    <ItemList items={items} />
  )}
</AutoHeightContainer>
```

### 그리드에서 사용
```tsx
<AutoHeightContainer hasData={items.length > 0} type="grid">
  {items.length === 0 ? (
    <EmptyState
      icon="🎯"
      title="결과가 없습니다"
      container="page"
      size="lg"
    />
  ) : (
    <GridView items={items} />
  )}
</AutoHeightContainer>
```

### 페이지 레벨에서 사용
```tsx
<div className="page-empty-state">
  <EmptyState
    icon="🚀"
    title="시작해보세요"
    description="첫 번째 프로젝트를 생성하여 시작하세요."
    size="lg"
    container="page"
    actions={
      <Button variant="primary" onClick={handleCreate}>
        프로젝트 생성
      </Button>
    }
  />
</div>
```

## 전역 CSS 클래스

자동으로 적용되는 전역 클래스들:

- `.empty-state-container`: 기본 Empty State 컨테이너
- `.table-empty-state`: 테이블 내부 Empty State
- `.list-empty-state`: 리스트 Empty State
- `.grid-empty-state`: 그리드 Empty State
- `.card-empty-state`: 카드 Empty State
- `.page-empty-state`: 페이지 레벨 Empty State
- `.auto-height-container`: 자동 높이 관리 컨테이너
- `.has-data`: 데이터 있음 상태
- `.no-data`: 데이터 없음 상태

## 특수 케이스

### 차트/그래프 컴포넌트
```tsx
<div className="chart-container">
  <AutoHeightContainer 
    hasData={chartData.length > 0}
    forceMinHeight="200px"
  >
    {chartData.length === 0 ? (
      <EmptyState
        icon="📊"
        title="차트 데이터가 없습니다"
        forceMinHeight={true}
      />
    ) : (
      <Chart data={chartData} />
    )}
  </AutoHeightContainer>
</div>
```

### 모달 내부
```tsx
<div className="modal-content">
  <EmptyState
    icon="🔍"
    title="검색 결과가 없습니다"
    size="sm"
  />
</div>
```

## 반응형 동작

- **데스크톱**: 전체 패딩과 아이콘 크기 적용
- **태블릿**: 패딩 20% 감소, 아이콘 크기 유지
- **모바일**: 패딩 40% 감소, 텍스트 크기 조정
- **작은 모바일**: 패딩 60% 감소, 액션 버튼 세로 배치

## 마이그레이션 가이드

### 기존 컴포넌트 업데이트

1. **기존 Empty State 스타일 컴포넌트 제거**
```tsx
// 제거할 코드
const EmptyState = styled.div`
  min-height: 400px;
  padding: 60px 20px;
  // ...
`;
```

2. **새로운 컴포넌트 import**
```tsx
import EmptyState from '@/shared/components/EmptyState';
import AutoHeightContainer from '@/shared/components/EmptyState/AutoHeightContainer';
```

3. **컨테이너 래핑**
```tsx
// 기존
<Container>
  {items.length === 0 ? <CustomEmptyState /> : <ItemList />}
</Container>

// 새로운 방식
<AutoHeightContainer hasData={items.length > 0} type="list">
  {items.length === 0 ? 
    <EmptyState icon="📝" title="항목이 없습니다" /> : 
    <ItemList items={items} />
  }
</AutoHeightContainer>
```

## 디버깅

개발 모드에서 Empty State 디버깅을 위해 `.debug-empty-state` 클래스를 추가하면 시각적 표시가 나타납니다:

```tsx
<EmptyState 
  className="debug-empty-state"
  // ... props
/>
```

## 성능 고려사항

- Empty State 컴포넌트는 가벼우며 렌더링 비용이 낮습니다
- AutoHeightContainer는 데이터 변경 시에만 리렌더링됩니다
- CSS 전환 효과는 GPU 가속을 사용합니다

## 접근성

- 모든 Empty State는 적절한 ARIA 라벨을 가집니다
- 키보드 네비게이션이 가능합니다
- 스크린 리더에서 의미있는 텍스트를 제공합니다
- 색상에만 의존하지 않는 정보 전달

## 업데이트 및 확장

새로운 Empty State 패턴이 필요한 경우:

1. `EmptyState/index.tsx`에서 새로운 `container` 타입 추가
2. `AutoHeightContainer.tsx`에서 해당 타입 스타일 정의
3. `EmptyStateGlobalStyles.ts`에서 전역 규칙 추가
4. 이 README 업데이트

## 예제 모음

더 많은 사용 예제는 `src/renderer/shared/components/EmptyState/examples/` 디렉토리를 참조하세요.
