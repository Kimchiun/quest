-- 폴더 테이블에 sort_order 컬럼 추가
ALTER TABLE folders ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- testcases 테이블에 필요한 컬럼들 추가
ALTER TABLE testcases ADD COLUMN IF NOT EXISTS folder_id INTEGER REFERENCES folders(id) ON DELETE CASCADE;
ALTER TABLE testcases ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE testcases ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'draft';
ALTER TABLE testcases ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'medium';
ALTER TABLE testcases ADD COLUMN IF NOT EXISTS created_by VARCHAR(100) DEFAULT 'system';
ALTER TABLE testcases ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- releases 테이블에 새로운 필드들 추가
ALTER TABLE releases ADD COLUMN IF NOT EXISTS version VARCHAR(50);
ALTER TABLE releases ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Planning';
ALTER TABLE releases ADD COLUMN IF NOT EXISTS assignee VARCHAR(100);
ALTER TABLE releases ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0;
ALTER TABLE releases ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 릴리즈-테스트케이스 연결 테이블 생성
CREATE TABLE IF NOT EXISTS release_test_cases (
    id SERIAL PRIMARY KEY,
    release_id UUID NOT NULL,
    test_case_id INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'Not Run',
    assignee_name VARCHAR(100),
    executed_at TIMESTAMP,
    executed_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(release_id, test_case_id)
);

-- 실행 결과 테이블 생성
CREATE TABLE IF NOT EXISTS executions (
    id SERIAL PRIMARY KEY,
    release_id UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
    testcase_id INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'Untested' CHECK (status IN ('Pass', 'Fail', 'Blocked', 'Untested')),
    executed_by VARCHAR(100),
    executed_at TIMESTAMP,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- UNIQUE 제약 조건 추가 (기존 테이블이 있는 경우를 위해 별도로 추가)
ALTER TABLE executions ADD CONSTRAINT IF NOT EXISTS executions_release_id_testcase_id_unique 
    UNIQUE (release_id, testcase_id);

-- tree_nodes 테이블 생성 (폴더 구조용)
CREATE TABLE IF NOT EXISTS tree_nodes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('folder', 'testcase')),
    parent_id INTEGER REFERENCES tree_nodes(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    created_by VARCHAR(100) NOT NULL,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_folders_sort_order ON folders(sort_order);
CREATE INDEX IF NOT EXISTS idx_testcases_folder_id ON testcases(folder_id);
CREATE INDEX IF NOT EXISTS idx_testcases_sort_order ON testcases(sort_order);
CREATE INDEX IF NOT EXISTS idx_releases_status ON releases(status);
CREATE INDEX IF NOT EXISTS idx_releases_assignee ON releases(assignee);
CREATE INDEX IF NOT EXISTS idx_release_test_cases_release_id ON release_test_cases(release_id);
CREATE INDEX IF NOT EXISTS idx_release_test_cases_test_case_id ON release_test_cases(test_case_id);
CREATE INDEX IF NOT EXISTS idx_executions_release_id ON executions(release_id);
CREATE INDEX IF NOT EXISTS idx_executions_testcase_id ON executions(testcase_id);
CREATE INDEX IF NOT EXISTS idx_tree_nodes_parent_id ON tree_nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_tree_nodes_type ON tree_nodes(type);

-- 샘플 데이터 삽입
INSERT INTO folders (name, description, parent_id, sort_order, created_by) 
VALUES ('루트', '최상위 폴더', NULL, 0, 'system')
ON CONFLICT (id) DO NOTHING;

-- 루트 폴더를 tree_nodes에도 추가
INSERT INTO tree_nodes (name, type, created_by) 
VALUES ('루트', 'folder', 'system')
ON CONFLICT DO NOTHING;

-- 트리거 함수 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 안전하게 재생성 (기존 트리거 삭제 후 생성)
DROP TRIGGER IF EXISTS update_folders_updated_at ON folders;
CREATE TRIGGER update_folders_updated_at
    BEFORE UPDATE ON folders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_testcases_updated_at ON testcases;
CREATE TRIGGER update_testcases_updated_at
    BEFORE UPDATE ON testcases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_releases_updated_at ON releases;
CREATE TRIGGER update_releases_updated_at
    BEFORE UPDATE ON releases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_release_test_cases_updated_at ON release_test_cases;
CREATE TRIGGER update_release_test_cases_updated_at
    BEFORE UPDATE ON release_test_cases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_executions_updated_at ON executions;
CREATE TRIGGER update_executions_updated_at
    BEFORE UPDATE ON executions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tree_nodes_updated_at ON tree_nodes;
CREATE TRIGGER update_tree_nodes_updated_at
    BEFORE UPDATE ON tree_nodes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 