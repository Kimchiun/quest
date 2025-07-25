import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/renderer/store';
import { fetchDashboardStats } from '../store/dashboardSlice';
import DashboardCharts from './DashboardCharts';
import Container from '../../../shared/components/Container';
import Typography from '../../../shared/components/Typography';
import Grid from '../../../shared/components/Grid';
import Card, { type CardProps } from '../../../shared/components/Card';
import { FaCheckCircle, FaListAlt, FaBug, FaChartPie } from 'react-icons/fa';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const CARD_TYPE = 'dashboard-card';

const DraggableCard = ({ id, index, moveCard, ...props }: any) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: CARD_TYPE,
    hover(item: any) {
      if (!ref.current) return;
      if (item.index === index) return;
      moveCard(item.index, index);
      item.index = index;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: CARD_TYPE,
    item: { id, index },
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  });
  drag(drop(ref));
  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}>
      <Card {...props} />
    </div>
  );
};

const defaultOrder = ['progress', 'total', 'defect', 'density'];

const DashboardContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const stats = useSelector((state: RootState) => state.dashboard.stats);
  const loading = useSelector((state: RootState) => state.dashboard.loading);
  const error = useSelector((state: RootState) => state.dashboard.error);

  const [cardOrder, setCardOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem('dashboardCardOrder');
    return saved ? JSON.parse(saved) : defaultOrder;
  });

  // 실시간 fetch, 데이터 변경 시만 리렌더
  useEffect(() => {
    let prevStats: any = null;
    const fetchAndUpdate = async () => {
      await dispatch(fetchDashboardStats());
    };
    fetchAndUpdate();
    const interval = setInterval(async () => {
      await fetchAndUpdate();
    }, 5000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const moveCard = useCallback((from: number, to: number) => {
    setCardOrder(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      localStorage.setItem('dashboardCardOrder', JSON.stringify(arr));
      return arr;
    });
  }, []);

  // 카드 데이터 useMemo로 메모이제이션
  const cardData: Partial<Record<string, CardProps>> = useMemo(() => stats ? {
    progress: {
      icon: <FaCheckCircle size={28} color="#15803d" />,
      value: Math.round(stats.progressRate * 100) + '%',
      label: '진행률',
      color: '#15803d',
      description: '전체 테스트 완료 비율',
    },
    total: {
      icon: <FaListAlt size={28} color="#2563eb" />,
      value: stats.totalCases,
      label: '전체 케이스',
      color: '#2563eb',
      description: '등록된 테스트케이스 수',
    },
    defect: {
      icon: <FaBug size={28} color="#ef4444" />,
      value: stats.defectCount,
      label: '결함 수',
      color: '#ef4444',
      description: '누적 결함(버그) 건수',
    },
    density: {
      icon: <FaChartPie size={28} color="#f59e42" />,
      value: (stats.defectDensity * 100).toFixed(2) + '%',
      label: '결함 밀도',
      color: '#f59e42',
      description: '케이스당 결함 비율',
    },
  } : {}, [stats]);

  return (
    <Container maxWidth="1200px" padding="32px" background="#fff" radius="md" style={{ margin: '32px auto' }}>
      <Typography variant="h2" style={{ marginBottom: 24 }}>대시보드</Typography>
      <DndProvider backend={HTML5Backend}>
        {stats && (
          <Grid columns={4} gap="24px" style={{ marginBottom: 32 }}>
            {cardOrder.map((key, idx) => (
              <DraggableCard
                key={key}
                id={key}
                index={idx}
                moveCard={moveCard}
                {...cardData[key]}
              />
            ))}
          </Grid>
        )}
      </DndProvider>
      <Grid columns={1} gap="32px">
        {loading && <Typography variant="body">로딩 중...</Typography>}
        {error && <Typography variant="body" color="red">{error}</Typography>}
        {stats && <DashboardCharts stats={stats} />}
      </Grid>
    </Container>
  );
};

export default DashboardContainer; 