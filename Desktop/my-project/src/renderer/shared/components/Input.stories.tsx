import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import Input from './Input';
import type { InputSize, InputVariant } from './Input';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Input> = {
  title: 'Shared/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Input 컴포넌트

미니멀하고 모던한 디자인의 입력 컴포넌트입니다.

### 주요 특징
- **디자인 토큰 기반**: 모든 색상, 간격, 폰트가 theme에서 관리됩니다
- **접근성**: 포커스 스타일, aria 속성 등 a11y를 고려했습니다
- **상태별 스타일**: 기본, 호버, 포커스, 에러, 성공, 경고 등 모든 상태를 지원합니다
- **아이콘 지원**: 좌측/우측 아이콘을 지원합니다
- **라벨 및 도움말**: 라벨과 도움말 텍스트를 지원합니다
- **반응형**: 다양한 크기 옵션을 제공합니다

### 사용법
\`\`\`tsx
import Input from '@/shared/components/Input';

// 기본 사용
<Input placeholder="Enter text..." />

// 라벨과 함께
<Input label="Email" placeholder="Enter your email" />

// 도움말 텍스트
<Input 
  label="Password" 
  type="password" 
  helperText="Must be at least 8 characters"
/>

// 에러 상태
<Input 
  label="Email" 
  error 
  helperText="Please enter a valid email"
/>

// 아이콘과 함께
<Input 
  label="Search" 
  leftIcon={<SearchIcon />}
  placeholder="Search..."
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    inputSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '입력 필드의 크기',
      table: {
        type: { summary: 'InputSize' },
        defaultValue: { summary: 'md' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
      description: '입력 필드의 상태',
      table: {
        type: { summary: 'InputVariant' },
        defaultValue: { summary: 'default' },
      },
    },
    disabled: { 
      control: 'boolean',
      description: '입력 필드 비활성화 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      control: 'boolean',
      description: '에러 상태 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    success: {
      control: 'boolean',
      description: '성공 상태 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    warning: {
      control: 'boolean',
      description: '경고 상태 여부',
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
        defaultValue: { summary: 'true' },
      },
    },
    label: { 
      control: 'text',
      description: '입력 필드 라벨',
      table: {
        type: { summary: 'string' },
      },
    },
    helperText: { 
      control: 'text',
      description: '도움말 텍스트',
      table: {
        type: { summary: 'string' },
      },
    },
    placeholder: { 
      control: 'text',
      description: '플레이스홀더 텍스트',
      table: {
        type: { summary: 'string' },
      },
    },
  },
  decorators: [Story => <ThemeProvider theme={theme}><Story /></ThemeProvider>],
};
export default meta;
type Story = StoryObj<typeof Input>;

// 기본 스토리들
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    inputSize: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '기본 입력 필드입니다. 플레이스홀더와 함께 사용할 수 있습니다.',
      },
    },
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    inputSize: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '라벨이 있는 입력 필드입니다. 접근성을 향상시킵니다.',
      },
    },
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    helperText: 'Must be at least 8 characters long',
    inputSize: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '도움말 텍스트가 있는 입력 필드입니다. 사용자에게 추가 정보를 제공합니다.',
      },
    },
  },
};

// 상태별 스토리들
export const Error: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    error: true,
    helperText: 'Please enter a valid email address',
    inputSize: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '에러 상태의 입력 필드입니다. 빨간색 테두리와 에러 메시지가 표시됩니다.',
      },
    },
  },
};

export const Success: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    success: true,
    helperText: 'Email is valid',
    inputSize: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '성공 상태의 입력 필드입니다. 초록색 테두리와 성공 메시지가 표시됩니다.',
      },
    },
  },
};

export const Warning: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    warning: true,
    helperText: 'Username should be unique',
    inputSize: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '경고 상태의 입력 필드입니다. 주황색 테두리와 경고 메시지가 표시됩니다.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    disabled: true,
    inputSize: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '비활성화된 입력 필드입니다. 클릭할 수 없으며 시각적으로 구분됩니다.',
      },
    },
  },
};

// 크기별 스토리들
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Input {...args} inputSize="sm" label="Small Input" placeholder="Small size" />
      <Input {...args} inputSize="md" label="Medium Input" placeholder="Medium size" />
      <Input {...args} inputSize="lg" label="Large Input" placeholder="Large size" />
    </div>
  ),
  args: {
    placeholder: 'Enter text...',
  },
  parameters: {
    docs: {
      description: {
        story: '세 가지 크기 옵션을 비교할 수 있습니다: sm, md, lg',
      },
    },
  },
};

// 아이콘 스토리들
export const WithIcons: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Input 
        {...args} 
        label="Search" 
        placeholder="Search..."
        leftIcon="🔍"
      />
      <Input 
        {...args} 
        label="Email" 
        placeholder="Enter your email"
        rightIcon="✉️"
      />
      <Input 
        {...args} 
        label="Password" 
        type="password"
        placeholder="Enter your password"
        leftIcon="🔒"
        rightIcon="👁️"
      />
    </div>
  ),
  args: {
    inputSize: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '아이콘이 있는 입력 필드들입니다. 좌측/우측 아이콘을 지원합니다.',
      },
    },
  },
};

// 타입별 스토리들
export const InputTypes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Input {...args} label="Text" type="text" placeholder="Text input" />
      <Input {...args} label="Email" type="email" placeholder="Email input" />
      <Input {...args} label="Password" type="password" placeholder="Password input" />
      <Input {...args} label="Number" type="number" placeholder="Number input" />
      <Input {...args} label="URL" type="url" placeholder="URL input" />
      <Input {...args} label="Tel" type="tel" placeholder="Phone number" />
    </div>
  ),
  args: {
    inputSize: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '다양한 HTML input 타입을 지원합니다.',
      },
    },
  },
};

// 접근성 테스트용 스토리
export const Accessibility: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Input 
        {...args} 
        label="Accessible Input" 
        placeholder="This input has proper ARIA attributes"
        aria-describedby="input-description"
      />
      <div id="input-description" style={{ fontSize: '12px', color: '#666' }}>
        이 입력 필드는 접근성을 위한 ARIA 속성들이 적용되어 있습니다.
      </div>
      <Input 
        {...args} 
        label="Required Input" 
        placeholder="This field is required"
        required
        aria-required="true"
      />
    </div>
  ),
  args: {
    inputSize: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '접근성을 위한 ARIA 속성들이 적용된 입력 필드들입니다.',
      },
    },
  },
};

// 모든 상태 조합 스토리
export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Input {...args} label="Default" placeholder="Default state" />
      <Input {...args} label="Error" error helperText="This field has an error" />
      <Input {...args} label="Success" success helperText="This field is valid" />
      <Input {...args} label="Warning" warning helperText="This field has a warning" />
      <Input {...args} label="Disabled" disabled placeholder="This field is disabled" />
    </div>
  ),
  args: {
    inputSize: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '모든 상태의 입력 필드를 비교할 수 있습니다.',
      },
    },
  },
}; 