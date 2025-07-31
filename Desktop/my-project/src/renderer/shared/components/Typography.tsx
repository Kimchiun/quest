import React from 'react';
import styled from 'styled-components';

export type TypographyVariant = 
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' 
  | 'body' | 'body2' | 'caption' | 'button' | 'overline'
  | 'display1' | 'display2' | 'display3' | 'display4';

export type TypographyColor = 
  | 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'inverse'
  | 'success' | 'warning' | 'danger' | 'inherit';

export type TypographyWeight = 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';

export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

export interface TypographyProps {
  variant?: TypographyVariant;
  color?: TypographyColor;
  weight?: TypographyWeight;
  align?: TypographyAlign;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  truncate?: boolean;
  noWrap?: boolean;
}

const getTypographyStyles = (variant: TypographyVariant, theme: any) => {
  switch (variant) {
    case 'display1':
      return `
        font-family: ${theme.font.family.primary};
        font-size: ${theme.font.size['6xl']};
        font-weight: ${theme.font.weight.bold};
        line-height: ${theme.font.lineHeight.tight};
        letter-spacing: ${theme.font.letterSpacing.tight};
        color: ${theme.color.text.primary};
      `;
    case 'display2':
      return `
        font-family: ${theme.font.family.primary};
        font-size: ${theme.font.size['5xl']};
        font-weight: ${theme.font.weight.bold};
        line-height: ${theme.font.lineHeight.tight};
        letter-spacing: ${theme.font.letterSpacing.tight};
        color: ${theme.color.text.primary};
      `;
    case 'display3':
      return `
        font-family: ${theme.font.family.primary};
        font-size: ${theme.font.size['4xl']};
        font-weight: ${theme.font.weight.semibold};
        line-height: ${theme.font.lineHeight.tight};
        letter-spacing: ${theme.font.letterSpacing.normal};
        color: ${theme.color.text.primary};
      `;
    case 'display4':
      return `
        font-family: ${theme.font.family.primary};
        font-size: ${theme.font.size['3xl']};
        font-weight: ${theme.font.weight.semibold};
        line-height: ${theme.font.lineHeight.tight};
        letter-spacing: ${theme.font.letterSpacing.normal};
        color: ${theme.color.text.primary};
      `;
    case 'h1':
      return `
        font-family: ${theme.font.family.primary};
        font-size: ${theme.font.size['2xl']};
        font-weight: ${theme.font.weight.bold};
        line-height: ${theme.font.lineHeight.tight};
        letter-spacing: ${theme.font.letterSpacing.normal};
        color: ${theme.color.text.primary};
      `;
    case 'h2':
      return `
        font-family: ${theme.font.family.primary};
        font-size: ${theme.font.size.xl};
        font-weight: ${theme.font.weight.semibold};
        line-height: ${theme.font.lineHeight.tight};
        letter-spacing: ${theme.font.letterSpacing.normal};
        color: ${theme.color.text.primary};
      `;
    case 'h3':
      return `
        font-family: ${theme.font.family.primary};
        font-size: ${theme.font.size.lg};
        font-weight: ${theme.font.weight.semibold};
        line-height: ${theme.font.lineHeight.normal};
        letter-spacing: ${theme.font.letterSpacing.normal};
        color: ${theme.color.text.primary};
      `;
    case 'h4':
      return `
        font-family: ${theme.font.family.primary};
        font-size: ${theme.font.size.base};
        font-weight: ${theme.font.weight.medium};
        line-height: ${theme.font.lineHeight.normal};
        letter-spacing: ${theme.font.letterSpacing.normal};
        color: ${theme.color.text.primary};
      `;
    case 'h5':
      return `
        font-family: ${theme.font.family.primary};
        font-size: ${theme.font.size.sm};
        font-weight: ${theme.font.weight.medium};
        line-height: ${theme.font.lineHeight.normal};
        letter-spacing: ${theme.font.letterSpacing.normal};
        color: ${theme.color.text.primary};
      `;
    case 'h6':
      return `
        font-family: ${theme.font.family.primary};
        font-size: ${theme.font.size.xs};
        font-weight: ${theme.font.weight.medium};
        line-height: ${theme.font.lineHeight.normal};
        letter-spacing: ${theme.font.letterSpacing.wide};
        color: ${theme.color.text.primary};
      `;
    case 'body':
      return `
        font-family: ${theme.font.family.primary};
        font-size: ${theme.font.size.base};
        font-weight: ${theme.font.weight.normal};
        line-height: ${theme.font.lineHeight.normal};
        letter-spacing: ${theme.font.letterSpacing.normal};
        color: ${theme.color.text.primary};
      `;
    case 'body2':
      return `
        font-family: ${theme.font.family.primary};
        font-size: ${theme.font.size.sm};
        font-weight: ${theme.font.weight.normal};
        line-height: ${theme.font.lineHeight.normal};
        letter-spacing: ${theme.font.letterSpacing.normal};
        color: ${theme.color.text.secondary};
      `;
    case 'caption':
      return `
        font-family: ${theme.font.family.primary};
        font-size: ${theme.font.size.xs};
        font-weight: ${theme.font.weight.normal};
        line-height: ${theme.font.lineHeight.normal};
        letter-spacing: ${theme.font.letterSpacing.wide};
        color: ${theme.color.text.tertiary};
      `;
    case 'button':
      return `
        font-family: ${theme.font.family.primary};
        font-size: ${theme.font.size.sm};
        font-weight: ${theme.font.weight.medium};
        line-height: ${theme.font.lineHeight.normal};
        letter-spacing: ${theme.font.letterSpacing.wide};
        color: ${theme.color.text.primary};
        text-transform: uppercase;
      `;
    case 'overline':
      return `
        font-family: ${theme.font.family.primary};
        font-size: ${theme.font.size.xs};
        font-weight: ${theme.font.weight.medium};
        line-height: ${theme.font.lineHeight.normal};
        letter-spacing: ${theme.font.letterSpacing.widest};
        color: ${theme.color.text.secondary};
        text-transform: uppercase;
      `;
    default:
      return `
        font-family: ${theme.font.family.primary};
        font-size: ${theme.font.size.base};
        font-weight: ${theme.font.weight.normal};
        line-height: ${theme.font.lineHeight.normal};
        letter-spacing: ${theme.font.letterSpacing.normal};
        color: ${theme.color.text.primary};
      `;
  }
};

