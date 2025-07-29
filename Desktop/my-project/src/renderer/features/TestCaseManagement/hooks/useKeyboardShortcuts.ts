import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { clearAllSelections } from '../store/selectionSlice';

interface UseKeyboardShortcutsProps {
  onCopy?: () => void;
  onPaste?: () => void;
  onDelete?: () => void;
  onSelectAll?: () => void;
}

export const useKeyboardShortcuts = ({
  onCopy,
  onPaste,
  onDelete,
  onSelectAll,
}: UseKeyboardShortcutsProps = {}) => {
  const dispatch = useDispatch();
  const { selectedFolders, selectedTestCases } = useSelector((state: RootState) => state.selection);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + C (복사)
      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        event.preventDefault();
        if (onCopy && (selectedFolders.length > 0 || selectedTestCases.length > 0)) {
          onCopy();
        }
      }

      // Ctrl/Cmd + V (붙여넣기)
      if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        event.preventDefault();
        if (onPaste) {
          onPaste();
        }
      }

      // Delete 키 (삭제)
      if (event.key === 'Delete') {
        event.preventDefault();
        if (onDelete && (selectedFolders.length > 0 || selectedTestCases.length > 0)) {
          onDelete();
        }
      }

      // Ctrl/Cmd + A (전체 선택)
      if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        event.preventDefault();
        if (onSelectAll) {
          onSelectAll();
        }
      }

      // Esc 키 (선택 해제)
      if (event.key === 'Escape') {
        event.preventDefault();
        dispatch(clearAllSelections());
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch, selectedFolders.length, selectedTestCases.length, onCopy, onPaste, onDelete, onSelectAll]);

  return {
    hasSelection: selectedFolders.length > 0 || selectedTestCases.length > 0,
    selectedFolders,
    selectedTestCases,
  };
}; 