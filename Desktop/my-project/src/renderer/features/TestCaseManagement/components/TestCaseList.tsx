import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { TestCase } from '../store/testCaseSlice';
import { selectTestCase, deselectTestCase, selectAllTestCases, deselectAllTestCases } from '../store/selectionSlice';
import EditableCell from '../../../shared/components/EditableCell';
import ContextMenu from '../../../shared/components/ContextMenu';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts';
import axios from '../../../utils/axios';

const TableContainer = styled.div`
  margin: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
`;

const Th = styled.th`
  background: #f8f9fa;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
  color: #495057;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
  vertical-align: middle;
`;

const Checkbox = styled.input`
  margin: 0;
  cursor: pointer;
`;

const TestCaseList: React.FC = () => {
  const dispatch = useDispatch();
  const testCases = useSelector((state: RootState) => state.testcases.list) || [];
  const { selectedTestCases = [] } = useSelector((state: RootState) => state.selection);
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState<{
    isVisible: boolean;
    x: number;
    y: number;
  }>({
    isVisible: false,
    x: 0,
    y: 0
  });

  useEffect(() => {
    // 테스트 케이스 데이터 로드
    setLoading(false);
  }, []);

  const handleSelectAll = () => {
    if (selectedTestCases.length === testCases.length) {
      dispatch(deselectAllTestCases());
    } else {
      const allTestCaseIds = testCases.map((tc: TestCase) => tc.id);
      dispatch(selectAllTestCases(allTestCaseIds));
    }
  };

  const handleSelectTestCase = (testCaseId: number, index: number, isShiftKey: boolean) => {
    dispatch(selectTestCase({ id: testCaseId, index, isShiftKey }));
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      isVisible: true,
      x: event.clientX,
      y: event.clientY
    });
  };

  const handleBulkAction = async (action: 'move' | 'copy' | 'delete' | 'status') => {
    if (selectedTestCases.length === 0) return;

    try {
      switch (action) {
        case 'copy':
          await axios.post('/api/bulk/copy', {
            ids: selectedTestCases,
            type: 'testcase',
            targetFolderId: 1 // 기본 폴더
          });
          break;
        case 'move':
          await axios.post('/api/bulk/move', {
            ids: selectedTestCases,
            type: 'testcase',
            targetFolderId: 1 // 기본 폴더
          });
          break;
        case 'delete':
          await axios.delete('/api/bulk', {
            data: {
              ids: selectedTestCases,
              type: 'testcase'
            }
          } as any);
          break;
        case 'status':
          await axios.patch('/api/bulk/status', {
            ids: selectedTestCases,
            type: 'testcase',
            status: 'active'
          });
          break;
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const handleCopy = useCallback(() => {
    handleBulkAction('copy');
  }, [selectedTestCases]);

  const handlePaste = useCallback(() => {
    // 붙여넣기 로직 구현
    console.log('붙여넣기 기능');
  }, []);

  const handleDelete = useCallback(() => {
    if (window.confirm(`${selectedTestCases.length}개 항목을 삭제하시겠습니까?`)) {
      handleBulkAction('delete');
    }
  }, [selectedTestCases]);

  const handleSelectAllShortcut = useCallback(() => {
    handleSelectAll();
  }, [selectedTestCases.length, testCases.length]);

  const handleDeselectAll = useCallback(() => {
    dispatch(deselectAllTestCases());
  }, []);

  // 키보드 단축키 설정
  useKeyboardShortcuts({
    onCopy: handleCopy,
    onPaste: handlePaste,
    onDelete: handleDelete,
    onSelectAll: handleSelectAllShortcut,
    onDeselectAll: handleDeselectAll
  });

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      <TableContainer onContextMenu={handleContextMenu}>
        <Table>
          <thead>
            <tr>
              <Th>
                <Checkbox
                  type="checkbox"
                  checked={selectedTestCases.length === testCases.length && testCases.length > 0}
                  onChange={handleSelectAll}
                />
              </Th>
              <Th>제목</Th>
              <Th>우선순위</Th>
              <Th>상태</Th>
              <Th>생성일</Th>
            </tr>
          </thead>
          <tbody>
            {testCases.map((testCase: TestCase, index: number) => (
              <tr key={testCase.id}>
                <Td>
                  <Checkbox
                    type="checkbox"
                    checked={selectedTestCases.includes(testCase.id)}
                    onChange={() => handleSelectTestCase(testCase.id, index, false)}
                  />
                </Td>
                <Td>
                  <EditableCell
                    value={testCase.title}
                    onSave={(newValue) => {
                      console.log('제목 변경:', newValue);
                    }}
                  />
                </Td>
                <Td>{testCase.priority}</Td>
                <Td>{testCase.status}</Td>
                <Td>{new Date(testCase.createdAt).toLocaleDateString()}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isVisible={contextMenu.isVisible}
        onClose={() => setContextMenu({ ...contextMenu, isVisible: false })}
        selectedItems={selectedTestCases.map(id => ({ id, type: 'testcase' as const }))}
        onBulkAction={handleBulkAction}
      />
    </>
  );
};

export default TestCaseList; 