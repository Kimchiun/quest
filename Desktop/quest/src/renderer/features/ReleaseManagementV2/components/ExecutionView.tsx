import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useGetReleaseTestCasesQuery, useUpdateReleaseExecutionStatsMutation, useGetReleaseExecutionStatsQuery, useUpdateTestCaseStatusMutation, useGetTestFoldersQuery, useGetImportedFoldersQuery, useAddImportedFoldersMutation, useRemoveImportedFolderMutation } from '../../../services/api';


// 타입 정의
interface TestCase {
  id: string;
  name: string;
  title?: string;
  description: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3' | 'High' | 'Medium' | 'Low';
  status: 'Not Run' | 'Pass' | 'Fail' | 'Block' | 'Blocked' | 'Skip' | 'Active' | 'Inactive';
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
  onTestCasesLoad?: (testCases: TestCase[]) => void;
}

// 스타일 컴포넌트
const ExecutionContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8fafc;
  margin: 0; // 패딩 상쇄 제거
`;

// 상단 컨텍스트 바 - 흰색 컨셉 디자인
const TopContextBar = styled.div<{ isCollapsed: boolean }>`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-bottom: 1px solid #e2e8f0;
  padding: ${props => props.isCollapsed ? '16px 24px' : '24px 24px'};
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  color: #1e293b;
  transition: all 0.3s ease;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #cbd5e1 50%, transparent 100%);
  }
  
  @media (max-width: 1440px) {
    padding: ${props => props.isCollapsed ? '14px 20px' : '20px 20px'};
  }
  
  @media (max-width: 1280px) {
    padding: ${props => props.isCollapsed ? '12px 16px' : '16px 16px'};
  }
  
  @media (max-width: 768px) {
    padding: ${props => props.isCollapsed ? '10px 12px' : '12px 12px'};
  }
`;

const ReleaseMeta = styled.div<{ isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.isCollapsed ? '0' : '16px'};
`;

const ReleaseLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ReleaseRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ReleaseInfo = styled.div<{ isCollapsed: boolean }>`
  display: flex;
  flex-direction: ${props => props.isCollapsed ? 'row' : 'column'};
  align-items: ${props => props.isCollapsed ? 'center' : 'flex-start'};
  gap: ${props => props.isCollapsed ? '16px' : '6px'};
`;

const ReleaseNameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ReleaseName = styled.h2<{ isCollapsed: boolean }>`
  margin: 0;
  font-size: ${props => props.isCollapsed ? '18px' : '24px'};
  font-weight: 700;
  color: #1e293b;
  transition: all 0.3s ease;
`;

const ReleaseDetails = styled.div<{ isCollapsed: boolean }>`
  display: flex;
  gap: ${props => props.isCollapsed ? '12px' : '20px'};
  font-size: ${props => props.isCollapsed ? '12px' : '14px'};
  color: #64748b;
  align-items: center;
  transition: all 0.3s ease;
`;

const ReleaseDetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #f1f5f9;
  border-radius: 6px;
  font-weight: 500;
  font-size: 13px;
  border: 1px solid #e2e8f0;
  color: #475569;

  &::before {
    content: '';
    width: 4px;
    height: 4px;
    background: #64748b;
    border-radius: 50%;
  }
`;

const ProgressSummary = styled.div<{ isCollapsed: boolean }>`
  display: ${props => props.isCollapsed ? 'none' : 'flex'};
  align-items: center;
  gap: 20px;
  padding: 16px 20px;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #3b82f6;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover:not(:disabled) {
    background: #2563eb;
    border-color: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #e5e7eb;
    border-color: #d1d5db;
    color: #9ca3af;
    cursor: not-allowed;
    opacity: 0.6;
  }

  &::before {
    content: '';
    width: 16px;
    height: 16px;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>');
    background-size: contain;
    background-repeat: no-repeat;
  }
`;

const CollapseButton = styled.button<{ isCollapsed: boolean }>`
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #f8fafc;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
    color: #475569;
  }

  &::before {
    content: '';
    width: 14px;
    height: 14px;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${props => props.isCollapsed ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'}"/></svg>');
    background-size: contain;
    background-repeat: no-repeat;
    transition: transform 0.2s ease;
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
const ImportFolderItem = styled.div<{ level: number; $isSelected: boolean }>`
  display: flex;
  align-items: center;
  height: 28px;
  padding-left: ${props => props.level * 16 + 12}px;
  padding-right: 12px;
  cursor: pointer;
  position: relative;
  background: ${props => props.$isSelected ? '#dbeafe' : 'transparent'};
  border-left: ${props => props.$isSelected ? '3px solid #3b82f6' : 'none'};
  transition: background-color 0.2s ease;
  font-weight: ${props => props.$isSelected ? '600' : '400'};

  &:hover {
    background: ${props => props.$isSelected ? '#dbeafe' : '#f9fafb'};
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
  justify-content: center;
  gap: 6px;
  padding: 12px 16px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  min-width: 80px;
  min-height: 65px;
  flex: 1;

  &:hover {
    background: #fafafa;
    border-color: #cbd5e1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

const ProgressNumber = styled.span<{ color: string }>`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.color};
  line-height: 1;
`;

const ProgressLabel = styled.span<{ color: string }>`
  font-size: 11px;
  color: ${props => props.color};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
  margin: 0 24px;
  border: 1px solid #e2e8f0;
`;

const ProgressFill = styled.div<{ percentage: number }>`
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #10b981);
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
  border-radius: 4px;
`;

const FilterSummary = styled.div<{ isCollapsed: boolean }>`
  display: ${props => props.isCollapsed ? 'none' : 'flex'};
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
`;

const FilterBadge = styled.span`
  background: #f1f5f9;
  color: #475569;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #e2e8f0;
