import React, { useState } from 'react';
import styled from 'styled-components';
import Icon from '../../../shared/components/Icon';

// 스타일 컴포넌트
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0;
`;

const AddButton = styled.button`
  padding: 8px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background-color 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
`;

const Th = styled.th`
  background: #f9fafb;
  padding: 12px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 13px;
  vertical-align: middle;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'passed': return '#d1fae5';
      case 'failed': return '#fee2e2';
      case 'not-executed': return '#f3f4f6';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'passed': return '#065f46';
      case 'failed': return '#991b1b';
      case 'not-executed': return '#6b7280';
      default: return '#6b7280';
    }
  }};
`;

const ActionButton = styled.button<{ variant: 'primary' | 'secondary' | 'danger' }>`
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  margin-right: 4px;
  background: ${props => {
    switch (props.variant) {
      case 'primary': return '#3b82f6';
      case 'secondary': return '#6b7280';
      case 'danger': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  color: white;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
  font-size: 14px;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
  font-size: 14px;
`;

interface TestCase {
  id: number;
  title: string;
  status: 'passed' | 'failed' | 'not-executed';
  assignee: string;
  lastExecuted?: string;
}

interface TestCaseManagementProps {
  releaseId: number;
  testCases: TestCase[];
  loading: boolean;
  onTestCaseStatusChange: (testCaseId: number, newStatus: string) => void;
}

const getStatusText = (status: string): string => {
  switch (status) {
    case 'passed': return '통과';
    case 'failed': return '실패';
    case 'not-executed': return '미실행';
    default: return '알 수 없음';
  }
};

const getStatusIcon = (status: string): string => {
  switch (status) {
    case 'passed': return '✅';
    case 'failed': return '❌';
    case 'not-executed': return '⏸️';
    default: return '❓';
  }
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const TestCaseManagement: React.FC<TestCaseManagementProps> = ({
  releaseId,
  testCases,
  loading,
  onTestCaseStatusChange
}) => {
  const [selectedTestCase, setSelectedTestCase] = useState<number | null>(null);

  const handleStatusChange = (testCaseId: number, newStatus: string) => {
    onTestCaseStatusChange(testCaseId, newStatus);
  };

  const handleExecute = (testCaseId: number) => {
    // 테스트 실행 로직 (실제로는 테스트 실행 페이지로 이동하거나 모달을 띄움)
    console.log(`테스트 케이스 ${testCaseId} 실행`);
  };

  if (loading) {
    return <LoadingState>테스트 케이스 로딩 중...</LoadingState>;
  }

  return (
    <Container>
      <Header>
        <Title>테스트 케이스 목록 ({testCases.length}개)</Title>
        <AddButton>
          <Icon name="plus" size={12} />
          테스트 케이스 추가
        </AddButton>
      </Header>

      {testCases.length === 0 ? (
        <EmptyState>
          <div>이 릴리즈에 포함된 테스트 케이스가 없습니다.</div>
          <div style={{ marginTop: '8px', fontSize: '12px' }}>
            테스트 케이스를 추가해보세요.
          </div>
        </EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>테스트 케이스명</Th>
              <Th>담당자</Th>
              <Th>상태</Th>
              <Th>마지막 실행일</Th>
              <Th>작업</Th>
            </tr>
          </thead>
          <tbody>
            {testCases.map((testCase) => (
              <tr key={testCase.id}>
                <Td>TC-{testCase.id.toString().padStart(3, '0')}</Td>
                <Td>{testCase.title}</Td>
                <Td>{testCase.assignee}</Td>
                <Td>
                  <StatusBadge status={testCase.status}>
                    {getStatusIcon(testCase.status)} {getStatusText(testCase.status)}
                  </StatusBadge>
                </Td>
                <Td>
                  {testCase.lastExecuted ? formatDate(testCase.lastExecuted) : '-'}
                </Td>
                <Td>
                  <ActionButton
                    variant="primary"
                    onClick={() => handleExecute(testCase.id)}
                  >
                    실행
                  </ActionButton>
                  <ActionButton
                    variant="secondary"
                    onClick={() => handleStatusChange(testCase.id, 'passed')}
                  >
                    통과
                  </ActionButton>
                  <ActionButton
                    variant="danger"
                    onClick={() => handleStatusChange(testCase.id, 'failed')}
                  >
                    실패
                  </ActionButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default TestCaseManagement; 