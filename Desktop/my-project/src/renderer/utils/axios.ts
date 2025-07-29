import axios from 'axios';

// 인증 토큰 가져오는 함수 (예시)
function getAuthToken() {
  return localStorage.getItem('accessToken');
}

// 로그아웃 처리 함수 (예시)
function handleLogout() {
  // 실제 구현: Redux dispatch(logout()), window.location = '/login', 등
  window.location.href = '/login';
}

// Toast/Notification dispatch 함수 (예시)
function showToast(message: string, type: 'error' | 'info' | 'success' = 'error') {
  // 실제 구현: Redux dispatch(pushNotification) 또는 Toast 라이브러리 사용
  // window.dispatchEvent(new CustomEvent('toast', { detail: { message, type } }));
  // 임시: alert
  alert(`[${type}] ${message}`);
}

const api = axios.create({
  baseURL: 'http://localhost:3000', // 백엔드 서버 주소/포트에 맞게 수정
  withCredentials: false,
});

// 재시도 로직 (최대 3회, exponential backoff)
api.interceptors.response.use(undefined, async (error) => {
  const config = error.config;
  if (!config || config.__retryCount >= 3) {
    // 3회 초과 시 에러 처리
    showToast(error?.response?.data?.message || error.message || '네트워크 오류', 'error');
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      handleLogout();
    }
    return Promise.reject(error);
  }
  config.__retryCount = (config.__retryCount || 0) + 1;
  // 네트워크 장애/타임아웃/5xx 등만 재시도
  if (!error.response || error.response.status >= 500) {
    const delay = Math.pow(2, config.__retryCount) * 200;
    await new Promise((res) => setTimeout(res, delay));
    return api(config);
  }
  // 401/403 등 인증 오류는 바로 로그아웃
  if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    showToast('인증이 만료되었습니다. 다시 로그인해 주세요.', 'error');
    handleLogout();
    return Promise.reject(error);
  }
  // 기타 에러
  showToast(error?.response?.data?.message || error.message || '요청 실패', 'error');
  return Promise.reject(error);
});

// 요청 인터셉터: 인증 토큰 자동 첨부
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api; 