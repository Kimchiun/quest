import axios from 'axios';

export interface JiraIssueParams {
    summary: string;
    description: string;
    projectKey: string;
    issueType?: string;
    jiraUrl: string;
    username: string;
    apiToken: string;
    timeoutMs?: number;
}

export async function createJiraIssue(params: JiraIssueParams): Promise<{ key: string; url: string }> {
    const {
        summary,
        description,
        projectKey,
        issueType = 'Bug',
        jiraUrl,
        username,
        apiToken,
        timeoutMs = 8000,
    } = params;
    try {
        const res = await axios.post(
            `${jiraUrl}/rest/api/2/issue`,
            {
                fields: {
                    project: { key: projectKey },
                    summary,
                    description,
                    issuetype: { name: issueType },
                },
            },
            {
                auth: { username, password: apiToken },
                timeout: timeoutMs,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return {
            key: (res.data as any).key,
            url: `${jiraUrl}/browse/${(res.data as any).key}`,
        };
    } catch (err: any) {
        if (err.code === 'ECONNABORTED') {
            throw new Error('Jira API request timed out');
        }
        throw new Error(err.response?.data?.errorMessages?.[0] || err.message || 'Jira issue creation failed');
    }
} 