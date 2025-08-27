import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface ReleaseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (releaseData: ReleaseFormData) => void;
  release: Release | null;
}

interface ReleaseFormData {
  name: string;
  version: string;
  description: string;
  startDate: string;
  endDate: string;
  assignee: string;
  status: 'draft' | 'in-progress' | 'testing' | 'ready' | 'released';
}

interface Release {
  id: string;
  name: string;
  version: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  assignee: string;
  assignee_name?: string;
  updatedAt: string;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #1f2937;
  font-size: 20px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
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

const Input = styled.input<{ error?: boolean }>`
  padding: 10px 12px;
  border: 1px solid ${props => props.error ? '#ef4444' : '#d1d5db'};
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const TextArea = styled.textarea<{ error?: boolean }>`
  padding: 10px 12px;
  border: 1px solid ${props => props.error ? '#ef4444' : '#d1d5db'};
  border-radius: 6px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select<{ error?: boolean }>`
  padding: 10px 12px;
  border: 1px solid ${props => props.error ? '#ef4444' : '#d1d5db'};
  border-radius: 6px;
  font-size: 14px;
  background: white;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.variant === 'primary' ? `
    background: #3b82f6;
    color: white;
    &:hover:not(:disabled) {
      background: #2563eb;
    }
    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  ` : `
    background: #f3f4f6;
    color: #374151;
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

const ReleaseEditModal: React.FC<ReleaseEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  release
}) => {
  console.log('ReleaseEditModal - 렌더링', { isOpen, release });

  const [formData, setFormData] = useState<ReleaseFormData>({
    name: '',
    version: '',
    description: '',
    startDate: '',
    endDate: '',
    assignee: '',
    status: 'draft'
  });

  const [errors, setErrors] = useState<Partial<ReleaseFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 릴리즈 데이터가 변경될 때 폼 데이터 업데이트
  useEffect(() => {
    console.log('ReleaseEditModal - 릴리즈 데이터 업데이트', release);
    if (release) {
      setFormData({
        name: release.name || '',
        version: release.version || '',
        description: release.description || '',
        startDate: release.startDate || '',
        endDate: release.endDate || '',
        assignee: release.assignee_name || release.assignee || '',
        status: mapBackendStatusToFrontend(release.status) as any
      });
    }
  }, [release]);

  // 백엔드 상태를 프론트엔드 상태로 매핑
  const mapBackendStatusToFrontend = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'Draft': 'draft',
      'Active': 'in-progress',
      'Complete': 'ready',
      'Archived': 'released',
      'planning': 'draft' // 추가 매핑
    };
    return statusMap[status] || 'draft';
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ReleaseFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = '릴리즈명을 입력해주세요.';
    }

    if (!formData.version.trim()) {
      newErrors.version = '버전을 입력해주세요.';
    }

    if (!formData.startDate) {
      newErrors.startDate = '시작일을 선택해주세요.';
    }

    if (!formData.endDate) {
      newErrors.endDate = '종료일을 선택해주세요.';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = '종료일은 시작일보다 늦어야 합니다.';
    }

    if (!formData.assignee.trim()) {
      newErrors.assignee = '담당자를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ReleaseEditModal - 제출 시도', formData);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('릴리즈 수정 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    console.log('ReleaseEditModal - 닫기');
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const handleInputChange = (field: keyof ReleaseFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 에러 메시지 제거
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  if (!release) {
    console.log('ReleaseEditModal - 릴리즈 데이터 없음');
    return null;
  }

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>릴리즈 수정</ModalTitle>
          <CloseButton onClick={handleClose}>&times;</CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <Row>
            <FormGroup>
              <Label htmlFor="name">릴리즈명 *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="릴리즈명을 입력하세요"
                error={!!errors.name}
              />
              {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="version">버전 *</Label>
              <Input
                id="version"
                type="text"
                value={formData.version}
                onChange={(e) => handleInputChange('version', e.target.value)}
                placeholder="예: v1.0.0"
                error={!!errors.version}
              />
              {errors.version && <ErrorMessage>{errors.version}</ErrorMessage>}
            </FormGroup>
          </Row>

          <FormGroup>
            <Label htmlFor="description">설명</Label>
            <TextArea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="릴리즈에 대한 설명을 입력하세요"
            />
          </FormGroup>

          <Row>
            <FormGroup>
              <Label htmlFor="startDate">시작일 *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                error={!!errors.startDate}
              />
              {errors.startDate && <ErrorMessage>{errors.startDate}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="endDate">종료일 *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                error={!!errors.endDate}
              />
              {errors.endDate && <ErrorMessage>{errors.endDate}</ErrorMessage>}
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <Label htmlFor="assignee">담당자 *</Label>
              <Input
                id="assignee"
                type="text"
                value={formData.assignee}
                onChange={(e) => handleInputChange('assignee', e.target.value)}
                placeholder="담당자명"
                error={!!errors.assignee}
              />
              {errors.assignee && <ErrorMessage>{errors.assignee}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="status">상태</Label>
              <Select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="draft">초안</option>
                <option value="in-progress">진행중</option>
                <option value="testing">테스트중</option>
                <option value="ready">준비완료</option>
                <option value="released">배포됨</option>
              </Select>
            </FormGroup>
          </Row>

          <ModalFooter>
            <Button type="button" onClick={handleClose}>
              취소
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? '수정 중...' : '수정'}
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ReleaseEditModal;
