import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import Container from './Container';
import Typography from './Typography';
import Card from './Card';
import Icon from './Icon';

const meta: Meta<typeof Container> = {
  title: 'Components/Container',
  component: Container,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## Container 컴포넌트

콘텐츠를 감싸는 컨테이너 컴포넌트입니다. 반응형 레이아웃과 다양한 스타일 옵션을 지원합니다.

### 주요 기능
- 반응형 maxWidth 및 padding 설정
- 다양한 variant (default, elevated, outlined, filled)
- 다양한 shadow 옵션
- 커스터마이징 가능한 background, radius

### 사용 예시
\`\`\`tsx
<Container 
  maxWidth={{ xs: '100%', md: '800px', lg: '1200px' }}
  padding={{ xs: '1rem', md: '2rem' }}
  variant="elevated"
  shadow="lg"
>
  콘텐츠
</Container>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: '컨테이너 내부 콘텐츠',
    },
    maxWidth: {
      control: 'text',
      description: '최대 너비 (문자열 또는 반응형 객체)',
    },
    padding: {
      control: 'text',
      description: '패딩 (문자열 또는 반응형 객체)',
    },
    background: {
      control: 'color',
      description: '배경색',
    },
    radius: {
      control: 'text',
      description: '테두리 반경',
    },
    shadow: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: '그림자 크기',
    },
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined', 'filled'],
      description: '컨테이너 스타일 변형',
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

// 샘플 콘텐츠
const sampleContent = (
  <div>
    <Typography variant="h2" color="primary" style={{ marginBottom: '1rem' }}>
      컨테이너 제목
    </Typography>
    <Typography variant="body" color="secondary" style={{ marginBottom: '1rem' }}>
      이것은 컨테이너 컴포넌트의 샘플 콘텐츠입니다. 다양한 스타일과 레이아웃 옵션을 지원합니다.
    </Typography>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
      <Card value="1,234" label="테스트 케이스" />
      <Card value="567" label="완료된 테스트" />
      <Card value="23" label="실패한 테스트" />
    </div>
  </div>
);

export const Default: Story = {
  args: {
    children: sampleContent,
    maxWidth: '1200px',
    padding: '1.5rem',
    shadow: 'sm',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: '기본 컨테이너 스타일입니다.',
      },
    },
  },
};

export const Elevated: Story = {
  args: {
    children: sampleContent,
    maxWidth: '1200px',
    padding: '2rem',
    shadow: 'lg',
    variant: 'elevated',
  },
  parameters: {
    docs: {
      description: {
        story: '높은 그림자 효과가 있는 컨테이너입니다.',
      },
    },
  },
};

export const Outlined: Story = {
  args: {
    children: sampleContent,
    maxWidth: '1200px',
    padding: '1.5rem',
    shadow: 'none',
    variant: 'outlined',
  },
  parameters: {
    docs: {
      description: {
        story: '테두리가 있는 컨테이너입니다.',
      },
    },
  },
};

export const Filled: Story = {
  args: {
    children: sampleContent,
    maxWidth: '1200px',
    padding: '1.5rem',
    shadow: 'sm',
    variant: 'filled',
  },
  parameters: {
    docs: {
      description: {
        story: '채워진 배경색이 있는 컨테이너입니다.',
      },
    },
  },
};

export const Responsive: Story = {
  args: {
    children: sampleContent,
    maxWidth: {
      xs: '100%',
      sm: '600px',
      md: '800px',
      lg: '1000px',
      xl: '1200px',
    },
    padding: {
      xs: '1rem',
      sm: '1.5rem',
      md: '2rem',
      lg: '2.5rem',
      xl: '3rem',
    },
    shadow: 'md',
    variant: 'elevated',
  },
  parameters: {
    docs: {
      description: {
        story: '반응형 maxWidth와 padding을 사용하는 컨테이너입니다.',
      },
    },
  },
};

export const CustomBackground: Story = {
  args: {
    children: sampleContent,
    maxWidth: '1200px',
    padding: '2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    radius: '1rem',
    shadow: 'lg',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: '커스텀 배경색과 둥근 모서리가 있는 컨테이너입니다.',
      },
    },
  },
};

export const NoShadow: Story = {
  args: {
    children: sampleContent,
    maxWidth: '1200px',
    padding: '1.5rem',
    shadow: 'none',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: '그림자가 없는 컨테이너입니다.',
      },
    },
  },
};

export const LargeShadow: Story = {
  args: {
    children: sampleContent,
    maxWidth: '1200px',
    padding: '2rem',
    shadow: 'xl',
    variant: 'elevated',
  },
  parameters: {
    docs: {
      description: {
        story: '매우 큰 그림자 효과가 있는 컨테이너입니다.',
      },
    },
  },
};

export const Compact: Story = {
  args: {
    children: (
      <div>
        <Typography variant="h3" color="primary" style={{ marginBottom: '0.5rem' }}>
          컴팩트 컨테이너
        </Typography>
        <Typography variant="body" color="secondary">
          작은 패딩과 최소한의 콘텐츠를 가진 컨테이너입니다.
        </Typography>
      </div>
    ),
    maxWidth: '600px',
    padding: '1rem',
    shadow: 'sm',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: '작은 크기의 컴팩트한 컨테이너입니다.',
      },
    },
  },
};

export const Wide: Story = {
  args: {
    children: sampleContent,
    maxWidth: '1600px',
    padding: '3rem',
    shadow: 'md',
    variant: 'elevated',
  },
  parameters: {
    docs: {
      description: {
        story: '넓은 최대 너비와 큰 패딩을 가진 컨테이너입니다.',
      },
    },
  },
}; 