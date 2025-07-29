import { Middleware } from 'redux';

// RootState 타입을 직접 정의하여 순환 참조 방지
interface RootState {
  testcases: any;
  releases: any;
  dashboard: any;
  executions: any;
  comments: any;
  notifications: any;
  selection: any;
  users: any;
}

interface HistoryState {
  past: RootState[];
  present: RootState;
  future: RootState[];
}

interface UndoRedoAction {
  type: 'UNDO' | 'REDO';
}

const MAX_HISTORY_SIZE = 50;

export const undoRedoMiddleware: Middleware<{}, RootState> = store => {
  let history: HistoryState = {
    past: [],
    present: store.getState(),
    future: []
  };

  let isUndoRedoAction = false;

  return next => (action: any) => {
    // Undo/Redo 액션 처리
    if (action.type === 'UNDO') {
      if (history.past.length === 0) return;
      
      const previous = history.past[history.past.length - 1];
      const newPast = history.past.slice(0, history.past.length - 1);
      
      history = {
        past: newPast,
        present: previous,
        future: [history.present, ...history.future]
      };
      
      isUndoRedoAction = true;
      store.dispatch({ type: 'RESTORE_STATE', payload: previous });
      return;
    }

    if (action.type === 'REDO') {
      if (history.future.length === 0) return;
      
      const next = history.future[0];
      const newFuture = history.future.slice(1);
      
      history = {
        past: [...history.past, history.present],
        present: next,
        future: newFuture
      };
      
      isUndoRedoAction = true;
      store.dispatch({ type: 'RESTORE_STATE', payload: next });
      return;
    }

    // RESTORE_STATE 액션은 히스토리에 추가하지 않음
    if (action.type === 'RESTORE_STATE') {
      return next(action);
    }

    // 일반 액션 처리
    const result = next(action);
    
    if (!isUndoRedoAction) {
      const newPresent = store.getState();
      
      // 히스토리 크기 제한
      const newPast = [...history.past, history.present];
      if (newPast.length > MAX_HISTORY_SIZE) {
        newPast.shift();
      }
      
      history = {
        past: newPast,
        present: newPresent,
        future: []
      };
    }
    
    isUndoRedoAction = false;
    return result;
  };
};

// 키보드 단축키 처리
export const setupUndoRedoShortcuts = (store: any) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey) {
      if (event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        store.dispatch({ type: 'UNDO' });
      } else if ((event.key === 'y') || (event.key === 'z' && event.shiftKey)) {
        event.preventDefault();
        store.dispatch({ type: 'REDO' });
      }
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  
  // 클린업 함수 반환
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
};

// Undo/Redo 가능 여부 확인
export const canUndo = (state: RootState): boolean => {
  // 실제 구현에서는 히스토리 상태를 확인
  return true;
};

export const canRedo = (state: RootState): boolean => {
  // 실제 구현에서는 히스토리 상태를 확인
  return true;
}; 