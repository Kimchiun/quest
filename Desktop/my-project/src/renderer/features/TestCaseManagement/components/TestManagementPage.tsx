import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { addNotification } from '../../../store/notificationSlice';
import { useGetTestCasesQuery, useDeleteTestCaseMutation, useBulkDeleteMutation, useBulkMoveMutation, useBulkCopyMutation } from '../../../services/api';
import DraggableFolderList from './DraggableFolderList';
import TestCaseList from './TestCaseList';
import TestCaseModal, { TestCaseFormData } from './TestCaseModal';
import Button from '../../../shared/components/Button';
import { FolderIcon, PlusIcon, SearchIcon, FilterIcon, ChevronLeftIcon, ChevronRightIcon } from '../../../shared/components/Icons';

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #f8f9fa;
  position: relative;
`;

const Sidebar = styled.div<{ $isCollapsed: boolean }>`
  width: ${props => props.$isCollapsed ? '0px' : '320px'};
  background: white;
  border-right: ${props => props.$isCollapsed ? 'none' : '1px solid #e5e7eb'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
`;

const SidebarHeader = styled.div<{ $isCollapsed: boolean }>`
  padding: ${props => props.$isCollapsed ? '16px 8px' : '16px 20px'};
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  display: ${props => props.$isCollapsed ? 'none' : 'flex'};
  align-items: center;
  justify-content: space-between;
  height: 68px;
`;

const SidebarTitle = styled.h2<{ $isCollapsed: boolean }>`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SidebarSubtitle = styled.p<{ $isCollapsed: boolean }>`
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  display: ${props => props.$isCollapsed ? 'none' : 'block'};
`;

const CreateFolderButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  height: 36px;
  
  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`;

const FolderModal = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const FolderModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 400px;
  max-width: 90vw;
`;

const FolderModalTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
`;

const FolderModalInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 16px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FolderModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

const SidebarContent = styled.div<{ $isCollapsed: boolean }>`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: ${props => props.$isCollapsed ? 'none' : 'block'};
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ContentHeader = styled.div`
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  height: 68px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ContentTitle = styled.h1`
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #111827;
`;

const ContentSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: #6b7280;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  height: 36px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  height: 36px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  height: 36px;
  min-width: 120px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  height: 36px;
  
  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow: hidden;
  background: white;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7280;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
`;

const EmptyDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: #6b7280;
`;

const ToggleButton = styled.button<{ $isCollapsed: boolean }>`
  position: absolute;
  top: 50%;
  left: ${props => props.$isCollapsed ? '8px' : '320px'};
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

interface TestManagementPageProps {}

const TestManagementPage: React.FC<TestManagementPageProps> = () => {
  const dispatch = useDispatch();
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedFolderUniqueId, setSelectedFolderUniqueId] = useState<string | null>(null); // 고유 ID 기반 선택
  const [selectedFolder, setSelectedFolder] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  // RTK Query hooks
  const { data: testCases = [], isLoading, error, refetch } = useGetTestCasesQuery();
  const [deleteTestCase] = useDeleteTestCaseMutation();
  const [bulkDelete] = useBulkDeleteMutation();
  const [bulkMove] = useBulkMoveMutation();
  const [bulkCopy] = useBulkCopyMutation();

  // 폴더 데이터 상태
  const [folders, setFolders] = useState<any[]>([]);
  const [foldersLoading, setFoldersLoading] = useState(false);

  // 에러 처리
  useEffect(() => {
    if (error) {
      dispatch(addNotification({
        type: 'error',
        message: '테스트 케이스를 불러오는데 실패했습니다.',
        title: '오류'
      }));
    }
  }, [error, dispatch]);

  // 컴포넌트 마운트 시 폴더 데이터 로드
  useEffect(() => {
    loadFolders();
  }, []);

  // 폴더 선택 처리 - 고유 ID 기반 단일 선택
  const handleFolderSelect = useCallback((folderId: number, uniqueId: string) => {
    // folderId가 0이면 선택 해제
    if (folderId === 0) {
      setSelectedFolderId(null);
      setSelectedFolderUniqueId(null);
      setSelectedFolder(null);
      return;
    }
    
    // 단일 선택만 허용 - 이전 선택 상태를 완전히 초기화
    setSelectedFolderId(folderId);
    setSelectedFolderUniqueId(uniqueId); // 고유 ID 저장
    setSelectedFolder(null); // 이전 폴더 정보 초기화
    
    console.log('폴더 선택:', { folderId, uniqueId }); // 디버깅용
    
    // 폴더 상세 정보 가져오기
    fetchFolderDetails(folderId);
  }, []);

    const handleFolderMove = useCallback(async (folderId: number, newParentId: number | null) => {
    try {
      console.log('폴더 이동 요청:', { folderId, newParentId });
      
      // 유효성 검사
      if (folderId === newParentId) {
        dispatch(addNotification({
          type: 'error',
          message: '자기 자신을 부모로 설정할 수 없습니다.',
          title: '이동 실패'
        }));
        return;
      }

      // 순환 참조 검사
      const isCircularReference = (targetId: number, parentId: number | null): boolean => {
        if (!parentId) return false;
        if (targetId === parentId) return true;
        
        const findParent = (folders: any[], searchId: number): any | null => {
          for (const folder of folders) {
            if (folder.id === searchId) return folder;
            if (folder.children) {
              const found = findParent(folder.children, searchId);
              if (found) return found;
            }
          }
          return null;
        };
        
        const parentFolder = findParent(folders, parentId);
        if (!parentFolder) return false;
        
        return isCircularReference(targetId, parentFolder.parentId);
      };
      
      if (isCircularReference(folderId, newParentId)) {
        dispatch(addNotification({
          type: 'error',
          message: '순환 참조가 발생할 수 없습니다.',
          title: '이동 실패'
        }));
        return;
      }
      
      const response = await fetch(`http://localhost:3000/api/folders/${folderId}/move`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newParentId }),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const updatedFolder = await response.json();
      console.log('폴더 이동 완료:', updatedFolder);
      
      // 폴더 리스트 업데이트 - 계층구조 재구성
      setFolders(prevFolders => {
        // 이동할 폴더 찾기 및 제거 (하위폴더 포함)
        const findAndRemoveFolder = (folderList: any[], targetId: number): any | null => {
          for (let i = 0; i < folderList.length; i++) {
            if (folderList[i].id === targetId) {
              // 하위폴더를 포함한 완전한 폴더 객체 복사
              const removed = JSON.parse(JSON.stringify(folderList.splice(i, 1)[0]));
              return removed;
            }
            if (folderList[i].children) {
              const found = findAndRemoveFolder(folderList[i].children, targetId);
              if (found) return found;
            }
          }
          return null;
        };
      
        // 새 부모 폴더에 자식 추가 (하위폴더 구조 유지)
        const addToParent = (folderList: any[], parentId: number | null, folderToAdd: any): any[] => {
          if (parentId === null) {
            // 최상위로 이동 - 하위폴더 구조 유지
            return [...folderList, { 
              ...folderToAdd, 
              parentId: null, 
              children: folderToAdd.children || [] 
            }];
          }
      
          return folderList.map(folder => {
            if (folder.id === parentId) {
              return {
                ...folder,
                children: [...(folder.children || []), { 
                  ...folderToAdd, 
                  parentId, 
                  children: folderToAdd.children || [] 
                }]
              };
            }
            if (folder.children) {
              return {
                ...folder,
                children: addToParent(folder.children, parentId, folderToAdd)
              };
            }
            return folder;
          });
        };
      
        // 깊은 복사로 새 배열 생성
        const newFolders = JSON.parse(JSON.stringify(prevFolders));
        
        // 이동할 폴더 찾기 및 제거 (하위폴더 포함)
        const folderToMove = findAndRemoveFolder(newFolders, folderId);
        if (!folderToMove) {
          console.error('이동할 폴더를 찾을 수 없습니다:', folderId);
          return prevFolders;
        }
        
        console.log('이동할 폴더 (하위폴더 포함):', folderToMove);
        
        // 새 부모에 추가 (하위폴더 구조 유지)
        const updatedFolders = addToParent(newFolders, newParentId, folderToMove);
        
        // 고유 ID 재생성 (모든 하위폴더 포함)
        const addUniqueIds = (folders: any[], level = 0, parentPath = ''): any[] => {
          return folders.map(folder => {
            const currentPath = parentPath ? `${parentPath}/${folder.id}` : `${folder.id}`;
            const uniqueId = `${currentPath}-${level}`;
            
            return {
              ...folder,
              uniqueId,
              level,
              children: folder.children ? addUniqueIds(folder.children, level + 1, currentPath) : []
            };
          });
        };
        
        const finalFolders = addUniqueIds(updatedFolders);
        console.log('최종 폴더 구조:', finalFolders);
        
        return finalFolders;
      });
      
      dispatch(addNotification({
        type: 'success',
        message: '폴더가 성공적으로 이동되었습니다.',
        title: '이동 완료'
      }));
      
    } catch (error) {
      console.error('폴더 이동 실패:', error);
      dispatch(addNotification({
        type: 'error',
        message: `폴더 이동에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        title: '이동 실패'
      }));
    }
  }, [folders, dispatch]);

  const handleFolderReorder = useCallback(async (folderId: number, targetFolderId: number, position: 'before' | 'after') => {
    try {
      console.log('폴더 순서 변경 요청:', { folderId, targetFolderId, position });
      
      // 유효성 검사
      if (folderId === targetFolderId) {
        dispatch(addNotification({
          type: 'error',
          message: '자기 자신과의 순서 변경은 불가능합니다.',
          title: '순서 변경 실패'
        }));
        return;
      }

      const response = await fetch(`http://localhost:3000/api/folders/${folderId}/reorder`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetFolderId, position }),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const updatedFolder = await response.json();
      console.log('폴더 순서 변경 완료:', updatedFolder);
      
      // 폴더 리스트 업데이트 - 순서 변경
      setFolders(prevFolders => {
        // 같은 부모를 가진 폴더들 찾기
        const findSiblings = (folders: any[], parentId: number | null): any[] => {
          const siblings: any[] = [];
          
          const traverse = (folderList: any[]) => {
            for (const folder of folderList) {
              if (folder.parentId === parentId) {
                siblings.push(folder);
              }
              if (folder.children) {
                traverse(folder.children);
              }
            }
          };
          
          traverse(folders);
          return siblings;
        };
        
        // 이동할 폴더와 타겟 폴더 찾기
        const findFolder = (folders: any[], targetId: number): any | null => {
          for (const folder of folders) {
            if (folder.id === targetId) {
              return folder;
            }
            if (folder.children) {
              const found = findFolder(folder.children, targetId);
              if (found) return found;
            }
          }
          return null;
        };
        
        const folderToMove = findFolder(prevFolders, folderId);
        const targetFolder = findFolder(prevFolders, targetFolderId);
        
        if (!folderToMove || !targetFolder) {
          console.error('폴더를 찾을 수 없습니다:', { folderId, targetFolderId });
          return prevFolders;
        }
        
        // 같은 부모를 가진지 확인
        if (folderToMove.parentId !== targetFolder.parentId) {
          console.error('같은 레벨의 폴더가 아닙니다.');
          return prevFolders;
        }
        
        // 깊은 복사로 새 배열 생성
        const newFolders = JSON.parse(JSON.stringify(prevFolders));
        
        // 같은 부모를 가진 폴더들 찾기
        const siblings = findSiblings(newFolders, folderToMove.parentId);
        
        // 이동할 폴더 제거
        const removeFolderFromSiblings = (folderList: any[], targetId: number): any[] => {
          return folderList.filter(folder => {
            if (folder.id === targetId) {
              return false;
            }
            if (folder.children) {
              folder.children = removeFolderFromSiblings(folder.children, targetId);
            }
            return true;
          });
        };
        
        // 새 위치에 폴더 삽입
        const insertFolderAtPosition = (folderList: any[], folderToInsert: any, targetId: number, position: 'before' | 'after'): any[] => {
          const result: any[] = [];
          
          for (const folder of folderList) {
            if (folder.id === targetId) {
              if (position === 'before') {
                result.push(folderToInsert);
                result.push(folder);
              } else {
                result.push(folder);
                result.push(folderToInsert);
              }
            } else {
              result.push(folder);
            }
          }
          
          return result;
        };
        
        // 부모 폴더에서 이동할 폴더 제거
        const updateParentFolder = (folderList: any[], parentId: number | null, updateFn: (siblings: any[]) => any[]): any[] => {
          return folderList.map(folder => {
            if (folder.parentId === parentId) {
              // 같은 레벨의 폴더들 업데이트
              const siblings = folderList.filter(f => f.parentId === parentId);
              return updateFn(siblings);
            }
            if (folder.children) {
              return {
                ...folder,
                children: updateParentFolder(folder.children, parentId, updateFn)
              };
            }
            return folder;
          });
        };
        
        // 이동할 폴더 제거
        const foldersWithoutMoved = removeFolderFromSiblings(newFolders, folderId);
        
        // 새 위치에 삽입
        const updatedFolders = updateParentFolder(foldersWithoutMoved, folderToMove.parentId, (siblings) => {
          const targetIndex = siblings.findIndex(f => f.id === targetFolderId);
          if (targetIndex === -1) return siblings;
          
          const newSiblings = [...siblings];
          if (position === 'before') {
            newSiblings.splice(targetIndex, 0, folderToMove);
          } else {
            newSiblings.splice(targetIndex + 1, 0, folderToMove);
          }
          
          return newSiblings;
        });
        
        // 고유 ID 재생성
        const addUniqueIds = (folders: any[], level = 0, parentPath = ''): any[] => {
          return folders.map(folder => {
            const currentPath = parentPath ? `${parentPath}/${folder.id}` : `${folder.id}`;
            const uniqueId = `${currentPath}-${level}`;
            
            return {
              ...folder,
              uniqueId,
              level,
              children: folder.children ? addUniqueIds(folder.children, level + 1, currentPath) : []
            };
          });
        };
        
        const finalFolders = addUniqueIds(updatedFolders);
        console.log('최종 폴더 순서:', finalFolders);
        
        return finalFolders;
      });
      
      dispatch(addNotification({
        type: 'success',
        message: '폴더 순서가 성공적으로 변경되었습니다.',
        title: '순서 변경 완료'
      }));
      
    } catch (error) {
      console.error('폴더 순서 변경 실패:', error);
      dispatch(addNotification({
        type: 'error',
        message: `폴더 순서 변경에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        title: '순서 변경 실패'
      }));
    }
  }, [dispatch]);

  const handleFolderUpdate = useCallback(async (folderId: number, newName: string) => {
    try {
      console.log('폴더 수정:', { folderId, newName });
      // TODO: 실제 API 호출 및 상태 업데이트 로직 구현
      dispatch(addNotification({
        type: 'success',
        message: '폴더가 수정되었습니다.',
      }));
    } catch (error) {
      console.error('폴더 수정 실패:', error);
      dispatch(addNotification({
        type: 'error',
        message: '폴더 수정에 실패했습니다.',
      }));
    }
  }, [dispatch]);

  const handleFolderDelete = useCallback(async (folderId: number) => {
    try {
      console.log('폴더 삭제:', { folderId });
      // TODO: 실제 API 호출 및 상태 업데이트 로직 구현
      dispatch(addNotification({
        type: 'success',
        message: '폴더가 삭제되었습니다.',
      }));
    } catch (error) {
      console.error('폴더 삭제 실패:', error);
      dispatch(addNotification({
        type: 'error',
        message: '폴더 삭제에 실패했습니다.',
      }));
    }
  }, [dispatch]);

  const handleFolderDuplicate = useCallback(async (folderId: number) => {
    try {
      console.log('폴더 복제:', { folderId });
      // TODO: 실제 API 호출 및 상태 업데이트 로직 구현
      dispatch(addNotification({
        type: 'success',
        message: '폴더가 복제되었습니다.',
      }));
    } catch (error) {
      console.error('폴더 복제 실패:', error);
      dispatch(addNotification({
        type: 'error',
        message: '폴더 복제에 실패했습니다.',
      }));
    }
  }, [dispatch]);

  // 폴더를 평면화하는 함수
  const flattenFolders = (folders: any[], level = 0): any[] => {
    const result: any[] = [];
    for (const folder of folders) {
      const folderWithLevel = { ...folder, level };
      result.push(folderWithLevel);
      if (folder.children && folder.children.length > 0) {
        result.push(...flattenFolders(folder.children, level + 1));
      }
    }
    return result;
  };

  const flatFolders = flattenFolders(folders);

  const handleFolderCreate = useCallback(async (parentId: number | null) => {
    try {
      console.log('폴더 생성:', { parentId });
      
      // 기본 이름 생성 (중복 방지)
      const getDefaultName = () => {
        const existingNames = flatFolders.filter(f => f.name.startsWith('새 폴더'));
        let counter = 1;
        while (existingNames.some(f => f.name === `새 폴더 (${counter})`)) {
          counter++;
        }
        return `새 폴더 (${counter})`;
      };

      const newFolder = {
        id: Date.now(), // 임시 ID
        name: getDefaultName(),
        description: '',
        parentId: parentId,
        createdBy: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        children: [],
        testCaseCount: 0,
        level: parentId ? (flatFolders.find(f => f.id === parentId)?.level ?? 0) + 1 : 0,
      };

      // 상태에 즉시 추가
      setFolders(prevFolders => {
        const addToParent = (folders: any[], parentId: number | null, newFolder: any): any[] => {
          return folders.map(folder => {
            if (folder.id === parentId) {
              return {
                ...folder,
                children: [...folder.children, newFolder],
              };
            } else if (folder.children) {
              return {
                ...folder,
                children: addToParent(folder.children, parentId, newFolder),
              };
            }
            return folder;
          });
        };

        if (parentId === null) {
          return [...prevFolders, newFolder];
        } else {
          return addToParent(prevFolders, parentId, newFolder);
        }
      });

      // 새로 생성된 폴더 선택
      setSelectedFolderId(newFolder.id);
      
      // 상위 폴더 자동 펼치기
      if (parentId) {
        setExpandedFolders(prev => new Set([...prev, parentId]));
      }

      // 즉시 편집 모드로 전환
      setTimeout(() => {
        const folderListElement = document.querySelector(`[data-folder-id="${newFolder.id}"]`);
        if (folderListElement) {
          const folderNameElement = folderListElement.querySelector('[data-folder-name]');
          if (folderNameElement) {
            folderNameElement.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
          }
        }
      }, 100);

      dispatch(addNotification({
        type: 'success',
        message: '새 폴더가 생성되었습니다.',
      }));
    } catch (error) {
      console.error('폴더 생성 실패:', error);
      dispatch(addNotification({
        type: 'error',
        message: '폴더 생성에 실패했습니다.',
      }));
    }
  }, [dispatch, flatFolders]);

  // 폴더 데이터 로드 시 고유 ID 추가
  const loadFolders = async () => {
    try {
      setFoldersLoading(true);
      console.log('폴더 데이터 로드 시작...');
      const response = await fetch('/api/folders/tree');
      console.log('폴더 API 응답:', response.status, response.statusText);
      
      if (response.ok) {
        const folderData = await response.json();
        console.log('폴더 데이터:', folderData);
        
        // 고유 ID 추가
        const addUniqueIds = (folders: any[], level = 0, parentPath = ''): any[] => {
          return folders.map(folder => {
            const currentPath = parentPath ? `${parentPath}/${folder.id}` : `${folder.id}`;
            const uniqueId = `${currentPath}-${level}`;
            
            return {
              ...folder,
              uniqueId,
              level,
              children: folder.children ? addUniqueIds(folder.children, level + 1, currentPath) : []
            };
          });
        };
        
        const foldersWithUniqueIds = addUniqueIds(folderData);
        setFolders(foldersWithUniqueIds);
      } else {
        console.error('폴더 API 오류:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('폴더 로드 실패:', error);
    } finally {
      setFoldersLoading(false);
    }
  };

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

  // 테스트 케이스 생성 처리
  const handleCreateTestCase = async (data: TestCaseFormData) => {
    try {
      const response = await fetch('http://localhost:3000/api/testcases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          folderId: selectedFolderId,
        }),
      });

      if (response.ok) {
        dispatch(addNotification({
          type: 'success',
          message: '테스트 케이스가 생성되었습니다.',
          title: '생성 완료'
        }));
        setIsCreateModalOpen(false);
        refetch();
      } else {
        throw new Error('테스트 케이스 생성 실패');
      }
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: '테스트 케이스 생성에 실패했습니다.',
        title: '오류'
      }));
    }
  };

  // 검색 및 필터링된 테스트 케이스
  const filteredTestCases = Array.isArray(testCases) ? testCases.filter(testCase => {
    const matchesSearch = testCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testCase.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || testCase.status === filterStatus;
    const matchesFolder = !selectedFolderId || testCase.folderId === selectedFolderId;
    
    return matchesSearch && matchesFilter && matchesFolder;
  }) : [];

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      dispatch(addNotification({
        type: 'error',
        message: '폴더 이름을 입력해주세요.',
        title: '오류'
      }));
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newFolderName.trim(),
          parentId: selectedFolderId || null,
        }),
      });

      if (response.ok) {
        const newFolder = await response.json();
        console.log('새로 생성된 폴더:', newFolder);
        
        dispatch(addNotification({
          type: 'success',
          message: '폴더가 생성되었습니다.',
          title: '생성 완료'
        }));
        setIsCreateFolderModalOpen(false);
        setNewFolderName('');
        
        // 폴더 리스트에 새 폴더 추가
        setFolders(prevFolders => [...prevFolders, newFolder]);
        
        // 새로 생성된 폴더를 선택 상태로 설정
        setSelectedFolderId(newFolder.id);
      } else {
        throw new Error('폴더 생성 실패');
      }
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: '폴더 생성에 실패했습니다.',
        title: '오류'
      }));
    }
  };

  const handleCloseFolderModal = () => {
    setIsCreateFolderModalOpen(false);
    setNewFolderName('');
  };

  return (
    <Container>
      <Sidebar $isCollapsed={isSidebarCollapsed}>
        <SidebarHeader $isCollapsed={isSidebarCollapsed}>
          <CreateFolderButton onClick={() => setIsCreateFolderModalOpen(true)}>
            <PlusIcon size={14} color="#6b7280" />
            새 그룹
          </CreateFolderButton>
        </SidebarHeader>
        <SidebarContent $isCollapsed={isSidebarCollapsed}>
          {foldersLoading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
              로딩 중...
            </div>
          ) : folders.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
              그룹이 없습니다.
              <br />
              새 그룹을 생성해보세요.
            </div>
          ) : (
            <DraggableFolderList
              folders={folders}
              selectedFolderId={selectedFolderId}
              selectedFolderUniqueId={selectedFolderUniqueId}
              onFolderSelect={handleFolderSelect}
              onFolderMove={handleFolderMove}
              onFolderReorder={handleFolderReorder}
              onFolderUpdate={handleFolderUpdate}
              onFolderDelete={handleFolderDelete}
              onFolderDuplicate={handleFolderDuplicate}
              onFolderCreate={handleFolderCreate}
            />
          )}
        </SidebarContent>
      </Sidebar>

      <ToggleButton $isCollapsed={isSidebarCollapsed} onClick={toggleSidebar}>
        {isSidebarCollapsed ? (
          <ChevronRightIcon size={12} color="#6b7280" />
        ) : (
          <ChevronLeftIcon size={12} color="#6b7280" />
        )}
      </ToggleButton>

      <MainContent>
        <ContentHeader>
          <ContentTitle>
            {selectedFolder ? selectedFolder.name : ''}
          </ContentTitle>
          <ContentSubtitle>
            {selectedFolder && filteredTestCases.length > 0
              ? `${filteredTestCases.length}개의 테스트 케이스`
              : ''
            }
          </ContentSubtitle>
          
          <Toolbar>
            <SearchBar>
              <SearchIcon size={16} color="#6b7280" />
              <SearchInput
                placeholder={selectedFolderId ? "폴더 내 테스트 케이스 검색..." : "테스트 케이스 검색..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBar>
            
            <FilterSelect
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">모든 우선순위</option>
              <option value="High">높음</option>
              <option value="Medium">보통</option>
              <option value="Low">낮음</option>
            </FilterSelect>
            
            <FilterSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">모든 상태</option>
              <option value="Active">활성</option>
              <option value="Archived">보관</option>
            </FilterSelect>
            
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              disabled={!selectedFolderId}
              size="sm"
            >
              <PlusIcon size={16} color="white" />
              새 테스트 케이스
            </Button>
          </Toolbar>
        </ContentHeader>

        <ContentArea>
          {selectedFolderId ? (
            <TestCaseList
              testCases={filteredTestCases}
              searchTerm={searchTerm}
              priorityFilter={priorityFilter}
              statusFilter={statusFilter}
              onSearchChange={setSearchTerm}
              onPriorityFilterChange={setPriorityFilter}
              onStatusFilterChange={setStatusFilter}
            />
          ) : (
            <EmptyState>
              <EmptyIcon>📁</EmptyIcon>
              <EmptyTitle>폴더를 선택하세요</EmptyTitle>
              <EmptyDescription>
                왼쪽에서 폴더를 선택하여 테스트 케이스를 관리하세요
              </EmptyDescription>
            </EmptyState>
          )}
        </ContentArea>
      </MainContent>

      <TestCaseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTestCase}
        mode="create"
      />

      <FolderModal $isOpen={isCreateFolderModalOpen}>
        <FolderModalContent>
          <FolderModalTitle>새 폴더 생성</FolderModalTitle>
          <FolderModalInput
            type="text"
            placeholder="폴더 이름을 입력하세요"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateFolder();
              }
            }}
            autoFocus
          />
          <FolderModalActions>
            <Button variant="secondary" onClick={handleCloseFolderModal} size="sm">
              취소
            </Button>
            <Button onClick={handleCreateFolder} size="sm">
              생성
            </Button>
          </FolderModalActions>
        </FolderModalContent>
      </FolderModal>
    </Container>
  );
};

export default TestManagementPage; 