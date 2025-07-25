import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/renderer/store';
import { fetchReleases, createRelease, updateRelease, deleteRelease } from '../store/releaseSlice';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button';
import Container from '../../../shared/components/Container';
import Typography from '../../../shared/components/Typography';
import Input from '../../../shared/components/Input';

// TODO: 실제 권한 체크 유틸로 대체
const useRole = () => {
  const role = useSelector((state: RootState) => state.users.me?.role || 'QA');
  return role;
};

interface ReleaseFormProps {
  initial?: Partial<{ name: string; description?: string; startDate?: string; endDate?: string }>;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  loading?: boolean;
}
const ReleaseForm: React.FC<ReleaseFormProps> = ({ initial = {}, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState({
    name: initial.name || '',
    description: initial.description || '',
    startDate: initial.startDate || '',
    endDate: initial.endDate || '',
  });
  const [error, setError] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('이름은 필수입니다.');
    setError('');
    onSubmit(form);
  };
  return (
    <form onSubmit={handleSubmit} style={{ minWidth: 320 }}>
      <div style={{ marginBottom: 12 }}>
        <label>이름 *</label>
        <Input name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>설명</label>
        <Input name="description" value={form.description} onChange={handleChange} />
      </div>
      <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label>시작일</label>
          <Input name="startDate" type="date" value={form.startDate} onChange={handleChange} />
        </div>
        <div style={{ flex: 1 }}>
          <label>종료일</label>
          <Input name="endDate" type="date" value={form.endDate} onChange={handleChange} />
        </div>
      </div>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button type="button" variant="secondary" onClick={onCancel}>취소</Button>
        <Button type="submit" variant="primary" loading={loading}>저장</Button>
      </div>
    </form>
  );
};

const PAGE_SIZE = 10;

const ReleaseSelection: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { releases, loading, error } = useSelector((state: RootState) => state.releases);
  const role = useRole();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<number | null>(null);
  const [showDelete, setShowDelete] = useState<number | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

  useEffect(() => { dispatch(fetchReleases() as any); }, [dispatch]);

  const filtered = useMemo(() =>
    releases.filter(r => {
      const nameMatch = r.name.toLowerCase().includes(search.toLowerCase());
      const startOk = !dateRange.start || (r.startDate && r.startDate >= dateRange.start);
      const endOk = !dateRange.end || (r.endDate && r.endDate <= dateRange.end);
      return nameMatch && startOk && endOk;
    }),
    [releases, search, dateRange]
  );
  const paged = useMemo(() =>
    filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;

  const handleSelect = (id: number) => {
    navigate(`/dashboard/${id}`);
  };

  // 생성
  const handleCreate = async (values: any) => {
    setFormLoading(true);
    try {
      await dispatch(createRelease(values) as any).unwrap();
      setShowCreate(false);
    } finally {
      setFormLoading(false);
    }
  };
  // 수정
  const handleEdit = async (values: any) => {
    if (!showEdit) return;
    setFormLoading(true);
    try {
      await dispatch(updateRelease({ id: showEdit, data: values }) as any).unwrap();
      setShowEdit(null);
    } finally {
      setFormLoading(false);
    }
  };
  // 삭제
  const handleDelete = async () => {
    if (!showDelete) return;
    setFormLoading(true);
    try {
      await dispatch(deleteRelease(showDelete) as any).unwrap();
      setShowDelete(null);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Container maxWidth="700px" padding="32px" background="#fff" radius="md" style={{ margin: '32px auto', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
      <Typography variant="h2" style={{ marginBottom: 24 }}>릴리즈/스프린트 선택</Typography>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="릴리즈명 검색" style={{ flex: 1 }} />
        <Input type="date" value={dateRange.start} onChange={e => setDateRange(d => ({ ...d, start: e.target.value }))} style={{ width: 140 }} />
        <span style={{ alignSelf: 'center' }}>~</span>
        <Input type="date" value={dateRange.end} onChange={e => setDateRange(d => ({ ...d, end: e.target.value }))} style={{ width: 140 }} />
        {['Admin', 'QA'].includes(role) && (
          <Button onClick={() => setShowCreate(true)} variant="primary">신규 생성</Button>
        )}
      </div>
      <div style={{ minHeight: 200 }}>
        {loading ? <div>로딩 중...</div> : error ? <div style={{ color: 'red' }}>{error}</div> : (
          filtered.length === 0 ? <div>릴리즈가 없습니다.</div> : (
            <>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {paged.map(r => (
                  <li key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #eee', cursor: 'pointer' }}>
                    <span onClick={() => handleSelect(r.id)} style={{ fontWeight: 500 }}>{r.name}</span>
                    <span>
                      {['Admin', 'QA'].includes(role) && (
                        <>
                          <Button size="sm" variant="secondary" onClick={() => setShowEdit(r.id)} style={{ marginRight: 8 }}>수정</Button>
                          <Button size="sm" variant="danger" onClick={() => setShowDelete(r.id)}>삭제</Button>
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
                <Button size="sm" variant="secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>이전</Button>
                <span style={{ alignSelf: 'center' }}>{page} / {totalPages}</span>
                <Button size="sm" variant="secondary" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>다음</Button>
              </div>
            </>
          )
        )}
      </div>
      {/* 생성 모달 */}
      {showCreate && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 8, minWidth: 360 }}>
            <Typography variant="h3" style={{ marginBottom: 16 }}>릴리즈 생성</Typography>
            <ReleaseForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} loading={formLoading} />
          </div>
        </div>
      )}
      {/* 수정 모달 */}
      {showEdit && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 8, minWidth: 360 }}>
            <Typography variant="h3" style={{ marginBottom: 16 }}>릴리즈 수정</Typography>
            <ReleaseForm initial={releases.find(r => r.id === showEdit)} onSubmit={handleEdit} onCancel={() => setShowEdit(null)} loading={formLoading} />
          </div>
        </div>
      )}
      {/* 삭제 모달 */}
      {showDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 8, minWidth: 320 }}>
            <Typography variant="h4" style={{ marginBottom: 16 }}>정말 삭제하시겠습니까?</Typography>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button variant="secondary" onClick={() => setShowDelete(null)}>취소</Button>
              <Button variant="danger" onClick={handleDelete} loading={formLoading}>삭제</Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default ReleaseSelection; 