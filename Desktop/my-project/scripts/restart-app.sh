#!/bin/bash

# ITMS Desktop App Restart Script
# 모든 관련 프로세스를 종료하고 깨끗한 상태에서 다시 시작

echo "🔄 ITMS 앱 재시작 중..."

# 1. 모든 관련 프로세스 종료
echo "📴 기존 프로세스 종료 중..."
pkill -f "node.*backend" 2>/dev/null || true
pkill -f "webpack.*serve" 2>/dev/null || true
pkill -f "electron" 2>/dev/null || true
pkill -f "ts-node" 2>/dev/null || true

# 2. 포트 사용 확인 및 강제 종료
echo "🔍 포트 사용 확인 중..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:4000 | xargs kill -9 2>/dev/null || true

# 3. 캐시 정리
echo "🧹 캐시 정리 중..."
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf dist 2>/dev/null || true

# 4. 잠시 대기
echo "⏳ 잠시 대기 중..."
sleep 2

# 5. 백엔드 시작
echo "🚀 백엔드 서버 시작 중..."
npm run dev:backend &
BACKEND_PID=$!

# 6. 백엔드 준비 대기
echo "⏳ 백엔드 준비 대기 중..."
for i in {1..10}; do
    if curl -s http://localhost:3001 > /dev/null 2>&1; then
        echo "✅ 백엔드 서버 준비 완료"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "❌ 백엔드 서버 시작 실패"
        exit 1
    fi
    sleep 1
done

# 7. React 개발 서버 시작
echo "⚛️ React 개발 서버 시작 중..."
npm run dev:react &
REACT_PID=$!

# 8. React 서버 준비 대기
echo "⏳ React 서버 준비 대기 중..."
for i in {1..15}; do
    if curl -s http://localhost:4000 > /dev/null 2>&1; then
        echo "✅ React 개발 서버 준비 완료"
        break
    fi
    if [ $i -eq 15 ]; then
        echo "❌ React 개발 서버 시작 실패"
        exit 1
    fi
    sleep 1
done

# 9. Electron 앱 시작
echo "📱 Electron 앱 시작 중..."
npm run dev:electron &
ELECTRON_PID=$!

# 10. 프로세스 ID 저장
echo $BACKEND_PID > .backend.pid
echo $REACT_PID > .react.pid
echo $ELECTRON_PID > .electron.pid

echo "🎉 ITMS 앱 재시작 완료!"
echo "📊 실행 중인 프로세스:"
echo "   - 백엔드 (PID: $BACKEND_PID)"
echo "   - React (PID: $REACT_PID)"
echo "   - Electron (PID: $ELECTRON_PID)"
echo ""
echo "🛑 종료하려면: ./scripts/stop-app.sh"
