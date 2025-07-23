import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/renderer/store';
import { fetchTestCases, searchTestCases, setSearchParams, TestCase } from '../store/testCaseSlice';
import TestCaseDetail from './TestCaseDetail';
import axios from 'axios';

const priorities = ['High', 'Medium', 'Low'];
const statuses = ['Active', 'Archived'];

const TestCaseList: React.FC = () => {
  const dispatch = useDispatch();
  const { list, loading, error, searchParams } = useSelector((state: RootState) => state.testcases);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [showCreate, setShowCreate] = React.useState(false);
  const [createForm, setCreateForm] = React.useState({ title: '', steps: '', expected: '', priority: 'Medium', tags: '', status: 'Active', prereq: '' });

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/testcases', {
      ...createForm,
      steps: createForm.steps.split('\n'),
      tags: createForm.tags.split(',').map(t => t.trim()),
      createdBy: 'tester',
    });
    setShowCreate(false);
    setCreateForm({ title: '', steps: '', expected: '', priority: 'Medium', tags: '', status: 'Active', prereq: '' });
    dispatch(fetchTestCases() as any);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    await axios.delete(`/api/testcases/${id}`);
    dispatch(fetchTestCases() as any);
  };

  return (
    <div>
      <h2>테스트케이스 목록</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <input name="title" placeholder="제목 검색" defaultValue={searchParams.title || ''} />
        <select name="priority" defaultValue={searchParams.priority || ''}>
          <option value="">우선순위</option>
          {priorities.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select name="status" defaultValue={searchParams.status || ''}>
          <option value="">상태</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button type="submit">검색</button>
      </form>
      <button onClick={() => setShowCreate(v => !v)} style={{ marginBottom: 8 }}>테스트케이스 생성</button>
      {showCreate && (
        <form onSubmit={handleCreate} style={{ marginBottom: 16, background: '#f4f4f4', padding: 12 }}>
          <input name="title" placeholder="제목" value={createForm.title} onChange={e => setCreateForm(f => ({ ...f, title: e.target.value }))} required />
          <textarea name="prereq" placeholder="전제조건" value={createForm.prereq} onChange={e => setCreateForm(f => ({ ...f, prereq: e.target.value }))} />
          <textarea name="steps" placeholder="스텝(줄바꿈 구분)" value={createForm.steps} onChange={e => setCreateForm(f => ({ ...f, steps: e.target.value }))} required />
          <textarea name="expected" placeholder="기대결과" value={createForm.expected} onChange={e => setCreateForm(f => ({ ...f, expected: e.target.value }))} required />
          <select name="priority" value={createForm.priority} onChange={e => setCreateForm(f => ({ ...f, priority: e.target.value }))}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input name="tags" placeholder="태그(,로 구분)" value={createForm.tags} onChange={e => setCreateForm(f => ({ ...f, tags: e.target.value }))} />
          <select name="status" value={createForm.status} onChange={e => setCreateForm(f => ({ ...f, status: e.target.value }))}>
            <option value="Active">Active</option>
            <option value="Archived">Archived</option>
          </select>
          <button type="submit">저장</button>
        </form>
      )}
      {loading && <div>로딩 중...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table border={1} cellPadding={4} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>제목</th>
            <th>우선순위</th>
            <th>상태</th>
            <th>작성자</th>
            <th>생성일</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {list.map((tc: TestCase) => (
            <tr key={tc.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedId(tc.id)}>
              <td>{tc.id}</td>
              <td>{tc.title}</td>
              <td>{tc.priority}</td>
              <td>{tc.status}</td>
              <td>{tc.createdBy}</td>
              <td>{new Date(tc.createdAt).toLocaleString()}</td>
              <td><button onClick={e => { e.stopPropagation(); handleDelete(tc.id); }}>삭제</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {list.length === 0 && !loading && <div>데이터 없음</div>}
      {selectedId && <TestCaseDetail id={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  );
};

export default TestCaseList; 