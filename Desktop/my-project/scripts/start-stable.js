#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 안정적인 개발 환경 시작 중...');

// 프로세스 정리
function cleanup() {
  return new Promise((resolve) => {
    console.log('🧹 프로세스 정리 중...');
    exec('pkill -f "electron|webpack|node.*src" 2>/dev/null || true', () => {
      exec('lsof -ti:3000,4000 | xargs kill -9 2>/dev/null || true', () => {
        setTimeout(resolve, 2000);
      });
    });
  });
}

// 포트 확인
function checkPort(port) {
  return new Promise((resolve) => {
    const net = require('net');
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => resolve(true));
      server.close();
    });
    server.on('error', () => resolve(false));
  });
}

// 서비스 시작
function startService(command, name) {
  return new Promise((resolve, reject) => {
    console.log(`📡 ${name} 시작 중...`);
    const child = spawn(command, [], { 
      stdio: 'inherit',
      shell: true 
    });
    
    child.on('error', (error) => {
      console.error(`❌ ${name} 시작 실패:`, error);
      reject(error);
    });
    
    // 10초 후 성공으로 간주
    setTimeout(() => {
      console.log(`✅ ${name} 시작 완료`);
      resolve(child);
    }, 10000);
  });
}

// 메인 실행
async function main() {
  try {
    // 1. 정리
    await cleanup();
    
    // 2. 백엔드 시작
    const backend = await startService('npm run dev:backend', '백엔드 서버');
    
    // 3. React 서버 시작
    const react = await startService('npm run dev:react', 'React 서버');
    
    // 4. Electron 시작
    const electron = await startService('npm run dev:electron', 'Electron 앱');
    
    console.log('🎉 모든 서비스가 성공적으로 시작되었습니다!');
    console.log('📱 Electron 데스크탑 앱이 곧 표시됩니다.');
    console.log('🔗 백엔드: http://localhost:3000');
    console.log('🔗 React: http://localhost:4000');
    
    // 프로세스 종료 처리
    process.on('SIGINT', () => {
      console.log('\n🛑 서비스 종료 중...');
      backend.kill();
      react.kill();
      electron.kill();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ 서비스 시작 실패:', error);
    process.exit(1);
  }
}

main(); 