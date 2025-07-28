import React, { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';

export type ModalSize = 'sm' | 'md' | 'lg';
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
}

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled.div<{ size: ModalSize; variant: ModalVariant }>`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.12);
  padding: 32px 24px 24px 24px;
  min-width: ${({ size }) => size === 'sm' ? '320px' : size === 'lg' ? '640px' : '440px'};
  max-width: 90vw;
  outline: none;
  ${({ variant }) =>
    variant === 'danger' && css`border: 2px solid #dc2626;`}
  ${({ variant }) =>
    variant === 'success' && css`border: 2px solid #10b981;`}
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #22223b;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
`;

const Footer = styled.div`
  margin-top: 24px;
  text-align: right;
`;

const Modal: React.FC<ModalProps> = ({ 
  open, 
  onClose, 
  title, 
  size = 'md', 
  variant = 'default', 
  children, 
  footer, 
  hideClose 
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

  if (!open) return null;

  return (
    <Overlay>
      <ModalBox
        ref={modalRef}
        size={size}
        variant={variant}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        {title && <ModalTitle id={titleId}>{title}</ModalTitle>}
        {!hideClose && (
          <CloseBtn onClick={onClose} aria-label="닫기">
            ×
          </CloseBtn>
        )}
        <div>{children}</div>
        {footer && <Footer>{footer}</Footer>}
      </ModalBox>
    </Overlay>
  );
};

export default Modal; 