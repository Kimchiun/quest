export type UserRole = 'admin' | 'qa' | 'dev' | 'pm';

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
} 