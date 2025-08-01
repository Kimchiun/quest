import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { addNotification } from '../../../store/notificationSlice';
import { useGetTestCasesQuery, useDeleteTestCaseMutation, useBulkDeleteMutation, useBulkMoveMutation, useBulkCopyMutation } from '../../../services/api';
import FolderTree from '../../FolderManagement/components/FolderTree';
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
  const [selectedFolder, setSelectedFolder] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  // 폴더 선택 처리
  const handleFolderSelect = useCallback((folderId: number) => {
    setSelectedFolderId(folderId);
    // 폴더 상세 정보 가져오기
    fetchFolderDetails(folderId);
  }, []);

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
  const filteredTestCases = testCases.filter(testCase => {
    const matchesSearch = testCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testCase.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || testCase.status === filterStatus;
    const matchesFolder = !selectedFolderId || testCase.folderId === selectedFolderId;
    
    return matchesSearch && matchesFilter && matchesFolder;
  });

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
        dispatch(addNotification({
          type: 'success',
          message: '폴더가 생성되었습니다.',
          title: '생성 완료'
        }));
        setIsCreateFolderModalOpen(false);
        setNewFolderName('');
        // 폴더 트리 새로고침이 필요할 수 있음
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
            새 폴더
          </CreateFolderButton>
        </SidebarHeader>
        <SidebarContent $isCollapsed={isSidebarCollapsed}>
          <FolderTree
            onFolderSelect={handleFolderSelect}
            selectedFolderId={selectedFolderId}
          />
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
            {selectedFolder 
              ? `${filteredTestCases.length}개의 테스트 케이스`
              : ''
            }
          </ContentSubtitle>
          
          <Toolbar>
            <SearchBar>
              <SearchIcon size={16} color="#6b7280" />
              <SearchInput
                placeholder="테스트 케이스 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBar>
            
            <FilterButton onClick={() => setFilterStatus(filterStatus === 'all' ? 'Active' : 'all')}>
              <FilterIcon size={16} color="#6b7280" />
              {filterStatus === 'all' ? '전체' : '활성'}
            </FilterButton>
            
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
              isLoading={isLoading}
              selectedFolderId={selectedFolderId}
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