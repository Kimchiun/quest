import React from 'react';
import styled from 'styled-components';

interface StatsData {
  value: number;
  label: string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: string;
  color?: string;
  format?: 'number' | 'percentage' | 'currency';
}

interface StatsWidgetProps {
  data: StatsData;
  size?: 'small' | 'medium' | 'large';
  variant?: 'card' | 'minimal';
  onClick?: () => void;
}

const WidgetContainer = styled.div<{ 
  size: 'small' | 'medium' | 'large';
  variant: 'card' | 'minimal';
  clickable: boolean;
}>`
  background: ${props => props.variant === 'card' ? 'white' : 'transparent'};
  border-radius: ${props => props.variant === 'card' ? '12px' : '0'};
  padding: ${props => {
    switch (props.size) {
      case 'small': return '16px';
      case 'large': return '32px';
      default: return '24px';
    }
  }};
  border: ${props => props.variant === 'card' ? '1px solid #e2e8f0' : 'none'};
  box-shadow: ${props => props.variant === 'card' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'};
  transition: all 0.2s ease;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  
  &:hover {
    ${props => props.clickable && props.variant === 'card' && `
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    `}
  }
`;

const StatsContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconContainer = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: ${props => props.color};
`;

const StatsInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatsValue = styled.div<{ size: 'small' | 'medium' | 'large' }>`
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '24px';
      case 'large': return '36px';
      default: return '32px';
    }
  }};
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
`;

const StatsLabel = styled.div`
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
`;

const ChangeIndicator = styled.div<{ 
  type: 'increase' | 'decrease' | 'neutral';
  size: 'small' | 'medium' | 'large';
}>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '12px';
      case 'large': return '16px';
      default: return '14px';
    }
  }};
  font-weight: 500;
  color: ${props => {
    switch (props.type) {
      case 'increase': return '#10b981';
      case 'decrease': return '#ef4444';
      default: return '#64748b';
    }
  }};
  
  &::before {
    content: ${props => {
      switch (props.type) {
        case 'increase': return '"↗"';
        case 'decrease': return '"↘"';
        default: return '"→"';
      }
    }};
    font-size: ${props => {
      switch (props.size) {
        case 'small': return '10px';
        case 'large': return '14px';
        default: return '12px';
      }
    }};
  }
`;

const formatValue = (value: number, format: 'number' | 'percentage' | 'currency' = 'number') => {
  switch (format) {
    case 'percentage':
      return `${value}%`;
    case 'currency':
      return `₩${value.toLocaleString()}`;
    default:
      return value.toLocaleString();
  }
};

const StatsWidget: React.FC<StatsWidgetProps> = ({
  data,
  size = 'medium',
  variant = 'card',
  onClick
}) => {
  const color = data.color || '#3b82f6';
  const icon = data.icon || '📊';

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <WidgetContainer 
      size={size} 
      variant={variant}
      clickable={!!onClick}
      onClick={handleClick}
    >
      <StatsContent>
        <IconContainer color={color}>
          {icon}
        </IconContainer>
        
        <StatsInfo>
          <StatsValue size={size}>
            {formatValue(data.value, data.format)}
          </StatsValue>
          <StatsLabel>
            {data.label}
          </StatsLabel>
          {data.change !== undefined && (
            <ChangeIndicator 
              type={data.changeType || 'neutral'} 
              size={size}
            >
              {Math.abs(data.change)}%
            </ChangeIndicator>
          )}
        </StatsInfo>
      </StatsContent>
    </WidgetContainer>
  );
};

export default StatsWidget; 