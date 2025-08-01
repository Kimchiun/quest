import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from '../../../shared/components/Modal';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import Typography from '../../../shared/components/Typography';
import Icon from '../../../shared/components/Icon';

const ModalContent = styled.div`
  width: 100%;
  max-width: 700px;
  max-height: 80vh;
  overflow-y: auto;
  background: white;
  border-radius: 8px;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #6b7280;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 18px;
  line-height: 1;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const FormSection = styled.div`
  margin-bottom: 24px;
`;

const SectionHeader = styled.div`
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
`;

const FieldLabel = styled.label`
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
  font-size: 14px;
  
  &.required::after {
    content: ' *';
    color: #ef4444;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }

  &:hover {
    border-color: #9ca3af;
  }
`;

const TextArea = styled.textarea<{ $error?: boolean }>`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid ${({ $error }) => $error ? '#ef4444' : '#d1d5db'};
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  transition: border-color 0.2s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }

  &:hover {
    border-color: #9ca3af;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const StepsContainer = styled.div`
  margin-top: 16px;
`;

const StepItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
`;

const StepNumber = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

const AddStepButton = styled(Button)`
  margin-top: 12px;
  width: 100%;
  padding: 12px;
  border: 1px dashed #d1d5db;
  background: transparent;
  color: #6b7280;
  font-weight: 500;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    background: #f0f9ff;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PriorityBadge = styled.span<{ priority: string }>`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ priority }) => {
    switch (priority) {
      case 'High':
        return '#fef2f2';
      case 'Medium':
        return '#fffbeb';
      case 'Low':
        return '#f0fdf4';
      default:
        return '#f3f4f6';
    }
  }};
  color: ${({ priority }) => {
    switch (priority) {
      case 'High':
        return '#dc2626';
      case 'Medium':
        return '#d97706';
      case 'Low':
        return '#16a34a';
      default:
        return '#6b7280';
    }
  }};
`;

export interface TestCaseFormData {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Draft' | 'Active' | 'Inactive';
  steps: string[];
  expectedResult: string;
  tags: string;
}

interface TestCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TestCaseFormData) => void;
  initialData?: Partial<TestCaseFormData>;
  mode: 'create' | 'edit';
}

const TestCaseModal: React.FC<TestCaseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode
}) => {
  const [formData, setFormData] = useState<TestCaseFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'Medium',
    status: initialData?.status || 'Draft',
    steps: initialData?.steps || [''],
    expectedResult: initialData?.expectedResult || '',
    tags: initialData?.tags || ''
  });

  const [errors, setErrors] = useState<Partial<TestCaseFormData>>({});

  const handleInputChange = (field: keyof TestCaseFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const addStep = () => {
    setFormData(prev => ({ ...prev, steps: [...prev.steps, ''] }));
  };

  const removeStep = (index: number) => {
    if (formData.steps.length > 1) {
      const newSteps = formData.steps.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, steps: newSteps }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<TestCaseFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    }

    if (!formData.description.trim()) {
      newErrors.description = '설명을 입력해주세요';
    }

    if (formData.steps.some(step => !step.trim())) {
      newErrors.steps = '모든 단계를 입력해주세요';
    }

    if (!formData.expectedResult.trim()) {
      newErrors.expectedResult = '예상 결과를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {mode === 'create' ? '테스트 케이스 생성' : '테스트 케이스 편집'}
          </ModalTitle>
          <CloseButton onClick={handleCancel}>
            ×
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <FormSection>
            <SectionHeader>
              <SectionTitle>기본 정보</SectionTitle>
            </SectionHeader>
            
            <FormField style={{ marginBottom: '16px' }}>
              <FieldLabel className="required">제목</FieldLabel>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="예) 로그인 기능 테스트"
                error={!!errors.title}
              />
              {errors.title && (
                <ErrorMessage>
                  {errors.title}
                </ErrorMessage>
              )}
            </FormField>

            <FormField style={{ marginBottom: '24px' }}>
              <FieldLabel className="required">설명</FieldLabel>
              <TextArea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="테스트 케이스에 대한 상세한 설명을 입력하세요"
                $error={!!errors.description}
              />
              {errors.description && (
                <ErrorMessage>
                  {errors.description}
                </ErrorMessage>
              )}
            </FormField>
          </FormSection>

          <FormSection>
            <SectionHeader>
              <SectionTitle>메타 정보</SectionTitle>
            </SectionHeader>
            
            <FormRow>
              <FormField>
                <FieldLabel>우선순위</FieldLabel>
                <StyledSelect
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                >
                  <option value="High">높음</option>
                  <option value="Medium">보통</option>
                  <option value="Low">낮음</option>
                </StyledSelect>
                <div style={{ marginTop: '6px' }}>
                  <PriorityBadge priority={formData.priority}>
                    {formData.priority === 'High' ? '높음' : 
                     formData.priority === 'Medium' ? '보통' : '낮음'}
                  </PriorityBadge>
                </div>
              </FormField>
              <FormField>
                <FieldLabel>상태</FieldLabel>
                <StyledSelect
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="Draft">초안</option>
                  <option value="Active">활성</option>
                  <option value="Inactive">비활성</option>
                </StyledSelect>
              </FormField>
            </FormRow>

            <FormField style={{ marginTop: '16px' }}>
              <FieldLabel>태그</FieldLabel>
              <Input
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="예) 로그인, 인증, UI"
              />
            </FormField>
          </FormSection>

          <FormSection>
            <SectionHeader>
              <SectionTitle>테스트 단계</SectionTitle>
            </SectionHeader>
            <StepsContainer>
              {formData.steps.map((step, index) => (
                <StepItem key={index}>
                  <StepNumber>{index + 1}</StepNumber>
                  <StepContent>
                    <TextArea
                      value={step}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      placeholder={`단계 ${index + 1}을 입력하세요`}
                      style={{ minHeight: '60px' }}
                      $error={!!errors.steps && !step.trim()}
                    />
                  </StepContent>
                  <StepActions>
                    {formData.steps.length > 1 && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => removeStep(index)}
                        style={{ 
                          padding: '6px 10px',
                          fontSize: '12px',
                          minWidth: '50px'
                        }}
                      >
                        삭제
                      </Button>
                    )}
                  </StepActions>
                </StepItem>
              ))}
              <AddStepButton
                size="sm"
                variant="ghost"
                onClick={addStep}
              >
                + 단계 추가
              </AddStepButton>
            </StepsContainer>
          </FormSection>

          <FormSection>
            <SectionHeader>
              <SectionTitle>예상 결과</SectionTitle>
            </SectionHeader>
            <FormField>
              <TextArea
                value={formData.expectedResult}
                onChange={(e) => handleInputChange('expectedResult', e.target.value)}
                placeholder="테스트 실행 후 예상되는 결과를 입력하세요"
                $error={!!errors.expectedResult}
              />
              {errors.expectedResult && (
                <ErrorMessage>
                  {errors.expectedResult}
                </ErrorMessage>
              )}
            </FormField>
          </FormSection>
        </ModalBody>

        <ModalActions>
          <Button variant="secondary" onClick={handleCancel}>
            취소
          </Button>
          <Button onClick={handleSubmit}>
            {mode === 'create' ? '생성' : '저장'}
          </Button>
        </ModalActions>
      </ModalContent>
    </Modal>
  );
};

export default TestCaseModal; 