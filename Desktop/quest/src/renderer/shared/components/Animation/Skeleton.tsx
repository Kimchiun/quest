import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const SkeletonBase = styled.div<{ width?: string; height?: string; borderRadius?: string }>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '20px'};
  border-radius: ${props => props.borderRadius || '4px'};
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
`;

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
`;

const SkeletonRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius,
  className
}) => {
  return (
    <SkeletonBase
      width={width}
      height={height}
      borderRadius={borderRadius}
      className={className}
    />
  );
};

// 테이블 스켈레톤
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4
}) => {
  return (
    <SkeletonContainer>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <SkeletonRow key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              width={colIndex === 0 ? '60px' : colIndex === 1 ? '200px' : '120px'}
              height="16px"
            />
          ))}
        </SkeletonRow>
      ))}
    </SkeletonContainer>
  );
};

// 카드 스켈레톤
export const CardSkeleton: React.FC = () => {
  return (
    <SkeletonContainer>
      <Skeleton width="60%" height="24px" />
      <Skeleton width="100%" height="16px" />
      <Skeleton width="80%" height="16px" />
      <Skeleton width="40%" height="16px" />
    </SkeletonContainer>
  );
};

// 리스트 스켈레톤
export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 3 }) => {
  return (
    <SkeletonContainer>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Skeleton width="40px" height="40px" borderRadius="50%" />
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '8px' }}>
              <Skeleton width="70%" height="16px" />
            </div>
            <Skeleton width="50%" height="14px" />
          </div>
        </div>
      ))}
    </SkeletonContainer>
  );
};

export default Skeleton; 