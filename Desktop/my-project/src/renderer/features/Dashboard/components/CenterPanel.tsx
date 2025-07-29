import React from 'react';
import IntegratedItemList from './IntegratedItemList';
import ItemDetailView from './ItemDetailView';

const CenterPanel: React.FC = () => {
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flex: '1', borderRight: '1px solid #e2e8f0' }}>
        <IntegratedItemList />
      </div>
      <div style={{ flex: '1' }}>
        <ItemDetailView />
      </div>
    </div>
  );
};

export default CenterPanel; 