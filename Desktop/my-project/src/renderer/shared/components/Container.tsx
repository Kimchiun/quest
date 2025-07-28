import React from 'react';
import styled from 'styled-components';

interface ContainerProps {
  children: React.ReactNode;
  $maxWidth?: string;
  $padding?: string;
  $background?: string;
  $radius?: string;
  style?: React.CSSProperties;
}

const StyledContainer = styled.div<ContainerProps>`
  margin: 0 auto;
  max-width: ${({ $maxWidth }) => $maxWidth || '960px'};
  padding: ${({ $padding, theme }) => $padding || theme.spacing.lg};
  background: ${({ $background, theme }) => $background || theme.color.surface};
  border-radius: ${({ $radius, theme }) => $radius || theme.radius.md};
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

const Container: React.FC<ContainerProps> = ({ children, ...rest }) => (
  <StyledContainer {...rest}>{children}</StyledContainer>
);

export default Container; 