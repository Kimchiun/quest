import React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from '../theme';

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

const sizeStyle = (size: ModalSize, theme: Theme) => {
  switch (size) {
    case 'sm': return css`min-width: 320px; max-width: 400px;`;
    case 'lg': return css`min-width: 640px; max-width: 900px;`;
    case 'md':
    default: return css`min-width: 400px; max-width: 600px;`;
  }
};

const variantStyle = (variant: ModalVariant, theme: Theme) => {
  switch (variant) {
    case 'danger': return css`border-top: 4px solid ${theme.color.danger};`;
    case 'success': return css`border-top: 4px solid ${theme.color.success};`;
    case 'default':
    default: return css`border-top: 4px solid ${theme.color.primary};`;
  }
};

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.3);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
`;

const ModalBox = styled.div<{ size: ModalSize; variant: ModalVariant; theme: Theme }>`
  background: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.text};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: 0 2px 16px rgba(0,0,0,0.15);
  padding: ${({ theme }) => theme.spacing.lg};
  position: relative;
  ${({ size, theme }) => sizeStyle(size, theme)}
  ${({ variant, theme }) => variantStyle(variant, theme)}
  transition: background 0.2s, color 0.2s;
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 16px; right: 16px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
  &:hover { color: #222; }
`;

const Footer = styled.div`
  margin-top: 2rem;
  text-align: right;
`;

const Modal: React.FC<ModalProps> = ({ open, onClose, title, size = 'md', variant = 'default', children, footer, hideClose }) => {
  if (!open) return null;
  return (
    <Overlay>
      <ModalBox size={size} variant={variant}>
        {!hideClose && <CloseBtn aria-label="닫기" onClick={onClose}>&times;</CloseBtn>}
        {title && <ModalTitle>{title}</ModalTitle>}
        <div>{children}</div>
        {footer && <Footer>{footer}</Footer>}
      </ModalBox>
    </Overlay>
  );
};

export default Modal; 