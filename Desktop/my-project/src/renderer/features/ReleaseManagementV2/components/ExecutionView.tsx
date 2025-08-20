import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useGetReleaseTestCasesQuery, useGetTestFoldersQuery } from '../../../services/api';
import { 
  setImportedFolders, 
  addImportedFolder, 
  removeImportedFolder, 
  clearImportedFolders,
  ImportedFolder 
} from '../../../store';
import type { RootState } from '../../../store';

// 타입 정의
interface TestCase {
  id: string;
  name: string;
  title?: string;
  description: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3' | 'High' | 'Medium' | 'Low';
  status: 'Not Run' | 'Pass' | 'Fail' | 'Block' | 'Skip' | 'Active' | 'Inactive';
  assignee?: string;
  estimatedTime?: number;
  actualTime?: number;
  lastUpdated: string;
  tags: string[];
  suite?: string;
  module?: string;
  steps?: string[] | string;
  expectedResult?: string;
  expected?: string;
  prereq?: string;
  attachments?: string[];
  executionStatus?: string;
  executedAt?: string;
  executedBy?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
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

// 테스트 관리 영역과 동일한 폴더 트리 스타일드 컴포넌트들
const ImportFolderItem = styled.div<{ level: number; isSelected: boolean }>`
  display: flex;
  align-items: center;
  height: 28px;
  padding-left: ${props => props.level * 16 + 12}px;
  padding-right: 12px;
  cursor: pointer;
  position: relative;
  background: ${props => props.isSelected ? '#dbeafe' : 'transparent'};
  border-left: ${props => props.isSelected ? '3px solid #3b82f6' : 'none'};
  transition: background-color 0.2s ease;
  font-weight: ${props => props.isSelected ? '600' : '400'};

  &:hover {
    background: ${props => props.isSelected ? '#dbeafe' : '#f9fafb'};
  }
`;

const ImportFolderCheckbox = styled.input`
  margin-right: 8px;
  width: 14px;
  height: 14px;
  accent-color: #3b82f6;
`;

const ImportFolderIcon = styled.div`
  width: 16px;
  height: 16px;
  margin-right: 8px;
  position: relative;
  color: #6b7280;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 2px solid currentColor;
    border-radius: 2px;
    background: transparent;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 2px;
    right: 2px;
    height: 3px;
    background: currentColor;
    border-radius: 1px 1px 0 0;
  }
`;

const ImportTextContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
`;

const ImportFolderName = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: block;
`;

const ImportTestCaseCount = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  margin-left: 4px;
`;

const ImportFolderChildren = styled.div`
  position: relative;
`;

const ImportRemoveButton = styled.button`
  width: 20px;
  height: 20px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  margin-left: 8px;

  &:hover {
    background: #dc2626;
  }

  ${ImportFolderItem}:hover & {
    opacity: 1;
  }
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
const FilterPanel = styled.div<{ width: number }>`
  width: ${props => props.width}px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: relative;
`;

// 좌측 패널 크기 조절 핸들
const LeftPanelResizeHandle = styled.div`
  position: absolute;
  top: 0;
  right: -4px;
  width: 8px;
  height: 100%;
  cursor: col-resize;
  background: transparent;
  z-index: 10;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 20px;
    background: #d1d5db;
    border-radius: 1px;
  }
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
const DetailPanel = styled.div<{ isOpen: boolean; width: number }>`
  width: ${props => props.isOpen ? `${props.width}px` : '0'};
  background: white;
  border-left: 1px solid #e2e8f0;
  overflow: hidden;
  transition: width 0.3s ease;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
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

const DetailHeaderTitle = styled.h3`
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
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 0;
  min-height: 0;
`;

// 심플한 오버뷰 스타일드 컴포넌트들
const SimpleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
`;

const SimpleTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
  flex: 1;
`;

const SimpleStatus = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-left: 12px;
  
  background: ${props => {
    switch (props.status) {
      case 'Pass': return '#dcfce7';
      case 'Fail': return '#fee2e2';
      case 'Block': return '#fef3c7';
      case 'Skip': return '#f3e8ff';
      case 'Active': return '#dbeafe';
      case 'Inactive': return '#f1f5f9';
      default: return '#f1f5f9';
    }
  }};
  
