import { Folder, FolderTree, FolderCreateRequest, FolderUpdateRequest, FolderMoveRequest } from '../models/Folder';
import { createFolder as createFolderRepo, getFolderById as getFolderByIdRepo, updateFolder as updateFolderRepo, deleteFolder as deleteFolderRepo, listFolders, getFolderTree as getFolderTreeRepo } from '../repositories/folderRepository';

// 간격법을 위한 유틸리티 함수
function calculateOrderIndex(prevIndex: number | null, nextIndex: number | null): number {
    if (prevIndex === null && nextIndex === null) return 100;
    if (prevIndex === null) return nextIndex! - 100;
    if (nextIndex === null) return prevIndex + 100;
    if (nextIndex - prevIndex > 1) return Math.floor((prevIndex + nextIndex) / 2);
    else return triggerReindex(prevIndex, nextIndex);
}

function triggerReindex(prevIndex: number, nextIndex: number): number {
    // 실제로는 서버에서 전체 재간격을 수행
    return Math.floor((prevIndex + nextIndex) / 2);
}

export async function createFolder(data: FolderCreateRequest, createdBy: string): Promise<Folder> {
    // 동일 부모 내 이름 중복 체크
    const siblings = await listFolders({ parentId: data.parentId, projectId: data.projectId });
    const duplicateName = siblings.find(f => f.name === data.name);
    if (duplicateName) {
        throw new Error(`폴더명 "${data.name}"이(가) 이미 존재합니다.`);
    }

    // orderIndex 계산
    const orderIndex = calculateOrderIndex(
        siblings.length > 0 ? siblings[siblings.length - 1].orderIndex : null,
        null
    );

    // depth 계산
    let depth = 0;
    if (data.parentId) {
        const parent = await getFolderByIdRepo(data.parentId);
        if (!parent) {
            throw new Error('부모 폴더를 찾을 수 없습니다.');
        }
        depth = parent.depth + 1;
        if (depth > 10) {
            throw new Error('폴더 깊이는 최대 10단계까지 가능합니다.');
        }
    }

    const folderData: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'> = {
        projectId: data.projectId,
        parentId: data.parentId,
        name: data.name,
        description: data.description,
        orderIndex,
        depth,
        createdBy,
        isLocked: false,
        isArchived: false
    };

    return await createFolderRepo(folderData);
}

export async function updateFolder(id: number, data: FolderUpdateRequest, updatedBy: string): Promise<Folder | null> {
    const existing = await getFolderByIdRepo(id);
    if (!existing) return null;

    // 이름 변경 시 중복 체크
    if (data.name && data.name !== existing.name) {
        const siblings = await listFolders({ 
            parentId: existing.parentId, 
            projectId: existing.projectId 
        });
        const duplicateName = siblings.find(f => f.id !== id && f.name === data.name);
        if (duplicateName) {
            throw new Error(`폴더명 "${data.name}"이(가) 이미 존재합니다.`);
        }
    }

    // 부모 변경 시 순환 참조 체크
    if (data.parentId !== undefined && data.parentId !== existing.parentId) {
        if (data.parentId === id) {
            throw new Error('자기 자신을 부모로 설정할 수 없습니다.');
        }
        
        // 하위 폴더로 이동하는지 체크
        const isDescendant = await checkIsDescendant(id, data.parentId);
        if (isDescendant) {
            throw new Error('하위 폴더로는 이동할 수 없습니다.');
        }
    }

    return await updateFolderRepo(id, { ...data, updatedBy });
}

