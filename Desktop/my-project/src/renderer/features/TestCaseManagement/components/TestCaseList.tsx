import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { TestCase, fetchTestCases } from '../store/testCaseSlice';
import { selectTestCase, deselectTestCase, selectAllTestCases, deselectAllTestCases } from '../store/selectionSlice';
import ListView from '../../../shared/components/List/ListView';

// showToast 임시 선언 (실제 구현은 공통 유틸로 분리 권장)
function showToast(message: string, type: 'error' | 'info' | 'success' = 'info') {
  alert(`[${type}] ${message}`);
}

const TestCaseList: React.FC = () => {
  const dispatch = useDispatch();
  const { list: testCases, loading, error } = useSelector((state: RootState) => state.testcases);
  const { selectedTestCases = [] } = useSelector((state: RootState) => state.selection);

  useEffect(() => {
    dispatch(fetchTestCases() as any);
  }, [dispatch]);

  // CRUD 후 refetch 및 알림
  const handleBulkAction = useCallback(async (action: 'move' | 'copy' | 'delete' | 'status') => {
    if (selectedTestCases.length === 0) return;
    try {
      // 실제 API 호출 로직 (생략, 필요시 구현)
      // await ...
      showToast('작업이 성공적으로 완료되었습니다.', 'success');
      dispatch(fetchTestCases() as any); // refetch
    } catch (error: any) {
      showToast(error?.message || '작업 실패', 'error');
    }
  }, [selectedTestCases, dispatch]);

  // ListView columns 정의
  const columns = [
    { key: 'title', label: '제목', width: '40%' },
    { key: 'priority', label: '우선순위', width: '15%' },
    { key: 'status', label: '상태', width: '15%' },
    { key: 'createdAt', label: '생성일', width: '20%', render: (value: string) => new Date(value).toLocaleDateString() },
  ];

  // 선택/전체선택 핸들러 (string[] → number[] 변환)
  const handleSelectionChange = (ids: string[]) => {
    const numIds = ids.map(id => Number(id));
    if (numIds.length === testCases.length) {
      dispatch(selectAllTestCases(numIds));
    } else if (numIds.length === 0) {
      dispatch(deselectAllTestCases());
    } else {
      // 부분 선택 로직 필요시 구현
    }
  };

  // 아이템 클릭 핸들러 (ListItem → TestCase 변환)
  const handleItemClick = (item: { id: string }) => {
    const found = testCases.find(tc => String(tc.id) === item.id);
    if (found) {
      // 상세 보기 등 구현
      // 예: showToast(`상세: ${found.title}`);
    }
  };

  return (
    <ListView
      items={testCases.map(tc => ({ ...tc, id: String(tc.id) }))}
      columns={columns}
      loading={loading}
      emptyMessage={error ? `에러: ${error}` : '테스트케이스가 없습니다.'}
      selectable
      onSelectionChange={handleSelectionChange}
      onItemClick={handleItemClick}
      actions={null}
    />
  );
};

export default TestCaseList; 