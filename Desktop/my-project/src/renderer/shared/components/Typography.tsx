import React from 'react';
import styled from 'styled-components';

export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'button';

interface TypographyProps {
  $variant?: TypographyVariant;
  children: React.ReactNode;
  style?: React.CSSProperties;
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: number;
}

const StyledTypography = styled.div<TypographyProps>`
  margin: 0;
  padding: 0;
  color: ${({ color }) => color || 'inherit'};
  text-align: ${({ align }) => align || 'left'};
  font-weight: ${({ weight }) => weight || 'inherit'};
  
  ${({ $variant }) => {
    switch ($variant) {
      case 'h1':
        return `
          font-size: 32px;
          font-weight: 700;
          line-height: 1.2;
          color: #1e293b;
        `;
      case 'h2':
        return `
          font-size: 28px;
          font-weight: 600;
          line-height: 1.3;
          color: #1e293b;
        `;
      case 'h3':
        return `
          font-size: 24px;
          font-weight: 600;
          line-height: 1.4;
          color: #1e293b;
        `;
      case 'h4':
        return `
          font-size: 20px;
          font-weight: 600;
          line-height: 1.4;
          color: #1e293b;
        `;
      case 'h5':
        return `
          font-size: 18px;
          font-weight: 600;
          line-height: 1.4;
          color: #1e293b;
        `;
      case 'h6':
        return `
          font-size: 16px;
          font-weight: 600;
          line-height: 1.4;
          color: #1e293b;
        `;
      case 'body':
        return `
          font-size: 16px;
          font-weight: 400;
          line-height: 1.5;
          color: #374151;
        `;
      case 'caption':
        return `
          font-size: 14px;
          font-weight: 400;
          line-height: 1.4;
          color: #6b7280;
        `;
      case 'button':
        return `
          font-size: 14px;
          font-weight: 500;
          line-height: 1.4;
          color: #374151;
        `;
      default:
        return `
          font-size: 16px;
          font-weight: 400;
          line-height: 1.5;
          color: #374151;
        `;
    }
  }}
`;

const Typography: React.FC<TypographyProps> = ({ $variant = 'body', children, style, ...props }) => {
  return (
    <StyledTypography $variant={$variant} style={style} {...props}>
      {children}
    </StyledTypography>
  );
};

export default Typography; 