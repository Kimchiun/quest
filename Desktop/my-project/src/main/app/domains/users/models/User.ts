export type UserRole = 'ADMIN' | 'QA' | 'DEV' | 'PM';

export interface User {
    id: number;
    username: string;
    password: string; // 해시
    role: UserRole;
    createdAt: Date;
} 