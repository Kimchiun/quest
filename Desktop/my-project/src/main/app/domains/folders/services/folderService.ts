import * as folderRepository from '../repositories/folderRepository';
import { Folder, FolderTree, CreateFolderRequest, UpdateFolderRequest, MoveFolderRequest, MoveTestCaseRequest } from '../models/Folder';

export async function createFolder(request: CreateFolderRequest): Promise<Folder> {
    // 순환 참조 검사
    if (request.parentId) {
        const hasCircularReference = await folderRepository.checkCircularReference(0, request.parentId);
        if (hasCircularReference) {
            throw new Error('순환 참조가 감지되었습니다. 폴더를 이동할 수 없습니다.');
        }
    }
    
    return await folderRepository.createFolder({
        name: request.name,
        description: request.description,
        parentId: request.parentId,
        createdBy: request.createdBy
    });
}

export async function getFolderById(id: number): Promise<Folder | null> {
    return await folderRepository.getFolderById(id);
}

export async function getAllFolders(): Promise<Folder[]> {
    return await folderRepository.getAllFolders();
}

export async function getFolderTree(): Promise<FolderTree[]> {
    return await folderRepository.getFolderTree();
}

export async function updateFolder(id: number, request: UpdateFolderRequest): Promise<Folder | null> {
    const folder = await folderRepository.getFolderById(id);
    if (!folder) {
        throw new Error('폴더를 찾을 수 없습니다.');
    }
    
    // 순환 참조 검사 (parentId가 변경되는 경우)
    if (request.parentId !== undefined && request.parentId !== folder.parentId) {
        const hasCircularReference = await folderRepository.checkCircularReference(id, request.parentId);
        if (hasCircularReference) {
            throw new Error('순환 참조가 감지되었습니다. 폴더를 이동할 수 없습니다.');
        }
    }
    
    return await folderRepository.updateFolder(id, request);
}

export async function deleteFolder(id: number): Promise<boolean> {
    const folder = await folderRepository.getFolderById(id);
    if (!folder) {
        throw new Error('폴더를 찾을 수 없습니다.');
    }
    
    // 루트 폴더는 삭제 불가
    if (folder.name === 'Root') {
        throw new Error('루트 폴더는 삭제할 수 없습니다.');
    }
    
    return await folderRepository.deleteFolder(id);
}

export async function moveFolder(id: number, request: MoveFolderRequest): Promise<Folder | null> {
    const folder = await folderRepository.getFolderById(id);
    if (!folder) {
        throw new Error('폴더를 찾을 수 없습니다.');
    }
    
    // 순환 참조 검사
    if (request.targetParentId !== undefined) {
        const hasCircularReference = await folderRepository.checkCircularReference(id, request.targetParentId);
        if (hasCircularReference) {
            throw new Error('순환 참조가 감지되었습니다. 폴더를 이동할 수 없습니다.');
        }
    }
    
    return await folderRepository.updateFolder(id, {
        parentId: request.targetParentId
    });
}

export async function getTestCasesInFolder(folderId: number): Promise<number[]> {
    return await folderRepository.getTestCasesInFolder(folderId);
}

export async function addTestCaseToFolder(testCaseId: number, folderId: number): Promise<void> {
    await folderRepository.addTestCaseToFolder(testCaseId, folderId);
}

export async function removeTestCaseFromFolder(testCaseId: number, folderId: number): Promise<void> {
    await folderRepository.removeTestCaseFromFolder(testCaseId, folderId);
}

export async function moveTestCase(testCaseId: number, fromFolderId: number, toFolderId: number): Promise<void> {
    await folderRepository.moveTestCase(testCaseId, fromFolderId, toFolderId);
} 