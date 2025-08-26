#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Quest 개발 환경 설정을 시작합니다...\n');

// 1. 환경 변수 파일 생성
function createEnvFile() {
  const envExamplePath = path.join(__dirname, '..', 'env.example');
  const envPath = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log('✅ .env 파일이 생성되었습니다.');
    } else {
      console.log('⚠️ env.example 파일을 찾을 수 없습니다.');
    }
  } else {
    console.log('ℹ️ .env 파일이 이미 존재합니다.');
  }
}

// 2. 데이터베이스 초기화 확인
function checkDatabase() {
  console.log('\n📊 데이터베이스 연결을 확인합니다...');
  try {
    // PostgreSQL 연결 확인 (간단한 방법)
    execSync('pg_isready -h localhost -p 5432', { stdio: 'ignore' });
    console.log('✅ PostgreSQL이 실행 중입니다.');
  } catch (error) {
    console.log('⚠️ PostgreSQL이 실행되지 않았습니다.');
    console.log('   PostgreSQL을 설치하고 실행해주세요:');
    console.log('   - macOS: brew install postgresql && brew services start postgresql');
    console.log('   - Windows: https://www.postgresql.org/download/windows/');
    console.log('   - Linux: sudo apt-get install postgresql postgresql-contrib');
  }
}

// 3. 의존성 설치 확인
function checkDependencies() {
  console.log('\n📦 의존성을 확인합니다...');
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ package.json을 찾을 수 없습니다.');
    return;
  }
  
  const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 node_modules가 없습니다. 의존성을 설치합니다...');
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log('✅ 의존성 설치가 완료되었습니다.');
    } catch (error) {
      console.log('❌ 의존성 설치에 실패했습니다.');
    }
  } else {
    console.log('✅ node_modules가 존재합니다.');
  }
}

// 4. 개발 서버 시작 가이드
function showStartGuide() {
  console.log('\n🎯 개발 서버를 시작하려면 다음 명령어를 사용하세요:');
  console.log('');
  console.log('1. 백엔드 서버 시작:');
  console.log('   npm run dev:backend');
  console.log('');
  console.log('2. 프론트엔드 개발 서버 시작:');
  console.log('   npm run dev:react');
  console.log('');
  console.log('3. Electron 앱 시작:');
  console.log('   npm run dev:electron');
  console.log('');
  console.log('4. 모든 서비스 한 번에 시작:');
  console.log('   npm run dev');
  console.log('');
  console.log('5. 안정적인 개발 환경:');
  console.log('   npm run dev:stable');
  console.log('');
}

// 5. 문제 해결 가이드
function showTroubleshooting() {
  console.log('\n🔧 문제 해결:');
  console.log('');
  console.log('- 포트 충돌 시: npm run dev:clean');
  console.log('- 캐시 초기화: npm run clean');
  console.log('- 완전 초기화: npm run reset');
  console.log('- 진단 도구: npm run diagnostic');
  console.log('');
}

// 메인 실행
function main() {
  try {
    createEnvFile();
    checkDependencies();
    checkDatabase();
    showStartGuide();
    showTroubleshooting();
    
    console.log('🎉 개발 환경 설정이 완료되었습니다!');
  } catch (error) {
    console.error('❌ 설정 중 오류가 발생했습니다:', error.message);
    process.exit(1);
  }
}

main(); 