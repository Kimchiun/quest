import { Comment } from '../models/Comment';
import { getPgClient, ensurePgConnected } from '../../../infrastructure/database/pgClient';

export const commentRepository = {
  async insert(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
    await ensurePgConnected();
    const pgClient = getPgClient();
    if (!pgClient) {
      throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    const now = new Date();
    const result = await pgClient.query(
      `INSERT INTO comments (object_type, object_id, author, content, mentions, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        comment.objectType,
        comment.objectId,
        comment.author,
        comment.content,
        comment.mentions,
        now,
        now
      ]
    );
    return mapRowToComment(result.rows[0]);
  },
  async findByObject(objectType: string, objectId: number): Promise<Comment[]> {
    await ensurePgConnected();
    const pgClient = getPgClient();
    if (!pgClient) {
      throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    const result = await pgClient.query(
      `SELECT * FROM comments WHERE object_type = $1 AND object_id = $2 ORDER BY created_at ASC`,
      [objectType, objectId]
    );
    return result.rows.map(mapRowToComment);
  },
  async update(id: number, content: string, mentions: string[]): Promise<Comment | null> {
    await ensurePgConnected();
    const pgClient = getPgClient();
    if (!pgClient) {
      throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    const now = new Date();
    const result = await pgClient.query(
      `UPDATE comments SET content = $1, mentions = $2, updated_at = $3 WHERE id = $4 RETURNING *`,
      [content, mentions, now, id]
    );
    if (result.rows.length === 0) return null;
    return mapRowToComment(result.rows[0]);
  },
  async delete(id: number): Promise<boolean> {
    await ensurePgConnected();
    const pgClient = getPgClient();
    if (!pgClient) {
      throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    const result = await pgClient.query(
      `DELETE FROM comments WHERE id = $1`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  },
};

function mapRowToComment(row: any): Comment {
  return {
    id: row.id,
    objectType: row.object_type,
    objectId: row.object_id,
    author: row.author,
    content: row.content,
    mentions: row.mentions || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
} 