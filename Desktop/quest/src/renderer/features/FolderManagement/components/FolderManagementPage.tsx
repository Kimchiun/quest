import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FolderTreeComponent from './FolderTree';
import { TestCase } from '@/main/app/domains/testcases/models/TestCase';

const Container = styled.div`
  display: flex;
  height: 100vh;
  gap: 24px;
  padding: 24px;
`;

const Sidebar = styled.div`
  width: 300px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  padding: 20px;
`;

const MainContent = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e1e5e9;
`;

const Title = styled.h2`
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
`;

const FolderInfo = styled.div`
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
`;

const FolderName = styled.h3`
  margin: 0 0 8px 0;
  color: #3b82f6;
  font-size: 18px;
  font-weight: 600;
`;

const FolderDescription = styled.p`
  margin: 0;
  color: #666;
  font-size: 14px;
`;

const FolderManagementPage: React.FC = () => {
  const [selectedFolderId, setSelectedFolderId] = useState<number | undefined>();
  const [selectedFolder, setSelectedFolder] = useState<any>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  useEffect(() => {
    if (selectedFolderId) {
      fetchFolderDetails(selectedFolderId);
      fetchTestCasesInFolder(selectedFolderId);
    }
  }, [selectedFolderId]);

  const fetchFolderDetails = async (folderId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/folders/${folderId}`);
      if (response.ok) {
        const folder = await response.json();
        setSelectedFolder(folder);
      }
    } catch (error) {
      console.error('폴더 상세 정보 조회 실패:', error);
    }
  };

  const fetchTestCasesInFolder = async (folderId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/folders/${folderId}/testcases`);
      if (response.ok) {
        const testCaseIds = await response.json();
        // 실제 테스트 케이스 데이터를 가져오는 로직
        const testCasesData = await fetchTestCasesByIds(testCaseIds);
        setTestCases(testCasesData);
      }
    } catch (error) {
      console.error('폴더 내 테스트 케이스 조회 실패:', error);
    }
  };

  const fetchTestCasesByIds = async (testCaseIds: number[]): Promise<TestCase[]> => {
    if (testCaseIds.length === 0) return [];
    
    try {
      const promises = testCaseIds.map(id => 
        fetch(`http://localhost:3000/api/testcases/${id}`).then(res => res.json())
      );
      const results = await Promise.all(promises);
      return results.filter(Boolean);
    } catch (error) {
      console.error('테스트 케이스 상세 정보 조회 실패:', error);
      return [];
    }
  };

  const handleFolderSelect = (folderId: number) => {
    setSelectedFolderId(folderId);
  };

  return (
    <Container>
      <Sidebar>
        <Header>
          <Title>폴더 구조</Title>
        </Header>
        <FolderTreeComponent
          onFolderSelect={handleFolderSelect}
          selectedFolderId={selectedFolderId}
        />
      </Sidebar>
      
      <MainContent>
        <Header>
          <Title>
            {selectedFolder ? selectedFolder.name : '폴더를 선택하세요'}
          </Title>
        </Header>
        
        {selectedFolder && (
          <FolderInfo>
            <FolderName>{selectedFolder.name}</FolderName>
            {selectedFolder.description && (
              <FolderDescription>{selectedFolder.description}</FolderDescription>
            )}
          </FolderInfo>
        )}
        
        {selectedFolderId && (
          <div>
            <h3>테스트 케이스 목록 ({testCases.length}개)</h3>
            {testCases.length > 0 ? (
              <div style={{ display: 'grid', gap: '12px' }}>
                {testCases.map(testCase => (
                  <div key={testCase.id} style={{ 
                    padding: '12px', 
                    border: '1px solid #e1e5e9', 
                    borderRadius: '8px',
                    background: '#fff'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {testCase.title}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      우선순위: {testCase.priority} | 상태: {testCase.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                이 폴더에 테스트 케이스가 없습니다.
              </div>
            )}
          </div>
        )}
        
        {!selectedFolderId && (
          <div style={{ textAlign: 'center', color: '#666', marginTop: '100px' }}>
            폴더를 선택하여 테스트 케이스를 확인하세요
          </div>
        )}
      </MainContent>
    </Container>
  );
};

export default FolderManagementPage; 