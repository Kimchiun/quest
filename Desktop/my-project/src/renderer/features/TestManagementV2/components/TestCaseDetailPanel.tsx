import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FolderMoveModal from './FolderMoveModal';

const DetailPanelContainer = styled.div<{ isOpen: boolean; width: number }>`
  width: ${props => props.isOpen ? `${props.width}px` : '0px'};
  border-left: 1px solid #e5e7eb;
  border-top: 1px solid #e5e7eb;
  background: #ffffff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: relative;
  height: 100%;
  max-height: 100%;
  align-self: stretch;
  min-height: 0; /* flex 아이템이 축소될 수 있도록 함 */
`;

const ResizeHandle = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: transparent;
  cursor: col-resize;
  z-index: 10;
  
  &:hover {
    background: #3b82f6;
  }
  
  &:active {
    background: #2563eb;
  }
`;

const DetailHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  min-height: 56px;
  flex-shrink: 0;
`;

const DetailTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const DetailContent = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 0; /* flex: 1과 함께 사용하여 남은 공간을 모두 차지하도록 함 */
  min-height: 0; /* flex 아이템이 축소될 수 있도록 함 */
`;

const EditButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #2563eb;
  }
`;

const BackButton = styled.button`
  background: #6b7280;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-right: 8px;
  
  &:hover {
    background: #4b5563;
  }
`;

const MoveButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-right: 8px;
  
  &:hover {
    background: #059669;
  }
`;

const SaveButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-right: 8px;
  
  &:hover {
    background: #059669;
  }
`;

const CancelButton = styled.button`
  background: #6b7280;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #4b5563;
  }
`;

const FormField = styled.div`
  margin-bottom: 16px;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
`;

const FormInput = styled.input`
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

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FormSelect = styled.select`
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

const StepsContainer = styled.div`
  margin-top: 8px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 4px;
`;

const StepItem = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
  align-items: flex-start;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(2px);
  }
`;

const StepNumber = styled.span`
  background: #f3f4f6;
  color: #374151;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 500;
  flex-shrink: 0;
  margin-top: 2px;
  border: 1px solid #d1d5db;
`;

const StepInput = styled.textarea`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  min-height: 60px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const AddStepButton = styled.button`
  background: #f3f4f6;
  color: #374151;
  border: 1px dashed #d1d5db;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
  margin-top: 8px;
  
  &:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
  }
`;

const RemoveStepButton = styled.button`
  background: #fee2e2;
  color: #dc2626;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  margin-top: 4px;
  
  &:hover {
    background: #fecaca;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const DetailSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 14px;
  color: #111827;
  font-weight: 500;
`;

const PriorityBadge = styled.span<{ priority: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.priority) {
      case 'High': return '#fef2f2';
      case 'Medium': return '#fffbeb';
      case 'Low': return '#f0fdf4';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.priority) {
      case 'High': return '#dc2626';
      case 'Medium': return '#d97706';
      case 'Low': return '#16a34a';
      default: return '#6b7280';
    }
  }};
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'Active': return '#f0fdf4';
      case 'Inactive': return '#f3f4f6';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Active': return '#16a34a';
      case 'Inactive': return '#6b7280';
      default: return '#6b7280';
    }
  }};
`;

const DescriptionText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
  white-space: pre-wrap;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7280;
  text-align: center;
  padding: 40px 20px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
  color: #374151;
`;

const EmptyDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: #6b7280;
`;

interface TestCaseDetailPanelProps {
  testCase: any;
  isOpen: boolean;
  onClose: () => void;
  width?: number;
  onResizeStart?: (e: React.MouseEvent) => void;
  onUpdate?: (updatedTestCase: any) => void;
  onMoveToFolder?: (testCaseId: string, targetFolderId: string) => void;
  folders?: any[];
}

const TestCaseDetailPanel: React.FC<TestCaseDetailPanelProps> = ({
  testCase,
  isOpen,
  onClose,
  width = 400,
  onResizeStart,
  onUpdate,
  onMoveToFolder,
  folders = []
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTestCase, setEditedTestCase] = useState<any>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

  useEffect(() => {
    if (testCase) {
      setEditedTestCase({ ...testCase });
      setSteps(testCase.steps || []);
      // 편집 모드에서 새로운 테스트케이스가 선택되면 편집 모드 해제
      setIsEditing(false);
    } else {
      // 테스트케이스가 없으면 편집 모드도 해제
      setIsEditing(false);
    }
  }, [testCase]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onUpdate && editedTestCase && testCase) {
      const updatedTestCase = {
        ...editedTestCase,
        steps: steps.filter(step => step.trim() !== ''), // 빈 단계 제거
        updatedAt: new Date()
      };
      onUpdate(updatedTestCase);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (testCase) {
      setEditedTestCase({ ...testCase });
      setSteps(testCase.steps || []);
    }
    setIsEditing(false);
  };

  const handleClose = () => {
    // 편집 모드에서 닫기 버튼을 누르면 편집 모드 해제
    if (isEditing) {
      handleCancel();
    }
    onClose();
  };

  const handleMoveToFolder = (targetFolderId: string) => {
    if (onMoveToFolder && testCase) {
      onMoveToFolder(testCase.id, targetFolderId);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedTestCase(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addStep = () => {
    setSteps(prev => [...prev, '']);
  };

  const updateStep = (index: number, value: string) => {
    setSteps(prev => prev.map((step, i) => i === index ? value : step));
  };

  const removeStep = (index: number) => {
    setSteps(prev => prev.filter((_, i) => i !== index));
  };
  if (!testCase) {
    return (
      <DetailPanelContainer isOpen={isOpen} width={width}>
        {onResizeStart && (
          <ResizeHandle onMouseDown={onResizeStart} />
        )}
        <DetailHeader>
          <DetailTitle>테스트케이스 상세</DetailTitle>
          <CloseButton onClick={handleClose}>&times;</CloseButton>
        </DetailHeader>
        <DetailContent>
          <EmptyState>
            <EmptyIcon>📋</EmptyIcon>
            <EmptyTitle>테스트케이스를 선택하세요</EmptyTitle>
          </EmptyState>
        </DetailContent>
      </DetailPanelContainer>
    );
  }

  return (
    <DetailPanelContainer isOpen={isOpen} width={width}>
      {onResizeStart && (
        <ResizeHandle onMouseDown={onResizeStart} />
      )}
              <DetailHeader>
          <DetailTitle>테스트케이스 상세</DetailTitle>
                            <div style={{ display: 'flex', gap: '8px' }}>
                    {isEditing ? (
                      <BackButton onClick={handleCancel}>
                        뒤로가기
                      </BackButton>
                    ) : (
                      <>
                        <EditButton onClick={handleEdit}>
                          편집
                        </EditButton>
                        <MoveButton onClick={() => setIsMoveModalOpen(true)}>
                          이동
                        </MoveButton>
                      </>
                    )}
                    <CloseButton onClick={handleClose}>&times;</CloseButton>
                  </div>
        </DetailHeader>
      
      <DetailContent>
        {isEditing ? (
          // 편집 모드
          <>
            <DetailSection>
              <SectionTitle>제목</SectionTitle>
              <FormField>
                <FormLabel>제목 *</FormLabel>
                <FormInput
                  value={editedTestCase?.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="테스트케이스 제목을 입력하세요"
                />
              </FormField>
            </DetailSection>

            <DetailSection>
              <SectionTitle>설명</SectionTitle>
              <FormField>
                <FormLabel>설명</FormLabel>
                <FormTextarea
                  value={editedTestCase?.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="테스트케이스 설명을 입력하세요"
                />
              </FormField>
            </DetailSection>

            <DetailSection>
              <SectionTitle>우선순위 유형 상태</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <FormLabel>우선순위</FormLabel>
                  <FormSelect
                    value={editedTestCase?.priority || 'Medium'}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </FormSelect>
                </InfoItem>
                <InfoItem>
                  <FormLabel>유형</FormLabel>
                  <FormSelect
                    value={editedTestCase?.type || 'Functional'}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  >
                    <option value="Functional">Functional</option>
                    <option value="Non-Functional">Non-Functional</option>
                    <option value="Integration">Integration</option>
                    <option value="Unit">Unit</option>
                    <option value="Regression">Regression</option>
                  </FormSelect>
                </InfoItem>
                <InfoItem>
                  <FormLabel>상태</FormLabel>
                  <FormSelect
                    value={editedTestCase?.status || 'Active'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Deprecated">Deprecated</option>
                  </FormSelect>
                </InfoItem>
              </InfoGrid>
            </DetailSection>

            <DetailSection>
              <SectionTitle>사전 조건</SectionTitle>
              <FormTextarea
                value={editedTestCase?.preconditions || ''}
                onChange={(e) => handleInputChange('preconditions', e.target.value)}
                placeholder="테스트 실행을 위한 사전 조건을 입력하세요"
              />
            </DetailSection>

            <DetailSection>
              <SectionTitle>테스트 단계</SectionTitle>
              <StepsContainer>
                {steps.map((step, index) => (
                  <StepItem key={index}>
                    <StepNumber>{index + 1}</StepNumber>
                    <div style={{ flex: 1 }}>
                      <StepInput
                        value={step}
                        onChange={(e) => updateStep(index, e.target.value)}
                        placeholder={`단계 ${index + 1}를 입력하세요`}
                      />
                      {steps.length > 1 && (
                        <RemoveStepButton onClick={() => removeStep(index)}>
                          삭제
                        </RemoveStepButton>
                      )}
                    </div>
                  </StepItem>
                ))}
                <AddStepButton onClick={addStep}>
                  + 단계 추가
                </AddStepButton>
              </StepsContainer>
            </DetailSection>

            <DetailSection>
              <SectionTitle>예상 결과</SectionTitle>
              <FormTextarea
                value={editedTestCase?.expectedResult || ''}
                onChange={(e) => handleInputChange('expectedResult', e.target.value)}
                placeholder="테스트 실행 후 예상되는 결과를 입력하세요"
              />
            </DetailSection>

            <DetailSection>
              <SectionTitle>메타데이터</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>작성자</InfoLabel>
                  <InfoValue>{testCase.createdBy}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>생성일</InfoLabel>
                  <InfoValue>{testCase.createdAt.toLocaleDateString()}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>수정일</InfoLabel>
                  <InfoValue>{testCase.updatedAt.toLocaleDateString()}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>ID</InfoLabel>
                  <InfoValue>{testCase.id}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </DetailSection>

            <ActionButtons>
              <SaveButton onClick={handleSave}>
                저장
              </SaveButton>
              <CancelButton onClick={handleCancel}>
                취소
              </CancelButton>
            </ActionButtons>
          </>
        ) : (
          // 읽기 모드
          <>
            <DetailSection>
              <SectionTitle>제목</SectionTitle>
              <InfoValue style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                {testCase.title}
              </InfoValue>
            </DetailSection>

            <DetailSection>
              <SectionTitle>설명</SectionTitle>
              <DescriptionText>{testCase.description || '설명이 없습니다.'}</DescriptionText>
            </DetailSection>

            <DetailSection>
              <SectionTitle>우선순위 유형 상태</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>우선순위</InfoLabel>
                  <PriorityBadge priority={testCase.priority}>
                    {testCase.priority}
                  </PriorityBadge>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>유형</InfoLabel>
                  <InfoValue>{testCase.type}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>상태</InfoLabel>
                  <StatusBadge status={testCase.status}>
                    {testCase.status}
                  </StatusBadge>
                </InfoItem>
              </InfoGrid>
            </DetailSection>

            <DetailSection>
              <SectionTitle>사전 조건</SectionTitle>
              <DescriptionText>{testCase.preconditions || '사전 조건이 없습니다.'}</DescriptionText>
            </DetailSection>

            <DetailSection>
              <SectionTitle>테스트 단계</SectionTitle>
              {testCase.steps && testCase.steps.length > 0 ? (
                <StepsContainer>
                  {testCase.steps.map((step: string, index: number) => (
                    <StepItem key={index}>
                      <StepNumber>{index + 1}</StepNumber>
                      <div style={{ 
                        flex: 1, 
                        padding: '6px 10px', 
                        background: '#f8fafc', 
                        borderRadius: '4px',
                        fontSize: '13px',
                        lineHeight: '1.4',
                        color: '#374151',
                        border: '1px solid #e5e7eb'
                      }}>
                        {step}
                      </div>
                    </StepItem>
                  ))}
                </StepsContainer>
              ) : (
                <DescriptionText>테스트 단계가 없습니다.</DescriptionText>
              )}
            </DetailSection>

            <DetailSection>
              <SectionTitle>예상 결과</SectionTitle>
              <DescriptionText>{testCase.expectedResult || '예상 결과가 없습니다.'}</DescriptionText>
            </DetailSection>

            <DetailSection>
              <SectionTitle>메타데이터</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>작성자</InfoLabel>
                  <InfoValue>{testCase.createdBy}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>생성일</InfoLabel>
                  <InfoValue>{testCase.createdAt.toLocaleDateString()}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>수정일</InfoLabel>
                  <InfoValue>{testCase.updatedAt.toLocaleDateString()}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>ID</InfoLabel>
                  <InfoValue>{testCase.id}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </DetailSection>
          </>
        )}
      </DetailContent>
      
      <FolderMoveModal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        onMove={handleMoveToFolder}
        currentFolderId={testCase?.folderId || ''}
        folders={folders}
        testCaseTitle={testCase?.title || ''}
      />
    </DetailPanelContainer>
  );
};

export default TestCaseDetailPanel;
