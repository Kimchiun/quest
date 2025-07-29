import React, { useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Theme } from '../theme';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';
export type ModalVariant = 'default' | 'danger' | 'success';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  variant?: ModalVariant;
  children: React.ReactNode;
  footer?: React.ReactNode;
  hideClose?: boolean;
  closeOnOverlayClick?: boolean;
}

// 애니메이션 정의
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const getSizeStyle = (size: ModalSize = 'md', theme: Theme) => {
  switch (size) {
    case 'sm':
      return css`
        min-width: 320px;
        max-width: 400px;
        padding: ${theme.spacing.lg} ${theme.spacing.md};
      `;
    case 'lg':
      return css`
        min-width: 640px;
        max-width: 800px;
        padding: ${theme.spacing.xl} ${theme.spacing.lg};
      `;
    case 'xl':
      return css`
        min-width: 800px;
        max-width: 1200px;
        padding: ${theme.spacing.xl} ${theme.spacing.lg};
      `;
    default:
      return css`
        min-width: 440px;
        max-width: 600px;
        padding: ${theme.spacing.lg} ${theme.spacing.md};
      `;
  }
};

const getVariantStyle = (variant: ModalVariant = 'default', theme: Theme) => {
  switch (variant) {
    case 'danger':
      return css`
        border: 2px solid ${theme.color.danger};
        box-shadow: 0 4px 32px rgba(239, 68, 68, 0.15);
      `;
    case 'success':
      return css`
        border: 2px solid ${theme.color.success};
        box-shadow: 0 4px 32px rgba(21, 128, 61, 0.15);
      `;
    default:
      return css`
        border: 1px solid ${theme.color.neutralBorder};
        box-shadow: ${theme.shadow.lg};
      `;
  }
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  animation: ${fadeIn} 0.2s ease-out;
  backdrop-filter: blur(4px);
`;

const ModalBox = styled.div<{ size: ModalSize; variant: ModalVariant }>`
  background: ${({ theme }) => theme.color.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  position: relative;
  outline: none;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${slideIn} 0.3s ease-out;
  
  ${props => getSizeStyle(props.size, props.theme)}
  ${props => getVariantStyle(props.variant, props.theme)}

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.color.neutralBg};
    border-radius: ${({ theme }) => theme.radius.sm};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color.neutralBorder};
    border-radius: ${({ theme }) => theme.radius.sm};
    
    &:hover {
      background: ${({ theme }) => theme.color.textSecondary};
    }
  }
`;

const ModalTitle = styled.h2`
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeLg};
  font-weight: ${({ theme }) => theme.font.weightBold};
  line-height: ${({ theme }) => theme.font.lineHeight};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  color: ${({ theme }) => theme.color.text};
  padding-right: ${({ theme }) => theme.spacing.xl};
`;

const CloseBtn = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  background: none;
  border: none;
  font-size: 24px;
  color: ${({ theme }) => theme.color.textSecondary};
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: all 0.15s ease;
  
  &:hover {
    background: ${({ theme }) => theme.color.neutralBg};
    color: ${({ theme }) => theme.color.text};
  }
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.focus};
    outline-offset: 2px;
    background: ${({ theme }) => theme.color.neutralBg};
  }
`;

const Footer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.color.neutralBorder};
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ModalContent = styled.div`
  color: ${({ theme }) => theme.color.text};
  line-height: ${({ theme }) => theme.font.lineHeight};
`;

const Modal: React.FC<ModalProps> = ({ 
  open, 
  onClose, 
  title, 
  size = 'md', 
  variant = 'default', 
  children, 
  footer, 
  hideClose = false,
  closeOnOverlayClick = true
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = React.useId();

  // ESC 키로 닫기
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // 포커스 트랩
  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);

  // 오버레이 클릭으로 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalBox
        ref={modalRef}
        size={size}
        variant={variant}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
      >
        {title && <ModalTitle id={titleId}>{title}</ModalTitle>}
        {!hideClose && (
          <CloseBtn 
            onClick={onClose} 
            aria-label="모달 닫기"
            type="button"
          >
            ×
          </CloseBtn>
        )}
        <ModalContent>{children}</ModalContent>
        {footer && <Footer>{footer}</Footer>}
      </ModalBox>
    </Overlay>
  );
};

export default Modal; 