import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  breakpoints?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

const defaultBreakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1920
};

const ResponsiveContainer = styled.div<{ 
  isMobile: boolean; 
  isTablet: boolean; 
  isDesktop: boolean;
}>`
  width: 100%;
  height: 100%;
  
  ${props => props.isMobile && `
    padding: 10px;
    font-size: 14px;
  `}
  
  ${props => props.isTablet && `
    padding: 20px;
    font-size: 16px;
  `}
  
  ${props => props.isDesktop && `
    padding: 30px;
    font-size: 18px;
  `}
`;

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ 
  children, 
  breakpoints = defaultBreakpoints 
}) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const [deviceType, setDeviceType] = useState({
    isMobile: window.innerWidth <= breakpoints.mobile,
    isTablet: window.innerWidth > breakpoints.mobile && window.innerWidth <= breakpoints.tablet,
    isDesktop: window.innerWidth > breakpoints.tablet
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({ width, height });
      setDeviceType({
        isMobile: width <= breakpoints.mobile,
        isTablet: width > breakpoints.mobile && width <= breakpoints.tablet,
        isDesktop: width > breakpoints.tablet
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints]);

  return (
    <ResponsiveContainer
      isMobile={deviceType.isMobile}
      isTablet={deviceType.isTablet}
      isDesktop={deviceType.isDesktop}
    >
      {children}
    </ResponsiveContainer>
  );
};

export default ResponsiveLayout; 