// Jest global teardown
module.exports = async () => {
  // 테스트 실행 후 글로벌 정리
  console.log('Jest global teardown running...');
  
  // 모킹 정리 (jest가 정의되지 않을 수 있으므로 조건부로 실행)
  if (typeof jest !== 'undefined') {
    jest.clearAllMocks();
    jest.clearAllTimers();
  }
  
  console.log('Jest global teardown completed');
}; 