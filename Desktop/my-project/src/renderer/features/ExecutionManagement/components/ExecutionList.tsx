import React, { useState } from 'react';
import { Execution } from '@/main/app/domains/executions/models/Execution';
import CommentList from './CommentList';

interface ExecutionListProps {
    executions: Execution[];
    onCreateJira: (execution: Execution) => void;
    onCreateRedmine: (execution: Execution) => void;
}

const mockUserList = ['alice', 'bob', 'carol']; // 실제 사용자 목록과 연동 필요
const currentUser = 'alice'; // 실제 로그인 사용자와 연동 필요

const ExecutionList: React.FC<ExecutionListProps> = ({ executions, onCreateJira, onCreateRedmine }) => {
    const [openComments, setOpenComments] = useState<Record<number, boolean>>({});
    const toggleComments = (id: number) => {
        setOpenComments(prev => ({ ...prev, [id]: !prev[id] }));
    };
    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Executed By</th>
                    <th>Executed At</th>
                    <th>Comment</th>
                    <th>Jira</th>
                    <th>Redmine</th>
                    <th>댓글</th>
                </tr>
            </thead>
            <tbody>
                {executions.map(exec => (
                    <React.Fragment key={exec.id}>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td>{exec.id}</td>
                            <td>{exec.status}</td>
                            <td>{exec.executedBy}</td>
                            <td>{exec.executedAt instanceof Date ? exec.executedAt.toLocaleString() : String(exec.executedAt)}</td>
                            <td>{exec.comment}</td>
                            <td>
                                <button onClick={() => onCreateJira(exec)}>Create Jira Issue</button>
                            </td>
                            <td>
                                <button onClick={() => onCreateRedmine(exec)}>Create Redmine Issue</button>
                            </td>
                            <td>
                                <button onClick={() => toggleComments(exec.id)}>
                                    {openComments[exec.id] ? '닫기' : '보기'}
                                </button>
                            </td>
                        </tr>
                        {openComments[exec.id] && (
                            <tr>
                                <td colSpan={8}>
                                    <CommentList
                                        objectType="execution"
                                        objectId={exec.id}
                                        currentUser={currentUser}
                                        userList={mockUserList}
                                    />
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default ExecutionList; 