import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Grid from './Grid';
import Button from './Button';
import Typography from './Typography';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';

const meta: Meta<typeof Grid> = {
  title: 'Shared/Grid',
  component: Grid,
  argTypes: {
    columns: { control: { type: 'number', min: 1, max: 6 } },
    gap: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof Grid>;

const withTheme = (StoryComponent: React.FC<any>) => (args: any) => (
  <ThemeProvider theme={theme}>
    <StoryComponent {...args} />
  </ThemeProvider>
);

export const Default: Story = {
  args: {
    columns: 3,
    children: [
      <Button key="1">버튼1</Button>,
      <Button key="2">버튼2</Button>,
      <Button key="3">버튼3</Button>,
    ],
  },
  render: withTheme(Grid),
};

export const WithTypography: Story = {
  args: {
    columns: 2,
    gap: theme.spacing.lg,
    children: [
      <Typography key="1" variant="h4">왼쪽</Typography>,
      <Typography key="2" variant="body">오른쪽</Typography>,
    ],
  },
  render: withTheme(Grid),
}; 