import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// 애니메이션 정의
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  width: 700px;
  max-width: 90vw;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: ${slideUp} 0.3s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.025em;
`;

const CloseButton = styled.button`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  font-size: 18px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    color: #475569;
    transform: scale(1.05);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  background: #ffffff;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  resize: vertical;
  min-height: 80px;
  transition: all 0.2s ease;
  background: #ffffff;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

// 커스텀 드롭다운 컴포넌트
const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.button<{ isOpen: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
  color: #374151;

  &:hover {
    border-color: #d1d5db;
  }

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  ${props => props.isOpen && `
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  `}
`;

const DropdownArrow = styled.span<{ isOpen: boolean }>`
  transition: transform 0.2s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  color: #6b7280;
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 10;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
`;

const DropdownItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: #374151;

  &:hover {
    background: #f8fafc;
  }

  &:first-child {
    border-radius: 0;
  }

  &:last-child {
    border-radius: 0 0 6px 6px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: 2px solid ${props => props.variant === 'primary' ? '#3b82f6' : '#e5e7eb'};
  border-radius: 8px;
  background: ${props => props.variant === 'primary' ? '#3b82f6' : '#ffffff'};
  color: ${props => props.variant === 'primary' ? '#ffffff' : '#374151'};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.variant === 'primary' ? '#2563eb' : '#f8fafc'};
    border-color: ${props => props.variant === 'primary' ? '#2563eb' : '#d1d5db'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const StepContainer = styled.div`
  margin-bottom: 16px;
`;

const StepHeader = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const StepNumber = styled.div`
  color: #6b7280;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
  margin-top: 8px;
  margin-right: 12px;
  min-width: 20px;
`;

const StepContent = styled.div`
  flex: 1;
  width: 100%;
  
  textarea {
    width: 100%;
    min-width: 400px;
  }
`;

const StepActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const ActionButton = styled.button<{ variant?: 'danger' | 'secondary' }>`
  padding: 6px 12px;
  border: 1px solid ${props => props.variant === 'danger' ? '#fecaca' : '#e5e7eb'};
  border-radius: 6px;
  background: ${props => props.variant === 'danger' ? '#fef2f2' : '#f9fafb'};
  color: ${props => props.variant === 'danger' ? '#dc2626' : '#6b7280'};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.variant === 'danger' ? '#fee2e2' : '#f3f4f6'};
    border-color: ${props => props.variant === 'danger' ? '#fca5a5' : '#d1d5db'};
  }
`;

const AddStepButton = styled.button`
  background: #f8fafc;
  color: #374151;
  border: 2px dashed #d1d5db;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  margin-top: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    border-color: #9ca3af;
    color: #1f2937;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

// 커스텀 드롭다운 컴포넌트
interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = "선택하세요"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownButton
        type="button"
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <DropdownArrow isOpen={isOpen}>▼</DropdownArrow>
      </DropdownButton>
      <DropdownMenu isOpen={isOpen}>
        {options.map((option) => (
          <DropdownItem
            key={option.value}
            onClick={() => {
              onChange(option.value);
              setIsOpen(false);
            }}
          >
            {option.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </DropdownContainer>
  );
};

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

          <FormRow>
            <FormGroup>
              <Label>우선순위</Label>
              <CustomDropdown
                value={formData.priority}
                onChange={(value) => handleInputChange('priority', value as 'High' | 'Medium' | 'Low')}
                options={[
                  { value: 'High', label: '높음' },
                  { value: 'Medium', label: '보통' },
                  { value: 'Low', label: '낮음' }
                ]}
              />
            </FormGroup>

            <FormGroup>
              <Label>유형</Label>
              <CustomDropdown
                value={formData.type}
                onChange={(value) => handleInputChange('type', value as 'Functional' | 'Non-Functional' | 'Integration' | 'Unit' | 'Regression')}
                options={[
                  { value: 'Functional', label: 'Functional' },
                  { value: 'Non-Functional', label: 'Non-Functional' },
                  { value: 'Integration', label: 'Integration' },
                  { value: 'Unit', label: 'Unit' },
                  { value: 'Regression', label: 'Regression' }
                ]}
              />
            </FormGroup>

            <FormGroup>
              <Label>상태</Label>
              <CustomDropdown
                value={formData.status}
                onChange={(value) => handleInputChange('status', value as 'Active' | 'Inactive' | 'Deprecated')}
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                  { value: 'Deprecated', label: 'Deprecated' }
                ]}
              />
            </FormGroup>
          </FormRow>

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
              <StepContainer key={index}>
                <StepHeader>
                  <StepNumber>{index + 1}</StepNumber>
                  <StepContent>
                    <TextArea
                      value={step}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      placeholder={`단계 ${index + 1}를 입력하세요`}
                      style={{ minHeight: '60px' }}
                    />
                    {formData.steps.length > 1 && (
                      <StepActions>
                        <ActionButton
                          type="button"
                          variant="danger"
                          onClick={() => removeStep(index)}
                        >
                          삭제
                        </ActionButton>
                      </StepActions>
                    )}
                  </StepContent>
                </StepHeader>
              </StepContainer>
            ))}
            <AddStepButton type="button" onClick={addStep}>
              + 단계 추가
            </AddStepButton>
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
