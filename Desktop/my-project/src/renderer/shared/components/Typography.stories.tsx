import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Typography from './Typography';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';

const meta: Meta<typeof Typography> = {
  title: 'Shared/Typography',
  component: Typography,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'caption'],
    },
    color: { control: 'color' },
    weight: { control: 'number' },
    align: { control: { type: 'select', options: ['left', 'center', 'right'] } },
  },
};
export default meta;

type Story = StoryObj<typeof Typography>;

const withTheme = (StoryComponent: React.FC<any>) => (args: any) => (
  <ThemeProvider theme={theme}>
    <StoryComponent {...args} />
  </ThemeProvider>
);

export const Headings: Story = {
  render: () => (
    <ThemeProvider theme={theme}>
      <Typography variant="h1">H1 헤딩</Typography>
      <Typography variant="h2">H2 헤딩</Typography>
      <Typography variant="h3">H3 헤딩</Typography>
      <Typography variant="h4">H4 헤딩</Typography>
      <Typography variant="h5">H5 헤딩</Typography>
      <Typography variant="h6">H6 헤딩</Typography>
    </ThemeProvider>
  ),
};

export const Body: Story = {
  args: {
    children: '본문 텍스트입니다.',
    variant: 'body',
  },
  render: withTheme(Typography),
};

export const Caption: Story = {
  args: {
    children: '캡션 텍스트',
    variant: 'caption',
  },
  render: withTheme(Typography),
};

export const CustomColor: Story = {
  args: {
    children: '커스텀 색상 텍스트',
    color: theme.color.primary,
    variant: 'body',
  },
  render: withTheme(Typography),
};

export const AlignWeight: Story = {
  args: {
    children: '가운데 정렬, 볼드',
    align: 'center',
    weight: theme.font.weightBold,
    variant: 'body',
  },
  render: withTheme(Typography),
}; 