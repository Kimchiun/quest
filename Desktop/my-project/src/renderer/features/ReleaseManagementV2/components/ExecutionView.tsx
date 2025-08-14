import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useGetReleaseTestCasesQuery, useGetTestFoldersQuery } from '../../../services/api';

// 타입 정의
interface TestCase {
  id: string;
  name: string;
  description: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  status: 'Not Run' | 'Pass' | 'Fail' | 'Block' | 'Skip';
  assignee?: string;
  estimatedTime?: number;
  actualTime?: number;
  lastUpdated: string;
  tags: string[];
  suite?: string;
  module?: string;
  steps?: string[];
  expectedResult?: string;
  attachments?: string[];
  executionStatus?: string;
  executedAt?: string;
  executedBy?: string;
}

interface Release {
  id: string;
  name: string;
  version: string;
  sprint?: string;
  period?: string;
  owner: string;
  createdAt: string;
}

interface ExecutionViewProps {
  release: Release;
  testCases?: TestCase[];
  onTestCaseUpdate: (testCaseId: string, updates: Partial<TestCase>) => void;
  onBulkUpdate: (testCaseIds: string[], updates: Partial<TestCase>) => void;
  onAddTestCases?: (newTestCases: TestCase[]) => void;
}

// 스타일 컴포넌트
const ExecutionContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8fafc;
  margin: -20px;
`;

// 상단 컨텍스트 바
const TopContextBar = styled.div`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ReleaseMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ReleaseLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const ReleaseRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ReleaseInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ReleaseName = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
`;

const ReleaseDetails = styled.div`
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #64748b;
`;

const ProgressSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: #f1f5f9;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #9ca3af;
  }
  
  &:active:not(:disabled) {
    background: #f3f4f6;
  }
  
  &:disabled {
    background: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const CollapseButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #6b7280;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`;

