import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createJiraIssue } from '../src/main/app/infrastructure/integrations/jiraClient';

describe('jiraClient (unit)', () => {
  const mock = new MockAdapter(axios);
  const JIRA_URL = 'http://jira.local';
  const API_PATH = '/rest/api/2/issue';
  const BASE_PARAMS = {
    summary: 'Bug summary',
    description: 'desc',
    projectKey: 'TEST',
    jiraUrl: JIRA_URL,
    username: 'user',
    apiToken: 'token',
  };

  afterEach(() => mock.reset());

  it('should create a Jira issue', async () => {
    mock.onPost(`${JIRA_URL}${API_PATH}`).reply(201, { key: 'TEST-123' });
    const result = await createJiraIssue(BASE_PARAMS);
    expect(result.key).toBe('TEST-123');
    expect(result.url).toContain('TEST-123');
  });

  it('should handle Jira API error', async () => {
    mock.onPost(`${JIRA_URL}${API_PATH}`).reply(400, { errorMessages: ['Invalid project'] });
    await expect(createJiraIssue(BASE_PARAMS)).rejects.toThrow(/Invalid project/);
  });

  it('should handle Jira API timeout', async () => {
    mock.onPost(`${JIRA_URL}${API_PATH}`).timeout();
    await expect(createJiraIssue({ ...BASE_PARAMS, timeoutMs: 100 })).rejects.toThrow(/timed out/);
  });
}); 