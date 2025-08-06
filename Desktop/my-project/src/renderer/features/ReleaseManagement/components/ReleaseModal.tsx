import React, { useState } from 'react';
import styled from 'styled-components';
import { Release, ReleaseStatus } from '../types';

interface ReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (release: Release) => void;
  editingRelease?: Release | null;
}

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

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px 0;
`;

const ModalBody = styled.div`
  padding: 0 24px 24px 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
`;

const RequiredLabel = styled(Label)`
  &::after {
    content: ' *';
    color: #ef4444;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 24px 24px 24px;
  border-top: 1px solid #e5e7eb;
  margin-top: 24px;
  padding-top: 24px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px 16px;
  border: 1px solid ${props => props.variant === 'primary' ? '#3b82f6' : '#d1d5db'};
  background: ${props => props.variant === 'primary' ? '#3b82f6' : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : '#374151'};
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.variant === 'primary' ? '#2563eb' : '#f9fafb'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  margin-top: 8px;
`;

const ReleaseModal: React.FC<ReleaseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingRelease
}) => {
  const [formData, setFormData] = useState({
    name: editingRelease?.name || '',
    version: editingRelease?.version || '',
    description: editingRelease?.description || '',
    status: editingRelease?.status || ReleaseStatus.PLANNING,
    assignee_name: editingRelease?.assignee_name || '',
    scheduled_date: editingRelease?.scheduled_date ? 
      new Date(editingRelease.scheduled_date).toISOString().split('T')[0] : '',
    deployed_date: editingRelease?.deployed_date ? 
      new Date(editingRelease.deployed_date).toISOString().split('T')[0] : ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.version.trim()) {
      setError('릴리즈 이름과 버전은 필수입니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = editingRelease 
        ? `http://localhost:3001/api/releases/${editingRelease.id}`
        : 'http://localhost:3001/api/releases';
      
      const method = editingRelease ? 'PUT' : 'POST';
      
      const requestData = {
        ...formData,
        scheduled_date: formData.scheduled_date || null,
        deployed_date: formData.deployed_date || null
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const data = await response.json();
        onSuccess(data.data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || '릴리즈 저장에 실패했습니다.');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: ReleaseStatus.PLANNING, label: '계획' },
    { value: ReleaseStatus.IN_PROGRESS, label: '진행중' },
    { value: ReleaseStatus.TESTING, label: '테스트' },
    { value: ReleaseStatus.READY, label: '준비완료' },
    { value: ReleaseStatus.DEPLOYED, label: '배포됨' },
    { value: ReleaseStatus.COMPLETED, label: '완료' },
    { value: ReleaseStatus.CANCELLED, label: '취소됨' }
  ];

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {editingRelease ? '릴리즈 수정' : '새 릴리즈 생성'}
          </ModalTitle>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormRow>
              <FormGroup>
                <RequiredLabel htmlFor="name">릴리즈 이름</RequiredLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="예: Quest v2.0"
                  required
                />
              </FormGroup>

              <FormGroup>
                <RequiredLabel htmlFor="version">버전</RequiredLabel>
                <Input
                  id="version"
                  name="version"
                  type="text"
                  value={formData.version}
                  onChange={handleInputChange}
                  placeholder="예: 2.0.0"
                  required
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor="description">설명</Label>
              <TextArea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="릴리즈에 대한 설명을 입력하세요..."
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor="status">상태</Label>
                <Select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="assignee_name">담당자</Label>
                <Input
                  id="assignee_name"
                  name="assignee_name"
                  type="text"
                  value={formData.assignee_name}
                  onChange={handleInputChange}
                  placeholder="담당자 이름"
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="scheduled_date">예정일</Label>
                <Input
                  id="scheduled_date"
                  name="scheduled_date"
                  type="date"
                  value={formData.scheduled_date}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="deployed_date">배포일</Label>
                <Input
                  id="deployed_date"
                  name="deployed_date"
                  type="date"
                  value={formData.deployed_date}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </FormRow>

            {error && <ErrorMessage>{error}</ErrorMessage>}
          </ModalBody>

          <ModalFooter>
            <Button type="button" onClick={onClose} disabled={loading}>
              취소
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? '저장 중...' : (editingRelease ? '수정' : '생성')}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ReleaseModal;