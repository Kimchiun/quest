#!/usr/bin/env node

/**
 * 디자인 시스템 검증 스크립트
 * 
 * 이 스크립트는 다음을 검증합니다:
 * 1. 토큰 사용 여부
 * 2. 컴포넌트 일관성
 * 3. Storybook 문서화 완성도
 */

const fs = require('fs');
const path = require('path');

// 검증할 파일들
const TOKEN_FILES = [
  'src/renderer/shared/tokens.json',
  'src/renderer/shared/theme.ts',
  'src/renderer/shared/styled.d.ts'
];

const COMPONENT_FILES = [
  'src/renderer/shared/components/Card.tsx',
  'src/renderer/shared/components/Grid.tsx',
  'src/renderer/shared/components/Typography.tsx',
  'src/renderer/shared/components/Container.tsx'
];

const STORY_FILES = [
  'src/renderer/shared/components/Card.stories.tsx',
  'src/renderer/shared/components/Grid.stories.tsx',
  'src/renderer/shared/components/Typography.stories.tsx',
  'src/renderer/shared/components/Container.stories.tsx'
];

function checkFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ 파일이 존재하지 않습니다: ${filePath}`);
    return false;
  }
  return true;
}

function validateTokens() {
  console.log('\n🔍 토큰 파일 검증 중...');
  
  let allValid = true;
  
  for (const file of TOKEN_FILES) {
    if (!checkFileExists(file)) {
      allValid = false;
      continue;
    }
    
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      if (file.endsWith('.json')) {
        JSON.parse(content); // JSON 유효성 검사
        console.log(`✅ ${file} - 유효한 JSON`);
      } else {
        console.log(`✅ ${file} - 존재함`);
      }
    } catch (error) {
      console.error(`❌ ${file} - 오류: ${error.message}`);
      allValid = false;
    }
  }
  
  return allValid;
}

function validateComponents() {
  console.log('\n🔍 컴포넌트 파일 검증 중...');
  
  let allValid = true;
  
  for (const file of COMPONENT_FILES) {
    if (!checkFileExists(file)) {
      allValid = false;
      continue;
    }
    
    const content = fs.readFileSync(file, 'utf8');
    
    // 토큰 사용 여부 확인
    const hasThemeUsage = content.includes('theme.') || content.includes('Theme');
    const hasStyledComponents = content.includes('styled-components');
    
    if (hasThemeUsage && hasStyledComponents) {
      console.log(`✅ ${file} - 토큰 기반 스타일링 사용`);
    } else {
      console.log(`⚠️  ${file} - 토큰 사용이 제한적일 수 있음`);
    }
  }
  
  return allValid;
}

function validateStories() {
  console.log('\n🔍 Storybook 파일 검증 중...');
  
  let allValid = true;
  
  for (const file of STORY_FILES) {
    if (!checkFileExists(file)) {
      allValid = false;
      continue;
    }
    
    const content = fs.readFileSync(file, 'utf8');
    
    // Storybook 구조 확인
    const hasMeta = content.includes('Meta<');
    const hasStories = content.includes('Story =');
    const hasThemeProvider = content.includes('ThemeProvider');
    
    if (hasMeta && hasStories && hasThemeProvider) {
      console.log(`✅ ${file} - 완전한 Storybook 구조`);
    } else {
      console.log(`⚠️  ${file} - Storybook 구조가 불완전할 수 있음`);
    }
  }
  
  return allValid;
}

function generateReport() {
  console.log('\n📊 디자인 시스템 검증 보고서');
  console.log('=' .repeat(50));
  
  const tokensValid = validateTokens();
  const componentsValid = validateComponents();
  const storiesValid = validateStories();
  
  console.log('\n📋 요약:');
  console.log(`토큰 시스템: ${tokensValid ? '✅' : '❌'}`);
  console.log(`컴포넌트 일관성: ${componentsValid ? '✅' : '⚠️'}`);
  console.log(`Storybook 문서화: ${storiesValid ? '✅' : '⚠️'}`);
  
  if (tokensValid && componentsValid && storiesValid) {
    console.log('\n🎉 디자인 시스템이 성공적으로 검증되었습니다!');
    process.exit(0);
  } else {
    console.log('\n⚠️  일부 검증이 실패했습니다. 위의 문제들을 해결해주세요.');
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  generateReport();
}

module.exports = {
  validateTokens,
  validateComponents,
  validateStories,
  generateReport
}; 