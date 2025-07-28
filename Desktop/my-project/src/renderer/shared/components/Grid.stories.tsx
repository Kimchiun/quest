import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Grid from './Grid';
import Button from './Button';
import Typography from './Typography';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';

const meta: Meta<typeof Grid> = {
  title: 'Components/Grid',
  component: Grid,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    $columns: {
      control: { type: 'number', min: 1, max: 12 },
      description: 'Number of columns in the grid',
    },
    $gap: {
      control: { type: 'text' },
      description: 'Gap between grid items',
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
    $columns: 3,
    $gap: '16px',
    children: [
      <div key="1" style={{ padding: '16px', background: '#e5e7eb', borderRadius: '4px' }}>Item 1</div>,
      <div key="2" style={{ padding: '16px', background: '#e5e7eb', borderRadius: '4px' }}>Item 2</div>,
      <div key="3" style={{ padding: '16px', background: '#e5e7eb', borderRadius: '4px' }}>Item 3</div>,
      <div key="4" style={{ padding: '16px', background: '#e5e7eb', borderRadius: '4px' }}>Item 4</div>,
      <div key="5" style={{ padding: '16px', background: '#e5e7eb', borderRadius: '4px' }}>Item 5</div>,
      <div key="6" style={{ padding: '16px', background: '#e5e7eb', borderRadius: '4px' }}>Item 6</div>,
    ],
  },
  render: withTheme(Grid),
};

export const TwoColumns: Story = {
  args: {
    $columns: 2,
    $gap: '24px',
    children: [
      <div key="1" style={{ padding: '16px', background: '#e5e7eb', borderRadius: '4px' }}>Item 1</div>,
      <div key="2" style={{ padding: '16px', background: '#e5e7eb', borderRadius: '4px' }}>Item 2</div>,
    ],
  },
  render: withTheme(Grid),
};

export const FourColumns: Story = {
  args: {
    $columns: 4,
    $gap: '12px',
    children: (
      <>
        <div style={{ background: '#e5e7eb', padding: '16px', borderRadius: '8px' }}>Item 1</div>
        <div style={{ background: '#e5e7eb', padding: '16px', borderRadius: '8px' }}>Item 2</div>
        <div style={{ background: '#e5e7eb', padding: '16px', borderRadius: '8px' }}>Item 3</div>
        <div style={{ background: '#e5e7eb', padding: '16px', borderRadius: '8px' }}>Item 4</div>
      </>
    ),
  },
  render: withTheme(Grid),
}; 