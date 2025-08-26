# Quest 백엔드 서버 문제 해결 가이드

## 🚀 빠른 시작

### 1. 전체 서비스 시작
```bash
npm run dev:stable
```

### 2. 백엔드만 시작/재시작
```bash
# 백엔드 시작
./start-backend.sh
# 또는
npm run backend:start

# 백엔드 재시작
npm run backend:restart
```

### 3. 서비스 상태 확인
```bash
./check-status.sh
# 또는
npm run backend:status
```

## 🔧 문제 해결

### 백엔드 서버가 시작되지 않을 때

#### 1. 포트 충돌 해결
```bash
# 포트 3001을 사용하는 프로세스 확인
lsof -i:3001

# 포트 3001 강제 해제
lsof -ti:3001 | xargs kill -9

# 백엔드 재시작
./start-backend.sh
```

#### 2. 프로세스 정리 후 재시작
```bash
# 모든 관련 프로세스 종료
pkill -f "ts-node"
pkill -f "src/main/index.ts"

# 잠시 대기
sleep 3

# 백엔드 시작
./start-backend.sh
```

#### 3. 환경 변수 확인
```bash
# .env 파일 존재 확인
ls -la .env

# .env 파일이 없다면 env.example에서 복사
cp env.example .env
```

#### 4. 의존성 재설치
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install

# 백엔드 시작
./start-backend.sh
```

### TypeScript 컴파일 오류

```bash
# TypeScript 설정 확인
npx tsc --noEmit

# 오류 해결 후 백엔드 재시작
./start-backend.sh
```

### 데이터베이스 연결 오류

```bash
# PostgreSQL 서비스 상태 확인 (macOS)
brew services list | grep postgresql

# PostgreSQL 시작
brew services start postgresql

# 백엔드 재시작
./start-backend.sh
```

## 📊 서비스 상태 모니터링

### 실시간 상태 확인
```bash
# 서비스 상태 확인
./check-status.sh

# 실행 중인 프로세스 확인
ps aux | grep -E "(ts-node|webpack|electron)" | grep -v grep

# 포트 사용 상태 확인
lsof -i:3001,4000
```

### 로그 확인
```bash
# 백엔드 로그 확인 (백그라운드에서 실행 중인 경우)
tail -f nohup.out

# 또는 직접 실행하여 로그 확인
npx ts-node src/main/index.ts
```

## 🎯 권장 워크플로우

### 개발 시작 시
1. `./check-status.sh` - 현재 상태 확인
2. 문제가 있다면 `npm run backend:restart` - 백엔드 재시작
3. `npm run dev:stable` - 전체 서비스 시작

### 백엔드 수정 후
1. 백엔드 프로세스 종료 (Ctrl+C 또는 `pkill -f ts-node`)
2. `./start-backend.sh` - 백엔드 재시작
3. `./check-status.sh` - 상태 확인

### 문제 발생 시
1. `./check-status.sh` - 문제 진단
2. 해당 서비스 개별 재시작
3. 전체 재시작이 필요하다면 `npm run dev:stable`

## 📋 자주 사용하는 명령어

```bash
# 백엔드 관련
./start-backend.sh          # 백엔드 시작
./check-status.sh           # 전체 상태 확인
npm run backend:restart     # 백엔드 재시작

# 전체 서비스
npm run dev:stable          # 안정적인 전체 시작
npm run dev:reset           # 완전 초기화 후 시작

# 디버깅
lsof -i:3001               # 포트 3001 사용 확인
ps aux | grep ts-node      # 백엔드 프로세스 확인
curl http://localhost:3001/api/health  # 백엔드 헬스 체크
```

## 🆘 긴급 상황

모든 것이 작동하지 않을 때:

```bash
# 1. 모든 프로세스 강제 종료
pkill -f "electron"
pkill -f "webpack"  
pkill -f "ts-node"
lsof -ti:3001,4000 | xargs kill -9

# 2. 잠시 대기
sleep 5

# 3. 전체 재시작
npm run dev:stable

# 4. 상태 확인
./check-status.sh
```

이 가이드로도 해결되지 않는 문제가 있다면, 개발팀에 문의해주세요.
