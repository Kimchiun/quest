import React from 'react';
import styled from 'styled-components';
import Typography from './Typography';

const SidebarRoot = styled.aside`
  width: 220px;
  background: #1e293b;
  color: #fff;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 24px 0;
`;
const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 32px;
`;
const NavLink = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  color: ${({ active }) => (active ? '#38bdf8' : '#fff')};
  font-weight: ${({ active }) => (active ? 700 : 400)};
  font-size: 1rem;
  text-align: left;
  padding: 8px 32px;
  cursor: pointer;
  border-left: 4px solid ${({ active }) => (active ? '#38bdf8' : 'transparent')};
  transition: background 0.1s, color 0.1s;
  &:hover { background: #334155; }
`;
const ReleaseList = styled.ul`
  list-style: none;
  padding: 0 0 0 16px;
  margin: 0;
  flex: 1;
  overflow-y: auto;
`;
const ReleaseItem = styled.li<{ active?: boolean }>`
  margin-bottom: 4px;
  > button {
    background: none;
    border: none;
    color: ${({ active }) => (active ? '#38bdf8' : '#fff')};
    font-weight: ${({ active }) => (active ? 700 : 400)};
    font-size: 0.98rem;
    text-align: left;
    width: 100%;
    padding: 6px 0 6px 8px;
    cursor: pointer;
    border-left: 3px solid ${({ active }) => (active ? '#38bdf8' : 'transparent')};
    &:hover { background: #334155; }
  }
`;

interface SidebarProps {
  releases: { id: number; name: string }[];
  selectedReleaseId?: number;
  onSelectRelease?: (id: number) => void;
  onNavigate?: (route: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ releases, selectedReleaseId, onSelectRelease, onNavigate }) => (
  <SidebarRoot>
    <Typography $variant="h3" style={{ color: '#38bdf8', margin: '0 0 24px 32px' }}>ITMS</Typography>
    <Nav>
      <NavLink onClick={() => onNavigate?.('/dashboard')} active={false}>대시보드</NavLink>
      <NavLink onClick={() => onNavigate?.('/testcases')} active={false}>테스트케이스</NavLink>
      {/* 필요시 추가 메뉴 */}
    </Nav>
    <Typography $variant="h4" style={{ color: '#bae6fd', margin: '0 0 8px 32px', fontSize: '1.1rem' }}>릴리즈</Typography>
    <ReleaseList>
      {releases.map(r => (
        <ReleaseItem key={r.id} active={r.id === selectedReleaseId}>
          <button onClick={() => onSelectRelease?.(r.id)}>{r.name}</button>
        </ReleaseItem>
      ))}
    </ReleaseList>
  </SidebarRoot>
);

export default Sidebar; 