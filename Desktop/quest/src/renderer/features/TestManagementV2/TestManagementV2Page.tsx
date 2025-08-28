import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FolderTree } from '../../../types/folder';
import FolderTreePanel from './components/FolderTreePanel';
import TestCaseList from './components/TestCaseList';
import Toolbar from './components/Toolbar';
import TestCaseCreateModal from './components/TestCaseCreateModal';
import TestCaseDetailPanel from './components/TestCaseDetailPanel';
import FolderCreateModal from './components/FolderCreateModal';

// 커스텀 모달 스타일 컴포넌트
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
`;

const ModalMessage = styled.p`
  margin: 0 0 24px 0;
  color: #4b5563;
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ModalButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background: #dc2626;
    color: white;
    &:hover {
      background: #b91c1c;
    }
  ` : `
    background: #f3f4f6;
    color: #374151;
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

// 토스트 알림 스타일 컴포넌트
const Toast = styled.div<{ show: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  background: #10b981;
  color: white;
  padding: 12px 20px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  transform: translateX(${props => props.show ? '0' : '120%'});
  opacity: ${props => props.show ? '1' : '0'};
  transition: all 0.3s ease-in-out;
  font-size: 14px;
  font-weight: 500;
  pointer-events: ${props => props.show ? 'auto' : 'none'};
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #ffffff;
  overflow: hidden; /* 전체 컨테이너의 스크롤 방지 */
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
  min-height: 0; /* flex 아이템이 축소될 수 있도록 함 */
`;

const ListPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
  min-height: 0; /* flex 아이템이 축소될 수 있도록 함 */
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

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #ffffff;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  font-size: 16px;
  color: #6b7280;
  font-weight: 500;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #ffffff;
  gap: 16px;
`;

const ErrorIcon = styled.div`
  font-size: 48px;
  color: #ef4444;
`;

const ErrorText = styled.div`
  font-size: 16px;
  color: #ef4444;
  font-weight: 500;
  text-align: center;
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
  const [isFolderCreateModalOpen, setIsFolderCreateModalOpen] = useState(false);
  const [testCases, setTestCases] = useState<any[]>([]);
  const [selectedTestCase, setSelectedTestCase] = useState<any>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [detailPanelWidth, setDetailPanelWidth] = useState(400); // 상세 패널 기본 너비
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set()); // 폴더 확장 상태 관리
  
  // 커스텀 모달 및 토스트 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMultiDeleteModal, setShowMultiDeleteModal] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<FolderTree | null>(null);
  const [foldersToDelete, setFoldersToDelete] = useState<number[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadFolderTree();
    // 초기 로드 시 전체 테스트케이스 로드
    loadTestCases();
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

  const loadTestCases = async (folderId?: number) => {
    try {
      const url = folderId 
        ? `http://localhost:3001/api/testcases?folderId=${folderId}`
        : 'http://localhost:3001/api/testcases';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('테스트케이스를 불러올 수 없습니다.');
      }
      const data = await response.json();
      // 백엔드 API는 { testCases: [...], total: number } 형태로 반환하므로 testCases 배열만 추출
      const testCases = data.testCases || [];
      
      // 각 테스트케이스의 최신 실행 상태를 가져오기
      const testCasesWithExecutionStatus = await Promise.all(
        testCases.map(async (testCase: any) => {
          try {
            const executionResponse = await fetch(`http://localhost:3001/api/executions/testcase/${testCase.id}`);
            if (executionResponse.ok) {
              const executions = await executionResponse.json();
              // 가장 최근 실행 기록의 상태를 사용
              const latestExecution = executions.length > 0 
                ? executions.sort((a: any, b: any) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime())[0]
                : null;
              
              return {
                ...testCase,
                executionStatus: latestExecution ? latestExecution.status : 'Untested'
              };
            }
          } catch (error) {
            console.error(`테스트케이스 ${testCase.id} 실행 상태 로드 실패:`, error);
          }
          
          return {
            ...testCase,
            executionStatus: 'Untested'
          };
        })
      );
      
      setTestCases(testCasesWithExecutionStatus);
    } catch (error) {
      console.error('테스트케이스 로드 오류:', error);
      setTestCases([]);
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

  const handleCreateRootFolder = () => {
    setIsFolderCreateModalOpen(true);
  };

  const handleCreateRootFolderSubmit = async (folderName: string) => {
    try {
      console.log('📁 상위 폴더 생성:', folderName);

      const response = await fetch('http://localhost:3001/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: folderName,
          parentId: null, // 상위 폴더는 parentId가 null
          projectId: 1
        }),
      });

      if (!response.ok) {
        throw new Error('폴더 생성에 실패했습니다.');
      }

      const newFolder = await response.json();
      console.log('📁 새 상위 폴더 생성됨:', newFolder);

      // 폴더 목록 새로고침
      await loadFolderTree();

      // 새로 생성된 폴더를 선택
      setSelectedFolder(newFolder);
    } catch (error) {
      console.error('상위 폴더 생성 오류:', error);
      throw error; // 모달에서 에러 처리를 위해 다시 throw
    }
  };



  const handleFolderSelect = async (folder: FolderTree) => {
    console.log('📁 폴더 선택됨:', folder.name, 'ID:', folder.id);
    setSelectedFolder(folder);
    // 폴더 변경 시 테스트케이스 선택 해제 및 상세 패널 닫기
    setSelectedTestCase(null);
    setIsDetailPanelOpen(false);
    // 선택된 폴더의 테스트케이스 로드
    await loadTestCases(folder.id);
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
      setToastMessage('폴더 이름 변경에 실패했습니다. 다시 시도해 주세요.');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setToastMessage(''), 300);
      }, 3000);
    }
  };

  const handleDelete = async (folderId: number) => {
    // 삭제할 폴더 찾기
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      setFolderToDelete(folder);
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = async () => {
    if (!folderToDelete) return;

    try {
      const response = await fetch(`http://localhost:3001/api/folders/${folderToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('폴더 삭제에 실패했습니다.');
      }

      await loadFolderTree();
      
      // 삭제된 폴더가 현재 선택된 폴더였다면 선택 해제
      if (selectedFolder?.id === folderToDelete.id) {
        setSelectedFolder(null);
      }

      setShowDeleteModal(false);
      setFolderToDelete(null);
      
      // 토스트 알림 표시
      setToastMessage('폴더가 성공적으로 삭제되었습니다.');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setToastMessage(''), 300);
      }, 3000);
    } catch (error) {
      console.error('폴더 삭제 오류:', error);
      setToastMessage('폴더 삭제에 실패했습니다. 다시 시도해 주세요.');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setToastMessage(''), 300);
      }, 3000);
    }
  };

  const handleMultiDelete = async (folderIds: number[]) => {
    setFoldersToDelete(folderIds);
    setShowMultiDeleteModal(true);
  };

  const confirmMultiDelete = async () => {
    try {
      // 각 폴더를 순차적으로 삭제
      for (const folderId of foldersToDelete) {
        const response = await fetch(`http://localhost:3001/api/folders/${folderId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`폴더 ID ${folderId} 삭제에 실패했습니다.`);
        }
      }

      await loadFolderTree();
      
      // 삭제된 폴더 중 현재 선택된 폴더가 있었다면 선택 해제
      if (selectedFolder && foldersToDelete.includes(selectedFolder.id)) {
        setSelectedFolder(null);
      }

      setShowMultiDeleteModal(false);
      setFoldersToDelete([]);
      
      // 토스트 알림 표시
      setToastMessage(`${foldersToDelete.length}개의 폴더가 성공적으로 삭제되었습니다.`);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setToastMessage(''), 300);
      }, 3000);
    } catch (error) {
      console.error('다중 폴더 삭제 오류:', error);
      setToastMessage('폴더 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setToastMessage(''), 300);
      }, 3000);
    }
  };

  const handleCreateTestCase = async (testCaseData: any) => {
    console.log('새 테스트케이스 생성:', testCaseData);
    
    try {
      // 백엔드 API 호출하여 테스트케이스 생성
      const response = await fetch('http://localhost:3001/api/testcases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: testCaseData.title,
          prereq: testCaseData.preconditions,
          steps: testCaseData.steps.filter((step: string) => step.trim() !== ''), // 빈 단계 제거
          expected: testCaseData.expectedResult,
          priority: testCaseData.priority === 'high' ? 'High' : testCaseData.priority === 'medium' ? 'Medium' : 'Low',
          status: testCaseData.status === 'active' ? 'Active' : 'Inactive',
          folderId: selectedFolder?.id,
          createdBy: 'admin'
        }),
      });

      if (!response.ok) {
        throw new Error('테스트케이스 생성에 실패했습니다.');
      }

      const newTestCase = await response.json();
      console.log('테스트케이스가 성공적으로 생성되었습니다:', newTestCase);
      
      // 테스트케이스 목록에 추가
      setTestCases(prev => [...prev, newTestCase]);
      
      // 토스트 알림 표시
      setToastMessage('테스트케이스가 성공적으로 생성되었습니다.');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setToastMessage(''), 300);
      }, 3000);
    } catch (error) {
      console.error('테스트케이스 생성 오류:', error);
      setToastMessage('테스트케이스 생성에 실패했습니다. 다시 시도해 주세요.');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setToastMessage(''), 300);
      }, 3000);
    }
  };

  const handleTestCaseSelect = (testCase: any) => {
    console.log('테스트케이스 선택됨:', testCase.title);
    setSelectedTestCase(testCase);
    setIsDetailPanelOpen(true);
  };

  const handleTestCaseUpdate = async (updatedTestCase: any) => {
    console.log('테스트케이스 업데이트:', updatedTestCase);
    
    try {
      // 백엔드 API 호출하여 테스트케이스 업데이트
      // 백엔드 API 형식에 맞게 데이터 변환
      const apiData = {
        title: updatedTestCase.title,
        description: updatedTestCase.description,
        prereq: updatedTestCase.preconditions || updatedTestCase.prereq,
        steps: updatedTestCase.steps,
        expected: updatedTestCase.expectedResult || updatedTestCase.expected,
        priority: updatedTestCase.priority,
        type: updatedTestCase.type,
        status: updatedTestCase.status,
        folderId: updatedTestCase.folderId,
        createdBy: updatedTestCase.createdBy || 'admin'
      };

      const response = await fetch(`http://localhost:3001/api/testcases/${updatedTestCase.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error('테스트케이스 업데이트에 실패했습니다.');
      }

      const updatedData = await response.json();
      console.log('테스트케이스가 성공적으로 업데이트되었습니다:', updatedData);
      
      // 테스트케이스 목록에서 해당 항목 업데이트
      setTestCases(prev => prev.map(tc => 
        tc.id === updatedTestCase.id ? updatedData : tc
      ));
      
      // 선택된 테스트케이스도 업데이트
      setSelectedTestCase(updatedData);
      
      // 릴리즈 관리의 로컬 스토리지도 업데이트
      // 모든 릴리즈의 로컬 스토리지를 확인하고 업데이트
      const updateReleaseStorage = () => {
        const keys = Object.keys(localStorage);
        const releaseKeys = keys.filter(key => key.startsWith('testCases_release_'));
        
        releaseKeys.forEach(key => {
          try {
            const storedData = localStorage.getItem(key);
            if (storedData) {
              const testCases = JSON.parse(storedData);
              const updatedTestCases = testCases.map((tc: any) => 
                tc.id === updatedTestCase.id ? { ...tc, ...updatedData } : tc
              );
              localStorage.setItem(key, JSON.stringify(updatedTestCases));
              console.log(`릴리즈 스토리지 업데이트 완료: ${key}`);
            }
          } catch (error) {
            console.error(`릴리즈 스토리지 업데이트 실패: ${key}`, error);
          }
        });
      };
      
      updateReleaseStorage();
      
      // 성공 메시지 표시
      setToastMessage('테스트케이스가 성공적으로 업데이트되었습니다. 릴리즈 관리에도 반영됩니다.');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setToastMessage(''), 300);
      }, 3000);
    } catch (error) {
      console.error('테스트케이스 업데이트 오류:', error);
      setToastMessage('테스트케이스 업데이트에 실패했습니다. 다시 시도해 주세요.');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setToastMessage(''), 300);
      }, 3000);
    }
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
        setSelectedTestCase((prev: any) => prev ? { ...prev, folderId: targetFolderId } : null);
        
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
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>폴더 구조를 불러오는 중...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorIcon>⚠️</ErrorIcon>
        <ErrorText>
          폴더 구조를 불러오는 중 오류가 발생했습니다.<br />
          {error}
        </ErrorText>
      </ErrorContainer>
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
          onCreateRootFolder={handleCreateRootFolder}
          onMultiDelete={handleMultiDelete}
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
      
      <FolderCreateModal
        isOpen={isFolderCreateModalOpen}
        onClose={() => setIsFolderCreateModalOpen(false)}
        onCreateFolder={handleCreateRootFolderSubmit}
      />
      
      {/* 커스텀 삭제 확인 모달 */}
      {showDeleteModal && folderToDelete && (
        <ModalOverlay onClick={() => setShowDeleteModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>폴더 삭제</ModalTitle>
            <ModalMessage>
              <strong>"{folderToDelete.name}"</strong> 폴더를 삭제하시겠습니까?<br />
              하위 폴더와 테스트 케이스도 함께 삭제됩니다.<br />
              이 작업은 되돌릴 수 없습니다.
            </ModalMessage>
            <ModalButtons>
              <ModalButton 
                variant="secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setFolderToDelete(null);
                }}
              >
                취소
              </ModalButton>
              <ModalButton 
                variant="primary"
                onClick={confirmDelete}
              >
                삭제
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {/* 커스텀 다중 삭제 확인 모달 */}
      {showMultiDeleteModal && foldersToDelete.length > 0 && (
        <ModalOverlay onClick={() => setShowMultiDeleteModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>다중 폴더 삭제</ModalTitle>
            <ModalMessage>
              선택된 <strong>{foldersToDelete.length}개</strong>의 폴더를 삭제하시겠습니까?<br />
              하위 폴더와 테스트 케이스도 함께 삭제됩니다.<br />
              이 작업은 되돌릴 수 없습니다.
            </ModalMessage>
            <ModalButtons>
              <ModalButton 
                variant="secondary"
                onClick={() => {
                  setShowMultiDeleteModal(false);
                  setFoldersToDelete([]);
                }}
              >
                취소
              </ModalButton>
              <ModalButton 
                variant="primary"
                onClick={confirmMultiDelete}
              >
                삭제
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {/* 토스트 알림 */}
      <Toast show={showToast}>
        {toastMessage}
      </Toast>
      
    </Container>
  );
};

export default TestManagementV2Page;
