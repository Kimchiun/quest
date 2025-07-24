import pgClient, { ensurePgConnected } from '../../../infrastructure/database/pgClient';
import { Release } from '../models/Release';
import { Suite } from '../../suites/models/Suite';

export async function createRelease(data: Omit<Release, 'id' | 'createdAt'>): Promise<Release> {
  await ensurePgConnected();
  const result = await pgClient.query(
    `INSERT INTO releases (name, description, start_date, end_date) VALUES ($1, $2, $3, $4) RETURNING *`,
    [data.name, data.description, data.startDate, data.endDate]
  );
  return rowToRelease(result.rows[0]);
}

export async function listReleases(): Promise<Release[]> {
  await ensurePgConnected();
  const result = await pgClient.query('SELECT * FROM releases ORDER BY id DESC');
  return result.rows.map(rowToRelease);
}

export async function getReleaseById(id: number): Promise<Release | null> {
  await ensurePgConnected();
  const result = await pgClient.query('SELECT * FROM releases WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return rowToRelease(result.rows[0]);
}

export async function updateRelease(id: number, patch: Partial<Release>): Promise<Release | null> {
  await ensurePgConnected();
  const current = await getReleaseById(id);
  if (!current) return null;
  const result = await pgClient.query(
    `UPDATE releases SET name=$1, description=$2, start_date=$3, end_date=$4 WHERE id=$5 RETURNING *`,
    [patch.name ?? current.name, patch.description ?? current.description, patch.startDate ?? current.startDate, patch.endDate ?? current.endDate, id]
  );
  if (result.rows.length === 0) return null;
  return rowToRelease(result.rows[0]);
}

export async function deleteRelease(id: number): Promise<boolean> {
  await ensurePgConnected();
  const result = await pgClient.query('DELETE FROM releases WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}

export async function listSuitesByRelease(releaseId: number): Promise<Suite[]> {
  await ensurePgConnected();
  const result = await pgClient.query('SELECT * FROM suites WHERE release_id = $1 ORDER BY id', [releaseId]);
  return result.rows.map(rowToSuite);
}

function rowToRelease(row: any): Release {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    startDate: row.start_date,
    endDate: row.end_date,
    createdAt: row.created_at,
  };
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