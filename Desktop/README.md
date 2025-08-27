# Quest - 지능형 테스트 관리 시스템

## 프로젝트 소개

Quest는 현대적인 테스트 관리 시스템으로, QA 팀의 효율성을 극대화하는 데스크톱 애플리케이션입니다. 

### 핵심 가치
- **통합된 워크플로우**: 테스트 계획부터 실행, 결과 분석까지 원스톱 솔루션
- **지능형 자동화**: AI 기반 테스트 케이스 생성 및 우선순위 추천
- **실시간 협업**: 팀원 간 실시간 소통 및 작업 공유
- **데이터 기반 인사이트**: 상세한 분석 및 리포팅으로 의사결정 지원

### 성과 지표
- 테스트 준비 시간 40% 단축
- 결함 처리 시간 30% 단축
- 팀 생산성 50% 향상
- 2초 이내 화면 응답 시간

## 기술 아키텍처

### 프론트엔드
- **Electron**: 크로스 플랫폼 데스크톱 앱
- **React**: 사용자 인터페이스
- **TypeScript**: 타입 안전성
- **Redux Toolkit**: 상태 관리

### 백엔드
- **Node.js**: 서버 런타임
- **Express.js**: API 서버
- **PostgreSQL**: 메인 데이터베이스
- **Elasticsearch**: 검색 엔진

### 개발 도구
- **Jest**: 단위 테스트
- **Cypress**: E2E 테스트
- **Webpack**: 번들링
- **ESLint**: 코드 품질

## 설치 및 설정

### 시스템 요구사항

**운영체제**
- Windows 10/11 (64비트)
- macOS 10.15 이상
- Ubuntu 18.04 이상

**하드웨어**
- RAM: 최소 8GB, 권장 16GB
- 저장공간: 최소 2GB
- CPU: Intel i5 또는 AMD Ryzen 5 이상

### 1단계: 저장소 클론

```bash
git clone https://github.com/Kimchiun/quest.git
cd quest
```

### 2단계: 의존성 설치

```bash
# Node.js 패키지 설치
npm install

# 또는 Yarn 사용
yarn install
```

### 3단계: 환경 설정

```bash
# 환경 변수 파일 복사
cp env.example .env

# 환경 변수 편집
nano .env
```

필수 환경 변수:
```env
# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quest_db
DB_USER=postgres
DB_PASSWORD=your_password

# 서버 설정
PORT=3001
NODE_ENV=development

# JWT 설정
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
```

### 4단계: 데이터베이스 설정

**PostgreSQL 설치 (macOS)**
```bash
brew install postgresql
brew services start postgresql
createdb quest_db
```

