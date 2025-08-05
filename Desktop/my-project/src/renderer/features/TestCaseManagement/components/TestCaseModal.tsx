import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Typography from '../../../shared/components/Typography';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import Modal from '../../../shared/components/Modal';
import { TestCase } from '../../../../main/app/domains/folders/models/Folder';

// 스타일 컴포넌트
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StepInput = styled(Input)`
  flex: 1;
`;

const RemoveButton = styled.button`
  padding: 4px 8px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: #dc2626;
  }
`;

const AddButton = styled.button`
  padding: 8px 12px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #059669;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

interface TestCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (testCase: Partial<TestCase>) => void;
  testCase?: TestCase;
  folderId?: number;
}

const TestCaseModal: React.FC<TestCaseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  testCase,
  folderId
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    steps: [''],
    expected: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'draft' as 'draft' | 'active' | 'archived'
  });

  const [loading, setLoading] = useState(false);

  // 테스트케이스가 제공되면 폼 데이터 초기화
  useEffect(() => {
    if (testCase) {
      setFormData({
        name: testCase.name || '',
        description: testCase.description || '',
        steps: testCase.steps && testCase.steps.length > 0 ? testCase.steps : [''],
        expected: testCase.expected || '',
        priority: testCase.priority || 'medium',
        status: testCase.status || 'draft'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        steps: [''],
        expected: '',
        priority: 'medium',
        status: 'draft'
      });
    }
  }, [testCase]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData(prev => ({
      ...prev,
      steps: newSteps
    }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }));
  };

  const removeStep = (index: number) => {
    if (formData.steps.length > 1) {
      const newSteps = formData.steps.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        steps: newSteps
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('테스트케이스 이름을 입력해주세요.');
      return;
    }

    if (!folderId && !testCase) {
      alert('폴더를 선택해주세요.');
      return;
    }

    setLoading(true);
    
    try {
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        steps: formData.steps.filter(step => step.trim()),
        expected: formData.expected.trim(),
        priority: formData.priority,
        status: formData.status,
        folderId: testCase?.folderId || folderId,
        createdBy: 'system'
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('테스트케이스 저장 실패:', error);
      alert('테스트케이스 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{ padding: '20px', minWidth: '500px' }}>
        <Typography variant="h3" style={{ marginBottom: '20px' }}>
          {testCase ? '테스트케이스 수정' : '새 테스트케이스 생성'}
        </Typography>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>테스트케이스 이름 *</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="테스트케이스 이름을 입력하세요"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>설명</Label>
            <TextArea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="테스트케이스에 대한 설명을 입력하세요"
            />
          </FormGroup>

          <FormGroup>
            <Label>테스트 단계 *</Label>
            <StepsContainer>
              {formData.steps.map((step, index) => (
                <StepItem key={index}>
                  <StepInput
                    value={step}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                    placeholder={`단계 ${index + 1}`}
                  />
                  {formData.steps.length > 1 && (
                    <RemoveButton
                      type="button"
                      onClick={() => removeStep(index)}
                    >
                      삭제
                    </RemoveButton>
                  )}
                </StepItem>
              ))}
              <AddButton type="button" onClick={addStep}>
                단계 추가
              </AddButton>
            </StepsContainer>
          </FormGroup>

          <FormGroup>
            <Label>예상 결과 *</Label>
            <TextArea
              value={formData.expected}
              onChange={(e) => handleInputChange('expected', e.target.value)}
              placeholder="테스트 실행 후 예상되는 결과를 입력하세요"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>우선순위</Label>
            <Select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
            >
              <option value="high">높음</option>
              <option value="medium">보통</option>
              <option value="low">낮음</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>상태</Label>
            <Select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <option value="draft">초안</option>
              <option value="active">활성</option>
              <option value="archived">보관</option>
            </Select>
          </FormGroup>

          <ButtonGroup>
            <Button
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? '저장 중...' : (testCase ? '수정' : '생성')}
            </Button>
          </ButtonGroup>
        </Form>
      </div>
    </Modal>
  );
};

export default TestCaseModal; 