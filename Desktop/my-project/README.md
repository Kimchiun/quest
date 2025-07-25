# ITMS Desktop (Intelligent Test Management System)

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Platform](https://img.shields.io/badge/platform-Electron%20%7C%20React%20%7C%20Node.js-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

---

## Overview

**ITMS Desktop** is an all-in-one, cross-platform desktop application for modern test management. It streamlines test planning, execution, result tracking, and defect management, combining a user-friendly UX with AI-powered insights to boost QA productivity, software quality, and team collaboration.

---

## Key Features

- **Test Case Management**: CRUD, version history, advanced search/filtering (Elasticsearch)
- **Release & Suite Planning**: Drag-and-drop assignment, aggregated status, executor/environment/due date management
- **Test Execution & Result Logging**: State selection (Pass/Fail/Blocked/Untested), failure details (repro steps, screenshots, logs)
- **Offline Support**: IndexedDB caching, automatic sync on reconnect
- **AI Integration**: Case generation suggestions, impact analysis (via Python microservice)
- **External System Integration**: Jira/Redmine (REST API), webhooks
- **User & Role Management**: RBAC, SSO (SAML/OAuth2)
- **Collaboration**: Comments, @mentions, notification center
- **Security**: AES-256 at rest, TLS 1.3 in transit, OWASP Top 10 compliance

---

## Architecture

```mermaid
graph TD
    A[ITMS Desktop App] --> B[Internal Backend (Node.js)]
    B --> C[Local PostgreSQL DB]
    B --> D[Local Elasticsearch]
    B --> E[AI Service (Python)]
    B --> F[External System API (Jira, GitLab, etc.)]
    A --> G[IndexedDB (Offline Cache)]
    F --> H[External Systems]
```

- **Frontend**: Electron (React, Redux)
- **Backend**: Node.js (Express)
- **Database**: PostgreSQL
- **Search**: Elasticsearch
- **AI Service**: Python (Flask/FastAPI)
- **Communication**: REST API, gRPC, Electron IPC

---

## Tech Stack

| Layer         | Technology                        |
| -------------| ---------------------------------- |
| Desktop App  | Electron                          |
| UI           | React, Redux Toolkit              |
| Backend      | Node.js, Express                  |
| Database     | PostgreSQL                        |
| Search       | Elasticsearch                     |
| AI Service   | Python (Flask/FastAPI, HuggingFace, TensorFlow Lite) |
| Auth         | Passport.js (local, JWT, SAML/OAuth2) |
| Offline      | IndexedDB                         |
| Testing      | Jest, React Testing Library, Supertest |

---

## Folder Structure

```
my-project/
├── src/
│   ├── main/         # Electron Main Process (Node.js backend)
│   ├── renderer/     # Electron Renderer (React frontend)
│   ├── ai-service/   # (Optional) Python AI microservice
│   └── types/        # Global TypeScript types
├── config/           # Environment configs
├── scripts/          # Build/deploy scripts
├── tests/            # Test files
├── package.json
├── tsconfig.json
├── .env
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js (>=16)
- npm or yarn
- PostgreSQL
- Elasticsearch
- (Optional) Python 3.8+ for AI service

### Installation

```bash
# Install dependencies
npm install

# (Optional) Set up environment variables in .env
cp .env.example .env
```

### Database & Search Setup
- Ensure PostgreSQL and Elasticsearch are running.
- Run migrations:
  ```bash
  psql -U postgres -d itms -f src/main/app/infrastructure/database/migrations/001_create_executions.sql
  ```

### Development

```bash
# Start Electron app in development mode
npm run dev
```

### Build

```bash
npm run build
```

---

## Usage

- **Test Case Management**: Create, edit, search, and version test cases.
- **Release Planning**: Organize test cases into releases and suites with drag-and-drop.
- **Test Execution**: Log results, attach screenshots/logs, and sync offline records automatically.
- **Integrations**: Connect with Jira/Redmine for defect management.
- **AI Features**: (Planned) Generate test cases and analyze impact using AI microservice.

---

## Contribution

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`feat/your-feature`)
3. Commit your changes (`git commit -m 'feat: add new feature'`)
4. Push to your branch (`git push origin feat/your-feature`)
5. Open a Pull Request

**Coding Guidelines:**
- Follow the [Clean Code](./.cursor/rules/vooster__clean-code.mdc) and [Commit Message](./.cursor/rules/vooster__git-commit-message.mdc) rules in this repo.
- Write tests for new features and bug fixes.
- Keep PRs focused and well-documented.

---

## License

This project is licensed under the MIT License.

---

## Contact

- **Maintainer:** zkz258@naver.com
- **GitHub Issues:** [itms-desktop Issues](https://github.com/Kimchiun/itms-desktop/issues)

---

> ITMS Desktop — The next-generation intelligent test management solution for QA teams. 

## 디자인 시스템

### 1. 디자인 토큰 구조 및 관리
- 모든 색상, 폰트, 간격 등은 `src/renderer/shared/tokens.json`에서 관리합니다.
- 이 파일은 Figma Tokens(Design Tokens Plugin)에서 내보낸 JSON과 호환됩니다.
- Figma에서 토큰을 관리하고, 플러그인으로 export → tokens.json에 덮어쓰기 방식으로 동기화합니다.
- 토큰 구조 예시:
```json
{
  "color": { "primary": "#2563eb", ... },
  "font": { "family": "...", ... },
  ...
}
```

### 2. 컴포넌트 및 Storybook
- Button, Input, Icon, Container, Grid, Typography 등 공통 UI 컴포넌트는 `src/renderer/shared/components/`에 위치합니다.
- 각 컴포넌트는 디자인 토큰 기반으로 스타일링되며, Storybook(`npx storybook dev`)에서 문서화/테스트할 수 있습니다.
- Storybook에서 컴포넌트별 다양한 상태/스타일을 시각적으로 확인하세요.

### 3. Figma Tokens 플러그인 연동 가이드
- Figma에서 [Figma Tokens 플러그인](https://www.figma.com/community/plugin/843461159747178978/Design-Tokens) 설치
- 디자인 토큰을 Figma에서 관리 → 플러그인에서 JSON export
- 프로젝트의 `src/renderer/shared/tokens.json`에 덮어쓰기
- 코드에서 자동으로 theme에 반영됨
- 토큰 구조가 변경될 경우, 컴포넌트 스타일/Storybook에서 즉시 확인 가능

### 4. Chromatic(시각적 회귀 테스트) 연동
- Chromatic은 Storybook 기반 UI 스냅샷 테스트/리뷰 서비스입니다.
- 사용법:
  1. `npm install --save-dev chromatic`
  2. [Chromatic 계정](https://www.chromatic.com/) 생성 후 프로젝트 연결
  3. `npx chromatic --project-token=<YOUR_TOKEN>` 으로 스토리북 배포 및 스냅샷 생성
  4. PR/커밋마다 UI 변경점 자동 리뷰 가능
- 자세한 연동법은 [Chromatic 공식 문서](https://www.chromatic.com/docs/) 참고

### 5. 글로벌 스타일/테마 적용
- 글로벌 스타일은 `src/renderer/shared/GlobalStyle.ts`에서 관리하며, App.tsx에서 ThemeProvider와 함께 적용됩니다.
- 폰트, 배경, selection, 리셋 등 모든 페이지에 일관 적용

### 6. 디자인 시스템 확장/운영 팁
- 새로운 UI 요소는 반드시 디자인 토큰 기반으로 구현
- Storybook에 스토리 추가 → 시각적/자동 테스트 활용
- Figma-코드 동기화 주기적으로 수행
- 토큰/컴포넌트/가이드 변경 시 README 최신화 

### 7. Figma Tokens 자동 동기화 스크립트 사용법
- Figma에서 토큰을 JSON으로 export한 후 아래 명령어로 tokens.json에 자동 반영:
  ```bash
  node scripts/sync-figma-tokens.js <figma_export.json>
  ```
- 유효하지 않은 JSON이면 에러가 발생하며, 정상 동기화 시 tokens.json이 갱신됩니다.

### 8. Chromatic 자동화 스크립트 및 사용법
- `.env.chromatic` 파일에 Chromatic 프로젝트 토큰을 저장:
  ```env
  CHROMATIC_PROJECT_TOKEN=your_token_here
  ```
- package.json에 다음 스크립트 추가:
  ```json
  "chromatic:publish": "chromatic --project-token $CHROMATIC_PROJECT_TOKEN"
  ```
- 실행:
  ```bash
  CHROMATIC_PROJECT_TOKEN=your_token_here npm run chromatic:publish
  ```
- PR/커밋마다 자동화된 UI 스냅샷 테스트 및 리뷰 가능

### 9. 전체 워크플로우 예시
1. **Figma에서 디자인/토큰 관리**
2. **Figma Tokens 플러그인으로 JSON export**
3. **토큰 동기화:**
   ```bash
   node scripts/sync-figma-tokens.js <figma_export.json>
   ```
4. **코드/컴포넌트 개발 및 Storybook 확인**
5. **Chromatic으로 시각적 테스트/리뷰:**
   ```bash
   npm run chromatic:publish
   ```
6. **UI/토큰 변경 시 위 과정 반복, README 최신화** 

## 브랜드 자산 100% 적용 가이드

### 1. 실제 브랜드 파일 교체 및 자동 반영
- Figma에서 공식 브랜드 로고/심볼/아이콘을 export하여 아래 위치에 파일을 교체하세요:
  - 로고: `src/renderer/assets/brand/logo.svg`
  - 심볼: `src/renderer/assets/brand/symbol.svg`
  - Electron 앱 아이콘: `src/main/electron/assets/icon.ico` (256x256 이상)
  - Favicon: `public/favicon.ico` (16x16, 32x32)
- SVG, ICO, PNG 등 다양한 포맷 지원(필요시 변환)
- 파일만 교체하면 앱, Storybook, Electron, 웹뷰 등 전체에 자동 반영됨

### 2. OS별 빌드/실행 및 아이콘 노출 테스트
- Windows: `npm run build && npm run start` 또는 electron-builder로 exe 생성 후 실행
- Mac: `npm run build && npm run start` 또는 electron-builder로 dmg 생성 후 실행
- Linux: `npm run build && npm run start` 또는 electron-builder로 AppImage 생성 후 실행
- 각 OS에서 앱 실행 시 타이틀바/작업표시줄/앱 아이콘이 정상 노출되는지 확인
- 아이콘이 보이지 않으면 ico/png/svg 파일 포맷/크기 확인 및 교체

### 3. Storybook/Chromatic에서 브랜드 아이콘 스냅샷 자동화
- Storybook에서 Icon 컴포넌트의 'logo', 'symbol' 스토리 확인
- Chromatic 연동 시 브랜드 아이콘 스토리도 자동 스냅샷 테스트/리뷰 대상에 포함됨
- PR/커밋마다 UI 변경점 자동 리뷰 가능

### 4. 운영/배포 체크리스트
- [ ] 브랜드 자산(logo.svg, symbol.svg, icon.ico, favicon.ico) 교체 완료
- [ ] OS별 빌드/실행 후 아이콘 정상 노출 확인
- [ ] Storybook/Chromatic에서 브랜드 아이콘 스냅샷 테스트 통과
- [ ] README 최신화 및 운영 가이드 공유 

## 접근성(Accessibility, WCAG 2.1 AA) 가이드

### 1. 색상 대비/폰트 크기
- 모든 텍스트/버튼/배경 색상은 WCAG 2.1 AA(4.5:1 이상) 기준을 충족합니다.
- 폰트 크기: 본문/버튼 16px 이상, 보조 텍스트 14px 이상
- 디자인 토큰(`src/renderer/shared/tokens.json`)에서 관리

### 2. 키보드 네비게이션/포커스
- Tab 순서 논리적, 모든 버튼/폼/링크 tabIndex 0
- :focus-visible 스타일(명확한 outline) 적용
- 스킵 네비게이션(본문 바로가기) 지원: Tab → Enter로 main 영역 이동

### 3. ARIA/스크린리더 호환
- 모든 Input/Form/Modal에 label, aria-label, aria-required 등 적용
- 주요 영역에 role(main, nav, dialog 등), aria-label, aria-modal 등 적용
- 알림/에러 메시지(Notification)에 aria-live="polite" role="status" 적용

### 4. 자동화/테스트
- Cypress + cypress-axe로 접근성 자동화 테스트(`cypress/e2e/a11y.cy.js`)
- 키보드 네비게이션 E2E 테스트(`cypress/e2e/keyboard-nav.cy.js`)
- `npm run cypress:open` 또는 `npx cypress run`으로 실행

### 5. 운영 체크리스트
- 신규 UI/컴포넌트 추가 시 색상 대비, 포커스, ARIA 속성, 키보드 접근성 반드시 확인
- Storybook/Chromatic에서 시각적/접근성 상태 확인
- CI 파이프라인에 접근성 테스트 통합 권장
- 실사용자 피드백/스크린리더 테스트 주기적 수행

---

**이 프로젝트는 WCAG 2.1 AA 접근성 표준을 실질적으로 준수하며, 자동화 테스트와 운영 가이드까지 포함합니다.** 