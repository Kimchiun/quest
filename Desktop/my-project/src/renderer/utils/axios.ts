import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Express 서버 주소/포트에 맞게 조정
});

export default api; 