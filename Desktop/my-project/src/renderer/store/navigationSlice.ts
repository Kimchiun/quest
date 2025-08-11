import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NavigationSection = 
  | 'dashboard' 
  | 'test-management-v2' 
  | 'release-management' 
  | 'defect-management' 
  | 'report' 
  | 'settings';

interface NavigationState {
  currentSection: NavigationSection;
  isNavigationCollapsed: boolean;
}

const initialState: NavigationState = {
  currentSection: 'dashboard',
  isNavigationCollapsed: false,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setCurrentSection: (state, action: PayloadAction<NavigationSection>) => {
      state.currentSection = action.payload;
    },
    toggleNavigation: (state) => {
      state.isNavigationCollapsed = !state.isNavigationCollapsed;
    },
    collapseNavigation: (state) => {
      state.isNavigationCollapsed = true;
    },
    expandNavigation: (state) => {
      state.isNavigationCollapsed = false;
    },
  },
});

export const { 
  setCurrentSection, 
  toggleNavigation, 
  collapseNavigation, 
  expandNavigation 
} = navigationSlice.actions;

export default navigationSlice.reducer; 