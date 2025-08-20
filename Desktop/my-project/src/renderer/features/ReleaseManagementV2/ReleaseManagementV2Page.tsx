import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Button from '@/shared/components/Button';
import SearchControl from '@/shared/components/Layout/ControlComponents';
import ViewToggle from '@/shared/components/Layout/ViewToggle';
import ReleaseTableView from './components/ReleaseTableView';
import ReleaseCardView from './components/ReleaseCardView';
import ReleaseDetailHeader from './components/ReleaseDetailHeader';
import ReleaseTabBar from './components/ReleaseTabBar';
import ReleaseDetailPanel from './components/ReleaseDetailPanel';
import ReleaseDetailPage from './components/ReleaseDetailPage';


interface Release {
  id: string;
  name: string;
  version: string;
  status: 'draft' | 'in-progress' | 'testing' | 'ready' | 'released';
  startDate: string;
  endDate: string;
  progress: number;
  passRate: number;
  blockers: number;
  assignee: string;
  folder: string;
  updatedAt: string;
}

const mockReleases: Release[] = [
  {
    id: '7e7d0979-50ed-4a68-85ae-eadcb30e4161',
    name: 'Quest v1.4',
    version: '1.4.0',
    status: 'in-progress',
    startDate: '2024-01-15',
    endDate: '2024-01-22',
    progress: 75,
    passRate: 90,
    blockers: 2,
    assignee: 'admin',
    folder: '/프로젝트/Quest',
    updatedAt: '2024-01-20T10:30:00Z'
  },
  {
    id: 'f84e8e4b-1f9e-44b1-9005-55f234443a5d',
    name: 'Quest v1.5',
    version: '1.5.0',
    status: 'testing',
    startDate: '2024-01-08',
    endDate: '2024-01-15',
    progress: 60,
    passRate: 85,
    blockers: 3,
    assignee: 'admin',
    folder: '/프로젝트/Quest',
    updatedAt: '2024-01-15T14:20:00Z'
  },
  {
    id: '751b18cd-64e5-4665-9730-69994dc12be8',
    name: 'Quest v2.0',
    version: '2.0.0',
    status: 'ready',
    startDate: '2024-01-22',
    endDate: '2024-01-29',
    progress: 90,
    passRate: 92,
    blockers: 1,
    assignee: 'admin',
    folder: '/프로젝트/Quest',
    updatedAt: '2024-01-21T09:15:00Z'
  }
];

