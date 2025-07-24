import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Modal, { ModalSize, ModalVariant } from './Modal';
import Button from './Button';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';

const meta: Meta<typeof Modal> = {
  title: 'Shared/Modal',
  component: Modal,
  argTypes: {
    size: { control: { type: 'select', options: ['sm', 'md', 'lg'] } },
    variant: { control: { type: 'select', options: ['default', 'danger', 'success'] } },
    title: { control: 'text' },
    open: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Modal>;

const withTheme = (StoryComponent: React.FC<any>) => (args: any) => (
  <ThemeProvider theme={theme}>
    <StoryComponent {...args} />
  </ThemeProvider>
);

export const Default: Story = {
  args: {
    open: true,
    title: '기본 모달',
    children: <div>내용 영역입니다.</div>,
  },
  render: withTheme(Modal),
};

export const Sizes: Story = {
  render: () => (
    <ThemeProvider theme={theme}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Modal open title="Small Modal" size="sm" onClose={() => {}}>작은 모달</Modal>
        <Modal open title="Medium Modal" size="md" onClose={() => {}}>중간 모달</Modal>
        <Modal open title="Large Modal" size="lg" onClose={() => {}}>큰 모달</Modal>
      </div>
    </ThemeProvider>
  ),
};

export const Variants: Story = {
  render: () => (
    <ThemeProvider theme={theme}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Modal open title="Default" variant="default" onClose={() => {}}>기본</Modal>
        <Modal open title="Danger" variant="danger" onClose={() => {}}>위험</Modal>
        <Modal open title="Success" variant="success" onClose={() => {}}>성공</Modal>
      </div>
    </ThemeProvider>
  ),
};

export const WithFooter: Story = {
  args: {
    open: true,
    title: '푸터 포함 모달',
    children: <div>확인 또는 취소 버튼이 있는 모달</div>,
    footer: <><Button>확인</Button> <Button variant="secondary">취소</Button></>,
  },
  render: withTheme(Modal),
};

export const HideClose: Story = {
  args: {
    open: true,
    title: '닫기 버튼 숨김',
    children: <div>닫기 버튼이 없는 모달</div>,
    hideClose: true,
  },
  render: withTheme(Modal),
}; 