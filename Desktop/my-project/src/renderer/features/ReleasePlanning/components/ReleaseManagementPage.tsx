import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { fetchReleases } from '../store/releaseSlice';
import ReleaseList from './ReleaseList';
import ReleaseDetail from './ReleaseDetail';
import CreateReleaseModal from './CreateReleaseModal';

// 스타일 컴포넌트
const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #f9fafb;
`;

const Sidebar = styled.div`
  width: 320px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 8px 0 0 0;
`;

interface ApiRelease {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

interface Release {
  id: number;
  name: string;
  version?: string;
  description?: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  startDate?: string;
  endDate?: string;
  assignee?: string;
  progress: number;
  totalTestCases: number;
  passedTestCases: number;
  failedTestCases: number;
  notExecutedTestCases: number;
  createdAt: string;
}

const ReleaseManagementPage: React.FC = () => {
  const dispatch = useDispatch();
  const { releases: apiReleases, loading } = useSelector((state: RootState) => state.releases);
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // API 데이터를 UI 인터페이스에 맞게 변환
  const transformReleases = (apiReleases: ApiRelease[]): Release[] => {
    return apiReleases.map((apiRelease, index) => {
      // 버전 정보 추출 (name에서 버전 추출 시도)
      const versionMatch = apiRelease.name.match(/V(\d+\.\d+\.\d+)/);
      const version = versionMatch ? versionMatch[1] : undefined;
      
      // 상태 추정 (name과 description 기반)
      let status: 'planning' | 'in-progress' | 'completed' | 'on-hold' = 'planning';
      if (apiRelease.name.includes('완료') || apiRelease.name.includes('안정성')) {
        status = 'completed';
      } else if (apiRelease.name.includes('버그 수정')) {
        status = 'in-progress';
      } else if (apiRelease.name.includes('신규 기능')) {
        status = 'planning';
      }

      // 담당자 추정
      let assignee = '미지정';
      if (apiRelease.name.includes('버그')) {
        assignee = '김개발';
      } else if (apiRelease.name.includes('신규')) {
        assignee = '이테스트';
      } else if (apiRelease.name.includes('안정성')) {
        assignee = '박QA';
      }

      // 진행률 및 테스트 케이스 수 시뮬레이션
      const progress = status === 'completed' ? 100 : status === 'in-progress' ? 65 : 0;
      const totalTestCases = 10 + (index * 5);
      const passedTestCases = status === 'completed' ? totalTestCases : Math.floor(totalTestCases * (progress / 100));
      const failedTestCases = status === 'in-progress' ? Math.floor(totalTestCases * 0.2) : 0;
      const notExecutedTestCases = totalTestCases - passedTestCases - failedTestCases;

      return {
        id: apiRelease.id,
        name: apiRelease.name,
        version,
        description: apiRelease.description,
        status,
        startDate: apiRelease.startDate,
        endDate: apiRelease.endDate,
        assignee,
        progress,
        totalTestCases,
        passedTestCases,
        failedTestCases,
        notExecutedTestCases,
        createdAt: apiRelease.createdAt
      };
    });
  };

  const releases = transformReleases(apiReleases);

  useEffect(() => {
    dispatch(fetchReleases() as any);
  }, [dispatch]);

  const handleReleaseSelect = (release: Release) => {
    setSelectedRelease(release);
  };

  const handleCreateRelease = () => {
    setIsCreateModalOpen(true);
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleReleaseCreated = (newRelease: Release) => {
    // 새 릴리즈가 생성되면 목록을 새로고침하고 선택
    dispatch(fetchReleases() as any);
    setSelectedRelease(newRelease);
    setIsCreateModalOpen(false);
  };

  return (
    <Container>
      <Sidebar>
        <ReleaseList
          releases={releases}
          selectedRelease={selectedRelease}
          onReleaseSelect={handleReleaseSelect}
          onCreateRelease={handleCreateRelease}
          loading={loading}
        />
      </Sidebar>
      
      <MainContent>
        <Header>
          <Title>릴리즈 관리</Title>
          <Subtitle>
            {selectedRelease 
              ? `${selectedRelease.name} - ${selectedRelease.version || '버전 없음'}`
              : '릴리즈를 선택하여 상세 정보를 확인하세요'
            }
          </Subtitle>
        </Header>
        
        {selectedRelease && (
          <ReleaseDetail
            release={selectedRelease}
            onReleaseUpdate={(updatedRelease: Release) => {
              // 릴리즈 업데이트 후 목록 새로고침
              dispatch(fetchReleases() as any);
              setSelectedRelease(updatedRelease);
            }}
          />
        )}
      </MainContent>

      {isCreateModalOpen && (
        <CreateReleaseModal
          isOpen={isCreateModalOpen}
          onClose={handleModalClose}
          onReleaseCreated={handleReleaseCreated}
        />
      )}
    </Container>
  );
};

export default ReleaseManagementPage; 