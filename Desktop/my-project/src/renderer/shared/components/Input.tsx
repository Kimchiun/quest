import React from 'react';
import styled from 'styled-components';
import { Theme } from '../theme';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id?: string;
  ariaLabel?: string;
  ariaDescribedby?: string;
  required?: boolean;
}

const StyledInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-family: ${({ theme }) => theme.font.family};
  color: ${({ theme }) => theme.color.text};
  background: ${({ theme }) => theme.color.surface};
  transition: border 0.15s;
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.primary};
    outline-offset: 2px;
    border-color: ${({ theme }) => theme.color.primary};
    z-index: 1;
  }
  &:disabled {
    background: ${({ theme }) => theme.color.background};
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Input: React.FC<InputProps> = ({ label, id, ariaLabel, ariaDescribedby, required, ...rest }) => {
  const inputId = id || React.useId();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: 14, fontWeight: 500, color: '#22223b' }}>
          {label} {required && <span aria-hidden="true" style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      <StyledInput
        id={inputId}
        aria-label={ariaLabel || label}
        aria-describedby={ariaDescribedby}
        aria-required={required}
        required={required}
        {...rest}
      />
    </div>
  );
};

export default Input; 