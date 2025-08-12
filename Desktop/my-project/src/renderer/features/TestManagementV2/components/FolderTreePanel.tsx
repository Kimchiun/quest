import React, { useState } from 'react';
import styled from 'styled-components';
import { FolderTree } from '../../../types/folder';
import FolderTreeItem from './FolderTreeItem';

const Container = styled.div<{ isCollapsed: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  width: 100%;
  transition: width 0.3s ease;
`;

const Header = styled.div<{ isCollapsed: boolean }>`
  padding: ${props => props.isCollapsed ? '8px' : '16px'};
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: ${props => props.isCollapsed ? 'center' : 'space-between'};
  height: 56px;
  flex-shrink: 0;
  box-sizing: border-box;
  gap: 8px;
  min-width: 0; /* 추가: flex 아이템이 축소될 수 있도록 */
`;

const Title = styled.h2<{ isCollapsed: boolean }>`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  display: ${props => props.isCollapsed ? 'none' : 'block'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1; /* 변경: 고정 너비 대신 flex로 변경 */
  min-width: 0; /* 추가: 텍스트가 축소될 수 있도록 */
`;



const TreeContainer = styled.div<{ isCollapsed: boolean }>`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
  display: ${props => props.isCollapsed ? 'none' : 'block'};
`;

const ToggleButton = styled.button<{ isCollapsed: boolean }>`
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: transform 0.3s ease;
  transform: ${props => props.isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)'};

  &:hover {
    color: #374151;
  }
`;

const ToggleIcon = styled.div`
  width: 0;
  height: 0;
  border-left: 6px solid currentColor;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
`;



interface FolderTreePanelProps {
  folders: FolderTree[];
  selectedFolder: FolderTree | null;
  onFolderSelect: (folder: FolderTree) => void;
  onCreateFolder: (parentId?: number) => void;
  onFolderMove: (folderId: number, targetParentId: number | null, orderIndex: number) => void;
  onRename: (folderId: number, newName: string) => void;
  onDelete: (folderId: number) => void;
  onCollapse?: (collapsed: boolean) => void;
  expandedFolders: Set<number>;
  setExpandedFolders: React.Dispatch<React.SetStateAction<Set<number>>>;
}

const FolderTreePanel: React.FC<FolderTreePanelProps> = ({
  folders,
  selectedFolder,
  onFolderSelect,
  onCreateFolder,
  onFolderMove,
  onRename,
  onDelete,
  onCollapse,
  expandedFolders,
  setExpandedFolders
}) => {

  // 폴더 목록이 변경되어도 확장 상태 유지
  React.useEffect(() => {
    console.log('📁 FolderTreePanel - 현재 확장된 폴더들:', Array.from(expandedFolders));
  }, [expandedFolders, folders]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleExpand = (folderId: number) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFolderClick = (folder: FolderTree) => {
    console.log('📁 FolderTreePanel에서 폴더 클릭됨:', folder.name, 'ID:', folder.id);
    onFolderSelect(folder);
  };



  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapse?.(newCollapsedState);
  };

  const renderFolderTree = (folderList: FolderTree[], depth: number = 0): React.ReactNode => {
    return folderList.map((folder) => {
      const isExpanded = expandedFolders.has(folder.id);
      const isSelected = selectedFolder?.id === folder.id;
      const hasChildren = folder.children && Array.isArray(folder.children) && folder.children.length > 0;

      return (
        <div key={folder.id}>
                      <FolderTreeItem
              folder={folder}
              depth={depth}
              isExpanded={isExpanded}
              isSelected={isSelected}
              hasChildren={hasChildren}
              onToggleExpand={() => handleToggleExpand(folder.id)}
              onClick={() => handleFolderClick(folder)}
              onCreateSubFolder={() => {
                console.log('📁 onCreateSubFolder 호출됨:', folder.name, 'ID:', folder.id);
                onCreateFolder(folder.id);
              }}
              onMove={onFolderMove}
              onRename={onRename}
              onDelete={onDelete}
            />
          {isExpanded && hasChildren && (
            <div style={{ marginLeft: 16 }}>
              {renderFolderTree(folder.children!, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <Container isCollapsed={isCollapsed}>
      <Header isCollapsed={isCollapsed}>
        <ToggleButton isCollapsed={isCollapsed} onClick={handleToggleCollapse}>
          <ToggleIcon />
        </ToggleButton>
        <Title isCollapsed={isCollapsed}>폴더 구조</Title>
      </Header>
      <TreeContainer isCollapsed={isCollapsed}>
        {folders.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
            폴더가 없습니다.
          </div>
        ) : (
          renderFolderTree(folders)
        )}
      </TreeContainer>
    </Container>
  );
};

export default FolderTreePanel;
