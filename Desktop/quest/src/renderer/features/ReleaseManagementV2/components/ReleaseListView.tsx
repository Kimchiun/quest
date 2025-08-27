import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface Release {
  id: string;
  name: string;
  version: string;
  status: 'draft' | 'in-progress' | 'testing' | 'ready' | 'released';
  startDate: string;
  endDate: string;
  progress: number;
  passRate: number;
  blockers: number;
  assignee: string;
  folder: string;
  updatedAt: string;
}

interface ReleaseListViewProps {
  releases: Release[];
  selectedReleases: string[];
  onSelectRelease: (releaseId: string) => void;
  onSelectAll: () => void;
  onViewRelease: (releaseId: string) => void;
  onEditRelease: (releaseId: string) => void;
  onDeleteRelease: (releaseId: string) => void;
  onCreateRelease: () => void;
  onBulkDelete: (releaseIds: string[]) => void;
}

// 스타일 컴포넌트들
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8fafc;
`;

const Header = styled.div`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 20px 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
`;

const ReleaseCount = styled.span`
  background: #eff6ff;
  color: #3b82f6;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CreateButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const DeleteButton = styled.button<{ disabled: boolean }>`
  background: ${props => props.disabled ? '#9ca3af' : '#ef4444'};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #dc2626;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SelectAllButton = styled.button`
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`;

const SelectedCount = styled.span`
  color: #6b7280;
  font-size: 14px;
