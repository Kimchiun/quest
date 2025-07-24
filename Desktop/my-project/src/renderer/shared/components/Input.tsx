import React from 'react';
import styled from 'styled-components';
import { Theme } from '../theme';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const StyledInput = styled.input<InputProps>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.font.sizeBase};
  font-family: ${({ theme }) => theme.font.family};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.text};
  transition: border 0.2s;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.primary};
  }
  &:disabled {
    background: ${({ theme }) => theme.color.background};
    color: ${({ theme }) => theme.color.textSecondary};
    opacity: 0.6;
  }
`;

const Input: React.FC<InputProps> = (props) => <StyledInput {...props} />;

export default Input; 