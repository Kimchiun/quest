import { Router, Request, Response } from 'express';
import { createJiraIssue } from '../../../infrastructure/integrations/jiraClient';
import { createRedmineIssue } from '../../../infrastructure/integrations/redmineClient';
import { executionService } from '../services/executionService';

const router = Router();

// POST /api/integrations/jira-issue
router.post('/jira-issue', async (req: Request, res: Response) => {
    const { executionId, summary, description, projectKey, jiraUrl, username, apiToken, issueType } = req.body;
    try {
        const result = await createJiraIssue({ summary, description, projectKey, jiraUrl, username, apiToken, issueType });
        // 실행 기록에 이슈 ID 저장
        await executionService.updateExecution(executionId, { comment: `[Jira:${result.key}] ${result.url}` });
        res.json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/integrations/redmine-issue
router.post('/redmine-issue', async (req: Request, res: Response) => {
    const { executionId, subject, description, projectId, redmineUrl, apiKey, trackerId } = req.body;
    try {
        const result = await createRedmineIssue({ subject, description, projectId, redmineUrl, apiKey, trackerId });
        // 실행 기록에 이슈 ID 저장
        await executionService.updateExecution(executionId, { comment: `[Redmine:${result.id}] ${result.url}` });
        res.json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router; 