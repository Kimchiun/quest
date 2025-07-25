import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // 백엔드 서버 주소/포트에 맞게 수정
  withCredentials: false,
});

export default api; 