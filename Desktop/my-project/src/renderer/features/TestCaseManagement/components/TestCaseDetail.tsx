import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/renderer/store';
import { fetchTestCaseDetail, fetchTestCases, clearDetail, TestCase } from '../store/testCaseSlice';
import axios from 'axios';

interface Props {
  id: number;
  onClose: () => void;
}

const TestCaseDetail: React.FC<Props> = ({ id, onClose }) => {
  const dispatch = useDispatch();
  const detail = useSelector((state: RootState) => state.testcases.detail);
  const [versions, setVersions] = useState<any[]>([]);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<Partial<TestCase>>({});

  useEffect(() => {
    dispatch(fetchTestCaseDetail(id) as any);
    axios.get(`/api/testcases/${id}/versions`).then(res => setVersions(res.data as any[]));
    return () => { dispatch(clearDetail()); };
  }, [dispatch, id]);

  useEffect(() => {
    if (detail) setForm(detail);
  }, [detail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    await axios.put(`/api/testcases/${id}`, { ...form, updatedBy: 'tester' });
    setEdit(false);
    dispatch(fetchTestCaseDetail(id) as any);
    dispatch(fetchTestCases() as any);
  };

  if (!detail) return <div>로딩...</div>;

  return (
    <div style={{ border: '1px solid #aaa', padding: 16, background: '#fafbfc' }}>
      <button onClick={onClose} style={{ float: 'right' }}>닫기</button>
      <h3>테스트케이스 상세</h3>
      {edit ? (
        <div>
          <input name="title" value={form.title || ''} onChange={handleChange} placeholder="제목" />
          <textarea name="prereq" value={form.prereq || ''} onChange={handleChange} placeholder="전제조건" />
          <textarea name="steps" value={(form.steps || []).join('\n')} onChange={e => setForm(f => ({ ...f, steps: e.target.value.split('\n') }))} placeholder="스텝(줄바꿈 구분)" />
          <textarea name="expected" value={form.expected || ''} onChange={handleChange} placeholder="기대결과" />
          <select name="priority" value={form.priority || ''} onChange={handleChange}>
            <option value="">우선순위</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input name="tags" value={(form.tags || []).join(',')} onChange={e => setForm(f => ({ ...f, tags: e.target.value.split(',') }))} placeholder="태그(,로 구분)" />
          <select name="status" value={form.status || ''} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Archived">Archived</option>
          </select>
          <button onClick={handleSave}>저장</button>
        </div>
      ) : (
        <div>
          <div><b>제목:</b> {detail.title}</div>
          <div><b>전제조건:</b> {detail.prereq}</div>
          <div><b>스텝:</b> <pre>{detail.steps.join('\n')}</pre></div>
          <div><b>기대결과:</b> {detail.expected}</div>
          <div><b>우선순위:</b> {detail.priority}</div>
          <div><b>태그:</b> {detail.tags.join(', ')}</div>
          <div><b>상태:</b> {detail.status}</div>
          <div><b>작성자:</b> {detail.createdBy}</div>
          <div><b>생성일:</b> {new Date(detail.createdAt).toLocaleString()}</div>
          <div><b>수정일:</b> {new Date(detail.updatedAt).toLocaleString()}</div>
          <button onClick={() => setEdit(true)}>수정</button>
        </div>
      )}
      <h4>버전 이력</h4>
      <ul>
        {versions.map(v => (
          <li key={v.id}>v{v.version} - {v.createdBy} ({new Date(v.createdAt).toLocaleString()})</li>
        ))}
      </ul>
    </div>
  );
};

export default TestCaseDetail; 