# Quest - 지능형 테스트 관리 시스템

Quest는 테스트 계획, 실행, 결과 추적 및 결함 관리를 위한 데스크톱 애플리케이션입니다. 사용자 친화적인 UX와 AI 기반 통찰력을 결합하여 QA 생산성을 높이고 소프트웨어 품질을 향상하며 팀 간 협업을 개선하는 것을 목표로 합니다.

## 🚀 빠른 시작

### 1. 개발 환경 설정

```bash
# 저장소 클론
git clone <repository-url>
cd my-project

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
createdb itms
```

### 3. 개발 서버 시작

```bash
# 모든 서비스 한 번에 시작 (권장)
npm run restart

# 또는 개별적으로 시작
npm run dev:backend  # 백엔드 서버 (포트 3001)
npm run dev:react    # 프론트엔드 개발 서버 (포트 4000)
npm run dev:electron # Electron 앱

# 앱 종료
npm run stop
```

## 🏗️ 프로젝트 구조

```
src/
├── main/                    # Electron Main Process (Node.js 백엔드)
│   ├── app/
│   │   ├── domains/        # 도메인별 모듈
│   │   │   ├── releases/   # 릴리즈 관리
│   │   │   ├── testcases/  # 테스트케이스 관리
│   │   │   └── folders/    # 폴더 관리
│   │   ├── infrastructure/ # 인프라 (DB, 보안 등)
│   │   └── utils/          # 유틸리티
│   └── electron/           # Electron 설정
├── renderer/               # Electron Renderer Process (React 프론트엔드)
│   ├── features/           # 기능별 모듈
│   │   ├── ReleaseManagementV2/  # 릴리즈 관리 V2
│   │   ├── TestManagementV2/     # 테스트 관리 V2
│   │   └── ExecutionManagement/  # 실행 관리
│   ├── shared/             # 공통 컴포넌트
│   └── store/              # Redux 상태 관리
└── types/                  # 전역 타입 정의
```

## 🛠️ 개발 도구

### 스크립트

- `npm run restart` - 모든 서비스 재시작 (권장)
- `npm run stop` - 모든 서비스 종료
- `npm run dev` - 모든 개발 서버 시작
- `npm run dev:stable` - 안정적인 개발 환경
- `npm run setup` - 개발 환경 자동 설정
- `npm run test` - 테스트 실행
- `npm run lint` - 코드 린팅
- `npm run build` - 프로덕션 빌드

### 문제 해결

- `npm run dev:clean` - 포트 충돌 해결
- `npm run clean` - 캐시 초기화
- `npm run reset` - 완전 초기화
- `npm run diagnostic` - 진단 도구

## 🔧 기술 스택

- **프론트엔드**: Electron, React, TypeScript, Redux Toolkit, RTK Query
- **백엔드**: Node.js, Express.js, TypeScript
- **데이터베이스**: PostgreSQL
- **검색**: Elasticsearch
- **스타일링**: Styled Components
- **테스트**: Jest, React Testing Library, Cypress

## 📋 주요 기능

### ✅ 구현 완료
- [x] 테스트케이스 관리 (CRUD)
- [x] 폴더 기반 구조
- [x] 고급 검색 및 필터링
- [x] 릴리즈 관리
- [x] 테스트 실행 관리
- [x] 대시보드 및 차트
- [x] 사용자 인증
- [x] 드래그 앤 드롭
- [x] 접근성 지원
- [x] **폴더 기반 실시간 통계 계산**
- [x] **실행 통계 동기화 (Planned, Executed, Pass, Fail, Block, Skip)**
- [x] **테스트케이스 상태 변경 (Pass/Fail/Block/Skip)**
- [x] **실시간 데이터 동기화 (5초 polling)**
- [x] **테스트케이스 가져오기 및 폴더 관리**
- [x] **실행 통계 실시간 업데이트**

### 🚧 개발 중
- [ ] AI 기반 케이스 생성
- [ ] 실시간 협업
- [ ] 외부 시스템 통합 (Jira, GitLab)
- [ ] 오프라인 모드

## 🎯 핵심 기능 상세

### 폴더 기반 실시간 통계 계산
- 사용자가 가져온 폴더의 테스트케이스 개수를 실시간으로 계산
- Planned, Executed, Pass, Fail, Block, Skip 통계 자동 업데이트
- 폴더 추가/제거 시 즉시 통계 반영

### 실행 통계 동기화
- 백엔드 데이터베이스와 프론트엔드 UI 실시간 동기화
- 5초마다 자동 갱신으로 최신 상태 유지
- 테스트케이스 상태 변경 시 즉시 통계 반영

### 테스트케이스 상태 관리
- 개별 테스트케이스 상태 변경 (Pass/Fail/Block/Skip)
- 상태 변경 시 실행 통계 자동 업데이트
- 상태 변경 이력 추적

## 🧪 테스트

```bash
# 모든 테스트 실행
npm run test

# 테스트 커버리지
npm run test:coverage

# E2E 테스트
npm run cypress:open
```

## 🔒 보안

- 환경 변수를 통한 민감 정보 관리
- JWT 기반 인증
- 입력 데이터 검증
- SQL 인젝션 방지

## 📝 환경 변수

`.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# 데이터베이스
PGUSER=postgres
PGHOST=localhost
PGDATABASE=quest
PGPASSWORD=your_secure_password
PGPORT=5432

# Elasticsearch
ES_NODE=http://localhost:9200

# JWT
JWT_SECRET=your_jwt_secret

# 서버
PORT=3001
NODE_ENV=development
```

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🆘 지원

문제가 발생하면 다음을 시도해보세요:

1. `npm run restart` - 모든 서비스 재시작
2. `npm run stop` - 모든 서비스 종료 후 재시작
3. `npm run diagnostic` - 시스템 진단
4. `npm run dev:clean` - 포트 충돌 해결
5. `npm run reset` - 완전 초기화
6. 이슈 트래커에서 기존 문제 확인

## 📈 성능 목표

- UI 응답 시간: < 2초
- 대량 데이터 처리: 10k 케이스 < 60초
- 동시 사용자: 500명
- 데이터 처리: 1백만 케이스
- 실시간 동기화: 5초 이내 업데이트

## 🔄 최근 업데이트

### v1.4.0 (2024-01-15)
- ✅ 폴더 기반 실시간 통계 계산 구현
- ✅ 실행 통계 동기화 기능 추가
- ✅ 테스트케이스 상태 변경 기능 구현
- ✅ 실시간 데이터 동기화 (5초 polling)
- ✅ 런타임 오류 수정 및 안정성 개선
- ✅ 앱 재시작/종료 스크립트 추가
- ✅ **Swagger API 문서 추가** - [API 문서](./docs/api.md) | [Swagger UI](http://localhost:3001/api-docs/)