import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AnimationState {
  isLoading: boolean;
  currentPage: string;
  isTransitioning: boolean;
  showSkeleton: boolean;
  animationSpeed: 'fast' | 'normal' | 'slow';
  enableAnimations: boolean;
}

const initialState: AnimationState = {
  isLoading: false,
  currentPage: '',
  isTransitioning: false,
  showSkeleton: false,
  animationSpeed: 'normal',
  enableAnimations: true
};

const animationSlice = createSlice({
  name: 'animation',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      state.showSkeleton = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    setTransitioning: (state, action: PayloadAction<boolean>) => {
      state.isTransitioning = action.payload;
    },
    setShowSkeleton: (state, action: PayloadAction<boolean>) => {
      state.showSkeleton = action.payload;
    },
    setAnimationSpeed: (state, action: PayloadAction<'fast' | 'normal' | 'slow'>) => {
      state.animationSpeed = action.payload;
    },
    toggleAnimations: (state) => {
      state.enableAnimations = !state.enableAnimations;
    },
    startPageTransition: (state, action: PayloadAction<string>) => {
      state.isTransitioning = true;
      state.currentPage = action.payload;
    },
    completePageTransition: (state) => {
      state.isTransitioning = false;
    }
  }
});

export const {
  setLoading,
  setCurrentPage,
  setTransitioning,
  setShowSkeleton,
  setAnimationSpeed,
  toggleAnimations,
  startPageTransition,
  completePageTransition
} = animationSlice.actions;

export default animationSlice.reducer; 