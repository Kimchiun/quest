import React from 'react';
import styled from 'styled-components';
import { FolderTree } from '../../../types/folder';

const Container = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 400px; /* 최소 높이 유지 */
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7280;
  text-align: center;
  padding: 40px;
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 24px;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
`;

const EmptyDescription = styled.p`
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #6b7280;
  max-width: 400px;
`;

const EmptyActions = styled.div`
  display: flex;
  gap: 12px;
`;

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
  min-height: 300px;
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
    testCasesLength: testCases.length,
    selectedTestCase: selectedTestCase?.title
  });
  // 폴더별 임시 테스트케이스 데이터
  const getMockTestCases = (folderId: number) => {
    const mockData: { [key: number]: any[] } = {
      1: [ // Login & Account
        {
          id: 'TC-001',
          title: '로그인 기능 테스트',
          priority: 'High' as const,
          status: 'Active' as const,
          type: 'Functional' as const,
          description: '사용자가 올바른 자격 증명으로 로그인할 수 있는지 확인합니다.',
          steps: [
            '1. 로그인 페이지에 접속합니다.',
            '2. 유효한 이메일 주소를 입력합니다.',
            '3. 올바른 비밀번호를 입력합니다.',
            '4. 로그인 버튼을 클릭합니다.',
            '5. 대시보드 페이지로 리디렉션되는지 확인합니다.'
          ],
          preconditions: '사용자가 등록된 계정을 가지고 있어야 합니다.',
          expectedResult: '사용자가 성공적으로 로그인되어 대시보드 페이지로 이동합니다.',
          createdBy: 'admin',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20'),
          folderId: 1
        },
        {
          id: 'TC-002',
          title: '비밀번호 재설정 테스트',
          priority: 'Medium' as const,
          status: 'Active' as const,
          type: 'Functional' as const,
          description: '사용자가 비밀번호를 재설정할 수 있는지 확인합니다.',
          steps: [
            '1. 로그인 페이지에서 "비밀번호 찾기" 링크를 클릭합니다.',
            '2. 등록된 이메일 주소를 입력합니다.',
            '3. 재설정 이메일 발송 버튼을 클릭합니다.',
            '4. 이메일로 전송된 재설정 링크를 클릭합니다.',
            '5. 새 비밀번호를 입력하고 확인합니다.',
            '6. 새 비밀번호로 로그인할 수 있는지 확인합니다.'
          ],
          preconditions: '사용자가 등록된 이메일 주소를 기억하고 있어야 합니다.',
          expectedResult: '비밀번호가 성공적으로 재설정되고 새 비밀번호로 로그인할 수 있습니다.',
          createdBy: 'admin',
          createdAt: new Date('2024-01-16'),
          updatedAt: new Date('2024-01-18'),
          folderId: 1
        },
        {
          id: 'TC-003',
          title: '회원가입 유효성 검사',
          priority: 'Low' as const,
          status: 'Inactive' as const,
          type: 'Functional' as const,
          description: '회원가입 시 입력 데이터의 유효성을 검사합니다.',
          steps: [
            '1. 회원가입 페이지에 접속합니다.',
            '2. 잘못된 이메일 형식을 입력합니다.',
            '3. 8자 미만의 비밀번호를 입력합니다.',
            '4. 회원가입 버튼을 클릭합니다.',
            '5. 적절한 오류 메시지가 표시되는지 확인합니다.'
          ],
          preconditions: '회원가입 페이지가 정상적으로 로드되어야 합니다.',
          expectedResult: '입력 오류에 대한 적절한 유효성 검사 메시지가 표시됩니다.',
          createdBy: 'admin',
          createdAt: new Date('2024-01-17'),
          updatedAt: new Date('2024-01-19'),
          folderId: 1
        }
      ],
      2: [ // User Management
        {
          id: 'TC-004',
          title: '사용자 프로필 수정',
          priority: 'High' as const,
          status: 'Active' as const,
          type: 'Functional' as const,
          description: '사용자가 자신의 프로필 정보를 수정할 수 있는지 확인합니다.',
          steps: [
            '1. 사용자 프로필 페이지에 접속합니다.',
            '2. "프로필 편집" 버튼을 클릭합니다.',
            '3. 이름을 새로운 값으로 변경합니다.',
            '4. 저장 버튼을 클릭합니다.',
            '5. 변경사항이 반영되는지 확인합니다.'
          ],
          createdBy: 'admin',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-15'),
          folderId: 2
        },
        {
          id: 'TC-005',
          title: '사용자 권한 관리',
          priority: 'High' as const,
          status: 'Active' as const,
          type: 'Functional' as const,
          description: '관리자가 사용자 권한을 변경할 수 있는지 확인합니다.',
          steps: [
            '1. 관리자 대시보드에 접속합니다.',
            '2. 사용자 관리 메뉴를 클릭합니다.',
            '3. 대상 사용자를 선택합니다.',
            '4. 권한을 "관리자"로 변경합니다.',
            '5. 변경사항을 저장합니다.',
            '6. 사용자가 관리자 권한을 갖는지 확인합니다.'
          ],
          createdBy: 'admin',
          createdAt: new Date('2024-01-12'),
          updatedAt: new Date('2024-01-16'),
          folderId: 2
        }
      ],
      3: [ // Dashboard
        {
          id: 'TC-006',
          title: '대시보드 위젯 표시',
          priority: 'Medium' as const,
          status: 'Active' as const,
          createdBy: 'admin',
          createdAt: new Date('2024-01-08'),
          updatedAt: new Date('2024-01-14'),
          folderId: 3
        },
        {
          id: 'TC-007',
          title: '차트 데이터 업데이트',
          priority: 'Low' as const,
          status: 'Active' as const,
          createdBy: 'admin',
          createdAt: new Date('2024-01-09'),
          updatedAt: new Date('2024-01-13'),
          folderId: 3
        }
      ],
      4: [ // Settings
        {
          id: 'TC-008',
          title: '시스템 설정 변경',
          priority: 'Medium' as const,
          status: 'Active' as const,
          createdBy: 'admin',
          createdAt: new Date('2024-01-05'),
          updatedAt: new Date('2024-01-11'),
          folderId: 4
        }
      ],
      5: [ // Reports
        {
          id: 'TC-009',
          title: '월간 리포트 생성',
          priority: 'High' as const,
          status: 'Active' as const,
          createdBy: 'admin',
          createdAt: new Date('2024-01-03'),
          updatedAt: new Date('2024-01-09'),
          folderId: 5
        },
        {
          id: 'TC-010',
          title: '통계 데이터 내보내기',
          priority: 'Medium' as const,
          status: 'Active' as const,
          createdBy: 'admin',
          createdAt: new Date('2024-01-04'),
          updatedAt: new Date('2024-01-10'),
          folderId: 5
        },
        {
          id: 'TC-011',
          title: 'PDF 리포트 생성',
          priority: 'Low' as const,
          status: 'Inactive' as const,
          createdBy: 'admin',
          createdAt: new Date('2024-01-06'),
          updatedAt: new Date('2024-01-12'),
          folderId: 5
        }
      ]
    };
    
    return mockData[folderId] || [];
  };

  if (!selectedFolder) {
    return (
      <Container>
        <EmptyState>
          <EmptyIcon>📁</EmptyIcon>
          <EmptyTitle>폴더를 선택하세요</EmptyTitle>
          <EmptyDescription>
            좌측의 폴더 트리에서 테스트케이스를 확인할 폴더를 선택하세요.
          </EmptyDescription>
        </EmptyState>
      </Container>
    );
  }

  // 선택된 폴더에 해당하는 테스트케이스만 필터링
  const filteredTestCases = testCases.filter(tc => {
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
  });
  
  // 실제 테스트케이스가 없으면 해당 폴더의 mock 데이터 사용
  const mockTestCases = getMockTestCases(selectedFolder.id);
  const displayTestCases = filteredTestCases.length > 0 ? filteredTestCases : mockTestCases;
  
  console.log('🔍 TestCaseList 데이터 분석:', {
    testCasesLength: testCases.length,
    filteredTestCasesLength: filteredTestCases.length,
    mockTestCasesLength: mockTestCases.length,
    displayTestCasesLength: displayTestCases.length,
    selectedFolderId: selectedFolder?.id,
    selectedFolderName: selectedFolder?.name,
    usingMockData: filteredTestCases.length === 0
  });
  
  // 실제 테스트케이스가 없고 mock 데이터도 없는 경우에만 빈 상태 표시
  if (displayTestCases.length === 0) {
    console.log('⚠️ TestCaseList: 빈 상태 표시됨 - 테스트케이스가 전혀 없음');
    return (
      <Container>
        <EmptyState>
          <EmptyIcon>📝</EmptyIcon>
          <EmptyTitle>테스트케이스가 없습니다</EmptyTitle>
          <EmptyDescription>
            "{selectedFolder.name}" 폴더에 테스트케이스가 없습니다.
            새로운 테스트케이스를 생성해보세요.
          </EmptyDescription>
          <EmptyActions>
            <Button variant="primary" onClick={onCreateTestCase}>
              새 테스트케이스
            </Button>
            <Button>폴더 설정</Button>
          </EmptyActions>
        </EmptyState>
      </Container>
    );
  }

  console.log('✅ TestCaseList: 테스트케이스 목록 렌더링 시작', displayTestCases.length, '개');
  
  return (
    <Container>
      <ListContainer>
        {displayTestCases.map((testCase) => (
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
                <span>수정일: {testCase.updatedAt.toLocaleDateString()}</span>
              </TestCaseMeta>
            </TestCaseContent>
          </TestCaseItem>
        ))}
      </ListContainer>
    </Container>
  );
};

export default TestCaseList;
