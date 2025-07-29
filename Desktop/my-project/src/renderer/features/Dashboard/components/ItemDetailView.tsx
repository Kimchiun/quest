import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import axios from '../../../utils/axios';

const Container = styled.div`
  padding: 20px;
  height: 100%;
  overflow-y: auto;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h2`
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

const DetailCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
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
  color: #64748b;
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
`;

const StatusBadge = styled.span<{ status: string; type: 'testcase' | 'defect' }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ status, type }) => {
    if (type === 'testcase') {
      switch (status) {
        case 'Pass': return '#059669';
        case 'Fail': return '#dc2626';
        case 'Blocked': return '#d97706';
        case 'Defect': return '#7c3aed';
        default: return '#6b7280';
      }
    } else {
      switch (status) {
        case 'Open': return '#ef4444';
        case 'In Progress': return '#d97706';
        case 'Resolved': return '#059669';
        case 'Closed': return '#6b7280';
        default: return '#6b7280';
      }
    }
  }};
  background: ${({ status, type }) => {
    if (type === 'testcase') {
      switch (status) {
        case 'Pass': return '#d1fae5';
        case 'Fail': return '#fee2e2';
        case 'Blocked': return '#fed7aa';
        case 'Defect': return '#e9d5ff';
        default: return '#f9fafb';
      }
    } else {
      switch (status) {
        case 'Open': return '#fee2e2';
        case 'In Progress': return '#fed7aa';
        case 'Resolved': return '#d1fae5';
        case 'Closed': return '#f1f5f9';
        default: return '#f9fafb';
      }
    }
  }};
`;

const PriorityBadge = styled.span<{ priority: string }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ priority }) => {
    switch (priority) {
      case 'High': return '#dc2626';
      case 'Medium': return '#d97706';
      case 'Low': return '#059669';
      default: return '#6b7280';
    }
  }};
  background: ${({ priority }) => {
    switch (priority) {
      case 'High': return '#fef2f2';
      case 'Medium': return '#fffbeb';
      case 'Low': return '#f0fdf4';
      default: return '#f9fafb';
    }
  }};
`;

const SeverityBadge = styled.span<{ severity: string }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ severity }) => {
    switch (severity) {
      case 'Critical': return '#dc2626';
      case 'High': return '#ea580c';
      case 'Medium': return '#d97706';
      case 'Low': return '#059669';
      default: return '#6b7280';
    }
  }};
  background: ${({ severity }) => {
    switch (severity) {
      case 'Critical': return '#fef2f2';
      case 'High': return '#fff7ed';
      case 'Medium': return '#fffbeb';
      case 'Low': return '#f0fdf4';
      default: return '#f9fafb';
    }
  }};
`;

const Description = styled.div`
  line-height: 1.6;
  color: #374151;
  margin-bottom: 20px;
`;

const StepsContainer = styled.div`
  margin-bottom: 20px;
`;

const StepItem = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 6px;
`;

const StepNumber = styled.span`
  font-weight: 600;
  color: #3b82f6;
  min-width: 24px;
`;

const StepContent = styled.span`
  color: #374151;
`;

const HistoryContainer = styled.div`
  margin-top: 20px;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
`;

const HistoryInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HistoryAction = styled.span`
  font-size: 14px;
  color: #374151;
  font-weight: 500;
`;

const HistoryDate = styled.span`
  font-size: 12px;
  color: #64748b;
`;

const HistoryUser = styled.span`
  font-size: 12px;
  color: #3b82f6;
  font-weight: 500;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  color: #64748b;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
