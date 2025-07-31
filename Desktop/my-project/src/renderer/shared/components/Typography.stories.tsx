import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import Typography from './Typography';

const meta: Meta<typeof Typography> = {
  title: 'Components/Typography',
  component: Typography,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## Typography 컴포넌트

일관된 타이포그래피를 제공하는 컴포넌트입니다. 다양한 크기, 색상, 굵기를 지원하며 디자인 시스템의 토큰을 기반으로 합니다.

### 주요 기능
- 다양한 크기 (display1-4, h1-h6, body, caption 등)
- 색상 변형 (primary, secondary, success, warning, danger 등)
- 폰트 굵기 옵션 (thin, light, normal, medium, semibold, bold 등)
- 정렬 옵션 (left, center, right, justify)
- 텍스트 자르기 및 줄바꿈 제어

### 사용 예시
\`\`\`tsx
<Typography variant="h1" color="primary">
  제목 텍스트
</Typography>

<Typography variant="body" color="secondary" weight="medium">
  본문 텍스트
</Typography>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'display1', 'display2', 'display3', 'display4',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'body', 'body2', 'caption', 'button', 'overline'
      ],
      description: '타이포그래피 변형',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'disabled', 'inverse', 'success', 'warning', 'danger', 'inherit'],
      description: '텍스트 색상',
    },
    weight: {
      control: { type: 'select' },
      options: ['thin', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'],
      description: '폰트 굵기',
    },
    align: {
      control: { type: 'select' },
      options: ['left', 'center', 'right', 'justify'],
      description: '텍스트 정렬',
    },
    children: {
      control: 'text',
      description: '표시할 텍스트',
    },
    truncate: {
      control: 'boolean',
      description: '텍스트 자르기 활성화',
    },
    noWrap: {
      control: 'boolean',
      description: '줄바꿈 비활성화',
    },
    as: {
      control: 'select',
      options: ['div', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: '렌더링할 HTML 요소',
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

export const Display: Story = {
  args: {
    variant: 'display1',
    children: 'Display 1 텍스트',
  },
  parameters: {
    docs: {
      description: {
        story: '가장 큰 크기의 디스플레이 텍스트입니다. 페이지 제목이나 히어로 섹션에 사용됩니다.',
      },
    },
  },
};

export const Headings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="h4">Heading 4</Typography>
      <Typography variant="h5">Heading 5</Typography>
      <Typography variant="h6">Heading 6</Typography>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 헤딩 크기를 보여줍니다. 계층적 구조를 표현할 때 사용됩니다.',
      },
    },
  },
};

export const Body: Story = {
  args: {
    variant: 'body',
    children: '본문 텍스트입니다. 일반적인 콘텐츠에 사용되는 기본 크기입니다.',
  },
  parameters: {
    docs: {
      description: {
        story: '기본 본문 텍스트입니다. 일반적인 콘텐츠에 사용됩니다.',
      },
    },
  },
};

export const BodySecondary: Story = {
  args: {
    variant: 'body2',
    children: '보조 본문 텍스트입니다. 덜 중요한 정보나 설명에 사용됩니다.',
  },
  parameters: {
    docs: {
      description: {
        story: '보조 본문 텍스트입니다. 덜 중요한 정보나 설명에 사용됩니다.',
      },
    },
  },
};

export const Caption: Story = {
  args: {
    variant: 'caption',
    children: '캡션 텍스트입니다. 작은 크기로 부가 정보를 표시합니다.',
  },
  parameters: {
    docs: {
      description: {
        story: '캡션 텍스트입니다. 작은 크기로 부가 정보를 표시합니다.',
      },
    },
  },
};

export const Button: Story = {
  args: {
    variant: 'button',
    children: 'BUTTON TEXT',
  },
  parameters: {
    docs: {
      description: {
        story: '버튼 텍스트입니다. 대문자로 표시되며 버튼 컴포넌트에 사용됩니다.',
      },
    },
  },
};

export const Overline: Story = {
  args: {
    variant: 'overline',
    children: 'OVERLINE TEXT',
  },
  parameters: {
    docs: {
      description: {
        story: '오버라인 텍스트입니다. 대문자로 표시되며 카테고리나 라벨에 사용됩니다.',
      },
    },
  },
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Typography variant="body" color="primary">Primary 색상 텍스트</Typography>
      <Typography variant="body" color="secondary">Secondary 색상 텍스트</Typography>
      <Typography variant="body" color="tertiary">Tertiary 색상 텍스트</Typography>
      <Typography variant="body" color="disabled">Disabled 색상 텍스트</Typography>
      <Typography variant="body" color="success">Success 색상 텍스트</Typography>
      <Typography variant="body" color="warning">Warning 색상 텍스트</Typography>
      <Typography variant="body" color="danger">Danger 색상 텍스트</Typography>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 색상 변형을 보여줍니다. 각각 다른 의미나 중요도를 나타냅니다.',
      },
    },
  },
};

export const Weights: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Typography variant="body" weight="thin">Thin 굵기 텍스트</Typography>
      <Typography variant="body" weight="light">Light 굵기 텍스트</Typography>
      <Typography variant="body" weight="normal">Normal 굵기 텍스트</Typography>
      <Typography variant="body" weight="medium">Medium 굵기 텍스트</Typography>
      <Typography variant="body" weight="semibold">Semibold 굵기 텍스트</Typography>
      <Typography variant="body" weight="bold">Bold 굵기 텍스트</Typography>
      <Typography variant="body" weight="extrabold">Extrabold 굵기 텍스트</Typography>
      <Typography variant="body" weight="black">Black 굵기 텍스트</Typography>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 폰트 굵기를 보여줍니다. 강조나 계층을 표현할 때 사용됩니다.',
      },
    },
  },
};

export const Alignment: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Typography variant="body" align="left">왼쪽 정렬된 텍스트입니다.</Typography>
      <Typography variant="body" align="center">중앙 정렬된 텍스트입니다.</Typography>
      <Typography variant="body" align="right">오른쪽 정렬된 텍스트입니다.</Typography>
      <Typography variant="body" align="justify">
        양쪽 정렬된 텍스트입니다. 긴 텍스트에서 양쪽 끝을 맞춰 정렬합니다.
      </Typography>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 텍스트 정렬 옵션을 보여줍니다.',
      },
    },
  },
};

export const Truncate: Story = {
  args: {
    variant: 'body',
    truncate: true,
    children: '이 텍스트는 매우 길어서 컨테이너를 넘어갈 수 있습니다. 하지만 truncate 속성이 활성화되어 있으면 말줄임표로 표시됩니다.',
  },
  parameters: {
    docs: {
      description: {
        story: 'truncate 속성이 활성화된 텍스트입니다. 컨테이너를 넘어가면 말줄임표로 표시됩니다.',
      },
    },
  },
};

export const NoWrap: Story = {
  args: {
    variant: 'body',
    noWrap: true,
    children: '이 텍스트는 줄바꿈이 비활성화되어 있어서 한 줄로 표시됩니다.',
  },
  parameters: {
    docs: {
      description: {
        story: 'noWrap 속성이 활성화된 텍스트입니다. 줄바꿈이 비활성화되어 한 줄로 표시됩니다.',
      },
    },
  },
};

export const AsElement: Story = {
  args: {
    variant: 'h1',
    as: 'h1',
    children: 'H1 요소로 렌더링된 텍스트',
  },
  parameters: {
    docs: {
      description: {
        story: 'as 속성을 사용하여 다른 HTML 요소로 렌더링할 수 있습니다. 이 예시는 h1 스타일을 h1 요소로 렌더링합니다.',
      },
    },
  },
};

export const LongText: Story = {
  args: {
    variant: 'body',
    children: '이것은 매우 긴 텍스트입니다. 여러 줄에 걸쳐 표시되며, 일반적인 본문 콘텐츠의 예시입니다. 사용자가 읽기 쉬운 형태로 표시되며, 적절한 줄 간격과 폰트 크기를 사용합니다.',
  },
  parameters: {
    docs: {
      description: {
        story: '긴 텍스트의 예시입니다. 여러 줄에 걸쳐 표시되며 가독성을 고려한 스타일이 적용됩니다.',
      },
    },
  },
}; 