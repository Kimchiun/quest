export interface Comment {
  id: number;
  objectType: 'testcase' | 'execution' | 'defect';
  objectId: number;
  author: string;
  content: string;
  mentions: string[]; // 멘션된 사용자 ID 목록
  createdAt: Date;
  updatedAt: Date;
} 