`;

const LiveIndicator = styled.div<{ $isLive: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background: ${props => props.$isLive 
    ? '#ecfdf5' 
    : '#fef2f2'};
  color: ${props => props.$isLive ? '#16a34a' : '#dc2626'};
  border: 1px solid ${props => props.$isLive 
    ? '#bbf7d0' 
    : '#fecaca'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const LiveDot = styled.div<{ $isLive: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${props => props.$isLive ? '#16a34a' : '#dc2626'};
  animation: ${props => props.$isLive ? 'livePulse 2s infinite' : 'none'};
  
  @keyframes livePulse {
    0%, 100% { 
      opacity: 1; 
      transform: scale(1);
    }
    50% { 
      opacity: 0.5; 
      transform: scale(1.1);
    }
  }
`;

// 메인 콘텐츠 영역
const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0; // flex 아이템이 축소될 수 있도록 함
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
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
  height: 100%; // 전체 높이 사용
  min-height: 0; // flex 축소 허용
  
  @media (max-width: 1440px) {
    width: ${props => Math.max(props.width * 0.9, 200)}px;
  }
  
  @media (max-width: 1280px) {
    width: ${props => Math.max(props.width * 0.7, 180)}px;
  }
  
  @media (max-width: 1024px) {
    width: ${props => Math.max(props.width * 0.6, 160)}px;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }
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
  min-width: 0; // flex 아이템이 축소될 수 있도록 함
  height: 100%; // 전체 높이 사용
  min-height: 0; // flex 축소 허용
`;

const TestListHeader = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  
  @media (max-width: 1440px) {
    padding: 14px 20px;
  }
  
  @media (max-width: 1280px) {
    padding: 12px 16px;
  }
  
  @media (max-width: 768px) {
    padding: 10px 12px;
  }
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
  min-height: 0; // flex 아이템이 축소될 수 있도록 함
  height: 100%; // 전체 높이 사용
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 80px 80px 1fr 120px 120px 100px 120px 120px;
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
  
  @media (max-width: 1440px) {
    grid-template-columns: 40px 70px 70px 1fr 100px 100px 90px 100px 90px;
    gap: 12px;
    padding: 10px 20px;
    font-size: 11px;
  }
  
  @media (max-width: 1280px) {
    grid-template-columns: 35px 60px 60px 1fr 90px 90px 80px 90px 80px;
    gap: 10px;
    padding: 8px 16px;
    font-size: 11px;
  }
  
  @media (max-width: 1024px) {
    grid-template-columns: 30px 50px 50px 1fr 80px 80px 70px;
    gap: 8px;
    padding: 8px 12px;
    font-size: 10px;
  }
  
  @media (max-width: 768px) {
    display: none; // 모바일에서는 카드 형태로 변경
  }
`;

const TableRow = styled.div<{ isSelected?: boolean; status?: string }>`
  display: grid;
  grid-template-columns: 40px 80px 80px 1fr 120px 120px 100px 120px 120px;
  gap: 16px;
  padding: 12px 24px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  
  /* 실행되지 않은 케이스 - 흐릿하게 표시 */
  opacity: ${props => {
    const isExecuted = props.status && props.status !== 'Not Run' && props.status !== 'Inactive';
    return isExecuted ? 1 : 0.6;
  }};
  
  /* 실행 상태에 따른 배경색 */
  background: ${props => {
    if (props.isSelected) return '#eff6ff';
    const isExecuted = props.status && props.status !== 'Not Run' && props.status !== 'Inactive';
    if (!isExecuted) return '#fafafa'; // 실행되지 않은 케이스는 회색 배경
    
    switch (props.status) {
      case 'Pass': return '#f0fdf4';
      case 'Fail': return '#fef2f2';
      case 'Block': return '#fffbeb';
      case 'Skip': return '#faf5ff';
      default: return '#ffffff';
    }
  }};
  
  /* 실행된 케이스는 좌측에 상태 표시 바 */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${props => {
      if (props.isSelected) return '#3b82f6';
      const isExecuted = props.status && props.status !== 'Not Run' && props.status !== 'Inactive';
      if (!isExecuted) return 'transparent';
      
      switch (props.status) {
        case 'Pass': return '#10b981';
        case 'Fail': return '#ef4444';
        case 'Block': return '#f59e0b';
        case 'Skip': return '#8b5cf6';
        default: return 'transparent';
      }
    }};
  }
  
  /* 실행되지 않은 케이스에 점선 테두리 */
  border: ${props => {
    const isExecuted = props.status && props.status !== 'Not Run' && props.status !== 'Inactive';
    return isExecuted ? 'none' : '1px dashed #d1d5db';
  }};
  
  &:hover {
    opacity: 1;
    background: ${props => {
      if (props.isSelected) return '#dbeafe';
      const isExecuted = props.status && props.status !== 'Not Run' && props.status !== 'Inactive';
      if (!isExecuted) return '#f3f4f6';
      
      switch (props.status) {
        case 'Pass': return '#ecfdf5';
        case 'Fail': return '#fef2f2';
        case 'Block': return '#fefce8';
        case 'Skip': return '#f5f3ff';
        default: return '#f8fafc';
      }
    }};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 1440px) {
    grid-template-columns: 40px 70px 70px 1fr 100px 100px 90px 100px 90px;
    gap: 12px;
    padding: 10px 20px;
  }
  
  @media (max-width: 1280px) {
    grid-template-columns: 35px 60px 60px 1fr 90px 90px 80px 90px 80px;
    gap: 10px;
    padding: 8px 16px;
  }
  
  @media (max-width: 1024px) {
    grid-template-columns: 30px 50px 50px 1fr 80px 80px 70px;
    gap: 8px;
    padding: 8px 12px;
  }
  
  @media (max-width: 768px) {
    display: block; // 카드 형태로 변경
    padding: 16px;
    margin-bottom: 8px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #1e293b;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 2px solid transparent;
  min-width: 80px;
  justify-content: center;
  
  background: ${props => {
    switch (props.status) {
      case 'Not Run': return '#f8fafc';
      case 'Pass': return '#dcfce7';
      case 'Fail': return '#fee2e2';
      case 'Block': return '#fef3c7';
      case 'Skip': return '#f3e8ff';
      default: return '#f8fafc';
    }
  }};
  
  border-color: ${props => {
    switch (props.status) {
      case 'Not Run': return '#e2e8f0';
      case 'Pass': return '#10b981';
      case 'Fail': return '#ef4444';
      case 'Block': return '#f59e0b';
      case 'Skip': return '#8b5cf6';
      default: return '#e2e8f0';
    }
  }};
  
  color: ${props => {
    switch (props.status) {
      case 'Not Run': return '#64748b';
      case 'Pass': return '#065f46';
      case 'Fail': return '#dc2626';
      case 'Block': return '#92400e';
      case 'Skip': return '#6b21a8';
      default: return '#64748b';
    }
  }};
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => {
      switch (props.status) {
        case 'Not Run': return '#94a3b8';
        case 'Pass': return '#10b981';
        case 'Fail': return '#ef4444';
        case 'Block': return '#f59e0b';
        case 'Skip': return '#8b5cf6';
        default: return '#94a3b8';
      }
    }};
  }
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

// 드롭다운 컨테이너
const StatusDropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  z-index: 999999; /* 최상단 z-index */
`;

