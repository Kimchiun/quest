import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/renderer/store';
import { fetchTestCaseDetail, fetchTestCases, clearDetail, TestCase } from '../store/testCaseSlice';
import axios from 'axios';
import Container from '@/renderer/shared/components/Container';
import Typography from '@/renderer/shared/components/Typography';
import Button from '@/renderer/shared/components/Button';
import Form, { FormField } from '@/renderer/shared/components/Form';

interface Props {
  id: number;
  onClose: () => void;
}

const priorities = ['High', 'Medium', 'Low'];
const statuses = ['Active', 'Archived'];

const fields: FormField[] = [
  { name: 'title', label: '제목', type: 'text', required: true },
  { name: 'prereq', label: '전제조건', type: 'textarea' },
  { name: 'steps', label: '스텝(줄바꿈 구분)', type: 'textarea', required: true },
  { name: 'expected', label: '기대결과', type: 'textarea', required: true },
  { name: 'priority', label: '우선순위', type: 'select', options: priorities.map(p => ({ label: p, value: p })), required: true },
  { name: 'tags', label: '태그(,로 구분)', type: 'text' },
  { name: 'status', label: '상태', type: 'select', options: statuses.map(s => ({ label: s, value: s })), required: true },
];

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
    if (detail) setForm({
      ...detail,
      steps: Array.isArray(detail.steps) ? detail.steps.join('\n') : detail.steps || '',
      tags: Array.isArray(detail.tags) ? detail.tags.join(',') : detail.tags || '',
    });
  }, [detail]);

  const handleSave = async (values: any) => {
    await axios.put(`/api/testcases/${id}`, {
      ...values,
      steps: values.steps.split('\n'),
      tags: values.tags.split(',').map((t: string) => t.trim()),
      updatedBy: 'tester',
    });
    setEdit(false);
    dispatch(fetchTestCaseDetail(id) as any);
    dispatch(fetchTestCases() as any);
  };

  if (!detail) return <div>로딩...</div>;

  // steps, tags를 항상 string[]로 변환
  const stepsArr = Array.isArray(detail.steps)
    ? detail.steps
    : typeof detail.steps === 'string'
      ? detail.steps.split('\n')
      : [];
  const tagsArr = Array.isArray(detail.tags)
    ? detail.tags
    : typeof detail.tags === 'string'
      ? detail.tags.split(',')
      : [];

  return (
    <Container maxWidth="600px" padding="32px" background="#fff" radius="md" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.08)', margin: '32px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography variant="h3">테스트케이스 상세</Typography>
        <Button variant="secondary" onClick={onClose}>닫기</Button>
      </div>
      {edit ? (
        <Form
          fields={fields}
          initialValues={form}
          onSubmit={handleSave}
          layout="vertical"
          variant="default"
          submitLabel="저장"
        />
      ) : (
        <div style={{ marginBottom: 24 }}>
          <Typography variant="h4">{detail.title}</Typography>
          <Typography variant="body"><b>전제조건:</b> {detail.prereq}</Typography>
          <Typography variant="body"><b>스텝:</b> <pre style={{ margin: 0 }}>{stepsArr.join('\n')}</pre></Typography>
          <Typography variant="body"><b>기대결과:</b> {detail.expected}</Typography>
          <Typography variant="body"><b>우선순위:</b> {detail.priority}</Typography>
          <Typography variant="body"><b>태그:</b> {tagsArr.join(', ')}</Typography>
          <Typography variant="body"><b>상태:</b> {detail.status}</Typography>
          <Typography variant="body"><b>작성자:</b> {detail.createdBy}</Typography>
          <Typography variant="body"><b>생성일:</b> {new Date(detail.createdAt).toLocaleString()}</Typography>
          <Typography variant="body"><b>수정일:</b> {new Date(detail.updatedAt).toLocaleString()}</Typography>
          <Button style={{ marginTop: 16 }} onClick={() => setEdit(true)}>수정</Button>
        </div>
      )}
      <div>
        <Typography variant="h5" style={{ marginTop: 24, marginBottom: 8 }}>버전 이력</Typography>
        <ul style={{ paddingLeft: 16 }}>
          {versions.map(v => (
            <li key={v.id}>v{v.version} - {v.createdBy} ({new Date(v.createdAt).toLocaleString()})</li>
          ))}
        </ul>
      </div>
    </Container>
  );
};

export default TestCaseDetail; 