  color: ${props => {
    switch (props.status) {
      case 'Pass': return '#166534';
      case 'Fail': return '#dc2626';
      case 'Block': return '#d97706';
      case 'Skip': return '#7c3aed';
      case 'Active': return '#2563eb';
      case 'Inactive': return '#64748b';
      default: return '#64748b';
    }
  }};
`;

const SimpleInfo = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
`;

const SimpleInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SimpleLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
`;

const SimpleValue = styled.span<{ priority?: string }>`
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  
  ${props => props.priority && `
    color: ${props.priority === 'High' ? '#dc2626' : 
            props.priority === 'Medium' ? '#d97706' : 
            props.priority === 'Low' ? '#059669' : '#1e293b'};
  `}
`;

const SimpleSection = styled.div`
  margin-bottom: 16px;
`;

const SimpleText = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: #4b5563;
  margin-top: 4px;
  padding: 8px 0;
`;

const SimpleSteps = styled.div`
  margin-top: 4px;
`;

const SimpleStep = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  padding: 4px 0;
`;

const SimpleStepNumber = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #3b82f6;
  min-width: 20px;
`;

const SimpleStepText = styled.span`
  font-size: 14px;
  line-height: 1.4;
  color: #4b5563;
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

const ExecutionView: React.FC<ExecutionViewProps> = ({ release, testCases = [], onTestCaseUpdate, onBulkUpdate, onAddTestCases }) => {
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
  const dispatch = useDispatch();
  const importedFolders = useSelector((state: RootState) => 
    state.importedFolders.foldersByRelease[release.id] || []
  );
  const [selectedImportedFolder, setSelectedImportedFolder] = useState<ImportedFolder | null>(null);
  const [folderTestCases, setFolderTestCases] = useState<TestCase[]>([]);
  const [detailPanelWidth, setDetailPanelWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(280);
  const [isLeftPanelResizing, setIsLeftPanelResizing] = useState(false);

  // API 호출
  const { data: apiTestCases = [], isLoading, error, refetch } = useGetReleaseTestCasesQuery(Number(release.id));
  const { data: folders = [] } = useGetTestFoldersQuery();

  // 우측 패널 크기 조절 이벤트 핸들러
  const handleDetailPanelResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleDetailPanelResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const container = document.querySelector('.execution-container');
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const newWidth = containerRect.right - e.clientX;
    
    // 최소/최대 너비 제한
    if (newWidth >= 300 && newWidth <= 800) {
      setDetailPanelWidth(newWidth);
    }
  }, [isResizing]);

  const handleDetailPanelResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  // 좌측 패널 크기 조절 이벤트 핸들러
  const handleLeftPanelResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLeftPanelResizing(true);
  };

  const handleLeftPanelResizeMove = useCallback((e: MouseEvent) => {
    if (!isLeftPanelResizing) return;
    
    const container = document.querySelector('.execution-container');
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const newWidth = e.clientX - containerRect.left;
    
    // 최소 200px, 최대 500px로 제한
    const clampedWidth = Math.max(200, Math.min(500, newWidth));
    setLeftPanelWidth(clampedWidth);
  }, [isLeftPanelResizing]);

  const handleLeftPanelResizeEnd = useCallback(() => {
    setIsLeftPanelResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleDetailPanelResizeMove);
      document.addEventListener('mouseup', handleDetailPanelResizeEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleDetailPanelResizeMove);
        document.removeEventListener('mouseup', handleDetailPanelResizeEnd);
      };
    }
  }, [isResizing, handleDetailPanelResizeMove, handleDetailPanelResizeEnd]);

  useEffect(() => {
    if (isLeftPanelResizing) {
      document.addEventListener('mousemove', handleLeftPanelResizeMove);
      document.addEventListener('mouseup', handleLeftPanelResizeEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleLeftPanelResizeMove);
        document.removeEventListener('mouseup', handleLeftPanelResizeEnd);
      };
    }
  }, [isLeftPanelResizing, handleLeftPanelResizeMove, handleLeftPanelResizeEnd]);

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
      const selectedFolderObjects = Array.isArray(folders) ? folders.filter(folder => 
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
      const existingIds = new Set(importedFolders.map(f => f.id));
      const newFolders = foldersWithRealCounts.filter(f => !existingIds.has(f.id));
      
      // Redux 액션으로 폴더 추가
      newFolders.forEach(folder => {
        dispatch(addImportedFolder({ releaseId: release.id, folder }));
      });
      
      console.log('선택된 폴더들을 가져온 폴더 목록에 추가:', foldersWithRealCounts);
      
      // 선택된 모든 폴더의 테스트케이스를 실제로 가져와서 릴리즈에 추가
      const allTestCaseIds = [];
      for (const folder of selectedFolderObjects) {
        try {
          const response = await fetch(`http://localhost:3001/api/releases/folders/${folder.id}/testcases`);
          if (response.ok) {
            const data = await response.json();
            if (data.data && Array.isArray(data.data)) {
              // 테스트케이스 ID들을 수집
              const testCaseIds = data.data.map((tc: any) => tc.id);
              allTestCaseIds.push(...testCaseIds);
            }
          }
        } catch (error) {
          console.error(`폴더 ${folder.id} 테스트케이스 조회 실패:`, error);
        }
      }
      
      // 릴리즈에 테스트케이스 추가
      if (allTestCaseIds.length > 0) {
        try {
          const addResponse = await fetch(`http://localhost:3001/api/releases/${release.id}/testcases`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              testCaseIds: allTestCaseIds
            })
          });

          if (addResponse.ok) {
            const addResult = await addResponse.json();
            console.log('테스트케이스 릴리즈 추가 완료:', addResult);
            
            // 성공 후 모달 닫기 및 선택 초기화
            setShowTestCaseModal(false);
            setSelectedTestCasesToAdd([]);
            
            // 데이터 새로고침
            await refetch();
          } else {
            console.error('테스트케이스 릴리즈 추가 실패:', addResponse.statusText);
          }
        } catch (error) {
          console.error('테스트케이스 릴리즈 추가 실패:', error);
        }
      }
    } catch (error) {
      console.error('테스트케이스 추가 실패:', error);
    } finally {
      setIsLoadingTestCases(false);
    }
  }, [selectedTestCasesToAdd, folders, release.id, refetch]);

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
    dispatch(removeImportedFolder({ releaseId: release.id, folderId }));
    // 삭제된 폴더가 현재 선택된 폴더였다면 선택 해제
    if (selectedImportedFolder?.id === folderId) {
      setSelectedImportedFolder(null);
      setFolderTestCases([]);
    }
  }, [selectedImportedFolder, dispatch, release.id]);

  // 가져온 폴더 클릭 처리
  const handleImportedFolderClick = useCallback(async (folder: ImportedFolder) => {
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

  // 폴더 배열을 트리 구조로 변환하는 함수
  const buildFolderTree = useCallback((folders: any[]): any[] => {
    const folderMap = new Map();
    const rootFolders: any[] = [];

    // 모든 폴더를 Map에 저장
    folders.forEach(folder => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });

    // 부모-자식 관계 설정
    folders.forEach(folder => {
      const folderNode = folderMap.get(folder.id);
      if (folder.parent_id === null) {
        // 루트 폴더
        rootFolders.push(folderNode);
      } else {
        // 하위 폴더
        const parentNode = folderMap.get(folder.parent_id);
        if (parentNode) {
          parentNode.children.push(folderNode);
        }
      }
    });

    return rootFolders;
  }, []);

  // 폴더 트리 렌더링 컴포넌트 (모달용)
  const renderFolderTree = useCallback((folders: any[], level: number = 0) => {
    if (!Array.isArray(folders)) {
      console.warn('folders is not an array:', folders);
      return null;
    }
    return folders.map((folder) => (
      <div key={folder.id}>
        <ImportFolderItem 
          level={level}
          isSelected={selectedTestCasesToAdd.includes(folder.id)}
          onClick={() => handleFolderSelection(folder, !selectedTestCasesToAdd.includes(folder.id))}
        >
          <ImportFolderCheckbox
            type="checkbox"
            checked={selectedTestCasesToAdd.includes(folder.id)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFolderSelection(folder, e.target.checked)}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          />
          <ImportFolderIcon />
          <ImportTextContainer>
            <ImportFolderName>{folder.name}</ImportFolderName>
            <ImportTestCaseCount>({folder.testCaseCount}개)</ImportTestCaseCount>
          </ImportTextContainer>
        </ImportFolderItem>
        
        {folder.children && folder.children.length > 0 && (
          <ImportFolderChildren>
            {renderFolderTree(folder.children, level + 1)}
          </ImportFolderChildren>
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
        <ImportFolderItem 
          level={level}
          isSelected={selectedImportedFolder?.id === folder.id}
          onClick={() => handleImportedFolderClick(folder)}
        >
          <ImportFolderIcon />
          <ImportTextContainer>
            <ImportFolderName>{folder.name}</ImportFolderName>
            <ImportTestCaseCount>({folder.testCaseCount}개)</ImportTestCaseCount>
          </ImportTextContainer>
          <ImportRemoveButton
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleRemoveImportedFolder(folder.id);
            }}
          >
            ×
          </ImportRemoveButton>
        </ImportFolderItem>
        
        {folder.children && folder.children.length > 0 && (
          <ImportFolderChildren>
            {renderImportedFolderTree(folder.children, level + 1)}
          </ImportFolderChildren>
        )}
      </div>
    ));
  }, [handleRemoveImportedFolder, handleImportedFolderClick, selectedImportedFolder]);

  return (
    <ExecutionContainer className="execution-container">
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
        <FilterPanel width={leftPanelWidth}>
          <LeftPanelResizeHandle onMouseDown={handleLeftPanelResizeStart} />
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
                  {renderImportedFolderTree(buildFolderTree(importedFolders))}
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
        <DetailPanel isOpen={!!selectedTestCase} width={detailPanelWidth} onMouseDown={handleDetailPanelResizeStart}>
          <DetailHeader>
            <DetailHeaderTitle>Test Case Details</DetailHeaderTitle>
            <CloseButton onClick={() => setSelectedTestCase(null)}>×</CloseButton>
          </DetailHeader>
          <ResizeHandle onMouseDown={handleDetailPanelResizeStart} />
          <DetailContent onMouseUp={handleDetailPanelResizeEnd} onMouseMove={handleDetailPanelResizeMove} onMouseLeave={handleDetailPanelResizeEnd}>
            {selectedTestCase && (
              <>
                <DetailSection>
                  <DetailTitle>Overview</DetailTitle>
                  
                  {/* 제목과 상태 */}
                  <SimpleHeader>
                    <SimpleTitle>{selectedTestCase.title || selectedTestCase.name}</SimpleTitle>
                    <SimpleStatus status={selectedTestCase.status}>{selectedTestCase.status}</SimpleStatus>
                  </SimpleHeader>

                  {/* 기본 정보 */}
                  <SimpleInfo>
                    <SimpleInfoItem>
                      <SimpleLabel>ID:</SimpleLabel>
                      <SimpleValue>#{selectedTestCase.id}</SimpleValue>
                    </SimpleInfoItem>
                    <SimpleInfoItem>
                      <SimpleLabel>Priority:</SimpleLabel>
                      <SimpleValue priority={selectedTestCase.priority}>{selectedTestCase.priority}</SimpleValue>
                    </SimpleInfoItem>
                    <SimpleInfoItem>
                      <SimpleLabel>Author:</SimpleLabel>
                      <SimpleValue>{selectedTestCase.createdBy || 'admin'}</SimpleValue>
                    </SimpleInfoItem>
                  </SimpleInfo>

                  {/* 설명 */}
                  <SimpleSection>
                    <SimpleLabel>Description</SimpleLabel>
                    <SimpleText>{selectedTestCase.description || '설명이 없습니다.'}</SimpleText>
                  </SimpleSection>

                  {/* 사전 조건 */}
                  <SimpleSection>
                    <SimpleLabel>Prerequisites</SimpleLabel>
                    <SimpleText>{selectedTestCase.prereq || '사전 조건이 없습니다.'}</SimpleText>
                  </SimpleSection>

                  {/* 테스트 단계 */}
                  <SimpleSection>
                    <SimpleLabel>Test Steps</SimpleLabel>
                    <SimpleSteps>
                      {(() => {
                        let stepsArray: string[] = [];
                        if (selectedTestCase.steps) {
                          if (Array.isArray(selectedTestCase.steps)) {
                            stepsArray = selectedTestCase.steps;
                          } else if (typeof selectedTestCase.steps === 'string') {
                            try {
                              stepsArray = JSON.parse(selectedTestCase.steps);
                            } catch (e) {
                              stepsArray = [selectedTestCase.steps];
                            }
                          }
                        }
                        
                        if (stepsArray.length > 0) {
                          return stepsArray.map((step: string, index: number) => (
                            <SimpleStep key={index}>
                              <SimpleStepNumber>{index + 1}.</SimpleStepNumber>
                              <SimpleStepText>{step}</SimpleStepText>
                            </SimpleStep>
                          ));
                        } else {
                          return (
                            <SimpleStep>
                              <SimpleStepNumber>1.</SimpleStepNumber>
                              <SimpleStepText>No steps defined</SimpleStepText>
                            </SimpleStep>
                          );
                        }
                      })()}
                    </SimpleSteps>
                  </SimpleSection>

                  {/* 예상 결과 */}
                  <SimpleSection>
                    <SimpleLabel>Expected Result</SimpleLabel>
                    <SimpleText>{selectedTestCase.expected || selectedTestCase.expectedResult || '예상 결과가 없습니다.'}</SimpleText>
                  </SimpleSection>
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
              </>
            )}
          </DetailContent>
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
                  {Array.isArray(folders) ? renderFolderTree(buildFolderTree(folders)) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                      {isLoading ? '폴더 목록을 불러오는 중...' : '폴더 목록을 불러올 수 없습니다.'}
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
