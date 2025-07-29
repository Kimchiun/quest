import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';

interface KeyboardShortcutsProps {
  onCopy?: () => void;
  onPaste?: () => void;
  onDelete?: () => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
}

export const useKeyboardShortcuts = ({
  onCopy,
  onPaste,
  onDelete,
  onSelectAll,
  onDeselectAll
}: KeyboardShortcutsProps) => {
  const dispatch = useDispatch();
  const selectedItems = useSelector((state: RootState) => state.selection.selectedTestCases || []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ctrl/Cmd + C: 복사
    if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
      event.preventDefault();
      if (onCopy && selectedItems.length > 0) {
        onCopy();
      }
    }
    
    // Ctrl/Cmd + V: 붙여넣기
    if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
      event.preventDefault();
      if (onPaste) {
        onPaste();
      }
    }
    
    // Delete: 삭제
    if (event.key === 'Delete') {
      event.preventDefault();
      if (onDelete && selectedItems.length > 0) {
        onDelete();
      }
    }
    
    // Ctrl/Cmd + A: 전체 선택
    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      event.preventDefault();
      if (onSelectAll) {
        onSelectAll();
      }
    }
    
    // Escape: 선택 해제
    if (event.key === 'Escape') {
      event.preventDefault();
      if (onDeselectAll) {
        onDeselectAll();
      }
    }
  }, [selectedItems.length, onCopy, onPaste, onDelete, onSelectAll, onDeselectAll]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    selectedItemsCount: selectedItems.length
  };
}; 