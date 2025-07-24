import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/renderer/store';
import { fetchReleases, fetchSuites } from '../store/releaseSlice';
import { fetchTestCases } from '@/renderer/features/TestCaseManagement/store/testCaseSlice';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';

const ItemTypes = { TESTCASE: 'testcase' };

const TestCaseCard: React.FC<{ testcase: any }> = ({ testcase }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TESTCASE,
    item: { id: testcase.id },
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  }), [testcase]);
  return (
    <div ref={drag as unknown as React.Ref<HTMLDivElement>} style={{ opacity: isDragging ? 0.5 : 1, border: '1px solid #aaa', margin: 4, padding: 4, background: '#fff' }}>
      {testcase.title}
    </div>
  );
};

const SuiteColumn: React.FC<{ suite: any; cases: any[]; onDrop: (testcaseId: number) => void }> = ({ suite, cases, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.TESTCASE,
    drop: (item: any) => onDrop(item.id),
    collect: monitor => ({ isOver: monitor.isOver() }),
  }), [suite]);
  return (
    <div ref={drop as unknown as React.Ref<HTMLDivElement>} style={{ minWidth: 220, minHeight: 200, margin: 8, padding: 8, background: isOver ? '#e0f7fa' : '#f4f4f4', border: '2px solid #90caf9' }}>
      <b>{suite.name}</b>
      <div style={{ fontSize: 12, color: '#888' }}>실행자: {suite.executor || '-'}, 환경: {suite.environment || '-'}, 마감: {suite.dueDate || '-'}</div>
      <div style={{ marginTop: 8 }}>
        {cases.map(tc => <TestCaseCard key={tc.id} testcase={tc} />)}
      </div>
    </div>
  );
};

const ReleaseBoard: React.FC = () => {
  const dispatch = useDispatch();
  const { releases, suites } = useSelector((state: RootState) => state.releases);
  const { list: testcases } = useSelector((state: RootState) => state.testcases);
  const [selectedRelease, setSelectedRelease] = React.useState<number | null>(null);
  const [suiteCases, setSuiteCases] = React.useState<{ [suiteId: number]: number[] }>({});

  useEffect(() => { dispatch(fetchReleases() as any); dispatch(fetchTestCases() as any); }, [dispatch]);
  useEffect(() => { if (selectedRelease) dispatch(fetchSuites(selectedRelease) as any); }, [dispatch, selectedRelease]);
  useEffect(() => {
    if (suites.length > 0) {
      suites.forEach(async s => {
        const res = await axios.get(`/api/releases/suites/${s.id}/cases`);
        setSuiteCases(prev => ({ ...prev, [s.id]: res.data as number[] } as { [suiteId: number]: number[] }));
      });
    }
  }, [suites]);

  const handleDrop = async (suiteId: number, testcaseId: number) => {
    await axios.post(`/api/releases/suites/${suiteId}/cases/${testcaseId}`);
    const res = await axios.get(`/api/releases/suites/${suiteId}/cases`);
    setSuiteCases(prev => ({ ...prev, [suiteId]: res.data as number[] } as { [suiteId: number]: number[] }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ minWidth: 220 }}>
          <h3>릴리즈 목록</h3>
          <ul>
            {releases.map(r => (
              <li key={r.id} style={{ cursor: 'pointer', fontWeight: selectedRelease === r.id ? 'bold' : undefined }} onClick={() => setSelectedRelease(r.id)}>{r.name}</li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1, display: 'flex', gap: 16 }}>
          {suites.map(suite => (
            <SuiteColumn
              key={suite.id}
              suite={suite}
              cases={testcases.filter(tc => suiteCases[suite.id]?.includes(tc.id))}
              onDrop={testcaseId => handleDrop(suite.id, testcaseId)}
            />
          ))}
        </div>
        <div style={{ minWidth: 220 }}>
          <h3>미할당 테스트케이스</h3>
          {testcases.filter(tc => !Object.values(suiteCases).some(arr => arr?.includes(tc.id))).map(tc => <TestCaseCard key={tc.id} testcase={tc} />)}
        </div>
      </div>
    </DndProvider>
  );
};

export default ReleaseBoard; 