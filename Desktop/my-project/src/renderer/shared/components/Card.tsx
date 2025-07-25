import React from 'react';
import styled from 'styled-components';

export interface CardProps {
  icon?: React.ReactNode;
  value: string | number;
  label: string;
  color?: string;
  description?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  children?: React.ReactNode;
}

const CardBox = styled.div<{ $color?: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 24px 20px 20px 20px;
  min-width: 180px;
  min-height: 120px;
  position: relative;
  border-left: 6px solid ${({ $color }) => $color || '#2563eb'};
  transition: box-shadow 0.15s;
  &:hover {
    box-shadow: 0 4px 24px rgba(37,99,235,0.12);
  }
`;

const IconBox = styled.div<{ $color?: string }>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $color }) => $color ? $color + '22' : '#2563eb22'};
  border-radius: 50%;
  margin-bottom: 12px;
`;

const Value = styled.div<{ $color?: string }>`
  font-size: 2.1rem;
  font-weight: 700;
  color: ${({ $color }) => $color || '#2563eb'};
  margin-bottom: 4px;
`;

const Label = styled.div`
  font-size: 1.1rem;
  color: #22223b;
  font-weight: 500;
  margin-bottom: 2px;
`;

const Desc = styled.div`
  font-size: 0.95rem;
  color: #6b7280;
  margin-top: 6px;
`;

const Card: React.FC<CardProps> = ({ icon, value, label, color, description, style, ariaLabel, children }) => (
  <CardBox $color={color} style={style} aria-label={ariaLabel || label} role="region">
    {icon && <IconBox $color={color}>{icon}</IconBox>}
    <Value $color={color}>{value}</Value>
    <Label>{label}</Label>
    {description && <Desc>{description}</Desc>}
    {children && <div style={{ marginTop: 16, width: '100%' }}>{children}</div>}
  </CardBox>
);

export default Card; 