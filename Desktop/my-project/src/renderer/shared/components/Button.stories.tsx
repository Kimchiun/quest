import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import Button from './Button';
import type { ButtonVariant, ButtonSize } from './Button';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Button> = {
  title: 'Shared/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  decorators: [Story => <ThemeProvider theme={theme}><Story /></ThemeProvider>],
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    size: 'md',
  },
};

export const Danger: Story = {
  args: {
    children: 'Danger Button',
    variant: 'danger',
    size: 'md',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    variant: 'primary',
    size: 'md',
    disabled: true,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <>
      <Button {...args} size="sm">Small</Button>{' '}
      <Button {...args} size="md">Medium</Button>{' '}
      <Button {...args} size="lg">Large</Button>
    </>
  ),
  args: {
    children: 'Button',
    variant: 'primary',
  },
}; 