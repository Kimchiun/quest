import { Folder, FolderTree } from '../models/Folder';
// import { pgClient } from '../../../infrastructure/database/pgClient';

// 임시 메모리 저장소 (실제로는 PostgreSQL 사용)
let folders: Folder[] = [
    {
        id: 1,
        projectId: 1,
        parentId: undefined,
        name: 'Prerequisites',
        description: 'Test Environment(환경 요건)',
        orderIndex: 100,
        depth: 0,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        isLocked: false,
        isArchived: false
    },
    {
        id: 2,
        projectId: 1,
        parentId: 1,
        name: 'Software & Versions',
        description: '소프트웨어/버전 매트릭스',
        orderIndex: 100,
        depth: 1,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        isLocked: false,
        isArchived: false
    },
    {
        id: 3,
        projectId: 1,
        parentId: 1,
        name: 'Hardware',
        description: '장비/디바이스 매트릭스',
        orderIndex: 200,
        depth: 1,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        isLocked: false,
        isArchived: false
    },
    {
        id: 4,
        projectId: 1,
        parentId: undefined,
        name: 'Installation',
        description: '설치/빌드/배포 체크(Setup)',
        orderIndex: 200,
        depth: 0,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        isLocked: false,
        isArchived: false
    },
    {
        id: 5,
        projectId: 1,
        parentId: undefined,
        name: 'Login & Account',
        description: '인증/세션/보안(AAA)',
        orderIndex: 300,
        depth: 0,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        isLocked: false,
        isArchived: false
    },
    {
        id: 6,
        projectId: 1,
        parentId: 5,
        name: 'Reset Password',
        description: '패스워드/2FA 플로우',
        orderIndex: 100,
        depth: 1,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        isLocked: false,
        isArchived: false
    }
];

let nextId = 7;

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