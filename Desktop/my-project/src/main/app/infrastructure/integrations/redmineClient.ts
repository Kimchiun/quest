import axios from 'axios';

export interface RedmineIssueParams {
    subject: string;
    description: string;
    projectId: string | number;
    trackerId?: number;
    redmineUrl: string;
    apiKey: string;
    timeoutMs?: number;
}

export async function createRedmineIssue(params: RedmineIssueParams): Promise<{ id: number; url: string }> {
    const {
        subject,
        description,
        projectId,
        trackerId = 1, // 1: Bug
        redmineUrl,
        apiKey,
        timeoutMs = 8000,
    } = params;
    try {
        const res = await axios.post(
            `${redmineUrl}/issues.json`,
            {
                issue: {
                    project_id: projectId,
                    subject,
                    description,
                    tracker_id: trackerId,
                },
            },
            {
                headers: {
                    'X-Redmine-API-Key': apiKey,
                    'Content-Type': 'application/json',
                },
                timeout: timeoutMs,
            }
        );
        const issueId = (res.data as any)?.issue?.id;
        return {
            id: issueId,
            url: `${redmineUrl}/issues/${issueId}`,
        };
    } catch (err: any) {
        if (err.code === 'ECONNABORTED') {
            throw new Error('Redmine API request timed out');
        }
        throw new Error(err.response?.data?.errors?.[0] || err.message || 'Redmine issue creation failed');
    }
} 