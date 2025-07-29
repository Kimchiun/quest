import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import Checkbox from './Checkbox';
import type { CheckboxSize } from './Checkbox';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Checkbox> = {
  title: 'Shared/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Checkbox 컴포넌트

미니멀하고 모던한 디자인의 체크박스 컴포넌트입니다.

### 주요 특징
- **디자인 토큰 기반**: 모든 색상, 간격, 폰트가 theme에서 관리됩니다
- **접근성**: 포커스 스타일, aria 속성 등 a11y를 고려했습니다
- **부드러운 애니메이션**: 체크/언체크 시 부드러운 전환 애니메이션
- **다양한 크기**: sm, md, lg 세 가지 크기 옵션
- **라벨과 설명**: 선택적 라벨과 설명 텍스트 지원
- **Indeterminate 상태**: 부분 선택 상태 지원

### 사용법
\`\`\`tsx
import Checkbox from '@/shared/components/Checkbox';

// 기본 사용
<Checkbox label="약관에 동의합니다" />

// 크기와 상태 지정
<Checkbox 
  size="lg" 
  label="뉴스레터 구독" 
  description="주간 뉴스레터를 받습니다"
  defaultChecked 
/>

// 비활성화
<Checkbox 
  label="비활성화된 체크박스" 
  disabled 
/>

// Indeterminate 상태
<Checkbox 
  label="부분 선택" 
  indeterminate 
/>

// 제어 컴포넌트
const [isChecked, setIsChecked] = useState(false);
<Checkbox 
  checked={isChecked}
  onChange={(e) => setIsChecked(e.target.checked)}
  label="제어된 체크박스"
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
      description: '체크박스의 크기',
      table: {
        type: { summary: 'CheckboxSize' },
        defaultValue: { summary: 'md' },
      },
    },
    label: {
      control: 'text',
      description: '체크박스 라벨',
      table: {
        type: { summary: 'string' },
      },
    },
    description: {
      control: 'text',
      description: '체크박스 설명',
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
    indeterminate: {
      control: 'boolean',
      description: '부분 선택 상태',
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
type Story = StoryObj<typeof Checkbox>;

// 기본 스토리들
export const Default: Story = {
  args: {
    label: '기본 체크박스',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '기본 체크박스입니다. 라벨과 함께 사용되는 가장 일반적인 형태입니다.',
      },
    },
  },
};

export const WithDescription: Story = {
  args: {
    label: '뉴스레터 구독',
    description: '주간 뉴스레터를 받아 최신 소식을 확인하세요',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '설명이 포함된 체크박스입니다. 사용자에게 추가 정보를 제공합니다.',
      },
    },
  },
};

export const Checked: Story = {
  args: {
    label: '체크된 체크박스',
    checked: true,
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '기본적으로 체크된 체크박스입니다.',
      },
    },
  },
};

// 크기별 스토리들
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Checkbox {...args} size="sm" label="Small Checkbox" />
      <Checkbox {...args} size="md" label="Medium Checkbox" />
      <Checkbox {...args} size="lg" label="Large Checkbox" />
    </div>
  ),
  args: {
    label: '크기별 체크박스',
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
    label: '비활성화된 체크박스',
    disabled: true,
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '비활성화된 체크박스입니다. 클릭할 수 없으며 시각적으로 구분됩니다.',
      },
    },
  },
};

export const DisabledChecked: Story = {
  args: {
    label: '비활성화된 체크 체크박스',
    disabled: true,
    checked: true,
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '비활성화된 상태에서 체크된 체크박스입니다.',
      },
    },
  },
};

export const Indeterminate: Story = {
  args: {
    label: '부분 선택 체크박스',
    indeterminate: true,
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'indeterminate 상태의 체크박스입니다. 부분 선택을 나타냅니다.',
      },
    },
  },
};

// 라벨 없는 체크박스
export const NoLabel: Story = {
  args: {
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '라벨이 없는 체크박스입니다. 아이콘과 함께 사용하거나 단독으로 사용할 수 있습니다.',
      },
    },
  },
};

// 접근성 테스트용 스토리
export const Accessibility: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Checkbox {...args} label="접근성 테스트 체크박스" />
      <Checkbox {...args} label="설명이 있는 체크박스" description="이 체크박스는 접근성을 위한 설명을 포함합니다" />
      <Checkbox {...args} disabled label="비활성화된 체크박스" description="이 체크박스는 현재 비활성화되어 있습니다" />
    </div>
  ),
  args: {
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '접근성을 위한 aria 속성들이 적용된 체크박스들입니다.',
      },
    },
  },
};

// 모든 상태 조합 스토리
export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Checkbox {...args} label="기본 상태" />
      <Checkbox {...args} label="체크된 상태" checked />
      <Checkbox {...args} label="부분 선택 상태" indeterminate />
      <Checkbox {...args} label="비활성화 상태" disabled />
      <Checkbox {...args} label="비활성화 체크 상태" disabled checked />
      <Checkbox {...args} label="설명 포함" description="추가 설명이 있는 체크박스입니다" />
      <Checkbox {...args} label="체크된 설명 포함" description="체크된 상태의 설명 체크박스입니다" checked />
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
export const FormExample: Story = {
  render: (args) => {
    const [agreements, setAgreements] = useState({
      terms: false,
      privacy: false,
      newsletter: false,
      marketing: false,
    });

    const handleAgreementChange = (key: keyof typeof agreements) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setAgreements(prev => ({ ...prev, [key]: e.target.checked }));
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#22223b' }}>약관 동의</h3>
        <Checkbox 
          {...args}
          label="이용약관에 동의합니다"
          description="서비스 이용을 위해 필수로 동의해야 합니다"
          checked={agreements.terms}
          onChange={handleAgreementChange('terms')}
        />
        <Checkbox 
          {...args}
          label="개인정보 처리방침에 동의합니다"
          description="개인정보 수집 및 이용에 동의합니다"
          checked={agreements.privacy}
          onChange={handleAgreementChange('privacy')}
        />
        <Checkbox 
          {...args}
          label="뉴스레터 구독"
          description="새로운 기능과 업데이트 소식을 받습니다 (선택사항)"
          checked={agreements.newsletter}
          onChange={handleAgreementChange('newsletter')}
        />
        <Checkbox 
          {...args}
          label="마케팅 정보 수신"
          description="관련 상품 및 서비스 정보를 받습니다 (선택사항)"
          checked={agreements.marketing}
          onChange={handleAgreementChange('marketing')}
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
        story: '실제 폼에서 사용되는 체크박스들의 예제입니다.',
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
        <Checkbox 
          {...args}
          label="제어된 체크박스"
          description={`현재 상태: ${isChecked ? '체크됨' : '체크 안됨'}`}
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        <div style={{ fontSize: '14px', color: '#666' }}>
          체크박스를 클릭하여 상태를 변경해보세요.
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
        story: 'React 상태로 제어되는 체크박스 예제입니다. checked와 onChange props를 사용합니다.',
      },
    },
  },
};

// 다중 선택 예제
export const MultiSelectExample: Story = {
  render: (args) => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    
    const items = [
      { id: 'item1', label: '항목 1', description: '첫 번째 항목입니다' },
      { id: 'item2', label: '항목 2', description: '두 번째 항목입니다' },
      { id: 'item3', label: '항목 3', description: '세 번째 항목입니다' },
      { id: 'item4', label: '항목 4', description: '네 번째 항목입니다' },
    ];

    const handleItemChange = (itemId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        setSelectedItems(prev => [...prev, itemId]);
      } else {
        setSelectedItems(prev => prev.filter(id => id !== itemId));
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#22223b' }}>다중 선택</h3>
        {items.map(item => (
          <Checkbox 
            key={item.id}
            {...args}
            label={item.label}
            description={item.description}
            checked={selectedItems.includes(item.id)}
            onChange={handleItemChange(item.id)}
          />
        ))}
        <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
          선택된 항목: {selectedItems.length}개
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
        story: '다중 선택이 가능한 체크박스들의 예제입니다.',
      },
    },
  },
}; 