// 드롭다운 버튼
const StatusDropdownButton = styled.button<{ isOpen: boolean; status?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 110px;
  justify-content: space-between;
  
  /* 상태별 스타일 */
  background: ${props => {
    switch (props.status) {
      case 'Pass': return '#f0fdf4';
      case 'Fail': return '#fef2f2';
      case 'Block': return '#fffbeb';
      case 'Skip': return '#faf5ff';
      case 'Not Run':
      case 'Inactive':
      default: return 'white';
    }
  }};
  
  border-color: ${props => {
    if (props.isOpen) return '#3b82f6';
    switch (props.status) {
      case 'Pass': return '#10b981';
      case 'Fail': return '#ef4444';
      case 'Block': return '#f59e0b';
      case 'Skip': return '#8b5cf6';
      case 'Not Run':
      case 'Inactive':
      default: return '#d1d5db';
    }
  }};
  
  color: ${props => {
    switch (props.status) {
      case 'Pass': return '#065f46';
      case 'Fail': return '#dc2626';
      case 'Block': return '#92400e';
      case 'Skip': return '#6b21a8';
      case 'Not Run':
      case 'Inactive':
      default: return '#374151';
    }
  }};
  
  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  ${props => props.isOpen && `
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  `}
`;

// 상태 표시 점
const StatusDot = styled.span<{ status?: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
    switch (props.status) {
      case 'Pass': return '#10b981';
      case 'Fail': return '#ef4444';
      case 'Block': return '#f59e0b';
      case 'Skip': return '#8b5cf6';
      case 'Not Run':
      case 'Inactive':
      default: return '#94a3b8';
    }
  }};
`;

// 상태 텍스트
const StatusText = styled.span`
  flex: 1;
  text-align: left;
`;

// 드롭다운 화살표
const DropdownArrow = styled.span<{ isOpen: boolean }>`
  font-size: 12px;
  transition: transform 0.2s;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

// 상태 표시 정보 함수
const getStatusDisplay = (status?: string) => {
  switch (status) {
    case 'Pass': return { text: 'Pass', color: '#10b981' };
    case 'Fail': return { text: 'Fail', color: '#ef4444' };
    case 'Block': return { text: 'Block', color: '#f59e0b' };
    case 'Skip': return { text: 'Skip', color: '#8b5cf6' };
    case 'Not Run': return { text: 'Not Run', color: '#94a3b8' };
    case 'Inactive': return { text: 'Inactive', color: '#6b7280' };
    case 'Untested': return { text: 'Untested', color: '#9ca3af' };
    case '': 
    case null:
    case undefined:
    default: return { text: 'Not Run', color: '#94a3b8' };
  }
};

// Portal용 드롭다운 메뉴 - 절대 위치로 렌더링
const PortalDropdownMenu = styled.div<{ rect: DOMRect; isOpen: boolean }>`
  position: fixed;
  top: ${props => props.rect.bottom + 4}px;
  left: ${props => props.rect.left}px;
  width: ${props => props.rect.width}px;
  z-index: 99999999; /* 최상단 z-index */
  min-width: 140px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1), 
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  
  display: ${props => props.isOpen ? 'block' : 'none'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  transform: ${props => props.isOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)'};
  transition: all 0.15s ease-out;
  transform-origin: top center;
`;

// 기존 드롭다운 메뉴 (Portal 사용하지 않을 때)
const StatusDropdownMenu = styled.div<{ isOpen: boolean; position: 'top' | 'bottom' }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 9999999; /* 최상단 z-index */
  min-width: 140px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1), 
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  
  display: ${props => props.isOpen ? 'block' : 'none'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  transform: ${props => props.isOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)'};
  transition: all 0.15s ease-out;
  transform-origin: top center;
`;

// 드롭다운 아이템
const StatusDropdownItem = styled.button<{ status: string; isSelected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: ${props => props.isSelected ? 
    (() => {
      switch (props.status) {
        case 'Pass': return '#f0fdf4';
        case 'Fail': return '#fef2f2';
        case 'Block': return '#fffbeb';
        case 'Skip': return '#faf5ff';
        default: return '#f8fafc';
      }
    })() : 'white'
  };
  color: #374151;
  font-size: 14px;
  font-weight: ${props => props.isSelected ? '600' : '500'};
  cursor: pointer;
  transition: background 0.2s;
  text-align: left;
  position: relative;
  z-index: 9999999; /* 최상단 z-index */
  
  /* 선택된 항목 표시 */
  ${props => props.isSelected && `
    &::after {
      content: '✓';
      position: absolute;
      right: 12px;
      color: ${(() => {
        switch (props.status) {
          case 'Pass': return '#10b981';
          case 'Fail': return '#ef4444';
          case 'Block': return '#f59e0b';
          case 'Skip': return '#8b5cf6';
          default: return '#94a3b8';
        }
      })()};
      font-weight: bold;
      font-size: 16px;
    }
  `}
  
  &:hover {
    background: ${props => {
      switch (props.status) {
        case 'Pass': return '#f0fdf4';
        case 'Fail': return '#fef2f2';
        case 'Block': return '#fffbeb';
        case 'Skip': return '#faf5ff';
        default: return '#f8fafc';
      }
    }};
  }
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => {
      switch (props.status) {
        case 'Pass': return '#10b981';
        case 'Fail': return '#ef4444';
        case 'Block': return '#f59e0b';
        case 'Skip': return '#8b5cf6';
        default: return '#94a3b8';
      }
    }};
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
  
  @media (max-width: 1440px) {
    width: ${props => props.isOpen ? `${Math.min(props.width, 320)}px` : '0'};
  }
  
  @media (max-width: 1280px) {
    width: ${props => props.isOpen ? `${Math.min(props.width, 280)}px` : '0'};
  }
  
  @media (max-width: 1024px) {
    width: ${props => props.isOpen ? `${Math.min(props.width, 250)}px` : '0'};
  }
  
  @media (max-width: 768px) {
    width: ${props => props.isOpen ? '100%' : '0'};
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1000;
    box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
  }
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

const ExecutionView: React.FC<ExecutionViewProps> = ({ release, testCases = [], onTestCaseUpdate, onBulkUpdate, onAddTestCases, onTestCasesLoad }) => {
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
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [dropdownPositions, setDropdownPositions] = useState<Record<string, 'top' | 'bottom'>>({});
  const [dropdownRects, setDropdownRects] = useState<Record<string, DOMRect>>({});
  const [currentComment, setCurrentComment] = useState('');
  const [localTestCases, setLocalTestCases] = useState<any[]>([]);
  
  // 폴더 가져오기 관련 상태
  const [showTestCaseModal, setShowTestCaseModal] = useState(false);
  const [selectedTestCasesToAdd, setSelectedTestCasesToAdd] = useState<string[]>([]);
  const [isLoadingTestCases, setIsLoadingTestCases] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedImportedFolder, setSelectedImportedFolder] = useState<any>(null);
  const [folderTestCases, setFolderTestCases] = useState<any[]>([]);
  const [importedFolders, setImportedFolders] = useState<any[]>([]);
  const [detailPanelWidth, setDetailPanelWidth] = useState(350); // 400 → 350으로 축소
  const [isResizing, setIsResizing] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(240); // 280 → 240으로 축소
  const [isLeftPanelResizing, setIsLeftPanelResizing] = useState(false);

  // API 호출 - 자동으로 테스트케이스 조회
  const { data: apiTestCases = [], isLoading, error, refetch } = useGetReleaseTestCasesQuery(release.id, {
    pollingInterval: 5000, // 5초마다 자동 갱신
  });
  
  // API 응답 디버깅
  console.log('=== API 응답 디버깅 ===');
  console.log('Release ID:', release.id);
  console.log('API 데이터:', apiTestCases);
  console.log('API 로딩 상태:', isLoading);
  console.log('API 에러:', error);
  console.log('API 데이터 타입:', typeof apiTestCases);
  console.log('API 데이터 배열 여부:', Array.isArray(apiTestCases));
  console.log('API 데이터.data 존재 여부:', !!apiTestCases?.data);
  console.log('API 데이터.data 배열 여부:', Array.isArray(apiTestCases?.data));
  if (apiTestCases?.data && Array.isArray(apiTestCases.data)) {
    console.log('API 데이터.data 길이:', apiTestCases.data.length);
    console.log('첫 번째 아이템:', apiTestCases.data[0]);
  }
  const [updateExecutionStats] = useUpdateReleaseExecutionStatsMutation();
  
  // 실행 통계 데이터 가져오기 - 실시간 업데이트
  const { data: executionStats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useGetReleaseExecutionStatsQuery(
    release.id,
    {
      pollingInterval: 5000, // 5초마다 자동 갱신
    }
  );
  
  // 폴더 데이터 가져오기
  const { data: folders = [] } = useGetTestFoldersQuery();
  
  // 가져온 폴더 데이터 가져오기 (DB에서)
  const { data: dbImportedFolders = [], refetch: refetchImportedFolders } = useGetImportedFoldersQuery(release.id);
  const [addImportedFolders] = useAddImportedFoldersMutation();
  const [removeImportedFolder] = useRemoveImportedFolderMutation();
  
    useEffect(() => {
     if (Array.isArray(dbImportedFolders)) {
       setImportedFolders(dbImportedFolders.map(folder => ({
         id: folder.folderId,
         name: folder.name,
         parentId: folder.parentId,
         testCaseCount: folder.testCaseCount,
         children: []
       })));
     } else {
       setImportedFolders([]);
     }
  }, [dbImportedFolders]);
  
  useEffect(() => {
    const totalTestCasesFromFolders = importedFolders.reduce((total, folder) => {
      return total + (folder.testCaseCount || 0);
    }, 0);
    
    const currentPlannedCount = executionStats?.data?.planned || 0;
    
    // 가져온 폴더가 있는 경우에만 업데이트
    if (totalTestCasesFromFolders !== currentPlannedCount) {
      console.log(`plannedCount 업데이트: ${currentPlannedCount} -> ${totalTestCasesFromFolders}`);
      updateExecutionStats({
        releaseId: release.id,
        plannedCount: totalTestCasesFromFolders
      }).then(() => {
        console.log('plannedCount 업데이트 완료');
        refetchStats();
      }).catch(error => {
        console.error('plannedCount 업데이트 실패:', error);
      });
    }
  }, [importedFolders, executionStats, release.id, updateExecutionStats, refetchStats]);

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

  // 진행률 계산 - 실제 API 데이터 사용
  const totalTestCases = executionStats?.data?.planned || 0;
  const executedTestCases = executionStats?.data?.executed || 0;
  const passedTestCases = executionStats?.data?.passed || 0;
  const failedTestCases = executionStats?.data?.failed || 0;
  const blockedTestCases = executionStats?.data?.blocked || 0;
  const skippedTestCases = executionStats?.data?.skipped || 0;
  const notRunTestCases = totalTestCases - executedTestCases;

  const progressPercentage = executionStats?.data?.passRate || 0;

  // API에서 가져온 테스트케이스 사용 - API 응답 구조에 맞게 처리
  const apiTestCasesArray = apiTestCases?.data && Array.isArray(apiTestCases.data) ? apiTestCases.data : [];
  
  // 로컬 스토리지 키
  const LOCAL_STORAGE_KEY = `testCases_release_${release.id}`;
  
  // 로컬 스토리지에서 저장된 테스트케이스 불러오기
  const getStoredTestCases = () => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('로컬 스토리지에서 테스트케이스 불러오기 실패:', error);
      return null;
    }
  };
  
  // 로컬 스토리지에 테스트케이스 저장하기
  const saveTestCasesToStorage = (testCases: any[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(testCases));
      console.log('테스트케이스를 로컬 스토리지에 저장했습니다:', testCases.length, '개');
    } catch (error) {
      console.error('로컬 스토리지에 테스트케이스 저장 실패:', error);
    }
  };

  // 로컬 스토리지에서 저장된 테스트케이스만 사용 (더미 데이터 제거)
  const storedTestCases = getStoredTestCases();
  
  // 더미 데이터가 저장되어 있으면 삭제 (한 번만 실행)
  useEffect(() => {
    if (storedTestCases && storedTestCases.length > 0) {
      const isDummyData = storedTestCases.some((testCase: any) => 
        testCase.id === '81' || testCase.id === '82' || 
        testCase.name === 'Test Case 1' || testCase.name === 'Test Case 2'
      );
      if (isDummyData) {
        console.log('더미 데이터 감지, 로컬 스토리지 정리 중...');
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  }, [LOCAL_STORAGE_KEY, storedTestCases]);
  
  // 더미 데이터 완전 제거 - API 데이터 또는 저장된 데이터만 사용
  const dummyTestCases = [];
  
  // 데이터 우선순위: 1) 부모 props, 2) 저장된 데이터, 3) API 데이터
  const allTestCases = testCases.length > 0 ? testCases : (storedTestCases && storedTestCases.length > 0 ? storedTestCases : apiTestCasesArray);
  
  console.log('=== 데이터 소스 확인 ===');
  console.log('Props testCases:', testCases.length);
  console.log('Stored testCases:', storedTestCases ? storedTestCases.length : 0);
  console.log('API testCases:', apiTestCasesArray.length);
  console.log('Final allTestCases:', allTestCases.length);
  
  // API 데이터가 변경될 때 로컬 상태 업데이트 (부모 데이터가 없을 때만)
  useEffect(() => {
    if (testCases.length === 0) {
      if (storedTestCases && storedTestCases.length > 0) {
        console.log('저장된 데이터 사용, 부모에게 전달:', storedTestCases.length, '개 테스트케이스');
        setLocalTestCases(storedTestCases);
        // 부모 컴포넌트에 저장된 데이터 전달
        if (onTestCasesLoad) {
          onTestCasesLoad(storedTestCases);
        }
      } else if (apiTestCasesArray.length > 0) {
        console.log('API 데이터 업데이트, 부모에게 전달:', apiTestCasesArray.length, '개 테스트케이스');
        setLocalTestCases(apiTestCasesArray);
        // 부모 컴포넌트에 API 데이터 전달
        if (onTestCasesLoad) {
          onTestCasesLoad(apiTestCasesArray);
        }
      }
    } else if (testCases.length > 0) {
      console.log('부모 props 데이터 사용:', testCases.length, '개 테스트케이스');
      setLocalTestCases(testCases);
    }
  }, [testCases, apiTestCasesArray, storedTestCases, onTestCasesLoad]);
  
  // 실제 렌더링에 사용할 테스트 케이스 (부모 props 우선)
  const displayTestCases = testCases.length > 0 ? testCases : (localTestCases.length > 0 ? localTestCases : allTestCases);
  
  // 디버깅: 렌더링할 테스트 케이스 상태 확인
  console.log('렌더링 테스트케이스:', {
    propsTestCasesCount: testCases.length,
    localTestCasesCount: localTestCases.length,
    apiTestCasesCount: apiTestCasesArray.length,
    displayTestCasesCount: displayTestCases.length,
    firstTestCaseStatus: displayTestCases[0]?.status
  });
  
  // 필터링된 테스트 케이스 - 로컬 상태 우선 사용
  const filteredTestCases = displayTestCases.filter((testCase: any) => {
    if (filters.status && testCase.status !== filters.status) return false;
    if (filters.priority && testCase.priority !== filters.priority) return false;
    if (filters.suite && testCase.suite !== filters.suite) return false;
    if (filters.assignee && testCase.assignee !== filters.assignee) return false;
    if (filters.search && !(testCase.name || testCase.title)?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

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
    if (isSelected) {
      setSelectedTestCases(filteredTestCases.map(tc => tc.id));
    } else {
      setSelectedTestCases([]);
    }
  }, [filteredTestCases]);

  // API 훅 추가
  const [updateTestCaseStatus] = useUpdateTestCaseStatusMutation();

  // 드롭다운 위치 계산 함수 - 임시로 항상 아래쪽으로 열리도록 설정
  const calculateDropdownPosition = useCallback((testCaseId: string, buttonElement: HTMLElement): 'top' | 'bottom' => {
    // 임시로 항상 아래쪽으로 열리도록 설정 (클릭 문제 해결을 위해)
    console.log('드롭다운 위치: 항상 아래쪽으로 열림 (임시 설정)');
    return 'bottom';
  }, []);

  // 드롭다운 토글 처리
  const toggleDropdown = useCallback((testCaseId: string, buttonElement?: HTMLElement) => {
    const isCurrentlyOpen = openDropdowns[testCaseId];
    
    if (!isCurrentlyOpen && buttonElement) {
      // 드롭다운을 열 때 위치 계산 및 저장
      const rect = buttonElement.getBoundingClientRect();
      const position = calculateDropdownPosition(testCaseId, buttonElement);
      
      setDropdownRects(prev => ({
        ...prev,
        [testCaseId]: rect
      }));
      
      setDropdownPositions(prev => ({
        ...prev,
        [testCaseId]: position
      }));
    }
    
    setOpenDropdowns(prev => ({
      ...prev,
      [testCaseId]: !prev[testCaseId]
    }));
  }, [openDropdowns, calculateDropdownPosition]);

  // 드롭다운 닫기
  const closeDropdown = useCallback((testCaseId: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [testCaseId]: false
    }));
  }, []);

  // 상태 변경 처리
  const handleStatusChange = useCallback(async (testCaseId: string, newStatus: TestCase['status'], comment?: string) => {
    try {
      console.log('=== 상태 변경 시작 ===');
      console.log('테스트케이스 ID:', testCaseId);
      console.log('새로운 상태:', newStatus);
      console.log('댓글:', comment);
      
      // 드롭다운 먼저 닫기 (즉시 UI 반응)
      closeDropdown(testCaseId);
      
      // 부모 컴포넌트 상태 업데이트 (즉시 UI 반영)
      onTestCaseUpdate(testCaseId, { 
        status: newStatus,
        lastUpdated: new Date().toISOString()
      });
      
      // 로컬 스토리지에도 즉시 반영
      const currentTestCases = testCases.length > 0 ? testCases : (storedTestCases && storedTestCases.length > 0 ? storedTestCases : apiTestCasesArray);
      const updatedTestCases = currentTestCases.map((testCase: any) => 
        testCase.id === testCaseId 
          ? { ...testCase, status: newStatus, lastUpdated: new Date().toISOString() }
          : testCase
      );
      saveTestCasesToStorage(updatedTestCases);
      
      // 선택된 테스트케이스가 변경된 경우 상태 업데이트
      if (selectedTestCase?.id === testCaseId) {
        setSelectedTestCase({
          ...selectedTestCase,
          status: newStatus,
          lastUpdated: new Date().toISOString()
        });
      }
      
      // API 호출로 상태 변경 (백그라운드)
      try {
        const result = await updateTestCaseStatus({
          releaseId: release.id,
          testCaseId,
          status: newStatus,
          comment: comment || currentComment
        }).unwrap();
        
        console.log('API 호출 성공:', result);
        
        // 데이터 새로고침 (백그라운드)
      await refetch();
      await refetchStats();
      } catch (apiError) {
        console.error('API 호출 실패, 상태 되돌리기:', apiError);
        // API 실패 시 부모 컴포넌트 상태 되돌리기
        const originalTestCase = allTestCases.find((tc: any) => tc.id === testCaseId);
        if (originalTestCase) {
          onTestCaseUpdate(testCaseId, { 
            status: originalTestCase.status,
            lastUpdated: new Date().toISOString()
          });
        }
        alert(`상태 변경에 실패했습니다: ${apiError}`);
        return;
      }
      
      // 댓글 초기화
      setCurrentComment('');

      console.log('=== 상태 변경 완료 ===');
    } catch (error) {
      console.error('=== 테스트케이스 상태 변경 실패 ===');
      console.error('Error details:', error);
      // 에러 처리 (필요시 토스트 메시지 표시)
      alert(`상태 변경에 실패했습니다: ${error}`);
    }
  }, [updateTestCaseStatus, release.id, onTestCaseUpdate, selectedTestCase, currentComment, refetch, refetchStats, closeDropdown, allTestCases]);

  // Portal 드롭다운 렌더링 함수
  const renderPortalDropdowns = () => {
    return Object.entries(openDropdowns)
      .filter(([_, isOpen]) => isOpen)
      .map(([testCaseId, isOpen]) => {
        const rect = dropdownRects[testCaseId];
        if (!rect) return null;

        return createPortal(
          <PortalDropdownMenu
            key={testCaseId}
            rect={rect}
            isOpen={isOpen}
          >
            <StatusDropdownItem
              status="Pass"
              isSelected={displayTestCases.find(tc => tc.id === testCaseId)?.status === 'Pass'}
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(testCaseId, 'Pass');
              }}
            >
              Pass
            </StatusDropdownItem>
            <StatusDropdownItem
              status="Fail"
              isSelected={displayTestCases.find(tc => tc.id === testCaseId)?.status === 'Fail'}
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(testCaseId, 'Fail');
              }}
            >
              Fail
            </StatusDropdownItem>
            <StatusDropdownItem
              status="Block"
              isSelected={displayTestCases.find(tc => tc.id === testCaseId)?.status === 'Block'}
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(testCaseId, 'Block');
              }}
            >
              Block
            </StatusDropdownItem>
            <StatusDropdownItem
              status="Skip"
              isSelected={displayTestCases.find(tc => tc.id === testCaseId)?.status === 'Skip'}
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(testCaseId, 'Skip');
              }}
            >
              Skip
            </StatusDropdownItem>
          </PortalDropdownMenu>,
          document.body
        );
      });
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-dropdown]')) {
        setOpenDropdowns({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleFetchTestCases = useCallback(() => {
    setShowTestCaseModal(true);
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
      const existingIds = new Set(importedFolders.map((f: any) => f.id));
      const newFolders = foldersWithRealCounts.filter((f: any) => !existingIds.has(f.id));
      
      // DB에 폴더 추가
      if (newFolders.length > 0) {
        const foldersToAdd = newFolders.map(folder => ({
          folder_id: folder.id,
          folder_name: folder.name,
          parent_id: folder.parentId || null,
          test_case_count: folder.testCaseCount || 0
        }));
        
        await addImportedFolders({
          releaseId: release.id,
          folders: foldersToAdd
        });
        
        // 로컬 상태 업데이트
        setImportedFolders(prev => [...prev, ...newFolders]);
      }
      

      
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
            
            // 성공 후 모달 닫기 및 선택 초기화
            setShowTestCaseModal(false);
            setSelectedTestCasesToAdd([]);
            
            // 데이터 새로고침
            await refetch();
            await refetchImportedFolders();
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
  const handleRemoveImportedFolder = useCallback(async (folderId: number) => {
    try {
      // 해당 폴더의 테스트케이스들을 릴리즈에서 제거
      const folder = importedFolders.find((f: any) => f.id === folderId);
      if (folder) {
        try {
          // 폴더의 테스트케이스들을 가져와서 릴리즈에서 제거
          const response = await fetch(`http://localhost:3001/api/releases/folders/${folderId}/testcases`);
          if (response.ok) {
            const data = await response.json();
            if (data.data && Array.isArray(data.data)) {
              const testCaseIds = data.data.map((tc: any) => tc.id);
              
              // 릴리즈에서 테스트케이스 제거
              if (testCaseIds.length > 0) {
                await fetch(`http://localhost:3001/api/releases/${release.id}/testcases`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    testCaseIds: testCaseIds
                  })
                });
              }
            }
          }
        } catch (error) {
          console.error('폴더 테스트케이스 제거 실패:', error);
        }
      }
      
      // DB에서 폴더 제거
      await removeImportedFolder({
        releaseId: release.id,
        folderId: folderId
      });
      
      // 로컬 상태 업데이트
      setImportedFolders(prev => {
        const updatedFolders = prev.filter((f: any) => f.id !== folderId);
        
        // plannedCount 즉시 업데이트
        const totalTestCasesFromFolders = updatedFolders.reduce((total, folder) => {
          return total + (folder.testCaseCount || 0);
        }, 0);
        
        // 실행 통계 업데이트 (비동기)
        updateExecutionStats({
          releaseId: release.id,
          plannedCount: totalTestCasesFromFolders
        }).then(() => {
          // 통계 업데이트 후 즉시 새로고침
          refetchStats();
        }).catch(error => {
          console.error('실행 통계 업데이트 실패:', error);
        });
        
        return updatedFolders;
      });
      
      // 삭제된 폴더가 현재 선택된 폴더였다면 선택 해제
      if (selectedImportedFolder?.id === folderId) {
        setSelectedImportedFolder(null);
        setFolderTestCases([]);
      }
    } catch (error) {
      console.error('폴더 제거 실패:', error);
    }
  }, [selectedImportedFolder, removeImportedFolder, release.id, importedFolders, updateExecutionStats, refetchStats]);

  // 가져온 폴더 클릭 처리
  const handleImportedFolderClick = useCallback(async (folder: any) => {
    setSelectedImportedFolder(folder);
    
    try {
      // 해당 폴더의 테스트 케이스 가져오기
      const response = await fetch(`http://localhost:3001/api/releases/folders/${folder.id}/testcases`);
      if (response.ok) {
        const data = await response.json();
        const testCases = data.data || [];
        setFolderTestCases(testCases);
        
        setImportedFolders(prev => prev.map(f => 
          f.id === folder.id ? { ...f, testCaseCount: testCases.length } : f
        ));
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
      if (folder.parentId === null) {
        // 루트 폴더
        rootFolders.push(folderNode);
      } else {
        // 하위 폴더
        const parentNode = folderMap.get(folder.parentId);
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
          $isSelected={selectedTestCasesToAdd.includes(folder.id)}
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
          $isSelected={selectedImportedFolder?.id === folder.id}
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
      {/* 상단 컨텍스트 바 - 새로운 디자인 */}
      <TopContextBar isCollapsed={isCollapsed}>
        <ReleaseMeta isCollapsed={isCollapsed}>
          <ReleaseLeft>
            <ReleaseInfo isCollapsed={isCollapsed}>
              <ReleaseNameContainer>
                <ReleaseName isCollapsed={isCollapsed}>{release.name}</ReleaseName>
                <LiveIndicator $isLive={isLive}>
                  <LiveDot $isLive={isLive} />
                  {isLive ? 'LIVE' : 'OFFLINE'}
                </LiveIndicator>
              </ReleaseNameContainer>
              <ReleaseDetails isCollapsed={isCollapsed}>
                <ReleaseDetailItem>v{release.version}</ReleaseDetailItem>
                {release.sprint && <ReleaseDetailItem>Sprint {release.sprint}</ReleaseDetailItem>}
                {release.period && <ReleaseDetailItem>{release.period}</ReleaseDetailItem>}
                <ReleaseDetailItem>{release.owner}</ReleaseDetailItem>
                <ReleaseDetailItem>{new Date(release.createdAt).toLocaleDateString('ko-KR')}</ReleaseDetailItem>
              </ReleaseDetails>
            </ReleaseInfo>
          </ReleaseLeft>
          
          <ReleaseRight>
            <ActionButton 
              onClick={handleFetchTestCases}
              disabled={isLoadingTestCases}
            >
              {isLoadingTestCases ? '가져오는 중...' : '테스트케이스 가져오기'}
            </ActionButton>
            <CollapseButton isCollapsed={isCollapsed} onClick={handleToggleCollapse}>
              {isCollapsed ? '펼치기' : '접기'}
            </CollapseButton>
          </ReleaseRight>
        </ReleaseMeta>

        <ProgressSummary isCollapsed={isCollapsed}>
          <ProgressItem>
            <ProgressNumber color="#3b82f6">{totalTestCases}</ProgressNumber>
            <ProgressLabel color="#3b82f6">PLANNED</ProgressLabel>
          </ProgressItem>
          <ProgressItem>
            <ProgressNumber color="#8b5cf6">{executedTestCases}</ProgressNumber>
            <ProgressLabel color="#8b5cf6">EXECUTED</ProgressLabel>
          </ProgressItem>
          <ProgressItem>
            <ProgressNumber color="#10b981">{passedTestCases}</ProgressNumber>
            <ProgressLabel color="#10b981">PASS</ProgressLabel>
          </ProgressItem>
          <ProgressItem>
            <ProgressNumber color="#ef4444">{failedTestCases}</ProgressNumber>
            <ProgressLabel color="#ef4444">FAIL</ProgressLabel>
          </ProgressItem>
          <ProgressItem>
            <ProgressNumber color="#f59e0b">{blockedTestCases}</ProgressNumber>
            <ProgressLabel color="#f59e0b">BLOCK</ProgressLabel>
          </ProgressItem>
          <ProgressItem>
            <ProgressNumber color="#6b7280">{skippedTestCases}</ProgressNumber>
            <ProgressLabel color="#6b7280">SKIP</ProgressLabel>
          </ProgressItem>
          
          <ProgressBar>
            <ProgressFill percentage={progressPercentage} />
          </ProgressBar>
          
          <ProgressItem>
            <ProgressNumber color="#059669">{progressPercentage.toFixed(1)}%</ProgressNumber>
            <ProgressLabel color="#059669">PROGRESS</ProgressLabel>
          </ProgressItem>
        </ProgressSummary>

        <FilterSummary isCollapsed={isCollapsed}>
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

      {/* 메인 콘텐츠 영역 - 하단 패널은 항상 표시 */}
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
              <div style={{ 
                padding: '20px', 
                textAlign: 'center', 
                color: '#6b7280',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                minHeight: '400px',
                flex: '1'
              }}>
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
                status={testCase.status}
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
                    <div style={{ fontWeight: 500 }}>{testCase.name || testCase.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      {(testCase.description || '').substring(0, 60)}...
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
                  <StatusDropdownContainer data-dropdown>
                    <StatusDropdownButton
                      isOpen={openDropdowns[testCase.id] || false}
                      status={testCase.status}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(testCase.id, e.currentTarget);
                      }}
                    >
                      <StatusDot status={testCase.status} />
                      <StatusText>
                        {(() => {
                          const display = getStatusDisplay(testCase.status);
                          console.log(`테스트케이스 ${testCase.id} 상태 표시:`, { 
                            status: testCase.status, 
                            displayText: display.text 
                          });
                          return display.text;
                        })()}
                      </StatusText>
                      <DropdownArrow isOpen={openDropdowns[testCase.id] || false}>
                        ▼
                      </DropdownArrow>
                    </StatusDropdownButton>
                    {/* Portal 드롭다운은 별도로 렌더링됨 */}
                  </StatusDropdownContainer>
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
                      {(['Pass', 'Fail', 'Blocked', 'Skip'] as const).map((status) => (
                        <StatusRadio key={status}>
                          <input
                            type="radio"
                            name="status"
                            value={status}
                            checked={selectedTestCase.status === status}
                            onChange={(e) => {
                              console.log('라디오 버튼 클릭:', status);
                              if (e.target.checked) {
                                handleStatusChange(selectedTestCase.id, status);
                              }
                            }}
                          />
                          <StatusBadge status={status}>{status}</StatusBadge>
                        </StatusRadio>
                      ))}
                    </StatusRadioGroup>
                    
                    <FilterLabel>Comment (Optional)</FilterLabel>
                    <CommentTextarea 
                      placeholder="Add a comment about this test execution..."
                      value={currentComment}
                      onChange={(e) => setCurrentComment(e.target.value)}
                    />
                    
                    <SaveButton 
                      onClick={() => {
                        if (currentComment.trim()) {
                          // 댓글이 있으면 현재 상태로 다시 저장
                          handleStatusChange(selectedTestCase.id, selectedTestCase.status, currentComment);
                        } else {
                          // 댓글이 없으면 그냥 패널 닫기
                          setSelectedTestCase(null);
                        }
                      }}
                    >
                      {currentComment.trim() ? 'Save with Comment' : 'Close'}
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

      {/* 테스트케이스 선택 모달 */}

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

      {/* Portal 드롭다운 렌더링 */}
      {renderPortalDropdowns()}
    </ExecutionContainer>
  );
};

export default ExecutionView;
