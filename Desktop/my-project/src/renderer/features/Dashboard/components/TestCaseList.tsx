import React, { useState, useMemo } from 'react';
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
  releaseId: string;
  testCases: TestCase[];
  onDataChange: () => void;
}

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

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #2563eb;
  }
`;

const SearchRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  background: white;
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

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ status }) => status === 'Active' ? '#059669' : '#6b7280'};
  background: ${({ status }) => status === 'Active' ? '#f0fdf4' : '#f9fafb'};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
`;

const TestCaseList: React.FC<Props> = ({ releaseId, testCases, onDataChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredTestCases = useMemo(() => {
    return testCases.filter(testCase => {
      const matchesSearch = testCase.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = !priorityFilter || testCase.priority === priorityFilter;
      const matchesStatus = !statusFilter || testCase.status === statusFilter;
      
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [testCases, searchTerm, priorityFilter, statusFilter]);

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
      onDataChange();
    } catch (error) {
      console.error('테스트케이스 생성 실패:', error);
    }
  };

  const handleDeleteTestCase = async (id: number) => {
    try {
      await axios.delete(`/api/testcases/${id}`);
      onDataChange();
    } catch (error) {
      console.error('테스트케이스 삭제 실패:', error);
    }
  };

  return (
    <Container>
      <Header>
        <Title>테스트케이스 목록</Title>
        <ActionButton onClick={handleCreateTestCase} data-testid="create-testcase-btn">
          + 새 테스트케이스
        </ActionButton>
      </Header>

      <SearchRow>
        <SearchInput
          placeholder="테스트케이스 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-testid="testcase-search-input"
        />
        <FilterSelect
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          data-testid="priority-filter"
        >
          <option value="">모든 우선순위</option>
          <option value="High">높음</option>
          <option value="Medium">보통</option>
          <option value="Low">낮음</option>
        </FilterSelect>
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          data-testid="status-filter"
        >
          <option value="">모든 상태</option>
          <option value="Active">활성</option>
          <option value="Archived">보관</option>
        </FilterSelect>
      </SearchRow>

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