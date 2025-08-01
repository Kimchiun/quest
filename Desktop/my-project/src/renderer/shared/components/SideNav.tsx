import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Theme } from '../theme';

export interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  children?: NavItem[];
  badge?: number;
  disabled?: boolean;
}

export interface SideNavProps {
  items: NavItem[];
  collapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
  onNavigate?: (item: NavItem) => void;
  activeItemId?: string;
  className?: string;
}

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const SideNavContainer = styled.aside<{ collapsed: boolean }>`
  width: ${({ collapsed }) => collapsed ? '64px' : '240px'};
  background: ${({ theme }) => theme.color.surface};
  border-right: 1px solid ${({ theme }) => theme.color.neutralBorder};
  height: 100vh;
  display: flex;
  flex-direction: column;
  transition: width ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const SideNavHeader = styled.div<{ collapsed: boolean }>`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.color.neutralBorder};
  display: flex;
  align-items: center;
  justify-content: ${({ collapsed }) => collapsed ? 'center' : 'space-between'};
  min-height: 64px;
`;

const Logo = styled.div<{ collapsed: boolean }>`
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeLg};
  font-weight: ${({ theme }) => theme.font.weightBold};
  color: ${({ theme }) => theme.color.primary};
  opacity: ${({ collapsed }) => collapsed ? 0 : 1};
  transition: opacity ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  white-space: nowrap;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  color: ${({ theme }) => theme.color.textSecondary};
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  
  &:hover {
    background: ${({ theme }) => theme.color.neutralBg};
    color: ${({ theme }) => theme.color.text};
  }
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.focus};
    outline-offset: 2px;
  }
`;

const NavList = styled.nav`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md} 0;
  overflow-y: auto;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color.neutralBorder};
    border-radius: ${({ theme }) => theme.radius.sm};
    
    &:hover {
      background: ${({ theme }) => theme.color.textSecondary};
    }
  }
`;

const NavItemContainer = styled.div<{ collapsed: boolean }>`
  margin: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
`;

const NavItemButton = styled.button<{ 
  active: boolean; 
  collapsed: boolean;
  hasChildren: boolean;
}>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: ${({ collapsed }) => collapsed ? 'center' : 'flex-start'};
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme, collapsed }) => 
    collapsed ? theme.spacing.sm : `${theme.spacing.sm} ${theme.spacing.md}`
  };
  background: ${({ theme, active }) => 
    active ? theme.color.primaryLight : 'transparent'
  };
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme, active }) => 
    active ? theme.color.primary : theme.color.text
  };
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeBase};
  font-weight: ${({ theme, active }) => 
    active ? theme.font.weightMedium : theme.font.weightRegular
  };
  cursor: pointer;
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  position: relative;
  
  &:hover {
    background: ${({ theme, active }) => 
      active ? theme.color.primaryLight : theme.color.neutralBg
    };
  }
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.focus};
    outline-offset: 2px;
  }
  
  /* Active indicator */
  ${({ active, theme }) => active && css`
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 20px;
      background: ${theme.color.primary};
      border-radius: 0 ${theme.radius.sm} ${theme.radius.sm} 0;
    }
  `}
  
  /* Badge */
  ${({ collapsed }) => !collapsed && css`
    &::after {
      content: attr(data-badge);
      position: absolute;
      right: ${({ theme }) => theme.spacing.sm};
      top: 50%;
      transform: translateY(-50%);
      background: ${({ theme }) => theme.color.danger};
      color: white;
      font-size: ${({ theme }) => theme.font.sizeXs};
      font-weight: ${({ theme }) => theme.font.weightBold};
      padding: 2px 6px;
      border-radius: ${({ theme }) => theme.radius.full};
      min-width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: ${({ 'data-badge': badge }) => badge ? 1 : 0};
    }
  `}
`;

const NavItemLabel = styled.span<{ collapsed: boolean }>`
  opacity: ${({ collapsed }) => collapsed ? 0 : 1};
  transition: opacity ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NavItemIcon = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: inherit;
`;

