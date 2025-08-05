import { http, HttpResponse } from 'msw';

const baseURL = 'http://localhost:3000';

// 기존 사용자 인터페이스
interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

// Qase 기반 폴더 및 테스트 케이스 데이터 구조
interface Folder {
  id: number;
  name: string;
  parentId: number | null;
  level: number;
  children: Folder[];
  testCases: TestCase[];
  isExpanded?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TestCase {
  id: number;
  name: string;
  folderId: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 기존 사용자 데이터
const mockUsers: User[] = [
  {
    id: 1,
    email: 'admin@test.com',
    name: '관리자',
    role: 'admin'
  }
];

// 초기 데이터 (Qase 스타일)
let folders: Folder[] = [
  {
    id: 1,
    name: "기능 테스트",
    parentId: null,
    level: 0,
    children: [
      {
        id: 2,
        name: "인증 테스트",
        parentId: 1,
        level: 1,
        children: [],
        testCases: [
          {
            id: 1,
            name: "로그인 테스트",
            folderId: 2,
            description: "사용자 로그인 기능 테스트",
            createdAt: new Date("2024-01-05T00:00:00.000Z"),
            updatedAt: new Date("2024-01-05T00:00:00.000Z")
          }
        ],
        createdAt: new Date("2024-01-02T00:00:00.000Z"),
        updatedAt: new Date("2024-01-02T00:00:00.000Z")
      },
      {
        id: 3,
        name: "UI 테스트",
        parentId: 1,
        level: 1,
        children: [],
        testCases: [],
        createdAt: new Date("2024-01-03T00:00:00.000Z"),
        updatedAt: new Date("2024-01-03T00:00:00.000Z")
      }
    ],
    testCases: [],
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z")
  },
  {
    id: 4,
    name: "성능 테스트",
    parentId: null,
    level: 0,
    children: [],
    testCases: [],
    createdAt: new Date("2024-01-04T00:00:00.000Z"),
    updatedAt: new Date("2024-01-04T00:00:00.000Z")
  }
];

let testCases: TestCase[] = [
  {
    id: 1,
    name: "로그인 테스트",
    folderId: 2,
    description: "사용자 로그인 기능 테스트",
    createdAt: new Date("2024-01-05T00:00:00.000Z"),
    updatedAt: new Date("2024-01-05T00:00:00.000Z")
  }
];

// 유틸리티 함수들
const generateUniqueId = (items: any[], idField: string = 'id'): number => {
  const ids = items.map(item => item[idField]);
  return Math.max(...ids, 0) + 1;
};

const findFolderById = (folderList: Folder[], id: number): Folder | null => {
  for (const folder of folderList) {
    if (folder.id === id) return folder;
    const found = findFolderById(folder.children, id);
    if (found) return found;
  }
  return null;
};

const findParentFolder = (folderList: Folder[], childId: number): Folder | null => {
  for (const folder of folderList) {
    if (folder.children.some(child => child.id === childId)) {
      return folder;
    }
    const found = findParentFolder(folder.children, childId);
    if (found) return found;
  }
  return null;
};

const removeFolderFromParent = (folderList: Folder[], folderId: number): Folder[] => {
  return folderList.map(folder => ({
    ...folder,
    children: folder.children.filter(child => child.id !== folderId)
  })).filter(folder => folder.id !== folderId);
};

const addFolderToParent = (folderList: Folder[], folder: Folder, parentId: number | null): Folder[] => {
  if (parentId === null) {
    return [...folderList, folder];
  }
  
  return folderList.map(f => {
    if (f.id === parentId) {
      return {
        ...f,
        children: [...f.children, folder]
      };
    }
    return {
      ...f,
      children: addFolderToParent(f.children, folder, parentId)
    };
  });
};

const generateFolderName = (baseName: string, existingNames: string[]): string => {
  let name = baseName;
  let counter = 1;
  
  while (existingNames.includes(name)) {
    name = `${baseName} (${counter})`;
    counter++;
  }
  
  return name;
};

// MSW 핸들러들
export const handlers = [
  // === 기존 인증 핸들러들 ===
  
  // 로그인
  http.post(`${baseURL}/api/auth/login`, async ({ request }) => {
    const { email, password } = await request.json();
    console.log('MSW: 로그인 요청:', { email, password });

    // 간단한 인증 로직 (개발용)
    if (email === 'admin@test.com' && password === 'password123') {
      const user = mockUsers.find(u => u.email === email);
      if (user) {
        console.log('MSW: 로그인 성공');
        return HttpResponse.json({
          success: true,
          user,
          token: 'mock-jwt-token'
        });
      }
    }

    console.log('MSW: 로그인 실패');
    return HttpResponse.json(
      { success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
      { status: 401 }
    );
  }),

  // 로그아웃
  http.post(`${baseURL}/api/auth/logout`, () => {
    console.log('MSW: 로그아웃 요청');
    return HttpResponse.json({ success: true });
  }),

  // 현재 사용자 정보
  http.get(`${baseURL}/api/auth/me`, () => {
    console.log('MSW: 현재 사용자 정보 요청');
    const user = mockUsers[0];
    return HttpResponse.json({ user });
  }),

  // === 기존 테스트 케이스 핸들러들 ===
  
  // 테스트 케이스 목록 조회
  http.get(`${baseURL}/api/testcases`, () => {
    console.log('MSW: 테스트 케이스 목록 조회');
    return HttpResponse.json([
      {
        id: 1,
        title: "로그인 테스트",
        description: "사용자 로그인 기능 테스트",
        priority: "High",
        status: "Active",
        folderId: 1
      }
    ]);
  }),

  // === 새로운 폴더 관리 핸들러들 ===
  
  // 폴더 목록 조회
  http.get(`${baseURL}/api/folders`, () => {
    console.log('MSW: 폴더 목록 조회');
    return HttpResponse.json(folders);
  }),

  // 폴더 생성
  http.post(`${baseURL}/api/folders`, async ({ request }) => {
    const { name, parentId } = await request.json();
    console.log('MSW: 폴더 생성 요청:', { name, parentId });

    // 같은 레벨의 폴더 이름들 수집
    const getSiblingNames = (parentId: number | null): string[] => {
      const siblings = parentId === null 
        ? folders.filter(f => f.parentId === null)
        : findFolderById(folders, parentId)?.children || [];
      return siblings.map(f => f.name);
    };

    const siblingNames = getSiblingNames(parentId);
    const finalName = generateFolderName(name || '새 폴더', siblingNames);
    
    const newFolder: Folder = {
      id: generateUniqueId([...folders, ...testCases]),
      name: finalName,
      parentId,
      level: parentId === null ? 0 : (findFolderById(folders, parentId)?.level || 0) + 1,
      children: [],
      testCases: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    folders = addFolderToParent(folders, newFolder, parentId);
    
    console.log('MSW: 폴더 생성 완료:', newFolder);
    return HttpResponse.json(newFolder, { status: 201 });
  }),

  // 폴더 이름 변경
  http.patch(`${baseURL}/api/folders/:id`, async ({ params, request }) => {
    const { id } = params;
    const { name } = await request.json();
    console.log('MSW: 폴더 이름 변경 요청:', { id, name });

    const folder = findFolderById(folders, Number(id));
    if (!folder) {
      return HttpResponse.json({ error: '폴더를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 같은 레벨의 폴더 이름들 수집
    const getSiblingNames = (parentId: number | null): string[] => {
      const siblings = parentId === null 
        ? folders.filter(f => f.parentId === null)
        : findFolderById(folders, parentId)?.children || [];
      return siblings.filter(f => f.id !== Number(id)).map(f => f.name);
    };

    const siblingNames = getSiblingNames(folder.parentId);
    const finalName = generateFolderName(name, siblingNames);

    // 폴더 이름 업데이트
    const updateFolderName = (folderList: Folder[], folderId: number, newName: string): Folder[] => {
      return folderList.map(folder => {
        if (folder.id === folderId) {
          return { ...folder, name: newName, updatedAt: new Date() };
        }
        return {
          ...folder,
          children: updateFolderName(folder.children, folderId, newName)
        };
      });
    };

    folders = updateFolderName(folders, Number(id), finalName);
    
    console.log('MSW: 폴더 이름 변경 완료:', { id, name: finalName });
    return HttpResponse.json({ id: Number(id), name: finalName });
  }),

  // 폴더 삭제
  http.delete(`${baseURL}/api/folders/:id`, ({ params }) => {
    const { id } = params;
    console.log('MSW: 폴더 삭제 요청:', id);

    const folder = findFolderById(folders, Number(id));
    if (!folder) {
      return HttpResponse.json({ error: '폴더를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 폴더와 하위 모든 항목 삭제
    const removeFolderAndChildren = (folderList: Folder[], folderId: number): Folder[] => {
      return folderList.filter(folder => {
        if (folder.id === folderId) {
          return false; // 삭제
        }
        // 하위 폴더들도 재귀적으로 삭제
        folder.children = removeFolderAndChildren(folder.children, folderId);
        return true;
      });
    };

    folders = removeFolderAndChildren(folders, Number(id));
    
    console.log('MSW: 폴더 삭제 완료:', id);
    return HttpResponse.json({ success: true });
  }),

  // 폴더 이동
  http.patch(`${baseURL}/api/folders/:id/move`, async ({ params, request }) => {
    const { id } = params;
    const { newParentId } = await request.json();
    console.log('MSW: 폴더 이동 요청:', { id, newParentId });

    const folder = findFolderById(folders, Number(id));
    if (!folder) {
      return HttpResponse.json({ error: '폴더를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 자기 자신이나 하위 폴더로는 이동 불가
    if (newParentId === Number(id)) {
      return HttpResponse.json({ error: '자기 자신을 부모로 설정할 수 없습니다.' }, { status: 400 });
    }

    if (newParentId !== null) {
      const targetFolder = findFolderById(folders, newParentId);
      if (!targetFolder) {
        return HttpResponse.json({ error: '대상 폴더를 찾을 수 없습니다.' }, { status: 404 });
      }

      // 순환 참조 검사
      const isChild = (parentId: number, childId: number): boolean => {
        const parent = findFolderById(folders, parentId);
        if (!parent) return false;
        if (parent.children.some(child => child.id === childId)) return true;
        return parent.children.some(child => isChild(child.id, childId));
      };

      if (isChild(Number(id), newParentId)) {
        return HttpResponse.json({ error: '순환 참조가 발생할 수 없습니다.' }, { status: 400 });
      }
    }

    // 폴더 이동
    const moveFolder = (folderList: Folder[], folderId: number, newParentId: number | null): Folder[] => {
      // 기존 위치에서 제거
      const withoutFolder = removeFolderFromParent(folderList, folderId);
      
      // 새 위치에 추가
      const folderToMove = findFolderById(folders, folderId);
      if (!folderToMove) return folderList;

      const updatedFolder = {
        ...folderToMove,
        parentId: newParentId,
        level: newParentId === null ? 0 : (findFolderById(withoutFolder, newParentId)?.level || 0) + 1,
        updatedAt: new Date()
      };

      return addFolderToParent(withoutFolder, updatedFolder, newParentId);
    };

    folders = moveFolder(folders, Number(id), newParentId);
    
    console.log('MSW: 폴더 이동 완료:', { id, newParentId });
    return HttpResponse.json({ success: true });
  }),

  // 테스트 케이스 생성
  http.post(`${baseURL}/api/testcases`, async ({ request }) => {
    const { name, folderId, description } = await request.json();
    console.log('MSW: 테스트 케이스 생성 요청:', { name, folderId, description });

    const folder = findFolderById(folders, folderId);
    if (!folder) {
      return HttpResponse.json({ error: '폴더를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 같은 폴더 내 테스트 케이스 이름들 수집
    const existingNames = folder.testCases.map(tc => tc.name);
    const finalName = generateFolderName(name || '새 테스트 케이스', existingNames);

    const newTestCase: TestCase = {
      id: generateUniqueId([...folders, ...testCases]),
      name: finalName,
      folderId,
      description: description || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    testCases.push(newTestCase);
    
    // 폴더의 testCases 배열에도 추가
    const addTestCaseToFolder = (folderList: Folder[], folderId: number, testCase: TestCase): Folder[] => {
      return folderList.map(folder => {
        if (folder.id === folderId) {
          return {
            ...folder,
            testCases: [...folder.testCases, testCase]
          };
        }
        return {
          ...folder,
          children: addTestCaseToFolder(folder.children, folderId, testCase)
        };
      });
    };

    folders = addTestCaseToFolder(folders, folderId, newTestCase);
    
    console.log('MSW: 테스트 케이스 생성 완료:', newTestCase);
    return HttpResponse.json(newTestCase, { status: 201 });
  }),

  // 테스트 케이스 이름 변경
  http.patch(`${baseURL}/api/testcases/:id`, async ({ params, request }) => {
    const { id } = params;
    const { name } = await request.json();
    console.log('MSW: 테스트 케이스 이름 변경 요청:', { id, name });

    const testCase = testCases.find(tc => tc.id === Number(id));
    if (!testCase) {
      return HttpResponse.json({ error: '테스트 케이스를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 같은 폴더 내 테스트 케이스 이름들 수집
    const folder = findFolderById(folders, testCase.folderId);
    if (!folder) {
      return HttpResponse.json({ error: '폴더를 찾을 수 없습니다.' }, { status: 404 });
    }

    const existingNames = folder.testCases.filter(tc => tc.id !== Number(id)).map(tc => tc.name);
    const finalName = generateFolderName(name, existingNames);

    // 테스트 케이스 이름 업데이트
    testCases = testCases.map(tc => 
      tc.id === Number(id) 
        ? { ...tc, name: finalName, updatedAt: new Date() }
        : tc
    );

    // 폴더의 testCases 배열도 업데이트
    const updateTestCaseInFolder = (folderList: Folder[], testCaseId: number, newName: string): Folder[] => {
      return folderList.map(folder => ({
        ...folder,
        testCases: folder.testCases.map(tc => 
          tc.id === testCaseId 
            ? { ...tc, name: newName, updatedAt: new Date() }
            : tc
        ),
        children: updateTestCaseInFolder(folder.children, testCaseId, newName)
      }));
    };

    folders = updateTestCaseInFolder(folders, Number(id), finalName);
    
    console.log('MSW: 테스트 케이스 이름 변경 완료:', { id, name: finalName });
    return HttpResponse.json({ id: Number(id), name: finalName });
  }),

  // 테스트 케이스 삭제
  http.delete(`${baseURL}/api/testcases/:id`, ({ params }) => {
    const { id } = params;
    console.log('MSW: 테스트 케이스 삭제 요청:', id);

    const testCase = testCases.find(tc => tc.id === Number(id));
    if (!testCase) {
      return HttpResponse.json({ error: '테스트 케이스를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 테스트 케이스 삭제
    testCases = testCases.filter(tc => tc.id !== Number(id));

    // 폴더의 testCases 배열에서도 삭제
    const removeTestCaseFromFolder = (folderList: Folder[], testCaseId: number): Folder[] => {
      return folderList.map(folder => ({
        ...folder,
        testCases: folder.testCases.filter(tc => tc.id !== testCaseId),
        children: removeTestCaseFromFolder(folder.children, testCaseId)
      }));
    };

    folders = removeTestCaseFromFolder(folders, Number(id));
    
    console.log('MSW: 테스트 케이스 삭제 완료:', id);
    return HttpResponse.json({ success: true });
  }),

  // 테스트 케이스 이동
  http.patch(`${baseURL}/api/testcases/:id/move`, async ({ params, request }) => {
    const { id } = params;
    const { newFolderId } = await request.json();
    console.log('MSW: 테스트 케이스 이동 요청:', { id, newFolderId });

    const testCase = testCases.find(tc => tc.id === Number(id));
    if (!testCase) {
      return HttpResponse.json({ error: '테스트 케이스를 찾을 수 없습니다.' }, { status: 404 });
    }

    const targetFolder = findFolderById(folders, newFolderId);
    if (!targetFolder) {
      return HttpResponse.json({ error: '대상 폴더를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 테스트 케이스 이동
    testCases = testCases.map(tc => 
      tc.id === Number(id) 
        ? { ...tc, folderId: newFolderId, updatedAt: new Date() }
        : tc
    );

    // 폴더 구조 업데이트
    const moveTestCaseInFolders = (folderList: Folder[], testCaseId: number, newFolderId: number): Folder[] => {
      return folderList.map(folder => {
        let updatedFolder = { ...folder };
        
        // 현재 폴더에서 테스트 케이스 제거
        if (folder.testCases.some(tc => tc.id === testCaseId)) {
          updatedFolder = {
            ...updatedFolder,
            testCases: folder.testCases.filter(tc => tc.id !== testCaseId)
          };
        }
        
        // 새 폴더에 테스트 케이스 추가
        if (folder.id === newFolderId) {
          const testCase = testCases.find(tc => tc.id === testCaseId);
          if (testCase) {
            updatedFolder = {
              ...updatedFolder,
              testCases: [...folder.testCases, testCase]
            };
          }
        }
        
        return {
          ...updatedFolder,
          children: moveTestCaseInFolders(folder.children, testCaseId, newFolderId)
        };
      });
    };

    folders = moveTestCaseInFolders(folders, Number(id), newFolderId);
    
    console.log('MSW: 테스트 케이스 이동 완료:', { id, newFolderId });
    return HttpResponse.json({ success: true });
  }),

  // 폴더 접기/펼치기 상태 토글
  http.patch(`${baseURL}/api/folders/:id/toggle`, ({ params }) => {
    const { id } = params;
    console.log('MSW: 폴더 접기/펼치기 토글:', id);

    const toggleFolderExpansion = (folderList: Folder[], folderId: number): Folder[] => {
      return folderList.map(folder => {
        if (folder.id === Number(folderId)) {
          return { ...folder, isExpanded: !folder.isExpanded };
        }
        return {
          ...folder,
          children: toggleFolderExpansion(folder.children, folderId)
        };
      });
    };

    folders = toggleFolderExpansion(folders, Number(id));
    
    console.log('MSW: 폴더 접기/펼치기 토글 완료:', id);
    return HttpResponse.json({ success: true });
  })
]; 