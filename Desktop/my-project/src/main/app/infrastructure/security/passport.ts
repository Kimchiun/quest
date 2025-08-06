import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// import { Strategy as SamlStrategy } from 'passport-saml'; // 템플릿
// import { Strategy as OAuth2Strategy } from 'passport-oauth2'; // 템플릿
import { createUser, findUserByUsername, validatePassword } from '../../domains/users/services/userService';
import { User } from '../../domains/users/types';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await findUserByUsername(username);
            if (!user) return done(null, false, { message: '사용자를 찾을 수 없음' });
            const valid = await validatePassword(user, password);
            if (!valid) return done(null, false, { message: '비밀번호 불일치' });
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET,
        },
        async (payload, done) => {
            try {
                const user = await findUserByUsername(payload.username);
                if (!user) return done(null, false);
                return done(null, user);
            } catch (err) {
                return done(err, false);
            }
        }
    )
);

// SAML, OAuth2 전략 템플릿 (구현 필요)
// passport.use(new SamlStrategy({ ... }, verifyFn));
// passport.use(new OAuth2Strategy({ ... }, verifyFn));

export default passport; 