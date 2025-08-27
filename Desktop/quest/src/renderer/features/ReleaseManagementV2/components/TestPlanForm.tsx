import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../../shared/theme';

// Global gtag type declaration
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      parameters?: Record<string, any>
    ) => void;
  }
}

interface TestPlanFormProps {
  onSave?: (data: any) => void;
  onPreview?: () => void;
  onExport?: () => void;
}

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Modern Container
const Container = styled.div`
  max-width: 100%;
  margin: 0;
  padding: 0;
  background: ${theme.color.surface.primary};
  min-height: auto;
  font-family: ${theme.typography.fontFamily.primary};
  line-height: 1.6;
`;

// Inner content wrapper
const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  animation: ${fadeInUp} 0.6s ease-out;
  
  @media (max-width: 1440px) {
    padding: 0 32px;
  }
  
  @media (max-width: 1280px) {
    padding: 0 24px;
  }
  
  @media (max-width: 768px) {
    padding: 0 20px;
  }
  
  @media (max-width: 480px) {
    padding: 0 16px;
  }
`;

// Header Section
const Header = styled.div`
  padding: 24px 40px;
  margin: 0 -40px 24px;
  background: ${theme.color.surface.secondary};
  border-bottom: 1px solid ${theme.color.border.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 1440px) {
    padding: 20px 32px;
    margin: 0 -32px 20px;
  }
  
  @media (max-width: 1280px) {
    padding: 16px 24px;
    margin: 0 -24px 16px;
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  @media (max-width: 768px) {
    padding: 16px 20px;
    margin: 0 -20px 16px;
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 1280px) {
    width: 100%;
    margin-bottom: 8px;
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  
  @media (max-width: 1280px) {
    width: 100%;
    justify-content: center;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: ${theme.color.text.primary};
  margin: 0 0 8px 0;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: ${theme.color.text.secondary};
  margin: 0;
  text-align: center;
  font-weight: 400;
`;

const TitleInput = styled.input`
  width: 100%;
  max-width: 600px;
  font-size: 20px;
  font-weight: 500;
  padding: 16px 24px;
  border: 1px solid ${theme.color.border.primary};
  border-radius: 8px;
  background: ${theme.color.surface.primary};
  color: ${theme.color.text.primary};
  text-align: center;
  transition: all 0.2s ease;
  margin: 20px auto 0;
  display: block;
  
  &:focus {
    outline: none;
    border-color: ${theme.color.primary[500]};
    box-shadow: 0 0 0 3px ${theme.color.primary[100]};
  }
  
  &::placeholder {
    color: ${theme.color.text.tertiary};
  }
  
  @media (max-width: 1440px) {
    max-width: 500px;
    font-size: 19px;
    padding: 15px 22px;
  }
  
  @media (max-width: 1280px) {
    max-width: 100%;
    font-size: 18px;
    padding: 14px 20px;
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
    font-size: 18px;
    padding: 14px 20px;
  }
`;

// Content Section
const ContentGrid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;
  padding-bottom: 24px;
`;

const Card = styled.div`
  background: ${theme.color.surface.primary};
  padding: 24px;
  margin: 0;
  border-radius: 12px;
  border: 1px solid ${theme.color.border.primary};
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${theme.color.border.secondary};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  @media (max-width: 1440px) {
    padding: 20px;
  }
  
  @media (max-width: 1280px) {
    padding: 16px;
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${theme.color.text.primary};
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid ${theme.color.border.primary};
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '';
    width: 3px;
    height: 18px;
    background: ${theme.color.primary[500]};
    border-radius: 2px;
    flex-shrink: 0;
  }
`;

const SectionIcon = styled.div`
  display: none;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 16px;
  border: 1px solid ${theme.color.border.primary};
  border-radius: 8px;
  background: ${theme.color.surface.primary};
  color: ${theme.color.text.primary};
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.color.primary[500]};
    box-shadow: 0 0 0 3px ${theme.color.primary[100]};
  }
  
  &:hover:not(:focus) {
    border-color: ${theme.color.border.secondary};
  }
  
  &::placeholder {
    color: ${theme.color.text.tertiary};
    font-style: normal;
  }
`;

// Table Styles
const TableCard = styled(Card)`
  overflow: hidden;
  padding: 0;
`;

const TableWrapper = styled.div`
  padding: 24px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 16px;
  background: ${theme.color.surface.primary};
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${theme.color.border.primary};
  
  @media (max-width: 1280px) {
    font-size: 14px;
  }
  
  @media (max-width: 768px) {
    font-size: 13px;
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
`;
  
const TableHeader = styled.th`
  background: ${theme.color.surface.secondary};
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  color: ${theme.color.text.primary};
  border-bottom: 1px solid ${theme.color.border.primary};
  
  &:first-child {
    border-radius: 8px 0 0 0;
  }
  
  &:last-child {
    border-radius: 0 8px 0 0;
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid ${theme.color.border.tertiary};
  vertical-align: top;
  font-size: 14px;
  
  tr:last-child & {
    border-bottom: none;
  }
`;

const TableInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${theme.color.border.primary};
  border-radius: 6px;
  background: ${theme.color.surface.primary};
  font-size: 13px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.color.primary[500]};
    box-shadow: 0 0 0 3px ${theme.color.primary[100]};
  }
  
  &:hover:not(:focus) {
    border-color: ${theme.color.border.secondary};
  }
  
  @media (max-width: 1280px) {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  @media (max-width: 768px) {
    padding: 6px 8px;
    font-size: 12px;
    min-width: 120px;
  }
`;

const TableTextArea = styled.textarea`
  width: 100%;
  min-height: 60px;
  padding: 8px 12px;
  border: 1px solid ${theme.color.border.primary};
  border-radius: 6px;
  background: ${theme.color.surface.primary};
  font-size: 13px;
  font-family: inherit;
  resize: vertical;
  line-height: 1.4;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.color.primary[500]};
    box-shadow: 0 0 0 3px ${theme.color.primary[100]};
  }
  
  &:hover:not(:focus) {
    border-color: ${theme.color.border.secondary};
  }
  
  @media (max-width: 1280px) {
    min-height: 50px;
    padding: 6px 10px;
    font-size: 12px;
  }
  
  @media (max-width: 768px) {
    min-height: 40px;
    padding: 6px 8px;
    font-size: 12px;
    min-width: 150px;
  }
