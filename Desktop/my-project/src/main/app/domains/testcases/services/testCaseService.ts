import { createTestCase as createTestCaseRepo, getTestCaseById as getTestCaseByIdRepo, updateTestCase as updateTestCaseRepo, deleteTestCase as deleteTestCaseRepo, listTestCases, createTestCaseVersion, listTestCaseVersions } from '../repositories/testCaseRepository';
import { indexTestCase, removeTestCaseFromIndex } from '../elasticsearch/testCaseIndexer';
import { TestCase, TestCaseVersion } from '../types';

function omitFields<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const copy = { ...obj };
    keys.forEach(k => { delete (copy as any)[k]; });
    return copy as Omit<T, K>;
}

export async function createTestCaseWithVersion(tc: Omit<TestCase, 'id' | 'createdAt' | 'updatedAt'>): Promise<TestCase> {
    const created = await createTestCaseRepo(tc);
    await createTestCaseVersion({
        testcaseId: created.id,
        version: 1,
        data: { ...tc },
        createdBy: tc.createdBy,
    });
    await indexTestCase(created);
    return created;
}

export async function updateTestCaseWithVersion(id: number, patch: Partial<TestCase>, user: string): Promise<TestCase | null> {
    const before = await getTestCaseByIdRepo(id);
    if (!before) return null;
    const updated = await updateTestCaseRepo(id, patch);
    if (!updated) return null;
    const versions = await listTestCaseVersions(id);
    await createTestCaseVersion({
        testcaseId: id,
        version: (versions[0]?.version || 1) + 1,
        data: omitFields(updated, ['id', 'createdAt', 'updatedAt']),
        createdBy: user,
    });
    await indexTestCase(updated);
    return updated;
}

export async function deleteTestCaseWithIndex(id: number): Promise<boolean> {
    const ok = await deleteTestCaseRepo(id);
    if (ok) await removeTestCaseFromIndex(id);
    return ok;
}

export async function getTestCaseVersions(id: number): Promise<TestCaseVersion[]> {
    return listTestCaseVersions(id);
}

// 컨트롤러에서 사용할 메서드들
export async function getTestCases(params: {
    page: number;
    limit: number;
    search?: string;
    folderId?: number;
}): Promise<{ testCases: TestCase[]; total: number }> {
    const testCases = await listTestCases();
    
    // 간단한 필터링 (실제로는 repository에서 처리해야 함)
    let filteredCases = testCases;
    
    if (params.search) {
        filteredCases = filteredCases.filter(tc => 
            tc.title.toLowerCase().includes(params.search!.toLowerCase()) ||
            tc.prereq?.toLowerCase().includes(params.search!.toLowerCase()) ||
            tc.expected?.toLowerCase().includes(params.search!.toLowerCase())
        );
    }
    
    if (params.folderId) {
        filteredCases = filteredCases.filter(tc => tc.folderId === params.folderId);
    }
    
    // 페이징 처리
    const offset = (params.page - 1) * params.limit;
    const paginatedCases = filteredCases.slice(offset, offset + params.limit);
    
    return { 
        testCases: paginatedCases, 
        total: filteredCases.length 
    };
}

export async function getTestCaseById(id: number): Promise<TestCase | null> {
    return await getTestCaseByIdRepo(id);
}

export async function createTestCase(data: Omit<TestCase, 'id' | 'createdAt' | 'updatedAt'>): Promise<TestCase> {
    return await createTestCaseWithVersion(data);
}

export async function updateTestCase(id: number, data: Partial<TestCase>): Promise<TestCase | null> {
    return await updateTestCaseWithVersion(id, data, data.createdBy || 'system');
}

export async function deleteTestCase(id: number): Promise<boolean> {
    return await deleteTestCaseWithIndex(id);
} 