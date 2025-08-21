-- 폴더 테이블에 고급 기능 컬럼 추가
ALTER TABLE folders ADD COLUMN IF NOT EXISTS testcase_count INTEGER DEFAULT 0;
ALTER TABLE folders ADD COLUMN IF NOT EXISTS is_expanded BOOLEAN DEFAULT true;
ALTER TABLE folders ADD COLUMN IF NOT EXISTS is_readonly BOOLEAN DEFAULT false;
ALTER TABLE folders ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{"read": true, "write": true, "delete": true, "manage": true}'::jsonb;

-- 테스트케이스 개수 자동 업데이트 함수 (간단 버전)
CREATE OR REPLACE FUNCTION update_folder_testcase_count()
RETURNS TRIGGER AS $$
BEGIN
    -- 모든 폴더의 테스트케이스 개수를 재계산
    UPDATE folders 
    SET testcase_count = (
        SELECT COUNT(*) 
        FROM testcases 
        WHERE folder_id = folders.id
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 테스트케이스 변경 시 폴더 개수 업데이트 트리거
DROP TRIGGER IF EXISTS trigger_update_folder_testcase_count ON testcases;
CREATE TRIGGER trigger_update_folder_testcase_count
    AFTER INSERT OR UPDATE OR DELETE ON testcases
    FOR EACH ROW EXECUTE FUNCTION update_folder_testcase_count();

-- 폴더 변경 시 상위 폴더 개수 업데이트 트리거
DROP TRIGGER IF EXISTS trigger_update_parent_folder_testcase_count ON folders;
CREATE TRIGGER trigger_update_parent_folder_testcase_count
    AFTER INSERT OR UPDATE OR DELETE ON folders
    FOR EACH ROW EXECUTE FUNCTION update_folder_testcase_count();

-- 순환 참조 방지 함수
CREATE OR REPLACE FUNCTION check_circular_reference()
RETURNS TRIGGER AS $$
DECLARE
    has_circular_reference BOOLEAN := FALSE;
BEGIN
    -- 자기 자신을 부모로 설정하는 경우 방지
    IF NEW.parent_id = NEW.id THEN
        RAISE EXCEPTION '자기 자신을 부모로 설정할 수 없습니다.';
    END IF;
    
    -- 순환 참조 검사
    IF NEW.parent_id IS NOT NULL THEN
        WITH RECURSIVE folder_ancestors AS (
            SELECT id, parent_id
            FROM folders
            WHERE id = NEW.parent_id
            
            UNION ALL
            
            SELECT f.id, f.parent_id
            FROM folders f
            INNER JOIN folder_ancestors fa ON f.id = fa.parent_id
        )
        SELECT EXISTS(
            SELECT 1 FROM folder_ancestors WHERE id = NEW.id
        ) INTO has_circular_reference;
        
        IF has_circular_reference THEN
            RAISE EXCEPTION '순환 참조가 감지되었습니다.';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 순환 참조 방지 트리거
DROP TRIGGER IF EXISTS trigger_check_circular_reference ON folders;
CREATE TRIGGER trigger_check_circular_reference
    BEFORE INSERT OR UPDATE ON folders
    FOR EACH ROW EXECUTE FUNCTION check_circular_reference();

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_folders_testcase_count ON folders(testcase_count);
CREATE INDEX IF NOT EXISTS idx_folders_is_expanded ON folders(is_expanded);
CREATE INDEX IF NOT EXISTS idx_folders_is_readonly ON folders(is_readonly);

 