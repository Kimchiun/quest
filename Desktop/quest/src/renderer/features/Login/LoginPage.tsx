import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import api from '../../utils/axios';
import { setMe } from '../../store';

// 토스트 알림 스타일 컴포넌트
const Toast = styled.div<{ show: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  background: #dc2626;
  color: white;
  padding: 12px 20px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  transform: translateX(${props => props.show ? '0' : '120%'});
  opacity: ${props => props.show ? '1' : '0'};
  transition: all 0.3s ease-in-out;
  font-size: 14px;
  font-weight: 500;
  pointer-events: ${props => props.show ? 'auto' : 'none'};
`;

// Styled Components
const Container = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  font-family: 'Inter', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    height: 100vh;
    width: 300vw;
    transform: translate(35%, 0);
    background-image: linear-gradient(-45deg, #3b82f6 0%, #2563eb 100%);
    transition: 1s ease-in-out;
    z-index: 6;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border-bottom-right-radius: max(50vw, 50vh);
    border-top-left-radius: max(50vw, 50vh);
  }

  &.sign-in::before {
    transform: translate(0, 0);
    right: 50%;
  }

  &.sign-up::before {
    transform: translate(100%, 0);
    right: 50%;
  }

  @media only screen and (max-width: 425px) {
    &::before,
    &.sign-in::before,
    &.sign-up::before {
      height: 100vh;
      border-bottom-right-radius: 0;
      border-top-left-radius: 0;
      z-index: 0;
      transform: none;
      right: 0;
    }
  }
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100vh;

  @media only screen and (max-width: 425px) {
    align-items: flex-end;
    justify-content: flex-end;
  }
`;

const Col = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;

  @media only screen and (max-width: 425px) {
    width: 100%;
    position: absolute;
    padding: 2rem;
    background-color: white;
    border-top-left-radius: 2rem;
    border-top-right-radius: 2rem;
    transform: translateY(100%);
    transition: 1s ease-in-out;

    &.sign-in,
    &.sign-up {
      transform: translateY(0);
    }
  }
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 28rem;
`;

const Form = styled.form`
  padding: 1rem;
  background-color: white;
  border-radius: 1.5rem;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  transform: scale(0);
  transition: 0.5s ease-in-out;
  transition-delay: 1s;

  .container.sign-in &.sign-in,
  .container.sign-up &.sign-up {
    transform: scale(1);
  }

  @media only screen and (max-width: 425px) {
    box-shadow: none;
    margin: 0;
    padding: 0;
  }
`;

const InputGroup = styled.div`
  position: relative;
  width: 100%;
  margin: 1rem 0;

  i {
    position: absolute;
    top: 50%;
    left: 1rem;
    transform: translateY(-50%);
    font-size: 1.4rem;
    color: #757575;
  }

  input {
    width: 100%;
    padding: 1rem 3rem;
    font-size: 1rem;
    background-color: #efefef;
    border-radius: 0.5rem;
    border: 0.125rem solid white;
    outline: none;
    transition: border-color 0.3s ease;

    &:focus {
      border: 0.125rem solid #3b82f6;
    }

    &::placeholder {
      color: #757575;
    }
  }
`;

const Button = styled.button`
  cursor: pointer;
  width: 100%;
  padding: 0.6rem 0;
  border-radius: 0.5rem;
  border: none;
  background-color: #3b82f6;
  color: white;
  font-size: 1.2rem;
  outline: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2563eb;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const FormText = styled.p`
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #757575;

  .pointer {
    cursor: pointer;
    color: #3b82f6;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ContentRow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 6;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  height: 100vh;

  @media only screen and (max-width: 425px) {
    align-items: flex-start !important;

    .col {
      transform: translateY(0);
      background-color: unset;
    }
  }
`;

const ContentCol = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
`;

const Text = styled.div`
  margin: 4rem;
  color: white;

  h2 {
    font-size: 3.5rem;
    font-weight: 800;
    margin: 2rem 0;
    transition: 1s ease-in-out;
  }

  p {
    font-weight: 600;
    transition: 1s ease-in-out;
    transition-delay: 0.2s;
  }

  &.sign-in h2,
  &.sign-in p {
    transform: translateX(-250%);
  }

  &.sign-up h2,
  &.sign-up p {
    transform: translateX(250%);
  }

  .container.sign-in &.sign-in h2,
  .container.sign-in &.sign-in p,
  .container.sign-up &.sign-up h2,
  .container.sign-up &.sign-up p {
    transform: translateX(0);
  }

  @media only screen and (max-width: 425px) {
    margin: 0;

    p {
      display: none;
    }

    h2 {
      margin: 0.5rem;
      font-size: 2rem;
    }
  }
`;

const LoginPage: React.FC<{ onLogin?: (values: any) => void }> = ({ onLogin }) => {
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    confirmPassword: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // 초기 애니메이션 설정
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.classList.add('sign-in');
      }
    }, 200);
  }, []);

  const toggle = () => {
    if (containerRef.current) {
      containerRef.current.classList.toggle('sign-in');
      containerRef.current.classList.toggle('sign-up');
    }
    setIsSignUp(!isSignUp);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('🔐 로그인 시도:', formData.username);
      
      const res = await api.post('/api/auth/login', {
        username: formData.username,
        password: formData.password
      });
      const user = res.data.user || res.data;
      
      if (user && user.role) {
        console.log('✅ 로그인 성공:', user);
        dispatch(setMe(user));
        
        if (onLogin) {
          onLogin(user);
        }
              } else {
          console.error('❌ 로그인 실패: 사용자 정보 없음');
          setToastMessage('로그인 실패: 사용자 정보 없음');
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
            setTimeout(() => setToastMessage(''), 300);
          }, 3000);
        }
          } catch (e: any) {
        console.error('❌ 로그인 실패:', e);
        const errorMessage = e?.response?.data?.message || e.message || '알 수 없는 오류';
        setToastMessage('로그인 실패: ' + errorMessage);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          setTimeout(() => setToastMessage(''), 300);
        }, 3000);
      }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
          if (formData.password !== formData.confirmPassword) {
        setToastMessage('비밀번호가 일치하지 않습니다.');
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          setTimeout(() => setToastMessage(''), 300);
        }, 3000);
        return;
      }
    
          try {
        console.log('📝 회원가입 시도:', formData.username);
        // TODO: 회원가입 API 구현
        setToastMessage('회원가입 기능은 준비 중입니다.');
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          setTimeout(() => setToastMessage(''), 300);
        }, 3000);
      } catch (e: any) {
        console.error('❌ 회원가입 실패:', e);
        setToastMessage('회원가입 실패: ' + e.message);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          setTimeout(() => setToastMessage(''), 300);
        }, 3000);
      }
  };
  
  return (
    <Container ref={containerRef} className="container">
      <Row>
        {/* SIGN UP */}
        <Col className="sign-up">
          <FormWrapper>
            <Form className="sign-up" onSubmit={handleSignUp}>
              <InputGroup>
                <i className='bx bxs-user'></i>
                <input 
                  type="text" 
                  name="username"
                  placeholder="사용자명" 
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </InputGroup>
              <InputGroup>
                <i className='bx bx-mail-send'></i>
                <input 
                  type="email" 
                  name="email"
                  placeholder="이메일" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </InputGroup>
              <InputGroup>
                <i className='bx bxs-lock-alt'></i>
                <input 
                  type="password" 
                  name="password"
                  placeholder="비밀번호" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </InputGroup>
              <InputGroup>
                <i className='bx bxs-lock-alt'></i>
                <input 
                  type="password" 
                  name="confirmPassword"
                  placeholder="비밀번호 확인" 
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </InputGroup>
              <Button type="submit">
                회원가입
              </Button>
              <FormText>
                <span>이미 계정이 있으신가요?</span>{' '}
                <span className="pointer" onClick={toggle}>
                  로그인하기
                </span>
              </FormText>
            </Form>
          </FormWrapper>
        </Col>

        {/* SIGN IN */}
        <Col className="sign-in">
          <FormWrapper>
            <Form className="sign-in" onSubmit={handleLogin}>
              <InputGroup>
                <i className='bx bxs-user'></i>
                <input 
                  type="text" 
                  name="username"
                  placeholder="사용자명 또는 이메일" 
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </InputGroup>
              <InputGroup>
                <i className='bx bxs-lock-alt'></i>
                <input 
                  type="password" 
                  name="password"
                  placeholder="비밀번호" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </InputGroup>
              <Button type="submit">
                로그인
              </Button>
              <FormText>
                <span className="pointer">
                  비밀번호를 잊으셨나요?
                </span>
              </FormText>
              <FormText>
                <span>계정이 없으신가요?</span>{' '}
                <span className="pointer" onClick={toggle}>
                  회원가입하기
                </span>
              </FormText>
              <FormText style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '2rem' }}>
            개발 환경 테스트 계정: admin@test.com / password123
              </FormText>
            </Form>
          </FormWrapper>
        </Col>
      </Row>

      {/* CONTENT SECTION */}
      <ContentRow className="content-row">
        {/* SIGN IN CONTENT */}
        <ContentCol>
          <Text className="sign-in">
            <h2>Quest에 오신 것을 환영합니다</h2>
            <p>테스트 관리의 새로운 경험을 시작하세요</p>
          </Text>
        </ContentCol>

        {/* SIGN UP CONTENT */}
        <ContentCol>
          <Text className="sign-up">
            <h2>Quest와 함께하세요</h2>
            <p>효율적인 테스트 관리를 경험해보세요</p>
          </Text>
        </ContentCol>
      </ContentRow>
      <Toast show={showToast}>{toastMessage}</Toast>
      </Container>
  );
};

export default LoginPage; 