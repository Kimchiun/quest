import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@/shared/components/Button';

// 타입 정의
interface Release {
  id: string;
  name: string;
  version: string;
  status: 'draft' | 'in-progress' | 'testing' | 'ready' | 'released';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  environment: string;
  folder: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  testCases: number;
  passed: number;
  failed: number;
  blocked: number;
  progress: number;
}

interface ReleaseCardViewProps {
  releases: Release[];
  selectedReleases: string[];
  onReleaseSelect: (release: Release) => void;
  onReleaseSelection: (releaseId: string, selected: boolean) => void;
  onBulkAction: (action: string, releaseIds: string[]) => void;
}

const ReleaseCardView: React.FC<ReleaseCardViewProps> = ({
  releases,
  selectedReleases,
  onReleaseSelect,
  onReleaseSelection,
  onBulkAction
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const getStatusColor = (status: Release['status']) => {
    switch (status) {
      case 'draft': return 'neutral';
      case 'in-progress': return 'primary';
      case 'testing': return 'warning';
      case 'ready': return 'success';
      case 'released': return 'success';
      default: return 'neutral';
    }
  };

  const getPriorityColor = (priority: Release['priority']) => {
    switch (priority) {
      case 'low': return 'neutral';
      case 'medium': return 'primary';
      case 'high': return 'warning';
      case 'critical': return 'danger';
      default: return 'neutral';
    }
  };

  return (
    <CardContainer>
      {selectedReleases.length > 0 && (
        <BulkActionBar>
          <BulkActionInfo>
            {selectedReleases.length}개 선택됨
          </BulkActionInfo>
          <BulkActionButtons>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onBulkAction('status', selectedReleases)}
            >상태 변경</Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onBulkAction('assignee', selectedReleases)}
            >담당자 지정</Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onBulkAction('environment', selectedReleases)}
            >환경 변경</Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onBulkAction('execute', selectedReleases)}
            >실행</Button>
          </BulkActionButtons>
        </BulkActionBar>
      )}
      
      <CardGrid>
        {releases.map((release) => (
          <Card
            key={release.id}
            selected={selectedReleases.includes(release.id)}
            hovered={hoveredCard === release.id}
            onMouseEnter={() => setHoveredCard(release.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => onReleaseSelect(release)}
          >
            <CardHeader>
              <CardCheckbox
                type="checkbox"
                checked={selectedReleases.includes(release.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  onReleaseSelection(release.id, e.target.checked);
                }}
              />
              <CardTitle>{release.name}</CardTitle>
              <CardVersion>{release.version}</CardVersion>
            </CardHeader>
            
            <CardContent>
              <CardMeta>
                <MetaItem>
                  <MetaLabel>상태</MetaLabel>
                  <StatusBadge $status={release.status}>
                    {release.status}
                  </StatusBadge>
                </MetaItem>
                
                <MetaItem>
                  <MetaLabel>우선순위</MetaLabel>
                  <PriorityBadge $priority={release.priority}>
                    {release.priority}
                  </PriorityBadge>
                </MetaItem>
                
                <MetaItem>
                  <MetaLabel>담당자</MetaLabel>
                  <AssigneeInfo>
                    <AssigneeAvatar>{release.assignee.charAt(0)}</AssigneeAvatar>
                    <AssigneeName>{release.assignee}</AssigneeName>
                  </AssigneeInfo>
                </MetaItem>
                
                <MetaItem>
                  <MetaLabel>환경</MetaLabel>
                  <EnvironmentBadge>{release.environment}</EnvironmentBadge>
                </MetaItem>
                
                <MetaItem>
                  <MetaLabel>폴더</MetaLabel>
                  <FolderPath>{release.folder}</FolderPath>
                </MetaItem>
              </CardMeta>
              
              <ProgressSection>
                <ProgressHeader>
                  <ProgressLabel>통과율</ProgressLabel>
                  <ProgressValue>{release.passRate}%</ProgressValue>
                </ProgressHeader>
                <ProgressBar $progress={release.passRate} />
                <ProgressStats>
                  <StatItem>
                    <StatValue>{release.testCases}</StatValue>
                    <StatLabel>전체</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue $color="success">{release.passed}</StatValue>
                    <StatLabel>통과</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue $color="danger">{release.failed}</StatValue>
                    <StatLabel>실패</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue $color="warning">{release.blocked}</StatValue>
                    <StatLabel>차단</StatLabel>
                  </StatItem>
                </ProgressStats>
              </ProgressSection>
              
              {release.tags.length > 0 && (
                <TagsSection>
                  <TagsLabel>태그</TagsLabel>
                  <TagsContainer>
                    {release.tags.slice(0, 3).map((tag, index) => (
                      <Tag key={index}>{tag}</Tag>
                    ))}
                    {release.tags.length > 3 && (
                      <Tag>+{release.tags.length - 3}</Tag>
                    )}
                  </TagsContainer>
                </TagsSection>
              )}
            </CardContent>
            
            <CardFooter>
              <UpdatedDate>
                수정: {new Date(release.updatedAt).toLocaleDateString()}
              </UpdatedDate>
              <CardActions>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBulkAction('view', [release.id]);
                  }}
                >보기</Button>
              </CardActions>
            </CardFooter>
          </Card>
        ))}
      </CardGrid>
      
      {releases.length === 0 && (
        <EmptyState>
          <EmptyIcon>📋</EmptyIcon>
          <EmptyTitle>릴리즈가 없습니다</EmptyTitle>
          <EmptyDescription>
            새 릴리즈를 생성하여 시작하세요.
          </EmptyDescription>
          <Button
            variant="primary"
            size="md"
          >+ 새 릴리즈 만들기</Button>
        </EmptyState>
      )}
    </CardContainer>
  );
};

