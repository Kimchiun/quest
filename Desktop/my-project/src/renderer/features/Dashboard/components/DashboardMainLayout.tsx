import React, { useState } from 'react';
import Layout from '../../../shared/components/Layout';
import Sidebar from '../../../shared/components/Sidebar';
import Header from '../../../shared/components/Header';
import WidgetContainer from '../../../shared/components/WidgetContainer';

// TODO: 실제 데이터/상태 연동
const dummyReleases = [
  { id: 1, name: 'Sprint 1' },
  { id: 2, name: 'Sprint 2' },
  { id: 3, name: 'Sprint 3' },
];
const dummyWidgets = [
  <div key="progress">진행률 위젯</div>,
  <div key="pass">통과율 위젯</div>,
  <div key="defect">결함 위젯</div>,
  <div key="custom">커스텀 위젯</div>,
];

const DashboardMainLayout: React.FC = () => {
  const [selectedRelease, setSelectedRelease] = useState<number>(dummyReleases[0].id);
  // 위젯 배치 상태 localStorage 저장/복원
  const initialWidgets = () => {
    const saved = localStorage.getItem('dashboardWidgetOrder');
    if (saved) {
      const order = JSON.parse(saved) as number[];
      return order.map(i => dummyWidgets[i]).filter(Boolean);
    }
    return dummyWidgets;
  };
  const [widgets, setWidgets] = useState<React.ReactNode[]>(initialWidgets);

  const handleReorder = (newWidgets: React.ReactNode[]) => {
    setWidgets(newWidgets);
    // 저장: 현재 순서를 dummyWidgets의 인덱스 기준으로 저장
    const order = newWidgets.map(w => dummyWidgets.findIndex(dw => dw === w));
    localStorage.setItem('dashboardWidgetOrder', JSON.stringify(order));
  };

  const handleSelectRelease = (id: number) => setSelectedRelease(id);
  const handleNavigate = (route: string) => {
    window.location.hash = '#' + route;
  };

  return (
    <Layout
      sidebar={
        <Sidebar
          releases={dummyReleases}
          selectedReleaseId={selectedRelease}
          onSelectRelease={handleSelectRelease}
          onNavigate={handleNavigate}
        />
      }
      header={
        <Header left={<span>릴리즈: {dummyReleases.find(r => r.id === selectedRelease)?.name}</span>} right={<span>사용자</span>} />
      }
    >
      <WidgetContainer widgets={widgets} columns={4} gap="24px" onReorder={handleReorder} />
      {/* TODO: 차트/세부 위젯 등 추가 */}
    </Layout>
  );
};

export default DashboardMainLayout; 