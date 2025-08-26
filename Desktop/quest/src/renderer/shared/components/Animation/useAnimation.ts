import { useState, useEffect, useCallback } from 'react';

interface AnimationState {
  isEntering: boolean;
  isExiting: boolean;
  isVisible: boolean;
}

interface UseAnimationOptions {
  duration?: number;
  delay?: number;
  onEnter?: () => void;
  onExit?: () => void;
  onComplete?: () => void;
}

export const useAnimation = (options: UseAnimationOptions = {}) => {
  const {
    duration = 300,
    delay = 0,
    onEnter,
    onExit,
    onComplete
  } = options;

  const [state, setState] = useState<AnimationState>({
    isEntering: false,
    isExiting: false,
    isVisible: false
  });

  const enter = useCallback(() => {
    setState(prev => ({ ...prev, isEntering: true, isVisible: true }));
    onEnter?.();
    
    setTimeout(() => {
      setState(prev => ({ ...prev, isEntering: false }));
    }, duration);
  }, [duration, onEnter]);

  const exit = useCallback(() => {
    setState(prev => ({ ...prev, isExiting: true }));
    onExit?.();
    
    setTimeout(() => {
      setState(prev => ({ ...prev, isExiting: false, isVisible: false }));
      onComplete?.();
    }, duration);
  }, [duration, onExit, onComplete]);

  const toggle = useCallback(() => {
    if (state.isVisible) {
      exit();
    } else {
      enter();
    }
  }, [state.isVisible, enter, exit]);

  return {
    state,
    enter,
    exit,
    toggle,
    isVisible: state.isVisible,
    isAnimating: state.isEntering || state.isExiting
  };
};

// 페이지 전환 애니메이션 훅
export const usePageTransition = () => {
  const [currentPage, setCurrentPage] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigateTo = useCallback((page: string) => {
    if (currentPage === page) return;
    
    setIsTransitioning(true);
    
    // 페이지 전환 애니메이션
    setTimeout(() => {
      setCurrentPage(page);
      setIsTransitioning(false);
    }, 300);
  }, [currentPage]);

  return {
    currentPage,
    isTransitioning,
    navigateTo
  };
};

// 로딩 상태 애니메이션 훅
export const useLoadingAnimation = (isLoading: boolean) => {
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShowSkeleton(true);
    } else {
      // 로딩 완료 후 스켈레톤을 잠시 더 보여줌
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return showSkeleton;
};

// 스크롤 기반 애니메이션 훅
export const useScrollAnimation = (threshold: number = 0.1) => {
  const [isInView, setIsInView] = useState(false);
  const [elementRef, setElementRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!elementRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(elementRef);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, threshold]);

  return {
    isInView,
    ref: setElementRef
  };
}; 