**PostgreSQL 설치 (Windows)**
- [PostgreSQL 공식 사이트](https://www.postgresql.org/download/windows/)에서 다운로드
- 설치 후 데이터베이스 생성

**PostgreSQL 설치 (Ubuntu)**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb quest_db
```

### 5단계: 애플리케이션 실행

```bash
# 개발 모드로 모든 서비스 시작
npm run dev:stable

# 또는 개별 서비스 시작
npm run dev:backend  # 백엔드 서버 (포트 3001)
npm run dev:react    # 프론트엔드 (포트 4000)
npm run dev:electron # 데스크톱 앱
```

## 주요 기능

### 테스트 케이스 관리

**핵심 기능**
- 직관적인 테스트 케이스 생성 및 편집
- 버전 관리 및 변경 이력 추적
- 태그 및 카테고리 기반 분류
- 템플릿 기반 빠른 생성

**고급 기능**
- AI 기반 테스트 케이스 자동 생성
- 요구사항 연동 및 커버리지 분석
- 재사용 가능한 테스트 컴포넌트
- 대량 임포트/익스포트

### 릴리즈 및 스위트 관리

**릴리즈 계획**
- 릴리즈별 테스트 스위트 구성
- 마일스톤 및 마감일 관리
- 리소스 할당 및 작업량 분배
- 진행 상황 실시간 추적

**스위트 관리**
- 드래그 앤 드롭으로 케이스 할당
- 우선순위 기반 실행 순서 설정
- 의존성 관리 및 실행 순서 최적화
- 자동 스위트 생성 (AI 기반)

### 테스트 실행 및 결과 관리

**실행 관리**
- Pass/Fail/Blocked/Untested 상태 관리
- 단계별 실행 및 상세 기록
- 스크린샷 및 로그 자동 캡처
- 오프라인 실행 및 동기화

**결과 분석**
- 실시간 진행 상황 대시보드
- 상세한 실행 히스토리
- 성능 메트릭 및 트렌드 분석
- 결함 패턴 분석

### 결함 관리 및 통합

**결함 추적**
- 원클릭 결함 생성
- Jira, Redmine 등 외부 시스템 연동
- 양방향 상태 동기화
- 결함 라이프사이클 관리

**통합 기능**
- Git 커밋과 테스트 결과 연동
- CI/CD 파이프라인 통합
- 웹훅 기반 자동 업데이트
- API를 통한 외부 시스템 연동

### 대시보드 및 리포팅

**실시간 대시보드**
- 진행률 및 성공률 차트
- 결함 밀도 및 트렌드 분석
- 팀원별 작업량 분포
- 프로젝트 건강도 지표

**리포팅**
- 커스터마블 리포트 템플릿
- 자동 리포트 생성 및 배포
- 다양한 포맷 지원 (PDF, Excel, HTML)
- 스케줄링된 리포트 전송

### 사용자 및 권한 관리

**역할 기반 접근 제어**
- Admin, QA Lead, Tester, Developer, Viewer 역할
- 세분화된 권한 설정
- 프로젝트별 접근 권한 관리
- 감사 로그 및 활동 추적

**인증 및 보안**
- SAML/OAuth2 SSO 지원
- 2단계 인증 (2FA)
- 세션 관리 및 자동 로그아웃
- 데이터 암호화 및 백업

## 프로젝트 구조

```
quest/
├── src/
│   ├── main/                    # Electron Main Process
│   │   ├── app/
│   │   │   ├── domains/         # 비즈니스 도메인
│   │   │   │   ├── testcases/   # 테스트 케이스 관리
│   │   │   │   ├── releases/    # 릴리즈 관리
│   │   │   │   ├── executions/  # 테스트 실행
│   │   │   │   └── defects/     # 결함 관리
│   │   │   ├── infrastructure/  # 인프라 계층
│   │   │   │   ├── database/    # 데이터베이스 연결
│   │   │   │   ├── integrations/ # 외부 시스템 연동
│   │   │   │   └── security/    # 보안 관련
│   │   │   └── shared/          # 공통 유틸리티
│   │   ├── electron/            # Electron 설정
│   │   └── index.ts             # 서버 시작점
│   │
│   ├── renderer/                # Electron Renderer Process
│   │   ├── app/                 # React 앱
│   │   ├── features/            # 기능별 모듈
│   │   │   ├── TestManagement/  # 테스트 관리
│   │   │   ├── ReleaseManagement/ # 릴리즈 관리
│   │   │   ├── ExecutionManagement/ # 실행 관리
│   │   │   └── Dashboard/       # 대시보드
│   │   ├── shared/              # 공통 컴포넌트
│   │   └── store/               # Redux 스토어
│   │
│   └── types/                   # TypeScript 타입 정의
│
├── tests/                       # 테스트 파일
├── cypress/                     # E2E 테스트
├── scripts/                     # 빌드 및 배포 스크립트
└── docs/                        # 문서
```

## 개발 가이드

### 코드 스타일

**TypeScript/JavaScript**
- camelCase: 변수, 함수명
- PascalCase: 클래스, 컴포넌트명
- UPPER_SNAKE_CASE: 상수
- 명확하고 의미있는 이름 사용

**React 컴포넌트**
- 함수형 컴포넌트 사용
- Props 타입 정의 필수
- 커스텀 훅으로 로직 분리
- 단일 책임 원칙 준수

### 테스트 작성

**단위 테스트**
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

**E2E 테스트**
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

**RESTful API 설계**
- 자원 중심 URL 구조
- HTTP 메서드 적절히 사용
- 일관된 응답 형식
- 적절한 상태 코드 사용

**에러 처리**
```typescript
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

## 빌드 및 배포

### 개발 빌드

```bash
# 개발용 빌드
npm run build:dev

# 프로덕션용 빌드
npm run build:prod
```

### 플랫폼별 빌드

```bash
# macOS용 빌드
npm run electron:build:mac

# Windows용 빌드
npm run electron:build:win

# Linux용 빌드
npm run electron:build:linux
```

### 배포 패키지 생성

```bash
# MSI 인스톨러 (Windows)
npm run electron:dist:win

# DMG 파일 (macOS)
npm run electron:dist:mac

# AppImage (Linux)
npm run electron:dist:linux
```

## 문제 해결

### 일반적인 문제

**포트 충돌**
```bash
# 포트 사용 중인 프로세스 확인
lsof -i :3001

# 프로세스 종료
kill -9 <PID>
```

**데이터베이스 연결 실패**
```bash
# PostgreSQL 서비스 상태 확인
brew services list | grep postgresql

# 서비스 재시작
brew services restart postgresql
```

**의존성 문제**
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 로그 확인

```bash
# 백엔드 로그
tail -f backend.log

# 프론트엔드 로그
tail -f react.log

# Electron 로그
tail -f electron.log
```

## 기여 가이드

### 개발 워크플로우

1. 이슈 생성 또는 기존 이슈 확인
2. 기능 브랜치 생성 (`feature/기능명`)
3. 코드 개발 및 테스트 작성
4. 커밋 메시지 작성
5. Pull Request 생성
6. 코드 리뷰 및 병합

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

- 코드가 요구사항을 충족하는가?
- 테스트가 작성되었는가?
- 에러 처리가 적절한가?
- 성능에 영향을 주지 않는가?
- 보안 취약점이 없는가?
- 문서가 업데이트되었는가?

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 연락처

프로젝트에 대한 문의사항이나 제안사항이 있으시면 이슈를 생성해 주세요.

- GitHub: https://github.com/Kimchiun/quest
- 이슈 트래커: https://github.com/Kimchiun/quest/issues
