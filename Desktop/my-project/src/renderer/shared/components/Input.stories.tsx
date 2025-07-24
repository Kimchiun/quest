import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import Input from './Input';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Input> = {
  title: 'Shared/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    type: { control: 'text' },
  },
  decorators: [Story => <ThemeProvider theme={theme}><Story /></ThemeProvider>],
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: '입력하세요',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: '비활성화',
    disabled: true,
  },
};

export const Password: Story = {
  args: {
    placeholder: '비밀번호',
    type: 'password',
  },
}; 