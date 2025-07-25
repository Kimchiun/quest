import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Notification from './Notification';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';

const meta: Meta<typeof Notification> = {
  title: 'Shared/Notification',
  component: Notification,
  argTypes: {
    type: { control: 'select', options: ['info', 'success', 'error', 'warning'] },
  },
};
export default meta;

type Story = StoryObj<typeof Notification>;

const withTheme = (StoryComponent: React.FC<any>) => (args: any) => (
  <ThemeProvider theme={theme}>
    <StoryComponent {...args} />
  </ThemeProvider>
);

export const Info: Story = {
  args: {
    type: 'info',
    children: '정보 알림입니다.',
  },
  render: withTheme(Notification),
};

export const Success: Story = {
  args: {
    type: 'success',
    children: '성공적으로 처리되었습니다!',
  },
  render: withTheme(Notification),
};

export const Error: Story = {
  args: {
    type: 'error',
    children: '오류가 발생했습니다.',
  },
  render: withTheme(Notification),
};

export const Warning: Story = {
  args: {
    type: 'warning',
    children: '경고: 주의가 필요합니다.',
  },
  render: withTheme(Notification),
};

export const InfoAutoClose: Story = {
  args: {
    type: 'info',
    children: '3초 후 자동 닫힘',
  },
  render: withTheme(Notification),
}; 