// Styled Components
const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.gap.regular};
`;

const BulkActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.color.primary[50]};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.color.primary[200]};
`;

const BulkActionInfo = styled.span`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  color: ${({ theme }) => theme.color.text.secondary};
`;

const BulkActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.gap.sm};
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: ${({ theme }) => theme.gap.regular};
  
  @media (max-width: ${({ theme }) => theme.breakpoint.md}) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div<{ selected: boolean; hovered: boolean }>`
  background: ${({ theme }) => theme.color.surface.primary};
  border: 1px solid ${({ theme, selected }) => 
    selected ? theme.color.primary[300] : theme.color.border.primary
  };
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme, hovered }) => 
    hovered ? theme.elevation[2] : theme.elevation[1]
  };
  overflow: hidden;
  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.normal} ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.gap.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.secondary};
`;

const CardCheckbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const CardTitle = styled.h3`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.h3.fontSize};
  font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0;
  line-height: 1.3;
`;

const CardVersion = styled.span`
  background: ${({ theme }) => theme.color.neutral[100]};
  color: ${({ theme }) => theme.color.neutral[700]};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  font-family: ${({ theme }) => theme.typography.mono.fontFamily};
`;

const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const CardMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.gap.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.gap.sm};
`;

const MetaLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  color: ${({ theme }) => theme.color.text.secondary};
  min-width: 60px;
`;

const StatusBadge = styled.span<{ $status: Release['status'] }>`
  background: ${({ theme, $status }) => {
    switch ($status) {
      case 'draft': return theme.color.neutral[100];
      case 'in-progress': return theme.color.primary[100];
      case 'testing': return theme.color.warning[100];
      case 'ready': return theme.color.success[100];
      case 'released': return theme.color.success[100];
      default: return theme.color.neutral[100];
    }
  }};
  color: ${({ theme, $status }) => {
    switch ($status) {
      case 'draft': return theme.color.neutral[700];
      case 'in-progress': return theme.color.primary[700];
      case 'testing': return theme.color.warning[700];
      case 'ready': return theme.color.success[700];
      case 'released': return theme.color.success[700];
      default: return theme.color.neutral[700];
    }
  }};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
`;

const PriorityBadge = styled.span<{ $priority: Release['priority'] }>`
  background: ${({ theme, $priority }) => {
    switch ($priority) {
      case 'low': return theme.color.neutral[100];
      case 'medium': return theme.color.primary[100];
      case 'high': return theme.color.warning[100];
      case 'critical': return theme.color.danger[100];
      default: return theme.color.neutral[100];
    }
  }};
  color: ${({ theme, $priority }) => {
    switch ($priority) {
      case 'low': return theme.color.neutral[700];
      case 'medium': return theme.color.primary[700];
      case 'high': return theme.color.warning[700];
      case 'critical': return theme.color.danger[700];
      default: return theme.color.neutral[700];
    }
  }};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
`;

const AssigneeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.gap.sm};
`;

const AssigneeAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.color.primary[500]};
  color: ${({ theme }) => theme.color.text.inverse};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
`;

const AssigneeName = styled.span`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  color: ${({ theme }) => theme.color.text.primary};
`;

const EnvironmentBadge = styled.span`
  background: ${({ theme }) => theme.color.neutral[100]};
  color: ${({ theme }) => theme.color.neutral[700]};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
`;

const FolderPath = styled.span`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  color: ${({ theme }) => theme.color.text.secondary};
  font-family: ${({ theme }) => theme.typography.mono.fontFamily};
`;

const ProgressSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ProgressLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  color: ${({ theme }) => theme.color.text.secondary};
`;

const ProgressValue = styled.span`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
`;

const ProgressBar = styled.div<{ $progress: number }>`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.color.neutral[200]};
  border-radius: ${({ theme }) => theme.radius.pill};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ $progress }) => $progress}%;
    background: ${({ theme, $progress }) => {
      if ($progress >= 100) return theme.color.success[500];
      if ($progress >= 80) return theme.color.primary[500];
      if ($progress >= 50) return theme.color.warning[500];
      return theme.color.neutral[500];
    }};
    transition: width ${({ theme }) => theme.motion.normal} ease;
  }
`;

const ProgressStats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.gap.sm};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div<{ $color?: 'success' | 'danger' | 'warning' | 'neutral' }>`
  font-size: ${({ theme }) => theme.typography.h3.fontSize};
  font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
  color: ${({ theme, $color }) => {
    switch ($color) {
      case 'success': return theme.color.success[600];
      case 'danger': return theme.color.danger[600];
      case 'warning': return theme.color.warning[600];
      default: return theme.color.text.primary;
    }
  }};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  color: ${({ theme }) => theme.color.text.secondary};
`;

const TagsSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const TagsLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  color: ${({ theme }) => theme.color.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TagsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.gap.xs};
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: ${({ theme }) => theme.color.neutral[100]};
  color: ${({ theme }) => theme.color.neutral[700]};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.color.border.secondary};
  background: ${({ theme }) => theme.color.surface.secondary};
`;

const UpdatedDate = styled.span`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  color: ${({ theme }) => theme.color.text.tertiary};
`;

const CardActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.gap.xs};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.h3.fontSize};
  font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

const EmptyDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  color: ${({ theme }) => theme.color.text.secondary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

export default ReleaseCardView;
