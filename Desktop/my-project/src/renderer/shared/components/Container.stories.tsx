import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Container from './Container';
import Button from './Button';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';

const meta: Meta<typeof Container> = {
  title: 'Shared/Container',
  component: Container,
  argTypes: {
    maxWidth: { control: 'text' },
    padding: { control: 'text' },
    background: { control: 'color' },
    radius: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof Container>;

const withTheme = (StoryComponent: React.FC<any>) => (args: any) => (
  <ThemeProvider theme={theme}>
    <StoryComponent {...args} />
  </ThemeProvider>
);

export const Default: Story = {
  args: {
    children: <div>기본 컨테이너입니다.</div>,
  },
  render: withTheme(Container),
};

export const CustomBackground: Story = {
  args: {
    background: theme.color.primary,
    padding: theme.spacing.xl,
    radius: theme.radius.lg,
    children: <div style={{ color: '#fff' }}>파란 배경, 큰 패딩, 큰 radius</div>,
  },
  render: withTheme(Container),
};

export const WithButton: Story = {
  args: {
    children: <Button>컨테이너 안의 버튼</Button>,
    maxWidth: '400px',
    padding: theme.spacing.md,
  },
  render: withTheme(Container),
}; 