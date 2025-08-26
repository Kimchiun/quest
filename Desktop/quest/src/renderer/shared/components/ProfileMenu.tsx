import React, { useState, useRef, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Theme } from '../theme';

export interface ProfileMenuProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  onAction?: (action: string) => void;
  className?: string;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ProfileContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  color: ${({ theme }) => theme.color.text};
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  
  &:hover {
    background: ${({ theme }) => theme.color.neutralBg};
  }
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.focus};
    outline-offset: 2px;
  }
`;

const Avatar = styled.div<{ hasImage: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme, hasImage }) => 
    hasImage ? 'transparent' : theme.color.primary
  };
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, hasImage }) => 
    hasImage ? 'transparent' : theme.color.surface
  };
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeSm};
  font-weight: ${({ theme }) => theme.font.weightBold};
  overflow: hidden;
  
  ${({ hasImage }) => hasImage && css`
    background-size: cover;
    background-position: center;
  `}
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
`;

const UserName = styled.div`
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeSm};
  font-weight: ${({ theme }) => theme.font.weightMedium};
  color: ${({ theme }) => theme.color.text};
  line-height: ${({ theme }) => theme.font.lineHeightTight};
`;

const UserEmail = styled.div`
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeXs};
  color: ${({ theme }) => theme.color.textSecondary};
  line-height: ${({ theme }) => theme.font.lineHeightTight};
`;

const ChevronIcon = styled.div<{ isOpen: boolean }>`
  font-size: 12px;
  color: ${({ theme }) => theme.color.textSecondary};
  transition: transform ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const ProfileDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  width: 240px;
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.neutralBorder};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  margin-top: ${({ theme }) => theme.spacing.xs};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transform: ${({ isOpen }) => isOpen ? 'translateY(0)' : 'translateY(-8px)'};
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  
  ${({ isOpen }) => isOpen && css`
    animation: ${fadeIn} 0.2s ease-out;
  `}
`;

const ProfileHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.color.neutralBorder};
`;

const ProfileHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ProfileHeaderInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProfileHeaderName = styled.div`
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeBase};
  font-weight: ${({ theme }) => theme.font.weightBold};
  color: ${({ theme }) => theme.color.text};
  line-height: ${({ theme }) => theme.font.lineHeightTight};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProfileHeaderEmail = styled.div`
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeSm};
  color: ${({ theme }) => theme.color.textSecondary};
  line-height: ${({ theme }) => theme.font.lineHeightTight};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProfileMenuList = styled.div`
  padding: ${({ theme }) => theme.spacing.xs} 0;
`;

const ProfileMenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: none;
  border: none;
  color: ${({ theme }) => theme.color.text};
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeSm};
  font-weight: ${({ theme }) => theme.font.weightRegular};
  cursor: pointer;
  transition: background ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  text-align: left;
  
  &:hover {
    background: ${({ theme }) => theme.color.neutralBg};
  }
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.focus};
    outline-offset: -2px;
  }
  
  /* Danger action styling */
  &[data-danger="true"] {
    color: ${({ theme }) => theme.color.danger};
    
    &:hover {
      background: ${({ theme }) => theme.color.dangerLight};
    }
  }
`;

const MenuItemIcon = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  user,
  onAction,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleAction = (action: string) => {
    onAction?.(action);
    setIsOpen(false);
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <ProfileContainer ref={containerRef} className={className}>
      <ProfileButton
        onClick={handleToggle}
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <Avatar 
          hasImage={!!user.avatar}
          style={user.avatar ? { backgroundImage: `url(${user.avatar})` } : {}}
        >
          {!user.avatar && getInitials(user.name)}
        </Avatar>
        
        <UserInfo>
          <UserName>{user.name}</UserName>
          <UserEmail>{user.email}</UserEmail>
        </UserInfo>
        
        <ChevronIcon isOpen={isOpen}>▼</ChevronIcon>
      </ProfileButton>
      
      {isOpen && (
        <ProfileDropdown isOpen={isOpen}>
          <ProfileHeader>
            <ProfileHeaderContent>
              <Avatar 
                hasImage={!!user.avatar}
                style={user.avatar ? { backgroundImage: `url(${user.avatar})` } : {}}
              >
                {!user.avatar && getInitials(user.name)}
              </Avatar>
              
              <ProfileHeaderInfo>
                <ProfileHeaderName>{user.name}</ProfileHeaderName>
                <ProfileHeaderEmail>{user.email}</ProfileHeaderEmail>
              </ProfileHeaderInfo>
            </ProfileHeaderContent>
          </ProfileHeader>
          
          <ProfileMenuList>
            <ProfileMenuItem onClick={() => handleAction('profile')}>
              <MenuItemIcon>👤</MenuItemIcon>
              Profile
            </ProfileMenuItem>
            
            <ProfileMenuItem onClick={() => handleAction('settings')}>
              <MenuItemIcon>⚙️</MenuItemIcon>
              Settings
            </ProfileMenuItem>
            
            <ProfileMenuItem onClick={() => handleAction('help')}>
              <MenuItemIcon>❓</MenuItemIcon>
              Help & Support
            </ProfileMenuItem>
            
            <ProfileMenuItem 
              onClick={() => handleAction('logout')}
              data-danger="true"
            >
              <MenuItemIcon>🚪</MenuItemIcon>
              Sign Out
            </ProfileMenuItem>
          </ProfileMenuList>
        </ProfileDropdown>
      )}
    </ProfileContainer>
  );
};

export default ProfileMenu; 