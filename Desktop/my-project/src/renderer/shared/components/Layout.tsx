import React from 'react';
import styled from 'styled-components';

const LayoutRoot = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
`;
const SidebarArea = styled.aside`
  width: 220px;
  background: #1e293b;
  color: #fff;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;
const MainArea = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;
const HeaderArea = styled.header`
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  padding: 0 32px;
  font-size: 1.25rem;
  font-weight: 600;
`;

interface LayoutProps {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ sidebar, header, children }) => (
  <LayoutRoot>
    {sidebar && <SidebarArea>{sidebar}</SidebarArea>}
    <MainArea>
      {header && <HeaderArea>{header}</HeaderArea>}
      <div style={{ flex: 1, padding: 32, minHeight: 0 }}>{children}</div>
    </MainArea>
  </LayoutRoot>
);

export default Layout; 