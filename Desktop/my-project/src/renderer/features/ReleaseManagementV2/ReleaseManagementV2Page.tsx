import React, { useState } from 'react';
import styled from 'styled-components';
import MainContentLayout from '@/shared/components/Layout/MainContentLayout';
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
    id: '1',
    name: 'Release Alpha',
    version: 'v1.2.3',
    status: 'in-progress',
    startDate: '2024-01-15',
    endDate: '2024-01-22',
    progress: 75,
    passRate: 90,
    blockers: 2,
    assignee: '김철수',
    folder: '/프로젝트/알파',
    updatedAt: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    name: 'Release Beta',
    version: 'v2.0.0',
    status: 'released',
    startDate: '2024-01-08',
    endDate: '2024-01-15',
    progress: 100,
    passRate: 95,
    blockers: 0,
    assignee: '이영희',
    folder: '/프로젝트/베타',
    updatedAt: '2024-01-15T14:20:00Z'
  },
  {
    id: '3',
    name: 'Release Gamma',
    version: 'v1.5.0',
    status: 'draft',
    startDate: '2024-01-22',
    endDate: '2024-01-29',
    progress: 20,
    passRate: 80,
    blockers: 5,
    assignee: '박민수',
    folder: '/프로젝트/감마',
    updatedAt: '2024-01-21T09:15:00Z'
  },
  {
    id: '4',
    name: 'Release Delta',
    version: 'v1.8.1',
    status: 'testing',
    startDate: '2024-01-29',
    endDate: '2024-02-05',
    progress: 60,
    passRate: 85,
    blockers: 3,
    assignee: '최지영',
    folder: '/프로젝트/델타',
    updatedAt: '2024-01-30T16:45:00Z'
  },
  {
    id: '5',
    name: 'Release Epsilon',
    version: 'v2.1.0',
    status: 'ready',
    startDate: '2024-02-05',
    endDate: '2024-02-12',
    progress: 90,
    passRate: 92,
    blockers: 1,
    assignee: '정수민',
    folder: '/프로젝트/엡실론',
    updatedAt: '2024-02-06T11:30:00Z'
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

          <PaginationSection>
            <PaginationContainer>
              <PaginationButton>‹</PaginationButton>
              <PaginationPage>1</PaginationPage>
              <PaginationPage>2</PaginationPage>
              <PaginationPage>3</PaginationPage>
              <PaginationEllipsis>...</PaginationEllipsis>
              <PaginationPage>10</PaginationPage>
              <PaginationButton>›</PaginationButton>
            </PaginationContainer>
          </PaginationSection>
        </PageContainer>
      </ListView>

      {/* 상세 뷰 */}
      <DetailView 
        isVisible={currentView === 'detail'}
        isEntering={currentView === 'detail'}
      >
        {selectedRelease && (
          <ReleaseDetailPage
            release={selectedRelease}
            currentTab={currentTab}
            onBackToList={handleBackToList}
          />
        )}
      </DetailView>
    </PageWrapper>
  );

  return (
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
      </TableSection>
      
      <PaginationSection>
        <PaginationContainer>
          <PaginationButton>‹</PaginationButton>
          <PaginationPage active>1</PaginationPage>
          <PaginationPage>2</PaginationPage>
          <PaginationPage>3</PaginationPage>
          <PaginationEllipsis>...</PaginationEllipsis>
          <PaginationPage>10</PaginationPage>
          <PaginationButton>›</PaginationButton>
        </PaginationContainer>
      </PaginationSection>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: ${({ theme }) => theme.color.surface.primary};
  display: flex;
  flex-direction: column;
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
  overflow: auto;
`;

const PaginationSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
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
  height: 100vh;
  position: relative;
  overflow: hidden;
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
`;

export default ReleaseManagementV2Page;