const getTypographyColor = (color: TypographyColor, theme: any) => {
  switch (color) {
    case 'primary':
      return theme.color.text.primary;
    case 'secondary':
      return theme.color.text.secondary;
    case 'tertiary':
      return theme.color.text.tertiary;
    case 'disabled':
      return theme.color.text.disabled;
    case 'inverse':
      return theme.color.text.inverse;
    case 'success':
      return theme.color.success[600];
    case 'warning':
      return theme.color.warning[600];
    case 'danger':
      return theme.color.danger[600];
    case 'inherit':
    default:
      return 'inherit';
  }
};

const getTypographyWeight = (weight: TypographyWeight, theme: any) => {
  return theme.font.weight[weight] || theme.font.weight.normal;
};

const StyledTypography = styled.div<{
  $variant: TypographyVariant;
  $color: TypographyColor;
  $weight: TypographyWeight;
  $align: TypographyAlign;
  $truncate: boolean;
  $noWrap: boolean;
}>`
  margin: 0;
  padding: 0;
  ${({ theme, $variant }) => getTypographyStyles($variant, theme)}
  color: ${({ theme, $color }) => getTypographyColor($color, theme)};
  font-weight: ${({ theme, $weight }) => getTypographyWeight($weight, theme)};
  text-align: ${({ $align }) => $align};
  
  ${({ $truncate }) => $truncate && `
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `}
  
  ${({ $noWrap }) => $noWrap && `
    white-space: nowrap;
  `}
`;

const Typography: React.FC<TypographyProps> = ({ 
  variant = 'body', 
  color = 'primary',
  weight = 'normal',
  align = 'left',
  children, 
  style, 
  className,
  as,
  truncate = false,
  noWrap = false
}) => {
  return (
    <StyledTypography 
      as={as}
      $variant={variant}
      $color={color}
      $weight={weight}
      $align={align}
      $truncate={truncate}
      $noWrap={noWrap}
      style={style} 
      className={className}
    >
      {children}
    </StyledTypography>
  );
};

export default Typography; 