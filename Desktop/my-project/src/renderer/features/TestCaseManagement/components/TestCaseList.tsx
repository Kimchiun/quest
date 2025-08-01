import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { selectTestCase, deselectTestCase, selectAllTestCases, deselectAllTestCases } from '../store/selectionSlice';
import { useGetTestCasesQuery, useDeleteTestCaseMutation, useBulkDeleteMutation, useBulkMoveMutation, useBulkCopyMutation, useBulkUpdateStatusMutation } from '../../../services/api';
import { addNotification } from '../../../store/notificationSlice';
import ListView from '../../../shared/components/List/ListView';
import LoadingSpinner from '../../../shared/components/LoadingSpinner/LoadingSpinner';
import TestCaseModal, { TestCaseFormData } from './TestCaseModal';
import Button from '../../../shared/components/Button';

interface TestCaseListProps {
  testCases: any[];
  isLoading: boolean;
  selectedFolderId?: number | null;
}

const TestCaseList: React.FC<TestCaseListProps> = ({ testCases, isLoading, selectedFolderId }) => {
  const dispatch = useDispatch();
  const { selectedTestCases = [] } = useSelector((state: RootState) => state.selection);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteTestCase] = useDeleteTestCaseMutation();
  const [bulkDelete] = useBulkDeleteMutation();
  const [bulkMove] = useBulkMoveMutation();
  const [bulkCopy] = useBulkCopyMutation();
  const [bulkUpdateStatus] = useBulkUpdateStatusMutation();

  // 에러 처리 - 이제 부모 컴포넌트에서 처리됨

  // CRUD 후 refetch 및 알림
  const handleBulkAction = useCallback(async (action: 'move' | 'copy' | 'delete' | 'status') => {
    if (selectedTestCases.length === 0) {
      dispatch(addNotification({
        type: 'warning',
        message: '선택된 테스트 케이스가 없습니다.',
        title: '경고'
      }));
      return;
    }

    try {
      switch (action) {
        case 'delete':
          await bulkDelete({ ids: selectedTestCases }).unwrap();
          dispatch(addNotification({
            type: 'success',
            message: `${selectedTestCases.length}개의 테스트 케이스가 삭제되었습니다.`,
            title: '삭제 완료'
          }));
          break;
        case 'move':
          // 실제 구현에서는 폴더 선택 모달이 필요
          const targetFolder = prompt('이동할 폴더를 입력하세요:');
          if (targetFolder) {
            await bulkMove({ ids: selectedTestCases, targetFolder }).unwrap();
            dispatch(addNotification({
              type: 'success',
              message: `${selectedTestCases.length}개의 테스트 케이스가 이동되었습니다.`,
              title: '이동 완료'
            }));
          }
          break;
        case 'copy':
          const copyTargetFolder = prompt('복사할 폴더를 입력하세요:');
          if (copyTargetFolder) {
            await bulkCopy({ ids: selectedTestCases, targetFolder: copyTargetFolder }).unwrap();
            dispatch(addNotification({
              type: 'success',
              message: `${selectedTestCases.length}개의 테스트 케이스가 복사되었습니다.`,
              title: '복사 완료'
            }));
          }
          break;
        case 'status':
          const newStatus = prompt('새로운 상태를 입력하세요 (Active/Archived):');
          if (newStatus && ['Active', 'Archived'].includes(newStatus)) {
            await bulkUpdateStatus({ ids: selectedTestCases, status: newStatus }).unwrap();
            dispatch(addNotification({
              type: 'success',
              message: `${selectedTestCases.length}개의 테스트 케이스 상태가 변경되었습니다.`,
              title: '상태 변경 완료'
            }));
          }
          break;
      }
      
      // 선택 해제
      dispatch(deselectAllTestCases());
    } catch (error: any) {
      dispatch(addNotification({
        type: 'error',
        message: error?.data?.message || '작업 실패',
        title: '오류'
      }));
    }
  }, [selectedTestCases, dispatch, bulkDelete, bulkMove, bulkCopy, bulkUpdateStatus]);

  // 개별 삭제
  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteTestCase(id).unwrap();
      dispatch(addNotification({
        type: 'success',
        message: '테스트 케이스가 삭제되었습니다.',
        title: '삭제 완료'
      }));
    } catch (error: any) {
      dispatch(addNotification({
        type: 'error',
        message: error?.data?.message || '삭제 실패',
        title: '오류'
      }));
    }
  }, [deleteTestCase, dispatch]);

  // 테스트 케이스 생성 핸들러
  const handleCreateTestCase = async (data: TestCaseFormData) => {
    try {
      console.log('테스트 케이스 생성:', data);
      
      // API 호출
      const response = await fetch('/api/testcases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status,
          steps: data.steps,
          expected: data.expectedResult,
          tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          createdBy: 'current-user' // 실제로는 현재 사용자 정보를 사용해야 함
        }),
      });

      if (!response.ok) {
        throw new Error('테스트 케이스 생성에 실패했습니다.');
      }

      const createdTestCase = await response.json();
      
      dispatch(addNotification({
        type: 'success',
        message: '테스트 케이스가 성공적으로 생성되었습니다!',
        title: '생성 완료'
      }));
      
      setIsCreateModalOpen(false);
      
      // 목록 새로고침
              // 부모 컴포넌트에서 refetch 처리
    } catch (error) {
      console.error('테스트 케이스 생성 오류:', error);
      dispatch(addNotification({
        type: 'error',
        message: '테스트 케이스 생성에 실패했습니다.',
        title: '오류'
      }));
    }
  };

  // 로딩 상태 처리
  if (isLoading) {
    return <LoadingSpinner message="테스트 케이스를 불러오는 중..." />;
  }

  // ListView columns 정의
  const columns = [
    {
      key: 'select',
      label: '',
      width: '50px',
      render: (value: any, item: any) => (
        <input
          type="checkbox"
          checked={selectedTestCases.includes(item.id)}
          onChange={(e) => {
            if (e.target.checked) {
              dispatch(selectTestCase(item.id));
            } else {
              dispatch(deselectTestCase(item.id));
            }
          }}
        />
      ),
    },
    {
      key: 'title',
      label: '제목',
      sortable: true,
      render: (value: any, item: any) => (
        <div style={{ fontWeight: 'bold' }}>{item.title}</div>
      ),
    },
    {
      key: 'priority',
      label: '우선순위',
      width: '100px',
      render: (value: any, item: any) => {
        const color = item.priority === 'High' ? '#f44336' : item.priority === 'Medium' ? '#ff9800' : '#4caf50';
        return <span style={{ color }}>{item.priority}</span>;
      },
    },
    {
      key: 'status',
      label: '상태',
      width: '100px',
      render: (value: any, item: any) => (
        <span style={{ color: item.status === 'Active' ? '#4caf50' : '#9e9e9e' }}>
          {item.status}
        </span>
      ),
    },
    {
      key: 'tags',
      label: '태그',
      render: (value: any, item: any) => (
        <div>
          {item.tags?.map((tag: string, index: number) => (
            <span key={index} style={{ 
              background: '#e3f2fd', 
              padding: '2px 6px', 
              borderRadius: '4px', 
              fontSize: '12px',
              marginRight: '4px'
            }}>
              {tag}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'actions',
      label: '작업',
      width: '120px',
      render: (value: any, item: any) => (
        <div>
          <button onClick={() => handleDelete(item.id)} style={{ 
            background: '#f44336', 
            color: 'white', 
            border: 'none', 
            padding: '4px 8px', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            삭제
          </button>
        </div>
      ),
    },
  ];

  // items를 ListView 형식으로 변환
  const items = testCases.map(tc => ({
    ...tc,
    id: String(tc.id) // ListView는 id를 string으로 요구
  }));

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          variant="primary"
          style={{ marginRight: 'auto' }}
        >
          + 새 테스트 케이스 생성
        </Button>
        
        <button onClick={() => handleBulkAction('delete')} disabled={selectedTestCases.length === 0}>
          선택 삭제
        </button>
        <button onClick={() => handleBulkAction('move')} disabled={selectedTestCases.length === 0}>
          선택 이동
        </button>
        <button onClick={() => handleBulkAction('copy')} disabled={selectedTestCases.length === 0}>
          선택 복사
        </button>
        <button onClick={() => handleBulkAction('status')} disabled={selectedTestCases.length === 0}>
          상태 변경
        </button>
        <button onClick={() => dispatch(selectAllTestCases(testCases.map(tc => tc.id)))}>
          전체 선택
        </button>
        <button onClick={() => dispatch(deselectAllTestCases())}>
          선택 해제
        </button>
      </div>
      
      <ListView
        items={items}
        columns={columns}
        loading={isLoading}
        emptyMessage="테스트 케이스가 없습니다."
      />

      {/* 테스트 케이스 생성 모달 */}
      <TestCaseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTestCase}
        mode="create"
      />
    </div>
  );
};

export default TestCaseList; 