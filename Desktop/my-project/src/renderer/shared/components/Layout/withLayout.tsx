import React from 'react';
import GlobalLayout from './GlobalLayout';
import ResponsiveLayout from './ResponsiveLayout';
import { LayoutProvider } from './LayoutContext';

interface WithLayoutProps {
  title?: string;
  showNavigation?: boolean;
  showHeader?: boolean;
}

export const withLayout = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  layoutProps: WithLayoutProps = {}
) => {
  const WithLayoutComponent: React.FC<P> = (props) => {
    return (
      <LayoutProvider>
        <GlobalLayout>
          <ResponsiveLayout>
            <WrappedComponent {...props} />
          </ResponsiveLayout>
        </GlobalLayout>
      </LayoutProvider>
    );
  };

  WithLayoutComponent.displayName = `withLayout(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithLayoutComponent;
};

export default withLayout; 