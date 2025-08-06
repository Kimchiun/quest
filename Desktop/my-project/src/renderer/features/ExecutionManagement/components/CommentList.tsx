import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchComments,
  addComment,
  updateComment,
  deleteComment,
  Comment,
} from '../store/commentSlice';
import { RootState } from '@/renderer/store';

interface CommentListProps {
  objectType: 'testcase' | 'execution' | 'defect';
  objectId: number;
  currentUser: string;
  userList: string[]; // 사용자 자동완성용 (username 배열)
}

const mentionRegex = /@([a-zA-Z0-9_]+)/g;

function parseMentions(content: string, userList: string[]): string[] {
  // content에서 @username 패턴 추출, userList에 존재하는 것만 반환
  const found = Array.from(content.matchAll(mentionRegex)).map((m: any) => m[1]);
  return found.filter((u: string) => userList.includes(u));
}

const CommentList: React.FC<CommentListProps> = ({ objectType, objectId, currentUser, userList }) => {
  const dispatch = useAppDispatch();
  const { comments, loading, error } = useAppSelector((state: RootState) => state.comments);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editInput, setEditInput] = useState('');
  const [mentionCandidates, setMentionCandidates] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchComments({ objectType, objectId }));
    return () => { dispatch({ type: 'comments/clearComments' }); };
  }, [objectType, objectId, dispatch]);

  // @ 입력 시 자동완성 후보 표시
  useEffect(() => {
    const match = input.match(/@([a-zA-Z0-9_]*)$/);
    if (match) {
      const q = match[1].toLowerCase();
      setMentionCandidates(userList.filter((u: string) => u.toLowerCase().startsWith(q)));
    } else {
      setMentionCandidates([]);
    }
  }, [input, userList]);

  const handleAdd = () => {
    if (!input.trim()) return;
    const mentions = parseMentions(input, userList);
    dispatch(addComment({
      objectType,
      objectId,
      author: currentUser,
      content: input,
      mentions,
    }));
    setInput('');
    setMentionCandidates([]);
  };

  const handleEdit = (id: number, content: string) => {
    setEditingId(id);
    setEditInput(content);
  };

  const handleEditSave = (id: number) => {
    const mentions = parseMentions(editInput, userList);
    dispatch(updateComment({ id, content: editInput, mentions }));
    setEditingId(null);
    setEditInput('');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      dispatch(deleteComment(id));
    }
  };

  const handleMentionClick = (username: string) => {
    setInput(prev => prev.replace(/@([a-zA-Z0-9_]*)$/, `@${username} `));
    setMentionCandidates([]);
    inputRef.current?.focus();
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginTop: 16 }}>
      <h4>댓글</h4>
      {loading && <div>불러오는 중...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {comments.map((c: any) => (
          <li key={c.id} style={{ marginBottom: 12 }}>
            <b>{c.author}</b>{' '}
            <span style={{ color: '#888', fontSize: 12 }}>{new Date(c.createdAt).toLocaleString()}</span>
            {editingId === c.id ? (
              <>
                <input
                  value={editInput}
                  onChange={e => setEditInput(e.target.value)}
                  style={{ width: '60%' }}
                />
                <button onClick={() => handleEditSave(c.id)}>저장</button>
                <button onClick={() => setEditingId(null)}>취소</button>
              </>
            ) : (
              <>
                <span style={{ marginLeft: 8 }}>{c.content}</span>
                {c.mentions.length > 0 && (
                  <span style={{ color: '#3b82f6', marginLeft: 8 }}>
                    {c.mentions.map((m: any) => `@${m}`).join(' ')}
                  </span>
                )}
                {c.author === currentUser && (
                  <>
                    <button onClick={() => handleEdit(c.id, c.content)} style={{ marginLeft: 8 }}>수정</button>
                    <button onClick={() => handleDelete(c.id)} style={{ marginLeft: 4 }}>삭제</button>
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 8 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ width: '70%' }}
          placeholder="댓글을 입력하세요. @로 멘션 가능"
          onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
        />
        <button onClick={handleAdd} style={{ marginLeft: 8 }}>등록</button>
        {mentionCandidates.length > 0 && (
          <div style={{ background: '#f5f5f5', border: '1px solid #ccc', borderRadius: 4, marginTop: 2, padding: 4, position: 'absolute', zIndex: 10 }}>
            {mentionCandidates.map((u: string) => (
              <div key={u} style={{ cursor: 'pointer' }} onClick={() => handleMentionClick(u)}>
                @{u}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentList; 