const ReleaseManagementV2Page: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [currentTab, setCurrentTab] = useState('overview');
  const [selectedReleases, setSelectedReleases] = useState<string[]>([]);
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [sortBy, setSortBy] = useState<string>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const containerRef = useRef<HTMLDivElement>(null);



  const handleReleaseSelect = (releaseId: string) => {
    setSelectedReleases(prev => 
      prev.includes(releaseId) 
        ? prev.filter(id => id !== releaseId)
        : [...prev, releaseId]
    );
  };

  const handleSelectAll = () => {
    if (selectedReleases.length === mockReleases.length) {
      setSelectedReleases([]);
    } else {
      setSelectedReleases(mockReleases.map(r => r.id));
    }
  };

  const handleViewRelease = (releaseId: string) => {
    const release = mockReleases.find(r => r.id === releaseId);
    if (release) {
      setSelectedRelease(release);
      setCurrentView('detail');
    }
  };

  const handleEditRelease = (releaseId: string) => {
    console.log('Edit release:', releaseId);
  };

  const handleDeleteRelease = (releaseId: string) => {
    console.log('Delete release:', releaseId);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedRelease(null);
  };

  const sortedReleases = [...mockReleases].sort((a, b) => {
    const aValue = a[sortBy as keyof Release];
    const bValue = b[sortBy as keyof Release];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const tabs = [
    { id: 'overview', label: '개요' },
    { id: 'testcases', label: '테스트 케이스' },
    { id: 'executions', label: '실행 결과' },
    { id: 'defects', label: '결함' },
    { id: 'settings', label: '설정' }
  ];

  return (
    <PageWrapper>
      {/* 목록 뷰 */}
      <ListView 
        isVisible={currentView === 'list'}
        isEntering={currentView === 'list'}
      >
        <PageContainer>
          <PageHeader>
            <HeaderLeft>
              <PageTitle>Releases</PageTitle>
              <ViewControls>
                <ViewIcon active={viewMode === 'table'}>☰</ViewIcon>
                <ViewIcon active={viewMode === 'card'}>⊞</ViewIcon>
                <ViewIcon>🔍</ViewIcon>
                <ViewIcon>↕</ViewIcon>
              </ViewControls>
            </HeaderLeft>
            <HeaderRight>
              <MyOwnedButton>
                <PersonIcon>👤</PersonIcon>
                My Owned/Participating
              </MyOwnedButton>
            </HeaderRight>
          </PageHeader>

          <TableSection>
            {viewMode === 'table' ? (
              <ReleaseTableView
                releases={sortedReleases}
                selectedReleases={selectedReleases}
                onSelectRelease={handleReleaseSelect}
                onSelectAll={handleSelectAll}
                onViewRelease={handleViewRelease}
                onEditRelease={handleEditRelease}
                onDeleteRelease={handleDeleteRelease}
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            ) : (
              <ReleaseCardView
                releases={sortedReleases}
                selectedReleases={selectedReleases}
                onSelectRelease={handleReleaseSelect}
                onViewRelease={handleViewRelease}
                onEditRelease={handleEditRelease}
                onDeleteRelease={handleDeleteRelease}
              />
            )}
            

          </TableSection>
        </PageContainer>
      </ListView>

      {/* 상세 뷰 */}
      <DetailView 
        isVisible={currentView === 'detail'}
        isEntering={currentView === 'detail'}
      >
        {selectedRelease && (
                       <DetailPageWrapper ref={containerRef}>
               <ReleaseDetailPage
                 release={selectedRelease}
                 currentTab={currentTab}
                 onBackToList={handleBackToList}
               />
             </DetailPageWrapper>
        )}
      </DetailView>
    </PageWrapper>
  );
};

const PageContainer = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.color.surface.primary};
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 전체 페이지 스크롤 방지 */
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
  background: ${({ theme }) => theme.color.surface.primary};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.h1.fontSize};
  font-weight: ${({ theme }) => theme.typography.h1.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0;
`;

const ViewControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ViewIcon = styled.button<{ active?: boolean }>`
  width: 32px;
  height: 32px;
  border: 1px solid ${({ theme, active }) => active ? theme.color.primary[400] : theme.color.border.primary};
  background: ${({ theme, active }) => active ? theme.color.primary[50] : theme.color.surface.primary};
  border-radius: ${({ theme }) => theme.radius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  color: ${({ theme, active }) => active ? theme.color.primary[700] : theme.color.text.secondary};
  transition: all ${({ theme }) => theme.motion.fast} ease;
  
  &:hover {
    background: ${({ theme, active }) => active ? theme.color.primary[100] : theme.color.surface.tertiary};
    color: ${({ theme }) => theme.color.text.primary};
    border-color: ${({ theme, active }) => active ? theme.color.primary[400] : theme.color.border.primary};
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.color.focus};
    outline-offset: 2px;
  }
`;

const MyOwnedButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.color.primary[600]};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.motion.fast} ease;
  
  &:hover {
    background: ${({ theme }) => theme.color.primary[700]};
  }
`;

const PersonIcon = styled.span`
  font-size: 16px;
`;

const TableSection = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  overflow: hidden; /* 스크롤바 제거 */
  min-height: 400px; /* 최소 높이 보장 */
`;

const PaginationSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.color.border.primary};
  background: ${({ theme }) => theme.color.surface.primary};
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const PaginationButton = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid ${({ theme }) => theme.color.border.primary};
  background: ${({ theme }) => theme.color.surface.primary};
  border-radius: ${({ theme }) => theme.radius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  color: ${({ theme }) => theme.color.text.secondary};
  transition: all ${({ theme }) => theme.motion.fast} ease;
  
  &:hover {
    background: ${({ theme }) => theme.color.surface.secondary};
    color: ${({ theme }) => theme.color.text.primary};
  }
`;

const PaginationPage = styled.button<{ active?: boolean }>`
  width: 32px;
  height: 32px;
  border: 1px solid ${({ theme, active }) => active ? theme.color.primary[400] : theme.color.border.primary};
  background: ${({ theme, active }) => active ? theme.color.primary[600] : theme.color.surface.primary};
  border-radius: ${({ theme }) => theme.radius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${({ theme, active }) => active ? theme.typography.label.fontWeight : 'normal'};
  color: ${({ theme, active }) => active ? 'white' : theme.color.text.secondary};
  transition: all ${({ theme }) => theme.motion.fast} ease;
  
  &:hover {
    background: ${({ theme, active }) => active ? theme.color.primary[700] : theme.color.surface.secondary};
    color: ${({ theme, active }) => active ? 'white' : theme.color.text.primary};
  }
`;

const PaginationEllipsis = styled.span`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: ${({ theme }) => theme.color.text.tertiary};
`;

// 애니메이션을 위한 styled components
const PageWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  
  /* 스크롤바 완전 숨김 */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Firefox */
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const DetailPageWrapper = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.color.border.primary} transparent;
  
  /* 부드러운 스크롤을 위한 추가 설정 */
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.color.border.primary};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.color.text.secondary};
  }
