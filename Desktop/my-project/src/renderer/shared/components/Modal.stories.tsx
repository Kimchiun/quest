import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import type { ModalSize, ModalVariant } from './Modal';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Modal> = {
  title: 'Shared/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Modal 컴포넌트

미니멀하고 모던한 디자인의 모달 다이얼로그 컴포넌트입니다.

### 주요 특징
- **디자인 토큰 기반**: 모든 색상, 간격, 폰트가 theme에서 관리됩니다
- **접근성**: 포커스 트랩, 키보드 네비게이션, aria 속성 등 a11y를 고려했습니다
- **애니메이션**: 부드러운 페이드인/슬라이드인 애니메이션을 제공합니다
- **반응형**: 다양한 크기와 상태 옵션을 제공합니다
- **오버레이 클릭**: 설정 가능한 오버레이 클릭 닫기 기능

### 사용법
\`\`\`tsx
import Modal from '@/shared/components/Modal';
import Button from '@/shared/components/Button';

const [isOpen, setIsOpen] = useState(false);

// 기본 사용
<Modal open={isOpen} onClose={() => setIsOpen(false)} title="모달 제목">
  <p>모달 내용입니다.</p>
</Modal>

// 크기와 상태 지정
<Modal 
  open={isOpen} 
  onClose={() => setIsOpen(false)} 
  size="lg" 
  variant="danger"
  title="위험한 작업"
>
  <p>정말 삭제하시겠습니까?</p>
</Modal>

// 푸터가 있는 모달
<Modal 
  open={isOpen} 
  onClose={() => setIsOpen(false)} 
  title="확인"
  footer={
    <div>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>취소</Button>
      <Button variant="danger" onClick={handleDelete}>삭제</Button>
    </div>
  }
>
  <p>정말 삭제하시겠습니까?</p>
</Modal>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: '모달 열림/닫힘 상태',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: '모달의 크기',
      table: {
        type: { summary: 'ModalSize' },
        defaultValue: { summary: 'md' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'danger', 'success'],
      description: '모달의 스타일 변형',
      table: {
        type: { summary: 'ModalVariant' },
        defaultValue: { summary: 'default' },
      },
    },
    title: {
      control: 'text',
      description: '모달 제목',
      table: {
        type: { summary: 'string' },
      },
    },
    hideClose: {
      control: 'boolean',
      description: '닫기 버튼 숨김 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: '오버레이 클릭으로 닫기 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
  decorators: [Story => <ThemeProvider theme={theme}><Story /></ThemeProvider>],
};
export default meta;
type Story = StoryObj<typeof Modal>;

// 기본 스토리들
export const Default: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: '기본 모달',
    children: <p>이것은 기본 모달입니다. 모달의 기본적인 사용법을 보여줍니다.</p>,
  },
  parameters: {
    docs: {
      description: {
        story: '기본 모달입니다. 제목과 내용을 포함한 가장 일반적인 사용법입니다.',
      },
    },
  },
};

export const WithoutTitle: Story = {
  args: {
    open: true,
    onClose: () => {},
    children: <p>제목이 없는 모달입니다. 간단한 알림이나 확인 메시지에 사용됩니다.</p>,
  },
  parameters: {
    docs: {
      description: {
        story: '제목이 없는 모달입니다. 간단한 알림이나 확인 메시지에 사용됩니다.',
      },
    },
  },
};

// 크기별 스토리들
export const Sizes: Story = {
  render: (args) => {
    const [openSize, setOpenSize] = useState<ModalSize | null>(null);
    
    return (
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button onClick={() => setOpenSize('sm')}>Small Modal</Button>
        <Button onClick={() => setOpenSize('md')}>Medium Modal</Button>
        <Button onClick={() => setOpenSize('lg')}>Large Modal</Button>
        <Button onClick={() => setOpenSize('xl')}>Extra Large Modal</Button>
        
        {openSize && (
          <Modal
            {...args}
            open={true}
            size={openSize}
            onClose={() => setOpenSize(null)}
            title={`${openSize.toUpperCase()} Size Modal`}
          >
            <p>이것은 {openSize} 크기의 모달입니다.</p>
            <p>다양한 크기 옵션을 통해 사용 사례에 맞는 모달을 선택할 수 있습니다.</p>
          </Modal>
        )}
      </div>
    );
  },
  args: {
    children: <p>크기별 모달 예제입니다.</p>,
  },
  parameters: {
    docs: {
      description: {
        story: '네 가지 크기 옵션을 비교할 수 있습니다: sm, md, lg, xl',
      },
    },
  },
};

// 상태별 스토리들
export const Variants: Story = {
  render: (args) => {
    const [openVariant, setOpenVariant] = useState<ModalVariant | null>(null);
    
    return (
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button onClick={() => setOpenVariant('default')}>Default Modal</Button>
        <Button onClick={() => setOpenVariant('danger')}>Danger Modal</Button>
        <Button onClick={() => setOpenVariant('success')}>Success Modal</Button>
        
        {openVariant && (
          <Modal
            {...args}
            open={true}
            variant={openVariant}
            onClose={() => setOpenVariant(null)}
            title={`${openVariant.charAt(0).toUpperCase() + openVariant.slice(1)} Modal`}
          >
            <p>이것은 {openVariant} variant의 모달입니다.</p>
            {openVariant === 'danger' && (
              <p style={{ color: '#dc2626' }}>위험한 작업을 수행하기 전에 사용자에게 경고를 표시합니다.</p>
            )}
            {openVariant === 'success' && (
              <p style={{ color: '#15803d' }}>성공적인 작업 완료를 알리는 데 사용됩니다.</p>
            )}
          </Modal>
        )}
      </div>
    );
  },
  args: {
    children: <p>variant별 모달 예제입니다.</p>,
  },
  parameters: {
    docs: {
      description: {
        story: '세 가지 variant 옵션을 비교할 수 있습니다: default, danger, success',
      },
    },
  },
};

// 푸터가 있는 모달
export const WithFooter: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: '확인 다이얼로그',
    children: <p>정말 이 작업을 수행하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>,
    footer: (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button variant="secondary" size="sm">취소</Button>
        <Button variant="danger" size="sm">삭제</Button>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '푸터가 있는 모달입니다. 사용자 액션 버튼들을 포함할 수 있습니다.',
      },
    },
  },
};

// 폼이 있는 모달
export const WithForm: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: '사용자 정보 입력',
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input placeholder="이름" />
        <Input placeholder="이메일" type="email" />
        <Input placeholder="전화번호" type="tel" />
      </div>
    ),
    footer: (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button variant="secondary" size="sm">취소</Button>
        <Button variant="primary" size="sm">저장</Button>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '폼이 포함된 모달입니다. 사용자 입력을 받는 데 사용됩니다.',
      },
    },
  },
};

// 긴 내용이 있는 모달
export const LongContent: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: '긴 내용 모달',
    children: (
      <div>
        <p>이 모달은 긴 내용을 포함하고 있습니다.</p>
        <p>스크롤이 필요한 경우 자동으로 스크롤바가 표시됩니다.</p>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i}>내용 라인 {i + 1}</p>
        ))}
        <p>모달의 최대 높이는 90vh로 제한되어 있어, 긴 내용도 안전하게 표시됩니다.</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '긴 내용이 있는 모달입니다. 자동 스크롤과 커스텀 스크롤바를 확인할 수 있습니다.',
      },
    },
  },
};

// 접근성 테스트용 스토리
export const Accessibility: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: '접근성 테스트 모달',
    children: (
      <div>
        <p>이 모달은 접근성을 고려하여 설계되었습니다.</p>
        <ul>
          <li>포커스 트랩이 구현되어 있습니다</li>
          <li>ESC 키로 닫을 수 있습니다</li>
          <li>적절한 aria 속성들이 설정되어 있습니다</li>
          <li>키보드 네비게이션이 지원됩니다</li>
        </ul>
        <p>스크린 리더 사용자도 모달의 내용을 쉽게 이해할 수 있습니다.</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '접근성을 위한 기능들이 구현된 모달입니다. 포커스 트랩, 키보드 네비게이션, aria 속성 등을 확인할 수 있습니다.',
      },
    },
  },
};

// 오버레이 클릭 비활성화
export const NoOverlayClick: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: '오버레이 클릭 비활성화',
    closeOnOverlayClick: false,
    children: (
      <div>
        <p>이 모달은 오버레이 클릭으로 닫을 수 없습니다.</p>
        <p>중요한 작업을 수행하는 동안 실수로 닫히는 것을 방지합니다.</p>
        <p>닫기 버튼을 통해서만 모달을 닫을 수 있습니다.</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '오버레이 클릭이 비활성화된 모달입니다. 중요한 작업 중 실수로 닫히는 것을 방지합니다.',
      },
    },
  },
};

// 닫기 버튼 숨김
export const NoCloseButton: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: '닫기 버튼 없음',
    hideClose: true,
    children: (
      <div>
        <p>이 모달은 닫기 버튼이 없습니다.</p>
        <p>ESC 키나 오버레이 클릭으로만 닫을 수 있습니다.</p>
        <p>특별한 경우에만 사용하는 것이 좋습니다.</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '닫기 버튼이 숨겨진 모달입니다. ESC 키나 오버레이 클릭으로만 닫을 수 있습니다.',
      },
    },
  },
}; 