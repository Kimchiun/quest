import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 30000, // 30초로 증가
    requestTimeout: 30000,
    responseTimeout: 30000,
    // 웹팩 오류 해결을 위한 설정
    experimentalModifyObstructiveThirdPartyCode: true,
    // 재시도 설정
    retries: {
      runMode: 2,
      openMode: 0,
    },
    // 환경 변수 설정
    env: {
      NODE_ENV: 'test',
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
  },
});
