export { default as PageTransition } from './PageTransition';
export { default as Skeleton, TableSkeleton, CardSkeleton, ListSkeleton } from './Skeleton';
export { 
  useAnimation, 
  usePageTransition, 
  useLoadingAnimation, 
  useScrollAnimation 
} from './useAnimation';

// 애니메이션 타입들
export interface AnimationState {
  isEntering: boolean;
  isExiting: boolean;
  isVisible: boolean;
}

export interface UseAnimationOptions {
  duration?: number;
  delay?: number;
  onEnter?: () => void;
  onExit?: () => void;
  onComplete?: () => void;
} 