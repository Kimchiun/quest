import { Folder, CreateFolderRequest, UpdateFolderRequest, MoveFolderRequest, FolderTree } from '../types';
import * as folderRepository from '../repositories/folderRepository';
import * as testCaseRepository from '../../testcases/repositories/testCaseRepository';

// 기본 CRUD 작업
export async function createFolder(folderData: CreateFolderRequest): Promise<Folder> {
    // 순환 참조 검사
    if (folderData.parentId) {
        const hasCircularReference = await checkCircularReference(folderData.parentId, folderData.parentId);
        if (hasCircularReference) {
            throw new Error('순환 참조가 감지되었습니다.');
        }
    }
    
    return await folderRepository.createFolder(folderData);
}

export async function getFolderById(id: number): Promise<Folder | null> {
    return await folderRepository.getFolderById(id);
}

export async function updateFolder(id: number, folderData: UpdateFolderRequest): Promise<Folder | null> {
    // 순환 참조 검사
    if (folderData.parentId) {
        const hasCircularReference = await checkCircularReference(id, folderData.parentId);
        if (hasCircularReference) {
            throw new Error('순환 참조가 감지되었습니다.');
        }
    }
    
    return await folderRepository.updateFolder(id, folderData);
}

export async function deleteFolder(id: number): Promise<boolean> {
    // 하위 폴더와 테스트케이스 모두 삭제
    const children = await getFolderDescendants(id);
    for (const child of children) {
        await folderRepository.deleteFolder(child.id);
    }
    
    // 해당 폴더의 테스트케이스들도 삭제
    const testCases = await testCaseRepository.getTestCasesByFolderId(id);
    for (const testCase of testCases) {
        await testCaseRepository.deleteTestCase(testCase.id);
    }
    
    return await folderRepository.deleteFolder(id);
}

export async function listFolders(): Promise<Folder[]> {
    return await folderRepository.listFolders();
}

export async function getFolderTree(): Promise<FolderTree[]> {
    const folders = await listFolders();
    return buildFolderTree(folders);
}

// 고급 기능들
export async function moveFolder(folderId: number, moveData: MoveFolderRequest): Promise<Folder | null> {
    const { targetParentId, updatedBy } = moveData;
    
    // 순환 참조 검사
    if (targetParentId) {
        const hasCircularReference = await checkCircularReference(folderId, targetParentId);
        if (hasCircularReference) {
            throw new Error('상위 폴더를 하위로 이동할 수 없습니다.');
        }
    }
    
    // 권한 검사
    const folder = await getFolderById(folderId);
    if (!folder) {
        throw new Error('폴더를 찾을 수 없습니다.');
    }
    
    return await folderRepository.updateFolder(folderId, {
        parentId: targetParentId,
        updatedBy
    });
}

export async function addTestCaseToFolder(testCaseId: number, folderId: number): Promise<boolean> {
    const folder = await getFolderById(folderId);
    if (!folder) {
        throw new Error('폴더를 찾을 수 없습니다.');
    }
    
    // 폴더 존재 여부만 확인
    
    const result = await testCaseRepository.updateTestCase(testCaseId, { folderId });
    return result !== null;
}

// 드래그 앤 드롭 검증
export async function validateDropZone(draggedNodeId: number, targetNodeId: number, dropZone: string): Promise<boolean> {
    // 자기 자신에 드롭하는 경우
    if (draggedNodeId === targetNodeId) {
        return false;
    }
    
    // 순환 참조 검사
    if (dropZone === 'inside') {
        const hasCircularReference = await checkCircularReference(draggedNodeId, targetNodeId);
        if (hasCircularReference) {
            return false;
        }
    }
    
    // 권한 검사
    const draggedFolder = await getFolderById(draggedNodeId);
    const targetFolder = await getFolderById(targetNodeId);
    
    // 권한 검사는 나중에 구현
    
    return true;
}

