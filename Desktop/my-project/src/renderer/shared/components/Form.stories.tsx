import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Form, { FormField } from './Form';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';

const fields: FormField[] = [
  { name: 'name', label: '이름', type: 'text', required: true, placeholder: '이름을 입력하세요' },
  { name: 'role', label: '역할', type: 'select', options: [ { label: '관리자', value: 'admin' }, { label: '사용자', value: 'user' } ], required: true },
  { name: 'bio', label: '소개', type: 'textarea', placeholder: '자기소개를 입력하세요' },
];

const meta: Meta<typeof Form> = {
  title: 'Shared/Form',
  component: Form,
  argTypes: {
    layout: { control: { type: 'select', options: ['vertical', 'horizontal'] } },
    variant: { control: { type: 'select', options: ['default', 'bordered'] } },
  },
};
export default meta;

type Story = StoryObj<typeof Form>;

const withTheme = (StoryComponent: React.FC<any>) => (args: any) => (
  <ThemeProvider theme={theme}>
    <StoryComponent {...args} />
  </ThemeProvider>
);

export const Default: Story = {
  args: {
    fields,
    onSubmit: (values: any) => alert(JSON.stringify(values)),
    layout: 'vertical',
    variant: 'default',
    submitLabel: '저장',
  },
  render: withTheme(Form),
};

export const Horizontal: Story = {
  args: {
    fields,
    onSubmit: (values: any) => alert(JSON.stringify(values)),
    layout: 'horizontal',
    variant: 'default',
    submitLabel: '저장',
  },
  render: withTheme(Form),
};

export const Bordered: Story = {
  args: {
    fields,
    onSubmit: (values: any) => alert(JSON.stringify(values)),
    layout: 'vertical',
    variant: 'bordered',
    submitLabel: '등록',
  },
  render: withTheme(Form),
}; 