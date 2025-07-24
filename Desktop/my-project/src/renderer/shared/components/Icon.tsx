ㅈimport React from 'react';
import styled from 'styled-components';
import { Theme } from '../theme';

export type IconName = 'plus' | 'check' | 'close' | 'logo' | 'symbol';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  color?: string;
}

const iconPaths: Record<IconName, string> = {
  plus: 'M12 5v14m7-7H5',
  check: 'M5 13l4 4L19 7',
  close: 'M6 6l12 12M6 18L18 6',
  logo: 'M20 2 a18 18 0 1 0 0.00001 0 Z', // 원 (로고 외곽)
  symbol: 'M20 2 a18 18 0 1 0 0.00001 0 Z M28 28 L20 20', // 원+꼬리
};

const StyledSvg = styled.svg<{ $size: number; $color: string }>`
  display: inline-block;
  vertical-align: middle;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  stroke: ${({ $color }) => $color};
`;

const Icon: React.FC<IconProps> = ({ name, size = 20, color, ...rest }) => {
  // theme은 styled-components ThemeProvider에서 자동 주입됨
  return (
    <StyledSvg
      $size={size}
      $color={color || 'currentColor'}
      viewBox="0 0 40 40"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {name === 'logo' && (
        <>
          <circle cx="20" cy="20" r="18" stroke="#2563eb" strokeWidth="4" fill="#fff" />
          <text x="50%" y="54%" textAnchor="middle" fill="#2563eb" fontSize="20" fontFamily="Inter, Arial, sans-serif" fontWeight="bold" dy=".3em">Q</text>
        </>
      )}
      {name === 'symbol' && (
        <>
          <circle cx="20" cy="20" r="18" stroke="#2563eb" strokeWidth="4" fill="#fff" />
          <path d="M28 28 L20 20" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {['plus','check','close'].includes(name) && <path d={iconPaths[name]} />}
    </StyledSvg>
  );
};

export default Icon; 