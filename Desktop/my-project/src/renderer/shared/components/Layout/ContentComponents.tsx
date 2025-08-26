import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

import DashboardPage from '../../../features/Dashboard/DashboardPage';
import TestManagementV2Page from '../../../features/TestManagementV2/TestManagementV2Page';

import ReleaseManagementV2Page from '../../../features/ReleaseManagementV2/ReleaseManagementV2Page';

const ContentContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 20px;
`;



// 대시보드 컨텐츠
const DashboardContent: React.FC = () => {
  return <DashboardPage />;
};



// 테스트 관리 v2 컨텐츠
const TestManagementV2Content: React.FC = () => {
  return (
    <ContentContainer style={{ padding: 0 }}>
      <TestManagementV2Page />
    </ContentContainer>
  );
};

// 릴리즈 관리 v2 컨텐츠
const ReleaseManagementV2Content: React.FC = () => {
  return (
    <ContentContainer style={{ padding: 0 }}>
      <ReleaseManagementV2Page />
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
      case 'test-management-v2':
        return <TestManagementV2Content />;
      case 'release-management-v2':
        return <ReleaseManagementV2Content />;
      default:
        return <DashboardContent />;
    }
  };

  return renderContent();
};

export default MainContent; 