-- 폴더 테이블에 sort_order 컬럼 추가
ALTER TABLE folders ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- testcases 테이블에 필요한 컬럼들 추가
ALTER TABLE testcases ADD COLUMN IF NOT EXISTS folder_id INTEGER REFERENCES folders(id) ON DELETE CASCADE;
ALTER TABLE testcases ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE testcases ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'draft';
ALTER TABLE testcases ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'medium';
ALTER TABLE testcases ADD COLUMN IF NOT EXISTS created_by VARCHAR(100) DEFAULT 'system';
ALTER TABLE testcases ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_folders_sort_order ON folders(sort_order);
CREATE INDEX IF NOT EXISTS idx_testcases_folder_id ON testcases(folder_id);
CREATE INDEX IF NOT EXISTS idx_testcases_sort_order ON testcases(sort_order);

-- 샘플 데이터 삽입
INSERT INTO folders (name, description, parent_id, sort_order, created_by) 
VALUES ('루트', '최상위 폴더', NULL, 0, 'system')
ON CONFLICT (id) DO NOTHING;

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
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_testcases_updated_at ON testcases;
CREATE TRIGGER update_testcases_updated_at 
    BEFORE UPDATE ON testcases 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- tree_nodes 테이블 트리거도 안전하게 처리
DROP TRIGGER IF EXISTS update_tree_nodes_updated_at ON tree_nodes;
CREATE TRIGGER update_tree_nodes_updated_at 
    BEFORE UPDATE ON tree_nodes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 