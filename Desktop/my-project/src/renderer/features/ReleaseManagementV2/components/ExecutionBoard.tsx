import React, { useState } from 'react';
import styled from 'styled-components';

// 타입 정의
interface TestCase {
  id: string;
  name: string;
  description: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  status: 'Not Run' | 'In Progress' | 'Blocked' | 'Failed' | 'Passed' | 'Skipped';
  assignee?: string;
  estimatedTime?: number;
  actualTime?: number;
  lastUpdated: string;
  tags: string[];
}

interface ExecutionBoardProps {
  testCases: TestCase[];
  onTestCaseUpdate: (testCaseId: string, updates: Partial<TestCase>) => void;
}

// 스타일 컴포넌트
const BoardContainer = styled.div`
  display: flex;
  gap: 16px;
  height: calc(100vh - 200px);
  overflow-x: auto;
  padding: 16px;
`;

const Column = styled.div`
  min-width: 300px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
`;

const ColumnHeader = styled.div<{ status: string }>`
  padding: 16px;
  background: ${props => {
    switch (props.status) {
      case 'Not Run': return '#f3f4f6';
      case 'In Progress': return '#dbeafe';
      case 'Blocked': return '#fef3c7';
      case 'Failed': return '#fee2e2';
      case 'Passed': return '#d1fae5';
      case 'Skipped': return '#f3e8ff';
      default: return '#f3f4f6';
    }
  }};
  border-bottom: 1px solid #e5e7eb;
  border-radius: 8px 8px 0 0;
`;

const ColumnTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ColumnCount = styled.span`
  background: rgba(0, 0, 0, 0.1);
  color: #374151;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const ColumnContent = styled.div`
  flex: 1;
  padding: 8px;
  overflow-y: auto;
`;

const TestCaseCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

const TestCaseTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
  line-height: 1.4;
`;

const TestCaseDescription = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TestCaseMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: #9ca3af;
`;

const PriorityBadge = styled.span<{ priority: string }>`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  background: ${props => {
    switch (props.priority) {
      case 'P0': return '#fee2e2';
      case 'P1': return '#fef3c7';
      case 'P2': return '#dbeafe';
      case 'P3': return '#f3f4f6';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.priority) {
      case 'P0': return '#dc2626';
      case 'P1': return '#d97706';
      case 'P2': return '#2563eb';
      case 'P3': return '#6b7280';
      default: return '#6b7280';
    }
  }};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
`;

const Tag = styled.span`
  background: #eff6ff;
  color: #1e40af;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
`;

const EmptyColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: #9ca3af;
  font-size: 14px;
  font-style: italic;
`;

const ExecutionBoard: React.FC<ExecutionBoardProps> = ({
  testCases,
  onTestCaseUpdate
}) => {
  const columns = [
    { id: 'Not Run', title: 'Not Run', color: '#6b7280' },
    { id: 'In Progress', title: 'In Progress', color: '#3b82f6' },
    { id: 'Blocked', title: 'Blocked', color: '#f59e0b' },
    { id: 'Failed', title: 'Failed', color: '#ef4444' },
    { id: 'Passed', title: 'Passed', color: '#10b981' },
    { id: 'Skipped', title: 'Skipped', color: '#8b5cf6' }
  ];

  const getTestCasesByStatus = (status: string) => {
    return testCases.filter(testCase => testCase.status === status);
  };

  const handleTestCaseClick = (testCase: TestCase) => {
    // TODO: 테스트 케이스 상세 모달 또는 패널 열기
    console.log('테스트 케이스 클릭:', testCase);
  };

  const handleDragStart = (e: React.DragEvent, testCase: TestCase) => {
    e.dataTransfer.setData('testCaseId', testCase.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const testCaseId = e.dataTransfer.getData('testCaseId');
    onTestCaseUpdate(testCaseId, { status: targetStatus as TestCase['status'] });
  };

  return (
    <BoardContainer>
      {columns.map((column) => {
        const columnTestCases = getTestCasesByStatus(column.id);
        
        return (
          <Column key={column.id}>
            <ColumnHeader status={column.id}>
              <ColumnTitle>
                {column.title}
                <ColumnCount>{columnTestCases.length}</ColumnCount>
              </ColumnTitle>
            </ColumnHeader>
            <ColumnContent
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {columnTestCases.length === 0 ? (
                <EmptyColumn>테스트 케이스 없음</EmptyColumn>
              ) : (
                columnTestCases.map((testCase) => (
                  <TestCaseCard
                    key={testCase.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, testCase)}
                    onClick={() => handleTestCaseClick(testCase)}
                  >
                    <TestCaseTitle>{testCase.name}</TestCaseTitle>
                    <TestCaseDescription>{testCase.description}</TestCaseDescription>
                    
                    <TestCaseMeta>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PriorityBadge priority={testCase.priority}>
                          {testCase.priority}
                        </PriorityBadge>
                        {testCase.assignee && (
                          <span>👤 {testCase.assignee}</span>
                        )}
                      </div>
                      <span>
                        {new Date(testCase.lastUpdated).toLocaleDateString()}
                      </span>
                    </TestCaseMeta>

                    {testCase.tags.length > 0 && (
                      <TagsContainer>
                        {testCase.tags.slice(0, 2).map((tag, index) => (
                          <Tag key={index}>{tag}</Tag>
                        ))}
                        {testCase.tags.length > 2 && (
                          <Tag>+{testCase.tags.length - 2}</Tag>
                        )}
                      </TagsContainer>
                    )}
                  </TestCaseCard>
                ))
              )}
            </ColumnContent>
          </Column>
        );
      })}
    </BoardContainer>
  );
};

export default ExecutionBoard;
