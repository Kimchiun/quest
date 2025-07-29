import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import axios from '../../../utils/axios';
import TestCaseList from './TestCaseList';
import DefectList from './DefectList';
import ReportOverview from './ReportOverview';

interface Release {
  id: string;
  title: string;
  status: 'active' | 'pending' | 'completed';
  description?: string;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TabData {
  testCases: any[];
  defects: any[];
  reports: any;
}

const Container = styled.div`
  padding: 20px;
  height: 100%;
  overflow-y: auto;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 14px;
`;

const TabContainer = styled.div`
  margin-bottom: 20px;
`;

const TabList = styled.div`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 20px;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 12px 24px;
  border: none;
  background: ${({ active }) => (active ? '#3b82f6' : 'transparent')};
  color: ${({ active }) => (active ? 'white' : '#64748b')};
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px 6px 0 0;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ active }) => (active ? '#2563eb' : '#f1f5f9')};
    color: ${({ active }) => (active ? 'white' : '#1e293b')};
  }
`;

const TabContent = styled.div`
  min-height: 400px;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  color: #64748b;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #ef4444;
`;

const NoSelection = styled.div`
  text-align: center;
  padding: 40px;
  color: #64748b;
`;

const tabs = [
  { id: 'testcases', label: '테스트케이스', icon: '🧪' },
  { id: 'defects', label: '결함', icon: '🐛' },
  { id: 'reports', label: '보고서', icon: '📊' }
];

const CentralReleaseDetail: React.FC = () => {
  const selectedReleaseId = useSelector((state: RootState) => state.dashboardLayout.selectedReleaseId);
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [activeTab, setActiveTab] = useState('testcases');
  const [tabData, setTabData] = useState<TabData>({
    testCases: [],
    defects: [],
    reports: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 릴리즈 상세 정보 로드
  useEffect(() => {
    if (selectedReleaseId) {
      setLoading(true);
      setError(null);
      
      axios.get(`/api/releases/${selectedReleaseId}`)
        .then((res: any) => {
          setSelectedRelease(res.data);
          setLoading(false);
        })
        .catch(() => {
          setSelectedRelease(null);
          setError('릴리즈 정보를 불러올 수 없습니다.');
          setLoading(false);
        });
    } else {
      setSelectedRelease(null);
      setTabData({ testCases: [], defects: [], reports: {} });
    }
  }, [selectedReleaseId]);

  // 탭별 데이터 로드
  useEffect(() => {
    if (selectedReleaseId && activeTab) {
      loadTabData(selectedReleaseId, activeTab);
    }
  }, [selectedReleaseId, activeTab]);

  const loadTabData = async (releaseId: string, tab: string) => {
    try {
      switch (tab) {
        case 'testcases':
          const testCasesRes = await axios.get(`/api/releases/${releaseId}/testcases`);
          setTabData(prev => ({ ...prev, testCases: testCasesRes.data as any[] }));
          break;
        case 'defects':
          const defectsRes = await axios.get(`/api/releases/${releaseId}/defects`);
          setTabData(prev => ({ ...prev, defects: defectsRes.data as any[] }));
          break;
        case 'reports':
          const reportsRes = await axios.get(`/api/releases/${releaseId}/reports`);
          setTabData(prev => ({ ...prev, reports: reportsRes.data as any }));
          break;
      }
    } catch (error) {
      console.error(`${tab} 데이터 로드 실패:`, error);
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const renderTabContent = () => {
    if (!selectedReleaseId) {
      return (
        <NoSelection>
          <h3>릴리즈를 선택해주세요</h3>
          <p>좌측 패널에서 릴리즈를 선택하면 상세 정보를 확인할 수 있습니다.</p>
        </NoSelection>
      );
    }

    if (loading) {
      return <LoadingSpinner>데이터를 불러오는 중...</LoadingSpinner>;
    }

    if (error) {
      return <ErrorMessage>{error}</ErrorMessage>;
    }

    switch (activeTab) {
      case 'testcases':
        return (
          <TestCaseList 
            releaseId={selectedReleaseId}
            testCases={tabData.testCases}
            onDataChange={() => loadTabData(selectedReleaseId, 'testcases')}
          />
        );
      case 'defects':
        return (
          <DefectList 
            releaseId={selectedReleaseId}
            defects={tabData.defects}
            onDataChange={() => loadTabData(selectedReleaseId, 'defects')}
          />
        );
      case 'reports':
        return (
          <ReportOverview 
            releaseId={selectedReleaseId}
            reports={tabData.reports}
          />
        );
      default:
        return <div>알 수 없는 탭입니다.</div>;
    }
  };

  const statusLabels = {
    active: '진행 중',
    pending: '대기 중',
    completed: '완료'
  };

  if (!selectedReleaseId) {
    return (
      <Container>
        <Header>
          <Title>릴리즈 상세</Title>
          <Subtitle>릴리즈별 테스트케이스, 결함, 보고서를 확인하세요</Subtitle>
        </Header>
        <NoSelection>
          <h3>릴리즈를 선택해주세요</h3>
          <p>좌측 패널에서 릴리즈를 선택하면 상세 정보를 확인할 수 있습니다.</p>
        </NoSelection>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>릴리즈 상세</Title>
        <Subtitle>릴리즈별 테스트케이스, 결함, 보고서를 확인하세요</Subtitle>
      </Header>

      {selectedRelease && (
        <div style={{ marginBottom: '20px', padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{selectedRelease.title}</h2>
            <span style={{
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 500,
              color: selectedRelease.status === 'active' ? '#059669' : selectedRelease.status === 'pending' ? '#d97706' : '#7c3aed',
              background: selectedRelease.status === 'active' ? '#d1fae5' : selectedRelease.status === 'pending' ? '#fed7aa' : '#e9d5ff'
            }}>
              {statusLabels[selectedRelease.status]}
            </span>
          </div>
          {selectedRelease.description && (
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>{selectedRelease.description}</p>
          )}
        </div>
      )}

      <TabContainer>
        <TabList>
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => handleTabChange(tab.id)}
              data-testid={`tab-${tab.id}`}
            >
              {tab.icon} {tab.label}
            </TabButton>
          ))}
        </TabList>
        <TabContent>
          {renderTabContent()}
        </TabContent>
      </TabContainer>
    </Container>
  );
};

export default CentralReleaseDetail; 