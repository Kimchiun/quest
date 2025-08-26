# Quest - 지능형 테스트 관리 시스템 (데스크톱 앱)

## 프로젝트 개요

Quest는 테스트 계획, 실행, 결과 추적 및 결함 관리를 간소화하는 데스크톱 애플리케이션입니다. 사용자 친화적인 UX와 AI 기반 통찰력을 결합하여 QA 생산성을 높이고 소프트웨어 품질을 향상하며 팀 간 협업을 개선하는 것을 목표로 합니다.

### 주요 목표
- 40% 테스트 준비 시간 단축
- 30% 결함 처리 시간 단축  
- 90% 이상 주간 활성 QA 사용자 달성
- 2초 미만 평균 화면 응답 시간 (5천 동시 케이스 처리 시)

## 기술 스택

### 프론트엔드
- **Electron** - 데스크톱 애플리케이션 프레임워크
- **React 18** - UI 라이브러리
- **Redux Toolkit** - 상태 관리
- **Styled Components** - 스타일링
- **TypeScript** - 타입 안전성

### 백엔드
- **Node.js** - 런타임 환경
- **Express.js** - 웹 프레임워크
- **PostgreSQL** - 관계형 데이터베이스
- **Elasticsearch** - 검색 엔진 (선택사항)
- **Passport.js** - 인증 미들웨어

### 개발 도구
- **Webpack** - 모듈 번들러
- **Jest** - 테스트 프레임워크
- **ESLint** - 코드 린팅
- **Cypress** - E2E 테스트
- **Storybook** - 컴포넌트 문서화

## 빠른 시작

### 필수 요구사항
- **Node.js** 18 이상
- **PostgreSQL** 12 이상
- **Elasticsearch** 7 이상 (선택사항)

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone <repository-url>
cd my-project

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp env.example .env
# .env 파일을 편집하여 데이터베이스 연결 정보 등을 설정하세요

# 4. 전체 서비스 시작 (권장)
npm run dev:stable
```

### 개별 서비스 시작

```bash
# 백엔드만 시작
./start-backend.sh
# 또는
npm run backend:start

# React 서버만 시작
npm run dev:react

# Electron 앱만 시작
npm run dev:electron
```

### 서비스 상태 확인

```bash
# 모든 서비스 상태 확인
./check-status.sh
# 또는
npm run backend:status
```

## 주요 기능

### 핵심 기능 (MVP)
- **테스트 케이스 관리**: CRUD, 버전 이력, 고급 검색 및 필터링
- **릴리즈 및 스위트 계획**: 생성, 케이스 할당, 실행자 지정
- **테스트 실행 및 결과 기록**: Pass/Fail/Blocked/Untested 상태 관리
- **결함 관리 통합**: Jira/Redmine 연동, 양방향 상태 동기화
- **대시보드 및 보고서**: 실시간 차트, 사용자 정의 위젯
- **사용자 및 역할 관리**: RBAC, SSO 연동
- **협업 기능**: 댓글, 멘션, 알림 센터

### 고급 기능 (개발 예정)
- **AI 기반 케이스 생성**: 요구사항 텍스트에서 자동 생성
- **영향 분석**: 코드 변경 기반 회귀 스위트 추천
- **실패 핫스팟 예측**: AI 기반 위험 분석
- **실시간 협업**: 동시 편집 지원

## 개발 가이드

### 프로젝트 구조

```
src/
├── main/                    # Electron Main Process (Node.js 백엔드)
│   ├── app/                 # 애플리케이션 핵심 로직
│   │   ├── domains/         # 도메인별 모듈
│   │   ├── infrastructure/  # DB 연결, 외부 API 클라이언트
│   │   └── shared/          # 공통 타입, 상수
│   ├── electron/            # Electron Main Process 관련 파일
│   └── index.ts             # 백엔드 서버 시작점
├── renderer/                # Electron Renderer Process (React)
│   ├── features/            # 기능별 모듈
│   ├── shared/              # 공통 컴포넌트, 유틸리티
│   ├── store/               # Redux Root Store
│   └── index.tsx            # React 앱 엔트리 포인트
└── types/                   # 전역 타입 정의
```

### 개발 명령어

```bash
# 개발 서버 시작
npm run dev:stable          # 안정적인 전체 서비스 시작 (권장)
npm run dev                  # 기본 개발 서버 시작
npm run dev:reset            # 완전 초기화 후 시작

# 백엔드 관련
npm run backend:start        # 백엔드 시작
npm run backend:restart      # 백엔드 재시작
npm run backend:status       # 서비스 상태 확인

