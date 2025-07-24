import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Icon, { IconName } from './Icon';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';

const meta: Meta<typeof Icon> = {
  title: 'Shared/Icon',
  component: Icon,
  argTypes: {
    name: {
      control: { type: 'select' },
      options: ['plus', 'check', 'close'],
    },
    size: { control: { type: 'number', min: 8, max: 64, step: 2 } },
    color: { control: 'color' },
  },
};
export default meta;

type Story = StoryObj<typeof Icon>;

const withTheme = (StoryComponent: React.FC<any>) => (args: any) => (
  <ThemeProvider theme={theme}>
    <StoryComponent {...args} />
  </ThemeProvider>
);

export const Plus: Story = {
  args: { name: 'plus', size: 24, color: theme.color.primary },
  render: withTheme(Icon),
};

export const Check: Story = {
  args: { name: 'check', size: 24, color: theme.color.success },
  render: withTheme(Icon),
};

export const Close: Story = {
  args: { name: 'close', size: 24, color: theme.color.danger },
  render: withTheme(Icon),
};

export const Sizes: Story = {
  render: () => (
    <ThemeProvider theme={theme}>
      <div style={{ display: 'flex', gap: 16 }}>
        <Icon name="plus" size={16} color={theme.color.primary} />
        <Icon name="plus" size={24} color={theme.color.primary} />
        <Icon name="plus" size={32} color={theme.color.primary} />
        <Icon name="plus" size={48} color={theme.color.primary} />
      </div>
    </ThemeProvider>
  ),
};

export const Colors: Story = {
  render: () => (
    <ThemeProvider theme={theme}>
      <div style={{ display: 'flex', gap: 16 }}>
        <Icon name="check" size={24} color={theme.color.success} />
        <Icon name="close" size={24} color={theme.color.danger} />
        <Icon name="plus" size={24} color={theme.color.secondary} />
      </div>
    </ThemeProvider>
  ),
};

export const Logo = {
  args: { name: 'logo', size: 40 },
  render: withTheme(Icon),
};

export const Symbol = {
  args: { name: 'symbol', size: 40 },
  render: withTheme(Icon),
}; 