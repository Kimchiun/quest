import axios from 'axios';
import { createJiraIssue } from '../src/main/app/infrastructure/integrations/jiraClient';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('jiraClient (unit)', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a Jira issue', async () => {
    mockedAxios.post.mockResolvedValueOnce({ 
      status: 201, 
      data: { key: 'TEST-123' } 
    });
    
    const result = await createJiraIssue(BASE_PARAMS);
    expect(result.key).toBe('TEST-123');
    expect(result.url).toContain('TEST-123');
  });

  it('should handle Jira API error', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Invalid project'));
    
    await expect(createJiraIssue(BASE_PARAMS)).rejects.toThrow(/Invalid project/);
  });

  it('should handle Jira API timeout', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('timeout'));
    
    await expect(createJiraIssue({ ...BASE_PARAMS, timeoutMs: 100 })).rejects.toThrow(/timeout/);
  });
}); 