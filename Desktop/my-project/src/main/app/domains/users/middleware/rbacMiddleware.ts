import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User';

export function requireRole(roles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({ message: '권한이 없습니다.' });
        }
        next();
    };
} 