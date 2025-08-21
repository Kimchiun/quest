import { Router } from 'express';
import passport from '../../../infrastructure/security/passport';
import jwt from 'jsonwebtoken';
import { createUser, findUserByUsername } from '../services/userService';
import { UserRole } from '../types';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 사용자 ID
 *         username:
 *           type: string
 *           description: 사용자명 (이메일)
 *         role:
 *           type: string
 *           enum: [ADMIN, QA, DEV, PM]
 *           description: 사용자 역할
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: 사용자 이메일
 *         password:
 *           type: string
 *           description: 비밀번호
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT 토큰
 *         user:
 *           $ref: '#/components/schemas/User'
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - role
 *       properties:
 *         username:
 *           type: string
 *           description: 사용자명 (이메일)
 *         password:
 *           type: string
 *           description: 비밀번호
 *         role:
 *           type: string
 *           enum: [ADMIN, QA, DEV, PM]
 *           description: 사용자 역할
 */

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// 개발 환경에서는 24시간, 프로덕션에서는 1시간
const JWT_EXPIRES_IN = process.env.NODE_ENV === 'production' ? '1h' : '24h';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 사용자 등록
 *     description: 새로운 사용자를 등록합니다.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: 사용자 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       409:
 *         description: 사용자명 중복
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
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

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 사용자 로그인
 *     description: 사용자 인증 후 JWT 토큰을 반환합니다.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
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