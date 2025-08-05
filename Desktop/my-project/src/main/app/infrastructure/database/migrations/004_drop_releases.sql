-- 릴리즈 관련 테이블 삭제
DROP TABLE IF EXISTS issue_comments CASCADE;
DROP TABLE IF EXISTS issues CASCADE;
DROP TABLE IF EXISTS releases CASCADE;

-- test_cases 테이블에서 release_id 컬럼 제거
ALTER TABLE test_cases DROP COLUMN IF EXISTS release_id; 