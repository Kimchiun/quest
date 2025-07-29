import React, { useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setSelectedTestCaseId, setSelectedDefectId, TestCase, Defect } from '../../../store/dashboardLayoutSlice';
import FilterBar from './FilterBar';

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

const ItemCount = styled.span`
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
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

const ItemRow = styled.tr<{ isSelected: boolean; type: 'testcase' | 'defect' }>`
  cursor: pointer;
  background: ${({ isSelected }) => isSelected ? '#eff6ff' : 'white'};
  border-left: 4px solid ${({ type }) => type === 'testcase' ? '#3b82f6' : '#ef4444'};

  &:hover {
    background: ${({ isSelected }) => isSelected ? '#dbeafe' : '#f8fafc'};
  }
`;

const TypeBadge = styled.span<{ type: 'testcase' | 'defect' }>`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  color: white;
  background: ${({ type }) => type === 'testcase' ? '#3b82f6' : '#ef4444'};
`;

const StatusBadge = styled.span<{ status: string; type: 'testcase' | 'defect' }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
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

const SeverityBadge = styled.span<{ severity: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
`;

interface IntegratedItem {
  id: number;
  type: 'testcase' | 'defect';
  title: string;
  status: string;
  priority?: string;
  severity?: string;
  createdBy: string;
  createdAt: string;
  originalItem: TestCase | Defect;
}

const IntegratedItemList: React.FC = () => {
  const dispatch = useDispatch();
  const selectedReleaseId = useSelector((state: RootState) => state.dashboardLayout.selectedReleaseId);
  const selectedTestCaseId = useSelector((state: RootState) => state.dashboardLayout.selectedTestCaseId);
  const selectedDefectId = useSelector((state: RootState) => state.dashboardLayout.selectedDefectId);
  const filters = useSelector((state: RootState) => state.dashboardLayout.filters);
  const releaseData = useSelector((state: RootState) => state.dashboardLayout.releaseData);

  const integratedItems = useMemo(() => {
    const items: IntegratedItem[] = [];

    // 테스트케이스 추가
    releaseData.testCases.forEach(testCase => {
      items.push({
        id: testCase.id,
        type: 'testcase',
        title: testCase.title,
        status: testCase.executionStatus,
        priority: testCase.priority,
        createdBy: testCase.createdBy,
        createdAt: testCase.createdAt,
        originalItem: testCase,
      });
    });

    // 결함 추가
    releaseData.defects.forEach(defect => {
      items.push({
        id: defect.id,
        type: 'defect',
        title: defect.title,
        status: defect.status,
        severity: defect.severity,
        createdBy: defect.createdBy,
        createdAt: defect.createdAt,
        originalItem: defect,
      });
    });

    return items;
  }, [releaseData.testCases, releaseData.defects]);

  const filteredItems = useMemo(() => {
    return integratedItems.filter(item => {
      // 키워드 검색
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        const defectDescription = item.type === 'defect' ? 
          (item.originalItem as Defect).description?.toLowerCase().includes(keyword) ?? false : false;
        const matchesKeyword = item.title.toLowerCase().includes(keyword) || defectDescription;
        if (!matchesKeyword) return false;
      }

      // 실행 상태 필터 (테스트케이스만)
      if (filters.executionStatus.length > 0 && item.type === 'testcase') {
        if (!filters.executionStatus.includes(item.status)) return false;
      }

      // 우선순위 필터 (테스트케이스만)
      if (filters.priority.length > 0 && item.type === 'testcase' && item.priority) {
        if (!filters.priority.includes(item.priority)) return false;
      }

      // 심각도 필터 (결함만)
      if (filters.severity.length > 0 && item.type === 'defect' && item.severity) {
        if (!filters.severity.includes(item.severity)) return false;
      }

      // 결함만 표시 필터
      if (filters.showOnlyDefects && item.type === 'testcase') {
        return false;
      }

      return true;
    });
  }, [integratedItems, filters]);

  const handleItemClick = useCallback((item: IntegratedItem) => {
    if (item.type === 'testcase') {
      dispatch(setSelectedTestCaseId(item.id));
      dispatch(setSelectedDefectId(null));
    } else {
      dispatch(setSelectedDefectId(item.id));
      dispatch(setSelectedTestCaseId(null));
    }
  }, [dispatch]);

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

  if (!selectedReleaseId) {
    return (
      <Container>
        <EmptyState>
          <h3>릴리즈를 선택해주세요</h3>
          <p>좌측 패널에서 릴리즈를 선택하면 테스트케이스와 결함을 확인할 수 있습니다.</p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>테스트케이스 & 결함</Title>
        <ItemCount>{filteredItems.length}개 항목</ItemCount>
      </Header>

      <FilterBar />

      {filteredItems.length === 0 ? (
        <EmptyState>
          {integratedItems.length === 0 ? '테스트케이스나 결함이 없습니다.' : '필터 조건에 맞는 항목이 없습니다.'}
        </EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>유형</Th>
              <Th>제목</Th>
              <Th>상태</Th>
              <Th>우선순위/심각도</Th>
              <Th>생성자</Th>
              <Th>생성일</Th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <ItemRow
                key={`${item.type}-${item.id}`}
                isSelected={
                  (item.type === 'testcase' && selectedTestCaseId === item.id) ||
                  (item.type === 'defect' && selectedDefectId === item.id)
                }
                type={item.type}
                onClick={() => handleItemClick(item)}
                data-testid={`item-row-${item.type}-${item.id}`}
              >
                <Td>
                  <TypeBadge type={item.type}>
                    {item.type === 'testcase' ? 'TC' : 'BUG'}
                  </TypeBadge>
                </Td>
                <Td>{item.title}</Td>
                <Td>
                  <StatusBadge status={item.status} type={item.type}>
                    {getStatusLabel(item.status, item.type)}
                  </StatusBadge>
                </Td>
                <Td>
                  {item.type === 'testcase' && item.priority ? (
                    <PriorityBadge priority={item.priority}>
                      {getPriorityLabel(item.priority)}
                    </PriorityBadge>
                  ) : item.type === 'defect' && item.severity ? (
                    <SeverityBadge severity={item.severity}>
                      {getSeverityLabel(item.severity)}
                    </SeverityBadge>
                  ) : '-'}
                </Td>
                <Td>{item.createdBy}</Td>
                <Td>{new Date(item.createdAt).toLocaleDateString()}</Td>
              </ItemRow>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default IntegratedItemList; 