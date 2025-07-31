import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-coverage',
    'storybook-addon-pseudo-states',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  parameters: {
    chromatic: {
      // Chromatic 설정
      viewports: [320, 1200, 1920],
      delay: 1000,
      diffThreshold: 0.2,
    },
    // 레지레션 테스트 설정
    test: {
      // 테스트 환경 설정
      disable: false,
    },
  },
};

export default config; 