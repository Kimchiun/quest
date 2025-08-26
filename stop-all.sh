#!/bin/bash

# ITMS 전체 서비스 종료 스크립트
echo "🛑 ITMS 전체 서비스 종료 중..."

# Electron 종료
if [ -f ".electron.pid" ]; then
    ELECTRON_PID=$(cat .electron.pid)
    if ps -p $ELECTRON_PID > /dev/null 2>&1; then
        echo "🖥️  Electron 앱 종료 중... (PID: $ELECTRON_PID)"
        kill $ELECTRON_PID 2>/dev/null || true
    fi
    rm -f .electron.pid
fi

# React 서버 종료
if [ -f ".react.pid" ]; then
    REACT_PID=$(cat .react.pid)
    if ps -p $REACT_PID > /dev/null 2>&1; then
        echo "⚛️  React 서버 종료 중... (PID: $REACT_PID)"
        kill $REACT_PID 2>/dev/null || true
    fi
    rm -f .react.pid
fi

# 백엔드 서버 종료
echo "📡 백엔드 서버 종료 중..."
./stop-backend.sh

# 추가 프로세스 정리
echo "🧹 모든 관련 프로세스 정리 중..."
pkill -f "webpack.*renderer" 2>/dev/null || true
pkill -f "electron.*main.js" 2>/dev/null || true
pkill -f "ts-node" 2>/dev/null || true

# 포트 정리
echo "🔓 포트 정리 중..."
lsof -ti:3001 2>/dev/null | xargs kill -9 2>/dev/null || true
lsof -ti:4000 2>/dev/null | xargs kill -9 2>/dev/null || true

sleep 2
echo "✅ 모든 서비스가 종료되었습니다."
