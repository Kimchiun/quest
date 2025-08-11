-- =====================================================
-- 폴더 및 테스트케이스 관리 시스템 스키마
-- =====================================================

-- 트리 노드 테이블 (폴더와 테스트케이스를 통합)
CREATE TABLE IF NOT EXISTS tree_nodes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('folder', 'testcase')),
    parent_id INTEGER REFERENCES tree_nodes(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    created_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 트리 노드 이동 히스토리 테이블
CREATE TABLE IF NOT EXISTS tree_node_move_history (
    id SERIAL PRIMARY KEY,
    node_id INTEGER NOT NULL,
    old_parent_id INTEGER,
    new_parent_id INTEGER,
    old_sort_order INTEGER,
    new_sort_order INTEGER,
    moved_by VARCHAR(100) NOT NULL,
    moved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_tree_nodes_parent_id ON tree_nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_tree_nodes_type ON tree_nodes(type);
CREATE INDEX IF NOT EXISTS idx_tree_nodes_sort_order ON tree_nodes(sort_order);
CREATE INDEX IF NOT EXISTS idx_tree_nodes_name ON tree_nodes(name);

-- 트리거 함수: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리 노드 테이블 트리거
DROP TRIGGER IF EXISTS update_tree_nodes_updated_at ON tree_nodes;
CREATE TRIGGER update_tree_nodes_updated_at 
    BEFORE UPDATE ON tree_nodes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 기본 루트 폴더 생성
INSERT INTO tree_nodes (name, type, parent_id, sort_order, created_by) 
VALUES ('루트', 'folder', NULL, 0, 'system')
ON CONFLICT DO NOTHING; 