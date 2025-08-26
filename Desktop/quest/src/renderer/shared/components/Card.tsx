import React from 'react';
import styled from 'styled-components';
import { Theme } from '../theme';

export interface CardProps {
  icon?: React.ReactNode;
  value: string | number;
  label: string;
  color?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'outlined';
  style?: React.CSSProperties;
  ariaLabel?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onMouseDown?: () => void;
}

const getCardPadding = (size: string, theme: Theme) => {
  switch (size) {
    case 'sm':
      return theme.component.card.padding.sm;
    case 'lg':
      return theme.component.card.padding.lg;
    default:
      return theme.component.card.padding.md;
  }
};

const getCardShadow = (variant: string, theme: Theme) => {
  switch (variant) {
    case 'elevated':
      return theme.shadow.lg;
    case 'outlined':
      return 'none';
    default:
      return theme.shadow.base;
  }
};

const getCardBorder = (variant: string, theme: Theme) => {
  switch (variant) {
    case 'outlined':
      return `1px solid ${theme.color.border.primary}`;
    default:
      return 'none';
  }
};

const CardContainer = styled.div<{ 
  $color?: string; 
  $size: string;
  $variant: string;
}>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background: ${({ theme }) => theme.color.surface.primary};
  border-radius: ${({ theme }) => theme.component.card.borderRadius};
  box-shadow: ${({ theme, $variant }) => getCardShadow($variant, theme)};
  padding: ${({ theme, $size }) => getCardPadding($size, theme)};
  min-width: 180px;
  min-height: 120px;
  position: relative;
  border: ${({ theme, $variant }) => getCardBorder($variant, theme)};
  border-left: ${({ $color, theme }) => 
    $color ? `4px solid ${$color}` : `4px solid ${theme.color.primary[500]}`
  };
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.out};
  
  &:hover {
    box-shadow: ${({ theme, $variant }) => 
      $variant === 'outlined' ? theme.shadow.md : theme.shadow.lg
    };
    transform: ${({ $variant }) => 
      $variant === 'outlined' ? 'none' : 'translateY(-2px)'
    };
  }
  
  &:focus-within {
    outline: 2px solid ${({ theme }) => theme.color.focus.outline};
    outline-offset: 2px;
  }
`;

const IconContainer = styled.div<{ $color?: string }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme, $color }) => 
    $color ? `${$color}15` : `${theme.color.primary[500]}15`
  };
  border-radius: ${({ theme }) => theme.radius.full};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme, $color }) => 
    $color || theme.color.primary[500]
  };
  font-size: ${({ theme }) => theme.font.size.lg};
`;

const Value = styled.div<{ $color?: string }>`
  font-family: ${({ theme }) => theme.font.family.primary};
  font-size: ${({ theme }) => theme.font.size['3xl']};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme, $color }) => 
    $color || theme.color.primary[500]
  };
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  line-height: ${({ theme }) => theme.font.lineHeight.tight};
`;

const Label = styled.div`
  font-family: ${({ theme }) => theme.font.family.primary};
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.color.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  line-height: ${({ theme }) => theme.font.lineHeight.tight};
`;

const Description = styled.div`
  font-family: ${({ theme }) => theme.font.family.primary};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.normal};
  color: ${({ theme }) => theme.color.text.secondary};
  margin-top: ${({ theme }) => theme.spacing[2]};
  line-height: ${({ theme }) => theme.font.lineHeight.normal};
`;

const CardContent = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
  width: 100%;
`;

const Card: React.FC<CardProps> = ({ 
  icon, 
  value, 
  label, 
  color, 
  description, 
  size = 'md',
  variant = 'default',
  style, 
  ariaLabel, 
  children,
  className,
  onClick,
  onMouseDown
}) => (
  <CardContainer 
    $color={color} 
    $size={size}
    $variant={variant}
    style={style} 
    aria-label={ariaLabel || label} 
    role="region"
    className={className}
    onClick={onClick}
    onMouseDown={onMouseDown}
  >
    {icon && <IconContainer $color={color}>{icon}</IconContainer>}
    <Value $color={color}>{value}</Value>
    <Label>{label}</Label>
    {description && <Description>{description}</Description>}
    {children && <CardContent>{children}</CardContent>}
  </CardContainer>
);

export default Card; 