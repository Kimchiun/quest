import React from 'react';
import Container from '../../shared/components/Container';
import Form, { FormField } from '../../shared/components/Form';
import Button from '../../shared/components/Button';
import Typography from '../../shared/components/Typography';
import Icon from '../../shared/components/Icon';
import { useDispatch } from 'react-redux';
import api from '../../utils/axios';
import { setMe } from '../../store';

const fields: FormField[] = [
  { name: 'username', label: '아이디', type: 'text', required: true, placeholder: '아이디를 입력하세요' },
  { name: 'password', label: '비밀번호', type: 'password', required: true, placeholder: '비밀번호를 입력하세요' },
];

const LoginPage: React.FC<{ onLogin?: (values: any) => void }> = ({ onLogin }) => {
  const dispatch = useDispatch();
  
  const handleLogin = async (values: any) => {
    try {
      console.log('🔐 로그인 시도:', values.username);
      
      const res = await api.post('/api/auth/login', values);
      const user = res.data.user || res.data;
      
      if (user && user.role) {
        console.log('✅ 로그인 성공:', user);
        dispatch(setMe(user));
        
        if (onLogin) {
          onLogin(user);
        }
      } else {
        console.error('❌ 로그인 실패: 사용자 정보 없음');
        alert('로그인 실패: 사용자 정보 없음');
      }
    } catch (e: any) {
      console.error('❌ 로그인 실패:', e);
      const errorMessage = e?.response?.data?.message || e.message || '알 수 없는 오류';
      alert('로그인 실패: ' + errorMessage);
    }
  };
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <Container maxWidth="400px" padding="40px 32px" background="#fff" radius="md" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <Icon name="logo" size={48} />
          <Typography variant="h2" style={{ marginTop: 16, marginBottom: 8 }}>Quest 로그인</Typography>
          <Typography variant="body" style={{ color: '#6b7280' }}>
            테스트 관리 시스템에 오신 것을 환영합니다.
          </Typography>
        </div>
        <Form
          fields={fields}
          onSubmit={handleLogin}
          layout="vertical"
          variant="default"
          submitLabel="로그인"
        />
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Typography variant="caption" style={{ color: '#6b7280' }}>
            개발 환경 테스트 계정: admin@test.com / password123
          </Typography>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage; 