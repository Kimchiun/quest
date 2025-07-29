# ITMS (Integrated Test Management System)

## 🚀 빠른 시작

### 안정적인 개발 환경 시작
```bash
# 가장 안정적인 방법 (권장)
npm run dev:stable

# 또는 순차적 시작
npm run dev:sequential

# 문제 발생 시 완전 리셋
npm run dev:reset
```

### 기본 개발 환경 시작
```bash
npm run dev
```

## 🔧 사용 가능한 스크립트

- `npm run dev:stable` - 안정적인 개발 환경 (권장)
- `npm run dev:sequential` - 순차적 서비스 시작
- `npm run dev:reset` - 완전 리셋 후 안정적 시작
- `npm run dev` - 기본 개발 환경
- `npm run dev:clean` - 프로세스 정리
- `npm run diagnostic` - 환경 진단
- `npm run diagnostic:cleanup` - 환경 정리
- `npm run diagnostic:test` - 환경 테스트

## 🛠️ 문제 해결

### Electron 앱이 보이지 않는 경우
```bash
# 1. 모든 프로세스 정리
npm run dev:clean

# 2. 안정적인 환경으로 재시작
npm run dev:stable
```

### 포트 충돌 발생 시
```bash
# 포트 확인
lsof -i :4000
lsof -i :3000

# 강제 종료
lsof -ti:4000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### TypeScript 컴파일 에러
```bash
# 타입 체크
npm run type-check

# 린트 수정
npm run lint:fix
```

## 🧪 테스트 계정

- **아이디**: `admin`
- **비밀번호**: `admin123`

## 📱 데스크탑 앱

Electron 기반 데스크탑 애플리케이션으로 제공됩니다.

### 주요 기능
- 3분할 대시보드 레이아웃
- 테스트 케이스 관리
- 폴더/케이스 일괄 선택 및 작업
- 실시간 협업 기능

### 시스템 요구사항
- Node.js 18+
- PostgreSQL
- macOS 10.15+ / Windows 10+ / Linux 