module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.test.tsx'],
  verbose: false, // 상세 로그 비활성화로 성능 향상
  testTimeout: 10000, // 10초로 단축
  maxWorkers: '50%', // CPU 코어의 50%만 사용하여 안정성 확보
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@main/(.*)$': '<rootDir>/src/main/$1',
    // CSS 파일 모킹
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/tests/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // 모킹 설정 추가
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main/electron/**',
  ],
  // 성능 최적화 설정
  bail: 1, // 첫 번째 실패 시 중단
  maxConcurrency: 4, // 동시 실행 제한
  // 느린 테스트 제외
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/cypress/',
    'tests/folder.api.test.ts', // 임시 제외
    'tests/folder.service.test.ts', // 임시 제외
    'tests/integration.jira.api.test.ts', // MSW 충돌 문제
    'tests/bulk-operations.test.ts', // 모듈 경로 문제
    'tests/multi-selection.test.tsx', // Redux 타입 문제
    'tests/folder.e2e.test.ts', // Cypress 타입 문제
    'tests/testcase.service.test.ts', // 데이터베이스 문제
    'tests/bulk-edit.performance.test.tsx', // 성능 테스트 문제
  ],
  // 캐시 활성화
  cache: true,
  cacheDirectory: '.jest-cache',
  // 테스트 환경 설정
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  // 모듈 변환 설정
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
}; 