// 모달 스타일 컴포넌트들
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
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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
  color: #1f2937;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  
  &:hover {
    color: #374151;
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const FolderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FolderItem = styled.div<{ level: number }>`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: ${props => props.level * 20}px;
  
  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
  
  &.selected {
    background: #eff6ff;
    border-color: #3b82f6;
  }
`;

const FolderCheckbox = styled.input`
  margin-right: 12px;
`;

const FolderInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FolderIcon = styled.span`
  color: #6b7280;
  font-size: 16px;
`;

const FolderName = styled.div`
  font-weight: 500;
  color: #1f2937;
`;

const FolderCount = styled.div`
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: auto;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background: #f9fafb;
  }
`;

const AddButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #3b82f6;
  border-radius: 6px;
  background: #3b82f6;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #2563eb;
  }
  
  &:disabled {
    background: #9ca3af;
    border-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const ProgressItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const ProgressNumber = styled.span<{ color: string }>`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.color};
`;

const ProgressLabel = styled.span`
  font-size: 12px;
  color: #64748b;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin: 0 16px;
`;

const ProgressFill = styled.div<{ percentage: number }>`
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #10b981);
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

const FilterSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterBadge = styled.span`
  background: #dbeafe;
  color: #1e40af;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const LiveIndicator = styled.div<{ isLive: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.isLive ? '#d1fae5' : '#fee2e2'};
  color: ${props => props.isLive ? '#065f46' : '#dc2626'};
`;

const LiveDot = styled.div<{ isLive: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${props => props.isLive ? '#10b981' : '#ef4444'};
  animation: ${props => props.isLive ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

// 메인 콘텐츠 영역
const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

// 좌측 필터 패널
const FilterPanel = styled.div`
  width: 280px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const FilterSection = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
`;

const FilterTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
`;

const FilterGroup = styled.div`
  margin-bottom: 16px;
`;

const FilterLabel = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 6px;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FilterInput = styled.input`
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

const SavedFilters = styled.div`
  padding: 16px;
`;

const SavedFilterItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  margin-bottom: 8px;
  background: #f8fafc;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #f1f5f9;
  }
`;

const BulkActionPanel = styled.div`
  padding: 16px;
  background: #fef3c7;
  border-top: 1px solid #fde68a;
`;

const BulkActionButton = styled.button<{ variant: 'pass' | 'fail' | 'block' | 'skip' }>`
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 8px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  background: ${props => {
    switch (props.variant) {
      case 'pass': return '#10b981';
      case 'fail': return '#ef4444';
      case 'block': return '#f59e0b';
      case 'skip': return '#8b5cf6';
      default: return '#6b7280';
    }
  }};
  color: white;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// 중앙 테스트 리스트
const TestListContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
`;

const TestListHeader = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const TestListTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
`;

const TestTable = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 80px 80px 1fr 120px 120px 100px 120px 100px;
  gap: 16px;
  padding: 12px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const TableRow = styled.div<{ isSelected?: boolean }>`
  display: grid;
  grid-template-columns: 40px 80px 80px 1fr 120px 120px 100px 120px 100px;
  gap: 16px;
  padding: 12px 24px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.2s;
  background: ${props => props.isSelected ? '#eff6ff' : 'white'};
  
  &:hover {
    background: ${props => props.isSelected ? '#dbeafe' : '#f8fafc'};
  }
`;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #1e293b;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  
  background: ${props => {
    switch (props.status) {
      case 'Not Run': return '#f3f4f6';
      case 'Pass': return '#d1fae5';
      case 'Fail': return '#fee2e2';
      case 'Block': return '#fef3c7';
      case 'Skip': return '#f3e8ff';
      default: return '#f3f4f6';
    }
  }};
  
  color: ${props => {
    switch (props.status) {
      case 'Not Run': return '#6b7280';
      case 'Pass': return '#065f46';
      case 'Fail': return '#dc2626';
      case 'Block': return '#d97706';
      case 'Skip': return '#7c3aed';
      default: return '#6b7280';
    }
  }};
`;

const PriorityBadge = styled.span<{ priority: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  
  background: ${props => {
    switch (props.priority) {
      case 'P0': return '#fee2e2';
      case 'P1': return '#fef3c7';
      case 'P2': return '#dbeafe';
      case 'P3': return '#f3f4f6';
      default: return '#f3f4f6';
    }
  }};
  
  color: ${props => {
    switch (props.priority) {
      case 'P0': return '#dc2626';
      case 'P1': return '#d97706';
      case 'P2': return '#2563eb';
      case 'P3': return '#6b7280';
      default: return '#6b7280';
    }
  }};
`;

const QuickActionButton = styled.button<{ action: string }>`
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 4px;
  
  background: ${props => {
    switch (props.action) {
      case 'pass': return '#10b981';
      case 'fail': return '#ef4444';
      case 'block': return '#f59e0b';
      case 'skip': return '#8b5cf6';
      default: return '#6b7280';
    }
  }};
  color: white;
  
  &:hover {
    opacity: 0.9;
  }
`;

// 우측 상세 패널
const DetailPanel = styled.div<{ isOpen: boolean }>`
  width: ${props => props.isOpen ? '400px' : '0'};
  background: white;
  border-left: 1px solid #e2e8f0;
  overflow: hidden;
  transition: width 0.3s ease;
`;

const DetailContent = styled.div`
  padding: 24px;
  height: 100%;
  overflow-y: auto;
`;

const DetailSection = styled.div`
  margin-bottom: 24px;
`;

const DetailTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
`;

const DetailText = styled.p`
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
`;

const StatusChangeForm = styled.div`
  margin-top: 16px;
`;

const StatusRadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const StatusRadio = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f8fafc;
  }
  
  input[type="radio"]:checked + & {
    background: #eff6ff;
    border-color: #3b82f6;
  }
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #2563eb;
  }
`;

const HistoryList = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

const HistoryItem = styled.div`
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
  }
`;

const HistoryMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
`;

const HistoryChange = styled.div`
  font-size: 14px;
  color: #1e293b;
`;

