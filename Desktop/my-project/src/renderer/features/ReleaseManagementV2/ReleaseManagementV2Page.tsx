import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MainContentLayout from '@/shared/components/Layout/MainContentLayout';
import ReleaseListHeader from './components/ReleaseListHeader';
import ReleaseTableView from './components/ReleaseTableView';
import ReleaseCardView from './components/ReleaseCardView';
import ReleaseDetailHeader from './components/ReleaseDetailHeader';
import ReleaseTabBar from './components/ReleaseTabBar';
import ReleaseDetailPanel from './components/ReleaseDetailPanel';
import ReleaseCreateWizard from './components/ReleaseCreateWizard';
import ReleaseDetailPage from './components/ReleaseDetailPage';

// 타입 정의
interface Release {
  id: string;
  name: string;
  version: string;
  status: 'draft' | 'in-progress' | 'testing' | 'ready' | 'released';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  environment: string;
  folder: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  testCases: number;
  passed: number;
  failed: number;
  blocked: number;
  progress: number;
}

// Mock 데이터
const mockReleases: Release[] = [
  {
    id: '1',
    name: '사용자 인증 시스템 개선',
    version: 'v2.1.0',
    status: 'in-progress',
    priority: 'high',
    assignee: '김개발',
    environment: 'Production',
    folder: 'Core/Auth',
    tags: ['security', 'backend'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    testCases: 45,
    passed: 32,
    failed: 8,
    blocked: 5,
    progress: 71
  },
  {
    id: '2',
    name: '모바일 UI/UX 개선',
    version: 'v2.0.5',
    status: 'testing',
    priority: 'medium',
    assignee: '이디자인',
    environment: 'Staging',
    folder: 'Mobile/UI',
    tags: ['ui', 'mobile'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    testCases: 28,
    passed: 25,
    failed: 2,
    blocked: 1,
    progress: 89
  },
  {
    id: '3',
    name: '데이터베이스 성능 최적화',
    version: 'v2.1.1',
    status: 'ready',
    priority: 'critical',
    assignee: '박데이터',
    environment: 'Production',
    folder: 'Backend/DB',
    tags: ['performance', 'database'],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-19',
    testCases: 67,
    passed: 67,
    failed: 0,
    blocked: 0,
    progress: 100
  }
];

const ReleaseManagementV2Page: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [selectedReleases, setSelectedReleases] = useState<string[]>([]);
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [currentTab, setCurrentTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignee: '',
    environment: '',
    folder: ''
  });

  // 탭 데이터 정의
  const tabs = [
    {
      id: 'overview',
      label: '개요',
      icon: '📊',
      badge: undefined
    },
    {
      id: 'test-cases',
      label: '테스트 케이스',
      icon: '🧪',
      badge: selectedRelease?.testCases || 0
    },
    {
      id: 'execution',
      label: '실행',
      icon: '▶️',
      badge: undefined
    },
    {
      id: 'defects',
      label: '결함',
      icon: '🐛',
      badge: selectedRelease?.failed || 0
    },
    {
      id: 'documents',
      label: '문서',
      icon: '📄',
      badge: undefined
    },
    {
      id: 'history',
      label: '이력',
      icon: '📅',
      badge: undefined
    }
  ];

  const handleReleaseSelect = (release: Release) => {
    setSelectedRelease(release);
    setCurrentView('detail');
    setShowDetailPanel(true);
  };

  const handleReleaseDeselect = () => {
    setSelectedRelease(null);
    setCurrentView('list');
    setShowDetailPanel(false);
  };

  const handleCreateRelease = () => {
    setShowCreateWizard(true);
  };

  const handleBulkAction = (action: string, releaseIds: string[]) => {
    console.log(`Bulk action: ${action}`, releaseIds);
    // 실제 구현에서는 API 호출
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  const handleAction = (action: string) => {
    console.log(`Action: ${action}`, selectedRelease);
    // 실제 구현에서는 해당 액션 수행
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleReleaseSelection = (releaseId: string, selected: boolean) => {
    if (selected) {
      setSelectedReleases(prev => [...prev, releaseId]);
    } else {
      setSelectedReleases(prev => prev.filter(id => id !== releaseId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedReleases(mockReleases.map(r => r.id));
    } else {
      setSelectedReleases([]);
    }
  };

  // 필터링된 릴리즈 목록
  const filteredReleases = mockReleases.filter(release => {
    const matchesSearch = release.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         release.version.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filters.status || release.status === filters.status;
    const matchesPriority = !filters.priority || release.priority === filters.priority;
    const matchesAssignee = !filters.assignee || release.assignee === filters.assignee;
    const matchesEnvironment = !filters.environment || release.environment === filters.environment;
    const matchesFolder = !filters.folder || release.folder === filters.folder;

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee && matchesEnvironment && matchesFolder;
  });

  return (
    <PageContainer>
      {currentView === 'list' && (
        <MainContentLayout
          viewType="list"
          variant="default"
          density="comfortable"
          leftPanel={
            <FilterPanel>
              <FilterSection>
                <FilterTitle>상태</FilterTitle>
                <FilterOptions>
                  {['draft', 'in-progress', 'testing', 'ready', 'released'].map(status => (
                    <FilterOption
                      key={status}
                      $active={filters.status === status}
                      onClick={() => handleFilterChange('status', filters.status === status ? '' : status)}
                    >
                      {status}
                    </FilterOption>
                  ))}
                </FilterOptions>
              </FilterSection>
              
              <FilterSection>
                <FilterTitle>우선순위</FilterTitle>
                <FilterOptions>
                  {['low', 'medium', 'high', 'critical'].map(priority => (
                    <FilterOption
                      key={priority}
                      $active={filters.priority === priority}
                      onClick={() => handleFilterChange('priority', filters.priority === priority ? '' : priority)}
                    >
                      {priority}
                    </FilterOption>
                  ))}
                </FilterOptions>
              </FilterSection>
              
              <FilterSection>
                <FilterTitle>환경</FilterTitle>
                <FilterOptions>
                  {['Development', 'Staging', 'Production'].map(env => (
                    <FilterOption
                      key={env}
                      $active={filters.environment === env}
                      onClick={() => handleFilterChange('environment', filters.environment === env ? '' : env)}
                    >
                      {env}
                    </FilterOption>
                  ))}
                </FilterOptions>
              </FilterSection>
            </FilterPanel>
          }
          centerPanel={
            <ContentArea>
              <ReleaseListHeader
                onCreateRelease={handleCreateRelease}
                onSearch={handleSearch}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                selectedCount={selectedReleases.length}
                totalCount={filteredReleases.length}
              />
              
              {viewMode === 'table' ? (
                <ReleaseTableView
                  releases={filteredReleases}
                  selectedReleases={selectedReleases}
                  onReleaseSelect={handleReleaseSelect}
                  onReleaseSelection={handleReleaseSelection}
                  onSelectAll={handleSelectAll}
                  onBulkAction={handleBulkAction}
                />
              ) : (
                <ReleaseCardView
                  releases={filteredReleases}
                  selectedReleases={selectedReleases}
                  onReleaseSelect={handleReleaseSelect}
                  onReleaseSelection={handleReleaseSelection}
                  onBulkAction={handleBulkAction}
                />
              )}
            </ContentArea>
          }
          rightPanel={
            showDetailPanel && selectedRelease ? (
              <ReleaseDetailPanel
                release={selectedRelease}
                onClose={handleReleaseDeselect}
                onAction={handleAction}
              />
            ) : null
          }
          showRightPanel={showDetailPanel}
        />
      )}

      {currentView === 'detail' && selectedRelease && (
        <MainContentLayout
          viewType="detail"
          variant="default"
          density="comfortable"
          leftPanel={
            <WorkspaceNav>
              <ReleaseDetailHeader
                release={selectedRelease}
                onBack={handleReleaseDeselect}
                onAction={handleAction}
              />
              <ReleaseTabBar
                tabs={tabs}
                activeTab={currentTab}
                onTabChange={handleTabChange}
              />
            </WorkspaceNav>
          }
          centerPanel={
            <WorkspaceContent>
              <ReleaseDetailPage
                release={selectedRelease}
                currentTab={currentTab}
              />
            </WorkspaceContent>
          }
          rightPanel={
            <InspectorPanel>
              <InspectorContent>
                <InspectorTitle>실행 패널</InspectorTitle>
                <InspectorSection>
                  <SectionTitle>선택된 항목</SectionTitle>
                  <SectionContent>
                    현재 선택된 항목이 없습니다.
                  </SectionContent>
                </InspectorSection>
              </InspectorContent>
            </InspectorPanel>
          }
        />
      )}

      {showCreateWizard && (
        <ReleaseCreateWizard
          onClose={() => setShowCreateWizard(false)}
          onComplete={(release) => {
            console.log('New release created:', release);
            setShowCreateWizard(false);
          }}
        />
      )}
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: ${({ theme }) => theme.color.background};
`;

const FilterPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.gap.regular};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.color.surface.secondary};
  border-radius: ${({ theme }) => theme.radius.md};
  height: 100%;
  overflow-y: auto;
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.gap.sm};
`;

const FilterTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0;
`;

const FilterOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.gap.xs};
`;

const FilterOption = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme, $active }) => $active ? theme.color.primary[100] : 'transparent'};
  color: ${({ theme, $active }) => $active ? theme.color.primary[700] : theme.color.text.secondary};
  border: 1px solid ${({ theme, $active }) => $active ? theme.color.primary[300] : theme.color.border.secondary};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.normal} ease;
  
  &:hover {
    background: ${({ theme, $active }) => $active ? theme.color.primary[200] : theme.color.surface.tertiary};
    color: ${({ theme }) => theme.color.text.primary};
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: ${({ theme }) => theme.gap.regular};
`;

const WorkspaceNav = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: ${({ theme }) => theme.gap.regular};
`;

const WorkspaceContent = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.md};
`;

const InspectorPanel = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${({ theme }) => theme.color.surface.secondary};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
`;

const InspectorContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: ${({ theme }) => theme.gap.regular};
  padding: ${({ theme }) => theme.spacing.md};
`;

const InspectorTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.h3.fontSize};
  font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0;
`;

const InspectorSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.gap.sm};
`;

const SectionTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.color.text.secondary};
  margin: 0;
`;

const SectionContent = styled.div`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  color: ${({ theme }) => theme.color.text.tertiary};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.color.surface.primary};
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.color.border.secondary};
`;

export default ReleaseManagementV2Page;
