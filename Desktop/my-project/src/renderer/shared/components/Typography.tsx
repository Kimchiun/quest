import React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from '../theme';

export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption';

interface TypographyProps {
  children: React.ReactNode;
  variant?: TypographyVariant;
  color?: string;
  weight?: number;
  align?: 'left' | 'center' | 'right';
  style?: React.CSSProperties;
}

const variantStyle = (variant: TypographyVariant, theme: Theme) => {
  switch (variant) {
    case 'h1':
      return css`
        font-size: 2.25rem;
        font-weight: ${theme.font.weightBold};
        margin-bottom: ${theme.spacing.lg};
      `;
    case 'h2':
      return css`
        font-size: 1.75rem;
        font-weight: ${theme.font.weightBold};
        margin-bottom: ${theme.spacing.md};
      `;
    case 'h3':
      return css`
        font-size: 1.5rem;
        font-weight: ${theme.font.weightBold};
        margin-bottom: ${theme.spacing.md};
      `;
    case 'h4':
      return css`
        font-size: 1.25rem;
        font-weight: ${theme.font.weightBold};
        margin-bottom: ${theme.spacing.sm};
      `;
    case 'h5':
      return css`
        font-size: 1.125rem;
        font-weight: ${theme.font.weightBold};
        margin-bottom: ${theme.spacing.sm};
      `;
    case 'h6':
      return css`
        font-size: 1rem;
        font-weight: ${theme.font.weightBold};
        margin-bottom: ${theme.spacing.xs};
      `;
    case 'caption':
      return css`
        font-size: 0.875rem;
        color: ${theme.color.textSecondary};
      `;
    case 'body':
    default:
      return css`
        font-size: ${theme.font.sizeBase};
        font-weight: ${theme.font.weightRegular};
      `;
  }
};

const StyledTypography = styled.span<TypographyProps & { theme: Theme }>`
  font-family: ${({ theme }) => theme.font.family};
  color: ${({ color, theme }) => color || theme.color.text};
  text-align: ${({ align }) => align || 'left'};
  ${({ variant = 'body', theme }) => variantStyle(variant, theme)}
  font-weight: ${({ weight, theme }) => weight || undefined};
`;

const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body',
  color,
  weight,
  align,
  style,
}) => {
  return (
    <StyledTypography
      as={variant.startsWith('h') ? variant : 'span'}
      variant={variant}
      color={color}
      weight={weight}
      align={align}
      style={style}
    >
      {children}
    </StyledTypography>
  );
};

export default Typography; 