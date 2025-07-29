-- 결함 테이블
CREATE TABLE IF NOT EXISTS defects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'open',
    priority VARCHAR(50) NOT NULL DEFAULT 'medium',
    assignee VARCHAR(100),
    reporter VARCHAR(100) NOT NULL,
    created_by VARCHAR(100) NOT NULL,
    test_case_id INTEGER,
    release_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP
);

-- 첨부파일 테이블
CREATE TABLE IF NOT EXISTS attachments (
    id SERIAL PRIMARY KEY,
    defect_id INTEGER REFERENCES defects(id) ON DELETE CASCADE,
    test_case_id INTEGER,
    name VARCHAR(255) NOT NULL,
    size BIGINT NOT NULL,
    type VARCHAR(100) NOT NULL,
    uploaded_by VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_path VARCHAR(500) NOT NULL,
    url VARCHAR(500) NOT NULL
);

-- 활동 로그 테이블
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    defect_id INTEGER REFERENCES defects(id) ON DELETE CASCADE,
    test_case_id INTEGER,
    action VARCHAR(100) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT,
    type VARCHAR(50) NOT NULL
);

-- 코멘트 테이블
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    defect_id INTEGER REFERENCES defects(id) ON DELETE CASCADE,
    test_case_id INTEGER,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_defects_status ON defects(status);
CREATE INDEX IF NOT EXISTS idx_defects_priority ON defects(priority);
CREATE INDEX IF NOT EXISTS idx_defects_assignee ON defects(assignee);
CREATE INDEX IF NOT EXISTS idx_defects_created_at ON defects(created_at);
CREATE INDEX IF NOT EXISTS idx_attachments_defect_id ON attachments(defect_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_defect_id ON activity_logs(defect_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_date ON activity_logs(date);
CREATE INDEX IF NOT EXISTS idx_comments_defect_id ON comments(defect_id);

-- 샘플 데이터 삽입
INSERT INTO defects (title, description, status, priority, assignee, reporter, created_by, test_case_id, release_id) VALUES
('로그인 페이지 로딩 지연', '사용자 로그인 시 페이지 로딩이 5초 이상 걸리는 문제', 'open', 'high', 'developer1', 'tester1', 'tester1', 1, 1),
('결제 프로세스 오류', '결제 완료 후 성공 페이지가 표시되지 않는 문제', 'in_progress', 'critical', 'developer2', 'tester2', 'tester2', 2, 1),
('모바일 반응형 레이아웃 깨짐', '768px 이하 화면에서 레이아웃이 깨지는 문제', 'resolved', 'medium', 'developer3', 'tester3', 'tester3', 3, 1);

INSERT INTO activity_logs (defect_id, action, user_name, details, type) VALUES
(1, '결함 생성', 'tester1', '새로운 결함이 생성되었습니다.', 'create'),
(1, '상태 변경', 'developer1', '상태가 OPEN에서 IN_PROGRESS로 변경되었습니다.', 'status_change'),
(2, '결함 생성', 'tester2', '결제 관련 결함이 생성되었습니다.', 'create'),
(3, '결함 생성', 'tester3', '모바일 레이아웃 문제가 보고되었습니다.', 'create'),
(3, '상태 변경', 'developer3', '상태가 OPEN에서 RESOLVED로 변경되었습니다.', 'status_change');

INSERT INTO comments (defect_id, content, author) VALUES
(1, '로그인 성능 개선 작업을 시작하겠습니다.', 'developer1'),
(1, '테스트 완료 후 결과를 확인해주세요.', 'tester1'),
(2, '결제 모듈 코드를 검토 중입니다.', 'developer2'),
(3, '모바일 CSS 수정 완료했습니다.', 'developer3'); 