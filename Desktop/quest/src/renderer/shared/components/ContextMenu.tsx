import React from 'react';
import styled from 'styled-components';

interface ContextMenuProps {
  x: number;
  y: number;
  isVisible: boolean;
  onClose: () => void;
  selectedItems: Array<{ id: number; type: 'folder' | 'testcase' }>;
  onBulkAction: (action: 'move' | 'copy' | 'delete' | 'status') => void;
}

const MenuContainer = styled.div<{ x: number; y: number; isVisible: boolean }>`
  position: fixed;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: ${props => props.isVisible ? 'block' : 'none'};
  min-width: 150px;
`;

const MenuItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

const MenuDivider = styled.div`
  height: 1px;
  background-color: #eee;
  margin: 4px 0;
`;

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  isVisible,
  onClose,
  selectedItems,
  onBulkAction
}) => {
  const handleAction = (action: 'move' | 'copy' | 'delete' | 'status') => {
    onBulkAction(action);
    onClose();
  };

  const hasSelection = selectedItems.length > 0;
  const hasTestCases = selectedItems.some(item => item.type === 'testcase');
  const hasFolders = selectedItems.some(item => item.type === 'folder');

  if (!isVisible) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999
        }}
        onClick={onClose}
      />
      <MenuContainer x={x} y={y} isVisible={isVisible}>
        {hasSelection && (
          <>
            <MenuItem onClick={() => handleAction('copy')}>
              복사 ({selectedItems.length}개)
            </MenuItem>
            <MenuItem onClick={() => handleAction('move')}>
              이동 ({selectedItems.length}개)
            </MenuItem>
            {hasTestCases && (
              <MenuItem onClick={() => handleAction('status')}>
                상태 변경 ({selectedItems.filter(item => item.type === 'testcase').length}개)
              </MenuItem>
            )}
            <MenuDivider />
            <MenuItem 
              onClick={() => handleAction('delete')}
              style={{ color: '#d32f2f' }}
            >
              삭제 ({selectedItems.length}개)
            </MenuItem>
          </>
        )}
      </MenuContainer>
    </>
  );
};

export default ContextMenu; 