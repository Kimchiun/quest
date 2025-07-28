import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import styled from 'styled-components';
import Typography from '../../../shared/components/Typography';

const TestCaseItem = styled.div<{ isDragging: boolean; isOver: boolean }>`
  padding: 12px;
  margin: 4px 0;
  background: ${props => props.isDragging ? '#dbeafe' : props.isOver ? '#f3f4f6' : 'white'};
  border: 1px solid ${props => props.isDragging ? '#2563eb' : '#e5e7eb'};
  border-radius: 6px;
  cursor: move;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
`;

const TestCaseTitle = styled(Typography)`
  font-weight: 500;
  margin-bottom: 4px;
`;

const TestCaseMeta = styled.div`
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
`;

interface TestCase {
  id: number;
  title: string;
  status: string;
  priority: string;
  assignee?: string;
}

interface DraggableTestCaseProps {
  testCase: TestCase;
  index: number;
  moveTestCase: (dragIndex: number, hoverIndex: number) => void;
  onDrop: (testCaseId: number, targetFolderId: number) => void;
  currentFolderId: number;
}

const ItemType = 'TEST_CASE';

const DraggableTestCase: React.FC<DraggableTestCaseProps> = ({
  testCase,
  index,
  moveTestCase,
  onDrop,
  currentFolderId
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index, testCase, sourceFolderId: currentFolderId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    hover: (item: any, monitor) => {
      if (!drop) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveTestCase(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    drop: (item: any) => {
      if (item.sourceFolderId !== currentFolderId) {
        onDrop(item.testCase.id, currentFolderId);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={(node) => {
      drag(node);
      drop(node);
    }}>
      <TestCaseItem isDragging={isDragging} isOver={isOver}>
        <TestCaseTitle $variant="body">{testCase.title}</TestCaseTitle>
        <TestCaseMeta>
          <span>상태: {testCase.status}</span>
          <span>우선순위: {testCase.priority}</span>
          {testCase.assignee && <span>담당자: {testCase.assignee}</span>}
        </TestCaseMeta>
      </TestCaseItem>
    </div>
  );
};

export default DraggableTestCase; 