`;

const AddButton = styled.button`
  margin: 16px 24px 0;
  padding: 10px 16px;
  background: ${theme.color.primary[500]};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &::before {
    content: '+';
    font-size: 16px;
    font-weight: 600;
  }
  
  &:hover {
    background: ${theme.color.primary[600]};
  }
  
  &:active {
    background: ${theme.color.primary[700]};
  }
`;

const RemoveButton = styled.button`
  padding: 6px 12px;
  background: ${theme.color.danger[500]};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${theme.color.danger[600]};
  }
  
  &:active {
    background: ${theme.color.danger[700]};
  }
`;

// Action Buttons
const ActionBar = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 24px 0 0;
  padding: 20px 0;
  border-top: 1px solid ${theme.color.border.primary};
  
  @media (max-width: 1280px) {
    margin: 20px 0 0;
    padding: 16px 0;
    gap: 10px;
  }
  
  @media (max-width: 768px) {
    margin: 16px 0 0;
    padding: 16px 0;
    gap: 8px;
    flex-wrap: wrap;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    padding: 12px 0;
  }
`;

const SaveButton = styled.button`
  padding: 12px 24px;
  background: ${theme.color.success[500]};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
  
  &:hover {
    background: ${theme.color.success[600]};
  }
  
  &:active {
    background: ${theme.color.success[700]};
  }
  
  @media (max-width: 1280px) {
    padding: 10px 20px;
    font-size: 13px;
    min-width: 90px;
  }
  
  @media (max-width: 768px) {
    padding: 10px 18px;
    font-size: 13px;
    min-width: 80px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    max-width: 200px;
  }
`;

