import React, { useState, useEffect } from 'react';
import Tree from 'rc-tree';
import 'rc-tree/assets/index.css';
import styled from 'styled-components';
import Typography from '../../../shared/components/Typography';
import Button from '../../../shared/components/Button';
import FolderModal from './FolderModal';
import ContextMenu, { MenuItem, Divider } from './ContextMenu';

const TreeContainer = styled.div`
  .rc-tree {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
  }

  .rc-tree-node-content-wrapper {
    padding: 8px 12px;
    border-radius: 4px;
    margin: 2px 0;
  }

  .rc-tree-node-content-wrapper:hover {
    background: #f3f4f6;
  }

  .rc-tree-node-selected {
    background: #dbeafe;
  }

  .rc-tree-title {
    font-size: 14px;
    color: #374151;
  }
`;

const TreeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
`;

const TreeTitle = styled(Typography)`
  font-weight: 600;
  color: #111827;
`;

interface FolderTreeData {
  key: string;
  title: string;
  children?: FolderTreeData[];
  testCaseCount?: number;
}

interface FolderTreeProps {
  onFolderSelect: (folderId: number) => void;
  selectedFolderId?: number;
}

const FolderTreeComponent: React.FC<FolderTreeProps> = ({ onFolderSelect, selectedFolderId }) => {
  const [treeData, setTreeData] = useState<FolderTreeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    folderId?: number;
  }>({ isOpen: false, x: 0, y: 0 });
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit' | 'delete';
    folder?: any;
  }>({ isOpen: false, mode: 'create' });

  useEffect(() => {
    fetchFolderTree();
  }, []);

  const fetchFolderTree = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/folders/tree');
      if (response.ok) {
        const data = await response.json();
        const transformedData = transformFolderData(data);
        setTreeData(transformedData);
      }
    } catch (error) {
      console.error('폴더 트리 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const transformFolderData = (folders: any[]): FolderTreeData[] => {
    return folders.map(folder => ({
      key: folder.id.toString(),
      title: `${folder.name} (${folder.testCaseCount || 0})`,
      children: folder.children ? transformFolderData(folder.children) : undefined,
      testCaseCount: folder.testCaseCount
    }));
  };

  const handleTreeSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const folderId = parseInt(selectedKeys[0].toString());
      onFolderSelect(folderId);
    }
  };

  const handleContextMenu = (event: React.MouseEvent, folderId?: number) => {
    event.preventDefault();
    setContextMenu({
      isOpen: true,
      x: event.clientX,
      y: event.clientY,
      folderId
    });
  };

  const handleCreateFolder = () => {
    setModalState({ isOpen: true, mode: 'create' });
    setContextMenu({ isOpen: false, x: 0, y: 0 });
  };

  const handleEditFolder = () => {
    // 폴더 정보를 가져와서 모달 열기
    setModalState({ isOpen: true, mode: 'edit', folder: { id: contextMenu.folderId } });
    setContextMenu({ isOpen: false, x: 0, y: 0 });
  };

  const handleDeleteFolder = () => {
    setModalState({ isOpen: true, mode: 'delete', folder: { id: contextMenu.folderId } });
    setContextMenu({ isOpen: false, x: 0, y: 0 });
  };

  const handleModalSubmit = async (data: { name: string; description?: string; parentId?: number }) => {
    try {
      const { mode, folder } = modalState;
      
      if (mode === 'create') {
        const response = await fetch('http://localhost:3000/api/folders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            description: data.description,
            parentId: data.parentId,
            createdBy: 'testuser' // 실제 사용자 정보로 교체
          })
        });
        if (response.ok) {
          await fetchFolderTree();
        }
      } else if (mode === 'edit') {
        const response = await fetch(`http://localhost:3000/api/folders/${folder.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            description: data.description,
            parentId: data.parentId,
            updatedBy: 'testuser'
          })
        });
        if (response.ok) {
          await fetchFolderTree();
        }
      } else if (mode === 'delete') {
        const response = await fetch(`http://localhost:3000/api/folders/${folder.id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          await fetchFolderTree();
        }
      }
    } catch (error) {
      console.error('폴더 작업 실패:', error);
    }
  };

  if (loading) {
    return <div>폴더 로딩 중...</div>;
  }

  return (
    <TreeContainer>
      <TreeHeader>
        <TreeTitle $variant="h4">폴더 구조</TreeTitle>
        <Button size="sm" onClick={handleCreateFolder}>
          새 폴더
        </Button>
      </TreeHeader>

      <Tree
        treeData={treeData}
        selectedKeys={selectedFolderId ? [selectedFolderId.toString()] : []}
        onSelect={handleTreeSelect}
        onRightClick={({ node }) => {
          const folderId = parseInt(node.key.toString());
          // 컨텍스트 메뉴는 별도로 처리
        }}
        showLine
        showIcon
      />

      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isOpen={contextMenu.isOpen}
        onClose={() => setContextMenu({ isOpen: false, x: 0, y: 0 })}
      >
        <MenuItem onClick={handleCreateFolder}>
          새 폴더 생성
        </MenuItem>
        {contextMenu.folderId && (
          <>
            <Divider />
            <MenuItem onClick={handleEditFolder}>
              폴더 수정
            </MenuItem>
            <MenuItem onClick={handleDeleteFolder}>
              폴더 삭제
            </MenuItem>
          </>
        )}
      </ContextMenu>

      <FolderModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: 'create' })}
        onSubmit={handleModalSubmit}
        mode={modalState.mode}
        folder={modalState.folder}
      />
    </TreeContainer>
  );
};

export default FolderTreeComponent; 