# 빌드
npm run build               # React 빌드
npm run build:main          # Node.js 백엔드 빌드
npm run build:all           # 전체 빌드

# 테스트
npm run test                # Jest 테스트 실행
npm run test:watch          # 테스트 감시 모드
npm run test:coverage       # 커버리지 리포트

# 코드 품질
npm run lint                # ESLint 검사
npm run lint:fix            # ESLint 자동 수정
npm run type-check          # TypeScript 타입 검사
```

### 환경 설정

`.env` 파일 설정 예시:

```env
# 데이터베이스
DB_HOST=localhost
DB_PORT=5432
DB_NAME=itms
DB_USER=postgres
DB_PASSWORD=your_password

# 서버
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key

# Elasticsearch (선택사항)
ELASTICSEARCH_HOST=localhost:9200
```

## 문제 해결

### 백엔드 서버 연결 실패

```bash
# 1. 프로세스 정리 후 재시작
npm run backend:restart

# 2. 포트 충돌 해결
lsof -ti:3001 | xargs kill -9
./start-backend.sh

# 3. 상태 확인
npm run backend:status
```

### PostgreSQL 연결 오류

```bash
# macOS에서 PostgreSQL 시작
brew services start postgresql

# 데이터베이스 생성
createdb itms

# 백엔드 재시작
npm run backend:restart
```

### 의존성 문제

```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install

# 백엔드 재시작
npm run backend:restart
```

자세한 문제 해결 방법은 [BACKEND_TROUBLESHOOTING.md](./BACKEND_TROUBLESHOOTING.md)를 참조하세요.

## 아키텍처

### 시스템 구성

- **Quest 데스크톱 애플리케이션**: Electron 기반 크로스 플랫폼 데스크톱 앱
- **내부 백엔드**: Node.js/Express.js 기반 API 서버
- **로컬 데이터베이스**: PostgreSQL을 사용한 데이터 저장
- **검색 엔진**: Elasticsearch를 통한 고급 검색 기능
- **AI 서비스**: Python 기반 마이크로서비스 (개발 예정)

### 데이터 흐름

1. React 프론트엔드에서 사용자 상호작용
2. Redux를 통한 상태 관리
3. Node.js 백엔드 API 호출
4. PostgreSQL 데이터베이스 연동
5. 실시간 업데이트 및 알림

## 성능 최적화

- **지연 로딩**: 필요한 모듈만 동적 로딩
- **코드 분할**: 기능별 번들 분리
- **가상화**: 대량 데이터 목록의 효율적 렌더링
- **캐싱**: IndexedDB를 통한 오프라인 데이터 캐싱
- **최적화된 쿼리**: 데이터베이스 인덱싱 및 쿼리 최적화

## 보안

- **인증**: JWT 기반 토큰 인증
- **권한 관리**: 역할 기반 접근 제어 (RBAC)
- **데이터 암호화**: AES-256 저장 암호화, TLS 1.3 전송 암호화
- **입력 검증**: 모든 외부 입력에 대한 유효성 검사
- **SQL 인젝션 방지**: 매개변수화된 쿼리 사용

## 기여 가이드

### 코딩 컨벤션

- **TypeScript**: 모든 코드에 타입 정의 필수
- **ESLint**: 코드 스타일 준수
- **Prettier**: 코드 포맷팅 자동화
- **명명 규칙**: camelCase (변수/함수), PascalCase (컴포넌트/클래스)

### 커밋 메시지

```
<type>(<scope>): <description>

feat(auth): add OAuth2 Google login
fix(ui): resolve memory leak in user session
docs(api): update authentication endpoints
```

### Pull Request

1. 기능 브랜치 생성
2. 코드 작성 및 테스트
3. 린트 검사 통과
4. PR 생성 및 리뷰 요청

## 라이선스

이 프로젝트는 ISC 라이선스 하에 배포됩니다.

## 지원

- **문제 신고**: GitHub Issues
- **문서**: [프로젝트 위키](./docs/)
- **트러블슈팅**: [백엔드 문제 해결 가이드](./BACKEND_TROUBLESHOOTING.md)

## 버전 히스토리

### v1.0.0 (현재)
- 기본 테스트 케이스 관리 기능
- 릴리즈 관리 및 실행 기능
- PostgreSQL 데이터베이스 연동
- 사용자 인증 및 권한 관리
- 안정적인 백엔드 시작 시스템

### 개발 예정
- AI 기반 테스트 케이스 생성
- 고급 통합 (Jira, GitLab, Jenkins)
- 실시간 협업 기능
- 클라우드 동기화