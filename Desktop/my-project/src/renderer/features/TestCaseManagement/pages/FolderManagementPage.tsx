import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { FolderTree } from '../components/FolderTree';
import { FolderTree as FolderTreeType } from '../../../../main/app/domains/folders/models/Folder';

// API 클라이언트
const apiClient = {
  async get(url: string) {
    const response = await fetch(`http://localhost:3000/api${url}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },

  async post(url: string, data: any) {
    const response = await fetch(`http://localhost:3000/api${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },

  async put(url: string, data: any) {
    const response = await fetch(`http://localhost:3000/api${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },

  async delete(url: string) {
    const response = await fetch(`http://localhost:3000/api${url}`, {
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
  width: 280px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const SidebarTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
`;

const Button = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 24px;
  background: white;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 16px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
`;

const ContentHeader = styled.div`
  margin-bottom: 24px;
`;

const ContentTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
`;

const ContentDescription = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 14px;
`;

export const FolderManagementPage: React.FC = () => {
  const [folders, setFolders] = useState<FolderTreeType[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedFolderName, setSelectedFolderName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 폴더 트리 로드
  const loadFolders = useCallback(async () => {
    try {
      setError(null);
      const data = await apiClient.get('/folders/tree');
      setFolders(data);
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
    setSelectedFolderId(folderId);
    setSelectedFolderName(folder?.name || '');
  }, [folders]);

  // 폴더 생성
  const handleFolderCreate = useCallback(async (parentId?: number) => {
    try {
      // 폴더 생성 전 선택 상태 초기화
      setSelectedFolderId(null);
      setSelectedFolderName('');
      
      const newFolder = {
        name: '새 폴더',
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

      const response = await apiClient.post('/folders', newFolder);
      
      // 폴더 목록 새로고침
      await loadFolders();
      
      // 새로 생성된 폴더를 선택
      if (response && response.id) {
        setSelectedFolderId(response.id);
        setSelectedFolderName(response.name || '새 폴더');
      }
    } catch (err) {
      setError('폴더 생성에 실패했습니다.');
      console.error('폴더 생성 실패:', err);
      setSelectedFolderId(null);
      setSelectedFolderName('');
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
      setSelectedFolderId(null);
      setSelectedFolderName('');
    } catch (err) {
      setError('폴더 삭제에 실패했습니다.');
      console.error('폴더 삭제 실패:', err);
    }
  }, [loadFolders]);

  // 폴더 이동
  const handleFolderMove = useCallback(async (draggedId: number, targetId: number, dropType: 'before' | 'after' | 'inside') => {
    try {
      let targetParentId: number | undefined;
      
      if (dropType === 'inside') {
        targetParentId = targetId;
      } else {
        const targetFolder = folders.find(f => f.id === targetId);
        targetParentId = targetFolder?.parentId;
      }

      await apiClient.post(`/folders/${draggedId}/move`, {
        targetParentId,
        updatedBy: 'system'
      });

      await loadFolders();
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
        <LoadingMessage>폴더를 불러오는 중...</LoadingMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Sidebar>
        <SidebarHeader>
          <SidebarTitle>폴더 관리</SidebarTitle>
          <Button onClick={() => handleFolderCreate()}>
            새 폴더
          </Button>
        </SidebarHeader>
        
        <SidebarContent>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          {folders.length === 0 ? (
            <EmptyState>
              폴더가 없습니다. 새 폴더를 생성해보세요.
            </EmptyState>
          ) : (
            <FolderTree
              folders={folders}
              onFolderSelect={handleFolderSelect}
              onFolderCreate={handleFolderCreate}
              onFolderUpdate={handleFolderUpdate}
              onFolderDelete={handleFolderDelete}
              onFolderMove={handleFolderMove}
              selectedFolderId={selectedFolderId}
              onSelectionChange={setSelectedFolderId}
            />
          )}
        </SidebarContent>
      </Sidebar>
      
      <ContentArea>
        {selectedFolderId ? (
          <div>
            <ContentHeader>
              <ContentTitle>{selectedFolderName} - 폴더 정보</ContentTitle>
              <ContentDescription>
                선택된 폴더의 상세 정보가 여기에 표시됩니다.
              </ContentDescription>
            </ContentHeader>
            
            <div>
              <p><strong>폴더 ID:</strong> {selectedFolderId}</p>
              <p><strong>폴더명:</strong> {selectedFolderName}</p>
              <p><strong>선택 시간:</strong> {new Date().toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <div>
            <ContentHeader>
              <ContentTitle>📁 폴더를 선택하세요</ContentTitle>
              <ContentDescription>
                왼쪽에서 폴더를 선택하여 테스트 케이스를 관리하세요
              </ContentDescription>
            </ContentHeader>
            
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>📋</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '500', color: '#374151' }}>
                폴더를 선택하세요
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                왼쪽에서 폴더를 선택하면 해당 폴더의 테스트 케이스가 표시됩니다.
              </p>
            </div>
          </div>
        )}
      </ContentArea>
    </PageContainer>
  );
}; 