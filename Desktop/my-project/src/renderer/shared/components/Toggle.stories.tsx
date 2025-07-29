import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import Toggle from './Toggle';
import type { ToggleSize } from './Toggle';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Toggle> = {
  title: 'Shared/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Toggle 컴포넌트

미니멀하고 모던한 디자인의 토글 스위치 컴포넌트입니다.

### 주요 특징
- **디자인 토큰 기반**: 모든 색상, 간격, 폰트가 theme에서 관리됩니다
- **접근성**: 포커스 스타일, aria 속성 등 a11y를 고려했습니다
- **부드러운 애니메이션**: 체크/언체크 시 부드러운 전환 애니메이션
- **다양한 크기**: sm, md, lg 세 가지 크기 옵션
- **라벨과 설명**: 선택적 라벨과 설명 텍스트 지원

### 사용법
\`\`\`tsx
import Toggle from '@/shared/components/Toggle';

// 기본 사용
<Toggle label="알림 받기" />

// 크기와 상태 지정
<Toggle 
  size="lg" 
  label="자동 저장" 
  description="변경사항을 자동으로 저장합니다"
  defaultChecked 
/>

// 비활성화
<Toggle 
  label="비활성화된 토글" 
  disabled 
/>

// 제어 컴포넌트
const [isChecked, setIsChecked] = useState(false);
<Toggle 
  checked={isChecked}
  onChange={(e) => setIsChecked(e.target.checked)}
  label="제어된 토글"
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '토글의 크기',
      table: {
        type: { summary: 'ToggleSize' },
        defaultValue: { summary: 'md' },
      },
    },
    label: {
      control: 'text',
      description: '토글 라벨',
      table: {
        type: { summary: 'string' },
      },
    },
    description: {
      control: 'text',
      description: '토글 설명',
      table: {
        type: { summary: 'string' },
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
    checked: {
      control: 'boolean',
      description: '체크 상태',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  decorators: [Story => <ThemeProvider theme={theme}><Story /></ThemeProvider>],
};
export default meta;
type Story = StoryObj<typeof Toggle>;

// 기본 스토리들
export const Default: Story = {
  args: {
    label: '기본 토글',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '기본 토글입니다. 라벨과 함께 사용되는 가장 일반적인 형태입니다.',
      },
    },
  },
};

export const WithDescription: Story = {
  args: {
    label: '자동 저장',
    description: '변경사항을 자동으로 저장합니다',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '설명이 포함된 토글입니다. 사용자에게 추가 정보를 제공합니다.',
      },
    },
  },
};

export const Checked: Story = {
  args: {
    label: '체크된 토글',
    checked: true,
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '기본적으로 체크된 토글입니다.',
      },
    },
  },
};

// 크기별 스토리들
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Toggle {...args} size="sm" label="Small Toggle" />
      <Toggle {...args} size="md" label="Medium Toggle" />
      <Toggle {...args} size="lg" label="Large Toggle" />
    </div>
  ),
  args: {
    label: '크기별 토글',
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
export const Disabled: Story = {
  args: {
    label: '비활성화된 토글',
    disabled: true,
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '비활성화된 토글입니다. 클릭할 수 없으며 시각적으로 구분됩니다.',
      },
    },
  },
};

export const DisabledChecked: Story = {
  args: {
    label: '비활성화된 체크 토글',
    disabled: true,
    checked: true,
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '비활성화된 상태에서 체크된 토글입니다.',
      },
    },
  },
};

// 라벨 없는 토글
export const NoLabel: Story = {
  args: {
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '라벨이 없는 토글입니다. 아이콘과 함께 사용하거나 단독으로 사용할 수 있습니다.',
      },
    },
  },
};

// 접근성 테스트용 스토리
export const Accessibility: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Toggle {...args} label="접근성 테스트 토글" />
      <Toggle {...args} label="설명이 있는 토글" description="이 토글은 접근성을 위한 설명을 포함합니다" />
      <Toggle {...args} disabled label="비활성화된 토글" description="이 토글은 현재 비활성화되어 있습니다" />
    </div>
  ),
  args: {
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '접근성을 위한 aria 속성들이 적용된 토글들입니다.',
      },
    },
  },
};

// 모든 상태 조합 스토리
export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Toggle {...args} label="기본 상태" />
      <Toggle {...args} label="체크된 상태" checked />
      <Toggle {...args} label="비활성화 상태" disabled />
      <Toggle {...args} label="비활성화 체크 상태" disabled checked />
      <Toggle {...args} label="설명 포함" description="추가 설명이 있는 토글입니다" />
      <Toggle {...args} label="체크된 설명 포함" description="체크된 상태의 설명 토글입니다" checked />
    </div>
  ),
  args: {
    size: 'md',
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
export const SettingsExample: Story = {
  render: (args) => {
    const [settings, setSettings] = useState({
      notifications: true,
      autoSave: false,
      darkMode: true,
      accessibility: false,
    });

    const handleSettingChange = (key: keyof typeof settings) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setSettings(prev => ({ ...prev, [key]: e.target.checked }));
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#22223b' }}>설정</h3>
        <Toggle 
          {...args}
          label="알림 받기"
          description="새로운 메시지나 업데이트에 대한 알림을 받습니다"
          checked={settings.notifications}
          onChange={handleSettingChange('notifications')}
        />
        <Toggle 
          {...args}
          label="자동 저장"
          description="변경사항을 자동으로 저장합니다"
          checked={settings.autoSave}
          onChange={handleSettingChange('autoSave')}
        />
        <Toggle 
          {...args}
          label="다크 모드"
          description="어두운 테마를 사용합니다"
          checked={settings.darkMode}
          onChange={handleSettingChange('darkMode')}
        />
        <Toggle 
          {...args}
          label="접근성 모드"
          description="접근성을 위한 추가 기능을 활성화합니다"
          checked={settings.accessibility}
          onChange={handleSettingChange('accessibility')}
        />
      </div>
    );
  },
  args: {
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '실제 설정 페이지에서 사용되는 토글들의 예제입니다.',
      },
    },
  },
};

// 제어 컴포넌트 예제
export const ControlledExample: Story = {
  render: (args) => {
    const [isChecked, setIsChecked] = useState(false);
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Toggle 
          {...args}
          label="제어된 토글"
          description={`현재 상태: ${isChecked ? '켜짐' : '꺼짐'}`}
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        <div style={{ fontSize: '14px', color: '#666' }}>
          토글을 클릭하여 상태를 변경해보세요.
        </div>
      </div>
    );
  },
  args: {
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'React 상태로 제어되는 토글 예제입니다. checked와 onChange props를 사용합니다.',
      },
    },
  },
}; 