import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import axios from '../../../utils/axios';

interface TestCase {
  id: number;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Archived';
  createdBy: string;
  createdAt: string;
}

interface Props {
  releaseId?: string;
  testCases?: TestCase[];
  onDataChange?: () => void;
  searchTerm?: string;
  priorityFilter?: string;
  statusFilter?: string;
  onSearchChange?: (term: string) => void;
  onPriorityFilterChange?: (priority: string) => void;
  onStatusFilterChange?: (status: string) => void;
  folderId?: number;
  searchPlaceholder?: string;
  onTestCaseSelect?: (testCase: TestCase) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  background: #f8fafc;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
`;

const PriorityBadge = styled.span<{ priority: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ priority }) => 
    priority === 'High' ? '#fef2f2' : 
    priority === 'Medium' ? '#fffbeb' : '#f0fdf4'};
  color: ${({ priority }) => 
    priority === 'High' ? '#dc2626' : 
    priority === 'Medium' ? '#d97706' : '#059669'};
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ status }) => status === 'Active' ? '#f0fdf4' : '#f9fafb'};
  color: ${({ status }) => status === 'Active' ? '#059669' : '#6b7280'};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
`;

const TestCaseList: React.FC<Props> = ({ 
  releaseId, 
  testCases: propTestCases, 
  onDataChange,
  searchTerm: propSearchTerm,
  priorityFilter: propPriorityFilter,
  statusFilter: propStatusFilter,
  onSearchChange,
  onPriorityFilterChange,
  onStatusFilterChange,
  folderId,
  searchPlaceholder,
  onTestCaseSelect
}) => {
  const [searchTerm, setSearchTerm] = useState(propSearchTerm || '');
  const [priorityFilter, setPriorityFilter] = useState(propPriorityFilter || '');
  const [statusFilter, setStatusFilter] = useState(propStatusFilter || '');
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);

  // 컴포넌트가 마운트될 때 테스트케이스 데이터를 가져옵니다
  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/testcases');
        setTestCases(response.data);
      } catch (error) {
        console.error('테스트케이스 로드 실패:', error);
        // 에러 시 빈 배열로 설정
        setTestCases([]);
      } finally {
        setLoading(false);
      }
    };

    // propTestCases가 제공되지 않은 경우에만 API 호출
    if (!propTestCases) {
      fetchTestCases();
    } else {
      setTestCases(propTestCases);
      setLoading(false);
    }
  }, [propTestCases]);

  const filteredTestCases = useMemo(() => {
    return testCases.filter(testCase => {
      const matchesSearch = testCase.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = !priorityFilter || testCase.priority === priorityFilter;
      const matchesStatus = !statusFilter || testCase.status === statusFilter;
      
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [testCases, searchTerm, priorityFilter, statusFilter]);

  // 부모 컴포넌트에서 전달받은 콜백 함수들을 사용
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange?.(value);
  };

  const handlePriorityFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPriorityFilter(value);
    onPriorityFilterChange?.(value);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatusFilter(value);
    onStatusFilterChange?.(value);
  };

  const handleCreateTestCase = async () => {
    try {
      await axios.post('/api/testcases', {
        title: '새 테스트케이스',
        priority: 'Medium',
        status: 'Active',
        createdBy: 'current-user',
        steps: ['1. 테스트 스텝'],
        expected: '예상 결과'
      });
      
      // 데이터 새로고침
      if (onDataChange) {
        onDataChange();
      } else {
        // 독립 실행 시 로컬 상태 업데이트
        const response = await axios.get('/api/testcases');
        setTestCases(response.data);
      }
    } catch (error) {
      console.error('테스트케이스 생성 실패:', error);
    }
  };

  const handleDeleteTestCase = async (id: number) => {
    try {
      await axios.delete(`/api/testcases/${id}`);
      
      // 데이터 새로고침
      if (onDataChange) {
        onDataChange();
      } else {
        // 독립 실행 시 로컬 상태 업데이트
        setTestCases(prev => prev.filter(tc => tc.id !== id));
      }
    } catch (error) {
      console.error('테스트케이스 삭제 실패:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <EmptyState>로딩 중...</EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      {filteredTestCases.length === 0 ? (
        <EmptyState>
          {testCases.length === 0 ? '테스트케이스가 없습니다.' : '검색 결과가 없습니다.'}
        </EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>제목</Th>
              <Th>우선순위</Th>
              <Th>상태</Th>
              <Th>생성자</Th>
              <Th>생성일</Th>
              <Th>작업</Th>
            </tr>
          </thead>
          <tbody>
            {filteredTestCases.map((testCase) => (
              <tr key={testCase.id} data-testid={`testcase-row-${testCase.id}`}>
                <Td>{testCase.title}</Td>
                <Td>
                  <PriorityBadge priority={testCase.priority}>
                    {testCase.priority === 'High' ? '높음' : 
                     testCase.priority === 'Medium' ? '보통' : '낮음'}
                  </PriorityBadge>
                </Td>
                <Td>
                  <StatusBadge status={testCase.status}>
                    {testCase.status === 'Active' ? '활성' : '보관'}
                  </StatusBadge>
                </Td>
                <Td>{testCase.createdBy}</Td>
                <Td>{new Date(testCase.createdAt).toLocaleDateString()}</Td>
                <Td>
                  <button
                    onClick={() => handleDeleteTestCase(testCase.id)}
                    style={{
                      padding: '4px 8px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                    data-testid={`delete-testcase-${testCase.id}`}
                  >
                    삭제
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default TestCaseList; 