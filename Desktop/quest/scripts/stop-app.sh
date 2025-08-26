#!/bin/bash

# Quest Desktop App Stop Script
# 모든 관련 프로세스를 안전하게 종료

echo "🛑 Quest 앱 종료 중..."

# 1. PID 파일에서 프로세스 종료
if [ -f .backend.pid ]; then
    BACKEND_PID=$(cat .backend.pid)
    echo "📴 백엔드 프로세스 종료 중 (PID: $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null || true
    rm .backend.pid
fi

if [ -f .react.pid ]; then
    REACT_PID=$(cat .react.pid)
    echo "📴 React 프로세스 종료 중 (PID: $REACT_PID)..."
    kill $REACT_PID 2>/dev/null || true
    rm .react.pid
fi

if [ -f .electron.pid ]; then
    ELECTRON_PID=$(cat .electron.pid)
    echo "📴 Electron 프로세스 종료 중 (PID: $ELECTRON_PID)..."
    kill $ELECTRON_PID 2>/dev/null || true
    rm .electron.pid
fi

# 2. 모든 관련 프로세스 강제 종료
echo "🔍 관련 프로세스 검색 및 종료 중..."
pkill -f "node.*backend" 2>/dev/null || true
pkill -f "webpack.*serve" 2>/dev/null || true
pkill -f "electron" 2>/dev/null || true
pkill -f "ts-node" 2>/dev/null || true

# 3. 포트 사용 프로세스 강제 종료
echo "🔍 포트 사용 프로세스 종료 중..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:4000 | xargs kill -9 2>/dev/null || true

# 4. 잠시 대기
echo "⏳ 프로세스 종료 대기 중..."
sleep 2

# 5. 종료 확인
echo "🔍 종료 확인 중..."
if pgrep -f "node.*backend\|webpack.*serve\|electron" > /dev/null; then
    echo "⚠️ 일부 프로세스가 여전히 실행 중입니다. 강제 종료를 시도합니다..."
    pkill -9 -f "node.*backend\|webpack.*serve\|electron" 2>/dev/null || true
    sleep 1
fi

echo "✅ Quest 앱 종료 완료!"
