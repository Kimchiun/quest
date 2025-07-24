import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Table, { TableColumn } from './Table';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const columns: TableColumn<User>[] = [
  { key: 'id', title: 'ID', width: 60, align: 'center' },
  { key: 'name', title: '이름' },
  { key: 'email', title: '이메일' },
  { key: 'role', title: '역할', render: (v) => <b>{v}</b> },
];

const data: User[] = [
  { id: 1, name: '홍길동', email: 'hong@test.com', role: 'Admin' },
  { id: 2, name: '김철수', email: 'kim@test.com', role: 'User' },
  { id: 3, name: '이영희', email: 'lee@test.com', role: 'User' },
];

const meta: Meta<typeof Table> = {
  title: 'Shared/Table',
  component: Table,
  argTypes: {
    variant: { control: { type: 'select', options: ['default', 'bordered', 'striped'] } },
    size: { control: { type: 'select', options: ['sm', 'md', 'lg'] } },
    striped: { control: 'boolean' },
    bordered: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Table>;

type UserTableProps = React.ComponentProps<typeof Table<User>>;

const withTheme = (StoryComponent: React.FC<any>) => (args: UserTableProps) => (
  <ThemeProvider theme={theme}>
    <StoryComponent {...args} />
  </ThemeProvider>
);

export const Default: Story = {
  render: () => (
    <ThemeProvider theme={theme}>
      <Table<User> columns={columns} data={data} variant="default" size="md" striped={false} bordered={false} />
    </ThemeProvider>
  ),
};

export const Striped: Story = {
  render: () => (
    <ThemeProvider theme={theme}>
      <Table<User> columns={columns} data={data} striped bordered={false} />
    </ThemeProvider>
  ),
};

export const Bordered: Story = {
  render: () => (
    <ThemeProvider theme={theme}>
      <Table<User> columns={columns} data={data} striped={false} bordered />
    </ThemeProvider>
  ),
};

export const SizeVariants: Story = {
  render: () => (
    <ThemeProvider theme={theme}>
      <Table<User> columns={columns} data={data} size="sm" style={{ marginBottom: 24 }} />
      <Table<User> columns={columns} data={data} size="md" style={{ marginBottom: 24 }} />
      <Table<User> columns={columns} data={data} size="lg" />
    </ThemeProvider>
  ),
}; 