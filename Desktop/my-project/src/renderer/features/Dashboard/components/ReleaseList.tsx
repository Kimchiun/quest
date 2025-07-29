import React, { useEffect, useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../../utils/axios';
import { RootState } from '../../../store';
import { setSelectedReleaseId } from '../../../store/dashboardLayoutSlice';

interface Release {
  id: string;
  title: string;
  status: 'active' | 'pending' | 'completed';
  description?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SearchRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: ${({ active }) => (active ? '#3b82f6' : '#f1f5f9')};
  color: ${({ active }) => (active ? 'white' : '#64748b')};
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #2563eb;
    color: white;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 220px;
  overflow-y: auto;
`;

const Item = styled.div<{ selected: boolean }>`
  padding: 10px 12px;
  border-radius: 6px;
  background: ${({ selected }) => (selected ? '#dbeafe' : 'white')};
  border: 1px solid ${({ selected }) => (selected ? '#3b82f6' : '#e2e8f0')};
  color: #1e293b;
  font-weight: ${({ selected }) => (selected ? 600 : 400)};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
  transition: background 0.2s, border 0.2s;
  &:hover {
    background: #eff6ff;
    border-color: #3b82f6;
  }
`;

const Status = styled.span<{ status: string }>`
  font-size: 12px;
  color: ${({ status }) => {
    switch (status) {
      case 'active': return '#059669';
      case 'pending': return '#d97706';
      case 'completed': return '#7c3aed';
      default: return '#6b7280';
    }
  }};
  font-weight: 500;
`;

const statusOptions = [
  { value: '', label: '전체' },
  { value: 'active', label: '진행 중' },
  { value: 'pending', label: '대기 중' },
  { value: 'completed', label: '완료' },
];

const ReleaseList: React.FC = () => {
  const dispatch = useDispatch();
  const selectedId = useSelector((state: RootState) => state.dashboardLayout.selectedReleaseId);
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('/api/releases')
      .then((res: any) => {
        setReleases(res.data as Release[]);
        setLoading(false);
      })
      .catch(() => {
        setReleases([]);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return releases.filter(r =>
      (!status || r.status === status) &&
      (r.title.toLowerCase().includes(search.toLowerCase()) || (r.description?.toLowerCase().includes(search.toLowerCase()) ?? false))
    );
  }, [releases, search, status]);

  const handleSelect = useCallback((id: string) => {
    dispatch(setSelectedReleaseId(id));
  }, [dispatch]);

  return (
    <Container data-testid="release-list">
      <SearchRow>
        <SearchInput
          placeholder="릴리즈 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          data-testid="release-search-input"
        />
        {statusOptions.map(opt => (
          <FilterButton
            key={opt.value}
            active={status === opt.value}
            onClick={() => setStatus(opt.value)}
            data-testid={`release-filter-${opt.value || 'all'}`}
          >
            {opt.label}
          </FilterButton>
        ))}
      </SearchRow>
      <List>
        {loading ? (
          <div>로딩 중...</div>
        ) : filtered.length === 0 ? (
          <div>릴리즈가 없습니다.</div>
        ) : filtered.map(r => (
          <Item
            key={r.id}
            selected={selectedId === r.id}
            onClick={() => handleSelect(r.id)}
            data-testid={`release-item-${r.id}`}
            tabIndex={0}
            aria-label={`릴리즈 ${r.title}`}
          >
            <span>{r.title}</span>
            <Status status={r.status}>{statusOptions.find(o => o.value === r.status)?.label}</Status>
          </Item>
        ))}
      </List>
    </Container>
  );
};

export default ReleaseList; 