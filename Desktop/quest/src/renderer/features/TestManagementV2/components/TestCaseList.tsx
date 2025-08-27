import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FolderTree } from '../../../types/folder';
import EmptyState from '../../../shared/components/EmptyState';
import AutoHeightContainer from '../../../shared/components/EmptyState/AutoHeightContainer';

const Container = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  /* 최소 높이 제거 - 자동 높이 관리 */
`;

// 기존 EmptyState 스타일 컴포넌트들 제거 - 새로운 EmptyState 컴포넌트 사용

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: 1px solid ${props => props.variant === 'primary' ? '#3b82f6' : '#d1d5db'};
  border-radius: 6px;
  background: ${props => props.variant === 'primary' ? '#3b82f6' : '#ffffff'};
  color: ${props => props.variant === 'primary' ? '#ffffff' : '#374151'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.variant === 'primary' ? '#2563eb' : '#f9fafb'};
    border-color: ${props => props.variant === 'primary' ? '#2563eb' : '#9ca3af'};
  }
`;

const ListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  background: #ffffff;
  /* 최소 높이 제거 - 자동 높이 관리 */
`;

const TestCaseItem = styled.div<{ isSelected?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: ${props => props.isSelected ? '#f8fafc' : '#ffffff'};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${props => props.isSelected ? '#f1f5f9' : '#f9fafb'};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TestCaseId = styled.div`
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  min-width: 60px;
  margin-right: 16px;
`;

const TestCaseContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const TestCaseTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
  line-height: 1.4;
`;

const TestCaseMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
`;

const PriorityBadge = styled.span<{ priority: string }>`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  background: ${props => {
    switch (props.priority) {
      case 'High': return '#fef2f2';
      case 'Medium': return '#fffbeb';
      case 'Low': return '#f0f9ff';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.priority) {
      case 'High': return '#dc2626';
      case 'Medium': return '#d97706';
      case 'Low': return '#2563eb';
      default: return '#6b7280';
    }
  }};
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'Active': return '#f0fdf4';
      case 'Inactive': return '#fef2f2';
      case 'Deprecated': return '#f3f4f6';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Active': return '#16a34a';
      case 'Inactive': return '#dc2626';
      case 'Deprecated': return '#6b7280';
      default: return '#6b7280';
    }
  }};
`;

interface TestCaseListProps {
  selectedFolder: FolderTree | null;
  testCases?: any[];
  selectedTestCase?: any;
  onCreateTestCase?: () => void;
  onTestCaseSelect?: (testCase: any) => void;
}

const TestCaseList: React.FC<TestCaseListProps> = ({ 
  selectedFolder, 
  testCases = [], 
  selectedTestCase,
  onCreateTestCase,
  onTestCaseSelect
}) => {
  console.log('🔍 TestCaseList 렌더링:', {
    selectedFolder: selectedFolder?.name,
    testCasesLength: Array.isArray(testCases) ? testCases.length : 0,
    selectedTestCase: selectedTestCase?.title
  });

  if (!selectedFolder) {
    return (
      <AutoHeightContainer hasData={false} type="list">
        <EmptyState
          icon="📁"
          title="폴더를 선택하세요"
          description="좌측의 폴더 트리에서 테스트케이스를 확인할 폴더를 선택하세요."
          size="md"
          container="card"
        />
      </AutoHeightContainer>
    );
  }

  // testCases가 배열인지 확인하고 안전하게 필터링
  const filteredTestCases = Array.isArray(testCases) 
    ? testCases.filter(tc => {
        const tcFolderId = typeof tc.folderId === 'string' ? parseInt(tc.folderId) : tc.folderId;
        const selectedFolderId = selectedFolder?.id;
        
        console.log('🔍 테스트케이스 필터링:', {
          testCaseId: tc.id,
          testCaseTitle: tc.title,
          tcFolderId,
          selectedFolderId,
          isMatch: tcFolderId === selectedFolderId
        });
        
        return tcFolderId === selectedFolderId;
      })
    : [];
  
  console.log('🔍 TestCaseList 데이터 분석:', {
    testCasesLength: Array.isArray(testCases) ? testCases.length : 0,
    filteredTestCasesLength: filteredTestCases.length,
    selectedFolderId: selectedFolder?.id,
    selectedFolderName: selectedFolder?.name
  });
  
  // 테스트케이스가 없는 경우 빈 상태 표시
  if (filteredTestCases.length === 0) {
    console.log('⚠️ TestCaseList: 빈 상태 표시됨 - 테스트케이스가 전혀 없음');
    return (
      <AutoHeightContainer hasData={false} type="list">
        <EmptyState
          icon="📝"
          title="테스트케이스가 없습니다"
          description={`"${selectedFolder.name}" 폴더에 테스트케이스가 없습니다. 새로운 테스트케이스를 생성해보세요.`}
          size="md"
          container="card"
          actions={
            <>
              <Button variant="primary" onClick={onCreateTestCase}>
                새 테스트케이스
              </Button>
              <Button>폴더 설정</Button>
            </>
          }
        />
      </AutoHeightContainer>
    );
  }

  console.log('✅ TestCaseList: 테스트케이스 목록 렌더링 시작', filteredTestCases.length, '개');
  
  return (
    <AutoHeightContainer hasData={true} type="list">
      <ListContainer>
        {filteredTestCases.map((testCase) => (
          <TestCaseItem 
            key={testCase.id}
            isSelected={selectedTestCase?.id === testCase.id}
            onClick={() => onTestCaseSelect?.(testCase)}
          >
            <TestCaseId>{testCase.id}</TestCaseId>
            <TestCaseContent>
              <TestCaseTitle>{testCase.title}</TestCaseTitle>
              <TestCaseMeta>
                <PriorityBadge priority={testCase.priority}>
                  {testCase.priority}
                </PriorityBadge>
                <StatusBadge status={testCase.status}>
                  {testCase.status}
                </StatusBadge>
                <span>작성자: {testCase.createdBy}</span>
                <span>수정일: {(() => {
                  try {
                    return new Date(testCase.updatedAt).toLocaleDateString();
                  } catch (error) {
                    return '날짜 없음';
                  }
                })()}</span>
              </TestCaseMeta>
            </TestCaseContent>
          </TestCaseItem>
        ))}
      </ListContainer>
    </AutoHeightContainer>
  );
};

export default TestCaseList;
