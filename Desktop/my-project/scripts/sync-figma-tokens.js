const fs = require('fs');
const path = require('path');

if (process.argv.length < 3) {
  console.error('사용법: node scripts/sync-figma-tokens.js <figma_export.json>');
  process.exit(1);
}

const source = process.argv[2];
const dest = path.resolve(__dirname, '../src/renderer/shared/tokens.json');

try {
  const data = fs.readFileSync(source, 'utf-8');
  // 유효성 검사(간단): JSON 파싱
  JSON.parse(data);
  fs.writeFileSync(dest, data, 'utf-8');
  console.log(`Figma 토큰을 tokens.json에 동기화 완료: ${dest}`);
} catch (e) {
  console.error('동기화 실패:', e.message);
  process.exit(2);
} 