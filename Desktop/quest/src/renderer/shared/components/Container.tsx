import React from 'react';
import styled from 'styled-components';
import { Theme } from '../theme';

export interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: string | { xs?: string; sm?: string; md?: string; lg?: string; xl?: string };
  padding?: string | { xs?: string; sm?: string; md?: string; lg?: string; xl?: string };
  background?: string;
  radius?: string;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  style?: React.CSSProperties;
  className?: string;
}

const getMaxWidth = (maxWidth: ContainerProps['maxWidth'], theme: Theme) => {
  if (typeof maxWidth === 'string') {
    return maxWidth;
  }
  
  if (typeof maxWidth === 'object') {
    return `
      ${maxWidth.xs || '100%'};
      @media (min-width: ${theme.breakpoint.sm}) {
        max-width: ${maxWidth.sm || maxWidth.xs || '100%'};
      }
      @media (min-width: ${theme.breakpoint.md}) {
        max-width: ${maxWidth.md || maxWidth.sm || maxWidth.xs || '100%'};
      }
      @media (min-width: ${theme.breakpoint.lg}) {
        max-width: ${maxWidth.lg || maxWidth.md || maxWidth.sm || maxWidth.xs || '100%'};
      }
      @media (min-width: ${theme.breakpoint.xl}) {
        max-width: ${maxWidth.xl || maxWidth.lg || maxWidth.md || maxWidth.sm || maxWidth.xs || '100%'};
      }
    `;
  }
  
  return '1200px';
};

const getPadding = (padding: ContainerProps['padding'], theme: Theme) => {
  if (typeof padding === 'string') {
    return padding;
  }
  
  if (typeof padding === 'object') {
    return `
      ${padding.xs || theme.spacing[4]};
      @media (min-width: ${theme.breakpoint.sm}) {
        padding: ${padding.sm || padding.xs || theme.spacing[4]};
      }
      @media (min-width: ${theme.breakpoint.md}) {
        padding: ${padding.md || padding.sm || padding.xs || theme.spacing[4]};
      }
      @media (min-width: ${theme.breakpoint.lg}) {
        padding: ${padding.lg || padding.md || padding.sm || padding.xs || theme.spacing[4]};
      }
      @media (min-width: ${theme.breakpoint.xl}) {
        padding: ${padding.xl || padding.lg || padding.md || padding.sm || padding.xs || theme.spacing[4]};
      }
    `;
  }
  
  return theme.spacing[4];
};

const getContainerStyles = (variant: string, theme: Theme) => {
  switch (variant) {
    case 'elevated':
      return `
        background: ${theme.color.surface.primary};
        box-shadow: ${theme.shadow.lg};
        border: none;
      `;
    case 'outlined':
      return `
        background: transparent;
        border: 1px solid ${theme.color.border.primary};
        box-shadow: none;
      `;
    case 'filled':
      return `
        background: ${theme.color.surface.secondary};
        box-shadow: ${theme.shadow.sm};
        border: none;
      `;
    default:
      return `
        background: ${theme.color.surface.primary};
        box-shadow: ${theme.shadow.sm};
        border: none;
      `;
  }
};

const getShadow = (shadow: string, theme: Theme) => {
  switch (shadow) {
    case 'none':
      return 'none';
    case 'sm':
      return theme.shadow.sm;
    case 'md':
      return theme.shadow.md;
    case 'lg':
      return theme.shadow.lg;
    case 'xl':
      return theme.shadow.xl;
    default:
      return theme.shadow.sm;
  }
};

const StyledContainer = styled.div<{
  $maxWidth: ContainerProps['maxWidth'];
  $padding: ContainerProps['padding'];
  $background?: string;
  $radius?: string;
  $shadow: string;
  $variant: string;
}>`
  margin: 0 auto;
  max-width: ${({ $maxWidth, theme }) => getMaxWidth($maxWidth, theme)};
  padding: ${({ $padding, theme }) => getPadding($padding, theme)};
  background: ${({ $background, theme, $variant }) => 
    $background || (getContainerStyles($variant, theme).includes('background:') ? 
      getContainerStyles($variant, theme).match(/background:\s*([^;]+)/)?.[1] || theme.color.surface.primary :
      theme.color.surface.primary)
  };
  border-radius: ${({ $radius, theme }) => $radius || theme.radius.md};
  box-shadow: ${({ $shadow, theme, $variant }) => 
    $shadow === 'none' ? 'none' : 
    getShadow($shadow, theme)
  };
  border: ${({ $variant, theme }) => 
    getContainerStyles($variant, theme).includes('border:') ? 
      getContainerStyles($variant, theme).match(/border:\s*([^;]+)/)?.[1] || 'none' :
      'none'
  };
  
  /* 반응형 스타일 적용 */
  ${({ $maxWidth, theme }) => 
    typeof $maxWidth === 'object' && `
      @media (min-width: ${theme.breakpoint.sm}) {
        max-width: ${$maxWidth.sm || $maxWidth.xs || '100%'};
      }
      @media (min-width: ${theme.breakpoint.md}) {
        max-width: ${$maxWidth.md || $maxWidth.sm || $maxWidth.xs || '100%'};
      }
      @media (min-width: ${theme.breakpoint.lg}) {
        max-width: ${$maxWidth.lg || $maxWidth.md || $maxWidth.sm || $maxWidth.xs || '100%'};
      }
      @media (min-width: ${theme.breakpoint.xl}) {
        max-width: ${$maxWidth.xl || $maxWidth.lg || $maxWidth.md || $maxWidth.sm || $maxWidth.xs || '100%'};
      }
    `
  }
  
  ${({ $padding, theme }) => 
    typeof $padding === 'object' && `
      @media (min-width: ${theme.breakpoint.sm}) {
        padding: ${$padding.sm || $padding.xs || theme.spacing[4]};
      }
      @media (min-width: ${theme.breakpoint.md}) {
        padding: ${$padding.md || $padding.sm || $padding.xs || theme.spacing[4]};
      }
      @media (min-width: ${theme.breakpoint.lg}) {
        padding: ${$padding.lg || $padding.md || $padding.sm || $padding.xs || theme.spacing[4]};
      }
      @media (min-width: ${theme.breakpoint.xl}) {
        padding: ${$padding.xl || $padding.lg || $padding.md || $padding.sm || $padding.xs || theme.spacing[4]};
      }
    `
  }
  
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.out};
  
  &:hover {
    ${({ $variant, theme }) => 
      $variant === 'elevated' && `
        box-shadow: ${theme.shadow.xl};
        transform: translateY(-2px);
      `
    }
  }
`;

const Container: React.FC<ContainerProps> = ({ 
  children, 
  maxWidth = '1200px',
  padding = '1.5rem',
  background,
  radius,
  shadow = 'sm',
  variant = 'default',
  style, 
  className 
}) => (
  <StyledContainer
    $maxWidth={maxWidth}
    $padding={padding}
    $background={background}
    $radius={radius}
    $shadow={shadow}
    $variant={variant}
    style={style}
    className={className}
  >
    {children}
  </StyledContainer>
);

export default Container; 