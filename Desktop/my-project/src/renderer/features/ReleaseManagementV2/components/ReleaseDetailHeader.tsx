import React from 'react';
import styled from 'styled-components';
import Button from '@/shared/components/Button';

// 타입 정의
interface ReleaseDetailHeaderProps {
  release: {
    id: string;
    name: string;
    version: string;
    status: 'Draft' | 'Active' | 'Complete' | 'Archived';
    planned: number;
    executed: number;
    passed: number;
    failed: number;
    blocked: number;
    passRate: number;
  };
  onAction: (action: string) => void;
}

// 헤더 컨테이너
const HeaderContainer = styled.div`
  background: ${({ theme }) => theme.color.surface.primary};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
  padding: 0 24px;
`;

// 메인 헤더 (첫 번째 줄)
const MainHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  gap: 16px;
`;

// 좌측 영역 (제목 + 버전 + 상태)
const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

// 릴리즈 이름
const ReleaseName = styled.h1`
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0;
`;

// 버전 Pill
const VersionPill = styled.span`
  font-family: monospace;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.color.primary[700]};
  background: ${({ theme }) => theme.color.primary[100]};
  padding: 4px 8px;
  border-radius: 6px;
`;

// 상태 배지
const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  
  ${({ status, theme }) => {
    switch (status) {
      case 'Draft':
        return `
          background: ${theme.color.neutral[100]};
          color: ${theme.color.neutral[700]};
        `;
      case 'Active':
        return `
          background: ${theme.color.primary[100]};
          color: ${theme.color.primary[700]};
        `;
      case 'Complete':
        return `
          background: ${theme.color.success[100]};
          color: ${theme.color.success[700]};
        `;
      case 'Archived':
        return `
          background: ${theme.color.secondary[100]};
          color: ${theme.color.secondary[600]};
        `;
      default:
        return `
          background: ${theme.color.neutral[100]};
          color: ${theme.color.neutral[600]};
        `;
    }
  }}
`;

// 우측 영역 (액션 버튼들)
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

// KPI 섹션 (두 번째 줄)
const KPISection = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  padding: 16px 0;
  border-top: 1px solid ${({ theme }) => theme.color.border.tertiary};
`;

// KPI 카드
const KPICard = styled.div`
  background: ${({ theme }) => theme.color.surface.secondary};
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  height: 72px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// KPI 아이콘
const KPIIcon = styled.div`
  font-size: 20px;
  margin-bottom: 8px;
  opacity: 0.7;
`;

// KPI 값
const KPIValue = styled.div<{ color?: string }>`
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  color: ${({ color, theme }) => color || theme.color.text.primary};
  margin-bottom: 4px;
`;

// KPI 라벨
const KPILabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: ${({ theme }) => theme.color.text.secondary};
`;

// 반응형 조정
const ResponsiveContainer = styled.div`
  @media (max-width: 1200px) {
    ${KPISection} {
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
  }
  
  @media (max-width: 768px) {
    ${MainHeader} {
      flex-direction: column;
      align-items: flex-start;
      height: auto;
      padding: 16px 0;
      gap: 12px;
    }
    
    ${LeftSection} {
      flex-wrap: wrap;
      gap: 8px;
    }
    
    ${RightSection} {
      width: 100%;
      justify-content: flex-end;
    }
    
    ${KPISection} {
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      padding: 12px 0;
    }
    
    ${KPICard} {
      height: 64px;
      padding: 12px;
    }
    
    ${KPIValue} {
      font-size: 18px;
      line-height: 24px;
    }
  }
`;

const ReleaseDetailHeader: React.FC<ReleaseDetailHeaderProps> = ({
  release,
  onAction
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return '#64748b';
      case 'Active': return '#2563eb';
      case 'Complete': return '#16a34a';
      case 'Archived': return '#475569';
      default: return '#64748b';
    }
  };

  const getPassRateColor = (rate: number) => {
    if (rate >= 90) return '#16a34a';
    if (rate >= 70) return '#d97706';
    return '#dc2626';
  };

  return (
    <HeaderContainer>
      <ResponsiveContainer>
        {/* 메인 헤더 */}
        <MainHeader>
          <LeftSection>
            <ReleaseName>{release.name}</ReleaseName>
            <VersionPill>{release.version}</VersionPill>
            <StatusBadge status={release.status}>
              {release.status}
            </StatusBadge>
          </LeftSection>
          
          <RightSection>
            <Button
              variant="secondary"
              size="md"
              onClick={() => onAction('execution-board')}
            >
              실행 보드
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => onAction('scope-sync')}
            >
              스코프 동기화
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => onAction('report')}
            >
              보고서
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => onAction('sign-off')}
            >
              사인오프
            </Button>
          </RightSection>
        </MainHeader>
        
        {/* KPI 섹션 */}
        <KPISection>
          <KPICard>
            <KPIIcon>📋</KPIIcon>
            <KPIValue>{release.planned}</KPIValue>
            <KPILabel>Planned</KPILabel>
          </KPICard>
          
          <KPICard>
            <KPIIcon>▶️</KPIIcon>
            <KPIValue>{release.executed}</KPIValue>
            <KPILabel>Executed</KPILabel>
          </KPICard>
          
          <KPICard>
            <KPIIcon>✅</KPIIcon>
            <KPIValue>{release.passed}</KPIValue>
            <KPILabel>Pass</KPILabel>
          </KPICard>
          
          <KPICard>
            <KPIIcon>❌</KPIIcon>
            <KPIValue>{release.failed}</KPIValue>
            <KPILabel>Fail</KPILabel>
          </KPICard>
          
          <KPICard>
            <KPIIcon>⏸️</KPIIcon>
            <KPIValue>{release.blocked}</KPIValue>
            <KPILabel>Blocked</KPILabel>
          </KPICard>
          
          <KPICard>
            <KPIIcon>📊</KPIIcon>
            <KPIValue color={getPassRateColor(release.passRate)}>
              {release.passRate}%
            </KPIValue>
            <KPILabel>Pass Rate</KPILabel>
          </KPICard>
        </KPISection>
      </ResponsiveContainer>
    </HeaderContainer>
  );
};

export default ReleaseDetailHeader;
