#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Quest 개발 환경 진단 시작...\n');

// 1. 포트 사용 현황 확인
function checkPorts() {
  console.log('📡 포트 사용 현황 확인 중...');
  try {
    const ports = [3000, 4000];
    ports.forEach(port => {
      try {
        const result = execSync(`lsof -ti:${port}`, { encoding: 'utf8' });
        if (result.trim()) {
          console.log(`⚠️  포트 ${port} 사용 중: PID ${result.trim()}`);
        } else {
          console.log(`✅ 포트 ${port} 사용 가능`);
        }
      } catch (error) {
        console.log(`✅ 포트 ${port} 사용 가능`);
      }
    });
  } catch (error) {
    console.log('❌ 포트 확인 실패:', error.message);
  }
  console.log('');
}

// 2. 프로세스 확인
function checkProcesses() {
  console.log('🔄 관련 프로세스 확인 중...');
  try {
    const processes = ['electron', 'webpack', 'node.*src'];
    processes.forEach(processName => {
      try {
        const result = execSync(`ps aux | grep "${processName}" | grep -v grep`, { encoding: 'utf8' });
        if (result.trim()) {
          console.log(`⚠️  ${processName} 프로세스 실행 중:`);
          console.log(result.trim());
        } else {
          console.log(`✅ ${processName} 프로세스 없음`);
        }
      } catch (error) {
        console.log(`✅ ${processName} 프로세스 없음`);
      }
    });
  } catch (error) {
    console.log('❌ 프로세스 확인 실패:', error.message);
  }
  console.log('');
}

// 3. 파일 존재 확인
function checkFiles() {
  console.log('📁 필수 파일 확인 중...');
  const files = [
    'src/main/electron/main.js',
    'src/main/index.ts',
    'webpack.renderer.config.js',
    'package.json'
  ];
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} 존재`);
    } else {
      console.log(`❌ ${file} 없음`);
    }
  });
  console.log('');
}

// 4. 의존성 확인
function checkDependencies() {
  console.log('📦 의존성 확인 중...');
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = ['electron', 'react', 'express', 'webpack'];
    
    requiredDeps.forEach(dep => {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        console.log(`✅ ${dep} 설치됨 (${packageJson.dependencies[dep]})`);
      } else if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
        console.log(`✅ ${dep} 설치됨 (${packageJson.devDependencies[dep]})`);
      } else {
        console.log(`❌ ${dep} 설치되지 않음`);
      }
    });
  } catch (error) {
    console.log('❌ package.json 읽기 실패:', error.message);
  }
  console.log('');
}

// 5. 환경 정리
function cleanup() {
  console.log('🧹 환경 정리 중...');
  try {
    execSync('pkill -f "electron|webpack|node.*src" 2>/dev/null || true');
    execSync('lsof -ti:3000,4000 | xargs kill -9 2>/dev/null || true');
    console.log('✅ 환경 정리 완료');
  } catch (error) {
    console.log('❌ 환경 정리 실패:', error.message);
  }
  console.log('');
}

// 6. 서비스 시작 테스트
function testServices() {
  console.log('🚀 서비스 시작 테스트...');
  
  // 백엔드 테스트
  try {
    console.log('테스트 중: 백엔드 서버...');
    const backend = spawn('npm', ['run', 'dev:backend'], { 
      stdio: 'pipe',
      detached: true 
    });
    
    setTimeout(() => {
      try {
        const result = execSync('curl -s http://localhost:3000/api/auth/login -X POST -H "Content-Type: application/json" -d \'{"username": "admin", "password": "admin123"}\' | head -1', { timeout: 5000 });
        console.log('✅ 백엔드 서버 정상');
        backend.kill();
      } catch (error) {
        console.log('❌ 백엔드 서버 응답 없음');
        backend.kill();
      }
    }, 5000);
    
  } catch (error) {
    console.log('❌ 백엔드 서버 시작 실패:', error.message);
  }
  
  // React 서버 테스트
  setTimeout(() => {
    try {
      console.log('테스트 중: React 개발 서버...');
      const react = spawn('npm', ['run', 'dev:react'], { 
        stdio: 'pipe',
        detached: true 
      });
      
      setTimeout(() => {
        try {
          const result = execSync('curl -s http://localhost:4000 | head -3', { timeout: 5000 });
          console.log('✅ React 개발 서버 정상');
          react.kill();
        } catch (error) {
          console.log('❌ React 개발 서버 응답 없음');
          react.kill();
        }
      }, 10000);
      
    } catch (error) {
      console.log('❌ React 개발 서버 시작 실패:', error.message);
    }
  }, 6000);
}

// 메인 실행
function main() {
  checkPorts();
  checkProcesses();
  checkFiles();
  checkDependencies();
  
  const args = process.argv.slice(2);
  if (args.includes('--cleanup')) {
    cleanup();
  }
  
  if (args.includes('--test')) {
    testServices();
  }
  
  console.log('🎯 진단 완료!');
  console.log('\n💡 해결 방법:');
  console.log('1. npm run dev:clean - 환경 정리');
  console.log('2. npm run reset - 완전 초기화');
  console.log('3. npm run dev - 개발 서버 시작');
}

main(); 