#!/bin/bash

# Quest 서비스 상태 확인 스크립트
echo "Quest 서비스 상태 확인"
echo "=========================="

# 백엔드 서버 상태
echo "📡 백엔드 서버 (포트 3001):"
if curl -s http://localhost:3001/api/health >/dev/null 2>&1; then
    echo "   ✅ 정상 실행 중"
    BACKEND_STATUS="✅"
else
    echo "   ❌ 연결 실패"
    BACKEND_STATUS="❌"
fi

# React 서버 상태
echo "⚛️  React 서버 (포트 4000):"
if curl -s http://localhost:4000 >/dev/null 2>&1; then
    echo "   ✅ 정상 실행 중"
    REACT_STATUS="✅"
else
    echo "   ❌ 연결 실패"
    REACT_STATUS="❌"
fi

# Electron 앱 상태
echo "🖥️  Electron 앱:"
if ps aux | grep -E "electron.*main.js" | grep -v grep >/dev/null 2>&1; then
    echo "   ✅ 실행 중"
    ELECTRON_STATUS="✅"
else
    echo "   ❌ 실행되지 않음"
    ELECTRON_STATUS="❌"
fi

# 실행 중인 프로세스 수
PROCESS_COUNT=$(ps aux | grep -E "(ts-node|webpack|electron)" | grep -v grep | wc -l | tr -d ' ')
echo "📈 실행 중인 프로세스: ${PROCESS_COUNT}개"

# 포트 사용 상태
echo ""
echo "🔌 포트 사용 상태:"
if lsof -i:3001 >/dev/null 2>&1; then
    echo "   포트 3001: 사용 중"
else
    echo "   포트 3001: 비어있음"
fi

if lsof -i:4000 >/dev/null 2>&1; then
    echo "   포트 4000: 사용 중"
else
    echo "   포트 4000: 비어있음"
fi

# 요약
echo ""
echo "📋 서비스 요약:"
echo "   백엔드: $BACKEND_STATUS | React: $REACT_STATUS | Electron: $ELECTRON_STATUS"

if [[ "$BACKEND_STATUS" == "✅" && "$REACT_STATUS" == "✅" && "$ELECTRON_STATUS" == "✅" ]]; then
    echo "🎉 모든 서비스가 정상 실행 중입니다!"
    exit 0
else
    echo "⚠️  일부 서비스에 문제가 있습니다."
    echo ""
    echo "🔧 문제 해결 방법:"
    if [[ "$BACKEND_STATUS" == "❌" ]]; then
        echo "   - 백엔드: ./start-backend.sh"
    fi
    if [[ "$REACT_STATUS" == "❌" ]]; then
        echo "   - React: npm run dev:react"
    fi
    if [[ "$ELECTRON_STATUS" == "❌" ]]; then
        echo "   - Electron: npm run dev:electron"
    fi
    echo "   - 전체 재시작: npm run dev:stable"
    exit 1
fi
