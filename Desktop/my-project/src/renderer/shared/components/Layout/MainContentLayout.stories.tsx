import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../theme';
import MainContentLayout from './MainContentLayout';
import { DashboardLayout, ListLayout, DetailLayout, FormLayout } from './ViewLayouts';
import { SearchControl, FilterControl, SortControl, StatusDisplay, ActionButton } from './ControlComponents';
import ViewToggle from './ViewToggle';
import Typography from '../Typography';
import Card from '../Card';

const meta: Meta<typeof MainContentLayout> = {
  title: 'Layout/MainContentLayout',
  component: MainContentLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## MainContentLayout 컴포넌트

메인 컨텐트 영역의 공통 레이아웃 컴포넌트입니다. 3분할 레이아웃을 기반으로 하며, 다양한 뷰 타입을 지원합니다.

### 주요 기능
- 3분할 레이아웃 (좌측/중앙/우측 패널)
- 뷰 타입별 최적화 (dashboard, list, detail, form)
- 반응형 디자인 지원
- 토큰 기반 스타일링
- 접근성 표준 준수

### 사용 예시
\`\`\`tsx
<MainContentLayout
  viewType="dashboard"
  variant="default"
  leftPanel={<FilterPanel />}
  centerPanel={<DashboardContent />}
  rightPanel={<WidgetPanel />}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    viewType: {
      control: 'select',
      options: ['dashboard', 'list', 'detail', 'form'],
      description: '뷰 타입',
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'expanded'],
      description: '레이아웃 변형',
    },
    showLeftPanel: {
      control: 'boolean',
      description: '좌측 패널 표시 여부',
    },
    showRightPanel: {
      control: 'boolean',
      description: '우측 패널 표시 여부',
    },
    leftPanelWidth: {
      control: 'number',
      description: '좌측 패널 너비 (px)',
    },
    rightPanelWidth: {
      control: 'number',
      description: '우측 패널 너비 (px)',
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <div style={{ height: '100vh', width: '100vw' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 샘플 패널 컴포넌트들
const SampleLeftPanel = () => (
  <div style={{ padding: theme.spacing[4] }}>
    <Typography variant="h6" style={{ marginBottom: theme.spacing[3] }}>
      좌측 패널
    </Typography>
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[2] }}>
      <Card size="sm" variant="outlined">
        <Typography variant="body">필터 옵션 1</Typography>
      </Card>
      <Card size="sm" variant="outlined">
        <Typography variant="body">필터 옵션 2</Typography>
      </Card>
      <Card size="sm" variant="outlined">
        <Typography variant="body">필터 옵션 3</Typography>
      </Card>
    </div>
  </div>
);

const SampleCenterPanel = () => (
  <div style={{ padding: theme.spacing[4] }}>
    <Typography variant="h5" style={{ marginBottom: theme.spacing[4] }}>
      중앙 패널
    </Typography>
    <div style={{ display: 'grid', gap: theme.spacing[3], gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
      <Card>
        <Typography variant="h6">카드 1</Typography>
        <Typography variant="body">카드 내용입니다.</Typography>
      </Card>
      <Card>
        <Typography variant="h6">카드 2</Typography>
        <Typography variant="body">카드 내용입니다.</Typography>
      </Card>
      <Card>
        <Typography variant="h6">카드 3</Typography>
        <Typography variant="body">카드 내용입니다.</Typography>
      </Card>
    </div>
  </div>
);

const SampleRightPanel = () => (
  <div style={{ padding: theme.spacing[4] }}>
    <Typography variant="h6" style={{ marginBottom: theme.spacing[3] }}>
      우측 패널
    </Typography>
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[2] }}>
      <StatusDisplay status="success" text="완료된 작업" count={5} showCount />
      <StatusDisplay status="warning" text="진행 중인 작업" count={3} showCount />
      <StatusDisplay status="error" text="오류 발생" count={1} showCount />
    </div>
  </div>
);

export const Dashboard: Story = {
  args: {
    viewType: 'dashboard',
    variant: 'default',
    showLeftPanel: true,
    showRightPanel: true,
    leftPanel: <SampleLeftPanel />,
    centerPanel: <SampleCenterPanel />,
    rightPanel: <SampleRightPanel />,
  },
  parameters: {
    docs: {
      description: {
        story: '대시보드 뷰입니다. 높은 정보 밀도와 위젯 기반 레이아웃을 제공합니다.',
      },
    },
  },
};

export const List: Story = {
  args: {
    viewType: 'list',
    variant: 'default',
    showLeftPanel: true,
    showRightPanel: true,
    leftPanel: <SampleLeftPanel />,
    centerPanel: <SampleCenterPanel />,
    rightPanel: <SampleRightPanel />,
  },
  parameters: {
    docs: {
      description: {
        story: '목록 뷰입니다. 중간 정보 밀도와 테이블/카드 기반 레이아웃을 제공합니다.',
      },
    },
  },
};

export const Detail: Story = {
  args: {
    viewType: 'detail',
    variant: 'default',
    showLeftPanel: true,
    showRightPanel: true,
    leftPanel: <SampleLeftPanel />,
    centerPanel: <SampleCenterPanel />,
    rightPanel: <SampleRightPanel />,
  },
  parameters: {
    docs: {
      description: {
        story: '상세 뷰입니다. 낮은 정보 밀도와 폼/탭 기반 레이아웃을 제공합니다.',
      },
    },
  },
};

export const Form: Story = {
  args: {
    viewType: 'form',
    variant: 'default',
    showLeftPanel: false,
    showRightPanel: false,
    centerPanel: (
      <div style={{ padding: theme.spacing[6], maxWidth: '600px', margin: '0 auto' }}>
        <Typography variant="h4" style={{ marginBottom: theme.spacing[4] }}>
          폼 제목
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
          <Card variant="outlined">
            <Typography variant="body">폼 필드 1</Typography>
          </Card>
          <Card variant="outlined">
            <Typography variant="body">폼 필드 2</Typography>
          </Card>
          <Card variant="outlined">
            <Typography variant="body">폼 필드 3</Typography>
          </Card>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '폼 뷰입니다. 최소 정보 밀도와 단일 컬럼 레이아웃을 제공합니다.',
      },
    },
  },
};

export const Compact: Story = {
  args: {
    viewType: 'dashboard',
    variant: 'compact',
    showLeftPanel: true,
    showRightPanel: true,
    leftPanel: <SampleLeftPanel />,
    centerPanel: <SampleCenterPanel />,
    rightPanel: <SampleRightPanel />,
  },
  parameters: {
    docs: {
      description: {
        story: '콤팩트 변형입니다. 패널 너비가 줄어들어 더 많은 공간을 확보합니다.',
      },
    },
  },
};

export const Expanded: Story = {
  args: {
    viewType: 'dashboard',
    variant: 'expanded',
    showLeftPanel: true,
    showRightPanel: true,
    leftPanel: <SampleLeftPanel />,
    centerPanel: <SampleCenterPanel />,
    rightPanel: <SampleRightPanel />,
  },
  parameters: {
    docs: {
      description: {
        story: '확장 변형입니다. 패널 너비가 늘어나 더 많은 정보를 표시합니다.',
      },
    },
  },
};

export const WithoutLeftPanel: Story = {
  args: {
    viewType: 'dashboard',
    variant: 'default',
    showLeftPanel: false,
    showRightPanel: true,
    centerPanel: <SampleCenterPanel />,
    rightPanel: <SampleRightPanel />,
  },
  parameters: {
    docs: {
      description: {
        story: '좌측 패널이 없는 레이아웃입니다. 중앙과 우측 패널만 표시됩니다.',
      },
    },
  },
};

export const WithoutRightPanel: Story = {
  args: {
    viewType: 'dashboard',
    variant: 'default',
    showLeftPanel: true,
    showRightPanel: false,
    leftPanel: <SampleLeftPanel />,
    centerPanel: <SampleCenterPanel />,
  },
  parameters: {
    docs: {
      description: {
        story: '우측 패널이 없는 레이아웃입니다. 좌측과 중앙 패널만 표시됩니다.',
      },
    },
  },
}; 