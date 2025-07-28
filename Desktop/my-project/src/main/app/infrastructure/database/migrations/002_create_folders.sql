-- 폴더 테이블 생성
CREATE TABLE IF NOT EXISTS folders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES folders(id) ON DELETE CASCADE,
    created_by VARCHAR(64) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- 무한 루프 방지를 위한 체크 제약
    CONSTRAINT check_not_self_parent CHECK (id != parent_id)
);

-- 테스트 케이스-폴더 관계 테이블 생성
CREATE TABLE IF NOT EXISTS case_folders (
    id SERIAL PRIMARY KEY,
    testcase_id INTEGER NOT NULL REFERENCES testcases(id) ON DELETE CASCADE,
    folder_id INTEGER NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- 중복 관계 방지
    UNIQUE(testcase_id, folder_id)
);

-- 폴더 테이블 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_folders_created_by ON folders(created_by);

-- 테스트 케이스-폴더 관계 테이블 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_case_folders_testcase_id ON case_folders(testcase_id);
CREATE INDEX IF NOT EXISTS idx_case_folders_folder_id ON case_folders(folder_id);

-- 루트 폴더 생성 (기본값)
INSERT INTO folders (name, description, created_by) 
VALUES ('Root', '루트 폴더', 'system') 
ON CONFLICT DO NOTHING; 