// 드래그 앤 드롭 처리
export async function handleFolderDragDrop(dragDropRequest: {
    draggedNodeId: number;
    targetNodeId: number;
    dropType: 'before' | 'after' | 'inside';
    position?: number;
}): Promise<Folder | null> {
    const { draggedNodeId, targetNodeId, dropType } = dragDropRequest;
    
    // 유효성 검사
    const isValid = await validateDropZone(draggedNodeId, targetNodeId, dropType);
    if (!isValid) {
        throw new Error('유효하지 않은 드롭 영역입니다.');
    }
    
    const draggedFolder = await getFolderById(draggedNodeId);
    const targetFolder = await getFolderById(targetNodeId);
    
    if (!draggedFolder || !targetFolder) {
        throw new Error('폴더를 찾을 수 없습니다.');
    }
    
    let newParentId: number | undefined;
    let newSortOrder: number | undefined;
    
    switch (dropType) {
        case 'inside':
            newParentId = targetNodeId;
            break;
        case 'before':
        case 'after':
            newParentId = targetFolder.parentId;
            // 정렬 순서 조정 로직 (실제로는 더 복잡한 로직 필요)
            newSortOrder = dropType === 'before' ? (targetFolder.sortOrder || 0) - 1 : (targetFolder.sortOrder || 0) + 1;
            break;
    }
    
    return await folderRepository.updateFolder(draggedNodeId, {
        parentId: newParentId,
        sortOrder: newSortOrder,
        updatedBy: 'system'
    });
}

// 일괄 작업 기능
export async function bulkMoveFolders(folderIds: number[], targetParentId: number): Promise<boolean> {
    for (const folderId of folderIds) {
        await moveFolder(folderId, { targetParentId, updatedBy: 'system' });
    }
    return true;
}

export async function bulkDeleteFolders(folderIds: number[]): Promise<boolean> {
    for (const folderId of folderIds) {
        await deleteFolder(folderId);
    }
    return true;
}

// 권한 관리
export async function updateFolderPermissions(folderId: number, permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
    manage: boolean;
}): Promise<Folder | null> {
    // 권한 업데이트는 나중에 구현
    return await getFolderById(folderId);
}

// 검색 기능
export async function searchFolders(query: string): Promise<Folder[]> {
    const allFolders = await listFolders();
    return allFolders.filter(folder => 
        folder.name.toLowerCase().includes(query.toLowerCase()) ||
        folder.description?.toLowerCase().includes(query.toLowerCase())
    );
}

// 폴더 통계
export async function getFolderStats(folderId: number): Promise<{
    totalTestCases: number;
    totalSubFolders: number;
    depth: number;
}> {
    const descendants = await getFolderDescendants(folderId);
    const testCases = await testCaseRepository.getTestCasesByFolderId(folderId);
    
    return {
        totalTestCases: testCases.length,
        totalSubFolders: descendants.length,
        depth: await getFolderDepth(folderId)
    };
}

// 헬퍼 함수들
function buildFolderTree(folders: Folder[]): FolderTree[] {
    const folderMap = new Map<number, FolderTree>();
    const rootFolders: FolderTree[] = [];
    
    // 모든 폴더를 맵에 추가
    folders.forEach(folder => {
        folderMap.set(folder.id, {
            id: folder.id,
            name: folder.name,
            parentId: folder.parentId,
            children: [],
            sortOrder: folder.sortOrder,
            createdBy: folder.createdBy,
            createdAt: folder.createdAt,
            updatedAt: folder.updatedAt
        });
    });
    
    // 트리 구조 생성
    folders.forEach(folder => {
        const folderTree = folderMap.get(folder.id)!;
        
        if (folder.parentId) {
            const parent = folderMap.get(folder.parentId);
            if (parent) {
                parent.children!.push(folderTree);
            }
        } else {
            rootFolders.push(folderTree);
        }
    });
    
    return rootFolders;
}

async function checkCircularReference(sourceId: number, targetId: number): Promise<boolean> {
    if (sourceId === targetId) {
        return true;
    }
    
    const target = await getFolderById(targetId);
    if (!target || !target.parentId) {
        return false;
    }
    
    return await checkCircularReference(sourceId, target.parentId);
}

async function getFolderDescendants(folderId: number): Promise<Folder[]> {
    const allFolders = await listFolders();
    const descendants: Folder[] = [];
    
    function findDescendants(parentId: number) {
        const children = allFolders.filter(f => f.parentId === parentId);
        descendants.push(...children);
        children.forEach(child => findDescendants(child.id));
    }
    
    findDescendants(folderId);
    return descendants;
}

async function getFolderDepth(folderId: number): Promise<number> {
    const folder = await getFolderById(folderId);
    if (!folder || !folder.parentId) {
        return 0;
    }
    
    return 1 + await getFolderDepth(folder.parentId);
}

async function isDescendant(parentId: number, childId: number): Promise<boolean> {
    const child = await getFolderById(childId);
    if (!child || !child.parentId) {
        return false;
    }
    
    if (child.parentId === parentId) {
        return true;
    }
    
    return await isDescendant(parentId, child.parentId);
} 