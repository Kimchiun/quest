import { createTestCase, getTestCaseById, updateTestCase, deleteTestCase, listTestCases, createTestCaseVersion, listTestCaseVersions } from '../repositories/testCaseRepository';
import { indexTestCase, removeTestCaseFromIndex } from '../elasticsearch/testCaseIndexer';
import { TestCase, TestCaseVersion } from '../models/TestCase';

function omitFields<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const copy = { ...obj };
    keys.forEach(k => { delete (copy as any)[k]; });
    return copy as Omit<T, K>;
}

export async function createTestCaseWithVersion(tc: Omit<TestCase, 'id' | 'createdAt' | 'updatedAt'>): Promise<TestCase> {
    const created = await createTestCase(tc);
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
    const before = await getTestCaseById(id);
    if (!before) return null;
    const updated = await updateTestCase(id, patch);
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
    const ok = await deleteTestCase(id);
    if (ok) await removeTestCaseFromIndex(id);
    return ok;
}

export async function getTestCaseVersions(id: number): Promise<TestCaseVersion[]> {
    return listTestCaseVersions(id);
} 