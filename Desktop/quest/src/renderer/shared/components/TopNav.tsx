import React from 'react';
import styled from 'styled-components';
import { Theme } from '../theme';
import SearchInput from './SearchInput';
import NotificationBadge from './NotificationBadge';
import ProfileMenu from './ProfileMenu';

export interface TopNavProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  notificationCount?: number;
  onNotificationClick?: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onProfileAction?: (action: string) => void;
  className?: string;
}

const TopNavContainer = styled.header`
  height: 64px;
  background: ${({ theme }) => theme.color.surface};
  border-bottom: 1px solid ${({ theme }) => theme.color.neutralBorder};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  z-index: ${({ theme }) => theme.zIndex.sticky};
`;

const TopNavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  flex: 1;
`;

const TopNavRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SearchContainer = styled.div`
  width: 400px;
  max-width: 100%;
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TopNav: React.FC<TopNavProps> = ({
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
  notificationCount = 0,
  onNotificationClick,
  user,
  onProfileAction,
  className,
}) => {
  return (
    <TopNavContainer className={className}>
      <TopNavLeft>
        <SearchContainer>
          <SearchInput
            value={searchValue}
            onChange={onSearchChange}
            onSubmit={onSearchSubmit}
            placeholder="Search test cases, releases, users..."
            size="sm"
          />
        </SearchContainer>
      </TopNavLeft>
      
      <TopNavRight>
        <ActionContainer>
          <NotificationBadge
            count={notificationCount}
            onClick={onNotificationClick}
          />
          
          {user && (
            <ProfileMenu
              user={user}
              onAction={onProfileAction}
            />
          )}
        </ActionContainer>
      </TopNavRight>
    </TopNavContainer>
  );
};

export default TopNav; 