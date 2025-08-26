import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

interface EditableCellProps {
  value: string | number | boolean;
  type?: 'text' | 'select' | 'checkbox';
  options?: { value: string; label: string }[];
  onSave: (value: string | number | boolean) => void;
  onCancel?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const CellContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const DisplayValue = styled.div`
  padding: 8px 12px;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #e2e8f0;
    background-color: #f8fafc;
  }
  
  &.editing {
    border-color: #3b82f6;
    background-color: #eff6ff;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #3b82f6;
  border-radius: 4px;
  font-size: inherit;
  font-family: inherit;
  outline: none;
  background-color: white;
  
  &:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #3b82f6;
  border-radius: 4px;
  font-size: inherit;
  font-family: inherit;
  outline: none;
  background-color: white;
  cursor: pointer;
  
  &:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #3b82f6;
`;

const SaveIndicator = styled.div`
  position: absolute;
  top: -20px;
  right: 0;
  background-color: #10b981;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  &.saving {
    opacity: 1;
  }
`;

const EditableCell: React.FC<EditableCellProps> = ({
  value,
  type = 'text',
  options = [],
  onSave,
  onCancel,
  placeholder = '',
  disabled = false,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // 편집 모드 진입
  const startEditing = useCallback(() => {
    if (disabled) return;
    setIsEditing(true);
    setEditValue(value);
  }, [disabled, value]);

  // 편집 모드 종료
  const stopEditing = useCallback(() => {
    setIsEditing(false);
    setIsSaving(false);
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
  }, []);

  // 저장 실행
  const saveValue = useCallback(() => {
    if (editValue !== value) {
      setIsSaving(true);
      onSave(editValue);
      
      // 저장 완료 표시 후 숨김
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    }
    stopEditing();
  }, [editValue, value, onSave, stopEditing]);

  // 취소
  const cancelEdit = useCallback(() => {
    setEditValue(value);
    stopEditing();
    onCancel?.();
  }, [value, stopEditing, onCancel]);

  // 자동저장 (debounce)
  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      if (editValue !== value) {
        setIsSaving(true);
        onSave(editValue);
        setTimeout(() => setIsSaving(false), 1000);
      }
    }, 500);
  }, [editValue, value, onSave]);

  // 키보드 이벤트 처리
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveValue();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  }, [saveValue, cancelEdit]);

  // 값 변경 시 자동저장
  useEffect(() => {
    if (isEditing && editValue !== value) {
      debouncedSave();
    }
  }, [editValue, isEditing, value, debouncedSave]);

  // 포커스 관리
  useEffect(() => {
    if (isEditing) {
      if (type === 'select' && selectRef.current) {
        selectRef.current.focus();
      } else if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [isEditing, type]);

  // 값 변경 시 편집값 동기화
  useEffect(() => {
    if (!isEditing) {
      setEditValue(value);
    }
  }, [value, isEditing]);

  // 렌더링 함수들
  const renderDisplayValue = () => {
    if (type === 'checkbox') {
      return (
        <Checkbox
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onSave(e.target.checked)}
          disabled={disabled}
        />
      );
    }
    
    if (type === 'select') {
      const option = options.find(opt => opt.value === String(value));
      return option?.label || String(value);
    }
    
    return String(value);
  };

  const renderEditInput = () => {
    if (type === 'select') {
      return (
        <Select
          ref={selectRef}
          value={String(editValue)}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={saveValue}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      );
    }
    
    if (type === 'checkbox') {
      return (
        <Checkbox
          type="checkbox"
          checked={Boolean(editValue)}
          onChange={(e) => setEditValue(e.target.checked)}
          onKeyDown={handleKeyDown}
          onBlur={saveValue}
        />
      );
    }
    
    return (
      <Input
        ref={inputRef}
        type="text"
        value={String(editValue)}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={saveValue}
        placeholder={placeholder}
      />
    );
  };

  return (
    <CellContainer className={className}>
      {isEditing ? (
        renderEditInput()
      ) : (
        <DisplayValue
          onClick={startEditing}
          className={isEditing ? 'editing' : ''}
        >
          {renderDisplayValue()}
        </DisplayValue>
      )}
      
      <SaveIndicator className={isSaving ? 'saving' : ''}>
        저장됨
      </SaveIndicator>
    </CellContainer>
  );
};

export default EditableCell; 