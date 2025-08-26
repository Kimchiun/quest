import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

interface PageTransitionProps {
  children: React.ReactNode;
  location?: string;
  timeout?: number;
  classNames?: string;
}

const TransitionContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  
  .page-enter {
    opacity: 0;
    transform: translateX(100%);
  }
  
  .page-enter-active {
    opacity: 1;
    transform: translateX(0%);
    transition: all 300ms ease-in-out;
  }
  
  .page-exit {
    opacity: 1;
    transform: translateX(0%);
  }
  
  .page-exit-active {
    opacity: 0;
    transform: translateX(-100%);
    transition: all 300ms ease-in-out;
  }
  
  .fade-enter {
    opacity: 0;
  }
  
  .fade-enter-active {
    opacity: 1;
    transition: opacity 200ms ease-in-out;
  }
  
  .fade-exit {
    opacity: 1;
  }
  
  .fade-exit-active {
    opacity: 0;
    transition: opacity 200ms ease-in-out;
  }
  
  .slide-up-enter {
    opacity: 0;
    transform: translateY(20px);
  }
  
  .slide-up-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: all 250ms ease-out;
  }
  
  .slide-up-exit {
    opacity: 1;
    transform: translateY(0);
  }
  
  .slide-up-exit-active {
    opacity: 0;
    transform: translateY(-20px);
    transition: all 250ms ease-in;
  }
`;

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  location = 'default',
  timeout = 300,
  classNames = 'page'
}) => {
  return (
    <TransitionContainer>
      <TransitionGroup>
        <CSSTransition
          key={location}
          timeout={timeout}
          classNames={classNames}
          unmountOnExit
        >
          <div style={{ width: '100%', height: '100%' }}>
            {children}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </TransitionContainer>
  );
};

export default PageTransition; 