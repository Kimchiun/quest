import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../store/notificationSlice';
import QaseFolderManager from './QaseFolderManager';

// Qase 기반 인터페이스
interface Folder {
  id: number;
  name: string;
  parentId: number | null;
  level: number;
  children: Folder[];
  testCases: TestCase[];
  isExpanded?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TestCase {
  id: number;
  name: string;
  folderId: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 스타일 컴포넌트들
const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #f9fafb;
`;

const Sidebar = styled.div`
  width: 300px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

const ContentArea = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 24px;
  min-height: 400px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #6b7280;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyStateTitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: #374151;
`;

const EmptyStateDescription = styled.p`
  font-size: 14px;
  margin: 0;
  color: #6b7280;
`;

const QaseTestManagementPage: React.FC = () => {
  const dispatch = useDispatch();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 폴더 목록 로드
  const loadFolders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/folders');
      if (!response.ok) {
        throw new Error('폴더 목록을 불러올 수 없습니다.');
      }
      const data = await response.json();
      setFolders(data);
    } catch (error) {
      console.error('폴더 목록 로드 실패:', error);
      dispatch(addNotification({
        type: 'error',
        message: '폴더 목록을 불러오는 데 실패했습니다.',
        title: '로드 실패'
      }));
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // 초기 로드
  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  // 폴더 선택 핸들러
  const handleFolderSelect = useCallback((folderId: number) => {
    setSelectedFolderId(folderId);
  }, []);

  // 폴더 생성 핸들러
  const handleFolderCreate = useCallback(async (parentId: number | null) => {
    try {
      const response = await fetch('http://localhost:3000/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '새 폴더', parentId })
      });

      if (!response.ok) {
        throw new Error('폴더 생성에 실패했습니다.');
      }

      const newFolder = await response.json();
      await loadFolders(); // 폴더 목록 새로고침
      
      dispatch(addNotification({
        type: 'success',
        message: '폴더가 성공적으로 생성되었습니다.',
        title: '생성 완료'
      }));
    } catch (error) {
      console.error('폴더 생성 실패:', error);
      dispatch(addNotification({
        type: 'error',
        message: '폴더 생성에 실패했습니다.',
        title: '생성 실패'
      }));
    }
  }, [dispatch, loadFolders]);

  // 폴더 이름 변경 핸들러
  const handleFolderUpdate = useCallback(async (folderId: number, newName: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/folders/${folderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      });

      if (!response.ok) {
        throw new Error('폴더 이름 변경에 실패했습니다.');
      }

      await loadFolders(); // 폴더 목록 새로고침
      
      dispatch(addNotification({
        type: 'success',
        message: '폴더 이름이 성공적으로 변경되었습니다.',
        title: '변경 완료'
      }));
    } catch (error) {
      console.error('폴더 이름 변경 실패:', error);
      dispatch(addNotification({
        type: 'error',
        message: '폴더 이름 변경에 실패했습니다.',
        title: '변경 실패'
      }));
    }
  }, [dispatch, loadFolders]);

  // 폴더 삭제 핸들러
  const handleFolderDelete = useCallback(async (folderId: number) => {
    if (!window.confirm('폴더 내 모든 폴더 및 테스트 케이스가 영구 삭제됩니다. 정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/folders/${folderId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('폴더 삭제에 실패했습니다.');
      }

      await loadFolders(); // 폴더 목록 새로고침
      
      dispatch(addNotification({
        type: 'success',
        message: '폴더가 성공적으로 삭제되었습니다.',
        title: '삭제 완료'
      }));
    } catch (error) {
      console.error('폴더 삭제 실패:', error);
      dispatch(addNotification({
        type: 'error',
        message: '폴더 삭제에 실패했습니다.',
        title: '삭제 실패'
      }));
    }
  }, [dispatch, loadFolders]);

  // 폴더 복제 핸들러
  const handleFolderDuplicate = useCallback(async (folderId: number) => {
    try {
      // 복제 로직 구현 (현재는 단순히 새 폴더 생성)
      const response = await fetch('http://localhost:3000/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '복제된 폴더', parentId: null })
      });

      if (!response.ok) {
        throw new Error('폴더 복제에 실패했습니다.');
      }

      await loadFolders(); // 폴더 목록 새로고침
      
      dispatch(addNotification({
        type: 'success',
        message: '폴더가 성공적으로 복제되었습니다.',
        title: '복제 완료'
      }));
    } catch (error) {
      console.error('폴더 복제 실패:', error);
      dispatch(addNotification({
        type: 'error',
        message: '폴더 복제에 실패했습니다.',
        title: '복제 실패'
      }));
    }
  }, [dispatch, loadFolders]);

  // 폴더 이동 핸들러
  const handleFolderMove = useCallback(async (folderId: number, newParentId: number | null) => {
    try {
      const response = await fetch(`http://localhost:3000/api/folders/${folderId}/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newParentId })
      });

      if (!response.ok) {
        throw new Error('폴더 이동에 실패했습니다.');
      }

      await loadFolders(); // 폴더 목록 새로고침
      
      dispatch(addNotification({
        type: 'success',
        message: '폴더가 성공적으로 이동되었습니다.',
        title: '이동 완료'
      }));
    } catch (error) {
      console.error('폴더 이동 실패:', error);
      dispatch(addNotification({
        type: 'error',
        message: '폴더 이동에 실패했습니다.',
        title: '이동 실패'
      }));
    }
  }, [dispatch, loadFolders]);

  // 테스트 케이스 생성 핸들러
  const handleTestCaseCreate = useCallback(async (folderId: number) => {
    try {
      const response = await fetch('http://localhost:3000/api/testcases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '새 테스트 케이스', folderId })
      });

      if (!response.ok) {
        throw new Error('테스트 케이스 생성에 실패했습니다.');
      }

      await loadFolders(); // 폴더 목록 새로고침
      
      dispatch(addNotification({
        type: 'success',
        message: '테스트 케이스가 성공적으로 생성되었습니다.',
        title: '생성 완료'
      }));
    } catch (error) {
      console.error('테스트 케이스 생성 실패:', error);
      dispatch(addNotification({
        type: 'error',
        message: '테스트 케이스 생성에 실패했습니다.',
        title: '생성 실패'
      }));
    }
  }, [dispatch, loadFolders]);

  // 테스트 케이스 이름 변경 핸들러
  const handleTestCaseUpdate = useCallback(async (testCaseId: number, newName: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/testcases/${testCaseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      });

      if (!response.ok) {
        throw new Error('테스트 케이스 이름 변경에 실패했습니다.');
      }

      await loadFolders(); // 폴더 목록 새로고침
      
      dispatch(addNotification({
        type: 'success',
        message: '테스트 케이스 이름이 성공적으로 변경되었습니다.',
        title: '변경 완료'
      }));
    } catch (error) {
      console.error('테스트 케이스 이름 변경 실패:', error);
      dispatch(addNotification({
        type: 'error',
        message: '테스트 케이스 이름 변경에 실패했습니다.',
        title: '변경 실패'
      }));
    }
  }, [dispatch, loadFolders]);

  // 테스트 케이스 삭제 핸들러
  const handleTestCaseDelete = useCallback(async (testCaseId: number) => {
    if (!window.confirm('해당 테스트 케이스가 영구 삭제됩니다. 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/testcases/${testCaseId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('테스트 케이스 삭제에 실패했습니다.');
      }

      await loadFolders(); // 폴더 목록 새로고침
      
      dispatch(addNotification({
        type: 'success',
        message: '테스트 케이스가 성공적으로 삭제되었습니다.',
        title: '삭제 완료'
      }));
    } catch (error) {
      console.error('테스트 케이스 삭제 실패:', error);
      dispatch(addNotification({
        type: 'error',
        message: '테스트 케이스 삭제에 실패했습니다.',
        title: '삭제 실패'
      }));
    }
  }, [dispatch, loadFolders]);

  // 테스트 케이스 복제 핸들러
  const handleTestCaseDuplicate = useCallback(async (testCaseId: number) => {
    try {
      // 복제 로직 구현 (현재는 단순히 새 테스트 케이스 생성)
      const response = await fetch('http://localhost:3000/api/testcases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '복제된 테스트 케이스', folderId: selectedFolderId || 1 })
      });

      if (!response.ok) {
        throw new Error('테스트 케이스 복제에 실패했습니다.');
      }

      await loadFolders(); // 폴더 목록 새로고침
      
      dispatch(addNotification({
        type: 'success',
        message: '테스트 케이스가 성공적으로 복제되었습니다.',
        title: '복제 완료'
      }));
    } catch (error) {
      console.error('테스트 케이스 복제 실패:', error);
      dispatch(addNotification({
        type: 'error',
        message: '테스트 케이스 복제에 실패했습니다.',
        title: '복제 실패'
      }));
    }
  }, [dispatch, loadFolders, selectedFolderId]);

  // 테스트 케이스 이동 핸들러
  const handleTestCaseMove = useCallback(async (testCaseId: number, newFolderId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/testcases/${testCaseId}/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newFolderId })
      });

      if (!response.ok) {
        throw new Error('테스트 케이스 이동에 실패했습니다.');
      }

      await loadFolders(); // 폴더 목록 새로고침
      
      dispatch(addNotification({
        type: 'success',
        message: '테스트 케이스가 성공적으로 이동되었습니다.',
        title: '이동 완료'
      }));
    } catch (error) {
      console.error('테스트 케이스 이동 실패:', error);
      dispatch(addNotification({
        type: 'error',
        message: '테스트 케이스 이동에 실패했습니다.',
        title: '이동 실패'
      }));
    }
  }, [dispatch, loadFolders]);

  // 폴더 접기/펼치기 핸들러
  const handleFolderToggle = useCallback(async (folderId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/folders/${folderId}/toggle`, {
        method: 'PATCH'
      });

      if (!response.ok) {
        throw new Error('폴더 상태 변경에 실패했습니다.');
      }

      await loadFolders(); // 폴더 목록 새로고침
    } catch (error) {
      console.error('폴더 상태 변경 실패:', error);
      dispatch(addNotification({
        type: 'error',
        message: '폴더 상태 변경에 실패했습니다.',
        title: '변경 실패'
      }));
    }
  }, [dispatch, loadFolders]);

  if (loading) {
    return (
      <Container>
        <Sidebar>
          <div style={{ padding: '16px', textAlign: 'center' }}>
            로딩 중...
          </div>
        </Sidebar>
        <MainContent>
          <div style={{ textAlign: 'center', padding: '48px' }}>
            로딩 중...
          </div>
        </MainContent>
      </Container>
    );
  }

  return (
    <Container>
      <Sidebar>
        <QaseFolderManager
          folders={folders}
          selectedFolderId={selectedFolderId}
          onFolderSelect={handleFolderSelect}
          onFolderCreate={handleFolderCreate}
          onFolderUpdate={handleFolderUpdate}
          onFolderDelete={handleFolderDelete}
          onFolderDuplicate={handleFolderDuplicate}
          onFolderMove={handleFolderMove}
          onTestCaseCreate={handleTestCaseCreate}
          onTestCaseUpdate={handleTestCaseUpdate}
          onTestCaseDelete={handleTestCaseDelete}
          onTestCaseDuplicate={handleTestCaseDuplicate}
          onTestCaseMove={handleTestCaseMove}
          onFolderToggle={handleFolderToggle}
        />
      </Sidebar>
      
      <MainContent>
        <Header>
          <Title>테스트 관리</Title>
          <Subtitle>폴더와 테스트 케이스를 체계적으로 관리하세요</Subtitle>
        </Header>
        
        <ContentArea>
          {selectedFolderId ? (
            <div>
              <h2>선택된 폴더: {selectedFolderId}</h2>
              <p>이 폴더의 테스트 케이스들을 관리할 수 있습니다.</p>
            </div>
          ) : (
            <EmptyState>
              <EmptyStateIcon>📁</EmptyStateIcon>
              <EmptyStateTitle>폴더를 선택하세요</EmptyStateTitle>
              <EmptyStateDescription>
                왼쪽에서 폴더를 선택하여 테스트 케이스를 관리하세요.
              </EmptyStateDescription>
            </EmptyState>
          )}
        </ContentArea>
      </MainContent>
    </Container>
  );
};

export default QaseTestManagementPage; 