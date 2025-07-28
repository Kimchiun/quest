import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Container from './Container';
import Button from './Button';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';

const meta: Meta<typeof Container> = {
  title: 'Components/Container',
  component: Container,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    $maxWidth: {
      control: { type: 'text' },
      description: 'Maximum width of the container',
    },
    $padding: {
      control: { type: 'text' },
      description: 'Padding of the container',
    },
    $background: {
      control: { type: 'text' },
      description: 'Background color of the container',
    },
    $radius: {
      control: { type: 'text' },
      description: 'Border radius of the container',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const withTheme = (StoryComponent: React.FC<any>) => (args: any) => (
  <ThemeProvider theme={theme}>
    <StoryComponent {...args} />
  </ThemeProvider>
);

export const Default: Story = {
  args: {
    $maxWidth: '800px',
    $padding: '24px',
    $background: 'white',
    $radius: '8px',
    children: <div>Container content goes here</div>,
  },
};

export const WithBackground: Story = {
  args: {
    $maxWidth: '600px',
    $padding: '32px',
    $background: '#f3f4f6',
    $radius: '12px',
    children: 'Container with background color',
  },
};

export const Narrow: Story = {
  args: {
    $maxWidth: '400px',
    $padding: '16px',
    $background: '#f8fafc',
    $radius: '4px',
    children: <div>Narrow container with different styling</div>,
  },
};

export const CustomBackground: Story = {
  args: {
    $background: theme.color.primary,
    $padding: theme.spacing.xl,
    $radius: theme.radius.lg,
    children: <div style={{ color: '#fff' }}>파란 배경, 큰 패딩, 큰 radius</div>,
  },
  render: withTheme(Container),
};

export const WithButton: Story = {
  args: {
    children: <Button>컨테이너 안의 버튼</Button>,
    $maxWidth: '400px',
    $padding: theme.spacing.md,
  },
  render: withTheme(Container),
};

export const Dark: Story = {
  args: {
    $maxWidth: '600px',
    $padding: '24px',
    $background: '#1f2937',
    $radius: '8px',
  },
  render: withTheme(Container),
};

export const Wide: Story = {
  args: {
    $maxWidth: '1200px',
    $padding: '32px',
    $background: '#f1f5f9',
    $radius: '12px',
    children: <div>Wide container with more padding</div>,
  },
}; 