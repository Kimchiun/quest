import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import axios from '../../../utils/axios';

// 타입 정의
interface ActivityLog {
  id: number;
  action: string;
  user: string;
  date: string;
  details?: string;
  type: 'create' | 'update' | 'delete' | 'execute' | 'comment';
}

interface Attachment {
  id: number;
  name: string;
  size: number;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

interface FilterOptions {
  dateRange: 'all' | 'today' | 'week' | 'month';
  activityType: string[];
  user: string[];
}

// 스타일 컴포넌트
const Panel = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-left: 1px solid #e2e8f0;
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const Section = styled.div`
  padding: 20px;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h4`
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ContextInfo = styled.div`
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-size: 12px;
  color: #64748b;
`;

const InfoValue = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #1e293b;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const FilterButton = styled.button<{ active?: boolean }>`
  padding: 6px 12px;
  border: 1px solid ${props => props.active ? '#3b82f6' : '#d1d5db'};
  border-radius: 4px;
  font-size: 12px;
  background: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  cursor: pointer;
  
  &:hover {
    background: ${props => props.active ? '#2563eb' : '#f9fafb'};
  }
`;

const ActivityList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const ActivityItem = styled.div`
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const ActivityAction = styled.span<{ type: string }>`
  font-size: 12px;
  font-weight: 500;
  color: ${props => {
    switch (props.type) {
      case 'create': return '#059669';
      case 'update': return '#d97706';
      case 'delete': return '#dc2626';
      case 'execute': return '#3b82f6';
      case 'comment': return '#7c3aed';
      default: return '#6b7280';
    }
  }};
`;

const ActivityUser = styled.span`
  font-size: 11px;
  color: #64748b;
`;

const ActivityDate = styled.span`
  font-size: 11px;
  color: #9ca3af;
`;

const ActivityDetails = styled.div`
  font-size: 12px;
  color: #374151;
  margin-top: 4px;
`;

const AttachmentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AttachmentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
`;

const AttachmentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const AttachmentName = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #1e293b;
`;

const AttachmentMeta = styled.span`
  font-size: 10px;
  color: #64748b;
`;

const DownloadButton = styled.button`
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 10px;
  background: white;
  color: #374151;
  cursor: pointer;
  
  &:hover {
    background: #f9fafb;
    border-color: #3b82f6;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px;
  border-top: 1px solid #f1f5f9;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 6px 10px;
  border: 1px solid ${props => props.active ? '#3b82f6' : '#d1d5db'};
  border-radius: 4px;
  font-size: 12px;
  background: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  cursor: pointer;
  
  &:hover {
    background: ${props => props.active ? '#2563eb' : '#f9fafb'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
`;

const RightContextPanel: React.FC = () => {
  const layout = useSelector((state: RootState) => state.dashboardLayout);
  const selectedTestCaseId = layout.selectedTestCaseId;
  const selectedDefectId = layout.selectedDefectId;
  const isCollapsed = layout.rightPanel.isCollapsed;

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: 'all',
    activityType: [],
    user: []
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // 선택된 항목 변경 시 데이터 로드
  useEffect(() => {
    if (selectedTestCaseId || selectedDefectId) {
      loadItemDetails();
      loadActivityLogs();
      loadAttachments();
    } else {
      setSelectedItem(null);
      setActivityLogs([]);
      setAttachments([]);
    }
  }, [selectedTestCaseId, selectedDefectId]);

  const loadItemDetails = async () => {
    if (!selectedTestCaseId && !selectedDefectId) return;

    setLoading(true);
    try {
      if (selectedTestCaseId) {
        const response = await axios.get(`/api/testcases/${selectedTestCaseId}`);
        setSelectedItem((response.data as any));
      } else if (selectedDefectId) {
        const response = await axios.get(`/api/defects/${selectedDefectId}`);
        setSelectedItem((response.data as any));
      }
    } catch (error) {
      console.error('Failed to load item details:', error);
      // 에러 시 기본 데이터 설정
      setSelectedItem({
        title: '로딩 실패',
        status: 'Unknown',
        createdBy: 'Unknown',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const loadActivityLogs = async () => {
    setLoading(true);
    try {
      const itemId = selectedTestCaseId || selectedDefectId;
      const itemType = selectedTestCaseId ? 'testcase' : 'defect';
      const response = await axios.get(`/api/${itemType}s/${itemId}/activity-logs`, {
        params: {
          page: currentPage,
          dateRange: filters.dateRange,
          activityType: filters.activityType.join(','),
          user: filters.user.join(',')
        }
      });
      setActivityLogs((response.data as any).logs || []);
      setTotalPages((response.data as any).totalPages || 1);
    } catch (error) {
      console.error('Failed to load activity logs:', error);
      // 에러 시 기본 데이터 설정
      setActivityLogs([
        {
          id: 1,
          action: '데이터 로딩 실패',
          user: 'System',
          date: new Date().toISOString(),
          type: 'create' as const,
          details: '활동 로그를 불러올 수 없습니다.'
        }
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const loadAttachments = async () => {
    try {
      const itemId = selectedTestCaseId || selectedDefectId;
      const itemType = selectedTestCaseId ? 'testcase' : 'defect';
      const response = await axios.get(`/api/${itemType}s/${itemId}/attachments`);
      setAttachments((response.data as any) || []);
    } catch (error) {
      console.error('Failed to load attachments:', error);
      // 에러 시 기본 데이터 설정
      setAttachments([
        {
          id: 1,
          name: '첨부파일 없음',
          size: 0,
          type: 'text/plain',
          uploadedBy: 'System',
          uploadedAt: new Date().toISOString(),
          url: '#'
        }
      ]);
    }
  };

  const handleFilterChange = useCallback((key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  }, []);

  const handleDownload = async (attachment: Attachment) => {
    try {
      const response = await axios.get(attachment.url, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', attachment.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download attachment:', error);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return '➕';
      case 'update': return '✏️';
      case 'delete': return '🗑️';
      case 'execute': return '▶️';
      case 'comment': return '💬';
      default: return '📝';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isCollapsed) {
    return (
      <Panel>
        <div style={{ padding: '20px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📋</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>상세 정보</div>
        </div>
      </Panel>
    );
  }

  if (!selectedTestCaseId && !selectedDefectId) {
    return (
      <Panel>
        <Header>
          <Title>상세 정보</Title>
        </Header>
        <Content>
          <EmptyState>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <h4>항목을 선택해주세요</h4>
            <p>중앙 패널에서 테스트케이스나 결함을 선택하면 상세 정보를 확인할 수 있습니다.</p>
          </EmptyState>
        </Content>
      </Panel>
    );
  }

  return (
    <Panel>
      <Header>
        <Title>상세 정보</Title>
      </Header>
      
      <Content>
        {/* 컨텍스트 정보 */}
        {selectedItem && (
          <Section>
            <SectionTitle>기본 정보</SectionTitle>
            <ContextInfo>
              <InfoItem>
                <InfoLabel>제목</InfoLabel>
                <InfoValue>{selectedItem.title}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>상태</InfoLabel>
                <InfoValue>
                  {selectedItem.executionStatus || selectedItem.status}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>생성자</InfoLabel>
                <InfoValue>{selectedItem.createdBy}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>생성일</InfoLabel>
                <InfoValue>
                  {new Date(selectedItem.createdAt).toLocaleDateString()}
                </InfoValue>
              </InfoItem>
              {selectedItem.updatedAt && (
                <InfoItem>
                  <InfoLabel>수정일</InfoLabel>
                  <InfoValue>
                    {new Date(selectedItem.updatedAt).toLocaleDateString()}
                  </InfoValue>
                </InfoItem>
              )}
            </ContextInfo>
          </Section>
        )}

        {/* 첨부파일 */}
        <Section>
          <SectionTitle>첨부파일 ({attachments.length})</SectionTitle>
          {attachments.length > 0 ? (
            <AttachmentList>
              {attachments.map((attachment) => (
                <AttachmentItem key={attachment.id}>
                  <AttachmentInfo>
                    <AttachmentName>{attachment.name}</AttachmentName>
                    <AttachmentMeta>
                      {formatFileSize(attachment.size)} • {attachment.uploadedBy} • {new Date(attachment.uploadedAt).toLocaleDateString()}
                    </AttachmentMeta>
                  </AttachmentInfo>
                  <DownloadButton onClick={() => handleDownload(attachment)}>
                    다운로드
                  </DownloadButton>
                </AttachmentItem>
              ))}
            </AttachmentList>
          ) : (
            <EmptyState>
              <p>첨부된 파일이 없습니다.</p>
            </EmptyState>
          )}
        </Section>

        {/* 활동 로그 */}
        <Section>
          <SectionTitle>
            활동 로그
            <FilterBar>
              <FilterSelect
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              >
                <option value="all">전체 기간</option>
                <option value="today">오늘</option>
                <option value="week">이번 주</option>
                <option value="month">이번 달</option>
              </FilterSelect>
              <FilterSelect
                value={filters.activityType[0] || ''}
                onChange={(e) => handleFilterChange('activityType', e.target.value ? [e.target.value] : [])}
              >
                <option value="">모든 활동</option>
                <option value="create">생성</option>
                <option value="update">수정</option>
                <option value="delete">삭제</option>
                <option value="execute">실행</option>
                <option value="comment">코멘트</option>
              </FilterSelect>
            </FilterBar>
          </SectionTitle>
          
          {loading ? (
            <LoadingSpinner>활동 로그를 불러오는 중...</LoadingSpinner>
          ) : activityLogs.length > 0 ? (
            <>
              <ActivityList>
                {activityLogs.map((log) => (
                  <ActivityItem key={log.id}>
                    <ActivityHeader>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{getActivityIcon(log.type)}</span>
                        <ActivityAction type={log.type}>{log.action}</ActivityAction>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ActivityUser>{log.user}</ActivityUser>
                        <ActivityDate>{new Date(log.date).toLocaleString()}</ActivityDate>
                      </div>
                    </ActivityHeader>
                    {log.details && (
                      <ActivityDetails>{log.details}</ActivityDetails>
                    )}
                  </ActivityItem>
                ))}
              </ActivityList>
              
              {totalPages > 1 && (
                <Pagination>
                  <PageButton
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  >
                    이전
                  </PageButton>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    {currentPage} / {totalPages}
                  </span>
                  <PageButton
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  >
                    다음
                  </PageButton>
                </Pagination>
              )}
            </>
          ) : (
            <EmptyState>
              <p>활동 로그가 없습니다.</p>
            </EmptyState>
          )}
        </Section>
      </Content>
    </Panel>
  );
};

export default RightContextPanel; 