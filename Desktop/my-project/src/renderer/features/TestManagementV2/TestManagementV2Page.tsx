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
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
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
  border-top: 1px solid #e5e7eb;
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
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [testCases, setTestCases] = useState<any[]>([]);
  const [selectedTestCase, setSelectedTestCase] = useState<any>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [detailPanelWidth, setDetailPanelWidth] = useState(400); // 상세 패널 기본 너비
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set()); // 폴더 확장 상태 관리

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

  const generateUniqueFolderName = (parentId?: number): string => {
    const baseName = '새폴더';
    const existingFolders = getAllFoldersInParent(folders, parentId);
    
    // 같은 부모 폴더 내에서 "새폴더"로 시작하는 폴더들 찾기
    const newFolders = existingFolders.filter(folder => 
      folder.name.startsWith(baseName)
    );
    
    if (newFolders.length === 0) {
      return baseName;
    }
    
    // 번호 추출 및 최대값 찾기
    const numbers = newFolders.map(folder => {
      const match = folder.name.match(new RegExp(`^${baseName}(\\d+)$`));
      return match ? parseInt(match[1]) : 0;
    });
    
    const maxNumber = Math.max(...numbers, 0);
    return `${baseName}${maxNumber + 1}`;
  };

  const getAllFoldersInParent = (folders: FolderTree[], parentId?: number): FolderTree[] => {
    const result: FolderTree[] = [];
    
    const traverse = (folderList: FolderTree[]) => {
      for (const folder of folderList) {
        if (folder.parentId === parentId) {
          result.push(folder);
        }
        if (folder.children && folder.children.length > 0) {
          traverse(folder.children);
        }
      }
    };
    
    traverse(folders);
    return result;
  };

  const handleCreateFolder = async (parentId?: number) => {
    try {
      const folderName = generateUniqueFolderName(parentId);
      console.log('📁 생성할 폴더 이름:', folderName, '부모 ID:', parentId);

      const response = await fetch('http://localhost:3001/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: folderName,
          parentId: parentId || null,
          projectId: 1
        }),
      });

      if (!response.ok) {
        throw new Error('폴더 생성에 실패했습니다.');
      }

      const newFolder = await response.json();
      console.log('📁 새 폴더 생성됨:', newFolder);

      // 부모 폴더가 있으면 확장 상태에 추가
      if (parentId) {
        console.log('📁 부모 폴더 확장 상태 추가:', parentId);
        setExpandedFolders(prev => {
          const newSet = new Set(prev);
          newSet.add(parentId);
          console.log('📁 확장된 폴더 목록 (상위 컴포넌트):', Array.from(newSet));
          return newSet;
        });
      }

      // 폴더 목록 새로고침
      await loadFolderTree();

      // 새로 생성된 폴더를 선택
      setSelectedFolder(newFolder);
    } catch (error) {
      console.error('폴더 생성 오류:', error);
      alert('폴더 생성에 실패했습니다. 다시 시도해 주세요.');
    }
  };



  const handleFolderSelect = (folder: FolderTree) => {
    console.log('📁 폴더 선택됨:', folder.name, 'ID:', folder.id);
    setSelectedFolder(folder);
    // 폴더 변경 시 테스트케이스 선택 해제 및 상세 패널 닫기
    setSelectedTestCase(null);
    setIsDetailPanelOpen(false);
  };





  const handleRename = async (folderId: number, newName: string) => {
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

      await loadFolderTree();
    } catch (error) {
      console.error('폴더 이름 변경 오류:', error);
      alert('폴더 이름 변경에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleDelete = async (folderId: number) => {
    if (!confirm('정말로 이 폴더를 삭제하시겠습니까? 하위 폴더와 테스트 케이스도 함께 삭제됩니다.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/folders/${folderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('폴더 삭제에 실패했습니다.');
      }

      await loadFolderTree();
      
      // 삭제된 폴더가 현재 선택된 폴더였다면 선택 해제
      if (selectedFolder?.id === folderId) {
        setSelectedFolder(null);
      }
    } catch (error) {
      console.error('폴더 삭제 오류:', error);
      alert('폴더 삭제에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleCreateTestCase = (testCaseData: any) => {
    console.log('새 테스트케이스 생성:', testCaseData);
    
    // 테스트케이스 ID 자동 생성 (TC-001, TC-002 형식)
    const generateTestCaseId = () => {
      const existingIds = testCases.map(tc => {
        const match = tc.id?.toString().match(/^TC-(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      });
      const maxId = Math.max(0, ...existingIds);
      return `TC-${String(maxId + 1).padStart(3, '0')}`;
    };
    
    // 새 테스트케이스 객체 생성
    const newTestCase = {
      id: generateTestCaseId(), // 자동 생성된 ID
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

  const handleMoveToFolder = (testCaseId: string, targetFolderId: string) => {
    console.log('🔄 handleMoveToFolder 호출됨:', { testCaseId, targetFolderId });
    
    // 테스트케이스 목록 업데이트
    setTestCases(prev => {
      const updated = prev.map(tc => 
        tc.id === testCaseId 
          ? { ...tc, folderId: targetFolderId }
          : tc
      );
      console.log('📝 테스트케이스 목록 업데이트됨:', updated);
      return updated;
    });
    
    // 선택된 테스트케이스가 이동된 경우 해당 폴더로 이동
    if (selectedTestCase?.id === testCaseId) {
      console.log('🎯 선택된 테스트케이스가 이동됨, 폴더 찾는 중...');
      
      // 이동된 폴더 찾기
      const findFolderById = (folders: FolderTree[], id: string): FolderTree | null => {
        for (const folder of folders) {
          if (folder.id.toString() === id) {
            return folder;
          }
          if (folder.children.length > 0) {
            const found = findFolderById(folder.children, id);
            if (found) return found;
          }
        }
        return null;
      };
      
      const targetFolder = findFolderById(folders, targetFolderId);
      console.log('🔍 찾은 대상 폴더:', targetFolder);
      
      if (targetFolder) {
        // 해당 폴더로 이동
        console.log('📁 폴더 이동 중:', targetFolder.name);
        setSelectedFolder(targetFolder);
        
        // 선택된 테스트케이스도 업데이트
        setSelectedTestCase(prev => prev ? { ...prev, folderId: targetFolderId } : null);
        
        console.log('✅ 테스트케이스가 이동된 폴더로 이동 완료:', targetFolder.name);
      } else {
        console.error('❌ 대상 폴더를 찾을 수 없음:', targetFolderId);
      }
    }
    
    // TODO: API 호출하여 테스트케이스 폴더 이동
    console.log('테스트케이스가 폴더로 이동되었습니다:', { testCaseId, targetFolderId });
  };

  // 폴더 트리를 계층 구조를 유지하면서 평면화하는 함수
  const flattenFolderTree = (folders: FolderTree[]): any[] => {
    const result: any[] = [];
    
    const flatten = (folderList: FolderTree[], level: number = 0) => {
      folderList.forEach(folder => {
        result.push({
          id: folder.id.toString(),
          name: folder.name,
          parentId: folder.parentId?.toString(),
          level: level
        });
        
        if (folder.children && folder.children.length > 0) {
          flatten(folder.children, level + 1);
        }
      });
    };
    
    flatten(folders);
    return result;
  };

  // 크기 조절 핸들러


    // 폴더명 중복 시 자동 번호 생성 함수




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
          expandedFolders={expandedFolders}
          setExpandedFolders={setExpandedFolders}
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
          onMoveToFolder={handleMoveToFolder}
          folders={flattenFolderTree(folders)}
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
