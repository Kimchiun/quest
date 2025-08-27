# Quest - 지능형 테스트 관리 시스템

## 프로젝트 개요

Quest는 테스트 계획, 실행, 결과 추적 및 결함 관리를 간소화하는 데스크톱 애플리케이션입니다. 사용자 친화적인 UX와 AI 기반 통찰력을 결합하여 QA 생산성을 높이고 소프트웨어 품질을 향상하며 팀 간 협업을 개선하는 것을 목표로 합니다.

### 주요 목표
- **40% 테스트 준비 시간 단축**
- **30% 결함 처리 시간 단축**  
- **90% 이상 주간 활성 QA 사용자 달성**
- **2초 미만 평균 화면 응답 시간** (5천 동시 케이스 처리 시)

## 기술 스택

### 프론트엔드
- **Electron**: 데스크톱 애플리케이션 프레임워크
- **React**: UI 라이브러리
- **Redux Toolkit**: 상태 관리
- **TypeScript**: 타입 안전성

### 백엔드
- **Node.js**: 서버 런타임
- **Express.js**: 웹 프레임워크
- **PostgreSQL**: 관계형 데이터베이스
- **Elasticsearch**: 검색 엔진

### 개발 도구
- **Jest**: 테스트 프레임워크
- **Cypress**: E2E 테스트
- **Webpack**: 번들러
- **ESLint**: 코드 품질 관리

## 빠른 시작

### 1. 개발 환경 설정

```bash
# 저장소 클론
git clone <repository-url>
cd quest

# 개발 환경 자동 설정
npm run setup

# 또는 수동 설정
npm install
cp env.example .env
# .env 파일을 편집하여 데이터베이스 설정을 구성하세요
```

### 2. 데이터베이스 설정

PostgreSQL이 필요합니다:

```bash
# macOS
brew install postgresql
brew services start postgresql

# 데이터베이스 생성
createdb quest_db
```

### 3. 개발 서버 시작

```bash
# 모든 서비스 한 번에 시작 (권장)
npm run dev:stable

# 또는 개별적으로 시작
npm run dev:backend  # 백엔드 서버 (포트 3001)
npm run dev:react    # 프론트엔드 개발 서버 (포트 4000)
npm run dev:electron # Electron 앱
```

## 프로젝트 구조

```
quest/
├── src/
│   ├── main/                    # Electron Main Process (Node.js 백엔드)
│   │   ├── app/
│   │   │   ├── domains/         # 도메인별 모듈
│   │   │   ├── infrastructure/  # DB 연결, 외부 API
│   │   │   └── shared/          # 공통 유틸리티
│   │   ├── electron/            # Electron 관련 파일
│   │   └── index.ts             # 백엔드 서버 시작점
│   │
│   ├── renderer/                # Electron Renderer Process (React 프론트엔드)
│   │   ├── app/                 # React 앱
│   │   ├── features/            # 기능별 모듈
│   │   ├── shared/              # 공통 컴포넌트
│   │   └── store/               # Redux 스토어
│   │
│   └── types/                   # 전역 타입 정의
│
├── tests/                       # 테스트 파일
├── cypress/                     # E2E 테스트
├── scripts/                     # 빌드, 배포 스크립트
└── docs/                        # 문서
```

## 주요 기능

### 테스트 케이스 관리
- 테스트 케이스 CRUD 작업
- 버전 이력 및 롤백
- 고급 검색 및 필터링
- 태그 및 카테고리 관리

### 릴리즈 및 스위트 계획
- 릴리즈 및 반복 계획 정의
- 드래그 앤 드롭으로 케이스 할당
- 실행자, 환경, 마감일 지정
- 집계된 상태 표시

### 테스트 실행 및 결과 기록
- Pass/Fail/Blocked/Untested 상태 선택
- 실패 상세 정보 (재현 단계, 스크린샷, 로그)
- 오프라인 실행 및 자동 동기화
- 실행 기록 히스토리

### 결함 관리 통합
- ITMS 내부 또는 Jira/Redmine으로 원클릭 결함 생성
- 양방향 상태 동기화
- REST API를 통한 외부 시스템 연동

### 대시보드 및 보고서
- 실시간 차트 (진행률, 결함 밀도, 테스터 작업량)
- 드래그 앤 드롭 위젯 커스터마이징
- 사용자 정의 차트 및 보고서

### 사용자 및 역할 관리
- 역할 기반 접근 제어 (RBAC)
- Admin, QA, Dev, PM 역할
- SAML/OAuth2를 통한 SSO 연동

### 협업 기능
- 케이스, 실행, 결함에 대한 댓글 및 @멘션
- 인앱 및 이메일 알림 센터
- 실시간 협업 편집

## 개발 가이드

### 코드 스타일

#### TypeScript/JavaScript
- **명명 규칙**: camelCase (변수, 함수), PascalCase (클래스, 컴포넌트)
- **임포트 순서**: 외부 라이브러리 → 내부 모듈 → 상대 경로
- **에러 처리**: try-catch 블록 사용, 사용자 친화적 메시지 제공

