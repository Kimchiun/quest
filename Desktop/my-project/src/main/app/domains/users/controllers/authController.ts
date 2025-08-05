import { Router } from 'express';
import passport from '../../../infrastructure/security/passport';
import jwt from 'jsonwebtoken';
import { createUser, findUserByUsername } from '../services/userService';
import { UserRole } from '../models/User';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// 개발 환경에서는 24시간, 프로덕션에서는 1시간
const JWT_EXPIRES_IN = process.env.NODE_ENV === 'production' ? '1h' : '24h';

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
    console.log('🔐 로그인 요청 받음');
    console.log('📥 요청 본문:', req.body);
    console.log('📥 요청 헤더:', req.headers);
    
    passport.authenticate('local', { session: false }, (err: any, user: any, info: any) => {
        if (err) {
            console.log('❌ 인증 오류:', err);
            return next(err);
        }
        if (!user) {
            console.log('❌ 인증 실패:', info?.message || '사용자를 찾을 수 없음');
            return res.status(401).json({ message: info?.message || '인증 실패' });
        }
        
        console.log('✅ 인증 성공:', user.username);
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        const response = { token, user: { id: user.id, username: user.username, role: user.role } };
        console.log('📤 응답 데이터:', response);
        res.json(response);
    })(req, res, next);
});

export default router; 