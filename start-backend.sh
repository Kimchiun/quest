#!/bin/bash

# Quest 백엔드 서버 안정적 시작 스크립트
echo "Quest 백엔드 서버 시작 중..."

# 기존 백엔드 프로세스 종료
echo "🧹 기존 백엔드 프로세스 정리 중..."
pkill -f "ts-node.*src/main/index.ts" 2>/dev/null || true
pkill -f "node.*src/main/index.ts" 2>/dev/null || true
sleep 2

# 포트 3001이 사용 중인지 확인하고 해제
if lsof -ti:3001 >/dev/null 2>&1; then
    echo "⚠️  포트 3001이 사용 중입니다. 해제하는 중..."
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# 환경 변수 확인
if [ ! -f ".env" ]; then
    echo "❌ .env 파일이 없습니다. 환경 설정을 확인해주세요."
    exit 1
fi

# Node.js와 npm 버전 확인
echo "📋 환경 정보:"
echo "   Node.js: $(node --version)"
echo "   npm: $(npm --version)"

# 의존성 설치 확인
if [ ! -d "node_modules" ]; then
    echo "📦 의존성 설치 중..."
    npm install
fi

# TypeScript 컴파일 확인
echo "🔍 TypeScript 설정 확인 중..."
if ! npx tsc --noEmit; then
    echo "❌ TypeScript 컴파일 오류가 있습니다."
    exit 1
fi

# 백엔드 서버 시작
echo "🎯 백엔드 서버 시작 중... (포트 3001)"
npx ts-node src/main/index.ts &

# 백엔드 PID 저장
BACKEND_PID=$!
echo $BACKEND_PID > .backend.pid
echo "📋 백엔드 PID: $BACKEND_PID"

# 서버 시작 대기
echo "⏳ 서버 시작 대기 중..."
for i in {1..30}; do
    if curl -s http://localhost:3001/api/health >/dev/null 2>&1; then
        echo "백엔드 서버가 성공적으로 시작되었습니다!"
echo "백엔드 URL: http://localhost:3001"
echo "Health Check: http://localhost:3001/api/health"
        exit 0
    fi
    echo "   대기 중... ($i/30)"
    sleep 2
done

echo "❌ 백엔드 서버 시작에 실패했습니다."
echo "🔍 로그를 확인하거나 수동으로 디버깅해주세요."
exit 1
