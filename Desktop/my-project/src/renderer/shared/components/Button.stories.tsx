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
  parameters: {
    docs: {
      description: {
        component: `
## Button 컴포넌트

미니멀하고 모던한 디자인의 버튼 컴포넌트입니다.

### 주요 특징
- **디자인 토큰 기반**: 모든 색상, 간격, 폰트가 theme에서 관리됩니다
- **접근성**: 포커스 스타일, aria 속성 등 a11y를 고려했습니다
- **상태별 스타일**: 기본, 호버, 포커스, 비활성, 에러 등 모든 상태를 지원합니다
- **반응형**: 다양한 크기와 너비 옵션을 제공합니다
- **로딩 상태**: 로딩 스피너와 함께 사용할 수 있습니다
- **아이콘 지원**: 좌측/우측 아이콘을 지원합니다

### 사용법
\`\`\`tsx
import Button from '@/shared/components/Button';

// 기본 사용
<Button>Click me</Button>

// variant와 size 지정
<Button variant="primary" size="lg">Large Primary</Button>

// 로딩 상태
<Button loading>Loading...</Button>

// 아이콘과 함께
<Button icon={<Icon />} iconPosition="left">With Icon</Button>

// 비활성화
<Button disabled>Disabled</Button>

// 전체 너비
<Button fullWidth>Full Width</Button>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'success', 'warning', 'ghost'],
      description: '버튼의 스타일 변형',
      table: {
        type: { summary: 'ButtonVariant' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '버튼의 크기',
      table: {
        type: { summary: 'ButtonSize' },
        defaultValue: { summary: 'md' },
      },
    },
    disabled: { 
      control: 'boolean',
      description: '버튼 비활성화 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      control: 'boolean',
      description: '로딩 상태 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: '전체 너비 사용 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    children: { 
      control: 'text',
      description: '버튼 내부 텍스트',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
  decorators: [Story => <ThemeProvider theme={theme}><Story /></ThemeProvider>],
};
export default meta;
type Story = StoryObj<typeof Button>;

// 기본 스토리들
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '기본 primary 버튼입니다. 가장 일반적으로 사용되는 스타일입니다.',
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'secondary 버튼입니다. 덜 강조되는 액션에 사용됩니다.',
      },
    },
  },
};

export const Danger: Story = {
  args: {
    children: 'Danger Button',
    variant: 'danger',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'danger 버튼입니다. 삭제나 위험한 액션에 사용됩니다.',
      },
    },
  },
};

export const Success: Story = {
  args: {
    children: 'Success Button',
    variant: 'success',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'success 버튼입니다. 확인이나 성공적인 액션에 사용됩니다.',
      },
    },
  },
};

export const Warning: Story = {
  args: {
    children: 'Warning Button',
    variant: 'warning',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'warning 버튼입니다. 주의가 필요한 액션에 사용됩니다.',
      },
    },
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'ghost 버튼입니다. 배경이 없는 투명한 스타일입니다.',
      },
    },
  },
};

// 상태별 스토리들
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    size: 'md',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: '비활성화된 버튼입니다. 클릭할 수 없으며 시각적으로 구분됩니다.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading...',
    variant: 'primary',
    size: 'md',
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: '로딩 상태의 버튼입니다. 스피너가 표시되고 클릭할 수 없습니다.',
      },
    },
  },
};

// 크기별 스토리들
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
  args: {
    children: 'Button',
    variant: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: '세 가지 크기 옵션을 비교할 수 있습니다: sm, md, lg',
      },
    },
  },
};

// 변형별 스토리들
export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="danger">Danger</Button>
      <Button {...args} variant="success">Success</Button>
      <Button {...args} variant="warning">Warning</Button>
      <Button {...args} variant="ghost">Ghost</Button>
    </div>
  ),
  args: {
    children: 'Button',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '모든 variant 옵션을 비교할 수 있습니다.',
      },
    },
  },
};

// 전체 너비 스토리
export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    variant: 'primary',
    size: 'md',
    fullWidth: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'fullWidth prop을 사용하면 버튼이 컨테이너의 전체 너비를 차지합니다.',
      },
    },
  },
};

// 아이콘 스토리
export const WithIcons: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button {...args} icon="→" iconPosition="right">Right Icon</Button>
      <Button {...args} icon="←" iconPosition="left">Left Icon</Button>
      <Button {...args} icon="★" iconPosition="left">Star</Button>
      <Button {...args} icon="✓" iconPosition="right">Check</Button>
    </div>
  ),
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '아이콘과 함께 사용하는 버튼들입니다. iconPosition으로 위치를 지정할 수 있습니다.',
      },
    },
  },
};

// 접근성 테스트용 스토리
export const Accessibility: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <Button {...args} aria-label="접근성 테스트 버튼">Accessible Button</Button>
      <Button {...args} disabled aria-describedby="disabled-reason">Disabled with Description</Button>
      <div id="disabled-reason" style={{ fontSize: '12px', color: '#666' }}>
        이 버튼은 현재 비활성화되어 있습니다.
      </div>
    </div>
  ),
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '접근성을 위한 aria 속성들이 적용된 버튼들입니다.',
      },
    },
  },
};

// 모든 상태 조합 스토리
export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="primary" disabled>Primary Disabled</Button>
      <Button {...args} variant="primary" loading>Primary Loading</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="secondary" disabled>Secondary Disabled</Button>
      <Button {...args} variant="danger">Danger</Button>
      <Button {...args} variant="danger" disabled>Danger Disabled</Button>
      <Button {...args} variant="success">Success</Button>
      <Button {...args} variant="success" disabled>Success Disabled</Button>
      <Button {...args} variant="warning">Warning</Button>
      <Button {...args} variant="warning" disabled>Warning Disabled</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="ghost" disabled>Ghost Disabled</Button>
    </div>
  ),
  args: {
    children: 'Button',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '모든 variant와 disabled/loading 상태의 조합을 확인할 수 있습니다.',
      },
    },
  },
}; 