const SubNavList = styled.div<{ isOpen: boolean; collapsed: boolean }>`
  margin-left: ${({ theme, collapsed }) => collapsed ? 0 : theme.spacing.xl};
  overflow: hidden;
  animation: ${({ isOpen }) => isOpen ? css`${slideIn} 0.2s ease-out` : 'none'};
  
  ${({ collapsed, isOpen }) => collapsed && css`
    display: none;
  `}
`;

const SubNavItem = styled.button<{ active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  background: ${({ theme, active }) => 
    active ? theme.color.neutralBg : 'transparent'
  };
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme, active }) => 
    active ? theme.color.primary : theme.color.textSecondary
  };
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.sizeSm};
  font-weight: ${({ theme, active }) => 
    active ? theme.font.weightMedium : theme.font.weightRegular
  };
  cursor: pointer;
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  
  &:hover {
    background: ${({ theme, active }) => 
      active ? theme.color.neutralBg : theme.color.neutralBg
    };
    color: ${({ theme, active }) => 
      active ? theme.color.primary : theme.color.text
    };
  }
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.focus};
    outline-offset: 2px;
  }
`;

const SideNav: React.FC<SideNavProps> = ({
  items,
  collapsed = false,
  onToggle,
  onNavigate,
  activeItemId,
  className,
}) => {
  const [openSubMenus, setOpenSubMenus] = useState<Set<string>>(new Set());

  const handleToggle = () => {
    onToggle?.(!collapsed);
  };

  const handleItemClick = (item: NavItem) => {
    if (item.disabled) return;

    if (item.children && item.children.length > 0) {
      // Toggle submenu
      const newOpenSubMenus = new Set(openSubMenus);
      if (newOpenSubMenus.has(item.id)) {
        newOpenSubMenus.delete(item.id);
      } else {
        newOpenSubMenus.add(item.id);
      }
      setOpenSubMenus(newOpenSubMenus);
    } else {
      // Navigate to item
      onNavigate?.(item);
    }
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = activeItemId === item.id;
    const hasSubMenu = item.children && item.children.length > 0;
    const isSubMenuOpen = openSubMenus.has(item.id);

    return (
      <NavItemContainer key={item.id} collapsed={collapsed}>
        <NavItemButton
          active={isActive}
          collapsed={collapsed}
          hasChildren={hasSubMenu}
          onClick={() => handleItemClick(item)}
          disabled={item.disabled}
          data-badge={item.badge || ''}
          aria-expanded={hasSubMenu ? isSubMenuOpen : undefined}
          aria-current={isActive ? 'page' : undefined}
        >
          {item.icon && <NavItemIcon>{item.icon}</NavItemIcon>}
          {!collapsed && <NavItemLabel collapsed={collapsed}>{item.label}</NavItemLabel>}
        </NavItemButton>
        
        {hasSubMenu && (
          <SubNavList isOpen={isSubMenuOpen} collapsed={collapsed}>
            {item.children!.map((child) => (
              <SubNavItem
                key={child.id}
                active={activeItemId === child.id}
                onClick={() => onNavigate?.(child)}
                disabled={child.disabled}
                aria-current={activeItemId === child.id ? 'page' : undefined}
              >
                {child.icon && <NavItemIcon>{child.icon}</NavItemIcon>}
                {child.label}
              </SubNavItem>
            ))}
          </SubNavList>
        )}
      </NavItemContainer>
    );
  };

  return (
    <SideNavContainer collapsed={collapsed} className={className}>
      <SideNavHeader collapsed={collapsed}>
        {!collapsed && <Logo collapsed={collapsed}>Quest</Logo>}
        <ToggleButton
          onClick={handleToggle}
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {collapsed ? '→' : '←'}
        </ToggleButton>
      </SideNavHeader>
      
      <NavList role="navigation" aria-label="Main navigation">
        {items.map(renderNavItem)}
      </NavList>
    </SideNavContainer>
  );
};

export default SideNav; 