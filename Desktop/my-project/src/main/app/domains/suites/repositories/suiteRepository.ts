import pgClient, { ensurePgConnected } from '../../../infrastructure/database/pgClient';
import { Suite, SuiteCase } from '../models/Suite';

export async function createSuite(data: Omit<Suite, 'id' | 'createdAt'>): Promise<Suite> {
  await ensurePgConnected();
  const result = await pgClient.query(
    `INSERT INTO suites (release_id, name, description, executor, environment, due_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [data.releaseId, data.name, data.description, data.executor, data.environment, data.dueDate]
  );
  return rowToSuite(result.rows[0]);
}

export async function updateSuite(id: number, patch: Partial<Suite>): Promise<Suite | null> {
  await ensurePgConnected();
  const result = await pgClient.query(
    `UPDATE suites SET name=$1, description=$2, executor=$3, environment=$4, due_date=$5 WHERE id=$6 RETURNING *`,
    [patch.name, patch.description, patch.executor, patch.environment, patch.dueDate, id]
  );
  if (result.rows.length === 0) return null;
  return rowToSuite(result.rows[0]);
}

export async function deleteSuite(id: number): Promise<boolean> {
  await ensurePgConnected();
  const result = await pgClient.query('DELETE FROM suites WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}

export async function listSuites(): Promise<Suite[]> {
  await ensurePgConnected();
  const result = await pgClient.query('SELECT * FROM suites ORDER BY id');
  return result.rows.map(rowToSuite);
}

export async function assignCaseToSuite(suiteId: number, testcaseId: number): Promise<void> {
  await ensurePgConnected();
  await pgClient.query('INSERT INTO suite_cases (suite_id, testcase_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [suiteId, testcaseId]);
}

export async function removeCaseFromSuite(suiteId: number, testcaseId: number): Promise<void> {
  await ensurePgConnected();
  await pgClient.query('DELETE FROM suite_cases WHERE suite_id = $1 AND testcase_id = $2', [suiteId, testcaseId]);
}

export async function listCasesInSuite(suiteId: number): Promise<number[]> {
  await ensurePgConnected();
  const result = await pgClient.query('SELECT testcase_id FROM suite_cases WHERE suite_id = $1', [suiteId]);
  return result.rows.map((row: any) => row.testcase_id);
}

export async function suiteCaseCount(suiteId: number): Promise<number> {
  await ensurePgConnected();
  const result = await pgClient.query('SELECT COUNT(*) FROM suite_cases WHERE suite_id = $1', [suiteId]);
  return Number(result.rows[0].count);
}

function rowToSuite(row: any): Suite {
  return {
    id: row.id,
    releaseId: row.release_id,
    name: row.name,
    description: row.description,
    executor: row.executor,
    environment: row.environment,
    dueDate: row.due_date,
    createdAt: row.created_at,
  };
} 