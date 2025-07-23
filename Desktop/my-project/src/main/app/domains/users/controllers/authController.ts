import { Router } from 'express';
import passport from '@/main/app/infrastructure/security/passport';
import jwt from 'jsonwebtoken';
import { createUser, findUserByUsername } from '../services/userService';
import { UserRole } from '../models/User';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ message: '필수 입력값 누락' });
    }
    if (!['ADMIN', 'QA', 'DEV', 'PM'].includes(role)) {
        return res.status(400).json({ message: '유효하지 않은 역할' });
    }
    const existing = await findUserByUsername(username);
    if (existing) {
        return res.status(409).json({ message: '이미 존재하는 사용자명' });
    }
    const user = await createUser(username, password, role as UserRole);
    res.status(201).json({ id: user.id, username: user.username, role: user.role });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err: any, user: any, info: any) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info?.message || '인증 실패' });
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    })(req, res, next);
});

export default router; 