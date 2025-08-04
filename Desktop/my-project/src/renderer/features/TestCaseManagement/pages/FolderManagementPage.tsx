import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FolderTree } from '../components/FolderTree';
import { FolderTree as FolderTreeType } from '../../../../main/app/domains/folders/models/Folder';

// 간단한 API 클라이언트
const apiClient = {
  async get(url: string) {
    const response = await fetch(`http://localhost:3000${url}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },
  
  async post(url: string, data: any) {
    const response = await fetch(`http://localhost:3000${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },
  
  async put(url: string, data: any) {
    const response = await fetch(`http://localhost:3000${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },
  
  async delete(url: string) {
    const response = await fetch(`http://localhost:3000${url}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }
};

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #f9fafb;
`;

const Sidebar = styled.div`
  width: 320px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SidebarTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const AddButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 150ms ease;

  &:hover {
    background: #2563eb;
  }

  &:active {
    background: #1d4ed8;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;

const FolderDetails = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const DetailTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

const DetailValue = styled.span`
  font-size: 14px;
  color: #374151;
  font-weight: 500;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid;
  transition: all 150ms ease;

  ${props => {
    if (props.variant === 'primary') {
      return `
        background: #3b82f6;
        color: white;
        border-color: #3b82f6;
        &:hover { background: #2563eb; }
      `;
    }
    if (props.variant === 'danger') {
      return `
        background: #ef4444;
        color: white;
        border-color: #ef4444;
        &:hover { background: #dc2626; }
      `;
    }
    return `
      background: #ffffff;
      color: #374151;
      border-color: #d1d5db;
      &:hover { background: #f9fafb; }
    `;
  }}
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #6b7280;
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
`;

export const FolderManagementPage: React.FC = () => {
  const [folders, setFolders] = useState<FolderTreeType[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<FolderTreeType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 폴더 트리 로드
  const loadFolders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/folders/tree');
      setFolders(response.data);
    } catch (err) {
      setError('폴더 목록을 불러오는데 실패했습니다.');
      console.error('폴더 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 폴더 선택
  const handleFolderSelect = useCallback((folderId: number) => {
    const findFolder = (folders: FolderTreeType[]): FolderTreeType | null => {
      for (const folder of folders) {
        if (folder.id === folderId) return folder;
        if (folder.children) {
          const found = findFolder(folder.children);
          if (found) return found;
        }
      }
      return null;
    };

    const folder = findFolder(folders);
    setSelectedFolder(folder);
  }, [folders]);

  // 폴더 생성
  const handleFolderCreate = useCallback(async (parentId?: number) => {
    try {
      const newFolder = {
        name: '새 폴더',
        description: '새로 생성된 폴더',
        parentId,
        createdBy: 'system',
        isExpanded: true,
        isReadOnly: false,
        permissions: {
          read: true,
          write: true,
          delete: true,
          manage: true
        }
      };

      await apiClient.post('/folders', newFolder);
      await loadFolders();
    } catch (err) {
      setError('폴더 생성에 실패했습니다.');
      console.error('폴더 생성 실패:', err);
    }
  }, [loadFolders]);

  // 폴더 업데이트
  const handleFolderUpdate = useCallback(async (folderId: number, data: any) => {
    try {
      await apiClient.put(`/folders/${folderId}`, data);
      await loadFolders();
    } catch (err) {
      setError('폴더 업데이트에 실패했습니다.');
      console.error('폴더 업데이트 실패:', err);
    }
  }, [loadFolders]);

  // 폴더 삭제
  const handleFolderDelete = useCallback(async (folderId: number) => {
    if (!confirm('정말로 이 폴더를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await apiClient.delete(`/folders/${folderId}`);
      await loadFolders();
      setSelectedFolder(null);
    } catch (err) {
      setError('폴더 삭제에 실패했습니다.');
      console.error('폴더 삭제 실패:', err);
    }
  }, [loadFolders]);

  // 폴더 이동
  const handleFolderMove = useCallback(async (draggedId: number, targetId: number, dropType: 'before' | 'after' | 'inside') => {
    try {
      // 드롭 타입에 따라 이동 로직 처리
      let targetParentId: number | undefined;
      
      if (dropType === 'inside') {
        targetParentId = targetId;
      } else {
        // before/after의 경우 같은 부모 아래에서 순서만 변경
        const targetFolder = folders.find(f => f.id === targetId);
        targetParentId = targetFolder?.parentId;
      }

      // 이동 중 로딩 상태 표시
      setError(null);
      
      await apiClient.post(`/folders/${draggedId}/move`, {
        targetParentId,
        updatedBy: 'system'
      });

      await loadFolders();
      
      // 성공 메시지 (실제로는 토스트 알림 사용)
      console.log('폴더가 성공적으로 이동되었습니다.');
    } catch (err) {
      setError('폴더 이동에 실패했습니다.');
      console.error('폴더 이동 실패:', err);
    }
  }, [folders, loadFolders]);

  // 초기 로드
  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner>폴더를 불러오는 중...</LoadingSpinner>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Sidebar>
        <SidebarHeader>
          <SidebarTitle>폴더 관리</SidebarTitle>
          <AddButton onClick={() => handleFolderCreate()}>
            새 폴더
          </AddButton>
        </SidebarHeader>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <FolderTree
          folders={folders}
          onFolderSelect={handleFolderSelect}
          onFolderCreate={handleFolderCreate}
          onFolderUpdate={handleFolderUpdate}
          onFolderDelete={handleFolderDelete}
          onFolderMove={handleFolderMove}
        />
      </Sidebar>

      <ContentArea>
        {selectedFolder ? (
          <FolderDetails>
            <DetailTitle>{selectedFolder.name}</DetailTitle>
            
            <DetailGrid>
              <DetailItem>
                <DetailLabel>테스트케이스 수</DetailLabel>
                <DetailValue>{selectedFolder.testcaseCount}개</DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>생성일</DetailLabel>
                <DetailValue>
                  {selectedFolder.createdAt ? new Date(selectedFolder.createdAt).toLocaleDateString() : '-'}
                </DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>수정일</DetailLabel>
                <DetailValue>
                  {selectedFolder.updatedAt ? new Date(selectedFolder.updatedAt).toLocaleDateString() : '-'}
                </DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>상태</DetailLabel>
                <DetailValue>
                  {selectedFolder.isReadOnly ? '읽기 전용' : '편집 가능'}
                </DetailValue>
              </DetailItem>
            </DetailGrid>

            <ActionButtons>
              <ActionButton variant="primary" onClick={() => handleFolderCreate(selectedFolder.id)}>
                하위 폴더 추가
              </ActionButton>
              <ActionButton onClick={() => handleFolderUpdate(selectedFolder.id, { isExpanded: !selectedFolder.isExpanded })}>
                {selectedFolder.isExpanded ? '축소' : '확장'}
              </ActionButton>
              <ActionButton variant="danger" onClick={() => handleFolderDelete(selectedFolder.id)}>
                삭제
              </ActionButton>
            </ActionButtons>
          </FolderDetails>
        ) : (
          <FolderDetails>
            <DetailTitle>폴더를 선택하세요</DetailTitle>
            <p>왼쪽에서 폴더를 선택하면 상세 정보를 확인할 수 있습니다.</p>
          </FolderDetails>
        )}
      </ContentArea>
    </PageContainer>
  );
}; 