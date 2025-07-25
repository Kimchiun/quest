import React from 'react';
import styled from 'styled-components';
import Typography from './Typography';

const HeaderRoot = styled.header`
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  font-size: 1.15rem;
  font-weight: 600;
`;
const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

interface HeaderProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ left, right, children }) => (
  <HeaderRoot>
    <Left>{left || children}</Left>
    <Right>{right}</Right>
  </HeaderRoot>
);

export default Header; 