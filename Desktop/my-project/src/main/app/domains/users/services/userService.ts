import { User, UserRole } from '../models/User';
import { getPgClient } from '../../../infrastructure/database/pgClient';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function createUser(username: string, password: string, role: UserRole): Promise<User> {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const pgClient = getPgClient();
    if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    const result = await pgClient.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, password, role, created_at',
        [username, hash, role]
    );
    return {
        id: result.rows[0].id,
        username: result.rows[0].username,
        password: result.rows[0].password,
        role: result.rows[0].role,
        createdAt: result.rows[0].created_at,
    };
}

export async function findUserByUsername(username: string): Promise<User | null> {
    const pgClient = getPgClient();
    if (!pgClient) {
        throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
    }
    const result = await pgClient.query(
        'SELECT id, username, password, role, created_at FROM users WHERE username = $1',
        [username]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
        id: row.id,
        username: row.username,
        password: row.password,
        role: row.role,
        createdAt: row.created_at,
    };
}

export async function validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
} 