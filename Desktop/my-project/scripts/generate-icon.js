const fs = require('fs');
const path = require('path');

// Quest 아이콘 SVG 생성
const questIconSVG = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- 배경 -->
  <rect width="512" height="512" rx="80" fill="url(#bg)" filter="url(#shadow)"/>
  
  <!-- 클립보드 -->
  <g transform="translate(128, 128)">
    <!-- 클립보드 보드 -->
    <rect x="0" y="40" width="256" height="160" rx="12" fill="white" opacity="0.95"/>
    
    <!-- 클립 -->
    <rect x="108" y="0" width="40" height="60" rx="8" fill="white" opacity="0.9"/>
    <circle cx="128" cy="20" r="6" fill="#2563eb"/>
    
    <!-- 텍스트 라인들 -->
    <rect x="20" y="60" width="216" height="3" rx="1.5" fill="#6b7280"/>
    <rect x="20" y="80" width="160" height="3" rx="1.5" fill="#9ca3af"/>
    <rect x="20" y="100" width="120" height="3" rx="1.5" fill="#d1d5db"/>
    
    <!-- 체크 표시 -->
    <g transform="translate(200, 140)">
      <circle cx="20" cy="20" r="24" fill="#10b981"/>
      <path d="M 8 20 L 16 28 L 32 12" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </g>
  
  <!-- Quest 텍스트 -->
  <text x="256" y="420" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="bold" opacity="0.95">
    Quest
  </text>
</svg>
`;

// 아이콘 디렉토리 생성
const iconDir = path.join(__dirname, '../src/main/electron/assets');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// SVG 파일 저장
const svgPath = path.join(iconDir, 'quest-icon.svg');
fs.writeFileSync(svgPath, questIconSVG);

console.log('✅ Quest 아이콘 SVG 생성 완료:', svgPath);

// HTML 파일 생성 (아이콘 미리보기용)
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Quest App Icon</title>
  <style>
    body { 
      background: #f0f0f0; 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      height: 100vh; 
      margin: 0; 
    }
    .icon { 
      width: 256px; 
      height: 256px; 
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
  </style>
</head>
<body>
  <img src="quest-icon.svg" class="icon" alt="Quest App Icon">
</body>
</html>
`;

const htmlPath = path.join(iconDir, 'icon-preview.html');
fs.writeFileSync(htmlPath, htmlContent);

console.log('✅ 아이콘 미리보기 HTML 생성 완료:', htmlPath);
console.log('\n📋 다음 단계:');
console.log('1. 브라우저에서 icon-preview.html을 열어 아이콘 확인');
console.log('2. 온라인 SVG to ICO 변환 도구 사용 (예: convertio.co)');
console.log('3. 생성된 icon.ico 파일을 assets 폴더에 저장');
console.log('4. main.js에서 아이콘 경로 확인');
