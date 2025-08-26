import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// 타입 정의
interface ReleaseFormData {
  // 1단계: 기본 정보
  name: string;
  version: string;
  description: string;
  startAt: string;
  endAt: string;
  owners: string[];
  watchers: string[];
  tags: string[];

  // 2단계: 스코프 선택
  scopeMode: 'live' | 'snapshot';
  scopeSelectors: {
    folders: string[];
    tags: string[];
    searchQuery: string;
  };

  // 3단계: 환경 & 일정
  environments: string[];
  milestones: {
    name: string;
    date: string;
    description: string;
  }[];

  // 4단계: 게이트/정책
  gateCriteria: {
    minPassRate: number;
    maxFailCritical: number;
    zeroBlockers: boolean;
    coverageByPriority: {
      P0: number;
      P1: number;
      P2: number;
    };
  };
  autoSyncScope: boolean;
  allowReopen: boolean;
}

interface ReleaseCreateWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReleaseFormData) => void;
}

// 애니메이션
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// 스타일 컴포넌트
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  width: 800px;
  max-width: 90vw;
  max-height: 90vh;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: ${slideUp} 0.3s ease-out;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
`;

const ModalSubtitle = styled.p`
  margin: 8px 0 0 0;
  font-size: 14px;
  color: #6b7280;
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 32px;
`;

const ModalFooter = styled.div`
  padding: 24px 32px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
`;

const Step = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  background: ${props => {
    if (props.isCompleted) return '#10b981';
    if (props.isActive) return '#3b82f6';
    return '#e5e7eb';
  }};
  color: ${props => {
    if (props.isCompleted || props.isActive) return 'white';
    return '#6b7280';
  }};
  transition: all 0.2s;
`;

const StepLabel = styled.span<{ isActive: boolean; isCompleted: boolean }>`
  font-size: 14px;
  font-weight: ${props => props.isActive ? '600' : '500'};
  color: ${props => {
    if (props.isCompleted) return '#10b981';
    if (props.isActive) return '#3b82f6';
    return '#6b7280';
  }};
`;

const StepConnector = styled.div<{ isCompleted: boolean }>`
  width: 40px;
  height: 2px;
  background: ${props => props.isCompleted ? '#10b981' : '#e5e7eb'};
  transition: background 0.2s;
`;

const FormSection = styled.div`
  margin-bottom: 32px;
`;

const FormSectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    background: #f0f9ff;
  }

  input[type="radio"]:checked + & {
    border-color: #3b82f6;
    background: #eff6ff;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const CheckboxOption = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    background: #f0f9ff;
  }

  input[type="checkbox"]:checked + & {
    border-color: #3b82f6;
    background: #eff6ff;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #3b82f6;
          color: white;
          &:hover { background: #2563eb; }
          &:active { background: #1d4ed8; }
        `;
      case 'secondary':
        return `
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
          &:hover { background: #f9fafb; border-color: #9ca3af; }
        `;
      case 'danger':
        return `
          background: #ef4444;
          color: white;
          &:hover { background: #dc2626; }
          &:active { background: #b91c1c; }
        `;
      default:
        return `
          background: #6b7280;
          color: white;
          &:hover { background: #4b5563; }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TagInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  min-height: 42px;
  align-items: center;
`;

const Tag = styled.span`
  background: #eff6ff;
  color: #1e40af;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TagRemoveButton = styled.button`
  background: none;
  border: none;
  color: #1e40af;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
  margin-left: 4px;

  &:hover {
    color: #dc2626;
  }
`;

const TagInputField = styled.input`
  border: none;
  outline: none;
  font-size: 14px;
  flex: 1;
  min-width: 100px;
`;

const PreviewCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
`;

const PreviewTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

const PreviewItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
`;

const PreviewLabel = styled.span`
  color: #6b7280;
`;

const PreviewValue = styled.span`
  color: #111827;
  font-weight: 500;
`;

const ReleaseCreateWizard: React.FC<ReleaseCreateWizardProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ReleaseFormData>({
    name: '',
    version: '',
    description: '',
    startAt: '',
    endAt: '',
    owners: [],
    watchers: [],
    tags: [],
    scopeMode: 'live',
    scopeSelectors: {
      folders: [],
      tags: [],
      searchQuery: ''
    },
    environments: [],
    milestones: [],
    gateCriteria: {
      minPassRate: 85,
      maxFailCritical: 0,
      zeroBlockers: true,
      coverageByPriority: {
        P0: 100,
        P1: 95,
        P2: 90
      }
    },
    autoSyncScope: true,
    allowReopen: false
  });

  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, title: '기본 정보' },
    { id: 2, title: '스코프 선택' },
    { id: 3, title: '환경 & 일정' },
    { id: 4, title: '게이트/정책' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScopeSelectorChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      scopeSelectors: {
        ...prev.scopeSelectors,
        [field]: value
      }
    }));
  };

  const handleGateCriteriaChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      gateCriteria: {
        ...prev.gateCriteria,
        [field]: value
      }
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('릴리즈 생성 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.version && formData.startAt && formData.endAt;
      case 2:
        return true; // 스코프는 선택사항
      case 3:
        return formData.environments.length > 0;
      case 4:
        return true; // 게이트 기준은 기본값 사용
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <FormSection>
              <FormSectionTitle>릴리즈 기본 정보</FormSectionTitle>
              
              <FormGroup>
                <Label>릴리즈 이름 *</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="예: 2024.12.0 릴리즈"
                />
              </FormGroup>

              <FormGroup>
                <Label>버전 *</Label>
                <Input
                  type="text"
                  value={formData.version}
                  onChange={(e) => handleInputChange('version', e.target.value)}
                  placeholder="예: 2024.12.0"
                />
              </FormGroup>

              <FormGroup>
                <Label>설명</Label>
                <TextArea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="릴리즈에 대한 설명을 입력하세요"
                />
              </FormGroup>

              <FormGroup>
                <Label>시작일 *</Label>
                <Input
                  type="date"
                  value={formData.startAt}
                  onChange={(e) => handleInputChange('startAt', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>종료일 *</Label>
                <Input
                  type="date"
                  value={formData.endAt}
                  onChange={(e) => handleInputChange('endAt', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>태그</Label>
                <TagInput>
                  {formData.tags.map((tag, index) => (
                    <Tag key={index}>
                      {tag}
                      <TagRemoveButton onClick={() => handleRemoveTag(tag)}>
                        ×
                      </TagRemoveButton>
                    </Tag>
                  ))}
                  <TagInputField
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="태그 입력 후 Enter"
                  />
                </TagInput>
              </FormGroup>
            </FormSection>
          </>
        );

      case 2:
        return (
          <>
            <FormSection>
              <FormSectionTitle>스코프 모드 선택</FormSectionTitle>
              
              <RadioGroup>
                <RadioOption>
                  <input
                    type="radio"
                    name="scopeMode"
                    value="live"
                    checked={formData.scopeMode === 'live'}
                    onChange={(e) => handleInputChange('scopeMode', e.target.value)}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>Live Link</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      선택 기준에 따라 실시간으로 TC 변화 반영
                    </div>
                  </div>
                </RadioOption>
                
                <RadioOption>
                  <input
                    type="radio"
                    name="scopeMode"
                    value="snapshot"
                    checked={formData.scopeMode === 'snapshot'}
                    onChange={(e) => handleInputChange('scopeMode', e.target.value)}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>Snapshot</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      선택 시점의 TC 집합을 동결
                    </div>
                  </div>
                </RadioOption>
              </RadioGroup>
            </FormSection>

            <FormSection>
              <FormSectionTitle>스코프 선택 기준</FormSectionTitle>
              
              <FormGroup>
                <Label>폴더 선택</Label>
                <CheckboxGroup>
                  <CheckboxOption>
                    <input
                      type="checkbox"
                      value="folder1"
                      onChange={(e) => {
                        const folders = e.target.checked
                          ? [...formData.scopeSelectors.folders, e.target.value]
                          : formData.scopeSelectors.folders.filter(f => f !== e.target.value);
                        handleScopeSelectorChange('folders', folders);
                      }}
                    />
                    폴더 1
                  </CheckboxOption>
                  <CheckboxOption>
                    <input
                      type="checkbox"
                      value="folder2"
                      onChange={(e) => {
                        const folders = e.target.checked
                          ? [...formData.scopeSelectors.folders, e.target.value]
                          : formData.scopeSelectors.folders.filter(f => f !== e.target.value);
                        handleScopeSelectorChange('folders', folders);
                      }}
                    />
                    폴더 2
                  </CheckboxOption>
                </CheckboxGroup>
              </FormGroup>

              <FormGroup>
                <Label>태그 필터</Label>
                <Input
                  type="text"
                  value={formData.scopeSelectors.searchQuery}
                  onChange={(e) => handleScopeSelectorChange('searchQuery', e.target.value)}
                  placeholder="예: regression OR smoke"
                />
              </FormGroup>
            </FormSection>
          </>
        );

      case 3:
        return (
          <>
            <FormSection>
              <FormSectionTitle>테스트 환경</FormSectionTitle>
              
              <CheckboxGroup>
                <CheckboxOption>
                  <input
                    type="checkbox"
                    value="chrome"
                    onChange={(e) => {
                      const envs = e.target.checked
                        ? [...formData.environments, e.target.value]
                        : formData.environments.filter(env => env !== e.target.value);
                      handleInputChange('environments', envs);
                    }}
                  />
                  Chrome
                </CheckboxOption>
                <CheckboxOption>
                  <input
                    type="checkbox"
                    value="firefox"
                    onChange={(e) => {
                      const envs = e.target.checked
                        ? [...formData.environments, e.target.value]
                        : formData.environments.filter(env => env !== e.target.value);
                      handleInputChange('environments', envs);
                    }}
                  />
                  Firefox
                </CheckboxOption>
                <CheckboxOption>
                  <input
                    type="checkbox"
                    value="safari"
                    onChange={(e) => {
                      const envs = e.target.checked
                        ? [...formData.environments, e.target.value]
                        : formData.environments.filter(env => env !== e.target.value);
                      handleInputChange('environments', envs);
                    }}
                  />
                  Safari
                </CheckboxOption>
              </CheckboxGroup>
            </FormSection>

            <FormSection>
              <FormSectionTitle>마일스톤</FormSectionTitle>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                마일스톤 기능은 향후 구현 예정입니다.
              </p>
            </FormSection>
          </>
        );

      case 4:
        return (
          <>
            <FormSection>
              <FormSectionTitle>게이트 기준</FormSectionTitle>
              
              <FormGroup>
                <Label>최소 통과율 (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.gateCriteria.minPassRate}
                  onChange={(e) => handleGateCriteriaChange('minPassRate', parseInt(e.target.value))}
                />
              </FormGroup>

              <FormGroup>
                <Label>최대 Critical 실패 수</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.gateCriteria.maxFailCritical}
                  onChange={(e) => handleGateCriteriaChange('maxFailCritical', parseInt(e.target.value))}
                />
              </FormGroup>

              <FormGroup>
                <CheckboxOption>
                  <input
                    type="checkbox"
                    checked={formData.gateCriteria.zeroBlockers}
                    onChange={(e) => handleGateCriteriaChange('zeroBlockers', e.target.checked)}
                  />
                  Blocker = 0에서만 사인오프 허용
                </CheckboxOption>
              </FormGroup>

              <FormGroup>
                <Label>우선순위별 커버리지</Label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <Label>P0 (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.gateCriteria.coverageByPriority.P0}
                      onChange={(e) => handleGateCriteriaChange('coverageByPriority', {
                        ...formData.gateCriteria.coverageByPriority,
                        P0: parseInt(e.target.value)
                      })}
                    />
                  </div>
                  <div>
                    <Label>P1 (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.gateCriteria.coverageByPriority.P1}
                      onChange={(e) => handleGateCriteriaChange('coverageByPriority', {
                        ...formData.gateCriteria.coverageByPriority,
                        P1: parseInt(e.target.value)
                      })}
                    />
                  </div>
                </div>
              </FormGroup>
            </FormSection>

            <FormSection>
              <FormSectionTitle>정책 설정</FormSectionTitle>
              
              <FormGroup>
                <CheckboxOption>
                  <input
                    type="checkbox"
                    checked={formData.autoSyncScope}
                    onChange={(e) => handleInputChange('autoSyncScope', e.target.checked)}
                  />
                  스코프 자동 동기화
                </CheckboxOption>
              </FormGroup>

              <FormGroup>
                <CheckboxOption>
                  <input
                    type="checkbox"
                    checked={formData.allowReopen}
                    onChange={(e) => handleInputChange('allowReopen', e.target.checked)}
                  />
                  완료 후 재오픈 허용
                </CheckboxOption>
              </FormGroup>
            </FormSection>

            <PreviewCard>
              <PreviewTitle>릴리즈 미리보기</PreviewTitle>
              <PreviewItem>
                <PreviewLabel>이름:</PreviewLabel>
                <PreviewValue>{formData.name || '미입력'}</PreviewValue>
              </PreviewItem>
              <PreviewItem>
                <PreviewLabel>버전:</PreviewLabel>
                <PreviewValue>{formData.version || '미입력'}</PreviewValue>
              </PreviewItem>
              <PreviewItem>
                <PreviewLabel>기간:</PreviewLabel>
                <PreviewValue>
                  {formData.startAt && formData.endAt 
                    ? `${formData.startAt} ~ ${formData.endAt}`
                    : '미입력'
                  }
                </PreviewValue>
              </PreviewItem>
              <PreviewItem>
                <PreviewLabel>스코프 모드:</PreviewLabel>
                <PreviewValue>
                  {formData.scopeMode === 'live' ? 'Live Link' : 'Snapshot'}
                </PreviewValue>
              </PreviewItem>
              <PreviewItem>
                <PreviewLabel>환경:</PreviewLabel>
                <PreviewValue>
                  {formData.environments.length > 0 
                    ? formData.environments.join(', ')
                    : '미선택'
                  }
                </PreviewValue>
              </PreviewItem>
            </PreviewCard>
          </>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>새 릴리즈 생성</ModalTitle>
          <ModalSubtitle>
            {steps[currentStep - 1].title} - 단계 {currentStep} / 4
          </ModalSubtitle>
        </ModalHeader>

        <ModalBody>
          <StepIndicator>
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Step
                    isActive={currentStep === step.id}
                    isCompleted={currentStep > step.id}
                  >
                    {currentStep > step.id ? '✓' : step.id}
                  </Step>
                  <StepLabel
                    isActive={currentStep === step.id}
                    isCompleted={currentStep > step.id}
                  >
                    {step.title}
                  </StepLabel>
                </div>
                {index < steps.length - 1 && (
                  <StepConnector isCompleted={currentStep > step.id} />
                )}
              </React.Fragment>
            ))}
          </StepIndicator>

          {renderStepContent()}
        </ModalBody>

        <ModalFooter>
          <div style={{ display: 'flex', gap: '12px' }}>
            {currentStep > 1 && (
              <Button variant="secondary" onClick={prevStep}>
                이전
              </Button>
            )}
            <Button variant="secondary" onClick={onClose}>
              취소
            </Button>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {currentStep < 4 ? (
              <Button
                variant="primary"
                onClick={nextStep}
                disabled={!isStepValid()}
              >
                다음
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
              >
                {isSubmitting ? '생성 중...' : '릴리즈 생성'}
              </Button>
            )}
          </div>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ReleaseCreateWizard;