`;

const ListView = styled.div<{ isVisible: boolean; isEntering: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateX(${({ isVisible, isEntering }) => 
    isVisible ? '0' : isEntering ? '-100%' : '100%'
  });
  transition: transform ${({ theme }) => theme.motion.normal} cubic-bezier(0.4, 0, 0.2, 1);
  z-index: ${({ isVisible }) => isVisible ? 2 : 1};
  overflow: hidden;
  visibility: ${({ isVisible }) => isVisible ? 'visible' : 'hidden'};
  pointer-events: ${({ isVisible }) => isVisible ? 'auto' : 'none'};
  display: ${({ isVisible }) => isVisible ? 'block' : 'none'};
  
  /* 모든 스크롤바 완전 숨김 - 더 강력한 설정 */
  &::-webkit-scrollbar { 
    display: none !important; 
    width: 0 !important;
    height: 0 !important;
  }
  &::-webkit-scrollbar-track { display: none !important; }
  &::-webkit-scrollbar-thumb { display: none !important; }
  &::-webkit-scrollbar-corner { display: none !important; }
  
  /* Firefox */
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
  
  /* 모든 자식 요소의 스크롤바도 숨김 */
  * {
    &::-webkit-scrollbar { 
      display: none !important; 
      width: 0 !important;
      height: 0 !important;
    }
    &::-webkit-scrollbar-track { display: none !important; }
    &::-webkit-scrollbar-thumb { display: none !important; }
    &::-webkit-scrollbar-corner { display: none !important; }
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
  }
`;

const DetailView = styled.div<{ isVisible: boolean; isEntering: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateX(${({ isVisible, isEntering }) => 
    isVisible ? '0' : isEntering ? '100%' : '-100%'
  });
  transition: transform ${({ theme }) => theme.motion.normal} cubic-bezier(0.4, 0, 0.2, 1);
  z-index: ${({ isVisible }) => isVisible ? 2 : 1};
  overflow: hidden;
  visibility: ${({ isVisible }) => isVisible ? 'visible' : 'hidden'};
  pointer-events: ${({ isVisible }) => isVisible ? 'auto' : 'none'};
  
  /* 모든 스크롤바 완전 숨김 - 더 강력한 설정 */
  &::-webkit-scrollbar { 
    display: none !important; 
    width: 0 !important;
    height: 0 !important;
  }
  &::-webkit-scrollbar-track { display: none !important; }
  &::-webkit-scrollbar-thumb { display: none !important; }
  &::-webkit-scrollbar-corner { display: none !important; }
  
  /* Firefox */
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
  
  /* 모든 자식 요소의 스크롤바도 숨김 */
  * {
    &::-webkit-scrollbar { 
      display: none !important; 
      width: 0 !important;
      height: 0 !important;
    }
    &::-webkit-scrollbar-track { display: none !important; }
    &::-webkit-scrollbar-thumb { display: none !important; }
    &::-webkit-scrollbar-corner { display: none !important; }
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
  }
`;

export default ReleaseManagementV2Page;