import React, { useState, useEffect } from 'react';
import Tree from 'rc-tree';
import styled from 'styled-components';
import { FolderTree } from '@/main/app/domains/folders/models/Folder';

const TreeContainer = styled.div`
  .rc-tree {
    background: #fff;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    padding: 16px;
  }
  
  .rc-tree-node-content-wrapper {
    padding: 8px 12px;
    border-radius: 4px;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #f8f9fa;
    }
    
    &.rc-tree-node-selected {
      background-color: #eff6ff;
    }
  }
  
  .rc-tree-title {
    font-size: 14px;
    color: #333;
  }
  
  .rc-tree-switcher {
    color: #666;
  }
`;

const FolderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FolderName = styled.span`
  font-weight: 500;
`;

const TestCaseCount = styled.span`
  background: #eff6ff;
      color: #3b82f6;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
`;

interface FolderTreeProps {
  onFolderSelect: (folderId: number) => void;
  selectedFolderId?: number;
}

const FolderTreeComponent: React.FC<FolderTreeProps> = ({ 
  onFolderSelect, 
  selectedFolderId 
}) => {
  const [treeData, setTreeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFolderTree();
  }, []);

  const fetchFolderTree = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/folders/tree');
      if (response.ok) {
        const data = await response.json();
        const formattedData = formatTreeData(data);
        setTreeData(formattedData);
      } else {
        console.error('폴더 트리 조회 실패');
      }
    } catch (error) {
      console.error('폴더 트리 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTreeData = (folders: FolderTree[]): any[] => {
    return folders.map(folder => ({
      key: folder.id.toString(),
      title: (
        <FolderInfo>
          <FolderName>{folder.name}</FolderName>
          {folder.testCaseCount > 0 && (
            <TestCaseCount>{folder.testCaseCount}</TestCaseCount>
          )}
        </FolderInfo>
      ),
      children: folder.children ? formatTreeData(folder.children) : undefined,
      isLeaf: folder.children.length === 0
    }));
  };

  const handleSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const folderId = parseInt(selectedKeys[0].toString());
      onFolderSelect(folderId);
    }
  };

  if (loading) {
    return <div>폴더 로딩 중...</div>;
  }

  return (
    <TreeContainer>
      <Tree
        treeData={treeData}
        onSelect={handleSelect}
        selectedKeys={selectedFolderId ? [selectedFolderId.toString()] : []}
        defaultExpandAll={false}
        showLine={true}
        showIcon={false}
      />
    </TreeContainer>
  );
};

export default FolderTreeComponent; 