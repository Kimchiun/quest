-- 릴리즈 테이블 생성
CREATE TABLE IF NOT EXISTS releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    version VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PLANNING' CHECK (status IN ('PLANNING', 'IN_PROGRESS', 'TESTING', 'READY', 'DEPLOYED', 'COMPLETED', 'CANCELLED')),
    assignee_id UUID,
    assignee_name VARCHAR(255),
    scheduled_date TIMESTAMP WITH TIME ZONE,
    deployed_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 릴리즈 테스트 케이스 테이블 생성
CREATE TABLE IF NOT EXISTS release_test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    release_id UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
    test_case_id UUID,
    test_case_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'NOT_EXECUTED' CHECK (status IN ('NOT_EXECUTED', 'PASSED', 'FAILED', 'BLOCKED', 'SKIPPED')),
    assignee_id UUID,
    assignee_name VARCHAR(255),
    executed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 릴리즈 이슈 테이블 생성
CREATE TABLE IF NOT EXISTS release_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    release_id UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL DEFAULT 'BUG' CHECK (type IN ('BUG', 'FEATURE', 'IMPROVEMENT', 'TASK')),
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    assignee_id UUID,
    assignee_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 릴리즈 변경 로그 테이블 생성
CREATE TABLE IF NOT EXISTS release_change_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    release_id UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL DEFAULT 'FEATURE' CHECK (type IN ('FEATURE', 'BUGFIX', 'IMPROVEMENT', 'BREAKING_CHANGE')),
    author VARCHAR(255) NOT NULL,
    commit_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 릴리즈 회고 테이블 생성
CREATE TABLE IF NOT EXISTS release_retrospectives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    release_id UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
    author_id UUID,
    author_name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'WHAT_WENT_WELL' CHECK (type IN ('WHAT_WENT_WELL', 'WHAT_COULD_BE_IMPROVED', 'ACTION_ITEMS')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_releases_status ON releases(status);
CREATE INDEX IF NOT EXISTS idx_releases_created_at ON releases(created_at);
CREATE INDEX IF NOT EXISTS idx_release_test_cases_release_id ON release_test_cases(release_id);
CREATE INDEX IF NOT EXISTS idx_release_test_cases_status ON release_test_cases(status);
CREATE INDEX IF NOT EXISTS idx_release_issues_release_id ON release_issues(release_id);
CREATE INDEX IF NOT EXISTS idx_release_issues_status ON release_issues(status);
CREATE INDEX IF NOT EXISTS idx_release_change_logs_release_id ON release_change_logs(release_id);
CREATE INDEX IF NOT EXISTS idx_release_retrospectives_release_id ON release_retrospectives(release_id);

-- 트리거 생성 (updated_at 자동 업데이트)
DROP TRIGGER IF EXISTS update_releases_updated_at ON releases;
CREATE TRIGGER update_releases_updated_at 
    BEFORE UPDATE ON releases 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_release_test_cases_updated_at ON release_test_cases;
CREATE TRIGGER update_release_test_cases_updated_at 
    BEFORE UPDATE ON release_test_cases 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_release_issues_updated_at ON release_issues;
CREATE TRIGGER update_release_issues_updated_at 
    BEFORE UPDATE ON release_issues 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_release_retrospectives_updated_at ON release_retrospectives;
CREATE TRIGGER update_release_retrospectives_updated_at 
    BEFORE UPDATE ON release_retrospectives 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 샘플 데이터 삽입
INSERT INTO releases (name, version, description, status, assignee_name, scheduled_date) VALUES
('Quest v2.0', '2.0.0', '메이저 업데이트 - 새로운 테스트 관리 시스템', 'IN_PROGRESS', '김개발', '2024-03-15 00:00:00+09'),
('Quest v1.5', '1.5.0', '릴리즈 관리 기능 추가', 'TESTING', '박테스터', '2024-02-28 00:00:00+09'),
('Quest v1.4.2', '1.4.2', '버그 수정 및 성능 개선', 'DEPLOYED', '이운영', '2024-02-10 00:00:00+09'),
('Quest v1.4.1', '1.4.1', '긴급 보안 패치', 'COMPLETED', '최보안', '2024-01-25 00:00:00+09'),
('Quest v1.4', '1.4.0', '사용자 플로우 관리 기능 개선', 'COMPLETED', '정기획', '2024-01-15 00:00:00+09')
ON CONFLICT DO NOTHING;

-- 샘플 테스트 케이스 데이터
INSERT INTO release_test_cases (release_id, test_case_name, status, assignee_name) 
SELECT 
    r.id,
    '로그인 기능 테스트',
    'PASSED',
    '테스터A'
FROM releases r WHERE r.version = '2.0.0'
UNION ALL
SELECT 
    r.id,
    '대시보드 렌더링 테스트',
    'NOT_EXECUTED',
    '테스터B'
FROM releases r WHERE r.version = '2.0.0'
UNION ALL
SELECT 
    r.id,
    '테스트 케이스 CRUD 테스트',
    'FAILED',
    '테스터C'
FROM releases r WHERE r.version = '2.0.0'
ON CONFLICT DO NOTHING;

-- 샘플 이슈 데이터
INSERT INTO release_issues (release_id, title, description, type, status, priority, assignee_name)
SELECT 
    r.id,
    '로그인 후 대시보드 로딩 지연',
    '로그인 성공 후 대시보드 페이지 로딩이 3초 이상 소요됨',
    'BUG',
    'OPEN',
    'HIGH',
    '개발자A'
FROM releases r WHERE r.version = '2.0.0'
UNION ALL
SELECT 
    r.id,
    '테스트 케이스 검색 기능 개선',
    '테스트 케이스 검색 시 부분 일치 검색 지원 필요',
    'IMPROVEMENT',
    'IN_PROGRESS',
    'MEDIUM',
    '개발자B'
FROM releases r WHERE r.version = '2.0.0'
ON CONFLICT DO NOTHING;

-- 샘플 변경 로그 데이터
INSERT INTO release_change_logs (release_id, title, description, type, author, commit_hash)
SELECT 
    r.id,
    'Add release management module',
    '릴리즈 관리 모듈 추가 - 백엔드 API 및 프론트엔드 UI',
    'FEATURE',
    'developer@quest.com',
    'a1b2c3d4'
FROM releases r WHERE r.version = '2.0.0'
UNION ALL
SELECT 
    r.id,
    'Fix dashboard loading issue',
    '대시보드 초기 로딩 성능 개선',
    'BUGFIX',
    'developer@quest.com',
    'e5f6g7h8'
FROM releases r WHERE r.version = '2.0.0'
ON CONFLICT DO NOTHING;

-- 샘플 회고 데이터
INSERT INTO release_retrospectives (release_id, author_name, content, type)
SELECT 
    r.id,
    '프로젝트 매니저',
    '릴리즈 관리 기능이 잘 구현되어 팀의 생산성이 향상되었습니다.',
    'WHAT_WENT_WELL'
FROM releases r WHERE r.version = '1.5.0'
UNION ALL
SELECT 
    r.id,
    '개발팀 리드',
    '테스트 자동화 부분이 부족했습니다. 다음 릴리즈에서는 CI/CD 파이프라인을 강화해야 합니다.',
    'WHAT_COULD_BE_IMPROVED'
FROM releases r WHERE r.version = '1.5.0'
ON CONFLICT DO NOTHING;