import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/renderer/store';
import ExecutionList from './ExecutionList';
import IssueCreateModal from './IssueCreateModal';
import axios from 'axios';
import { fetchExecutions } from '../store/executionSlice';

const ExecutionIntegrationContainer: React.FC = () => {
    const executions = useSelector((state: RootState) => state.executions.executions);
    const dispatch = useDispatch<AppDispatch>();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'jira' | 'redmine' | null>(null);
    const [selectedExecution, setSelectedExecution] = useState<any>(null);

    const handleCreateJira = (execution: any) => {
        setSelectedExecution(execution);
        setModalType('jira');
        setModalOpen(true);
    };
    const handleCreateRedmine = (execution: any) => {
        setSelectedExecution(execution);
        setModalType('redmine');
        setModalOpen(true);
    };
    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedExecution(null);
        setModalType(null);
    };
    const handleSubmit = async (params: any) => {
        if (modalType === 'jira') {
            await axios.post('/api/integrations/jira-issue', params);
        } else {
            await axios.post('/api/integrations/redmine-issue', params);
        }
        // 실행 기록 comment 갱신을 위해 재조회
        await dispatch(fetchExecutions(params.executionId));
        handleCloseModal();
    };
    return (
        <>
            <ExecutionList
                executions={executions}
                onCreateJira={handleCreateJira}
                onCreateRedmine={handleCreateRedmine}
            />
            <IssueCreateModal
                open={modalOpen}
                onClose={handleCloseModal}
                execution={selectedExecution}
                type={modalType as any}
                onSubmit={handleSubmit}
            />
        </>
    );
};

export default ExecutionIntegrationContainer; 