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

미니멀하고 모던한 디자인의 입력 필드 컴포넌트입니다.

### 주요 특징
- **디자인 토큰 기반**: 모든 색상, 간격, 폰트가 theme에서 관리됩니다
- **접근성**: 포커스 스타일, aria 속성 등 a11y를 고려했습니다
- **상태별 스타일**: 기본, 호버, 포커스, 비활성, 에러, 성공 등 모든 상태를 지원합니다
- **반응형**: 다양한 크기와 너비 옵션을 제공합니다

### 사용법
\`\`\`tsx
import Input from '@/shared/components/Input';

// 기본 사용
<Input placeholder="이름을 입력하세요" />

// 크기와 상태 지정
<Input inputSize="lg" placeholder="큰 입력 필드" />

// 에러 상태
<Input error placeholder="에러가 있는 입력" />

// 성공 상태
<Input success placeholder="성공한 입력" />

// 비활성화
<Input disabled placeholder="비활성화된 입력" />
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
      options: ['default', 'error', 'success'],
      description: '입력 필드의 스타일 변형',
      table: {
        type: { summary: 'InputVariant' },
        defaultValue: { summary: 'default' },
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
    disabled: {
      control: 'boolean',
      description: '비활성화 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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
    placeholder: '기본 입력 필드',
    inputSize: 'md',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: '기본 입력 필드입니다. 가장 일반적으로 사용되는 스타일입니다.',
      },
    },
  },
};

export const WithValue: Story = {
  args: {
    placeholder: '값이 있는 입력 필드',
    defaultValue: '사용자 입력 값',
    inputSize: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '기본값이 설정된 입력 필드입니다.',
      },
    },
  },
};

// 크기별 스토리들
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <Input {...args} inputSize="sm" placeholder="Small size" />
      <Input {...args} inputSize="md" placeholder="Medium size" />
      <Input {...args} inputSize="lg" placeholder="Large size" />
    </div>
  ),
  args: {
    placeholder: '크기별 입력 필드',
  },
  parameters: {
    docs: {
      description: {
        story: '세 가지 크기 옵션을 비교할 수 있습니다: sm, md, lg',
      },
    },
  },
};

// 상태별 스토리들
export const Error: Story = {
  args: {
    placeholder: '에러가 있는 입력 필드',
    error: true,
    inputSize: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '에러 상태의 입력 필드입니다. 빨간색 테두리와 포커스 스타일이 적용됩니다.',
      },
    },
  },
};

export const Success: Story = {
  args: {
    placeholder: '성공한 입력 필드',
    success: true,
    inputSize: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '성공 상태의 입력 필드입니다. 초록색 테두리와 포커스 스타일이 적용됩니다.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    placeholder: '비활성화된 입력 필드',
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

export const Loading: Story = {
  args: {
    placeholder: '로딩 중...',
    disabled: true,
    inputSize: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '로딩 상태의 입력 필드입니다. disabled 상태로 표시됩니다.',
      },
    },
  },
};

// 전체 너비 스토리
export const FullWidth: Story = {
  args: {
    placeholder: '전체 너비 입력 필드',
    fullWidth: true,
    inputSize: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'fullWidth prop을 사용하면 입력 필드가 컨테이너의 전체 너비를 차지합니다.',
      },
    },
  },
};

// 접근성 테스트용 스토리
export const Accessibility: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <Input {...args} aria-label="접근성 테스트 입력" placeholder="접근성 테스트" />
      <Input {...args} error aria-describedby="error-message" placeholder="에러 메시지가 있는 입력" />
      <div id="error-message" style={{ fontSize: '12px', color: '#dc2626' }}>
        이 필드는 필수 입력 항목입니다.
      </div>
      <Input {...args} disabled aria-describedby="disabled-reason" placeholder="비활성화 설명이 있는 입력" />
      <div id="disabled-reason" style={{ fontSize: '12px', color: '#666' }}>
        이 입력 필드는 현재 비활성화되어 있습니다.
      </div>
    </div>
  ),
  args: {
    placeholder: '접근성 테스트',
    inputSize: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '접근성을 위한 aria 속성들이 적용된 입력 필드들입니다.',
      },
    },
  },
};

// 모든 상태 조합 스토리
export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <Input {...args} placeholder="기본 상태" />
      <Input {...args} error placeholder="에러 상태" />
      <Input {...args} success placeholder="성공 상태" />
      <Input {...args} disabled placeholder="비활성화 상태" />
      <Input {...args} error disabled placeholder="에러 + 비활성화" />
      <Input {...args} success disabled placeholder="성공 + 비활성화" />
    </div>
  ),
  args: {
    inputSize: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '모든 상태 조합을 확인할 수 있습니다.',
      },
    },
  },
};

// 실제 사용 예제 스토리
export const FormExample: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column', maxWidth: '400px' }}>
      <Input {...args} placeholder="이름" />
      <Input {...args} placeholder="이메일" type="email" />
      <Input {...args} placeholder="비밀번호" type="password" />
      <Input {...args} error placeholder="중복된 이메일" type="email" />
      <Input {...args} success placeholder="사용 가능한 사용자명" />
    </div>
  ),
  args: {
    inputSize: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '실제 폼에서 사용되는 입력 필드들의 예제입니다.',
      },
    },
  },
}; 