#!/bin/bash

# ITMS 전체 서비스 안정적 시작 스크립트
echo "🚀 ITMS 전체 서비스 시작 중..."

# 기존 프로세스 정리
echo "🧹 기존 프로세스 정리 중..."
./stop-all.sh

# 백엔드 서버 시작
echo "📡 1단계: 백엔드 서버 시작..."
./start-backend.sh
if [ $? -ne 0 ]; then
    echo "❌ 백엔드 서버 시작에 실패했습니다."
    exit 1
fi

# React 서버 시작
echo "⚛️  2단계: React 서버 시작..."
npm run dev:react &
REACT_PID=$!
echo $REACT_PID > .react.pid
echo "📋 React PID: $REACT_PID"

# React 서버 시작 대기
echo "⏳ React 서버 시작 대기 중..."
for i in {1..30}; do
    if curl -s http://localhost:4000 >/dev/null 2>&1; then
        echo "✅ React 서버가 성공적으로 시작되었습니다!"
        break
    fi
    echo "   React 대기 중... ($i/30)"
    sleep 2
done

# Electron 앱 시작
echo "🖥️  3단계: Electron 앱 시작..."
npm run dev:electron &
ELECTRON_PID=$!
echo $ELECTRON_PID > .electron.pid
echo "📋 Electron PID: $ELECTRON_PID"

sleep 3

echo ""
echo "🎉 ==========================="
echo "✅ 모든 서비스가 시작되었습니다!"
echo "🎉 ==========================="
echo ""
echo "🔗 서비스 URL:"
echo "   📡 백엔드: http://localhost:3001"
echo "   ⚛️  React: http://localhost:4000"
echo "   🖥️  Electron: 데스크톱 앱"
echo ""
echo "🛑 서비스 종료: ./stop-all.sh"
echo "📊 상태 확인: ./check-status.sh"
