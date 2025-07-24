import React, { useState } from 'react';
import { Execution } from '@/main/app/domains/executions/models/Execution';
import Modal from '@/renderer/shared/components/Modal';
import Button from '@/renderer/shared/components/Button';
import Form, { FormField } from '@/renderer/shared/components/Form';

interface IssueCreateModalProps {
    open: boolean;
    onClose: () => void;
    execution: Execution | null;
    type: 'jira' | 'redmine';
    onSubmit: (params: any) => Promise<void>;
}

const getFields = (type: 'jira' | 'redmine'): FormField[] =>
  type === 'jira'
    ? [
        { name: 'summary', label: 'Summary', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'projectKey', label: 'Project Key', type: 'text', required: true },
        { name: 'jiraUrl', label: 'Jira URL', type: 'text', required: true },
        { name: 'username', label: 'Username', type: 'text', required: true },
        { name: 'apiToken', label: 'API Token', type: 'password', required: true },
      ]
    : [
        { name: 'summary', label: 'Summary', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'projectId', label: 'Project ID', type: 'text', required: true },
        { name: 'redmineUrl', label: 'Redmine URL', type: 'text', required: true },
        { name: 'redmineApiKey', label: 'API Key', type: 'password', required: true },
      ];

const IssueCreateModal: React.FC<IssueCreateModalProps> = ({ open, onClose, execution, type, onSubmit }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    if (!open || !execution) return null;

    const handleFormSubmit = async (values: Record<string, any>) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            if (type === 'jira') {
                await onSubmit({
                    executionId: execution.id,
                    summary: values.summary,
                    description: values.description,
                    projectKey: values.projectKey,
                    jiraUrl: values.jiraUrl,
                    username: values.username,
                    apiToken: values.apiToken,
                });
            } else {
                await onSubmit({
                    executionId: execution.id,
                    subject: values.summary,
                    description: values.description,
                    projectId: values.projectId,
                    redmineUrl: values.redmineUrl,
                    apiKey: values.redmineApiKey,
                });
            }
            setSuccess('Issue created and linked successfully!');
        } catch (err: any) {
            setError(err.message || 'Issue creation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={type === 'jira' ? 'Create Jira Issue' : 'Create Redmine Issue'}
            size="md"
            variant={type === 'jira' ? 'default' : 'success'}
            footer={
                <>
                    <Button type="submit" form="issue-create-form" disabled={loading}>{loading ? 'Creating...' : 'Create Issue'}</Button>
                    <Button variant="secondary" onClick={onClose} style={{ marginLeft: 8 }}>Cancel</Button>
                </>
            }
        >
            <Form
                fields={getFields(type)}
                onSubmit={handleFormSubmit}
                initialValues={{}}
                layout="vertical"
                variant="default"
                submitLabel="숨김"
                style={{ marginBottom: 0 }}
                // form id를 Modal footer 버튼과 연결
                id="issue-create-form"
            />
            {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
            {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
        </Modal>
    );
};

export default IssueCreateModal; 