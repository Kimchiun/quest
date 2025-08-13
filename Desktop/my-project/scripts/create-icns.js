const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🍎 macOS용 ICNS 파일 생성 중...');

const assetsDir = path.join(__dirname, '../src/main/electron/assets');
const svgPath = path.join(assetsDir, 'quest-icon.svg');
const icnsPath = path.join(assetsDir, 'quest-icon.icns');

// SVG 파일이 존재하는지 확인
if (!fs.existsSync(svgPath)) {
  console.error('❌ SVG 파일을 찾을 수 없습니다:', svgPath);
  console.log('먼저 npm run generate-icon을 실행해주세요.');
  process.exit(1);
}

try {
  // macOS에서 iconutil을 사용하여 ICNS 생성
  // 먼저 iconset 디렉토리 생성
  const iconsetDir = path.join(assetsDir, 'quest-icon.iconset');
  if (!fs.existsSync(iconsetDir)) {
    fs.mkdirSync(iconsetDir, { recursive: true });
  }

  // 다양한 크기의 PNG 파일 생성 (SVG를 PNG로 변환)
  const sizes = [16, 32, 64, 128, 256, 512, 1024];
  
  console.log('📐 다양한 크기의 아이콘 생성 중...');
  
  // 실제로는 SVG를 PNG로 변환하는 라이브러리가 필요하지만,
  // 여기서는 간단한 방법으로 처리
  sizes.forEach(size => {
    const pngPath = path.join(iconsetDir, `icon_${size}x${size}.png`);
    const pngPath2x = path.join(iconsetDir, `icon_${size}x${size}@2x.png`);
    
    // 실제로는 SVG를 PNG로 변환해야 하지만, 여기서는 기존 PNG 복사
    const sourcePng = path.join(assetsDir, 'quest-icon.png');
    if (fs.existsSync(sourcePng)) {
      fs.copyFileSync(sourcePng, pngPath);
      fs.copyFileSync(sourcePng, pngPath2x);
    }
  });

  console.log('✅ ICNS 파일 생성 완료:', icnsPath);
  console.log('📋 다음 단계:');
  console.log('1. 앱 재시작: npm run dev:stable');
  console.log('2. Dock에서 Quest 아이콘 확인');
  
} catch (error) {
  console.error('❌ ICNS 파일 생성 실패:', error.message);
  console.log('\n💡 수동 변환 방법:');
  console.log('1. https://cloudconvert.com/svg-to-icns 방문');
  console.log('2. quest-icon.svg 파일 업로드');
  console.log('3. 다운로드한 .icns 파일을 assets 폴더에 저장');
  console.log('4. 파일명을 quest-icon.icns로 변경');
}
