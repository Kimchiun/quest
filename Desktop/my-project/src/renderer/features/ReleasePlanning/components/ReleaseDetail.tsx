import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Icon from '../../../shared/components/Icon';
import TestCaseManagement from './TestCaseManagement';

// 스타일 컴포넌트
const Container = styled.div`
  padding: 20px;
  height: 100%;
  overflow-y: auto;
`;

const Section = styled.div`
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  margin-bottom: 20px;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const SectionContent = styled.div`
  padding: 20px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 14px;
  color: #111827;
  font-weight: 500;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'planning': return '#fef3c7';
      case 'in-progress': return '#dbeafe';
      case 'completed': return '#d1fae5';
      case 'on-hold': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'planning': return '#92400e';
      case 'in-progress': return '#1e40af';
      case 'completed': return '#065f46';
      case 'on-hold': return '#991b1b';
      default: return '#6b7280';
    }
  }};
`;

const ProgressSection = styled.div`
  margin-top: 20px;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: #10b981;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
`;

const StatNumber = styled.div<{ color: string }>`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.color};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
`;

const Description = styled.div`
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
  margin-top: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  border-left: 4px solid #3b82f6;
`;

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

interface ReleaseDetailProps {
  release: Release;
  onReleaseUpdate: (updatedRelease: Release) => void;
}

const getStatusText = (status: string): string => {
  switch (status) {
    case 'planning': return '계획';
    case 'in-progress': return '진행중';
    case 'completed': return '완료';
    case 'on-hold': return '보류';
    default: return '알 수 없음';
  }
};

const getStatusIcon = (status: string): string => {
  switch (status) {
    case 'planning': return '📋';
    case 'in-progress': return '🔄';
    case 'completed': return '✅';
    case 'on-hold': return '⏸️';
    default: return '❓';
  }
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const ReleaseDetail: React.FC<ReleaseDetailProps> = ({ release, onReleaseUpdate }) => {
  const [testCases, setTestCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReleaseTestCases();
  }, [release.id]);

  const fetchReleaseTestCases = async () => {
    setLoading(true);
    try {
      // 실제 API 호출로 대체
      const mockTestCases = [
        { id: 1, title: '로그인 기능 테스트', status: 'passed', assignee: '김개발', lastExecuted: '2024-01-15' },
        { id: 2, title: '회원가입 기능 테스트', status: 'failed', assignee: '이테스트', lastExecuted: '2024-01-14' },
        { id: 3, title: '비밀번호 재설정 테스트', status: 'not-executed', assignee: '박QA', lastExecuted: null },
      ];
      setTestCases(mockTestCases);
    } catch (error) {
      console.error('테스트 케이스 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestCaseStatusChange = (testCaseId: number, newStatus: string) => {
    setTestCases(prev => 
      prev.map(tc => 
        tc.id === testCaseId 
          ? { ...tc, status: newStatus, lastExecuted: new Date().toISOString().split('T')[0] }
          : tc
      )
    );

    // 진행률 재계산
    const updatedTestCases = testCases.map(tc => 
      tc.id === testCaseId 
        ? { ...tc, status: newStatus, lastExecuted: new Date().toISOString().split('T')[0] }
        : tc
    );

    const passedCount = updatedTestCases.filter(tc => tc.status === 'passed').length;
    const totalCount = updatedTestCases.length;
    const newProgress = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

    const updatedRelease = {
      ...release,
      progress: newProgress,
      passedTestCases: passedCount,
      totalTestCases: totalCount
    };

    onReleaseUpdate(updatedRelease);
  };

  return (
    <Container>
      {/* 릴리즈 정보 섹션 */}
      <Section>
        <SectionHeader>
          <SectionTitle>릴리즈 정보</SectionTitle>
        </SectionHeader>
        <SectionContent>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>릴리즈명</InfoLabel>
              <InfoValue>{release.name}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>버전</InfoLabel>
              <InfoValue>{release.version || '버전 없음'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>상태</InfoLabel>
              <StatusBadge status={release.status}>
                {getStatusIcon(release.status)} {getStatusText(release.status)}
              </StatusBadge>
            </InfoItem>
            <InfoItem>
              <InfoLabel>담당자</InfoLabel>
              <InfoValue>{release.assignee || '미지정'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>시작일</InfoLabel>
              <InfoValue>{release.startDate ? formatDate(release.startDate) : '미정'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>종료일</InfoLabel>
              <InfoValue>{release.endDate ? formatDate(release.endDate) : '미정'}</InfoValue>
            </InfoItem>
          </InfoGrid>
          
          {release.description && (
            <Description>
              <strong>릴리즈 노트:</strong><br />
              {release.description}
            </Description>
          )}
        </SectionContent>
      </Section>

      {/* 테스트 현황 요약 섹션 */}
      <Section>
        <SectionHeader>
          <SectionTitle>테스트 현황 요약</SectionTitle>
        </SectionHeader>
        <SectionContent>
          <ProgressSection>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                전체 진행률
              </span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                {release.progress}%
              </span>
            </div>
            <ProgressBar>
              <ProgressFill progress={release.progress} />
            </ProgressBar>
          </ProgressSection>

          <StatsGrid>
            <StatCard>
              <StatNumber color="#10b981">{release.passedTestCases}</StatNumber>
              <StatLabel>통과</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber color="#ef4444">{release.failedTestCases}</StatNumber>
              <StatLabel>실패</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber color="#6b7280">{release.notExecutedTestCases}</StatNumber>
              <StatLabel>미실행</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber color="#3b82f6">{release.totalTestCases}</StatNumber>
              <StatLabel>전체</StatLabel>
            </StatCard>
          </StatsGrid>
        </SectionContent>
      </Section>

      {/* 테스트 케이스 관리 섹션 */}
      <Section>
        <SectionHeader>
          <SectionTitle>테스트 케이스 관리</SectionTitle>
        </SectionHeader>
        <SectionContent>
          <TestCaseManagement
            releaseId={release.id}
            testCases={testCases}
            loading={loading}
            onTestCaseStatusChange={handleTestCaseStatusChange}
          />
        </SectionContent>
      </Section>
    </Container>
  );
};

export default ReleaseDetail; 