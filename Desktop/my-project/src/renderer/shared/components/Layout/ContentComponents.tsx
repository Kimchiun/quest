import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { NavigationSection } from '../../../store/navigationSlice';
import TestCaseList from '../../../features/TestCaseManagement/components/TestCaseList';
import ReleaseBoard from '../../../features/ReleasePlanning/components/ReleaseBoard';
import NewDashboard from '../../../features/Dashboard/components/NewDashboard';

const ContentContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 20px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7280;
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyStateTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
`;

const EmptyStateDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  max-width: 400px;
`;

// 대시보드 컨텐츠
const DashboardContent: React.FC = () => {
  return (
    <ContentContainer>
      <NewDashboard />
    </ContentContainer>
  );
};

// 테스트 관리 컨텐츠
const TestManagementContent: React.FC = () => {
  return (
    <ContentContainer>
      <TestCaseList />
    </ContentContainer>
  );
};

// 릴리즈 관리 컨텐츠
const ReleaseManagementContent: React.FC = () => {
  return (
    <ContentContainer>
      <ReleaseBoard />
    </ContentContainer>
  );
};

// 결함 관리 컨텐츠
const DefectManagementContent: React.FC = () => {
  return (
    <ContentContainer>
      <EmptyState>
        <EmptyStateIcon>🐛</EmptyStateIcon>
        <EmptyStateTitle>결함 관리</EmptyStateTitle>
        <EmptyStateDescription>
          결함 관리 기능이 곧 추가될 예정입니다.
          현재는 대시보드에서 결함 정보를 확인할 수 있습니다.
        </EmptyStateDescription>
      </EmptyState>
    </ContentContainer>
  );
};

// 리포트 컨텐츠
const ReportContent: React.FC = () => {
  return (
    <ContentContainer>
      <EmptyState>
        <EmptyStateIcon>📊</EmptyStateIcon>
        <EmptyStateTitle>리포트</EmptyStateTitle>
        <EmptyStateDescription>
          테스트 결과 리포트 및 분석 기능이 곧 추가될 예정입니다.
          현재는 대시보드에서 기본 통계를 확인할 수 있습니다.
        </EmptyStateDescription>
      </EmptyState>
    </ContentContainer>
  );
};

// 설정 컨텐츠
const SettingsContent: React.FC = () => {
  return (
    <ContentContainer>
      <EmptyState>
        <EmptyStateIcon>⚙️</EmptyStateIcon>
        <EmptyStateTitle>설정</EmptyStateTitle>
        <EmptyStateDescription>
          시스템 설정 및 사용자 환경 설정 기능이 곧 추가될 예정입니다.
        </EmptyStateDescription>
      </EmptyState>
    </ContentContainer>
  );
};

// 메인 컨텐츠 컴포넌트
const MainContent: React.FC = () => {
  const currentSection = useSelector((state: RootState) => state.navigation.currentSection);

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return <DashboardContent />;
      case 'test-management':
        return <TestManagementContent />;
      case 'release-management':
        return <ReleaseManagementContent />;
      case 'defect-management':
        return <DefectManagementContent />;
      case 'report':
        return <ReportContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return renderContent();
};

export default MainContent; 