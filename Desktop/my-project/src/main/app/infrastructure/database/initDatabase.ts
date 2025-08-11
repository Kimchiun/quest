import { getPgClient, ensurePgConnected } from './pgClient';
import * as fs from 'fs';
import * as path from 'path';
import bcrypt from 'bcrypt';

export async function initializeDatabase() {
    try {
        // PostgreSQL 연결 확인
        await ensurePgConnected();
        console.log('PostgreSQL 연결: 성공');

        const pgClient = getPgClient();
        if (!pgClient) {
            throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
        }

        // 스키마 파일 읽기
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

        // 스키마 실행
        await pgClient.query(schemaSQL);
        console.log('데이터베이스 스키마 초기화 완료');

        // 마이그레이션 실행
        await runMigrations(pgClient);

        // 테스트용 사용자 생성
        await createTestUsers(pgClient);

        // 테이블 존재 확인
        const tables = ['defects', 'attachments', 'activity_logs', 'comments', 'releases', 'release_test_cases', 'release_issues'];
        for (const table of tables) {
            const result = await pgClient.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = $1
                );
            `, [table]);
            
            if (result.rows[0].exists) {
                console.log(`✅ ${table} 테이블 확인됨`);
            } else {
                console.log(`❌ ${table} 테이블이 존재하지 않음`);
            }
        }

        // 샘플 데이터 확인
        const defectCount = await pgClient.query('SELECT COUNT(*) FROM defects');
        console.log(`📊 결함 데이터: ${defectCount.rows[0].count}개`);

        const logCount = await pgClient.query('SELECT COUNT(*) FROM activity_logs');
        console.log(`📊 활동 로그: ${logCount.rows[0].count}개`);

        const commentCount = await pgClient.query('SELECT COUNT(*) FROM comments');
        console.log(`📊 코멘트: ${commentCount.rows[0].count}개`);

    } catch (error) {
        console.error('데이터베이스 초기화 오류:', error);
        console.log('⚠️ 데이터베이스 초기화 실패했지만 서버는 계속 실행됩니다.');
        // 에러를 throw하지 않고 서버가 계속 실행되도록 함
    }
}

async function createTestUsers(pgClient: any) {
    try {
        // 기존 사용자 확인
        const existingUser = await pgClient.query('SELECT COUNT(*) FROM users WHERE username = $1', ['admin@test.com']);
        
        if (existingUser.rows[0].count === '0') {
            // 테스트용 사용자 생성
            const hashedPassword = await bcrypt.hash('password123', 10);
            
            await pgClient.query(`
                INSERT INTO users (username, password, role) 
                VALUES ($1, $2, $3)
            `, ['admin@test.com', hashedPassword, 'ADMIN']);
            
            console.log('✅ 테스트용 사용자 생성 완료: admin@test.com / password123');
        } else {
            console.log('✅ 테스트용 사용자 이미 존재함: admin@test.com');
        }
    } catch (error) {
        console.error('테스트용 사용자 생성 실패:', error);
    }
}

export async function testDatabaseConnection() {
    try {
        const pgClient = getPgClient();
        if (!pgClient) {
            throw new Error('PostgreSQL 클라이언트가 초기화되지 않았습니다.');
        }
        await pgClient.query('SELECT NOW()');
        return true;
    } catch (error) {
        console.error('데이터베이스 연결 테스트 실패:', error);
        return false;
    }
}

async function runMigrations(pgClient: any) {
    try {
        console.log('📦 릴리즈 관리 마이그레이션 실행 중...');
        
        // 릴리즈 관련 마이그레이션 파일 실행
        const migrationPath = path.join(__dirname, 'migrations', '005_create_releases.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        await pgClient.query(migrationSQL);
        console.log('✅ 릴리즈 관리 마이그레이션 완료');
        
        // 릴리즈 테이블 데이터 확인
        const releaseCountResult = await pgClient.query('SELECT COUNT(*) as count FROM releases');
        console.log(`📊 릴리즈 데이터: ${releaseCountResult.rows[0].count}개`);
        
    } catch (error) {
        console.error('❌ 릴리즈 마이그레이션 실패:', error);
        // 마이그레이션 실패해도 서버는 계속 실행
    }
} 