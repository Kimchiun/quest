import React from 'react';
import styled from 'styled-components';
import Button from '@/shared/components/Button';
import { SearchControl } from '@/shared/components/Layout/ControlComponents';
import ViewToggle from '@/shared/components/Layout/ViewToggle';

// 타입 정의
interface ReleaseListHeaderProps {
  onCreateRelease: () => void;
  onSearch: (query: string) => void;
  viewMode: 'table' | 'card';
  onViewModeChange: (mode: 'table' | 'card') => void;
  selectedCount: number;
  totalCount: number;
}

const ReleaseListHeader: React.FC<ReleaseListHeaderProps> = ({
  onCreateRelease,
  onSearch,
  viewMode,
  onViewModeChange,
  selectedCount,
  totalCount
}) => {
  return (
    <HeaderContainer>
      <MainHeader>
        <LeftSection>
          <Title>릴리즈 관리</Title>
          <TotalBadge>{totalCount}</TotalBadge>
          {selectedCount > 0 && (
            <SelectedBadge>{selectedCount} 선택됨</SelectedBadge>
          )}
        </LeftSection>
        
        <RightSection>
          <ViewToggle
            options={[
              { value: 'table', label: '테이블', icon: '📊' },
              { value: 'card', label: '카드', icon: '🃏' }
            ]}
            value={viewMode}
            onChange={onViewModeChange}
          />
          <Button
            variant="primary"
            size="md"
            onClick={onCreateRelease}
          >+ 새 릴리즈</Button>
        </RightSection>
      </MainHeader>
      
      <SecondaryHeader>
        <SearchSection>
          <SearchControl
            placeholder="릴리즈 검색..."
            onSearch={onSearch}
          />
        </SearchSection>
      </SecondaryHeader>
    </HeaderContainer>
  );
};

// Styled Components
const HeaderContainer = styled.div`
  background: ${({ theme }) => theme.color.surface.primary};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const MainHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  gap: ${({ theme }) => theme.gap.regular};
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.gap.sm};
  flex-shrink: 0;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.h2.fontSize};
  font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0;
`;

const TotalBadge = styled.span`
  background: ${({ theme }) => theme.color.primary[100]};
  color: ${({ theme }) => theme.color.primary[700]};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.pill};
  min-width: 20px;
  text-align: center;
`;

const SelectedBadge = styled.span`
  background: ${({ theme }) => theme.color.success[100]};
  color: ${({ theme }) => theme.color.success[700]};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.pill};
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.gap.sm};
  flex-shrink: 0;
`;

const SecondaryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.gap.regular};
  height: 48px;
  border-top: 1px solid ${({ theme }) => theme.color.border.tertiary};
`;

const SearchSection = styled.div`
  flex: 1;
  min-width: 320px;
  max-width: 480px;
`;

export default ReleaseListHeader;
