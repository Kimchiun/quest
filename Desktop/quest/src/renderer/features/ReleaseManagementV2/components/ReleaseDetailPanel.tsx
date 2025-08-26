import React from 'react';
import styled from 'styled-components';
import Button from '@/shared/components/Button';

// 타입 정의
interface ReleaseDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  width?: number;
}

// 패널 오버레이
const PanelOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.color.surface.overlay};
  z-index: 200;
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.out};
  
  @media (max-width: 1024px) {
    z-index: 400;
  }
`;

// 패널 컨테이너
const PanelContainer = styled.div<{ 
  isOpen: boolean; 
  width: number;
}>`
  position: fixed;
  top: 0;
  right: ${({ isOpen, width }) => isOpen ? 0 : -width}px;
  width: ${({ width }) => width}px;
  height: 100vh;
  background: ${({ theme }) => theme.color.surface.primary};
  border-left: 1px solid ${({ theme }) => theme.color.border.primary};
  box-shadow: ${({ theme }) => theme.shadow.xl};
  z-index: 201;
  display: flex;
  flex-direction: column;
  transition: right ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.out};
  
  @media (max-width: 1024px) {
    z-index: 401;
    width: 100vw;
    right: ${({ isOpen }) => isOpen ? 0 : '100vw'};
  }
`;

// 패널 헤더
const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
  background: ${({ theme }) => theme.color.surface.primary};
  flex-shrink: 0;
`;

// 패널 제목
const PanelTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0;
`;

// 닫기 버튼
const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  border-radius: 6px;
  cursor: pointer;
  color: ${({ theme }) => theme.color.text.secondary};
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.out};
  
  &:hover {
    background: ${({ theme }) => theme.color.surface.secondary};
    color: ${({ theme }) => theme.color.text.primary};
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.color.focus.outline};
    outline-offset: 2px;
  }
`;

// 닫기 아이콘
const CloseIcon = styled.span`
  font-size: 20px;
  line-height: 1;
`;

// 패널 컨텐츠
const PanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px;
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.color.surface.secondary};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color.border.primary};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.color.border.secondary};
  }
`;

// 패널 액션 바
const PanelActionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid ${({ theme }) => theme.color.border.primary};
  background: ${({ theme }) => theme.color.surface.primary};
  flex-shrink: 0;
`;

// 섹션
const Section = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// 섹션 헤더
const SectionHeader = styled.h3`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.color.border.tertiary};
`;

// 섹션 컨텐츠
const SectionContent = styled.div`
  color: ${({ theme }) => theme.color.text.secondary};
  font-size: 14px;
  line-height: 20px;
`;

// 구분선
const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.color.border.tertiary};
  margin: 16px 0;
`;

// 키보드 이벤트 처리
const useKeyboardEvents = (isOpen: boolean, onClose: () => void) => {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);
};

// 포커스 트랩
const FocusTrap: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
};

const ReleaseDetailPanel: React.FC<ReleaseDetailPanelProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  width = 400
}) => {
  useKeyboardEvents(isOpen, onClose);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <PanelOverlay isOpen={isOpen} onClick={handleOverlayClick} />
      <PanelContainer isOpen={isOpen} width={width}>
        <FocusTrap>
          <PanelHeader>
            <PanelTitle>{title}</PanelTitle>
            <CloseButton onClick={onClose} aria-label="패널 닫기">
              <CloseIcon>×</CloseIcon>
            </CloseButton>
          </PanelHeader>
          
          <PanelContent>
            {children}
          </PanelContent>
          
          {actions && (
            <PanelActionBar>
              {actions}
            </PanelActionBar>
          )}
        </FocusTrap>
      </PanelContainer>
    </>
  );
};

export default ReleaseDetailPanel;
