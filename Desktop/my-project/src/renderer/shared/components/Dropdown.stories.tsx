import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import Dropdown from './Dropdown';
import type { DropdownSize, DropdownOption } from './Dropdown';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Dropdown> = {
  title: 'Shared/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Dropdown 컴포넌트

미니멀하고 모던한 디자인의 드롭다운 컴포넌트입니다.

### 주요 특징
- **디자인 토큰 기반**: 모든 색상, 간격, 폰트가 theme에서 관리됩니다
- **접근성**: 키보드 네비게이션, aria 속성 등 a11y를 고려했습니다
- **부드러운 애니메이션**: 열기/닫기 시 부드러운 전환 애니메이션
- **다양한 크기**: sm, md, lg 세 가지 크기 옵션
- **외부 클릭 감지**: 드롭다운 외부 클릭 시 자동 닫기
- **에러 상태**: 유효성 검사 실패 시 시각적 피드백

### 사용법
\`\`\`tsx
import Dropdown from '@/shared/components/Dropdown';

const options = [
  { value: 'option1', label: '옵션 1' },
  { value: 'option2', label: '옵션 2' },
  { value: 'option3', label: '옵션 3', disabled: true },
];

// 기본 사용
<Dropdown 
  options={options}
  placeholder="옵션을 선택하세요"
  onChange={(value) => console.log('선택된 값:', value)}
/>

// 크기와 상태 지정
<Dropdown 
  options={options}
  value="option1"
  size="lg"
  placeholder="큰 드롭다운"
  onChange={(value) => console.log(value)}
/>

// 에러 상태
<Dropdown 
  options={options}
  error
  placeholder="에러가 있는 드롭다운"
/>

// 비활성화
<Dropdown 
  options={options}
  disabled
  placeholder="비활성화된 드롭다운"
/>

// 제어 컴포넌트
const [selectedValue, setSelectedValue] = useState('');
<Dropdown 
  options={options}
  value={selectedValue}
  onChange={setSelectedValue}
  placeholder="제어된 드롭다운"
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    options: {
      control: 'object',
      description: '드롭다운 옵션 배열',
      table: {
        type: { summary: 'DropdownOption[]' },
      },
    },
    value: {
      control: 'text',
      description: '선택된 옵션의 값',
      table: {
        type: { summary: 'string' },
      },
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '선택하세요' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '드롭다운의 크기',
      table: {
        type: { summary: 'DropdownSize' },
        defaultValue: { summary: 'md' },
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
    error: {
      control: 'boolean',
      description: '에러 상태',
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
  },
  decorators: [Story => <ThemeProvider theme={theme}><Story /></ThemeProvider>],
};
export default meta;
type Story = StoryObj<typeof Dropdown>;

// 기본 옵션들
const defaultOptions: DropdownOption[] = [
  { value: 'option1', label: '옵션 1' },
  { value: 'option2', label: '옵션 2' },
  { value: 'option3', label: '옵션 3' },
  { value: 'option4', label: '옵션 4' },
  { value: 'option5', label: '옵션 5' },
];

const optionsWithDisabled: DropdownOption[] = [
  { value: 'option1', label: '옵션 1' },
  { value: 'option2', label: '옵션 2' },
  { value: 'option3', label: '비활성화된 옵션', disabled: true },
  { value: 'option4', label: '옵션 4' },
  { value: 'option5', label: '옵션 5' },
];

// 기본 스토리들
export const Default: Story = {
  args: {
    options: defaultOptions,
    placeholder: '옵션을 선택하세요',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '기본 드롭다운입니다. 클릭하면 옵션 목록이 나타납니다.',
      },
    },
  },
};

export const WithValue: Story = {
  args: {
    options: defaultOptions,
    value: 'option2',
    placeholder: '옵션을 선택하세요',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '기본값이 선택된 드롭다운입니다.',
      },
    },
  },
};

// 크기별 스토리들
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Dropdown {...args} size="sm" placeholder="Small Dropdown" />
      <Dropdown {...args} size="md" placeholder="Medium Dropdown" />
      <Dropdown {...args} size="lg" placeholder="Large Dropdown" />
    </div>
  ),
  args: {
    options: defaultOptions,
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
    options: defaultOptions,
    disabled: true,
    placeholder: '비활성화된 드롭다운',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '비활성화된 드롭다운입니다. 클릭할 수 없으며 시각적으로 구분됩니다.',
      },
    },
  },
};

export const Error: Story = {
  args: {
    options: defaultOptions,
    error: true,
    placeholder: '에러가 있는 드롭다운',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '에러 상태의 드롭다운입니다. 유효성 검사 실패 시 사용됩니다.',
      },
    },
  },
};

export const WithDisabledOptions: Story = {
  args: {
    options: optionsWithDisabled,
    placeholder: '비활성화된 옵션이 포함된 드롭다운',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '일부 옵션이 비활성화된 드롭다운입니다.',
      },
    },
  },
};

// 접근성 테스트용 스토리
export const Accessibility: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Dropdown {...args} placeholder="접근성 테스트 드롭다운" />
      <Dropdown {...args} disabled placeholder="비활성화된 드롭다운" />
      <Dropdown {...args} error placeholder="에러 상태 드롭다운" />
    </div>
  ),
  args: {
    options: defaultOptions,
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '접근성을 위한 aria 속성들이 적용된 드롭다운들입니다.',
      },
    },
  },
};

// 모든 상태 조합 스토리
export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Dropdown {...args} placeholder="기본 상태" />
      <Dropdown {...args} value="option1" placeholder="선택된 상태" />
      <Dropdown {...args} disabled placeholder="비활성화 상태" />
      <Dropdown {...args} error placeholder="에러 상태" />
      <Dropdown {...args} options={optionsWithDisabled} placeholder="비활성화 옵션 포함" />
    </div>
  ),
  args: {
    options: defaultOptions,
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
    const [formData, setFormData] = useState({
      country: '',
      city: '',
      category: '',
    });

    const countries = [
      { value: 'kr', label: '대한민국' },
      { value: 'us', label: '미국' },
      { value: 'jp', label: '일본' },
      { value: 'cn', label: '중국' },
    ];

    const cities = [
      { value: 'seoul', label: '서울' },
      { value: 'busan', label: '부산' },
      { value: 'incheon', label: '인천' },
      { value: 'daegu', label: '대구' },
    ];

    const categories = [
      { value: 'tech', label: '기술' },
      { value: 'design', label: '디자인' },
      { value: 'marketing', label: '마케팅' },
      { value: 'sales', label: '영업' },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#22223b' }}>폼 예제</h3>
        <Dropdown 
          {...args}
          options={countries}
          value={formData.country}
          placeholder="국가를 선택하세요"
          onChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
        />
        <Dropdown 
          {...args}
          options={cities}
          value={formData.city}
          placeholder="도시를 선택하세요"
          onChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
        />
        <Dropdown 
          {...args}
          options={categories}
          value={formData.category}
          placeholder="카테고리를 선택하세요"
          onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
        />
        <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
          선택된 값: {JSON.stringify(formData, null, 2)}
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
        story: '실제 폼에서 사용되는 드롭다운들의 예제입니다.',
      },
    },
  },
};

// 제어 컴포넌트 예제
export const ControlledExample: Story = {
  render: (args) => {
    const [selectedValue, setSelectedValue] = useState('');
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Dropdown 
          {...args}
          options={defaultOptions}
          value={selectedValue}
          placeholder="제어된 드롭다운"
          onChange={setSelectedValue}
        />
        <div style={{ fontSize: '14px', color: '#666' }}>
          선택된 값: {selectedValue || '없음'}
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
        story: 'React 상태로 제어되는 드롭다운 예제입니다. value와 onChange props를 사용합니다.',
      },
    },
  },
};

// 긴 옵션 목록 예제
export const LongOptionsList: Story = {
  render: (args) => {
    const longOptions: DropdownOption[] = Array.from({ length: 20 }, (_, i) => ({
      value: `option${i + 1}`,
      label: `긴 옵션 ${i + 1} - 이것은 매우 긴 옵션 텍스트입니다`,
    }));

    return (
      <Dropdown 
        {...args}
        options={longOptions}
        placeholder="긴 옵션 목록"
        onChange={(value) => console.log('선택된 값:', value)}
      />
    );
  },
  args: {
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '많은 옵션이 있는 드롭다운입니다. 스크롤이 가능합니다.',
      },
    },
  },
};

// 이벤트 콜백 예제
export const EventCallbacks: Story = {
  render: (args) => {
    const [events, setEvents] = useState<string[]>([]);

    const handleChange = (value: string) => {
      setEvents(prev => [...prev, `onChange: ${value}`]);
    };

    const handleOpen = () => {
      setEvents(prev => [...prev, 'onOpen']);
    };

    const handleClose = () => {
      setEvents(prev => [...prev, 'onClose']);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Dropdown 
          {...args}
          options={defaultOptions}
          placeholder="이벤트 콜백 테스트"
          onChange={handleChange}
          onOpen={handleOpen}
          onClose={handleClose}
        />
        <div style={{ fontSize: '14px', color: '#666' }}>
          <h4>발생한 이벤트:</h4>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            {events.map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
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
        story: 'onChange, onOpen, onClose 이벤트 콜백을 테스트할 수 있습니다.',
      },
    },
  },
}; 