const PreviewButton = styled.button`
  padding: 12px 24px;
  background: ${theme.color.surface.primary};
  color: ${theme.color.text.secondary};
  border: 1px solid ${theme.color.border.secondary};
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
  
  &:hover {
    background: ${theme.color.surface.secondary};
    color: ${theme.color.text.primary};
    border-color: ${theme.color.primary[400]};
  }
  
  @media (max-width: 1280px) {
    padding: 10px 20px;
    font-size: 13px;
    min-width: 90px;
  }
  
  @media (max-width: 768px) {
    padding: 10px 18px;
    font-size: 13px;
    min-width: 80px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    max-width: 200px;
  }
`;

const EditButton = styled.button`
  padding: 12px 24px;
  background: ${theme.color.primary[500]};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
  
  &:hover {
    background: ${theme.color.primary[600]};
  }
  
  &:active {
    background: ${theme.color.primary[700]};
  }
  
  @media (max-width: 1280px) {
    padding: 10px 20px;
    font-size: 13px;
    min-width: 90px;
  }
  
  @media (max-width: 768px) {
    padding: 10px 18px;
    font-size: 13px;
    min-width: 80px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    max-width: 200px;
  }
`;

const CancelButton = styled.button`
  padding: 12px 24px;
  background: ${theme.color.secondary[400]};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
  
  &:hover {
    background: ${theme.color.secondary[500]};
  }
  
  &:active {
    background: ${theme.color.secondary[600]};
  }
  
  @media (max-width: 1280px) {
    padding: 10px 20px;
    font-size: 13px;
    min-width: 90px;
  }
  
  @media (max-width: 768px) {
    padding: 10px 18px;
    font-size: 13px;
    min-width: 80px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    max-width: 200px;
  }
`;

// Kebab Menu Button (3 dots)
const KebabButton = styled.button`
  padding: 8px;
  background: transparent;
  color: ${theme.color.text.secondary};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  position: relative;
  
  &:hover:not(:disabled) {
    background: ${theme.color.surface.tertiary};
    color: ${theme.color.text.primary};
  }
  
  &:active:not(:disabled) {
    background: ${theme.color.surface.quaternary};
  }
  
  &:disabled {
    color: ${theme.color.text.disabled};
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${theme.color.primary[100]};
  }
  
  &::before {
    content: '';
    width: 4px;
    height: 4px;
    background: currentColor;
    border-radius: 50%;
    box-shadow: 
      0 -8px 0 currentColor,
      0 8px 0 currentColor;
  }
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
  }
`;

// Dropdown Menu
const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${theme.color.surface.primary};
  border: 1px solid ${theme.color.border.primary};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 120px;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-8px)'};
  transition: all 0.2s ease;
  margin-top: 4px;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  text-align: left;
  font-size: 14px;
  color: ${theme.color.text.primary};
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
  
  &:only-child {
    border-radius: 8px;
  }
  
  &:hover {
    background: ${theme.color.surface.secondary};
  }
  
  &:focus {
    outline: none;
    background: ${theme.color.surface.secondary};
  }
`;

const KebabMenuContainer = styled.div`
  position: relative;
`;

// 읽기 모드용 컴포넌트들
const ReadOnlyText = styled.div`
  padding: 16px;
  background: ${theme.color.surface.secondary};
  border-radius: 8px;
  color: ${theme.color.text.primary};
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  min-height: 120px;
  border: 1px solid ${theme.color.border.tertiary};
`;

const ReadOnlyTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  padding: 16px 24px;
  background: ${theme.color.surface.primary};
  border: 1px solid ${theme.color.border.primary};
  border-radius: 8px;
  color: ${theme.color.text.primary};
  text-align: center;
  margin: 20px auto 0;
  max-width: 600px;
  
  @media (max-width: 1440px) {
    max-width: 500px;
    font-size: 19px;
    padding: 15px 22px;
  }
  
  @media (max-width: 1280px) {
    max-width: 100%;
    font-size: 18px;
    padding: 14px 20px;
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
    font-size: 18px;
    padding: 14px 20px;
  }
`;

const ReadOnlyTable = styled.div`
  margin-top: 16px;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
`;

const ReadOnlyTableHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
`;

const ReadOnlyTableHeaderCell = styled.div`
  padding: 16px 20px;
  font-weight: 600;
  font-size: 14px;
  color: #1a1a1a;
  border-right: 1px solid #e9ecef;
  
  &:last-child {
    border-right: none;
  }
`;

const ReadOnlyTableRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ReadOnlyTableCell = styled.div`
  padding: 16px 20px;
  border-right: 1px solid #f0f0f0;
  font-size: 14px;
  color: #1a1a1a;
  white-space: pre-wrap;
  
  &:last-child {
    border-right: none;
  }
`;

const TestPlanForm: React.FC<TestPlanFormProps> = ({ onSave, onPreview, onExport }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isKebabMenuOpen, setIsKebabMenuOpen] = useState(false);
  
  // 컴포넌트 마운트 시 localStorage 클리어
  useEffect(() => {
    localStorage.removeItem('testPlanData');
  }, []);
  
  const [formData, setFormData] = useState(() => {
    return {
      title: '',
      projectOverview: '이 프로젝트의 개요와 목적을 간단히 설명해주세요.\n\n예시: 이 프로젝트는 사용자 경험을 개선하고 새로운 기능을 추가하는 것을 목표로 합니다.',
      testObjective: '이 테스트의 주요 목표와 달성하고자 하는 결과를 설명해주세요.\n\n예시: 새로운 기능이 요구사항에 맞게 동작하는지 확인하고, 기존 기능에 영향을 주지 않는지 검증합니다.',
      testingApproach: '전체적인 테스트 접근법과 방법론을 설명해주세요.\n\n예시: 단계별 테스트 진행, 자동화 및 수동 테스트 병행, 위험 기반 테스트 우선순위 적용',
      exceptionHandling: '예외 상황 발생 시 처리 절차를 설명해주세요.\n\n예시: 중요 결함 발견 시 즉시 개발팀에 보고, 테스트 차단 상황 시 대체 방안 수립',
      testScopeLimitations: '이 테스트 단계에 포함되지 않는 특정 모듈이나 기능과 같은 테스트 범위의 제한사항을 지정하세요.\n\n예시: 타사 API 연동 부분은 모킹으로 대체, 성능 테스트는 별도 단계에서 진행',
      excludedAreas: '테스트에서 명시적으로 제외되는 영역이나 기능을 나열하세요.\n\n예시: 레거시 모듈, 외부 결제 시스템, 관리자 전용 기능',
      assumptions: '테스트 환경이나 데이터의 가용성과 같은 이 테스트 계획 작성 중에 이루어진 가정사항을 문서화하세요.\n\n예시: 테스트 환경이 운영 환경과 동일하게 설정됨, 테스트 데이터는 충분히 제공됨',
      schedule: [
        {
          phase: '1단계: 테스트 준비',
          startDate: '',
          endDate: '',
          tasks: '테스트 케이스 작성, 테스트 환경 구성',
          testMethod: '테스트 계획 검토 및 승인'
        }
      ],
      responsibleParties: [
        {
          role: '테스트 매니저',
          name: '',
          email: '',
          responsibilities: '전체 테스트 진행 관리 및 품질 보증'
        }
      ],

      riskFactors: [
        {
          riskName: '일정 지연',
          impact: '보통',
          probability: '보통',
          mitigation: '버퍼 시간 확보 및 우선순위 조정'
        }
      ],

      referenceDocuments: [
        {
          title: '요구사항 문서',
          url: '',
          description: '프로젝트 요구사항 상세 문서'
        }
      ],
      issueReports: [
        {
          title: '이슈 리포트 템플릿',
          path: '',
          description: '발견된 결함 및 이슈 보고서'
        }
      ],
      testEnvironments: [
        {
          category: '웹 브라우저',
          details: 'Chrome (최신 버전), Firefox (최신 버전), Safari (최신 버전)'
        }
      ],
      testStrategies: [
        {
          strategyName: '기능 테스트',
          description: '각 기능이 요구사항에 맞게 동작하는지 확인하는 테스트'
        }
      ]
    };
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayItemChange = (arrayName: string, index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item: any, i: number) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (arrayName: string, template: any) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], template]
    }));
  };

  const removeArrayItem = (arrayName: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSave = () => {
    console.log('저장된 데이터:', formData);
    onSave?.(formData);
    setIsEditMode(false);
  };

  const handleEdit = (source: 'top' | 'bottom' = 'bottom') => {
    // 추적 이벤트 전송
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', source === 'top' ? 'click_edit_top' : 'click_edit_bottom', {
        event_category: 'test_plan',
        event_label: 'edit_mode_enter'
      });
    }
    
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    // 필요시 원래 데이터로 복원 로직 추가
  };

  const toggleKebabMenu = () => {
    setIsKebabMenuOpen(!isKebabMenuOpen);
  };

  const handleKebabMenuEdit = () => {
    handleEdit('top');
    setIsKebabMenuOpen(false);
  };

  // 케밥 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isKebabMenuOpen && !target.closest('[data-kebab-menu]')) {
        setIsKebabMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isKebabMenuOpen]);

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <HeaderContent>
            {isEditMode ? (
              <TitleInput
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="테스트 계획 제목을 입력해주세요"
                aria-label="테스트 계획 제목 입력"
              />
            ) : (
              <ReadOnlyTitle>
                {formData.title || '제목을 입력해주세요'}
              </ReadOnlyTitle>
            )}
          </HeaderContent>
          
          {!isEditMode && (
            <HeaderActions>
              <KebabMenuContainer data-kebab-menu>
                <KebabButton
                  onClick={toggleKebabMenu}
                  aria-label="테스트 계획 메뉴 열기"
                  aria-expanded={isKebabMenuOpen}
                  aria-haspopup="menu"
                />
                <DropdownMenu isOpen={isKebabMenuOpen} role="menu">
                  <DropdownItem
                    onClick={handleKebabMenuEdit}
                    role="menuitem"
                    aria-label="테스트 계획 수정하기"
                  >
                    수정
                  </DropdownItem>
                </DropdownMenu>
              </KebabMenuContainer>
            </HeaderActions>
          )}
        </Header>

      <ContentGrid>
                {/* 프로젝트 개요 */}
        <Card>
          <SectionTitle>
            <SectionIcon />
            프로젝트 개요 / 범위
          </SectionTitle>
                {isEditMode ? (
            <TextArea
                    value={formData.projectOverview}
                    onChange={(e) => handleInputChange('projectOverview', e.target.value)}
              placeholder="프로젝트의 개요와 목적을 간단히 설명해주세요..."
                  />
                ) : (
            <ReadOnlyText>
              {formData.projectOverview || '내용이 없습니다.'}
            </ReadOnlyText>
          )}
        </Card>

        {/* 테스트 목표 */}
        <Card>
          <SectionTitle>
            <SectionIcon />
            테스트 목표
          </SectionTitle>
          {isEditMode ? (
            <TextArea
              value={formData.testObjective}
              onChange={(e) => handleInputChange('testObjective', e.target.value)}
              placeholder="이 테스트의 주요 목표와 달성하고자 하는 결과를 설명해주세요..."
            />
          ) : (
            <ReadOnlyText>
              {formData.testObjective || '내용이 없습니다.'}
            </ReadOnlyText>
          )}
        </Card>

        {/* 일정 */}
        <TableCard>
          <TableWrapper>
            <SectionTitle>
              <SectionIcon />
              일정
            </SectionTitle>
            <Table>
              <thead>
                <tr>
                <TableHeader>단계</TableHeader>
                <TableHeader>시작일</TableHeader>
                <TableHeader>종료일</TableHeader>
                <TableHeader>작업</TableHeader>
                <TableHeader>테스트 방법</TableHeader>
                </tr>
              </thead>
              <tbody>
              {formData.schedule.map((item: any, index: number) => (
                  <tr key={index}>
                  <TableCell>
                    <TableInput
                          value={item.phase}
                      onChange={(e) => handleArrayItemChange('schedule', index, 'phase', e.target.value)}
                      placeholder="단계명"
                    />
                  </TableCell>
                  <TableCell>
                    <TableInput
                          type="date"
                          value={item.startDate}
                      onChange={(e) => handleArrayItemChange('schedule', index, 'startDate', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TableInput
                          type="date"
                          value={item.endDate}
                      onChange={(e) => handleArrayItemChange('schedule', index, 'endDate', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TableTextArea
                          value={item.tasks}
                      onChange={(e) => handleArrayItemChange('schedule', index, 'tasks', e.target.value)}
                      placeholder="작업 내용"
                    />
                  </TableCell>
                  <TableCell>
                    <TableTextArea
                      value={item.testMethod}
                      onChange={(e) => handleArrayItemChange('schedule', index, 'testMethod', e.target.value)}
                      placeholder="테스트 방법"
                    />
                  </TableCell>
                  </tr>
                ))}
              </tbody>
            </Table>
          {isEditMode && (
            <AddButton onClick={() => addArrayItem('schedule', {
              phase: '',
              startDate: '',
              endDate: '',
              tasks: '',
              testMethod: ''
            })}>
              일정 추가
            </AddButton>
          )}
          </TableWrapper>
        </TableCard>

        {/* 담당자 */}
        <TableCard>
          <TableWrapper>
            <SectionTitle>
              <SectionIcon />
              담당자
            </SectionTitle>
            <Table>
              <thead>
                <tr>
                <TableHeader>역할</TableHeader>
                <TableHeader>이름</TableHeader>
                <TableHeader>이메일</TableHeader>
                <TableHeader>책임사항</TableHeader>
                </tr>
              </thead>
              <tbody>
              {formData.responsibleParties.map((item: any, index: number) => (
                  <tr key={index}>
                  <TableCell>
                    <TableInput
                    value={item.role}
                      onChange={(e) => handleArrayItemChange('responsibleParties', index, 'role', e.target.value)}
                      placeholder="역할"
                    />
                  </TableCell>
                  <TableCell>
                    <TableInput
                    value={item.name}
                      onChange={(e) => handleArrayItemChange('responsibleParties', index, 'name', e.target.value)}
                      placeholder="이름"
                    />
                  </TableCell>
                  <TableCell>
                    <TableInput
                      type="email"
                      value={item.email}
                      onChange={(e) => handleArrayItemChange('responsibleParties', index, 'email', e.target.value)}
                      placeholder="이메일"
                    />
                  </TableCell>
                  <TableCell>
                    <TableTextArea
                      value={item.responsibilities}
                      onChange={(e) => handleArrayItemChange('responsibleParties', index, 'responsibilities', e.target.value)}
                      placeholder="책임사항"
                    />
                  </TableCell>
                  </tr>
                ))}
              </tbody>
            </Table>
          <AddButton onClick={() => addArrayItem('responsibleParties', {
            role: '',
            name: '',
            email: '',
            responsibilities: ''
          })}>
            담당자 추가
          </AddButton>
          </TableWrapper>
        </TableCard>

        {/* 위험 요소 */}
        <TableCard>
          <TableWrapper>
            <SectionTitle>
              <SectionIcon />
              위험 요소
            </SectionTitle>
            <Table>
              <thead>
                <tr>
                <TableHeader>위험명</TableHeader>
                <TableHeader>영향도</TableHeader>
                <TableHeader>발생 확률</TableHeader>
                <TableHeader>대응 방안</TableHeader>
                </tr>
              </thead>
              <tbody>
              {formData.riskFactors.map((item: any, index: number) => (
                  <tr key={index}>
                  <TableCell>
                    <TableInput
                      value={item.riskName}
                      onChange={(e) => handleArrayItemChange('riskFactors', index, 'riskName', e.target.value)}
                      placeholder="위험명"
                    />
                  </TableCell>
                  <TableCell>
                    <TableInput
                          value={item.impact}
                      onChange={(e) => handleArrayItemChange('riskFactors', index, 'impact', e.target.value)}
                      placeholder="영향도"
                    />
                  </TableCell>
                  <TableCell>
                    <TableInput
                          value={item.probability}
                      onChange={(e) => handleArrayItemChange('riskFactors', index, 'probability', e.target.value)}
                      placeholder="발생 확률"
                    />
                  </TableCell>
                  <TableCell>
                    <TableTextArea
                          value={item.mitigation}
                      onChange={(e) => handleArrayItemChange('riskFactors', index, 'mitigation', e.target.value)}
                      placeholder="대응 방안"
                    />
                  </TableCell>
                  </tr>
                ))}
              </tbody>
            </Table>
          <AddButton onClick={() => addArrayItem('riskFactors', {
            riskName: '',
            impact: '',
            probability: '',
            mitigation: ''
          })}>
            위험 요소 추가
          </AddButton>
          </TableWrapper>
        </TableCard>

        {/* 테스트 접근법 */}
        <Card>
          <SectionTitle>
            <SectionIcon />
            테스트 접근법
          </SectionTitle>
          {isEditMode ? (
            <TextArea
            value={formData.testingApproach}
            onChange={(e) => handleInputChange('testingApproach', e.target.value)}
              placeholder="전체적인 테스트 접근법과 방법론을 설명해주세요..."
                        />
                      ) : (
            <ReadOnlyText>
              {formData.testingApproach || '내용이 없습니다.'}
            </ReadOnlyText>
          )}
        </Card>

        {/* 예외 처리 */}
        <Card>
          <SectionTitle>
            <SectionIcon />
            예외 처리
          </SectionTitle>
                      {isEditMode ? (
            <TextArea
              value={formData.exceptionHandling}
              onChange={(e) => handleInputChange('exceptionHandling', e.target.value)}
              placeholder="예외 상황 발생 시 처리 절차를 설명해주세요..."
                        />
                      ) : (
            <ReadOnlyText>
              {formData.exceptionHandling || '내용이 없습니다.'}
            </ReadOnlyText>
          )}
        </Card>

        {/* 테스트 범위 제한사항 */}
        <Card>
          <SectionTitle>
            <SectionIcon />
            테스트 범위 제한사항
          </SectionTitle>
          {isEditMode ? (
            <TextArea
            value={formData.testScopeLimitations}
            onChange={(e) => handleInputChange('testScopeLimitations', e.target.value)}
              placeholder="테스트 범위의 제한사항을 지정하세요..."
            />
          ) : (
            <ReadOnlyText>
              {formData.testScopeLimitations || '내용이 없습니다.'}
            </ReadOnlyText>
          )}
        </Card>

        {/* 제외 영역 */}
        <Card>
          <SectionTitle>
            <SectionIcon />
            제외 영역
          </SectionTitle>
          {isEditMode ? (
            <TextArea
            value={formData.excludedAreas}
            onChange={(e) => handleInputChange('excludedAreas', e.target.value)}
              placeholder="테스트에서 제외되는 영역이나 기능을 나열하세요..."
            />
          ) : (
            <ReadOnlyText>
              {formData.excludedAreas || '내용이 없습니다.'}
            </ReadOnlyText>
          )}
        </Card>

        {/* 가정사항 */}
        <Card>
          <SectionTitle>
            <SectionIcon />
            가정사항
          </SectionTitle>
          {isEditMode ? (
            <TextArea
            value={formData.assumptions}
            onChange={(e) => handleInputChange('assumptions', e.target.value)}
              placeholder="테스트 계획 작성 중에 이루어진 가정사항을 문서화하세요..."
            />
          ) : (
            <ReadOnlyText>
              {formData.assumptions || '내용이 없습니다.'}
            </ReadOnlyText>
          )}
        </Card>
      </ContentGrid>

      <ActionBar>
        {isEditMode ? (
          <>
            <CancelButton onClick={handleCancel}>
              취소
            </CancelButton>
            <SaveButton onClick={handleSave}>
              저장
            </SaveButton>
          </>
        ) : (
          <>
            <PreviewButton 
              onClick={onPreview}
              aria-label="테스트 계획 미리보기"
            >
              미리보기
            </PreviewButton>
            <EditButton 
              onClick={() => handleEdit('bottom')}
              aria-label="테스트 계획 수정하기 (하단)"
            >
              수정
            </EditButton>
          </>
        )}
      </ActionBar>
      </ContentWrapper>
    </Container>
  );
};

export default TestPlanForm;