import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FolderTree } from '../../../types/folder';
import FolderTreePanel from './components/FolderTreePanel';
import TestCaseList from './components/TestCaseList';
import Toolbar from './components/Toolbar';
import TestCaseCreateModal from './components/TestCaseCreateModal';
import TestCaseDetailPanel from './components/TestCaseDetailPanel';

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #ffffff;
`;

const TreePanel = styled.div<{ isCollapsed: boolean; width: number }>`
  width: ${props => props.isCollapsed ? '50px' : `${props.width}px`};
  border-right: 1px solid #e5e7eb;
  background: #f9fafb;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: ${props => props.isCollapsed ? 'width 0.3s ease' : 'none'};
  position: relative;
`;

const ContentPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  min-width: 0;
`;

const ListPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
`;

const ResizeHandle = styled.div`
  width: 4px;
  background: transparent;
  cursor: col-resize;
  position: absolute;
  right: -2px;
  top: 0;
  bottom: 0;
  z-index: 10;
  transition: background-color 0.2s;

  &:hover {
    background: #3b82f6;
  }

  &:active {
    background: #2563eb;
  }
`;

const TestManagementV2Page: React.FC = () => {
  const [folders, setFolders] = useState<FolderTree[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<FolderTree | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTreeCollapsed, setIsTreeCollapsed] = useState(false);
  const [treeWidth, setTreeWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [testCases, setTestCases] = useState<any[]>([]);
  const [selectedTestCase, setSelectedTestCase] = useState<any>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [detailPanelWidth, setDetailPanelWidth] = useState(400); // 상세 패널 기본 너비

  useEffect(() => {
    loadFolderTree();
  }, []);

  const loadFolderTree = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/folders/tree?projectId=1');
      if (!response.ok) {
        throw new Error('폴더 트리를 불러올 수 없습니다.');
      }
      const data = await response.json();
      setFolders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleFolderSelect = (folder: FolderTree) => {
    console.log('📁 폴더 선택됨:', folder.name, 'ID:', folder.id);
    setSelectedFolder(folder);
    // 폴더 변경 시 테스트케이스 선택 해제 및 상세 패널 닫기
    setSelectedTestCase(null);
    setIsDetailPanelOpen(false);
  };

  const handleCreateTestCase = (testCaseData: any) => {
    console.log('새 테스트케이스 생성:', testCaseData);
    
    // 새 테스트케이스 객체 생성
    const newTestCase = {
      id: Date.now(), // 임시 ID 생성
      title: testCaseData.title,
      description: testCaseData.description,
      priority: testCaseData.priority,
      type: testCaseData.type,
      status: testCaseData.status,
      preconditions: testCaseData.preconditions,
      steps: testCaseData.steps.filter((step: string) => step.trim() !== ''), // 빈 단계 제거
      expectedResult: testCaseData.expectedResult,
      createdBy: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      folderId: selectedFolder?.id
    };
    
    // 테스트케이스 목록에 추가
    setTestCases(prev => [...prev, newTestCase]);
    
    // TODO: API 호출하여 테스트케이스 저장
    console.log('테스트케이스가 목록에 추가되었습니다:', newTestCase);
  };

  const handleTestCaseSelect = (testCase: any) => {
    console.log('테스트케이스 선택됨:', testCase.title);
    setSelectedTestCase(testCase);
    setIsDetailPanelOpen(true);
  };

  const handleTestCaseUpdate = (updatedTestCase: any) => {
    console.log('테스트케이스 업데이트:', updatedTestCase);
    
    // 테스트케이스 목록에서 해당 항목 업데이트
    setTestCases(prev => prev.map(tc => 
      tc.id === updatedTestCase.id ? updatedTestCase : tc
    ));
    
    // 선택된 테스트케이스도 업데이트
    setSelectedTestCase(updatedTestCase);
    
    // TODO: API 호출하여 테스트케이스 업데이트
    console.log('테스트케이스가 업데이트되었습니다:', updatedTestCase);
  };

  // 크기 조절 핸들러


    // 폴더명 중복 시 자동 번호 생성 함수
  const generateUniqueFolderName = async (baseName: string, parentId?: number): Promise<string> => {
    let name = baseName;
    let counter = 1;
    
    while (true) {
      try {
        const requestBody = {
          projectId: 1,
          parentId,
          name,
          description: ''
        };
        
        const response = await fetch('http://localhost:3001/api/folders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        
        if (response.ok) {
          return name; // 성공하면 해당 이름 반환
        }
        
        const errorData = await response.json();
        if (errorData.code === 'FOLDER_CREATE_ERROR' && errorData.error.includes('이미 존재합니다')) {
          // 중복된 이름이면 번호를 붙여서 다시 시도
          name = `${baseName}${counter}`;
          counter++;
        } else {
          // 다른 오류면 그대로 던지기
          throw new Error(`폴더 생성에 실패했습니다. (${response.status}: ${errorData.error})`);
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('이미 존재합니다')) {
          // 중복된 이름이면 번호를 붙여서 다시 시도
          name = `${baseName}${counter}`;
          counter++;
        } else {
          throw error;
        }
      }
    }
  };

  // 폴더 트리에 새 폴더를 추가하는 함수
  const addFolderToTree = (newFolder: any, parentId?: number) => {
    setFolders(prevFolders => {
      const updateFolderList = (folders: FolderTree[]): FolderTree[] => {
        return folders.map(folder => {
          if (parentId === undefined && folder.parentId === null) {
            // 최상위 레벨에 추가
            return {
              ...folder,
              children: [...folder.children, newFolder]
            };
          } else if (folder.id === parentId) {
            // 특정 부모 폴더에 추가
            return {
              ...folder,
              children: [...folder.children, newFolder]
            };
          } else if (folder.children.length > 0) {
            // 하위 폴더들에서 재귀적으로 찾기
            return {
              ...folder,
              children: updateFolderList(folder.children)
            };
          }
          return folder;
        });
      };
      
      return updateFolderList(prevFolders);
    });
  };

  const handleCreateFolder = async (parentId?: number) => {
    console.log('🚀 handleCreateFolder 호출됨, parentId:', parentId);
    try {
      // 중복 시 자동으로 번호를 붙여서 생성
      const folderName = await generateUniqueFolderName('새 폴더', parentId);
      console.log('✅ 생성된 폴더명:', folderName);
      
      // 새로 생성된 폴더 정보를 가져오기
      const response = await fetch(`http://localhost:3001/api/folders/tree?projectId=1`);
      if (response.ok) {
        const allFolders = await response.json();
        
        // 새로 생성된 폴더 찾기
        const findNewFolder = (folders: FolderTree[]): FolderTree | null => {
          for (const folder of folders) {
            if (folder.name === folderName && folder.parentId === parentId) {
              return folder;
            }
            if (folder.children.length > 0) {
              const found = findNewFolder(folder.children);
              if (found) return found;
            }
          }
          return null;
        };
        
        const newFolder = findNewFolder(allFolders);
        if (newFolder) {
          // 새 폴더를 기존 트리에 추가 (확장 상태 유지)
          addFolderToTree(newFolder, parentId);
        } else {
          // 폴더를 찾지 못한 경우 전체 새로고침
          await loadFolderTree();
        }
      } else {
        // API 호출 실패 시 전체 새로고침
        await loadFolderTree();
      }
    } catch (error) {
      console.error('폴더 생성 오류:', error);
      // 사용자에게 오류 메시지 표시 (필요시)
    }
  };

  const handleFolderMove = async (folderId: number, targetParentId: number | null, orderIndex: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/folders/${folderId}/move`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetParentId,
          orderIndex
        }),
      });

      if (!response.ok) {
        throw new Error('폴더 이동에 실패했습니다.');
      }

      // 폴더 이동은 구조가 변경되므로 전체 새로고침이 필요
      await loadFolderTree();
    } catch (err) {
      console.error('폴더 이동 오류:', err);
    }
  };

  // 폴더 이름 변경
  const handleFolderRename = async (folderId: number, newName: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/folders/${folderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName
        }),
      });

      if (!response.ok) {
        throw new Error('폴더 이름 변경에 실패했습니다.');
      }

      // 폴더 이름 변경 후 트리 업데이트
      await loadFolderTree();
    } catch (err) {
      console.error('폴더 이름 변경 오류:', err);
    }
  };

  // 폴더 삭제
  const handleFolderDelete = async (folderId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/folders/${folderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('폴더 삭제에 실패했습니다.');
      }

      // 삭제된 폴더가 현재 선택된 폴더인 경우 선택 해제
      if (selectedFolder?.id === folderId) {
        setSelectedFolder(null);
      }

      // 폴더 삭제 후 트리 업데이트
      await loadFolderTree();
    } catch (err) {
      console.error('폴더 삭제 오류:', err);
    }
  };

  const handleTreeCollapse = (collapsed: boolean) => {
    setIsTreeCollapsed(collapsed);
  };

  // 상세 패널 크기 조절용 핸들러
  const handleDetailPanelResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleDetailPanelResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const container = document.querySelector('.content-panel') as HTMLElement;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const newWidth = containerRect.right - e.clientX;
    
    // 최소/최대 너비 제한
    const minWidth = 300;
    const maxWidth = containerRect.width * 0.7; // 전체 너비의 70%까지
    
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setDetailPanelWidth(newWidth);
    }
  }, [isResizing]);

  const handleDetailPanelResizeEnd = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // 상세 패널 크기 조절 이벤트 리스너
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleDetailPanelResizeMove);
      document.addEventListener('mouseup', handleDetailPanelResizeEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleDetailPanelResizeMove);
        document.removeEventListener('mouseup', handleDetailPanelResizeEnd);
      };
    }
  }, [isResizing, handleDetailPanelResizeMove, handleDetailPanelResizeEnd]);

  // 폴더 트리 크기 조절용 핸들러 (기존)
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const container = document.querySelector('[data-testid="test-management-container"]') as HTMLElement;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const newWidth = e.clientX - containerRect.left;
    
    // 최소/최대 너비 제한
    const minWidth = 200;
    const maxWidth = Math.min(600, containerRect.width * 0.6);
    
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setTreeWidth(newWidth);
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing]);

  if (loading) {
    return (
      <Container>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <div>폴더 트리를 불러오는 중...</div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', color: 'red' }}>
          <div>오류: {error}</div>
        </div>
      </Container>
    );
  }

  return (
    <Container data-testid="test-management-container">
      <TreePanel isCollapsed={isTreeCollapsed} width={treeWidth}>
        <FolderTreePanel
          folders={folders}
          selectedFolder={selectedFolder}
          onFolderSelect={handleFolderSelect}
          onCreateFolder={handleCreateFolder}
          onFolderMove={handleFolderMove}
          onRename={handleFolderRename}
          onDelete={handleFolderDelete}
          onCollapse={handleTreeCollapse}
        />
        {!isTreeCollapsed && (
          <ResizeHandle
            onMouseDown={handleResizeStart}
            title="폴더 패널 크기 조정"
          />
        )}
      </TreePanel>
      <ContentPanel className="content-panel">
        <ListPanel>
          <Toolbar
            selectedFolder={selectedFolder}
            onCreateTestCase={() => setIsCreateModalOpen(true)}
          />
          <TestCaseList
            selectedFolder={selectedFolder}
            testCases={testCases}
            selectedTestCase={selectedTestCase}
            onCreateTestCase={() => setIsCreateModalOpen(true)}
            onTestCaseSelect={handleTestCaseSelect}
          />
        </ListPanel>
        
        <TestCaseDetailPanel
          testCase={selectedTestCase}
          isOpen={isDetailPanelOpen}
          onClose={() => setIsDetailPanelOpen(false)}
          width={detailPanelWidth}
          onResizeStart={handleDetailPanelResizeStart}
          onUpdate={handleTestCaseUpdate}
        />
      </ContentPanel>
      
      <TestCaseCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTestCase}
        selectedFolderId={selectedFolder?.id}
      />
    </Container>
  );
};

export default TestManagementV2Page;
