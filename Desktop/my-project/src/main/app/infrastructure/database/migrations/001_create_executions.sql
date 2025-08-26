CREATE TABLE IF NOT EXISTS executions (
    id SERIAL PRIMARY KEY,
    testcase_id INTEGER NOT NULL REFERENCES testcases(id) ON DELETE CASCADE,
    release_id UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'Untested' CHECK (status IN ('Pass', 'Fail', 'Blocked', 'Untested')),
    executed_by VARCHAR(100),
    executed_at TIMESTAMP,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(release_id, testcase_id)
); 