import { Client } from 'pg';

let pgClient: Client | null = null;
let isConnected = false;

function createClient() {
    const config = {
        user: process.env.PGUSER || 'postgres',
        host: process.env.PGHOST || 'localhost',
        database: process.env.PGDATABASE || 'itms',
        password: process.env.PGPASSWORD,
        port: Number(process.env.PGPORT) || 5432,
    };

    // 비밀번호가 설정되지 않은 경우 undefined로 설정 (macOS에서는 비밀번호 없이도 접속 가능)
    if (!config.password) {
        config.password = undefined;
    }

    return new Client(config);
}

export async function ensurePgConnected() {
    if (!isConnected) {
        if (!pgClient) {
            pgClient = createClient();
        }
        await pgClient.connect();
        isConnected = true;
    }
}

export async function testPgConnection() {
    try {
        await ensurePgConnected();
        if (pgClient) {
            await pgClient.query('SELECT NOW()');
        }
        return true;
    } catch (err) {
        return false;
    }
}

export function getPgClient() {
    return pgClient;
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