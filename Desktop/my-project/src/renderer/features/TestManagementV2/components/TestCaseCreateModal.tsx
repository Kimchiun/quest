import React, { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 600px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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
  font-size: 20px;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  resize: vertical;
  min-height: 80px;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: 1px solid ${props => props.variant === 'primary' ? '#3b82f6' : '#d1d5db'};
  border-radius: 6px;
  background: ${props => props.variant === 'primary' ? '#3b82f6' : '#ffffff'};
  color: ${props => props.variant === 'primary' ? '#ffffff' : '#374151'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.variant === 'primary' ? '#2563eb' : '#f9fafb'};
    border-color: ${props => props.variant === 'primary' ? '#2563eb' : '#9ca3af'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface TestCase {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  type: 'Functional' | 'Non-Functional' | 'Integration' | 'Unit' | 'Regression';
  status: 'Active' | 'Inactive' | 'Deprecated';
  preconditions: string;
  steps: string[];
  expectedResult: string;
}

interface TestCaseCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (testCase: TestCase) => void;
  selectedFolderId?: number;
}

const TestCaseCreateModal: React.FC<TestCaseCreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedFolderId
}) => {
  const [formData, setFormData] = useState<TestCase>({
    title: '',
    description: '',
    priority: 'Medium',
    type: 'Functional',
    status: 'Active',
    preconditions: '',
    steps: [''],
    expectedResult: ''
  });

  const handleInputChange = (field: keyof TestCase, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStepChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? value : step)
    }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }));
  };

  const removeStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSubmit(formData);
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        type: 'Functional',
        status: 'Active',
        preconditions: '',
        steps: [''],
        expectedResult: ''
      });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'Medium',
      type: 'Functional',
      status: 'Active',
      preconditions: '',
      steps: [''],
      expectedResult: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>새 테스트케이스 생성</ModalTitle>
          <CloseButton onClick={handleClose}>&times;</CloseButton>
        </ModalHeader>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="테스트케이스 제목을 입력하세요"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">설명</Label>
            <TextArea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="테스트케이스에 대한 설명을 입력하세요"
            />
          </FormGroup>

          <div style={{ display: 'flex', gap: '16px' }}>
            <FormGroup style={{ flex: 1 }}>
              <Label htmlFor="priority">우선순위</Label>
              <Select
                id="priority"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value as 'High' | 'Medium' | 'Low')}
              >
                <option value="High">높음</option>
                <option value="Medium">보통</option>
                <option value="Low">낮음</option>
              </Select>
            </FormGroup>

            <FormGroup style={{ flex: 1 }}>
              <Label htmlFor="type">유형</Label>
              <Select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value as 'Functional' | 'Non-Functional' | 'Integration' | 'Unit' | 'Regression')}
              >
                <option value="Functional">Functional</option>
                <option value="Non-Functional">Non-Functional</option>
                <option value="Integration">Integration</option>
                <option value="Unit">Unit</option>
                <option value="Regression">Regression</option>
              </Select>
            </FormGroup>

            <FormGroup style={{ flex: 1 }}>
              <Label htmlFor="status">상태</Label>
              <Select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as 'Active' | 'Inactive' | 'Deprecated')}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Deprecated">Deprecated</option>
              </Select>
            </FormGroup>
          </div>

          <FormGroup>
            <Label htmlFor="preconditions">사전 조건</Label>
            <TextArea
              id="preconditions"
              value={formData.preconditions}
              onChange={(e) => handleInputChange('preconditions', e.target.value)}
              placeholder="테스트 실행을 위한 사전 조건을 입력하세요"
            />
          </FormGroup>

          <FormGroup>
            <Label>테스트 단계</Label>
            {formData.steps.map((step, index) => (
              <div key={index} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <span style={{
                    background: '#f3f4f6',
                    color: '#374151',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '600',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    {index + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <TextArea
                      value={step}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      placeholder={`단계 ${index + 1}를 입력하세요`}
                      style={{ minHeight: '60px' }}
                    />
                    {formData.steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        style={{
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          marginTop: '4px'
                        }}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addStep}
              style={{
                background: '#f3f4f6',
                color: '#374151',
                border: '1px dashed #d1d5db',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                width: '100%',
                marginTop: '8px'
              }}
            >
              + 단계 추가
            </button>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="expectedResult">예상 결과</Label>
            <TextArea
              id="expectedResult"
              value={formData.expectedResult}
              onChange={(e) => handleInputChange('expectedResult', e.target.value)}
              placeholder="테스트 실행 후 예상되는 결과를 입력하세요"
            />
          </FormGroup>

          <ButtonGroup>
            <Button type="button" onClick={handleClose}>
              취소
            </Button>
            <Button type="submit" variant="primary">
              생성
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default TestCaseCreateModal;
