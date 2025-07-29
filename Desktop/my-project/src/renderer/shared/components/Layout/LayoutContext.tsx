import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutState {
  isNavigationCollapsed: boolean;
  isHeaderVisible: boolean;
  currentSection: string;
}

interface LayoutContextType {
  layoutState: LayoutState;
  toggleNavigation: () => void;
  setCurrentSection: (section: string) => void;
  hideHeader: () => void;
  showHeader: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [layoutState, setLayoutState] = useState<LayoutState>({
    isNavigationCollapsed: false,
    isHeaderVisible: true,
    currentSection: 'dashboard'
  });

  const toggleNavigation = () => {
    setLayoutState(prev => ({
      ...prev,
      isNavigationCollapsed: !prev.isNavigationCollapsed
    }));
  };

  const setCurrentSection = (section: string) => {
    setLayoutState(prev => ({
      ...prev,
      currentSection: section
    }));
  };

  const hideHeader = () => {
    setLayoutState(prev => ({
      ...prev,
      isHeaderVisible: false
    }));
  };

  const showHeader = () => {
    setLayoutState(prev => ({
      ...prev,
      isHeaderVisible: true
    }));
  };

  const value: LayoutContextType = {
    layoutState,
    toggleNavigation,
    setCurrentSection,
    hideHeader,
    showHeader
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}; 