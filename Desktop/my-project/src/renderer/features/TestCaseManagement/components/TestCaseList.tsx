import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { fetchTestCases, searchTestCases, setSearchParams, TestCase } from '../store/testCaseSlice';
import Container from '../../../shared/components/Container';
import Grid from '../../../shared/components/Grid';
import Typography from '../../../shared/components/Typography';
import Button from '../../../shared/components/Button';
import Form, { FormField } from '../../../shared/components/Form';
import Table, { TableColumn } from '../../../shared/components/Table';
import TestCaseDetail from './TestCaseDetail';
import api from '../../../utils/axios';

const priorities = ['High', 'Medium', 'Low'];
const statuses = ['Active', 'Archived'];

const TestCaseList: React.FC = () => {
  const dispatch = useDispatch();
  const { list, loading, error, searchParams } = useSelector((state: RootState) => state.testcases);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [showCreate, setShowCreate] = React.useState(false);
  const [createForm, setCreateForm] = React.useState({ title: '', steps: '', expected: '', priority: 'Medium', tags: '', status: 'Active', prereq: '' });

  const handleDelete = React.useCallback(async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    await api.delete(`/api/testcases/${id}`);
    dispatch(fetchTestCases() as any);
  }, [dispatch]);

  const columns = React.useMemo<TableColumn<TestCase>[]>(() => [
    { key: 'id', title: 'ID', width: 60, align: 'center' },
    { key: 'title', title: '제목', render: (v, row) => <span style={{ cursor: 'pointer', color: '#2563eb' }} onClick={() => setSelectedId(row.id)}>{v}</span> },
    { key: 'priority', title: '우선순위', align: 'center' },
    { key: 'status', title: '상태', align: 'center' },
    { key: 'createdBy', title: '작성자', align: 'center' },
    { key: 'createdAt', title: '생성일', render: v => new Date(v).toLocaleString(), align: 'center' },
    { key: 'delete', title: '삭제', width: 80, align: 'center', render: (_, row) => <Button size="sm" variant="danger" onClick={e => { e.stopPropagation(); handleDelete(row.id); }}>삭제</Button> },
  ], [setSelectedId, handleDelete]);

  useEffect(() => {
    dispatch(fetchTestCases() as any);
  }, [dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
    const priority = (form.elements.namedItem('priority') as HTMLSelectElement).value;
    const status = (form.elements.namedItem('status') as HTMLSelectElement).value;
    const query: any = { query: { bool: { must: [] as any[] } } };
    if (title) query.query.bool.must.push({ match: { title } });
    if (priority) query.query.bool.must.push({ term: { priority } });
    if (status) query.query.bool.must.push({ term: { status } });
    dispatch(setSearchParams({ title, priority, status }));
    dispatch(searchTestCases(query) as any);
  };

  const createFields: FormField[] = [
    { name: 'title', label: '제목', type: 'text', required: true },
    { name: 'prereq', label: '전제조건', type: 'textarea' },
    { name: 'steps', label: '스텝(줄바꿈 구분)', type: 'textarea', required: true },
    { name: 'expected', label: '기대결과', type: 'textarea', required: true },
    { name: 'priority', label: '우선순위', type: 'select', options: priorities.map(p => ({ label: p, value: p })), required: true },
    { name: 'tags', label: '태그(,로 구분)', type: 'text' },
    { name: 'status', label: '상태', type: 'select', options: statuses.map(s => ({ label: s, value: s })), required: true },
  ];

  return (
    <Container
      $maxWidth="1200px"
      $padding="24px"
      $background="white"
      $radius="8px"
      style={{ margin: '0 auto' }}
    >
      <Typography $variant="h2" style={{ marginBottom: 24 }}>테스트케이스 목록</Typography>
      <Grid
        $columns={1}
        $gap="16px"
        style={{ marginBottom: 16 }}
      >
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography $variant="caption" style={{ marginBottom: 4 }}>제목 검색</Typography>
            <input name="title" type="text" defaultValue={searchParams.title || ''} style={{ minWidth: 160, padding: 8, borderRadius: 4, border: '1px solid #e5e7eb' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography $variant="caption" style={{ marginBottom: 4 }}>우선순위</Typography>
            <select name="priority" defaultValue={searchParams.priority || ''} style={{ minWidth: 120, padding: 8, borderRadius: 4, border: '1px solid #e5e7eb' }}>
              <option value="">전체</option>
              {priorities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography $variant="caption" style={{ marginBottom: 4 }}>상태</Typography>
            <select name="status" defaultValue={searchParams.status || ''} style={{ minWidth: 120, padding: 8, borderRadius: 4, border: '1px solid #e5e7eb' }}>
              <option value="">전체</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <Button type="submit" variant="primary">검색</Button>
        </form>
        <div style={{ textAlign: 'right' }}>
          <Button onClick={() => setShowCreate(v => !v)}>{showCreate ? '취소' : '테스트케이스 생성'}</Button>
        </div>
      </Grid>
      {showCreate && (
        <Form
          fields={createFields}
          initialValues={createForm}
          onSubmit={async (values) => {
            await api.post('/api/testcases', {
              ...values,
              steps: values.steps.split('\n'),
              tags: values.tags.split(',').map((t: string) => t.trim()),
              createdBy: 'tester',
            });
            setShowCreate(false);
            setCreateForm({ title: '', steps: '', expected: '', priority: 'Medium', tags: '', status: 'Active', prereq: '' });
            dispatch(fetchTestCases() as any);
          }}
          layout="vertical"
          variant="bordered"
          submitLabel="저장"
          style={{ marginBottom: 24 }}
        />
      )}
      {loading && <Typography $variant="body">로딩 중...</Typography>}
      {error && <Typography $variant="body" style={{ color: 'red' }}>{error}</Typography>}
      <Table<TestCase>
        columns={columns}
        data={list}
        striped
        bordered
        size="md"
        style={{ marginTop: 8 }}
      />
      {list.length === 0 && !loading && <Typography $variant="body">데이터 없음</Typography>}
      {selectedId && <TestCaseDetail id={selectedId} onClose={() => setSelectedId(null)} />}
    </Container>
  );
};

export default TestCaseList; 