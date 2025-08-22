CREATE TABLE IF NOT EXISTS executions (
    id SERIAL PRIMARY KEY,
    testcase_id INTEGER NOT NULL REFERENCES testcases(id) ON DELETE CASCADE,
    suite_id INTEGER REFERENCES suites(id) ON DELETE SET NULL,
    release_id UUID REFERENCES releases(id) ON DELETE SET NULL,
    status VARCHAR(16) NOT NULL CHECK (status IN ('Pass', 'Fail', 'Blocked', 'Untested')),
    executed_by VARCHAR(64) NOT NULL,
    executed_at TIMESTAMP NOT NULL,
    repro_steps TEXT,
    screenshot_path VARCHAR(256),
    log_file_path VARCHAR(256),
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
); 