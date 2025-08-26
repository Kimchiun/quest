#!/bin/bash

# ITMS 백엔드 서버 종료 스크립트
echo "🛑 ITMS 백엔드 서버 종료 중..."

# PID 파일에서 백엔드 프로세스 종료
if [ -f ".backend.pid" ]; then
    BACKEND_PID=$(cat .backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "🔄 백엔드 프로세스 종료 중... (PID: $BACKEND_PID)"
        kill $BACKEND_PID
        sleep 2
        
        # 강제 종료가 필요한 경우
        if ps -p $BACKEND_PID > /dev/null 2>&1; then
            echo "⚡ 강제 종료 중..."
            kill -9 $BACKEND_PID
        fi
    fi
    rm -f .backend.pid
fi

# 추가 프로세스 정리
echo "🧹 관련 프로세스 정리 중..."
pkill -f "ts-node.*src/main/index.ts" 2>/dev/null || true
pkill -f "node.*src/main/index.ts" 2>/dev/null || true

# 포트 3001 해제
if lsof -ti:3001 >/dev/null 2>&1; then
    echo "🔓 포트 3001 해제 중..."
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
fi

sleep 1
echo "✅ 백엔드 서버가 종료되었습니다."
