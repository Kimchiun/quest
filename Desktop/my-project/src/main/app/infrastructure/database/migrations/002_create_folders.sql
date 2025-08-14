-- tree_nodes 테이블 생성 (폴더와 테스트케이스를 모두 포함)
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

-- 테스트 케이스-폴더 관계 테이블 생성 (기존 구조 유지)
CREATE TABLE IF NOT EXISTS case_folders (
    id SERIAL PRIMARY KEY,
    testcase_id INTEGER NOT NULL,
    folder_id INTEGER NOT NULL REFERENCES tree_nodes(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- 중복 관계 방지
    UNIQUE(testcase_id, folder_id)
);

-- tree_nodes 테이블 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_tree_nodes_parent_id ON tree_nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_tree_nodes_type ON tree_nodes(type);
CREATE INDEX IF NOT EXISTS idx_tree_nodes_created_by ON tree_nodes(created_by);

-- 테스트 케이스-폴더 관계 테이블 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_case_folders_testcase_id ON case_folders(testcase_id);
CREATE INDEX IF NOT EXISTS idx_case_folders_folder_id ON case_folders(folder_id);

-- 루트 폴더 생성 (기본값)
INSERT INTO tree_nodes (name, type, created_by) 
VALUES ('Root', 'folder', 'system') 
ON CONFLICT DO NOTHING; 