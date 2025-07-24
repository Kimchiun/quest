import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Notification, { NotificationType } from './Notification';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';

const meta: Meta<typeof Notification> = {
  title: 'Shared/Notification',
  component: Notification,
  argTypes: {
    type: { control: { type: 'select', options: ['info', 'success', 'error', 'warning'] } },
    message: { control: 'text' },
    duration: { control: 'number' },
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
    message: '정보 알림입니다.',
  },
  render: withTheme(Notification),
};

export const Success: Story = {
  args: {
    type: 'success',
    message: '성공적으로 처리되었습니다!',
  },
  render: withTheme(Notification),
};

export const Error: Story = {
  args: {
    type: 'error',
    message: '오류가 발생했습니다.',
  },
  render: withTheme(Notification),
};

export const Warning: Story = {
  args: {
    type: 'warning',
    message: '경고: 주의가 필요합니다.',
  },
  render: withTheme(Notification),
};

export const AutoClose: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <ThemeProvider theme={theme}>
        {open && <Notification type="info" message="3초 후 자동 닫힘" duration={3000} onClose={() => setOpen(false)} />}
      </ThemeProvider>
    );
  },
}; 