const ExecutionView: React.FC<ExecutionViewProps> = ({
  release,
  testCases: propTestCases,
  onTestCaseUpdate,
  onBulkUpdate,
  onAddTestCases
}) => {
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    suite: '',
    assignee: '',
    search: ''
  });
  const [isLive, setIsLive] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoadingTestCases, setIsLoadingTestCases] = useState(false);
  const [showTestCaseModal, setShowTestCaseModal] = useState(false);
  const [selectedTestCasesToAdd, setSelectedTestCasesToAdd] = useState<number[]>([]);
  const [importedFolders, setImportedFolders] = useState<TestFolder[]>([]);
  const [selectedImportedFolder, setSelectedImportedFolder] = useState<TestFolder | null>(null);
  const [folderTestCases, setFolderTestCases] = useState<TestCase[]>([]);

  // 실제 API에서 테스트 케이스 데이터 가져오기
  // prop으로 전달받은 테스트케이스가 있으면 사용, 없으면 API에서 가져오기
  const { data: apiTestCases = [], isLoading, error, refetch } = useGetReleaseTestCasesQuery(Number(release.id));
  const testCases = propTestCases || apiTestCases;

    // 실제 API에서 테스트 폴더 데이터 가져오기
  const { data: testFoldersResponse, isLoading: foldersLoading } = useGetTestFoldersQuery();
  const testFolders = testFoldersResponse?.data || [];

  // 진행률 계산
  const totalTestCases = Array.isArray(testCases) ? testCases.length : 0;
  const executedTestCases = Array.isArray(testCases) ? testCases.filter(tc => tc.status !== 'Not Run').length : 0;
  const passedTestCases = Array.isArray(testCases) ? testCases.filter(tc => tc.status === 'Pass').length : 0;
  const failedTestCases = Array.isArray(testCases) ? testCases.filter(tc => tc.status === 'Fail').length : 0;
  const blockedTestCases = Array.isArray(testCases) ? testCases.filter(tc => tc.status === 'Block').length : 0;
  const skippedTestCases = Array.isArray(testCases) ? testCases.filter(tc => tc.status === 'Skip').length : 0;
  const notRunTestCases = Array.isArray(testCases) ? testCases.filter(tc => tc.status === 'Not Run').length : 0;

  const progressPercentage = totalTestCases > 0 ? Math.round((executedTestCases / totalTestCases) * 100) : 0;

  // 필터링된 테스트 케이스
  const filteredTestCases = Array.isArray(testCases) ? testCases.filter(testCase => {
    if (filters.status && testCase.status !== filters.status) return false;
    if (filters.priority && testCase.priority !== filters.priority) return false;
    if (filters.suite && testCase.suite !== filters.suite) return false;
    if (filters.assignee && testCase.assignee !== filters.assignee) return false;
    if (filters.search && !testCase.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  }) : [];

  // 테스트 케이스 선택 처리
  const handleTestCaseSelect = useCallback((testCaseId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedTestCases(prev => [...prev, testCaseId]);
    } else {
      setSelectedTestCases(prev => prev.filter(id => id !== testCaseId));
    }
  }, []);

  // 전체 선택/해제
  const handleSelectAll = useCallback((isSelected: boolean) => {
    const currentTestCases = selectedImportedFolder ? folderTestCases : filteredTestCases;
    if (isSelected) {
      setSelectedTestCases(currentTestCases.map(tc => tc.id));
    } else {
      setSelectedTestCases([]);
    }
  }, [filteredTestCases, folderTestCases, selectedImportedFolder]);

  // 상태 변경 처리
  const handleStatusChange = useCallback((testCaseId: string, newStatus: TestCase['status'], comment?: string) => {
    onTestCaseUpdate(testCaseId, { 
      status: newStatus,
      lastUpdated: new Date().toISOString()
    });
    
    // 상세 패널이 열려있다면 닫기
    if (selectedTestCase?.id === testCaseId) {
      setSelectedTestCase(null);
    }
  }, [onTestCaseUpdate, selectedTestCase]);

  // 일괄 상태 변경
  const handleBulkStatusChange = useCallback((status: TestCase['status']) => {
    if (selectedTestCases.length === 0) return;
    
    onBulkUpdate(selectedTestCases, { 
      status,
      lastUpdated: new Date().toISOString()
    });
    
    setSelectedTestCases([]);
  }, [selectedTestCases, onBulkUpdate]);

  // 테스트 케이스 클릭 처리
  const handleTestCaseClick = useCallback((testCase: TestCase) => {
    setSelectedTestCase(testCase);
  }, []);

  // 테스트케이스 가져오기 기능
  const handleFetchTestCases = useCallback(() => {
    console.log('테스트케이스 가져오기 버튼 클릭됨');
    setShowTestCaseModal(true);
    console.log('showTestCaseModal 상태:', true);
  }, []);



  // 선택된 폴더들의 모든 테스트케이스 추가
  const handleAddSelectedFolders = useCallback(async () => {
    if (selectedTestCasesToAdd.length === 0) return;
    
    setIsLoadingTestCases(true);
    try {
      // 선택된 폴더들을 가져온 폴더 목록에 추가 (하위 폴더 제외)
      const selectedFolderObjects = Array.isArray(testFolders) ? testFolders.filter(folder => 
        selectedTestCasesToAdd.includes(folder.id)
      ) : [];
      
      // 각 폴더의 실제 테스트케이스 개수를 가져와서 업데이트
      const foldersWithRealCounts = await Promise.all(
        selectedFolderObjects.map(async (folder) => {
          try {
            // 실제 API 호출로 테스트케이스 개수 가져오기
            const response = await fetch(`http://localhost:3001/api/releases/folders/${folder.id}/testcases`);
            if (response.ok) {
              const data = await response.json();
              return {
                ...folder,
                testCaseCount: data.data?.length || 0
              };
            }
          } catch (error) {
            console.error(`폴더 ${folder.id} 테스트케이스 조회 실패:`, error);
          }
          return folder;
        })
      );
      
      // 중복 제거하여 가져온 폴더 목록에 추가
      setImportedFolders(prev => {
        const existingIds = new Set(prev.map(f => f.id));
        const newFolders = foldersWithRealCounts.filter(f => !existingIds.has(f.id));
        return [...prev, ...newFolders];
      });
      
      console.log('선택된 폴더들을 가져온 폴더 목록에 추가:', foldersWithRealCounts);
      
      // 선택된 모든 폴더의 테스트케이스를 실제로 가져와서 테스트케이스 목록에 추가
      const allTestCases = [];
      for (const folder of selectedFolderObjects) {
        try {
          const response = await fetch(`http://localhost:3001/api/releases/folders/${folder.id}/testcases`);
          if (response.ok) {
            const data = await response.json();
            if (data.data && Array.isArray(data.data)) {
              // 테스트케이스 데이터를 ExecutionView에서 사용하는 형식으로 변환
              const convertedTestCases = data.data.map((tc: any) => ({
                id: tc.id.toString(),
                name: tc.title,
                description: tc.description || '',
                priority: tc.priority || 'P2',
                status: 'Not Run',
                assignee: '',
                estimatedTime: 0,
                actualTime: 0,
                lastUpdated: new Date().toISOString(),
                tags: [],
                suite: folder.name,
                module: folder.name,
                steps: [],
                expectedResult: '',
                attachments: [],
                executionStatus: 'Not Run',
                executedAt: '',
                executedBy: ''
              }));
              allTestCases.push(...convertedTestCases);
            }
          }
        } catch (error) {
          console.error(`폴더 ${folder.id} 테스트케이스 조회 실패:`, error);
        }
      }
      
      // 가져온 테스트케이스들을 현재 테스트케이스 목록에 추가
      if (allTestCases.length > 0) {
        // 중복 제거 (ID 기준)
        const existingIds = new Set(testCases.map(tc => tc.id));
        const newTestCases = allTestCases.filter(tc => !existingIds.has(tc.id));
        
        // 부모 컴포넌트의 테스트케이스 목록에 추가
        if (onAddTestCases && newTestCases.length > 0) {
          onAddTestCases(newTestCases);
          console.log('테스트케이스 추가 완료:', newTestCases);
        }
      }
      
      // 성공 후 모달 닫기 및 선택 초기화
      setShowTestCaseModal(false);
      setSelectedTestCasesToAdd([]);
      
      // 데이터 새로고침
      await refetch();
    } catch (error) {
      console.error('테스트케이스 추가 실패:', error);
    } finally {
      setIsLoadingTestCases(false);
    }
  }, [selectedTestCasesToAdd, testFolders, testCases, refetch]);

  // 폴더의 모든 하위 폴더 ID를 재귀적으로 가져오기
  const getAllSubFolderIds = useCallback((folder: any): number[] => {
    let ids = [folder.id];
    if (folder.children) {
      folder.children.forEach((child: any) => {
        ids = [...ids, ...getAllSubFolderIds(child)];
      });
    }
    return ids;
  }, []);

  // 폴더 선택 (하위 폴더 자동 선택 없음)
  const handleFolderSelection = useCallback((folder: any, isSelected: boolean) => {
    if (isSelected) {
      setSelectedTestCasesToAdd(prev => [...new Set([...prev, folder.id])]);
    } else {
      setSelectedTestCasesToAdd(prev => prev.filter(id => id !== folder.id));
    }
  }, []);

  // 접기/펼치기 기능
  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  // 가져온 폴더 삭제
  const handleRemoveImportedFolder = useCallback((folderId: number) => {
    setImportedFolders(prev => prev.filter(folder => folder.id !== folderId));
    // 삭제된 폴더가 현재 선택된 폴더였다면 선택 해제
    if (selectedImportedFolder?.id === folderId) {
      setSelectedImportedFolder(null);
      setFolderTestCases([]);
    }
  }, [selectedImportedFolder]);

  // 가져온 폴더 클릭 처리
  const handleImportedFolderClick = useCallback(async (folder: TestFolder) => {
    setSelectedImportedFolder(folder);
    
    try {
      // 해당 폴더의 테스트 케이스 가져오기
      const response = await fetch(`http://localhost:3001/api/releases/folders/${folder.id}/testcases`);
      if (response.ok) {
        const data = await response.json();
        setFolderTestCases(data.data || []);
      } else {
        console.error('폴더 테스트 케이스 조회 실패:', response.statusText);
        setFolderTestCases([]);
      }
    } catch (error) {
      console.error('폴더 테스트 케이스 조회 실패:', error);
      setFolderTestCases([]);
    }
  }, []);

  // 폴더 트리 렌더링 컴포넌트 (모달용)
  const renderFolderTree = useCallback((folders: any[], level: number = 0) => {
    if (!Array.isArray(folders)) {
      console.warn('folders is not an array:', folders);
      return null;
    }
    return folders.map((folder) => (
      <div key={folder.id}>
        <FolderItem 
          level={level}
          className={selectedTestCasesToAdd.includes(folder.id) ? 'selected' : ''}
          onClick={() => handleFolderSelection(folder, !selectedTestCasesToAdd.includes(folder.id))}
        >
          <FolderCheckbox
            type="checkbox"
            checked={selectedTestCasesToAdd.includes(folder.id)}
            onChange={(e) => handleFolderSelection(folder, e.target.checked)}
            onClick={(e) => e.stopPropagation()}
          />
          <FolderInfo>
            <FolderIcon>📁</FolderIcon>
            <FolderName>{folder.name}</FolderName>
            <FolderCount>{folder.testCaseCount}개</FolderCount>
          </FolderInfo>
        </FolderItem>
        
        {folder.children && folder.children.length > 0 && (
          <div style={{ marginLeft: 20 }}>
            {renderFolderTree(folder.children, level + 1)}
          </div>
        )}
      </div>
    ));
  }, [selectedTestCasesToAdd, handleFolderSelection]);

  // 가져온 폴더 트리 렌더링 컴포넌트 (좌측 패널용)
  const renderImportedFolderTree = useCallback((folders: any[], level: number = 0) => {
    if (!Array.isArray(folders)) {
      console.warn('folders is not an array:', folders);
      return null;
    }
    return folders.map((folder) => (
      <div key={folder.id}>
        <FolderItem 
          level={level}
          style={{ position: 'relative' }}
          className={selectedImportedFolder?.id === folder.id ? 'selected' : ''}
          onClick={() => handleImportedFolderClick(folder)}
        >
          <FolderInfo>
            <FolderIcon>📁</FolderIcon>
            <FolderName>{folder.name}</FolderName>
            <FolderCount>{folder.testCaseCount}개</FolderCount>
          </FolderInfo>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveImportedFolder(folder.id);
            }}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '10px',
              cursor: 'pointer'
            }}
          >
            삭제
          </button>
        </FolderItem>
        
        {folder.children && folder.children.length > 0 && (
          <div style={{ marginLeft: 20 }}>
            {renderImportedFolderTree(folder.children, level + 1)}
          </div>
        )}
      </div>
    ));
  }, [handleRemoveImportedFolder, handleImportedFolderClick, selectedImportedFolder]);

  return (
    <ExecutionContainer>
      {/* 상단 컨텍스트 바 */}
      <TopContextBar>
        <ReleaseMeta>
          <ReleaseLeft>
            <ReleaseInfo>
              <ReleaseName>{release.name}</ReleaseName>
              <ReleaseDetails>
                <span>v{release.version}</span>
                {release.sprint && <span>Sprint: {release.sprint}</span>}
                {release.period && <span>Period: {release.period}</span>}
                <span>Owner: {release.owner}</span>
                <span>Created: {new Date(release.createdAt).toLocaleDateString()}</span>
              </ReleaseDetails>
            </ReleaseInfo>
            
            <LiveIndicator isLive={isLive}>
              <LiveDot isLive={isLive} />
              {isLive ? 'Live' : 'Reconnecting...'}
            </LiveIndicator>
          </ReleaseLeft>
          
          <ReleaseRight>
            <ActionButton 
              onClick={handleFetchTestCases}
              disabled={isLoadingTestCases}
            >
              {isLoadingTestCases ? '가져오는 중...' : '테스트케이스 가져오기'}
            </ActionButton>
            <CollapseButton onClick={handleToggleCollapse}>
              {isCollapsed ? '펼치기' : '접기'}
            </CollapseButton>
          </ReleaseRight>
        </ReleaseMeta>

        <ProgressSummary>
          <ProgressItem>
            <ProgressNumber color="#6b7280">Planned {totalTestCases}</ProgressNumber>
            <ProgressLabel>Planned</ProgressLabel>
          </ProgressItem>
          <ProgressItem>
            <ProgressNumber color="#3b82f6">Executed {executedTestCases}</ProgressNumber>
            <ProgressLabel>Executed</ProgressLabel>
          </ProgressItem>
          <ProgressItem>
            <ProgressNumber color="#10b981">Pass {passedTestCases}</ProgressNumber>
            <ProgressLabel>Pass</ProgressLabel>
          </ProgressItem>
          <ProgressItem>
            <ProgressNumber color="#ef4444">Fail {failedTestCases}</ProgressNumber>
            <ProgressLabel>Fail</ProgressLabel>
          </ProgressItem>
          <ProgressItem>
            <ProgressNumber color="#f59e0b">Block {blockedTestCases}</ProgressNumber>
            <ProgressLabel>Block</ProgressLabel>
          </ProgressItem>
          <ProgressItem>
            <ProgressNumber color="#8b5cf6">Skip {skippedTestCases}</ProgressNumber>
            <ProgressLabel>Skip</ProgressLabel>
          </ProgressItem>
          
          <ProgressBar>
            <ProgressFill percentage={progressPercentage} />
          </ProgressBar>
          
          <ProgressItem>
            <ProgressNumber color="#1e293b">{progressPercentage}%</ProgressNumber>
            <ProgressLabel>Progress</ProgressLabel>
          </ProgressItem>
        </ProgressSummary>

        <FilterSummary>
          {filters.status && <FilterBadge>Status: {filters.status}</FilterBadge>}
          {filters.priority && <FilterBadge>Priority: {filters.priority}</FilterBadge>}
          {filters.suite && <FilterBadge>Suite: {filters.suite}</FilterBadge>}
          {filters.assignee && <FilterBadge>Assignee: {filters.assignee}</FilterBadge>}
          {filters.search && <FilterBadge>Search: "{filters.search}"</FilterBadge>}
          {selectedTestCases.length > 0 && (
            <FilterBadge>{selectedTestCases.length} selected</FilterBadge>
          )}
        </FilterSummary>
      </TopContextBar>

      {/* 메인 콘텐츠 영역 - 접기/펼치기 기능 */}
      {!isCollapsed && (
        <MainContent>
        {/* 좌측 테스트케이스 폴더 패널 */}
        <FilterPanel>
          <FilterSection>
            <FilterTitle>가져온 테스트케이스 폴더</FilterTitle>
            
            {importedFolders.length > 0 ? (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <button 
                    onClick={() => setShowTestCaseModal(true)}
                    style={{
                      padding: '8px 16px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    + 폴더 추가
                  </button>
                </div>
                <FolderList>
                  {renderImportedFolderTree(importedFolders)}
                </FolderList>
              </div>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                가져온 테스트케이스가 없습니다.
                <br />
                <button 
                  onClick={() => setShowTestCaseModal(true)}
                  style={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  테스트케이스 가져오기
                </button>
              </div>
            )}
          </FilterSection>

          <SavedFilters>
            <FilterTitle>Saved Views</FilterTitle>
            <SavedFilterItem>
              <span>My Default View</span>
            </SavedFilterItem>
            <SavedFilterItem>
              <span>High Priority Tests</span>
            </SavedFilterItem>
            <SavedFilterItem>
              <span>Failed Tests</span>
            </SavedFilterItem>
          </SavedFilters>

          {selectedTestCases.length > 0 && (
            <BulkActionPanel>
              <FilterTitle>Bulk Actions</FilterTitle>
              <BulkActionButton
                variant="pass"
                onClick={() => handleBulkStatusChange('Pass')}
              >
                Mark All as Pass
              </BulkActionButton>
              <BulkActionButton
                variant="fail"
                onClick={() => handleBulkStatusChange('Fail')}
              >
                Mark All as Fail
              </BulkActionButton>
              <BulkActionButton
                variant="block"
                onClick={() => handleBulkStatusChange('Block')}
              >
                Mark All as Block
              </BulkActionButton>
              <BulkActionButton
                variant="skip"
                onClick={() => handleBulkStatusChange('Skip')}
              >
                Mark All as Skip
              </BulkActionButton>
            </BulkActionPanel>
          )}
        </FilterPanel>

        {/* 중앙 테스트 리스트 */}
        <TestListContainer>
          <TestListHeader>
            <TestListTitle>
              {selectedImportedFolder 
                ? `${selectedImportedFolder.name} 폴더의 테스트 케이스 (${folderTestCases.length}개)`
                : `Test Cases (${filteredTestCases.length} of ${totalTestCases})`
              }
            </TestListTitle>
          </TestListHeader>

          <TestTable>
            <TableHeader>
              <div>
                <input
                  type="checkbox"
                  checked={selectedTestCases.length === (selectedImportedFolder ? folderTestCases : filteredTestCases).length && (selectedImportedFolder ? folderTestCases : filteredTestCases).length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </div>
              <div>Status</div>
              <div>Priority</div>
              <div>Test Case</div>
              <div>Suite</div>
              <div>Module</div>
              <div>Assignee</div>
              <div>Last Result</div>
              <div>Actions</div>
            </TableHeader>

            {(selectedImportedFolder ? folderTestCases : filteredTestCases).map((testCase) => (
              <TableRow
                key={testCase.id}
                isSelected={selectedTestCases.includes(testCase.id)}
                onClick={() => handleTestCaseClick(testCase)}
              >
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedTestCases.includes(testCase.id)}
                    onChange={(e) => handleTestCaseSelect(testCase.id, e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
                <TableCell>
                  <StatusBadge status={testCase.status}>
                    {testCase.status}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={testCase.priority}>
                    {testCase.priority}
                  </PriorityBadge>
                </TableCell>
                <TableCell>
                  <div>
                    <div style={{ fontWeight: 500 }}>{testCase.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      {testCase.description.substring(0, 60)}...
                    </div>
                  </div>
                </TableCell>
                <TableCell>{testCase.suite || '-'}</TableCell>
                <TableCell>{testCase.module || '-'}</TableCell>
                <TableCell>{testCase.assignee || '-'}</TableCell>
                <TableCell>
                  {testCase.lastUpdated ? new Date(testCase.lastUpdated).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell>
                  <QuickActionButton
                    action="pass"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(testCase.id, 'Pass');
                    }}
                  >
                    Pass
                  </QuickActionButton>
                  <QuickActionButton
                    action="fail"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(testCase.id, 'Fail');
                    }}
                  >
                    Fail
                  </QuickActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TestTable>
        </TestListContainer>

        {/* 우측 상세 패널 */}
        <DetailPanel isOpen={!!selectedTestCase}>
          {selectedTestCase && (
            <DetailContent>
              <DetailSection>
                <DetailTitle>Overview</DetailTitle>
                <DetailText><strong>ID:</strong> {selectedTestCase.id}</DetailText>
                <DetailText><strong>Name:</strong> {selectedTestCase.name}</DetailText>
                <DetailText><strong>Description:</strong> {selectedTestCase.description}</DetailText>
                <DetailText><strong>Priority:</strong> {selectedTestCase.priority}</DetailText>
                <DetailText><strong>Status:</strong> {selectedTestCase.status}</DetailText>
                <DetailText><strong>Assignee:</strong> {selectedTestCase.assignee || 'Unassigned'}</DetailText>
                <DetailText><strong>Suite:</strong> {selectedTestCase.suite || 'No Suite'}</DetailText>
                <DetailText><strong>Module:</strong> {selectedTestCase.module || 'No Module'}</DetailText>
              </DetailSection>

              {selectedTestCase.steps && (
                <DetailSection>
                  <DetailTitle>Steps</DetailTitle>
                  <DetailText>{selectedTestCase.steps.join('\n')}</DetailText>
                </DetailSection>
              )}

              {selectedTestCase.expectedResult && (
                <DetailSection>
                  <DetailTitle>Expected Result</DetailTitle>
                  <DetailText>{selectedTestCase.expectedResult}</DetailText>
                </DetailSection>
              )}

              <DetailSection>
                <DetailTitle>Run Test</DetailTitle>
                <StatusChangeForm>
                  <StatusRadioGroup>
                    {(['Pass', 'Fail', 'Block', 'Skip'] as const).map((status) => (
                      <StatusRadio key={status}>
                        <input
                          type="radio"
                          name="status"
                          value={status}
                          checked={selectedTestCase.status === status}
                          onChange={() => handleStatusChange(selectedTestCase.id, status)}
                        />
                        <StatusBadge status={status}>{status}</StatusBadge>
                      </StatusRadio>
                    ))}
                  </StatusRadioGroup>
                  
                  <FilterLabel>Comment (Optional)</FilterLabel>
                  <CommentTextarea placeholder="Add a comment about this test execution..." />
                  
                  <SaveButton onClick={() => setSelectedTestCase(null)}>
                    Save Result
                  </SaveButton>
                </StatusChangeForm>
              </DetailSection>

              <DetailSection>
                <DetailTitle>History</DetailTitle>
                <HistoryList>
                  <HistoryItem>
                    <HistoryMeta>
                      <span>John Doe</span>
                      <span>2024-01-15 14:30</span>
                    </HistoryMeta>
                    <HistoryChange>Status changed from Not Run to Pass</HistoryChange>
                  </HistoryItem>
                  <HistoryItem>
                    <HistoryMeta>
                      <span>Jane Smith</span>
                      <span>2024-01-14 16:45</span>
                    </HistoryMeta>
                    <HistoryChange>Status changed from Pass to Fail</HistoryChange>
                  </HistoryItem>
                </HistoryList>
              </DetailSection>
            </DetailContent>
          )}
        </DetailPanel>
        </MainContent>
      )}

      {/* 테스트케이스 선택 모달 */}
      {console.log('모달 렌더링 조건 확인:', showTestCaseModal)}
      {showTestCaseModal && (
        <ModalOverlay onClick={() => setShowTestCaseModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>테스트케이스 가져오기</ModalTitle>
              <CloseButton onClick={() => setShowTestCaseModal(false)}>×</CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <div style={{ padding: '20px' }}>
                <h3 style={{ marginBottom: '16px', textAlign: 'center' }}>테스트 관리에서 폴더 선택</h3>
                <p style={{ marginBottom: '16px', color: '#6b7280', textAlign: 'center' }}>
                  가져올 폴더를 선택하세요. 각 폴더를 개별적으로 선택할 수 있습니다.
                </p>
                <FolderList>
                  {Array.isArray(testFolders) ? renderFolderTree(testFolders) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                      {foldersLoading ? '폴더 목록을 불러오는 중...' : '폴더 목록을 불러올 수 없습니다.'}
                    </div>
                  )}
                </FolderList>
              </div>
            </ModalBody>
            
            <ModalFooter>
              <CancelButton onClick={() => setShowTestCaseModal(false)}>
                취소
              </CancelButton>
              <AddButton 
                onClick={handleAddSelectedFolders}
                disabled={selectedTestCasesToAdd.length === 0 || isLoadingTestCases}
              >
                {isLoadingTestCases ? '추가 중...' : `선택된 ${selectedTestCasesToAdd.length}개 폴더 추가`}
              </AddButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </ExecutionContainer>
  );
};

export default ExecutionView;