`;

interface TestCaseDetail {
  id: number;
  title: string;
  description?: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Archived';
  executionStatus: 'Untested' | 'Pass' | 'Fail' | 'Blocked' | 'Defect';
  steps: string[];
  expected: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  history: Array<{
    action: string;
    user: string;
    date: string;
  }>;
}

interface DefectDetail {
  id: number;
  title: string;
  description?: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  history: Array<{
    action: string;
    user: string;
    date: string;
  }>;
}

const ItemDetailView: React.FC = () => {
  const selectedTestCaseId = useSelector((state: RootState) => state.dashboardLayout.selectedTestCaseId);
  const selectedDefectId = useSelector((state: RootState) => state.dashboardLayout.selectedDefectId);
  const [testCaseDetail, setTestCaseDetail] = useState<TestCaseDetail | null>(null);
  const [defectDetail, setDefectDetail] = useState<DefectDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedTestCaseId) {
      loadTestCaseDetail();
    } else if (selectedDefectId) {
      loadDefectDetail();
    } else {
      setTestCaseDetail(null);
      setDefectDetail(null);
    }
  }, [selectedTestCaseId, selectedDefectId]);

  const loadTestCaseDetail = async () => {
    if (!selectedTestCaseId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/testcases/${selectedTestCaseId}`);
      setTestCaseDetail(response.data as TestCaseDetail);
      setDefectDetail(null);
    } catch (err) {
      setError('테스트케이스 상세 정보를 불러올 수 없습니다.');
      console.error('Failed to load test case detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDefectDetail = async () => {
    if (!selectedDefectId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/defects/${selectedDefectId}`);
      setDefectDetail(response.data as DefectDetail);
      setTestCaseDetail(null);
    } catch (err) {
      setError('결함 상세 정보를 불러올 수 없습니다.');
      console.error('Failed to load defect detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string, type: 'testcase' | 'defect') => {
    if (type === 'testcase') {
      switch (status) {
        case 'Untested': return '실행 전';
        case 'Pass': return '통과';
        case 'Fail': return '실패';
        case 'Blocked': return '블록';
        case 'Defect': return '결함';
        default: return status;
      }
    } else {
      switch (status) {
        case 'Open': return '열림';
        case 'In Progress': return '진행 중';
        case 'Resolved': return '해결됨';
        case 'Closed': return '닫힘';
        default: return status;
      }
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'High': return '높음';
      case 'Medium': return '보통';
      case 'Low': return '낮음';
      default: return priority;
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'Critical': return '치명적';
      case 'High': return '높음';
      case 'Medium': return '보통';
      case 'Low': return '낮음';
      default: return severity;
    }
  };

  if (!selectedTestCaseId && !selectedDefectId) {
    return (
      <Container>
        <EmptyState>
          <h3>항목을 선택해주세요</h3>
          <p>좌측 목록에서 테스트케이스나 결함을 선택하면 상세 정보를 확인할 수 있습니다.</p>
        </EmptyState>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>상세 정보를 불러오는 중...</LoadingSpinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <EmptyState>
          <h3>오류가 발생했습니다</h3>
          <p>{error}</p>
        </EmptyState>
      </Container>
    );
  }

  if (testCaseDetail) {
    return (
      <Container>
        <Header>
          <Title>{testCaseDetail.title}</Title>
          <Subtitle>테스트케이스 상세 정보</Subtitle>
        </Header>

        <DetailCard>
          <SectionTitle>기본 정보</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>상태</InfoLabel>
              <StatusBadge status={testCaseDetail.executionStatus} type="testcase">
                {getStatusLabel(testCaseDetail.executionStatus, 'testcase')}
              </StatusBadge>
            </InfoItem>
            <InfoItem>
              <InfoLabel>우선순위</InfoLabel>
              <PriorityBadge priority={testCaseDetail.priority}>
                {getPriorityLabel(testCaseDetail.priority)}
              </PriorityBadge>
            </InfoItem>
            <InfoItem>
              <InfoLabel>생성자</InfoLabel>
              <InfoValue>{testCaseDetail.createdBy}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>생성일</InfoLabel>
              <InfoValue>{new Date(testCaseDetail.createdAt).toLocaleDateString()}</InfoValue>
            </InfoItem>
          </InfoGrid>

          {testCaseDetail.description && (
            <Description>
              <strong>설명:</strong> {testCaseDetail.description}
            </Description>
          )}

          <StepsContainer>
            <SectionTitle>테스트 스텝</SectionTitle>
            {testCaseDetail.steps.map((step, index) => (
              <StepItem key={index}>
                <StepNumber>{index + 1}.</StepNumber>
                <StepContent>{step}</StepContent>
              </StepItem>
            ))}
          </StepsContainer>

          <div>
            <SectionTitle>기대 결과</SectionTitle>
            <Description>{testCaseDetail.expected}</Description>
          </div>
        </DetailCard>

        <DetailCard>
          <SectionTitle>변경 이력</SectionTitle>
          <HistoryContainer>
            {testCaseDetail.history.map((item, index) => (
              <HistoryItem key={index}>
                <HistoryInfo>
                  <HistoryAction>{item.action}</HistoryAction>
                  <HistoryDate>{new Date(item.date).toLocaleString()}</HistoryDate>
                </HistoryInfo>
                <HistoryUser>{item.user}</HistoryUser>
              </HistoryItem>
            ))}
          </HistoryContainer>
        </DetailCard>
      </Container>
    );
  }

  if (defectDetail) {
    return (
      <Container>
        <Header>
          <Title>{defectDetail.title}</Title>
          <Subtitle>결함 상세 정보</Subtitle>
        </Header>

        <DetailCard>
          <SectionTitle>기본 정보</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>상태</InfoLabel>
              <StatusBadge status={defectDetail.status} type="defect">
                {getStatusLabel(defectDetail.status, 'defect')}
              </StatusBadge>
            </InfoItem>
            <InfoItem>
              <InfoLabel>심각도</InfoLabel>
              <SeverityBadge severity={defectDetail.severity}>
                {getSeverityLabel(defectDetail.severity)}
              </SeverityBadge>
            </InfoItem>
            <InfoItem>
              <InfoLabel>담당자</InfoLabel>
              <InfoValue>{defectDetail.assignedTo || '-'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>생성자</InfoLabel>
              <InfoValue>{defectDetail.createdBy}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>생성일</InfoLabel>
              <InfoValue>{new Date(defectDetail.createdAt).toLocaleDateString()}</InfoValue>
            </InfoItem>
          </InfoGrid>

          {defectDetail.description && (
            <Description>
              <strong>설명:</strong> {defectDetail.description}
            </Description>
          )}
        </DetailCard>

        <DetailCard>
          <SectionTitle>변경 이력</SectionTitle>
          <HistoryContainer>
            {defectDetail.history.map((item, index) => (
              <HistoryItem key={index}>
                <HistoryInfo>
                  <HistoryAction>{item.action}</HistoryAction>
                  <HistoryDate>{new Date(item.date).toLocaleString()}</HistoryDate>
                </HistoryInfo>
                <HistoryUser>{item.user}</HistoryUser>
              </HistoryItem>
            ))}
          </HistoryContainer>
        </DetailCard>
      </Container>
    );
  }

  return null;
};

export default ItemDetailView; 