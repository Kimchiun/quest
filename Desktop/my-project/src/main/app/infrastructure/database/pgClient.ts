import { Client } from 'pg';

const pgClient = new Client({
    user: process.env.PGUSER || 'postgres',
    host: process.env.PGHOST || 'localhost',
    database: process.env.PGDATABASE || 'quest',
    password: process.env.PGPASSWORD || 'password',
    port: Number(process.env.PGPORT) || 5432,
});

let isConnected = false;

export async function ensurePgConnected() {
    if (!isConnected) {
        await pgClient.connect();
        isConnected = true;
    }
}

export async function testPgConnection() {
    try {
        await ensurePgConnected();
        await pgClient.query('SELECT NOW()');
        return true;
    } catch (err) {
        return false;
    }
}

export default pgClient;

// users 테이블 생성 예시
// CREATE TABLE users (
//   id SERIAL PRIMARY KEY,
//   username VARCHAR(64) UNIQUE NOT NULL,
//   password VARCHAR(128) NOT NULL,
//   role VARCHAR(16) NOT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// ); 