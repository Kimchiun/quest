import React from 'react';
import styled from 'styled-components';

interface ProgressData {
  completed: number;
  total: number;
  label: string;
  color?: string;
}

interface ProgressWidgetProps {
  data: ProgressData;
  variant?: 'circular' | 'bar';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  showPercentage?: boolean;
  showCount?: boolean;
}

const WidgetContainer = styled.div<{ 
  size: 'small' | 'medium' | 'large';
  clickable: boolean;
}>`
  background: white;
  border-radius: 12px;
  padding: ${props => {
    switch (props.size) {
      case 'small': return '16px';
      case 'large': return '32px';
      default: return '24px';
    }
  }};
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  
  &:hover {
    ${props => props.clickable && `
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    `}
  }
`;

const WidgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const WidgetTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const ProgressContainer = styled.div<{ variant: 'circular' | 'bar' }>`
  display: flex;
  align-items: center;
  gap: ${props => props.variant === 'circular' ? '16px' : '12px'};
  
  ${props => props.variant === 'bar' && `
    flex-direction: column;
    align-items: stretch;
  `}
`;

// 원형 진행률
const CircularProgress = styled.div<{ 
  percentage: number;
  size: 'small' | 'medium' | 'large';
  color: string;
}>`
  position: relative;
  width: ${props => {
    switch (props.size) {
      case 'small': return '60px';
      case 'large': return '100px';
      default: return '80px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'small': return '60px';
      case 'large': return '100px';
      default: return '80px';
    }
  }};
  
  svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }
  
  circle {
    fill: none;
    stroke-width: 6;
    stroke-linecap: round;
  }
  
  .background {
    stroke: #e2e8f0;
  }
  
  .progress {
    stroke: ${props => props.color};
    stroke-dasharray: 251.2;
    stroke-dashoffset: ${props => 251.2 - (251.2 * props.percentage) / 100};
    transition: stroke-dashoffset 0.5s ease;
  }
`;

const CircularProgressText = styled.div<{ size: 'small' | 'medium' | 'large' }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-weight: 600;
  color: #1e293b;
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '14px';
      case 'large': return '20px';
      default: return '16px';
    }
  }};
`;

// 막대 진행률
const BarProgress = styled.div<{ size: 'small' | 'medium' | 'large' }>`
  width: 100%;
  height: ${props => {
    switch (props.size) {
      case 'small': return '8px';
      case 'large': return '16px';
      default: return '12px';
    }
  }};
  background: #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
`;

const BarProgressFill = styled.div<{ 
  percentage: number;
  color: string;
}>`
  height: 100%;
  width: ${props => props.percentage}%;
  background: ${props => props.color};
  border-radius: 6px;
  transition: width 0.5s ease;
`;

const ProgressInfo = styled.div<{ variant: 'circular' | 'bar' }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  ${props => props.variant === 'bar' && `
    margin-top: 8px;
  `}
`;

const ProgressLabel = styled.span`
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
`;

const ProgressCount = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
`;

const ProgressPercentage = styled.span`
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
`;

const ProgressWidget: React.FC<ProgressWidgetProps> = ({
  data,
  variant = 'circular',
  size = 'medium',
  onClick,
  showPercentage = true,
  showCount = true
}) => {
  const percentage = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
  const color = data.color || '#3b82f6';

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <WidgetContainer 
      size={size} 
      clickable={!!onClick}
      onClick={handleClick}
    >
      <WidgetHeader>
        <WidgetTitle>{data.label}</WidgetTitle>
      </WidgetHeader>
      
      <ProgressContainer variant={variant}>
        {variant === 'circular' ? (
          <CircularProgress percentage={percentage} size={size} color={color}>
            <svg viewBox="0 0 100 100">
              <circle 
                className="background" 
                cx="50" 
                cy="50" 
                r="40"
              />
              <circle 
                className="progress" 
                cx="50" 
                cy="50" 
                r="40"
              />
            </svg>
            <CircularProgressText size={size}>
              {showPercentage ? `${percentage}%` : `${data.completed}/${data.total}`}
            </CircularProgressText>
          </CircularProgress>
        ) : (
          <BarProgress size={size}>
            <BarProgressFill percentage={percentage} color={color} />
          </BarProgress>
        )}
        
        <ProgressInfo variant={variant}>
          {showCount && (
            <ProgressCount>
              {data.completed} / {data.total}
            </ProgressCount>
          )}
          {showPercentage && variant === 'bar' && (
            <ProgressPercentage>
              {percentage}% 완료
            </ProgressPercentage>
          )}
          <ProgressLabel>
            {data.label}
          </ProgressLabel>
        </ProgressInfo>
      </ProgressContainer>
    </WidgetContainer>
  );
};

export default ProgressWidget; 