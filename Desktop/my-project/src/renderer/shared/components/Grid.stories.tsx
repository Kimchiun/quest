import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import Grid from './Grid';
import Card from './Card';
import Icon from './Icon';

const meta: Meta<typeof Grid> = {
  title: 'Components/Grid',
  component: Grid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## Grid 컴포넌트

반응형 그리드 레이아웃을 제공하는 컴포넌트입니다. CSS Grid를 기반으로 하며 다양한 브레이크포인트에서 다른 컬럼 수를 지원합니다.

### 주요 기능
- 반응형 컬럼 설정
- 다양한 간격 옵션
- 정렬 옵션 (align-items, justify-items)
- 자동 크기 조정 (auto-fit, auto-fill)
- 메이슨리 레이아웃 지원

### 사용 예시
\`\`\`tsx
<Grid 
  columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
  gap={{ xs: '16px', md: '24px' }}
  alignItems="center"
>
  <Card value="1,234" label="테스트 케이스" />
  <Card value="567" label="완료된 테스트" />
  <Card value="23" label="실패한 테스트" />
</Grid>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    children: {
      control: false,
      description: '그리드 내부에 배치할 자식 요소들',
    },
    columns: {
      control: 'object',
      description: '그리드 컬럼 수 (숫자 또는 반응형 객체)',
    },
    gap: {
      control: 'object',
      description: '그리드 간격 (문자열 또는 반응형 객체)',
    },
    rowGap: {
      control: 'text',
      description: '행 간격',
    },
    columnGap: {
      control: 'text',
      description: '열 간격',
    },
    alignItems: {
      control: { type: 'select' },
      options: ['start', 'center', 'end', 'stretch'],
      description: '그리드 아이템 세로 정렬',
    },
    justifyItems: {
      control: { type: 'select' },
      options: ['start', 'center', 'end', 'stretch'],
      description: '그리드 아이템 가로 정렬',
    },
    style: {
      control: false,
      description: '추가 스타일',
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

// 샘플 카드 데이터
const sampleCards = [
  { value: '1,234', label: '총 테스트 케이스', color: '#3b82f6' },
  { value: '567', label: '완료된 테스트', color: '#10b981' },
  { value: '23', label: '실패한 테스트', color: '#f59e0b' },
  { value: '5', label: '블로킹 이슈', color: '#ef4444' },
  { value: '98.5%', label: '전체 통과율', color: '#8b5cf6' },
  { value: '89%', label: '코드 커버리지', color: '#06b6d4' },
];

const renderCards = (count: number = 6) => 
  sampleCards.slice(0, count).map((card, index) => (
    <Card
      key={index}
      value={card.value}
      label={card.label}
      color={card.color}
    />
  ));

export const Default: Story = {
  args: {
    columns: 2,
    children: renderCards(4),
  },
  parameters: {
    docs: {
      description: {
        story: '기본 2열 그리드입니다. 간단한 레이아웃에 적합합니다.',
      },
    },
  },
};

export const Responsive: Story = {
  args: {
    columns: { xs: 1, sm: 2, md: 3, lg: 4 },
    gap: { xs: '16px', sm: '20px', md: '24px' },
    children: renderCards(6),
  },
  parameters: {
    docs: {
      description: {
        story: '반응형 그리드입니다. 화면 크기에 따라 컬럼 수가 자동으로 조정됩니다.',
      },
    },
  },
};

export const ThreeColumns: Story = {
  args: {
    columns: 3,
    gap: '20px',
    children: renderCards(6),
  },
  parameters: {
    docs: {
      description: {
        story: '3열 그리드입니다. 더 많은 컨텐츠를 효율적으로 배치할 수 있습니다.',
      },
    },
  },
};

export const FourColumns: Story = {
  args: {
    columns: 4,
    gap: '16px',
    children: renderCards(8),
  },
  parameters: {
    docs: {
      description: {
        story: '4열 그리드입니다. 대시보드나 갤러리 레이아웃에 적합합니다.',
      },
    },
  },
};

export const Centered: Story = {
  args: {
    columns: 3,
    gap: '20px',
    alignItems: 'center',
    justifyItems: 'center',
    children: renderCards(6),
  },
  parameters: {
    docs: {
      description: {
        story: '중앙 정렬된 그리드입니다. 모든 아이템이 중앙에 배치됩니다.',
      },
    },
  },
};

export const AutoFit: Story = {
  render: () => (
    <Grid 
      columns={4}
      gap="20px"
      className="auto-fit"
    >
      {renderCards(8)}
    </Grid>
  ),
  parameters: {
    docs: {
      description: {
        story: 'auto-fit 그리드입니다. 컨테이너 크기에 따라 자동으로 컬럼 수가 조정됩니다.',
      },
    },
  },
};

export const AutoFill: Story = {
  render: () => (
    <Grid 
      columns={4}
      gap="20px"
      className="auto-fill"
    >
      {renderCards(8)}
    </Grid>
  ),
  parameters: {
    docs: {
      description: {
        story: 'auto-fill 그리드입니다. 고정된 크기의 컬럼으로 공간을 채웁니다.',
      },
    },
  },
};

export const Masonry: Story = {
  render: () => (
    <Grid 
      columns={4}
      gap="20px"
      className="masonry"
    >
      {renderCards(8)}
    </Grid>
  ),
  parameters: {
    docs: {
      description: {
        story: '메이슨리 레이아웃입니다. 다양한 높이의 아이템을 효율적으로 배치합니다.',
      },
    },
  },
};

export const CustomGap: Story = {
  args: {
    columns: 3,
    rowGap: '32px',
    columnGap: '16px',
    children: renderCards(6),
  },
  parameters: {
    docs: {
      description: {
        story: '행과 열 간격을 다르게 설정한 그리드입니다.',
      },
    },
  },
};

export const SingleColumn: Story = {
  args: {
    columns: 1,
    gap: '16px',
    children: renderCards(4),
  },
  parameters: {
    docs: {
      description: {
        story: '1열 그리드입니다. 모바일 레이아웃이나 리스트 형태에 적합합니다.',
      },
    },
  },
};

export const LargeGap: Story = {
  args: {
    columns: 2,
    gap: '40px',
    children: renderCards(4),
  },
  parameters: {
    docs: {
      description: {
        story: '큰 간격을 가진 그리드입니다. 여유로운 레이아웃을 만듭니다.',
      },
    },
  },
};

export const StretchAlignment: Story = {
  args: {
    columns: 3,
    gap: '20px',
    alignItems: 'stretch',
    justifyItems: 'stretch',
    children: renderCards(6),
  },
  parameters: {
    docs: {
      description: {
        story: 'stretch 정렬을 사용한 그리드입니다. 모든 아이템이 동일한 크기를 가집니다.',
      },
    },
  },
};

export const ComplexResponsive: Story = {
  args: {
    columns: { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
    gap: { xs: '12px', sm: '16px', md: '20px', lg: '24px', xl: '32px' },
    children: renderCards(10),
  },
  parameters: {
    docs: {
      description: {
        story: '복잡한 반응형 그리드입니다. 모든 브레이크포인트에서 다른 설정을 사용합니다.',
      },
    },
  },
}; 