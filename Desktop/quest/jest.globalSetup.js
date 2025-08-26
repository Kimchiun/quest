// Jest global setup
module.exports = async () => {
  // 테스트 실행 전 글로벌 설정
  console.log('Jest global setup running...');
  
  // 환경 변수 설정
  process.env.NODE_ENV = 'test';
  process.env.DB_HOST = 'localhost';
  process.env.DB_PORT = '5432';
  process.env.DB_NAME = 'itms_test';
  process.env.DB_USER = 'test_user';
  process.env.DB_PASSWORD = 'test_password';
  
  // Elasticsearch 설정
  process.env.ES_HOST = 'localhost';
  process.env.ES_PORT = '9200';
  
  console.log('Jest global setup completed');
}; 