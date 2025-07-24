CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    object_type VARCHAR(32) NOT NULL, -- testcase, execution, defect
    object_id INTEGER NOT NULL,
    author VARCHAR(64) NOT NULL,
    content TEXT NOT NULL,
    mentions TEXT[], -- 사용자 ID 목록
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- object_type/object_id 조합에 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_comments_object ON comments(object_type, object_id); 