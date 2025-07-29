import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import axios from '../../../utils/axios';

interface Defect {
  id: number;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  description?: string;
}

interface Props {
  releaseId: string;
  defects: Defect[];
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

const SeverityBadge = styled.span<{ severity: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ severity }) => {
    switch (severity) {
      case 'Critical': return '#ffffff';
      case 'High': return '#ffffff';
      case 'Medium': return '#ffffff';
      case 'Low': return '#ffffff';
      default: return '#6b7280';
    }
  }};
  background: ${({ severity }) => {
    switch (severity) {
      case 'Critical': return '#dc2626';
      case 'High': return '#ea580c';
      case 'Medium': return '#d97706';
      case 'Low': return '#059669';
      default: return '#f9fafb';
    }
  }};
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ status }) => {
    switch (status) {
      case 'Open': return '#dc2626';
      case 'In Progress': return '#d97706';
      case 'Resolved': return '#059669';
      case 'Closed': return '#6b7280';
      default: return '#6b7280';
    }
  }};
  background: ${({ status }) => {
    switch (status) {
      case 'Open': return '#fef2f2';
      case 'In Progress': return '#fffbeb';
      case 'Resolved': return '#f0fdf4';
      case 'Closed': return '#f9fafb';
      default: return '#f9fafb';
    }
  }};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
`;

const DefectList: React.FC<Props> = ({ releaseId, defects, onDataChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredDefects = useMemo(() => {
    return defects.filter(defect => {
      const matchesSearch = defect.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (defect.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesSeverity = !severityFilter || defect.severity === severityFilter;
      const matchesStatus = !statusFilter || defect.status === statusFilter;
      
      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [defects, searchTerm, severityFilter, statusFilter]);

  const handleCreateDefect = async () => {
    try {
      await axios.post('/api/defects', {
        title: '새 결함',
        severity: 'Medium',
        status: 'Open',
        createdBy: 'current-user',
        description: '결함 설명',
        releaseId: releaseId
      });
      onDataChange();
    } catch (error) {
      console.error('결함 생성 실패:', error);
    }
  };

  const handleUpdateDefectStatus = async (id: number, newStatus: string) => {
    try {
      await axios.patch(`/api/defects/${id}`, { status: newStatus });
      onDataChange();
    } catch (error) {
      console.error('결함 상태 업데이트 실패:', error);
    }
  };

  const handleDeleteDefect = async (id: number) => {
    try {
      await axios.delete(`/api/defects/${id}`);
      onDataChange();
    } catch (error) {
      console.error('결함 삭제 실패:', error);
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Open': return '열림';
      case 'In Progress': return '진행 중';
      case 'Resolved': return '해결됨';
      case 'Closed': return '닫힘';
      default: return status;
    }
  };

  return (
    <Container>
      <Header>
        <Title>결함 목록</Title>
        <ActionButton onClick={handleCreateDefect} data-testid="create-defect-btn">
          + 새 결함
        </ActionButton>
      </Header>

      <SearchRow>
        <SearchInput
          placeholder="결함 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-testid="defect-search-input"
        />
        <FilterSelect
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          data-testid="severity-filter"
        >
          <option value="">모든 심각도</option>
          <option value="Critical">치명적</option>
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
          <option value="Open">열림</option>
          <option value="In Progress">진행 중</option>
          <option value="Resolved">해결됨</option>
          <option value="Closed">닫힘</option>
        </FilterSelect>
      </SearchRow>

      {filteredDefects.length === 0 ? (
        <EmptyState>
          {defects.length === 0 ? '결함이 없습니다.' : '검색 결과가 없습니다.'}
        </EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>제목</Th>
              <Th>심각도</Th>
              <Th>상태</Th>
              <Th>담당자</Th>
              <Th>생성자</Th>
              <Th>생성일</Th>
              <Th>작업</Th>
            </tr>
          </thead>
          <tbody>
            {filteredDefects.map((defect) => (
              <tr key={defect.id} data-testid={`defect-row-${defect.id}`}>
                <Td>{defect.title}</Td>
                <Td>
                  <SeverityBadge severity={defect.severity}>
                    {getSeverityLabel(defect.severity)}
                  </SeverityBadge>
                </Td>
                <Td>
                  <StatusBadge status={defect.status}>
                    {getStatusLabel(defect.status)}
                  </StatusBadge>
                </Td>
                <Td>{defect.assignedTo || '-'}</Td>
                <Td>{defect.createdBy}</Td>
                <Td>{new Date(defect.createdAt).toLocaleDateString()}</Td>
                <Td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <select
                      value={defect.status}
                      onChange={(e) => handleUpdateDefectStatus(defect.id, e.target.value)}
                      style={{
                        padding: '2px 4px',
                        fontSize: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px'
                      }}
                      data-testid={`status-select-${defect.id}`}
                    >
                      <option value="Open">열림</option>
                      <option value="In Progress">진행 중</option>
                      <option value="Resolved">해결됨</option>
                      <option value="Closed">닫힘</option>
                    </select>
                    <button
                      onClick={() => handleDeleteDefect(defect.id)}
                      style={{
                        padding: '2px 6px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                      data-testid={`delete-defect-${defect.id}`}
                    >
                      삭제
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default DefectList; 