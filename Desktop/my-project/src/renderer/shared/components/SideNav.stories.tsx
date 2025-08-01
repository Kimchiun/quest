import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import SideNav, { NavItem } from './SideNav';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SideNav> = {
  title: 'Shared/SideNav',
  component: SideNav,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## SideNav 컴포넌트

좌측 글로벌 메뉴 컴포넌트입니다.

### 주요 특징
- **토글 기능**: 펼치기/접기 애니메이션
- **서브메뉴**: 계층적 네비게이션 지원
- **뱃지**: 알림 개수 표시
- **접근성**: 키보드 네비게이션 지원
- **반응형**: 모바일 친화적 디자인

### 사용법
\`\`\`tsx
import SideNav, { NavItem } from '@/shared/components/SideNav';

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '📊',
    href: '/dashboard'
  },
  {
    id: 'testcases',
    label: 'Test Cases',
    icon: '🧪',
    children: [
      { id: 'all', label: 'All Cases', href: '/testcases' },
      { id: 'my', label: 'My Cases', href: '/testcases/my' }
    ]
  }
];

<SideNav 
  items={navItems}
  activeItemId="dashboard"
  onNavigate={(item) => console.log('Navigate to:', item)}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    collapsed: {
      control: 'boolean',
      description: '사이드바 접힘 상태',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    activeItemId: {
      control: 'text',
      description: '현재 활성화된 메뉴 아이템 ID',
      table: {
        type: { summary: 'string' },
      },
    },
  },
  decorators: [Story => <ThemeProvider theme={theme}><Story /></ThemeProvider>],
};
export default meta;
type Story = StoryObj<typeof SideNav>;

const sampleNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '📊',
    href: '/dashboard'
  },
  {
    id: 'testcases',
    label: 'Test Cases',
    icon: '🧪',
    badge: 5,
    children: [
      { id: 'all-cases', label: 'All Cases', href: '/testcases' },
      { id: 'my-cases', label: 'My Cases', href: '/testcases/my' },
      { id: 'favorites', label: 'Favorites', href: '/testcases/favorites' }
    ]
  },
  {
    id: 'releases',
    label: 'Releases',
    icon: '🚀',
    children: [
      { id: 'current', label: 'Current Release', href: '/releases/current' },
      { id: 'upcoming', label: 'Upcoming', href: '/releases/upcoming' },
      { id: 'archived', label: 'Archived', href: '/releases/archived' }
    ]
  },
  {
    id: 'defects',
    label: 'Defects',
    icon: '🐛',
    badge: 12,
    children: [
      { id: 'open', label: 'Open Defects', href: '/defects/open' },
      { id: 'in-progress', label: 'In Progress', href: '/defects/in-progress' },
      { id: 'resolved', label: 'Resolved', href: '/defects/resolved' }
    ]
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: '📈',
    children: [
      { id: 'test-coverage', label: 'Test Coverage', href: '/reports/coverage' },
      { id: 'execution', label: 'Execution Summary', href: '/reports/execution' },
      { id: 'defect-trends', label: 'Defect Trends', href: '/reports/defects' }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '⚙️',
    children: [
      { id: 'profile', label: 'Profile', href: '/settings/profile' },
      { id: 'preferences', label: 'Preferences', href: '/settings/preferences' },
      { id: 'security', label: 'Security', href: '/settings/security' }
    ]
  }
];

// 기본 스토리
export const Default: Story = {
  args: {
    items: sampleNavItems,
    activeItemId: 'dashboard',
  },
  parameters: {
    docs: {
      description: {
        story: '기본 사이드바입니다. 모든 메뉴 아이템과 서브메뉴가 표시됩니다.',
      },
    },
  },
};

// 접힌 상태 스토리
export const Collapsed: Story = {
  args: {
    items: sampleNavItems,
    activeItemId: 'dashboard',
    collapsed: true,
  },
  parameters: {
    docs: {
      description: {
        story: '접힌 상태의 사이드바입니다. 아이콘만 표시됩니다.',
      },
    },
  },
};

// 활성 메뉴가 있는 스토리
export const WithActiveItem: Story = {
  args: {
    items: sampleNavItems,
    activeItemId: 'testcases',
  },
  parameters: {
    docs: {
      description: {
        story: '활성화된 메뉴 아이템이 있는 사이드바입니다.',
      },
    },
  },
};

// 뱃지가 있는 스토리
export const WithBadges: Story = {
  args: {
    items: sampleNavItems,
    activeItemId: 'defects',
  },
  parameters: {
    docs: {
      description: {
        story: '뱃지가 있는 메뉴 아이템들을 보여줍니다.',
      },
    },
  },
};

// 토글 기능이 있는 스토리
export const WithToggle: Story = {
  render: (args) => {
    const [collapsed, setCollapsed] = useState(false);
    
    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <SideNav 
          {...args} 
          collapsed={collapsed}
          onToggle={setCollapsed}
        />
        <div style={{ flex: 1, padding: '20px' }}>
          <h3>Main Content Area</h3>
          <p>Sidebar is {collapsed ? 'collapsed' : 'expanded'}</p>
        </div>
      </div>
    );
  },
  args: {
    items: sampleNavItems,
    activeItemId: 'dashboard',
  },
  parameters: {
    docs: {
      description: {
        story: '토글 기능이 있는 사이드바입니다. 버튼을 클릭하여 펼치기/접기를 할 수 있습니다.',
      },
    },
  },
};

// 간단한 메뉴 스토리
export const SimpleMenu: Story = {
  args: {
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'testcases', label: 'Test Cases', icon: '🧪' },
      { id: 'reports', label: 'Reports', icon: '📈' },
      { id: 'settings', label: 'Settings', icon: '⚙️' }
    ],
    activeItemId: 'dashboard',
  },
  parameters: {
    docs: {
      description: {
        story: '서브메뉴가 없는 간단한 메뉴 구조입니다.',
      },
    },
  },
};

// 비활성화된 메뉴 스토리
export const WithDisabledItems: Story = {
  args: {
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'testcases', label: 'Test Cases', icon: '🧪', disabled: true },
      { id: 'reports', label: 'Reports', icon: '📈' },
      { id: 'settings', label: 'Settings', icon: '⚙️', disabled: true }
    ],
    activeItemId: 'dashboard',
  },
  parameters: {
    docs: {
      description: {
        story: '비활성화된 메뉴 아이템이 있는 사이드바입니다.',
      },
    },
  },
}; 