import { Folder, FolderTree } from '../models/Folder';
// import { pgClient } from '../../../infrastructure/database/pgClient';

// 임시 메모리 저장소 (실제로는 PostgreSQL 사용)
let folders: Folder[] = [];

let nextId = 1;

export async function createFolder(data: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>): Promise<Folder> {
    const folder: Folder = {
        ...data,
        id: nextId++,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    folders.push(folder);
    return folder;
}

export async function getFolderById(id: number): Promise<Folder | null> {
    return folders.find(f => f.id === id) || null;
}

export async function updateFolder(id: number, data: Partial<Folder> & { updatedBy?: string }): Promise<Folder | null> {
    const index = folders.findIndex(f => f.id === id);
    if (index === -1) return null;
    
    folders[index] = {
        ...folders[index],
        ...data,
        updatedAt: new Date()
    };
    
    return folders[index];
}

export async function deleteFolder(id: number, mode: 'soft' | 'hard' = 'soft', deletedBy: string): Promise<boolean> {
    if (mode === 'soft') {
        // 소프트 삭제 - 휴지통으로 이동
        const index = folders.findIndex(f => f.id === id);
        if (index === -1) return false;
        
        // 실제로는 휴지통 테이블에 저장
        folders.splice(index, 1);
        return true;
    } else {
        // 하드 삭제
        const index = folders.findIndex(f => f.id === id);
        if (index === -1) return false;
        
        folders.splice(index, 1);
        return true;
    }
}

export async function listFolders(params: {
    parentId?: number;
    projectId?: number;
} = {}): Promise<Folder[]> {
    let filtered = folders;
    
    if (params.parentId !== undefined) {
        filtered = filtered.filter(f => f.parentId === params.parentId);
    }
    
    if (params.projectId !== undefined) {
        filtered = filtered.filter(f => f.projectId === params.projectId);
    }
    
    return filtered.sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function getFolderTree(projectId: number, depth?: number): Promise<FolderTree[]> {
    const allFolders = await listFolders({ projectId });
    const folderMap = new Map<number, FolderTree>();
    const rootFolders: FolderTree[] = [];
    
    // 모든 폴더를 맵에 추가
    allFolders.forEach(folder => {
        if (depth === undefined || folder.depth <= depth) {
            folderMap.set(folder.id, {
                ...folder,
                children: [],
                testCaseCount: 0 // 실제로는 테스트케이스 수를 계산
            });
        }
    });
    
    // 트리 구조 생성
    allFolders.forEach(folder => {
        if (depth === undefined || folder.depth <= depth) {
            const folderTree = folderMap.get(folder.id)!;
            
            if (folder.parentId && folderMap.has(folder.parentId)) {
                const parent = folderMap.get(folder.parentId)!;
                parent.children!.push(folderTree);
            } else {
                rootFolders.push(folderTree);
            }
        }
    });
    
    return rootFolders.sort((a, b) => a.orderIndex - b.orderIndex);
} 