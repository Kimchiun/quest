import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import Typography from '../../../shared/components/Typography';
import Container from '../../../shared/components/Container';
import Grid from '../../../shared/components/Grid';
import FolderTreeComponent from '../components/FolderTree';
import DraggableTestCase from '../components/DraggableTestCase';

const PageContainer = styled.div`
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const PageTitle = styled(Typography)`
  color: #111827;
  margin-bottom: 8px;
`;

const PageDescription = styled(Typography)`
  color: #6b7280;
`;

const ContentGrid = styled(Grid)`
  gap: 24px;
`;

const FolderSection = styled(Container)`
  height: calc(100vh - 200px);
  overflow-y: auto;
`;

const TestCaseSection = styled(Container)`
  height: calc(100vh - 200px);
  overflow-y: auto;
`;

const TestCaseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
`;

const TestCaseCount = styled.span`
  background: #dbeafe;
  color: #1e40af;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

interface TestCase {
  id: number;
  title: string;
  status: string;
  priority: string;
  assignee?: string;
}

interface Folder {
  id: number;
  name: string;
  description?: string;
  testCaseCount: number;
}

const FolderManagementPage: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedFolder) {
      fetchTestCases(selectedFolder.id);
    }
  }, [selectedFolder]);

  const fetchTestCases = async (folderId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/folders/${folderId}/testcases`);
      if (response.ok) {
        const data = await response.json();
        setTestCases(data);
      }
    } catch (error) {
      console.error('테스트 케이스 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFolderSelect = (folderId: number) => {
    // 폴더 정보를 가져와서 selectedFolder 설정
    setSelectedFolder({
      id: folderId,
      name: `폴더 ${folderId}`,
      testCaseCount: 0
    });
  };

  const handleTestCaseMove = (dragIndex: number, hoverIndex: number) => {
    const newTestCases = [...testCases];
    const draggedItem = newTestCases[dragIndex];
    newTestCases.splice(dragIndex, 1);
    newTestCases.splice(hoverIndex, 0, draggedItem);
    setTestCases(newTestCases);
  };

  const handleTestCaseDrop = async (testCaseId: number, targetFolderId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/folders/${targetFolderId}/testcases/${testCaseId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updatedBy: 'testuser' })
      });
      
      if (response.ok) {
        // 성공적으로 이동된 경우 현재 폴더에서 제거
        setTestCases(prev => prev.filter(tc => tc.id !== testCaseId));
      }
    } catch (error) {
      console.error('테스트 케이스 이동 실패:', error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <PageContainer>
        <PageHeader>
          <PageTitle $variant="h2">폴더 관리</PageTitle>
          <PageDescription $variant="body">
            테스트 케이스를 폴더별로 관리하고 드래그 앤 드롭으로 이동할 수 있습니다.
          </PageDescription>
        </PageHeader>

        <ContentGrid $columns={2} $gap="24px">
          <FolderSection $padding="20px" $background="#ffffff" $radius="8px">
            <FolderTreeComponent
              onFolderSelect={handleFolderSelect}
              selectedFolderId={selectedFolder?.id}
            />
          </FolderSection>

          <TestCaseSection $padding="20px" $background="#ffffff" $radius="8px">
            <TestCaseHeader>
              <div>
                <Typography $variant="h4">
                  {selectedFolder ? selectedFolder.name : '폴더를 선택하세요'}
                </Typography>
                {selectedFolder && (
                  <TestCaseCount>
                    {testCases.length}개의 테스트 케이스
                  </TestCaseCount>
                )}
              </div>
            </TestCaseHeader>

            {loading ? (
              <div>로딩 중...</div>
            ) : selectedFolder ? (
              <div>
                {testCases.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                    이 폴더에는 테스트 케이스가 없습니다.
                  </div>
                ) : (
                  testCases.map((testCase, index) => (
                    <DraggableTestCase
                      key={testCase.id}
                      testCase={testCase}
                      index={index}
                      moveTestCase={handleTestCaseMove}
                      onDrop={handleTestCaseDrop}
                      currentFolderId={selectedFolder.id}
                    />
                  ))
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                왼쪽에서 폴더를 선택하여 테스트 케이스를 확인하세요.
              </div>
            )}
          </TestCaseSection>
        </ContentGrid>
      </PageContainer>
    </DndProvider>
  );
};

export default FolderManagementPage; 