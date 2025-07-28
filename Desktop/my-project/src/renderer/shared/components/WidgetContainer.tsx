import React from 'react';
import Grid from './Grid';

interface WidgetContainerProps {
  children: React.ReactNode;
  $columns?: number;
  $gap?: string;
}

const WidgetContainer: React.FC<WidgetContainerProps> = ({ children, $columns = 3, $gap = '16px' }) => {
  return (
    <div style={{ padding: '16px' }}>
      <Grid
        $columns={$columns}
        $gap={$gap}
      >
        {children}
      </Grid>
    </div>
  );
};

export default WidgetContainer; 