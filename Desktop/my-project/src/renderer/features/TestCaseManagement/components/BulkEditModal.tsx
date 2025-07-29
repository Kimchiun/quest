import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { TestCase } from '../../../../main/app/domains/testcases/models/TestCase';

interface BulkEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCases: TestCase[];
  onApply: (updates: Partial<TestCase>) => void;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  
  &:hover {
    color: #374151;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  margin-right: 8px;
  accent-color: #3b82f6;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
`;

const SelectedCasesList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
  background-color: #f9fafb;
  margin-bottom: 20px;
`;

const CaseItem = styled.div`
  padding: 8px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  background-color: ${props => props.variant === 'primary' ? '#3b82f6' : '#f3f4f6'};
  color: ${props => props.variant === 'primary' ? 'white' : '#374151'};
  
  &:hover {
    background-color: ${props => props.variant === 'primary' ? '#2563eb' : '#e5e7eb'};
  }
  
  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const BulkEditModal: React.FC<BulkEditModalProps> = ({
  isOpen,
  onClose,
  selectedCases,
  onApply
}) => {
  const [updates, setUpdates] = useState<Partial<TestCase>>({});
  const [fieldSelections, setFieldSelections] = useState<Set<string>>(new Set());

  const handleFieldToggle = useCallback((field: string) => {
    const newSelections = new Set(fieldSelections);
    if (newSelections.has(field)) {
      newSelections.delete(field);
      const newUpdates = { ...updates };
      delete (newUpdates as any)[field];
      setUpdates(newUpdates);
    } else {
      newSelections.add(field);
    }
    setFieldSelections(newSelections);
  }, [fieldSelections, updates]);

  const handleUpdateChange = useCallback((field: string, value: any) => {
    setUpdates(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleApply = useCallback(() => {
    if (Object.keys(updates).length === 0) return;
    
    onApply(updates);
    onClose();
    
    // 초기화
    setUpdates({});
    setFieldSelections(new Set());
  }, [updates, onApply, onClose]);

  const handleCancel = useCallback(() => {
    onClose();
    setUpdates({});
    setFieldSelections(new Set());
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>일괄 편집 ({selectedCases.length}개 선택)</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <SelectedCasesList>
          <strong>선택된 테스트케이스:</strong>
          {selectedCases.map(case_ => (
            <CaseItem key={case_.id}>
              {case_.title}
            </CaseItem>
          ))}
        </SelectedCasesList>

        <FormGroup>
          <CheckboxLabel>
            <Checkbox
              type="checkbox"
              checked={fieldSelections.has('status')}
              onChange={() => handleFieldToggle('status')}
            />
            상태 변경
          </CheckboxLabel>
          {fieldSelections.has('status') && (
            <Select
              value={updates.status || ''}
              onChange={(e) => handleUpdateChange('status', e.target.value)}
            >
              <option value="">선택하세요</option>
              <option value="Active">활성</option>
              <option value="Inactive">비활성</option>
              <option value="Draft">초안</option>
            </Select>
          )}
        </FormGroup>

        <FormGroup>
          <CheckboxLabel>
            <Checkbox
              type="checkbox"
              checked={fieldSelections.has('priority')}
              onChange={() => handleFieldToggle('priority')}
            />
            우선순위 변경
          </CheckboxLabel>
          {fieldSelections.has('priority') && (
            <Select
              value={updates.priority || ''}
              onChange={(e) => handleUpdateChange('priority', e.target.value)}
            >
              <option value="">선택하세요</option>
              <option value="High">높음</option>
              <option value="Medium">보통</option>
              <option value="Low">낮음</option>
            </Select>
          )}
        </FormGroup>

        <FormGroup>
          <CheckboxLabel>
            <Checkbox
              type="checkbox"
              checked={fieldSelections.has('createdBy')}
              onChange={() => handleFieldToggle('createdBy')}
            />
            담당자 변경
          </CheckboxLabel>
          {fieldSelections.has('createdBy') && (
            <Input
              type="text"
              placeholder="담당자 이름"
              value={updates.createdBy || ''}
              onChange={(e) => handleUpdateChange('createdBy', e.target.value)}
            />
          )}
        </FormGroup>

        <ButtonGroup>
          <Button onClick={handleCancel}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleApply}
            disabled={Object.keys(updates).length === 0}
          >
            적용 ({Object.keys(updates).length}개 필드)
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default BulkEditModal; 