export async function moveFolder(id: number, data: FolderMoveRequest, movedBy: string): Promise<Folder | null> {
    const folder = await getFolderByIdRepo(id);
    if (!folder) return null;

    // 순환 참조 체크
    if (data.targetParentId !== undefined) {
        if (data.targetParentId === id) {
            throw new Error('자기 자신을 부모로 설정할 수 없습니다.');
        }
        
        const isDescendant = await checkIsDescendant(id, data.targetParentId);
        if (isDescendant) {
            throw new Error('하위 폴더로는 이동할 수 없습니다.');
        }
    }

    // 드롭 타입에 따른 orderIndex 계산
    let orderIndex: number;
    const targetParentId = data.targetParentId !== undefined ? data.targetParentId : folder.parentId;
    const siblings = await listFolders({ parentId: targetParentId, projectId: folder.projectId });
    
    switch (data.dropType) {
        case 'before':
            if (data.relativeToId) {
                const relativeFolder = siblings.find(f => f.id === data.relativeToId);
                if (relativeFolder) {
                    orderIndex = calculateOrderIndex(null, relativeFolder.orderIndex);
                } else {
                    orderIndex = calculateOrderIndex(null, null);
                }
            } else {
                orderIndex = calculateOrderIndex(null, null);
            }
            break;
            
        case 'after':
            if (data.relativeToId) {
                const relativeFolder = siblings.find(f => f.id === data.relativeToId);
                if (relativeFolder) {
                    orderIndex = calculateOrderIndex(relativeFolder.orderIndex, null);
                } else {
                    orderIndex = calculateOrderIndex(null, null);
                }
            } else {
                orderIndex = calculateOrderIndex(null, null);
            }
            break;
            
        case 'into':
        default:
            // 자식으로 이동하는 경우 마지막 위치에 배치
            const maxOrderIndex = siblings.length > 0 ? Math.max(...siblings.map(f => f.orderIndex)) : 0;
            orderIndex = calculateOrderIndex(maxOrderIndex, null);
            break;
    }

    return await updateFolderRepo(id, { 
        parentId: data.targetParentId, 
        orderIndex,
        updatedBy: movedBy 
    });
}

export async function moveFolderBatch(items: Array<{
    id: string;
    targetParentId?: number;
    dropType: 'into' | 'before' | 'after';
    relativeToId?: number;
    orderIndex?: number;
}>, movedBy: string): Promise<{
    success: Array<{ id: string; folder: any }>;
    failed: Array<{ id: string; error: string; reason: string }>;
}> {
    const results = {
        success: [] as Array<{ id: string; folder: any }>,
        failed: [] as Array<{ id: string; error: string; reason: string }>
    };

    // 트랜잭션으로 배치 처리
    for (const item of items) {
        try {
            const folder = await moveFolder(parseInt(item.id), {
                targetParentId: item.targetParentId,
                dropType: item.dropType,
                relativeToId: item.relativeToId,
                orderIndex: item.orderIndex
            }, movedBy);
            
            if (folder) {
                results.success.push({ id: item.id, folder });
            } else {
                results.failed.push({ 
                    id: item.id, 
                    error: '폴더를 찾을 수 없습니다.',
                    reason: 'FOLDER_NOT_FOUND'
                });
            }
        } catch (error: any) {
            let reason = 'UNKNOWN_ERROR';
            if (error.message.includes('순환')) reason = 'CYCLIC_MOVE';
            else if (error.message.includes('권한')) reason = 'PERMISSION_DENIED';
            else if (error.message.includes('이름')) reason = 'NAME_CONFLICT';
            else if (error.message.includes('잠금')) reason = 'LOCKED';
            else if (error.message.includes('아카이브')) reason = 'ARCHIVED';
            
            results.failed.push({ 
                id: item.id, 
                error: error.message,
                reason
            });
        }
    }

    return results;
}

async function checkIsDescendant(folderId: number, targetParentId: number): Promise<boolean> {
    const children = await listFolders({ parentId: folderId });
    for (const child of children) {
        if (child.id === targetParentId) return true;
        if (await checkIsDescendant(child.id, targetParentId)) return true;
    }
    return false;
}

export async function deleteFolder(id: number, mode: 'soft' | 'hard' = 'soft', deletedBy: string): Promise<boolean> {
    const folder = await getFolderByIdRepo(id);
    if (!folder) return false;

    // 하위 폴더들을 재귀적으로 삭제
    const children = await listFolders({ parentId: id });
    for (const child of children) {
        await deleteFolder(child.id, mode, deletedBy);
    }

    return await deleteFolderRepo(id, mode, deletedBy);
}

export async function getFolderTree(projectId: number, depth?: number): Promise<FolderTree[]> {
    return await getFolderTreeRepo(projectId, depth);
}

export async function getFolderById(id: number): Promise<Folder | null> {
    return await getFolderByIdRepo(id);
}

export async function listFoldersByProject(projectId: number): Promise<Folder[]> {
    return await listFolders({ projectId });
} 