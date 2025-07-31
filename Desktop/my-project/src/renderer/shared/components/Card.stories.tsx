import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import Card from './Card';
import { Icon } from './Icon';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Card 컴포넌트

정보를 카드 형태로 표시하는 컴포넌트입니다. 다양한 크기와 스타일을 지원하며, 아이콘, 값, 라벨, 설명을 포함할 수 있습니다.

### 주요 기능
- 다양한 크기 (sm, md, lg)
- 다양한 스타일 (default, elevated, outlined)
- 아이콘 지원
- 색상 커스터마이징
- 접근성 지원

### 사용 예시
\`\`\`tsx
<Card 
  icon={<Icon name="chart" />}
  value="1,234"
  label="총 테스트 케이스"
  description="이번 달 기준"
  color="#3b82f6"
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    icon: {
      control: false,
      description: '카드 상단에 표시할 아이콘',
    },
    value: {
      control: 'text',
      description: '카드에 표시할 주요 값',
    },
    label: {
      control: 'text',
      description: '값에 대한 설명 라벨',
    },
    color: {
      control: 'color',
      description: '카드의 테마 색상',
    },
    description: {
      control: 'text',
      description: '추가 설명 텍스트',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: '카드 크기',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'outlined'],
      description: '카드 스타일 변형',
    },
    style: {
      control: false,
      description: '추가 스타일',
    },
    ariaLabel: {
      control: 'text',
      description: '접근성을 위한 aria-label',
    },
    children: {
      control: false,
      description: '카드 하단에 추가할 컨텐츠',
    },
    className: {
      control: 'text',
      description: 'CSS 클래스명',
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 샘플 데이터
const sampleIcon = <Icon name="chart" size={24} />;
const successIcon = <Icon name="check-circle" size={24} />;
const warningIcon = <Icon name="alert-triangle" size={24} />;
const dangerIcon = <Icon name="x-circle" size={24} />;

export const Default: Story = {
  args: {
    icon: sampleIcon,
    value: '1,234',
    label: '총 테스트 케이스',
    description: '이번 달 기준',
    color: '#3b82f6',
  },
  docs: {
    description: {
      story: '기본 카드 컴포넌트입니다. 아이콘, 값, 라벨, 설명을 포함합니다.',
    },
  },
};

export const Small: Story = {
  args: {
    icon: sampleIcon,
    value: '567',
    label: '완료된 테스트',
    size: 'sm',
    color: '#10b981',
  },
  docs: {
    description: {
      story: '작은 크기의 카드입니다. 컴팩트한 레이아웃에 적합합니다.',
    },
  },
};

export const Large: Story = {
  args: {
    icon: sampleIcon,
    value: '2,891',
    label: '전체 테스트 케이스',
    description: '모든 프로젝트 합계',
    size: 'lg',
    color: '#8b5cf6',
  },
  docs: {
    description: {
      story: '큰 크기의 카드입니다. 더 많은 정보를 표시할 수 있습니다.',
    },
  },
};

export const Elevated: Story = {
  args: {
    icon: successIcon,
    value: '98.5%',
    label: '테스트 통과율',
    description: '지난 주 대비 +2.3%',
    variant: 'elevated',
    color: '#10b981',
  },
  docs: {
    description: {
      story: 'elevated 스타일의 카드입니다. 더 강한 그림자 효과를 가집니다.',
    },
  },
};

export const Outlined: Story = {
  args: {
    icon: warningIcon,
    value: '23',
    label: '실패한 테스트',
    description: '재검토 필요',
    variant: 'outlined',
    color: '#f59e0b',
  },
  docs: {
    description: {
      story: 'outlined 스타일의 카드입니다. 테두리만 있는 미니멀한 디자인입니다.',
    },
  },
};

export const Success: Story = {
  args: {
    icon: successIcon,
    value: '100%',
    label: '테스트 완료',
    description: '모든 테스트 케이스 통과',
    color: '#10b981',
  },
  docs: {
    description: {
      story: '성공 상태를 나타내는 카드입니다. 초록색 테마를 사용합니다.',
    },
  },
};

export const Warning: Story = {
  args: {
    icon: warningIcon,
    value: '5',
    label: '경고 알림',
    description: '주의가 필요한 항목',
    color: '#f59e0b',
  },
  docs: {
    description: {
      story: '경고 상태를 나타내는 카드입니다. 주황색 테마를 사용합니다.',
    },
  },
};

export const Danger: Story = {
  args: {
    icon: dangerIcon,
    value: '12',
    label: '실패한 테스트',
    description: '즉시 조치 필요',
    color: '#ef4444',
  },
  docs: {
    description: {
      story: '위험 상태를 나타내는 카드입니다. 빨간색 테마를 사용합니다.',
    },
  },
};

export const WithoutIcon: Story = {
  args: {
    value: '3,456',
    label: '총 버그 리포트',
    description: '이번 주 신규 등록',
    color: '#6366f1',
  },
  docs: {
    description: {
      story: '아이콘 없이 사용하는 카드입니다. 더 심플한 디자인입니다.',
    },
  },
};

export const WithChildren: Story = {
  args: {
    icon: sampleIcon,
    value: '89%',
    label: '코드 커버리지',
    description: '목표 대비 -3%',
    color: '#06b6d4',
    children: (
      <div style={{ 
        padding: '12px', 
        backgroundColor: '#f1f5f9', 
        borderRadius: '6px',
        fontSize: '14px',
        color: '#64748b'
      }}>
        상세 정보: Unit Test 78%, Integration Test 11%
      </div>
    ),
  },
  docs: {
    description: {
      story: '추가 컨텐츠가 포함된 카드입니다. children prop을 통해 하단에 추가 정보를 표시할 수 있습니다.',
    },
  },
};

export const GridLayout: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      width: '100%',
      maxWidth: '800px'
    }}>
      <Card
        icon={successIcon}
        value="1,234"
        label="통과한 테스트"
        color="#10b981"
      />
      <Card
        icon={warningIcon}
        value="23"
        label="실패한 테스트"
        color="#f59e0b"
      />
      <Card
        icon={dangerIcon}
        value="5"
        label="블로킹 이슈"
        color="#ef4444"
      />
      <Card
        icon={sampleIcon}
        value="98.5%"
        label="전체 통과율"
        color="#3b82f6"
      />
    </div>
  ),
  docs: {
    description: {
      story: '그리드 레이아웃에서 사용되는 카드들의 예시입니다. 반응형 그리드와 함께 사용하면 효과적입니다.',
    },
  },
}; 