`;

const EditModeButton = styled.button<{ isActive: boolean }>`
  background: ${props => props.isActive ? '#3b82f6' : 'none'};
  color: ${props => props.isActive ? 'white' : '#374151'};
  border: 1px solid ${props => props.isActive ? '#3b82f6' : '#d1d5db'};
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${props => props.isActive ? '#2563eb' : '#f9fafb'};
    border-color: ${props => props.isActive ? '#2563eb' : '#9ca3af'};
  }
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SearchInput = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  width: 200px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ReleaseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
`;

const ReleaseCard = styled.div<{ selected: boolean }>`
  background: white;
  border: 2px solid ${props => props.selected ? '#3b82f6' : '#e5e7eb'};
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    border-color: ${props => props.selected ? '#2563eb' : '#d1d5db'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const CardTitle = styled.div`
  flex: 1;
`;

const ReleaseName = styled.h3`
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
`;

const ReleaseVersion = styled.span`
  background: #f3f4f6;
  color: #6b7280;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

const StatusBadge = styled.span<{ status: string }>`
  background: ${props => {
    switch (props.status) {
      case 'draft': return '#fef3c7';
      case 'in-progress': return '#dbeafe';
      case 'testing': return '#fef3c7';
      case 'ready': return '#dcfce7';
      case 'released': return '#d1fae5';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'draft': return '#92400e';
      case 'in-progress': return '#1e40af';
      case 'testing': return '#92400e';
      case 'ready': return '#166534';
      case 'released': return '#166534';
      default: return '#6b7280';
    }
  }};
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
`;

const CardContent = styled.div`
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
  color: #374151;
  font-weight: 500;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 4px;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: #3b82f6;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }

  &.delete {
    color: #dc2626;
    border-color: #fecaca;

    &:hover {
      background: #fef2f2;
      border-color: #fca5a5;
    }
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
`;

const EmptyDescription = styled.p`
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #6b7280;
`;

// 커스텀 모달 스타일 컴포넌트
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
  border-radius: 8px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
`;

const ModalMessage = styled.p`
  margin: 0 0 24px 0;
  color: #4b5563;
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ModalButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background: #dc2626;
    color: white;
    &:hover {
      background: #b91c1c;
    }
  ` : `
    background: #f3f4f6;
    color: #374151;
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

const ReleaseListView: React.FC<ReleaseListViewProps> = ({
  releases,
  selectedReleases,
  onSelectRelease,
  onSelectAll,
  onViewRelease,
  onEditRelease,
  onDeleteRelease,
  onCreateRelease,
  onBulkDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReleases, setFilteredReleases] = useState<Release[]>(releases);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [releaseToDelete, setReleaseToDelete] = useState<Release | null>(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  useEffect(() => {
    const filtered = releases.filter(release =>
      release.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      release.version.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReleases(filtered);
  }, [releases, searchTerm]);

  const handleBulkDelete = () => {
    if (selectedReleases.length === 0) return;
    
    setShowBulkDeleteModal(true);
  };

  const confirmBulkDelete = () => {
    onBulkDelete(selectedReleases);
    setShowBulkDeleteModal(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return '초안';
      case 'in-progress': return '진행중';
      case 'testing': return '테스트중';
      case 'ready': return '준비완료';
      case 'released': return '배포됨';
      default: return status;
    }
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <HeaderLeft>
            <Title>릴리즈 관리</Title>
            <ReleaseCount>{releases.length}개 릴리즈</ReleaseCount>
          </HeaderLeft>
          <HeaderRight>
            <CreateButton onClick={onCreateRelease}>
              <span>+</span>
              새 릴리즈 생성
            </CreateButton>
            {isEditMode && (
              <DeleteButton 
                disabled={selectedReleases.length === 0}
                onClick={handleBulkDelete}
              >
                <span>🗑️</span>
                선택 삭제 ({selectedReleases.length})
              </DeleteButton>
            )}
          </HeaderRight>
        </HeaderContent>
      </Header>

      <Content>
        <Toolbar>
          <ToolbarLeft>
            <EditModeButton 
              isActive={isEditMode}
              onClick={() => {
                setIsEditMode(!isEditMode);
                if (isEditMode) {
                  // 수정 모드 종료 시 선택 해제
                  selectedReleases.forEach(() => {});
                }
              }}
            >
              <span>✏️</span>
              {isEditMode ? '수정 완료' : '수정'}
            </EditModeButton>
            {isEditMode && (
              <>
                <SelectAllButton onClick={onSelectAll}>
                  {selectedReleases.length === releases.length ? '전체 해제' : '전체 선택'}
                </SelectAllButton>
                {selectedReleases.length > 0 && (
                  <SelectedCount>{selectedReleases.length}개 선택됨</SelectedCount>
                )}
              </>
            )}
          </ToolbarLeft>
          <ToolbarRight>
            <SearchInput
              type="text"
              placeholder="릴리즈명 또는 버전으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </ToolbarRight>
        </Toolbar>

        {filteredReleases.length === 0 ? (
          <div className="empty-state-container">
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '60px 20px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.7 }}>📦</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600, color: '#374151' }}>
                릴리즈가 없습니다
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', maxWidth: '400px' }}>
                {searchTerm ? '검색 결과가 없습니다.' : '새로운 릴리즈를 생성해보세요.'}
              </p>
            </div>
          </div>
        ) : (
          <ReleaseGrid>
            {filteredReleases.map((release) => (
              <ReleaseCard
                key={release.id}
                selected={isEditMode && selectedReleases.includes(release.id)}
                onClick={() => {
                  if (isEditMode) {
                    onSelectRelease(release.id);
                  } else {
                    onViewRelease(release.id);
                  }
                }}
              >
                <CardHeader>
                  <CardTitle>
                    <ReleaseName>{release.name}</ReleaseName>
                    <ReleaseVersion>{release.version}</ReleaseVersion>
                  </CardTitle>
                  <StatusBadge status={release.status}>
                    {getStatusText(release.status)}
                  </StatusBadge>
                </CardHeader>

                <CardContent>
                  <InfoItem>
                    <InfoLabel>시작일</InfoLabel>
                    <InfoValue>{formatDate(release.startDate)}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>종료일</InfoLabel>
                    <InfoValue>{formatDate(release.endDate)}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>담당자</InfoLabel>
                    <InfoValue>{release.assignee}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>통과율</InfoLabel>
                    <InfoValue>{release.passRate}%</InfoValue>
                  </InfoItem>
                </CardContent>

                <InfoItem>
                  <InfoLabel>통과율</InfoLabel>
                  <ProgressBar>
                    <ProgressFill progress={release.passRate} />
                  </ProgressBar>
                </InfoItem>

                <CardActions>
                  <ActionButtons>
                    {!isEditMode && (
                      <>
                        <ActionButton onClick={(e) => {
                          e.stopPropagation();
                          onViewRelease(release.id);
                        }}>
                          보기
                        </ActionButton>
                        <ActionButton onClick={(e) => {
                          e.stopPropagation();
                          onEditRelease(release.id);
                        }}>
                          수정
                        </ActionButton>
                        <ActionButton 
                          className="delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            setReleaseToDelete(release);
                            setShowDeleteModal(true);
                          }}
                        >
                          삭제
                        </ActionButton>
                      </>
                    )}
                  </ActionButtons>
                  {isEditMode && (
                    <Checkbox
                      type="checkbox"
                      checked={selectedReleases.includes(release.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        onSelectRelease(release.id);
                      }}
                    />
                  )}
                </CardActions>
              </ReleaseCard>
            ))}
          </ReleaseGrid>
        )}
      </Content>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && releaseToDelete && (
        <ModalOverlay onClick={() => setShowDeleteModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>릴리즈 삭제</ModalTitle>
            <ModalMessage>
              <strong>"{releaseToDelete.name}"</strong> 릴리즈를 삭제하시겠습니까?<br />
              이 작업은 되돌릴 수 없습니다.
            </ModalMessage>
            <ModalButtons>
              <ModalButton 
                variant="secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setReleaseToDelete(null);
                }}
              >
                취소
              </ModalButton>
              <ModalButton 
                variant="primary"
                onClick={() => {
                  onDeleteRelease(releaseToDelete.id);
                  setShowDeleteModal(false);
                  setReleaseToDelete(null);
                }}
              >
                삭제
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {/* 다중 삭제 확인 모달 */}
      {showBulkDeleteModal && (
        <ModalOverlay onClick={() => setShowBulkDeleteModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>다중 릴리즈 삭제</ModalTitle>
            <ModalMessage>
              선택된 <strong>{selectedReleases.length}개</strong>의 릴리즈를 삭제하시겠습니까?<br />
              이 작업은 되돌릴 수 없습니다.
            </ModalMessage>
            <ModalButtons>
              <ModalButton 
                variant="secondary"
                onClick={() => setShowBulkDeleteModal(false)}
              >
                취소
              </ModalButton>
              <ModalButton 
                variant="primary"
                onClick={confirmBulkDelete}
              >
                삭제
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default ReleaseListView;