#### React 컴포넌트
- **함수형 컴포넌트** 사용
- **커스텀 훅**으로 로직 분리
- **Props 타입 정의** 필수
- **단일 책임 원칙** 준수

### 테스트 작성

#### 단위 테스트 (Jest)
```typescript
describe('Test Case Service', () => {
  it('should create a new test case', async () => {
    const testCase = await createTestCase({
      title: 'Login Test',
      steps: ['Enter username', 'Enter password', 'Click login']
    });
    
    expect(testCase.title).toBe('Login Test');
    expect(testCase.steps).toHaveLength(3);
  });
});
```

#### E2E 테스트 (Cypress)
```typescript
describe('Test Case Management', () => {
  it('should create and edit test case', () => {
    cy.visit('/test-cases');
    cy.get('[data-testid="create-button"]').click();
    cy.get('[data-testid="title-input"]').type('New Test Case');
    cy.get('[data-testid="save-button"]').click();
    cy.contains('New Test Case').should('be.visible');
  });
});
```

### API 개발

#### RESTful API 설계
- **자원 중심 URL**: `/testcases`, `/releases/{id}/testcases`
- **HTTP 메서드**: GET, POST, PUT, DELETE 적절히 사용
- **상태 코드**: 200, 201, 400, 404, 500 등 명확히 사용
- **JSON 응답**: 일관된 응답 형식 유지

#### 에러 처리
```typescript
// 서버 에러 응답
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "제목은 필수입니다",
    "details": {
      "field": "title",
      "value": ""
    }
  }
}
```

## 환경 설정

### 환경 변수

`.env` 파일을 생성하고 다음 설정을 구성하세요:

```env
# 데이터베이스
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quest_db
DB_USER=postgres
DB_PASSWORD=your_password

# 서버
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# 외부 서비스
JIRA_URL=https://your-domain.atlassian.net
JIRA_USERNAME=your_email
JIRA_API_TOKEN=your_api_token
```

### 데이터베이스 마이그레이션

```bash
# 데이터베이스 초기화
npm run db:init

# 마이그레이션 실행
npm run db:migrate

# 시드 데이터 생성
npm run db:seed
```

## 빌드 및 배포

### 개발 빌드

```bash
# 개발용 빌드
npm run build:dev

# 프로덕션용 빌드
npm run build:prod
```

### Electron 앱 빌드

```bash
# macOS용 빌드
npm run electron:build:mac

# Windows용 빌드
npm run electron:build:win

# Linux용 빌드
npm run electron:build:linux
```

### 배포

```bash
# MSI 인스톨러 생성 (Windows)
npm run electron:dist:win

# DMG 파일 생성 (macOS)
npm run electron:dist:mac

# AppImage 생성 (Linux)
npm run electron:dist:linux
```

## 문제 해결

### 백엔드 서버 문제

#### 포트 충돌
```bash
# 포트 사용 중인 프로세스 확인
lsof -i :3001

# 프로세스 종료
kill -9 <PID>
```

#### 데이터베이스 연결 실패
```bash
# PostgreSQL 서비스 상태 확인
brew services list | grep postgresql

# 서비스 재시작
brew services restart postgresql
```

### 프론트엔드 문제

#### 의존성 문제
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

#### 빌드 오류
```bash
# 캐시 삭제
npm run clean
npm run build
```

### Electron 문제

#### 앱이 시작되지 않음
```bash
# Electron 로그 확인
tail -f electron.log

# 앱 재시작
npm run dev:electron
```

## 기여 가이드

### 개발 워크플로우

1. **이슈 생성**: 버그 리포트 또는 기능 요청
2. **브랜치 생성**: `feature/기능명` 또는 `fix/버그명`
3. **개발**: 코드 작성 및 테스트
4. **커밋**: 명확한 커밋 메시지 작성
5. **PR 생성**: 코드 리뷰 요청
6. **병합**: 승인 후 main 브랜치로 병합

### 커밋 메시지 규칙

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**타입**: feat, fix, docs, style, refactor, perf, test, chore
**스코프**: 컴포넌트, 파일, 기능 영역
**설명**: 50자 이내, 명령형 어조

예시:
```
feat(auth): add OAuth2 Google login
fix(api): resolve memory leak in user session cleanup
docs(readme): update installation guide
```

### 코드 리뷰 체크리스트

- [ ] 코드가 요구사항을 충족하는가?
- [ ] 테스트가 작성되었는가?
- [ ] 에러 처리가 적절한가?
- [ ] 성능에 영향을 주지 않는가?
- [ ] 보안 취약점이 없는가?
- [ ] 문서가 업데이트되었는가?

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 연락처

프로젝트에 대한 문의사항이나 제안사항이 있으시면 이슈를 생성해 주세요.

- **GitHub**: [https://github.com/Kimchiun/quest](https://github.com/Kimchiun/quest)
- **이슈 트래커**: [https://github.com/Kimchiun/quest/issues](https://github.com/Kimchiun/quest/issues)
